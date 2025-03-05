import js from "@eslint/js";
import tseslint from "typescript-eslint";
import neverThrowPlugin from "eslint-plugin-neverthrow";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    plugins: {
      neverthrow: neverThrowPlugin,
    },
    languageOptions: {
      ecmaVersion: 2022,
    },
  },
);
