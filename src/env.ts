import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  emptyStringAsUndefined: true,

  clientPrefix: "PUBLIC_",

  client: {},

  shared: {
    NODE_ENV: z.enum(["development", "production"]),
  },

  server: {
    GITHUB_PERSONAL_ACCESS_TOKEN: z
      .string({
        required_error: "GITHUB_PERSONAL_ACCESS_TOKEN is required",
      })
      .min(1, "GITHUB_PERSONAL_ACCESS_TOKEN is required"),
  },

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    GITHUB_PERSONAL_ACCESS_TOKEN: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
  },
});
