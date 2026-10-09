import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";
import react from "ultracite/oxlint/react";

export default defineConfig({
  env: {
    browser: true,
    webextensions: true,
  },
  extends: [core, react],
  globals: {
    browser: "readonly",
    createShadowRootUi: "readonly",
    defineContentScript: "readonly",
  },
  ignorePatterns: [".output/**", ".wxt/**", "components/ui/**"],
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
});
