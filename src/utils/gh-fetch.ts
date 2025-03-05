import { USER_AGENT } from "../constants.js";
import { env } from "../env.js";
import { err, ok } from "neverthrow";

export async function $github(url: string, options?: RequestInit) {
  const defaultHeaders = {
    Authorization: `Bearer ${env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
    "User-Agent": USER_AGENT,
  };

  const headers = Object.assign(defaultHeaders, options?.headers ?? {});

  try {
    const response = await fetch(url, {
      headers,
      ...options,
    });

    if (!response.ok) {
      return err(new Error(`Failed to fetch ${url}: ${response.statusText}`));
    }

    return ok(response);
  } catch (error) {
    return err(new Error(`Failed to fetch ${url}: ${error}`));
  }
}

export async function $githubJson(url: string, options?: RequestInit) {
  try {
    const response = await $github(url, options);

    if (response.isErr()) return err(response.error);

    const json = await response.value.json();

    return ok(json);
  } catch (error) {
    return err(new Error(`Failed to fetch ${url}: ${error}`));
  }
}
