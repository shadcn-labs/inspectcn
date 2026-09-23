export type ThemeMode = "light" | "dark";

export type TokenGroup = {
  id: string;
  label: string;
  tokens: string[];
};

export type TokenValue = {
  cssVar: `--${string}`;
  isMissing: boolean;
  previewValue: string;
  value: string;
};

export type TokenGroupSnapshot = TokenGroup & {
  values: TokenValue[];
};

export type ThemeSnapshot = {
  foundCount: number;
  groups: TokenGroupSnapshot[];
  totalCount: number;
};

export type ActiveThemeSnapshot = {
  mode: ThemeMode;
  radius: string;
  snapshot: ThemeSnapshot;
};

type TokenMap = Partial<Record<`--${string}`, string>>;

const SAMPLE_POINTS = [
  [0.5, 0.5],
  [0.3, 0.3],
  [0.7, 0.3],
  [0.3, 0.7],
  [0.7, 0.7],
] as const;

const DIRECT_COLOR_PREFIXES = ["#", "rgb(", "rgba(", "hsl(", "hsla(", "oklch(", "oklab(", "lab(", "lch(", "color("];

const HSL_FRAGMENT_RE = /^\d+(\.\d+)?\s+\d+(\.\d+)?%\s+\d+(\.\d+)?%(\s*\/\s*[\d.]+)?$/;
const OKLCH_FRAGMENT_RE = /^0?\.\d+\s+0?\.\d+\s+\d+(\.\d+)?(\s*\/\s*[\d.]+)?$/;

export const TOKEN_GROUPS: TokenGroup[] = [
  {
    id: "surface",
    label: "Surface",
    tokens: [
      "background",
      "foreground",
      "card",
      "card-foreground",
      "popover",
      "popover-foreground",
      "border",
      "input",
      "ring",
    ],
  },
  {
    id: "semantic",
    label: "Semantic",
    tokens: [
      "primary",
      "primary-foreground",
      "secondary",
      "secondary-foreground",
      "muted",
      "muted-foreground",
      "accent",
      "accent-foreground",
      "destructive",
      "destructive-foreground",
    ],
  },
  {
    id: "charts",
    label: "Charts",
    tokens: ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"],
  },
  {
    id: "sidebar",
    label: "Sidebar",
    tokens: [
      "sidebar",
      "sidebar-foreground",
      "sidebar-primary",
      "sidebar-primary-foreground",
      "sidebar-accent",
      "sidebar-accent-foreground",
      "sidebar-border",
      "sidebar-ring",
    ],
  },
];

function normalizeValue(value: string) {
  return value.trim();
}

export const TRACKED_CSS_VARS = TOKEN_GROUPS.flatMap((group) => group.tokens.map((token) => `--${token}` as const));

const DETECTION_TOKENS = ["--radius" as const, ...TRACKED_CSS_VARS];

function isInspectcnElement(element: Element) {
  if (element.closest("[data-inspectcn-ui='true']")) {
    return true;
  }

  const rootNode = element.getRootNode();

  if (rootNode instanceof ShadowRoot) {
    return rootNode.host instanceof Element && rootNode.host.matches("[data-inspectcn-ui='true']");
  }

  return false;
}

function isVisibleElement(element: Element) {
  const rect = element.getBoundingClientRect();

  if (rect.width <= 0 || rect.height <= 0) {
    return false;
  }

  const style = getComputedStyle(element);
  return style.display !== "none" && style.visibility !== "hidden";
}

function createEmptyTokenMap() {
  return Object.fromEntries(DETECTION_TOKENS.map((token) => [token, ""])) as Record<`--${string}`, string>;
}

function countFilledTokens(tokens: TokenMap) {
  return Object.values(tokens).filter((value) => normalizeValue(value ?? "").length > 0).length;
}

function readTokensFromStyle(style: CSSStyleDeclaration) {
  const tokens = createEmptyTokenMap();

  for (const token of DETECTION_TOKENS) {
    tokens[token] = normalizeValue(style.getPropertyValue(token));
  }

  return tokens;
}

function readTokensFromElement(element: Element) {
  return readTokensFromStyle(getComputedStyle(element));
}

