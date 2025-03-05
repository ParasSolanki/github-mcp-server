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
      - `query` (string): The query to search for repository
      - `page` (number, default: 30, max: 100): Page number for pagination
      - `per_page` (number, default: 30, max: 100): Number of results per page

2.  `get_issue`: Get an issue from a repository.

    - Required inputs:
      - `owner` (string): The owner of the repository
      - `repo` (string): The repository name
      - `issue_number` (number): The issue number

3.  `get_pull_request`: Get a pull request from a repository.
    - Required inputs:
      - `owner` (string): The owner of the repository
      - `repo` (string): The repository name
      - `pull_request_number` (number): The pull request number

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
