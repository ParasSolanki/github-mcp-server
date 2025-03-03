import { defineConfig } from "rolldown";
import { minify } from "rollup-plugin-swc3";

export default defineConfig({
  input: "src/app.ts",
  platform: "node",
  treeshake: true,
  output: {
    file: "dist/app.js",
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    "process.env.GITHUB_PERSONAL_ACCESS_TOKEN": JSON.stringify(
      process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
    ),
  },
  plugins: [
    minify({
      module: true,
      mangle: {},
      compress: {},
    }),
  ],
});
