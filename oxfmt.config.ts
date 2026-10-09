import { defineConfig } from "oxfmt";

export default defineConfig({
  arrowParens: "always",
  bracketSameLine: false,
  bracketSpacing: true,
  endOfLine: "lf",
  experimentalSortImports: {
    ignoreCase: true,
    newlinesBetween: true,
    order: "asc",
  },
  experimentalSortPackageJson: true,
  ignorePatterns: [
    "**/.agents/**",
    "**/.changeset/**",
    "**/.claude/**",
    "**/.cursor/**",
    "apps/extension/.output/**",
    "apps/extension/.wxt/**",
    "apps/web/.source/**",
    "apps/web/.web-kits/**",
    "apps/web/audio/**",
    "apps/web/public/r/**",
  ],
  jsxSingleQuote: false,
  printWidth: 80,
  quoteProps: "as-needed",
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",
  useTabs: false,
});
