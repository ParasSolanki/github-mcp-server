import { z } from "zod";
import { GITHUB_API_BASE_URL } from "../constants.js";
import { $githubJson } from "../utils/gh-fetch.ts";
import { err, ok } from "neverthrow";
import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { zodToJsonSchema } from "zod-to-json-schema";

export const listIssuesInputSchema = z.object({
  owner: z.string().describe("The owner of the repository"),
  repo: z.string().describe("The repository name"),
});

export const LIST_ISSUES_TOOL: Tool = {
  name: "list_issues",
  description: "List issues from a repository",
  inputSchema: zodToJsonSchema(listIssuesInputSchema) as Tool["inputSchema"],
};

export type ListIssuesInput = z.output<typeof listIssuesInputSchema>;

export async function listIssues(input: ListIssuesInput) {
  const url = new URL(
    `/repos/${input.owner}/${input.repo}/issues`,
    GITHUB_API_BASE_URL,
  );

  const json = await $githubJson(url.toString());

  if (json.isErr()) return err(json.error);

  try {
    return ok(json.value);
  } catch (error) {
    return err(
      new Error(`Failed to parse github list issues response: ${error}`),
    );
  }
}