function pickBetterTokenMap(...candidates: TokenMap[]) {
  return candidates.sort((a, b) => countFilledTokens(b) - countFilledTokens(a))[0] ?? createEmptyTokenMap();
}

function getDirectPreviewValue(value: string) {
  return DIRECT_COLOR_PREFIXES.some((prefix) => value.startsWith(prefix)) ? value : "";
}

function getPreviewValue(value: string) {
  if (!value) {
    return "";
  }

  const directValue = getDirectPreviewValue(value);

  if (directValue) {
    return directValue;
  }

  if (HSL_FRAGMENT_RE.test(value)) {
    return `hsl(${value})`;
  }

  if (OKLCH_FRAGMENT_RE.test(value)) {
    return `oklch(${value})`;
  }

  return value;
}

function buildSnapshotFromTokens(tokens: TokenMap): ThemeSnapshot {
  const groups = TOKEN_GROUPS.map<TokenGroupSnapshot>((group) => ({
    ...group,
    values: group.tokens.map((token) => {
      const cssVar = `--${token}` as const;
      const value = normalizeValue(tokens[cssVar] ?? "");

      return {
        cssVar,
        isMissing: value.length === 0,
        previewValue: getPreviewValue(value),
        value,
      };
    }),
  }));

  const totalCount = groups.reduce((count, group) => count + group.values.length, 0);
  const foundCount = groups.reduce(
    (count, group) => count + group.values.filter((token) => !token.isMissing).length,
    0,
  );

  return {
    foundCount,
    groups,
    totalCount,
  };
}

function isMeaningfulColor(value: string) {
  return Boolean(value) && value !== "transparent" && value !== "rgba(0, 0, 0, 0)";
}

function resolveColorToRgb(value: string) {
  if (!value || !document.body) {
    return "";
  }

  const probe = document.createElement("div");
  probe.style.cssText = [
    "all: initial",
    "position: absolute",
    "left: -99999px",
    "top: -99999px",
    "width: 1px",
    "height: 1px",
    "display: block",
    "opacity: 0",
    "pointer-events: none",
  ].join(";");

  document.body.append(probe);
  probe.style.backgroundColor = value;
  const resolvedColor = getComputedStyle(probe).backgroundColor;
  probe.remove();

  return isMeaningfulColor(resolvedColor) ? resolvedColor : "";
}

function parseRgbColor(value: string) {
  const match = value.match(/rgba?\(([^)]+)\)/i);

  if (!match) {
    return null;
  }

  const [red = "", green = "", blue = ""] = match[1].split(",").map((part) => part.trim());
  const channels = [red, green, blue].map((part) => Number.parseFloat(part));

  return channels.every((channel) => Number.isFinite(channel)) ? channels : null;
}

function getRelativeLuminance(red: number, green: number, blue: number) {
  const toLinear = (channel: number) => {
    const normalized = channel / 255;
    return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  };

  return 0.2126 * toLinear(red) + 0.7152 * toLinear(green) + 0.0722 * toLinear(blue);
}

function inferThemeModeFromBackgroundValue(value: string) {
  const previewValue = getPreviewValue(value);
  const rgbColor = parseRgbColor(resolveColorToRgb(previewValue));

  if (!rgbColor) {
    return null;
  }

  return getRelativeLuminance(rgbColor[0] ?? 255, rgbColor[1] ?? 255, rgbColor[2] ?? 255) < 0.33 ? "dark" : "light";
}

function inferThemeMode(tokens: TokenMap): ThemeMode {
  return inferThemeModeFromBackgroundValue(tokens["--background"] ?? "") ?? "light";
}

function getExplicitModeFromElement(element: Element | null) {
  if (!element) {
    return null;
  }

  const classList = element instanceof HTMLElement ? element.classList : null;

  if (classList?.contains("dark")) {
    return "dark" as const;
  }

  if (classList?.contains("light")) {
    return "light" as const;
  }

  const dataTheme = normalizeValue(element.getAttribute("data-theme") ?? "").toLowerCase();
  const dataMode = normalizeValue(element.getAttribute("data-mode") ?? "").toLowerCase();
  const dataColorScheme = normalizeValue(element.getAttribute("data-color-scheme") ?? "").toLowerCase();

  for (const value of [dataTheme, dataMode, dataColorScheme]) {
    if (value === "dark") {
      return "dark" as const;
    }

    if (value === "light") {
      return "light" as const;
    }
  }

  const colorScheme = normalizeValue(getComputedStyle(element).colorScheme).toLowerCase();

  if (colorScheme.includes("dark")) {
    return "dark" as const;
  }

  if (colorScheme.includes("light")) {
    return "light" as const;
  }

  return null;
}

