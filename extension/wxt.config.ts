import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type WxtViteConfig } from "wxt";

import path from "node:path";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react", "@wxt-dev/auto-icons"],
  autoIcons: {
    baseIconPath: "public/icon.svg",
  },
  manifest: {
    name: "Inspectcn",
    description:
      "Chrome extension to inspect and extract shadcn-style theme tokens from any website, then bring them into your project.",
    action: {
      default_title: "inspectcn",
    },
    permissions: ["storage"],
  },
  alias: {
    "@": path.resolve("."),
  },
  vite: () =>
    ({
      plugins: [tailwindcss()],
    }) as WxtViteConfig,
});
