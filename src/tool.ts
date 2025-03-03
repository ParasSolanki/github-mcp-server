import { searchRepositoriesInputSchema } from "./tools/search-repositories.js";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { Tool } from "@modelcontextprotocol/sdk/types.js";

export const SEARCH_REPOSITORIES_TOOL: Tool = {
  name: "search_repositories",
  description: "Search GitHub for a repository",
  inputSchema: zodToJsonSchema(searchRepositoriesInputSchema),
};

export const tools = [SEARCH_REPOSITORIES_TOOL] satisfies Tool[];
