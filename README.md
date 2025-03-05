# Github MCP Server

A [Model Context Protocol](https://github.com/modelcontextprotocol) Server for Github.

Provides integration with Github through MCP, allowing LLMs to interact with it.

[Github REST Api Docs](https://docs.github.com/en/rest)

## Installation

### Manual Installation

1. Create or get access token for your Github Account: [Guide](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token)

2. Add server config to Claude Desktop:

   - MacOS: ~/Library/Application Support/Claude/claude_desktop_config.json
   - Windows: [Check this Guide](https://gist.github.com/feveromo/7a340d7795fca1ccd535a5802b976e1f)

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "github-mcp-server"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your_personal_github_access_token"
      }
    }
  }
}
```

## Components

### Tools

1.  `search_repositories`: Search GitHub for a repository.

    - Required inputs:
      - `query` (string): The query to search for repository.
      - `page` (number, default: 30, max: 100): Page number for pagination.
      - `per_page` (number, default: 30, max: 100): Number of results per page.

2.  `search_issues`: Search issues from a repository.

    - Required inputs:
      - `query` (string): The query to search for repository.
      - `page` (number, default: 1): Page number for pagination.
      - `per_page` (number, default: 30, max: 100): Number of results per page.
      - `order` (optional string, default: `desc`): Sort of order (`asc` or `desc`).
      - `sort` (optional string, default: `best match`): Sort field (can be one of: `comments`, `reactions`, `reactions-+1`, `reactions--1`, `reactions-smile`, `reactions-thinking_face`, `reactions-heart`, `reactions-tada`, `interactions`, `created` or `updated`).

3.  `search_commits`: Search commits from a repository.

    - Required inputs:
      - `query` (string): The query to search for repository.
      - `page` (number, default: 1): Page number for pagination.
      - `per_page` (number, default: 30, max: 100): Number of results per page.
      - `order` (optional string, default: `desc`): Sort of order (`asc` or `desc`).
      - `sort` (optional string, default: `best match`): Sort field (can be one of: `committer-date` or `author-date`).

4.  `search_code`: Search code from a repository.

    - Required inputs:
      - `query` (string): The query to search for repository.
      - `page` (number, default: 1): Page number for pagination.
      - `per_page` (number, default: 30, max: 100): Number of results per page.

5.  `search_users`: Search users from a repository.

    - Required inputs:
      - `query` (string): The query to search for repository.
      - `page` (number, default: 1): Page number for pagination.
      - `per_page` (number, default: 30, max: 100): Number of results per page.
      - `order` (optional string, default: `desc`): Sort of order (`asc` or `desc`).
      - `sort` (optional string, default: `best match`): Sort field (can be one of: `followers`, `repositories` or `joined`).

6.  `search_topics`: Search topics.

    - Required inputs:
      - `query` (string): The query to search for repository.
      - `page` (number, default: 1): Page number for pagination.
      - `per_page` (number, default: 30, max: 100): Number of results per page.

7.  `search_labels`: Search labels in a repository.

    - Required inputs:
      - `query` (string): The query to search for repository.
      - `page` (number, default: 1): Page number for pagination.
      - `per_page` (number, default: 30, max: 100): Number of results per page.
      - `order` (optional string, default: `desc`): Sort of order (`asc` or `desc`).
      - `sort` (optional string, default: `best match`): Sort field (can be one of: `created` or `updated`).

8.  `list_repositories_issues`: List issues from a repository.

    - Required inputs:
      - `owner` (string): The owner of the repository.
      - `repo` (string): The repository name.
      - `page` (optional number, default: 1): Page number for pagination.
      - `per_page` (optional number, default: 30, max: 100): Number of results per page.
      - `direction` (optional string, default: `desc`): Direction of sort (`asc` or `desc`).
      - `sort` (optional string, default: `created`): Sort field (can be one of: `created`, `comments` or `updated`).
      - `since` (optional string): Results last updated after the given time (ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ.).
      - `labels` (optional string): Comma separated label names. Example: bug,ui,@high.
      - `milestone` (optional string): Milestone number.
      - `assignee` (optional string): Name of assignee user (`*` for all).
      - `creator` (optional string): The user that created the issue. (`*` for all).
      - `mentioned` (optional string): A user that's mentioned in the issue.

9.  `get_issue`: Get an issue from a repository.

    - Required inputs:
      - `owner` (string): The owner of the repository.
      - `repo` (string): The repository name.
      - `issue_number` (number): The issue number.

10. `list_repositories_pull_requests`: List pull requests from a repository.

    - Required inputs:
      - `owner` (string): The owner of the repository.
      - `repo` (string): The repository name.
      - `page` (optional number, default: 1): Page number for pagination.
      - `per_page` (optional number, default: 30, max: 100): Number of results per page.
      - `direction` (optional string, default: `desc`): Direction of sort (`asc` or `desc`).
      - `sort` (optional string, default: `created`): Sort field (can be one of: `created`, `popularity`, `long-running` or `updated`).
      - `head` (optional string): Filter pulls by head user or head organization and branch name in the format of user:ref-name or organization:ref-name (For example: github:new-script-format or octocat:test-branch).
      - `base` (optional string): Filter pulls by base branch name. (For example: gh-pages).

11. `get_pull_request`: Get a pull request from a repository.
    - Required inputs:
      - `owner` (string): The owner of the repository.
      - `repo` (string): The repository name.
      - `pull_request_number` (number): The pull request number.

## Usage examples

Some example prompts you can use to interact with Github:

1. "modelcontextprotocol" → execute the `search_repositories` tool to find repositories where modelcontextprotocol mentioned.
2. "What is the 739 issue on modelcontextprotocol servers repo" → execute the `get_issue` tool to find 739 issue from modelcontextprotocol servers repo.
3. "What is the 717 PR on modelcontextprotocol servers repo" → execute the `get_pull_request` tool to find 717 PR from modelcontextprotocol servers repo.

## Development

1. Install dependencies:

```shell
pnpm install
```

2. Configure Github Access token in `.env`:

```shell
GITHUB_PERSONAL_ACCESS_TOKEN=<your_personal_github_access_token>
```

3. Run locally with watch:

```shell
pnpm dev
```

4. Build the server:

```shell
pnpm build
```

5. Local debugging with inspector:

```shell
pnpm inspector
```
