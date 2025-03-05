import js from "@eslint/js";
import tseslint from "typescript-eslint";
import neverThrow from "eslint-plugin-neverthrow";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...neverThrow.configs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2022,
    },
  },
);
