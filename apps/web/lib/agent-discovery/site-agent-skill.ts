import { createHash } from "node:crypto";

import { LINK } from "@/constants/links";
import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";

export const SITE_AGENT_SKILL_MD = `# ${SITE.NAME}

## Summary

${SITE.DESCRIPTION.LONG}

Help users install Inspectcn, inspect active shadcn-style theme tokens, copy CSS, and capture themes for localhost previews.

## Documentation

- Introduction: ${ROUTES.DOCS}
- Installation and usage: ${ROUTES.DOCS_INSTALLATION}
- Privacy policy: ${ROUTES.DOCS_PRIVACY}

## Install

Install the extension from the Chrome Web Store: ${LINK.CHROME_WEB_STORE}

## Usage

1. Open the Inspectcn badge on a website and review the detected tokens.
2. Copy the active theme CSS or capture the theme.
3. Open an HTTP localhost project and use Apply to localhost to preview the capture.
4. Use Reset local to remove the saved preview.

Inspectcn is in early development. Detection depends on the CSS variables a website exposes. The homepage includes a desktop demo; its captures remain in memory only.

`;

export const siteAgentSkillDigest = (): string => {
  const hex = createHash("sha256")
    .update(SITE_AGENT_SKILL_MD, "utf-8")
    .digest("hex");

  return `sha256:${hex}`;
};
