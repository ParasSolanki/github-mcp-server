import { z } from "zod";
import { GITHUB_API_BASE_URL } from "../constants.ts";
import { $githubJson } from "../utils/gh-fetch.ts";
import { err, ok } from "neverthrow";
import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { zodToJsonSchema } from "zod-to-json-schema";

// @see https://docs.github.com/en/rest/pulls/pulls#list-pull-requests list pull requests API docs

export const listRepositoriesPullRequestsInputSchema = z.object({
  owner: z.string().describe("The owner of the repository"),
  repo: z.string().describe("The repository name"),
  state: z
    .enum(["open", "closed", "all"])
    .describe("The state of the pull requests to list (default: open)"),
  page: z
    .number()
    .optional()
    .describe("The page number for pagination (default: 1)"),
  per_page: z
    .number()
    .optional()
    .describe("The number of results per page (default: 30, max: 100)."),
  sort: z
    .enum(["created", "updated", "popularity", "long-running"])
    .optional()
    .describe(
      "What to sort results by. popularity will sort by the number of comments. long-running will sort by date created and will limit the results to pull requests that have been open for more than a month and have had activity within the past month. (default: created)",
    ),
  direction: z
    .enum(["asc", "desc"])
    .optional()
    .describe(
      "The direction of the sort. Default: desc when sort is created or sort is not specified, otherwise asc",
    ),
  head: z
    .string()
    .optional()
    .describe(
      "Filter pulls by head user or head organization and branch name in the format of user:ref-name or organization:ref-name. For example: github:new-script-format or octocat:test-branch",
    ),
  base: z
    .string()
    .optional()
    .describe("Filter pulls by base branch name. Example: gh-pages."),
});

export const LIST_REPOSITORIES_PULL_REQUESTS_TOOL: Tool = {
  name: "list_repositories_pull_requests",
  description: "List pull requests from a repository",
  inputSchema: zodToJsonSchema(
    listRepositoriesPullRequestsInputSchema,
  ) as Tool["inputSchema"],
};

export type ListRepositoriesPullRequestsInput = z.output<
  typeof listRepositoriesPullRequestsInputSchema
>;

export async function listRepositoriesPullRequests(
  input: ListRepositoriesPullRequestsInput,
) {
  const url = new URL(
    `/repos/${input.owner}/${input.repo}/pulls`,
    GITHUB_API_BASE_URL,
  );

  if (input.state) url.searchParams.set("state", input.state);

  if (input.page) url.searchParams.set("page", input.page.toString());

  if (input.per_page)
    url.searchParams.set("per_page", input.per_page.toString());

  if (input.sort) url.searchParams.set("sort", input.sort);

  if (input.direction) url.searchParams.set("direction", input.direction);

  if (input.head) url.searchParams.set("head", input.head);

  if (input.base) url.searchParams.set("base", input.base);

  const json = await $githubJson(url.toString());

  if (json.isErr()) return err(json.error);

  return ok(json.value);
}
