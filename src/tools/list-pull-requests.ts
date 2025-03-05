import { z } from "zod";
import { GITHUB_API_BASE_URL } from "../constants.js";
import { $githubJson } from "../utils/gh-fetch.ts";
import { err, ok } from "neverthrow";
import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { zodToJsonSchema } from "zod-to-json-schema";

export const listPullRequestsInputSchema = z.object({
  owner: z.string().describe("The owner of the repository"),
  repo: z.string().describe("The repository name"),
});

export const LIST_PULL_REQUESTS_TOOL: Tool = {
  name: "list_pull_requests",
  description: "List pull requests from a repository",
  inputSchema: zodToJsonSchema(
    listPullRequestsInputSchema,
  ) as Tool["inputSchema"],
};

export type ListPullRequestsInput = z.output<
  typeof listPullRequestsInputSchema
>;

export async function listPullRequests(input: ListPullRequestsInput) {
  const url = new URL(
    `/repos/${input.owner}/${input.repo}/pulls`,
    GITHUB_API_BASE_URL,
  );

  const json = await $githubJson(url.toString());

  if (json.isErr()) return err(json.error);

  try {
    return ok(json.value);
  } catch (error) {
    return err(
      new Error(`Failed to parse github list pull requests response: ${error}`),
    );
  }
}
