import { z } from "zod";
import { gitHubSearchResponseSchema } from "../common/github-schema.js";
import { GITHUB_API_BASE_URL } from "../constants.js";
import { $githubJson } from "../utils/gh-fetch.ts";
import { err, ok } from "neverthrow";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { Tool } from "@modelcontextprotocol/sdk/types.js";

export const searchRepositoriesInputSchema = z.object({
  query: z
    .string()
    .describe("The query to search for (see Github search query syntax)"),
  page: z.number().describe("Page number for pagination (default: 1)"),
  per_page: z
    .number()
    .describe("Number of results per page (default: 30, max: 100)"),
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
