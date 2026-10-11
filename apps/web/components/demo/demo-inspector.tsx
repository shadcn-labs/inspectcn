"use client";

import { LogoMark } from "@inspectcn/brand/logo";
import {
  ThemeCapturePanel,
  ThemeTokenLoadingState,
  ThemeTokenTabs,
} from "@inspectcn/inspector/panel";
import {
  buildThemeBlock,
  readThemeTokenSnapshots,
  TRACKED_CSS_VARS,
} from "@inspectcn/inspector/theme-tokens";
import type { ActiveThemeSnapshot } from "@inspectcn/inspector/theme-tokens";
import type {
  CapturedThemeDraft,
  ThemeTokenInspectorState,
} from "@inspectcn/inspector/types";
import { Button } from "@inspectcn/inspector/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@inspectcn/inspector/ui/popover";
import { Separator } from "@inspectcn/inspector/ui/separator";
import { useEffect, useRef, useState } from "react";

export const DemoInspector = ({
  localhostMode,
}: {
  localhostMode: boolean;
}) => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [snapshots, setSnapshots] = useState<ActiveThemeSnapshot | null>(null);
  const [capturedDraft, setCapturedDraft] = useState<CapturedThemeDraft | null>(
    null
  );
  const [appliedDraft, setAppliedDraft] = useState<CapturedThemeDraft | null>(
    null
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const originalStyles = useRef<Map<string, string> | null>(null);
  const copyTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refresh = async () => {
    setIsLoading(true);
    try {
      setSnapshots(await readThemeTokenSnapshots());
      setError(null);
    } catch {
      setError("Could not read this preview. Try Reread.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (
        event.source !== window.parent ||
        event.origin !== window.location.origin ||
        event.data?.type !== "inspectcn-demo-state"
      ) {
        return;
      }
      setCapturedDraft(event.data.draft ?? null);
      document.documentElement.classList.toggle(
        "dark",
        event.data.mode === "dark"
      );
      if (isOpen) {
        void refresh();
      }
    };
    window.addEventListener("message", receive);
    window.parent.postMessage(
      { type: "inspectcn-demo-ready" },
      window.location.origin
    );
    return () => window.removeEventListener("message", receive);
  }, [isOpen]);

  useEffect(
    () => () => {
      if (copyTimeout.current) {
        clearTimeout(copyTimeout.current);
      }
    },
    []
  );

  const copyValue = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      if (copyTimeout.current) {
        clearTimeout(copyTimeout.current);
      }
      copyTimeout.current = setTimeout(() => setCopiedKey(null), 1200);
      setError(null);
    } catch {
      setError(
        "Clipboard access is unavailable. Please allow it and try again."
      );
    }
  };

  const inspector: ThemeTokenInspectorState = {
    appliedDraft,
    applyCapturedTheme: async () => {
      const target = document.querySelector<HTMLElement>("[data-demo-kanban]");
      if (!localhostMode || !target || !capturedDraft) {
        return;
      }
      const variables = ["--radius", ...TRACKED_CSS_VARS];
      originalStyles.current ??= new Map(
        variables.map((name) => [name, target.style.getPropertyValue(name)])
      );
      for (const token of capturedDraft.snapshot.groups.flatMap(
        (group) => group.values
      )) {
        if (!token.isMissing) {
          target.style.setProperty(token.cssVar, token.value);
        }
      }
      if (capturedDraft.radius) {
        target.style.setProperty("--radius", capturedDraft.radius);
      }
      setAppliedDraft(capturedDraft);
      await refresh();
    },
    captureCurrentTheme: async () => {
      const theme = await readThemeTokenSnapshots();
      const draft: CapturedThemeDraft = {
        ...theme,
        capturedAt: Date.now(),
        sourceTitle: localhostMode ? "Localhost Kanban" : "Studio Admin CRM",
        sourceUrl: localhostMode
          ? "http://localhost:3000"
          : "https://studio-admin.arhamkhnz.com/dashboard/crm",
      };
      setCapturedDraft(draft);
      setSnapshots(theme);
      window.parent.postMessage(
        { draft, type: "inspectcn-demo-capture" },
        window.location.origin
      );
    },
    captureState: null,
    captureSummary: capturedDraft
      ? "Theme captured for this demo."
      : "Capture the CRM theme, then apply it on localhost.",
    capturedDraft,
    clearAppliedTheme: async () => {
      const target = document.querySelector<HTMLElement>("[data-demo-kanban]");
      if (!target || !originalStyles.current) {
        return;
      }
      for (const [name, value] of originalStyles.current) {
        if (value) {
          target.style.setProperty(name, value);
        } else {
          target.style.removeProperty(name);
        }
      }
      originalStyles.current = null;
      setAppliedDraft(null);
      await refresh();
    },
    clearCapturedTheme: () => {
      setCapturedDraft(null);
      window.parent.postMessage(
        { draft: null, type: "inspectcn-demo-capture" },
        window.location.origin
      );
      return Promise.resolve();
    },
    copiedKey,
    copyCapturedTheme: async () => {
      if (capturedDraft) {
        await copyValue(
          buildThemeBlock(capturedDraft.mode, capturedDraft.snapshot),
          "captured-theme"
        );
      }
    },
    copyTheme: async () => {
      if (snapshots) {
        await copyValue(
          buildThemeBlock(snapshots.mode, snapshots.snapshot),
          "theme-active"
        );
      }
    },
    copyValue,
    isLoading,
    localhostMode,
    refresh,
    snapshots,
  };

  return (
    <div
      ref={setContainer}
      data-inspectcn-ui="true"
      className="inspectcn-ui dark pointer-events-none fixed inset-0 z-50"
    >
      <div className="pointer-events-auto absolute top-5 right-5">
        <Popover
          open={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open);
            if (open) {
              void refresh();
            }
          }}
        >
          <PopoverTrigger
            aria-label="Open InspectCN"
            render={
              <Button size="icon-lg" variant="secondary" className="shadow-lg">
                <LogoMark className="size-5" />
              </Button>
            }
          />
          <PopoverContent
            container={container}
            side="bottom"
            align="end"
            sideOffset={10}
            initialFocus={false}
            className="pointer-events-auto h-[min(42rem,calc(100vh-5rem))] w-[min(24rem,calc(100vw-2rem))] gap-2 overflow-hidden font-sans"
          >
            <PopoverHeader className="gap-0.5">
              <PopoverTitle className="font-pixel-line tracking-tight">
                Inspectcn
              </PopoverTitle>
              <PopoverDescription className="text-xs">
                Inspect theme tokens on this page.
              </PopoverDescription>
            </PopoverHeader>
            <Separator />
            {error && (
              <p role="alert" className="text-xs text-destructive">
                {error}
              </p>
            )}
            {snapshots ? (
              <>
                <ThemeCapturePanel inspector={inspector} />
                <Separator />
                <ThemeTokenTabs inspector={inspector} />
              </>
            ) : (
              <ThemeTokenLoadingState />
            )}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
