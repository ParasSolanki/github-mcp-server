import { z } from "zod";
import { GITHUB_API_BASE_URL } from "../constants.js";
import { $githubJson } from "../utils/gh-fetch.ts";
import { err, ok } from "neverthrow";
import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { zodToJsonSchema } from "zod-to-json-schema";

export const listIssuesInputSchema = z.object({
  owner: z.string().describe("The owner of the repository"),
  repo: z.string().describe("The repository name"),
  state: z
    .enum(["open", "closed", "all"])
    .describe("The state of the issues to list (default: open)"),
  page: z
    .number()
    .optional()
    .describe("The page number for pagination (default: 1)"),
  per_page: z
    .number()
    .optional()
    .describe("The number of results per page (default: 30, max: 100)."),
  sort: z
    .enum(["created", "updated", "comments"])
    .optional()
    .describe("The sort order of the issues"),
  direction: z
    .enum(["asc", "desc"])
    .optional()
    .describe("The direction of the sort order"),
  since: z
    .string()
    .optional()
    .describe(
      "Only show results that were last updated after the given time. This is a timestamp in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ.",
    ),
  labels: z
    .string()
    .optional()
    .describe("A list of comma separated label names. Example: bug,ui,@high"),
  milestone: z
    .string()
    .optional()
    .describe(
      "If an integer is passed, it should refer to a milestone by its number field. If the string * is passed, issues with any milestone are accepted. If the string none is passed, issues without milestones are returned.",
    ),
  assignee: z
    .string()
    .optional()
    .describe(
      "Can be the name of a user. Pass in none for issues with no assigned user, and * for issues assigned to any user.",
    ),
  creator: z.string().optional().describe("The user that created the issue."),
  mentioned: z
    .string()
    .optional()
    .describe("A user that's mentioned in the issue."),
});

export const LIST_ISSUES_TOOL: Tool = {
  name: "list_issues",
  description: "List issues from a repository",
  inputSchema: zodToJsonSchema(listIssuesInputSchema) as Tool["inputSchema"],
};

export type ListIssuesInput = z.output<typeof listIssuesInputSchema>;

export async function listIssues(input: ListIssuesInput) {
  const url = new URL(
    `/repos/${input.owner}/${input.repo}/issues`,
    GITHUB_API_BASE_URL,
  );

  if (input.state) url.searchParams.set("state", input.state);

  if (input.page) url.searchParams.set("page", input.page.toString());

  if (input.per_page)
    url.searchParams.set("per_page", input.per_page.toString());

  if (input.sort) url.searchParams.set("sort", input.sort);

  if (input.direction) url.searchParams.set("direction", input.direction);

  if (input.since) url.searchParams.set("since", input.since);

  if (input.labels) url.searchParams.set("labels", input.labels);

  if (input.milestone) url.searchParams.set("milestone", input.milestone);

  if (input.assignee) url.searchParams.set("assignee", input.assignee);

  if (input.creator) url.searchParams.set("creator", input.creator);

  if (input.mentioned) url.searchParams.set("mentioned", input.mentioned);

  const json = await $githubJson(url.toString());

  if (json.isErr()) return err(json.error);

  return ok(json.value);
}
