import { z, ZodError } from "zod";
import { env } from "../env.js";
import { gitHubSearchResponseSchema } from "../common/github-schema.js";
import { GITHUB_API_BASE_URL, USER_AGENT } from "../constants.js";

export const searchRepositoriesInputSchema = z.object({
  query: z
    .string()
    .describe("The query to search for (see Github search query syntax)"),
  page: z.number().describe("Page number for pagination (default: 1)"),
  per_page: z
    .number()
    .describe("Number of results per page (default: 30, max: 100)"),
});

export type SearchRepositoriesInput = z.output<
  typeof searchRepositoriesInputSchema
>;

export async function searchRepositories(input: SearchRepositoriesInput) {
  const url = new URL("/search/repositories", GITHUB_API_BASE_URL);

  url.searchParams.set("q", input.query);
  url.searchParams.set("page", input.page.toString());
  url.searchParams.set("per_page", input.per_page.toString());

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
        "User-Agent": USER_AGENT,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to search repositories: ${response.statusText}`);
    }

    const data = gitHubSearchResponseSchema.parse(await response.json());

    return { error: undefined, data };
  } catch (error) {
    throw error;
  }
}
