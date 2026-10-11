import { LINK } from "@/constants/links";
import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";
import { requestOrigin } from "@/lib/agent-discovery/request-origin";
import { markdownResponse } from "@/lib/api";

export const revalidate = false;

const homepageMarkdown = (origin: string): string => {
  const base = origin.replace(/\/$/, "");

  return `# ${SITE.NAME}

${SITE.DESCRIPTION.LONG}

inspectcn is in early development. Inspect active theme tokens, copy CSS, or capture a theme and preview it on localhost. The home page includes an interactive demo for desktop screens at least 1024px wide.

## Quick links

- [Add to Chrome](${LINK.CHROME_WEB_STORE})
- [Get started](${base}${ROUTES.DOCS_INSTALLATION}.md)
- [Documentation](${base}${ROUTES.DOCS}.md)
- [LLM index (llms.txt)](${base}${ROUTES.LLMS})
- [Full documentation](${base}${ROUTES.LLMS_FULL})
- [Source and issues](${LINK.GITHUB})
`;
};

export const GET = (request: Request) => {
  const body = homepageMarkdown(requestOrigin(request));

  return markdownResponse(body, true);
};

export const HEAD = (request: Request) => {
  const body = homepageMarkdown(requestOrigin(request));

  return markdownResponse(body, false);
};
