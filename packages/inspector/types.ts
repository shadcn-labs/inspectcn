import type { ActiveThemeSnapshot } from "./theme-tokens";

export type CapturedThemeDraft = {
  capturedAt: number;
  mode: "light" | "dark";
  radius: string;
  snapshot: ActiveThemeSnapshot["snapshot"];
  sourceTitle: string;
  sourceUrl: string;
};

export type ThemeTokenInspectorState = {
  appliedDraft: CapturedThemeDraft | null;
  applyCapturedTheme: () => Promise<void>;
  captureCurrentTheme: () => Promise<void>;
  captureState: string | null;
  captureSummary: string;
  capturedDraft: CapturedThemeDraft | null;
  clearCapturedTheme: () => Promise<void>;
  clearAppliedTheme: () => Promise<void>;
  copiedKey: string | null;
  copyCapturedTheme: () => Promise<void>;
  copyTheme: () => Promise<void>;
  copyValue: (value: string, key: string) => Promise<void>;
  isLoading: boolean;
  localhostMode: boolean;
  refresh: () => Promise<void>;
  snapshots: ActiveThemeSnapshot | null;
};
