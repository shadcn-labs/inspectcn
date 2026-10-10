import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";
import next from "ultracite/oxlint/next";
import react from "ultracite/oxlint/react";
import vitest from "ultracite/oxlint/vitest";

export default defineConfig({
  extends: [core, react, next, vitest],
  ignorePatterns: [
    "**/.agents/**",
    "**/.changeset/**",
    "**/.claude/**",
    "**/.cursor/**",
    "**/.next/**",
    "**/.pnpm-store/**",
    ".build/**",
    "apps/web/public/r/**",
    "apps/web/.source/**",
    "apps/web/.web-kits/**",
    "apps/web/audio/**",
    "apps/extension/.output/**",
    "apps/extension/.wxt/**",
    "apps/extension/components/ui/**",
  ],
  overrides: [
    {
      env: { browser: true, webextensions: true },
      files: ["apps/extension/**"],
      globals: {
        browser: "readonly",
        createShadowRootUi: "readonly",
        defineContentScript: "readonly",
      },
      plugins: [
        "eslint",
        "typescript",
        "unicorn",
        "oxc",
        "import",
        "jsdoc",
        "node",
        "promise",
        "react",
        "react-perf",
        "jsx-a11y",
        "vitest",
      ],
      rules: {
        "arrow-body-style": "off",
        "default-case": "off",
        "func-style": "off",
        "import/consistent-type-specifier-style": "off",
        "no-negated-condition": "off",
        "no-nested-ternary": "off",
        "prefer-destructuring": "off",
        "promise/avoid-new": "off",
        "require-await": "off",
        "sort-keys": "off",
        "typescript/consistent-type-definitions": "off",
        "typescript/no-dynamic-delete": "off",
        "unicorn/consistent-function-scoping": "off",
        "unicorn/no-array-reduce": "off",
        "unicorn/no-array-sort": "off",
        "unicorn/no-nested-ternary": "off",
        "unicorn/numeric-separators-style": "off",
        "unicorn/prefer-dom-node-dataset": "off",
        "unicorn/switch-case-braces": "off",
      },
    },
  ],
});
