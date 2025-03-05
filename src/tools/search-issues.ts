import { z } from "zod";
import { GITHUB_API_BASE_URL } from "../constants.js";
import { $githubJson } from "../utils/gh-fetch.ts";
import { err, ok } from "neverthrow";
import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { zodToJsonSchema } from "zod-to-json-schema";

export const searchIssuesInputSchema = z.object({
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
    .enum([
      "comments",
      "reactions",
      "reactions-+1",
      "reactions--1",
      "reactions-smile",
      "reactions-thinking_face",
      "reactions-heart",
      "reactions-tada",
      "interactions",
      "created",
      "updated",
    ])
    .optional()
    .describe(
      "Sorts the results of your query by the number of comments, reactions, reactions-+1, reactions--1, reactions-smile, reactions-thinking_face, reactions-heart, reactions-tada, or interactions. You can also sort results by how recently the items were created or updated. Default: best match",
    ),
  order: z
    .enum(["asc", "desc"])
    .optional()
    .describe(
      "Determines whether the first search result returned is the highest number of matches (desc) or lowest number of matches (asc). This parameter is ignored unless you provide sort. (default: desc)",
    ),
});

export const SEARCH_ISSUES_TOOL: Tool = {
  name: "search_issues",
  description: "Search issues from a repository",
  inputSchema: zodToJsonSchema(searchIssuesInputSchema) as Tool["inputSchema"],
};

export type SearchIssuesInput = z.output<typeof searchIssuesInputSchema>;

export async function searchIssues(input: SearchIssuesInput) {
  const url = new URL(`/search/issues`, GITHUB_API_BASE_URL);

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
