import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import reactHooks from "eslint-plugin-react-hooks";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    ignores: [".next/**", "node_modules/**", "coverage/**", "playwright-report/**", "test-results/**"],
  },
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      import: importPlugin,
      "react-hooks": reactHooks,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        AbortController: "readonly",
        clearTimeout: "readonly",
        console: "readonly",
        document: "readonly",
        fetch: "readonly",
        localStorage: "readonly",
        process: "readonly",
        React: "readonly",
        Request: "readonly",
        Response: "readonly",
        sessionStorage: "readonly",
        setTimeout: "readonly",
        URL: "readonly",
        window: "readonly"
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "no-unused-vars": "off",
      "import/no-restricted-paths": [
        "error",
        {
          "zones": [
            { "target": "./lib", "from": "./app" },
            { "target": "./lib", "from": "./features" },
            { "target": "./lib", "from": "./ui" },
            { "target": "./ui", "from": "./features" },
            { "target": "./ui", "from": "./app" },
            { "target": "./features", "from": "./app" }
          ]
        }
      ]
    }
  }
];
