import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser"; // Required parser for TypeScript
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // Global settings for JavaScript and TypeScript
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"], // Apply linting to these files
    languageOptions: {
      parser: tsParser, // Use TypeScript parser
      ecmaVersion: "latest", // Latest ECMAScript features
      sourceType: "module", // Enable ESM syntax
      globals: {
        ...globals.browser, // Browser globals like `window`
        ...globals.node,    // Node.js globals like `module`
      },
    },
    rules: {
      // Add any project-specific rules here
      "no-console": "warn", // Warn on console.log usage
    },
  },

  // Core ESLint rules
  pluginJs.configs.recommended,

  // TypeScript rules
  ...tseslint.configs.recommended,

  // React-specific rules
  pluginReact.configs.flat.recommended,
];