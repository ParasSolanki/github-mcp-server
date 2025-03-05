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
import {
  LIST_ISSUES_TOOL,
  listIssues,
  listIssuesInputSchema,
} from "./tools/list-issues.ts";
import {
  LIST_PULL_REQUESTS_TOOL,
  listPullRequests,
  listPullRequestsInputSchema,
} from "./tools/list-pull-requests.ts";
import {
  SEARCH_ISSUES_TOOL,
  searchIssues,
  searchIssuesInputSchema,
} from "./tools/search-issues.ts";
import {
  SEARCH_CODE_TOOL,
  searchCode,
  searchCodeInputSchema,
} from "./tools/search-code.ts";
import {
  SEARCH_USERS_TOOL,
  searchUsers,
  searchUsersInputSchema,
} from "./tools/search-users.ts";

const server = new Server(
  { name: "Github MCP Server", version: VERSION },
  { capabilities: { tools: {} } },
);

export const tools = [
  // search
  SEARCH_REPOSITORIES_TOOL,
  SEARCH_ISSUES_TOOL,
  SEARCH_CODE_TOOL,
  SEARCH_USERS_TOOL,

  // issues
  GET_ISSUE_TOOL,
  LIST_ISSUES_TOOL,

  // pull requests
  LIST_PULL_REQUESTS_TOOL,
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

    if (name === LIST_ISSUES_TOOL.name) {
      const input = listIssuesInputSchema.safeParse(args);

      if (!input.success) {
        return {
          isError: true,
          content: [{ type: "text", text: "Invalid input" }],
        };
      }

      const result = await listIssues(input.data);

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

    if (name === LIST_PULL_REQUESTS_TOOL.name) {
      const input = listPullRequestsInputSchema.safeParse(args);

      if (!input.success) {
        return {
          isError: true,
          content: [{ type: "text", text: "Invalid input" }],
        };
      }

      const result = await listPullRequests(input.data);

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

    if (name === SEARCH_ISSUES_TOOL.name) {
      const input = searchIssuesInputSchema.safeParse(args);

      if (!input.success) {
        return {
          isError: true,
          content: [{ type: "text", text: "Invalid input" }],
        };
      }

      const result = await searchIssues(input.data);

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

    if (name === SEARCH_CODE_TOOL.name) {
      const input = searchCodeInputSchema.safeParse(args);

      if (!input.success) {
        return {
          isError: true,
          content: [{ type: "text", text: "Invalid input" }],
        };
      }

      const result = await searchCode(input.data);

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

    if (name === SEARCH_USERS_TOOL.name) {
      const input = searchUsersInputSchema.safeParse(args);

      if (!input.success) {
        return {
          isError: true,
          content: [{ type: "text", text: "Invalid input" }],
        };
      }

      const result = await searchCode(input.data);

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
