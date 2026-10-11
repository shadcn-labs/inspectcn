import {
  type ActiveThemeSnapshot,
  buildThemeBlock,
  readThemeTokenSnapshots,
} from "@inspectcn/inspector/theme-tokens";
import type {
  CapturedThemeDraft,
  ThemeTokenInspectorState,
} from "@inspectcn/inspector/types";
import { useEffect, useEffectEvent, useMemo, useRef, useState } from "react";

import {
  applyThemeDraftToDocument,
  buildCopyBlock,
  clearCapturedThemeDraft,
  clearLocalhostThemeForOrigin,
  isLocalhostPage,
  readCapturedThemeDraft,
  readLocalhostThemeForOrigin,
  removeThemeDraftFromDocument,
  saveCapturedThemeDraft,
  saveLocalhostThemeForOrigin,
} from "@/lib/content-badge/theme-overrides";

type IdleWindow = Window &
  typeof globalThis & {
    requestIdleCallback?: (
      callback: IdleRequestCallback,
      options?: IdleRequestOptions
    ) => number;
  };

export function useThemeTokenInspector(
  isOpen: boolean
): ThemeTokenInspectorState {
  const [snapshots, setSnapshots] = useState<ActiveThemeSnapshot | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [capturedDraft, setCapturedDraft] = useState<CapturedThemeDraft | null>(
    null
  );
  const [appliedDraft, setAppliedDraft] = useState<CapturedThemeDraft | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const localhostMode = useMemo(() => isLocalhostPage(), []);
  const refreshRequestRef = useRef(0);
  const loadingRequestCountRef = useRef(0);
  const openRefreshTimeoutRef = useRef<number | null>(null);
  const prewarmTimeoutRef = useRef<number | null>(null);

  const waitForNextPaint = () =>
    new Promise<void>((resolve) => {
      window.requestAnimationFrame(() => resolve());
    });

  const waitForIdle = () =>
    new Promise<void>((resolve) => {
      const idleWindow = window as IdleWindow;

      if (typeof idleWindow.requestIdleCallback === "function") {
        idleWindow.requestIdleCallback(
          () => {
            resolve();
          },
          { timeout: 250 }
        );
        return;
      }

      setTimeout(() => resolve(), 0);
    });

  const refresh = useEffectEvent(async (showLoading = true) => {
    const requestId = refreshRequestRef.current + 1;
    refreshRequestRef.current = requestId;

    if (showLoading) {
      loadingRequestCountRef.current += 1;
      setIsLoading(true);
      await waitForNextPaint();
      await waitForNextPaint();
    }

    await waitForIdle();

    try {
      const nextSnapshots = await readThemeTokenSnapshots();
      const [nextCapturedDraft, nextAppliedDraft] = await Promise.all([
        readCapturedThemeDraft(),
        localhostMode
          ? readLocalhostThemeForOrigin(window.location.origin)
          : Promise.resolve(null),
      ]);

      if (refreshRequestRef.current !== requestId) {
        return;
      }

      setSnapshots(nextSnapshots);
      setCapturedDraft(nextCapturedDraft);
      setAppliedDraft(nextAppliedDraft);
    } finally {
      if (showLoading) {
        loadingRequestCountRef.current = Math.max(
          0,
          loadingRequestCountRef.current - 1
        );

        if (loadingRequestCountRef.current === 0) {
          setIsLoading(false);
        }
      }
    }
  });

  useEffect(() => {
    if (isOpen || snapshots) {
      return;
    }

    prewarmTimeoutRef.current = window.setTimeout(() => {
      void refresh(false);
    }, 1200);

    return () => {
      if (prewarmTimeoutRef.current !== null) {
        window.clearTimeout(prewarmTimeoutRef.current);
        prewarmTimeoutRef.current = null;
      }
    };
  }, [isOpen, snapshots]);

  useEffect(() => {
    if (!isOpen) {
      if (openRefreshTimeoutRef.current !== null) {
        window.clearTimeout(openRefreshTimeoutRef.current);
        openRefreshTimeoutRef.current = null;
      }
      return;
    }

    if (openRefreshTimeoutRef.current !== null) {
      window.clearTimeout(openRefreshTimeoutRef.current);
    }

    openRefreshTimeoutRef.current = window.setTimeout(
      () => {
        void refresh(!snapshots);
        openRefreshTimeoutRef.current = null;
      },
      snapshots ? 180 : 120
    );

    return () => {
      if (openRefreshTimeoutRef.current !== null) {
        window.clearTimeout(openRefreshTimeoutRef.current);
        openRefreshTimeoutRef.current = null;
      }
    };
  }, [isOpen, snapshots]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleRefresh = () => {
      if (document.visibilityState === "visible") {
        void refresh(false);
      }
    };

    document.addEventListener("visibilitychange", handleRefresh);
    window.addEventListener("focus", handleRefresh);

    return () => {
      document.removeEventListener("visibilitychange", handleRefresh);
      window.removeEventListener("focus", handleRefresh);
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (openRefreshTimeoutRef.current !== null) {
        window.clearTimeout(openRefreshTimeoutRef.current);
      }

      if (prewarmTimeoutRef.current !== null) {
        window.clearTimeout(prewarmTimeoutRef.current);
      }
    };
  }, []);

  const copyValue = async (value: string, key: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedKey(key);
    window.setTimeout(() => {
      setCopiedKey((current) => (current === key ? null : current));
    }, 1200);
  };

  const copyTheme = async () => {
    if (!snapshots) {
      return;
    }

    await copyValue(
      buildThemeBlock(snapshots.mode, snapshots.snapshot),
      "theme-active"
    );
  };

  const captureCurrentTheme = async () => {
    if (!snapshots) {
      return;
    }

    const draft = await saveCapturedThemeDraft(snapshots);
    setCapturedDraft(draft);
    setCopiedKey("capture-saved");
    window.setTimeout(() => {
      setCopiedKey((current) => (current === "capture-saved" ? null : current));
    }, 1200);
  };

  const applyCapturedTheme = async () => {
    if (!capturedDraft || !localhostMode) {
      return;
    }

    await saveLocalhostThemeForOrigin(window.location.origin, capturedDraft);
    applyThemeDraftToDocument(capturedDraft);
    setAppliedDraft(capturedDraft);
    await refresh();
  };

  const clearAppliedTheme = async () => {
    if (!localhostMode) {
      return;
    }

    await clearLocalhostThemeForOrigin(window.location.origin);
    removeThemeDraftFromDocument();
    setAppliedDraft(null);
    await refresh();
  };

  const clearCapturedTheme = async () => {
    await clearCapturedThemeDraft();
    setCapturedDraft(null);
    setCopiedKey((current) =>
      current === "capture-saved" || current === "captured-theme"
        ? null
        : current
    );
  };

  const copyCapturedTheme = async () => {
    if (!capturedDraft) {
      return;
    }

    await copyValue(buildCopyBlock(capturedDraft), "captured-theme");
  };

  const sourceLabel = capturedDraft
    ? new URL(capturedDraft.sourceUrl).hostname.replace(/^www\./, "")
    : null;
  const captureSummary = localhostMode
    ? capturedDraft
      ? "Saved for localhost preview."
      : "Capture a theme to preview it on localhost."
    : capturedDraft
      ? `Saved from ${sourceLabel || "captured page"}.`
      : "Save this page to reuse on localhost.";
  const captureState = localhostMode
    ? appliedDraft
      ? "Applied"
      : "Localhost"
    : capturedDraft
      ? "Saved"
      : null;

  return {
    appliedDraft,
    applyCapturedTheme,
    captureCurrentTheme,
    captureState,
    captureSummary,
    capturedDraft,
    clearCapturedTheme,
    clearAppliedTheme,
    copiedKey,
    copyCapturedTheme,
    copyTheme,
    copyValue,
    isLoading,
    localhostMode,
    refresh,
    snapshots,
  };
}
