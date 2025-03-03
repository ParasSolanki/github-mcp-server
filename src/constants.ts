import { getUserAgent } from "universal-user-agent";

export const VERSION = "0.0.1";
export const GITHUB_API_BASE_URL = "https://api.github.com";
export const USER_AGENT = `modelcontextprotocol/servers/github/v${VERSION} ${getUserAgent()}`;
