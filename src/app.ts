#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import {
  SEARCH_REPOSITORIES_TOOL,
  searchRepositories,
  searchRepositoriesInputSchema,
} from "./tools/search-repositories.js";
import { VERSION } from "./constants.js";
import {
  GET_ISSUE_TOOL,
  getIssue,
  getIssueInputSchema,
} from "./tools/get-issue.ts";
import {
  GET_PULL_REQUEST_TOOL,
  getPullRequest,
  getPullRequestInputSchema,
} from "./tools/get-pull-request.ts";

const server = new Server(
  {
    name: "Github MCP Server",
    version: VERSION,
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

export const tools = [
  SEARCH_REPOSITORIES_TOOL,
  GET_ISSUE_TOOL,
  GET_PULL_REQUEST_TOOL,
] satisfies Tool[];

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const name = request.params.name;
    const args = request.params.arguments;

    if (!args) throw new Error("No arguments provided");

    if (name === SEARCH_REPOSITORIES_TOOL.name) {
      const input = searchRepositoriesInputSchema.safeParse(args);

      if (!input.success) {
        return {
          isError: true,
          content: [{ type: "text", text: "Invalid input" }],
        };
      }

      const result = await searchRepositories(input.data);

      if (result.isErr()) {
        return {
          isError: true,
          content: [{ type: "text", text: "An error occurred" }],
        };
      }

      return {
        content: [
          { type: "text", text: JSON.stringify(result.value, null, 2) },
        ],
      };
    }

    if (name === GET_ISSUE_TOOL.name) {
      const input = getIssueInputSchema.safeParse(args);

      if (!input.success) {
        return {
          isError: true,
          content: [{ type: "text", text: "Invalid input" }],
        };
      }

      const result = await getIssue(input.data);

      if (result.isErr()) {
        return {
          isError: true,
          content: [{ type: "text", text: "An error occurred" }],
        };
      }

      return {
        content: [
          { type: "text", text: JSON.stringify(result.value, null, 2) },
        ],
      };
    }

    if (name === GET_PULL_REQUEST_TOOL.name) {
      const input = getPullRequestInputSchema.safeParse(args);

      if (!input.success) {
        return {
          isError: true,
          content: [{ type: "text", text: "Invalid input" }],
        };
      }

      const result = await getPullRequest(input.data);

      if (result.isErr()) {
        return {
          isError: true,
          content: [{ type: "text", text: "An error occurred" }],
        };
      }

      return {
        content: [
          { type: "text", text: JSON.stringify(result.value, null, 2) },
        ],
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error) {
    return {
      isError: true,
      content: [{ type: "text", text: "An error occurred" }],
    };
  }
});

async function run() {
  const transport = new StdioServerTransport();

  await server.connect(transport);
}

run().catch((error) => {
  console.error("Fatal error in run()", error);
  process.exit(1);
});
