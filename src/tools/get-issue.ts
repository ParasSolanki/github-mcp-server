import { z } from "zod";
import { GITHUB_API_BASE_URL } from "../constants.js";
import { $githubJson } from "../utils/gh-fetch.ts";
import { err, ok } from "neverthrow";
import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { zodToJsonSchema } from "zod-to-json-schema";

export const getIssueInputSchema = z.object({
  owner: z.string().describe("The owner of the repository"),
  repo: z.string().describe("The repository name"),
  issue_number: z.number().describe("The issue number"),
});

export const GET_ISSUE_TOOL: Tool = {
  name: "get_issue",
  description: "Get an issue from a repository",
  inputSchema: zodToJsonSchema(getIssueInputSchema) as Tool["inputSchema"],
};

export type GetIssueInput = z.output<typeof getIssueInputSchema>;

export async function getIssue(input: GetIssueInput) {
  const url = new URL(
    `/repos/${input.owner}/${input.repo}/issues/${input.issue_number}`,
    GITHUB_API_BASE_URL,
  );

  const json = await $githubJson(url.toString());

  if (json.isErr()) return err(json.error);

  try {
    // const data = gitHubSearchResponseSchema.parse(json.value);
    return ok(json.value);
  } catch (error) {
    return err(
      new Error(`Failed to parse github get issue response: ${error}`),
    );
  }
}
