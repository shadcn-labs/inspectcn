export const FALLBACK_SITE_ORIGIN = "https://inspectcn.arhamkhnz.com" as const;

const getBaseUrl = () => {
  if (process.env.NODE_ENV !== "production") {
    return "http://localhost:3000";
  }

  return process.env.SITE_URL ?? FALLBACK_SITE_ORIGIN;
};

const baseUrl = getBaseUrl();

export const SITE = {
  AUTHOR: {
    NAME: "Arham Khan",
    TWITTER: "@Arhamkhnz",
  },
  DESCRIPTION: {
    LONG: "Chrome extension to inspect and extract shadcn-style theme tokens from any website, then bring them into your project.",
    SHORT: "Inspect and extract shadcn-style theme tokens",
  },
  KEYWORDS: [
    "shadcn",
    "inspectcn",
    "Chrome extension",
    "theme tokens",
    "CSS custom properties",
    "theme inspector",
    "Tailwind CSS",
  ] as const,
  NAME: "inspectcn",
  OG_IMAGE: `${baseUrl}/og`,
  REGISTRY: baseUrl,
  URL: baseUrl,
};

export const META_THEME_COLORS = {
  dark: "#09090b",
  light: "#ffffff",
};

export const UTM_PARAMS = {
  utm_source: new URL(baseUrl).hostname,
};