function inferThemeModeFromDocument() {
  return getExplicitModeFromElement(document.documentElement) ?? getExplicitModeFromElement(document.body);
}

function inferThemeModeFromPage(): ThemeMode | null {
  const backgroundVotes = new Map<string, number>();

  for (const [pointX, pointY] of SAMPLE_POINTS) {
    const stack = document.elementsFromPoint(window.innerWidth * pointX, window.innerHeight * pointY);

    for (const element of stack) {
      if (isInspectcnElement(element) || !isVisibleElement(element)) {
        continue;
      }

      const backgroundColor = normalizeValue(getComputedStyle(element).backgroundColor);

      if (!isMeaningfulColor(backgroundColor)) {
        continue;
      }

      backgroundVotes.set(backgroundColor, (backgroundVotes.get(backgroundColor) ?? 0) + 1);
      break;
    }
  }

  const activeBackground = [...backgroundVotes.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  const rgbColor = activeBackground ? parseRgbColor(activeBackground) : null;

  if (!rgbColor) {
    return null;
  }

  return getRelativeLuminance(rgbColor[0] ?? 255, rgbColor[1] ?? 255, rgbColor[2] ?? 255) < 0.33 ? "dark" : "light";
}

function readActiveTokens() {
  const tokenVotes = new Map<`--${string}`, Map<string, number>>(
    DETECTION_TOKENS.map((token) => [token, new Map<string, number>()]),
  );

  for (const [pointX, pointY] of SAMPLE_POINTS) {
    const stack = document.elementsFromPoint(window.innerWidth * pointX, window.innerHeight * pointY);

    for (const element of stack) {
      if (isInspectcnElement(element) || !isVisibleElement(element)) {
        continue;
      }

      const style = getComputedStyle(element);
      let foundAny = false;

      for (const token of DETECTION_TOKENS) {
        const value = normalizeValue(style.getPropertyValue(token));

        if (!value) {
          continue;
        }

        foundAny = true;
        const votes = tokenVotes.get(token);

        if (!votes) {
          continue;
        }

        votes.set(value, (votes.get(value) ?? 0) + 1);
      }

      if (foundAny) {
        break;
      }
    }
  }

  return Object.fromEntries(
    DETECTION_TOKENS.map((token) => {
      const winningEntry = [...(tokenVotes.get(token)?.entries() ?? [])].sort((a, b) => b[1] - a[1])[0];
      return [token, winningEntry?.[0] ?? ""];
    }),
  ) as TokenMap;
}

function readBaseTokens() {
  const rootTokens = readTokensFromElement(document.documentElement);
  const bodyTokens = document.body ? readTokensFromElement(document.body) : createEmptyTokenMap();

  return pickBetterTokenMap(rootTokens, bodyTokens);
}

export async function readThemeTokenSnapshots(): Promise<ActiveThemeSnapshot> {
  const activeTokens = readActiveTokens();
  const baseTokens = readBaseTokens();
  const mergedTokens = pickBetterTokenMap(activeTokens, baseTokens);
  const activeMode =
    inferThemeModeFromDocument() ??
    inferThemeModeFromBackgroundValue(activeTokens["--background"] ?? "") ??
    inferThemeModeFromPage() ??
    inferThemeMode(mergedTokens);
  const radius = mergedTokens["--radius"] || "";

  return {
    mode: activeMode,
    radius,
    snapshot: buildSnapshotFromTokens(mergedTokens),
  };
}

export function buildThemeBlock(mode: ThemeMode, snapshot: ThemeSnapshot) {
  const selector = mode === "dark" ? ".dark" : ":root";
  const lines = snapshot.groups
    .flatMap((group) => group.values)
    .filter((token) => !token.isMissing)
    .map((token) => `  ${token.cssVar}: ${token.value};`);

  return `${selector} {\n${lines.join("\n")}\n}`;
}
