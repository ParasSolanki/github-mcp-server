import { z } from "zod";

export const gitHubAuthorSchema = z.object({
  name: z.string().describe("The name of the author"),
  email: z.string().describe("The email of the author"),
  date: z.string().describe("The date of the commit"),
});

export const gitHubOwnerSchema = z.object({
  login: z.string().describe("The login name of the owner"),
  id: z.number().describe("The ID of the owner"),
  node_id: z.string().describe("The node ID of the owner"),
  avatar_url: z.string().describe("The avatar URL of the owner"),
  url: z.string().describe("The URL of the owner"),
  html_url: z.string().describe("The HTML URL of the owner"),
  type: z.string().describe("The type of the owner"),
});

export const gitHubRepositorySchema = z.object({
  id: z.number().describe("The ID of the repository"),
  node_id: z.string().describe("The node ID of the repository"),
  name: z.string().describe("The name of the repository"),
  full_name: z.string().describe("The full name of the repository"),
  private: z.boolean().describe("Whether the repository is private"),
  owner: gitHubOwnerSchema,
  html_url: z.string().describe("The HTML URL of the repository"),
  description: z
    .string()
    .nullable()
    .describe("The description of the repository"),
  fork: z.boolean().describe("Whether the repository is a fork"),
  url: z.string().describe("The URL of the repository"),
  created_at: z.string().describe("The date the repository was created"),
  updated_at: z.string().describe("The date the repository was updated"),
  pushed_at: z.string().describe("The date the repository was pushed"),
  git_url: z.string().describe("The Git URL of the repository"),
  ssh_url: z.string().describe("The SSH URL of the repository"),
  clone_url: z.string().describe("The clone URL of the repository"),
  default_branch: z.string().describe("The default branch of the repository"),
});

export const gitHubSearchResponseSchema = z.object({
  total_count: z.number().describe("The total number of results"),
  incomplete_results: z
    .boolean()
    .describe("Whether the results are incomplete"),
  items: z.array(gitHubRepositorySchema).describe("The repositories"),
});

export type GitHubAuthor = z.infer<typeof gitHubAuthorSchema>;
export type GitHubRepository = z.infer<typeof gitHubRepositorySchema>;
export type GitHubSearchResponse = z.infer<typeof gitHubSearchResponseSchema>;
