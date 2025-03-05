import { z } from "zod";
import { GITHUB_API_BASE_URL } from "../constants.js";
import { $githubJson } from "../utils/gh-fetch.ts";
import { err, ok } from "neverthrow";
import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { zodToJsonSchema } from "zod-to-json-schema";

// @see https://docs.github.com/en/rest/search/search#search-topics search topics API docs

export const searchTopicsInputSchema = z.object({
  query: z
    .string()
    .describe(
      "The query to search for (see Github search query syntax). The query contains one or more search keywords and qualifiers. Qualifiers allow you to limit your search to specific areas of GitHub. The REST API supports the same qualifiers as the web interface for GitHub. ",
    ),
  page: z.number().describe("Page number for pagination (default: 1)"),
  per_page: z
    .number()
    .describe("Number of results per page (default: 30, max: 100)"),
});

export const SEARCH_TOPICS_TOOL: Tool = {
  name: "search_topics",
  description: "Search topics",
  inputSchema: zodToJsonSchema(searchTopicsInputSchema) as Tool["inputSchema"],
};

export type SearchTopicsInput = z.output<typeof searchTopicsInputSchema>;

export async function searchTopics(input: SearchTopicsInput) {
  const url = new URL(`/search/topics`, GITHUB_API_BASE_URL);

  url.searchParams.set("q", input.query);

  if (input.page) url.searchParams.set("page", input.page.toString());

  if (input.per_page)
    url.searchParams.set("per_page", input.per_page.toString());

  const json = await $githubJson(url.toString());

  if (json.isErr()) return err(json.error);

  return ok(json.value);
}
