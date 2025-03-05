import { z } from "zod";
import { GITHUB_API_BASE_URL } from "../constants.js";
import { $githubJson } from "../utils/gh-fetch.ts";
import { err, ok } from "neverthrow";
import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { zodToJsonSchema } from "zod-to-json-schema";

// @see https://docs.github.com/en/rest/search/search#search-labels search labels API docs

export const searchLabelsInputSchema = z.object({
  query: z
    .string()
    .describe(
      "The search keywords. This endpoint does not accept qualifiers in the query. (see Github search query syntax)",
    ),
  page: z.number().describe("Page number for pagination (default: 1)"),
  per_page: z
    .number()
    .describe("Number of results per page (default: 30, max: 100)"),
  sort: z
    .enum(["created", "updated"])
    .optional()
    .describe(
      "Sorts the results of your query by when the label was created or updated. (default: best match)",
    ),
  order: z
    .enum(["asc", "desc"])
    .optional()
    .describe(
      "Determines whether the first search result returned is the highest number of matches (desc) or lowest number of matches (asc). This parameter is ignored unless you provide sort. (default: desc)",
    ),
});

export const SEARCH_LABELS_TOOL: Tool = {
  name: "search_labels",
  description: "Search labels in a repository",
  inputSchema: zodToJsonSchema(searchLabelsInputSchema) as Tool["inputSchema"],
};

export type SearchLabelsInput = z.output<typeof searchLabelsInputSchema>;

export async function searchLabels(input: SearchLabelsInput) {
  const url = new URL(`/search/labels`, GITHUB_API_BASE_URL);

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
