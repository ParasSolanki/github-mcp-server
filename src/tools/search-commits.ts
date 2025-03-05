import { z } from "zod";
import { GITHUB_API_BASE_URL } from "../constants.js";
import { $githubJson } from "../utils/gh-fetch.ts";
import { err, ok } from "neverthrow";
import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { zodToJsonSchema } from "zod-to-json-schema";

// @see https://docs.github.com/en/rest/search/search#search-commits search commits API docs

export const searchCommitsInputSchema = z.object({
  query: z
    .string()
    .describe(
      "The query to search for (see Github search query syntax). The query contains one or more search keywords and qualifiers. Qualifiers allow you to limit your search to specific areas of GitHub. The REST API supports the same qualifiers as the web interface for GitHub. ",
    ),
  page: z.number().describe("Page number for pagination (default: 1)"),
  per_page: z
    .number()
    .describe("Number of results per page (default: 30, max: 100)"),
  sort: z
    .enum(["committer-date", "author-date"])
    .optional()
    .describe(
      "Sorts the results of your query by author-date or committer-date. (default: best match)",
    ),
  order: z
    .enum(["asc", "desc"])
    .optional()
    .describe(
      "Determines whether the first search result returned is the highest number of matches (desc) or lowest number of matches (asc). This parameter is ignored unless you provide sort. (default: desc)",
    ),
});

export const SEARCH_COMMITS_TOOL: Tool = {
  name: "search_commits",
  description: "Search commits from a repository",
  inputSchema: zodToJsonSchema(searchCommitsInputSchema) as Tool["inputSchema"],
};

export type SearchCommitsInput = z.output<typeof searchCommitsInputSchema>;

export async function searchCommits(input: SearchCommitsInput) {
  const url = new URL(`/search/commits`, GITHUB_API_BASE_URL);

  url.searchParams.set("q", input.query);

  if (input.page) url.searchParams.set("page", input.page.toString());

  if (input.per_page)
    url.searchParams.set("per_page", input.per_page.toString());

  if (input.sort) url.searchParams.set("sort", input.sort);

  if (input.order) url.searchParams.set("order", input.order);

  const json = await $githubJson(url.toString());

  if (json.isErr()) return err(json.error);

  return ok(json.value);
}
