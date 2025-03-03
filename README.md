# Github MCP Server

A [Model Context Protocol](https://github.com/modelcontextprotocol) Server for Github.

Provides integration with Github through MCP, allowing LLMs to interact with it.

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

## Usage examples

Some example prompts you can use to interact with Github:

1. "modelcontextprotocol" → execute the `search_repositories` tool to find repositories where modelcontextprotocol mentioned.

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
