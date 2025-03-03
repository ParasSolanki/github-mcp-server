#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import {
  searchRepositories,
  searchRepositoriesInputSchema,
} from "./tools/search-repositories.js";
import { SEARCH_REPOSITORIES_TOOL, tools } from "./tool.ts";

const server = new Server(
  {
    name: "Github MCP Server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const name = request.params.name;
    const args = request.params.arguments;

    if (!args) throw new Error("No arguments provided");

    if (name === SEARCH_REPOSITORIES_TOOL.name) {
      const input = searchRepositoriesInputSchema.parse(args);

      const result = await searchRepositories(input);

      if (result.error) {
        throw new Error(result.error);
      }

      return {
        content: [{ type: "text", text: JSON.stringify(result.data, null, 2) }],
      };
    } else {
      throw new Error(`Unknown tool: ${name}`);
    }
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
