import { z } from "zod";
import { gitHubSearchResponseSchema } from "../common/github-schema.js";
import { GITHUB_API_BASE_URL } from "../constants.js";
import { $githubJson } from "../utils/gh-fetch.ts";
import { err, ok } from "neverthrow";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { Tool } from "@modelcontextprotocol/sdk/types.js";

// @see https://docs.github.com/en/rest/search/search#search-repositories search repositories API docs

export const searchRepositoriesInputSchema = z.object({
  query: z
    .string()
    .describe(
      "The query contains one or more search keywords and qualifiers. Qualifiers allow you to limit your search to specific areas of GitHub. The REST API supports the same qualifiers as the web interface for GitHub. (see Github search query syntax)",
    ),
  page: z.number().describe("Page number for pagination (default: 1)"),
  per_page: z
    .number()
    .describe("Number of results per page (default: 30, max: 100)"),
  sort: z
    .enum(["stars", "forks", "help-wanted-issues", "updated"])
    .optional()
    .describe(
      "Sorts the results of your query by the number of stars, forks, or help-wanted-issues or how recently the items were updated. Default: best match",
    ),
  order: z
    .enum(["asc", "desc"])
    .optional()
    .describe(
      "Determines whether the first search result returned is the highest number of matches (desc) or lowest number of matches (asc). This parameter is ignored unless you provide sort. (default: desc)",
    ),
});

export const SEARCH_REPOSITORIES_TOOL: Tool = {
  name: "search_repositories",
  description: "Search GitHub for a repository",
  inputSchema: zodToJsonSchema(
    searchRepositoriesInputSchema,
  ) as Tool["inputSchema"],
};

export type SearchRepositoriesInput = z.output<
  typeof searchRepositoriesInputSchema
>;

export async function searchRepositories(input: SearchRepositoriesInput) {
  const url = new URL("/search/repositories", GITHUB_API_BASE_URL);

  url.searchParams.set("q", input.query);
  url.searchParams.set("page", input.page.toString());
  url.searchParams.set("per_page", input.per_page.toString());

  const json = await $githubJson(url.toString());

  if (json.isErr()) return err(json.error);

  try {
    const data = gitHubSearchResponseSchema.parse(json.value);
    return ok(data);
  } catch (error) {
    return err(
      new Error(
        `Failed to parse github search repositories response: ${error}`,
      ),
    );
  }
}
