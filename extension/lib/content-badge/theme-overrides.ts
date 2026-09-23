import { type ActiveThemeSnapshot, buildThemeBlock, TRACKED_CSS_VARS } from "@/lib/content-badge/theme-tokens";

const CAPTURED_THEME_KEY = "inspectcn:captured-theme";
const LOCALHOST_THEME_KEY = "inspectcn:localhost-themes";

export type CapturedThemeDraft = {
  capturedAt: number;
  mode: "light" | "dark";
  radius: string;
  snapshot: ActiveThemeSnapshot["snapshot"];
  sourceTitle: string;
  sourceUrl: string;
};

type LocalhostThemeMap = Record<string, CapturedThemeDraft>;

function getLocalhostMapValue(value: unknown): LocalhostThemeMap {
  return typeof value === "object" && value !== null ? (value as LocalhostThemeMap) : {};
}

export function isLocalhostPage(url = window.location.href) {
  try {
    const { hostname, protocol } = new URL(url);
    return protocol === "http:" && (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "0.0.0.0");
  } catch {
    return false;
  }
}

export function applyThemeDraftToDocument(draft: CapturedThemeDraft) {
  const rootStyle = document.documentElement.style;

  for (const token of draft.snapshot.groups.flatMap((group) => group.values)) {
    if (!token.isMissing) {
      rootStyle.setProperty(token.cssVar, token.value);
    }
  }

  if (draft.radius) {
    rootStyle.setProperty("--radius", draft.radius);
  }

  rootStyle.colorScheme = draft.mode;
}

export function removeThemeDraftFromDocument() {
  const rootStyle = document.documentElement.style;

  for (const token of ["--radius", ...TRACKED_CSS_VARS]) {
    rootStyle.removeProperty(token);
  }

  rootStyle.colorScheme = "";
}

export async function readCapturedThemeDraft() {
  const stored = (await browser.storage.local.get(CAPTURED_THEME_KEY)) as Record<
    string,
    CapturedThemeDraft | undefined
  >;

  return stored[CAPTURED_THEME_KEY] ?? null;
}

export async function saveCapturedThemeDraft(theme: ActiveThemeSnapshot) {
  const draft: CapturedThemeDraft = {
    capturedAt: Date.now(),
    mode: theme.mode,
    radius: theme.radius,
    snapshot: theme.snapshot,
    sourceTitle: document.title,
    sourceUrl: window.location.href,
  };

  await browser.storage.local.set({
    [CAPTURED_THEME_KEY]: draft,
  });

  return draft;
}

export async function clearCapturedThemeDraft() {
  await browser.storage.local.remove(CAPTURED_THEME_KEY);
}

export async function readLocalhostThemeForOrigin(origin: string) {
  const stored = (await browser.storage.local.get(LOCALHOST_THEME_KEY)) as Record<
    string,
    LocalhostThemeMap | undefined
  >;

  return getLocalhostMapValue(stored[LOCALHOST_THEME_KEY])[origin] ?? null;
}

export async function saveLocalhostThemeForOrigin(origin: string, draft: CapturedThemeDraft) {
  const stored = (await browser.storage.local.get(LOCALHOST_THEME_KEY)) as Record<
    string,
    LocalhostThemeMap | undefined
  >;
  const nextMap = {
    ...getLocalhostMapValue(stored[LOCALHOST_THEME_KEY]),
    [origin]: draft,
  };

  await browser.storage.local.set({
    [LOCALHOST_THEME_KEY]: nextMap,
  });

  return draft;
}

export async function clearLocalhostThemeForOrigin(origin: string) {
  const stored = (await browser.storage.local.get(LOCALHOST_THEME_KEY)) as Record<
    string,
    LocalhostThemeMap | undefined
  >;
  const nextMap = {
    ...getLocalhostMapValue(stored[LOCALHOST_THEME_KEY]),
  };

  delete nextMap[origin];

  await browser.storage.local.set({
    [LOCALHOST_THEME_KEY]: nextMap,
  });
}

export async function applyStoredLocalhostThemeForCurrentPage() {
  if (!isLocalhostPage()) {
    return null;
  }

  const draft = await readLocalhostThemeForOrigin(window.location.origin);

  if (draft) {
    applyThemeDraftToDocument(draft);
    return draft;
  }

  removeThemeDraftFromDocument();
  return null;
}

export function buildCopyBlock(draft: CapturedThemeDraft) {
  return buildThemeBlock(draft.mode, draft.snapshot);
}
