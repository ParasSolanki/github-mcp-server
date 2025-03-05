import { z } from "zod";
import { GITHUB_API_BASE_URL } from "../constants.js";
import { $githubJson } from "../utils/gh-fetch.ts";
import { err, ok } from "neverthrow";
import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { zodToJsonSchema } from "zod-to-json-schema";

export const getPullRequestInputSchema = z.object({
  owner: z.string().describe("The owner of the repository"),
  repo: z.string().describe("The repository name"),
  pull_request_number: z.number().describe("The pull request number"),
});

export const GET_PULL_REQUEST_TOOL: Tool = {
  name: "get_pull_request",
  description: "Get a pull request from a repository",
  inputSchema: zodToJsonSchema(
    getPullRequestInputSchema,
  ) as Tool["inputSchema"],
};

export type GetPullRequestInput = z.output<typeof getPullRequestInputSchema>;

export async function getPullRequest(input: GetPullRequestInput) {
  const url = new URL(
    `/repos/${input.owner}/${input.repo}/pulls/${input.pull_request_number}`,
    GITHUB_API_BASE_URL,
  );

  const json = await $githubJson(url.toString());

  if (json.isErr()) return err(json.error);

  try {
    return ok(json.value);
  } catch (error) {
    return err(
      new Error(`Failed to parse github get pull request response: ${error}`),
    );
  }
}
