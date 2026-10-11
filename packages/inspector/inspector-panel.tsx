"use client";

import {
  CheckIcon,
  CopyIcon,
  LoaderCircleIcon,
  PaletteIcon,
  RocketIcon,
  RotateCcwIcon,
  RotateCwIcon,
  Trash2Icon,
} from "lucide-react";

import type { ThemeSnapshot } from "./theme-tokens";
import type { ThemeTokenInspectorState } from "./types";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";
import { Separator } from "./ui/separator";

function ThemeTokenRows({
  copiedKey,
  onCopy,
  snapshot,
}: {
  copiedKey: string | null;
  onCopy: (value: string, key: string) => Promise<void>;
  snapshot: ThemeSnapshot;
}) {
  return (
    <div className="flex flex-col gap-4">
      {snapshot.groups.map((group, groupIndex) => (
        <div key={group.id} className="flex flex-col gap-2.5">
          {groupIndex > 0 ? <Separator /> : null}
          <div className="flex items-center justify-between gap-3">
            <span className="font-semibold text-[11px] text-muted-foreground uppercase tracking-[0.08em]">
              {group.label}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {group.values.filter((token) => !token.isMissing).length}/
              {group.values.length}
            </span>
          </div>

          <div className="overflow-hidden rounded-xl border bg-card/40">
            {group.values.map((token) => {
              const key = token.cssVar;

              return (
                <div
                  key={key}
                  className="flex items-center gap-3 border-b bg-background/70 px-3 py-2.5 last:border-b-0"
                >
                  <span
                    className="size-7 shrink-0 rounded-md border bg-muted"
                    style={{
                      backgroundColor: token.isMissing
                        ? undefined
                        : token.previewValue,
                      backgroundImage: token.isMissing
                        ? "linear-gradient(135deg, transparent 40%, color-mix(in oklab, var(--border) 85%, transparent) 40%, color-mix(in oklab, var(--border) 85%, transparent) 60%, transparent 60%)"
                        : undefined,
                    }}
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-mono text-[11px] text-foreground">
                      {token.cssVar}
                    </p>
                    <p className="truncate font-mono text-[10px] text-muted-foreground">
                      {token.isMissing ? "Not found on this page" : token.value}
                    </p>
                  </div>

                  <Button
                    className="shrink-0"
                    disabled={token.isMissing}
                    onClick={() =>
                      onCopy(`${token.cssVar}: ${token.value};`, key)
                    }
                    size="xs"
                    type="button"
                    variant="ghost"
                  >
                    {copiedKey === key ? "Copied" : "Copy"}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ThemeTokenEmptyState() {
  return (
    <>
      <div className="flex items-center gap-2 font-medium text-foreground text-sm">
        <PaletteIcon />
        Theme tokens
      </div>
      <p className="text-muted-foreground text-sm">
        Open the inspector to read the page&apos;s shadcn tokens.
      </p>
    </>
  );
}

export function ThemeTokenLoadingState() {
  return (
    <>
      <div className="flex items-center gap-2 font-medium text-foreground text-sm">
        <LoaderCircleIcon className="animate-spin" />
        Reading active theme
      </div>
      <p className="text-muted-foreground text-sm">
        Sampling visible UI and resolving shadcn tokens for the current page
        state.
      </p>
    </>
  );
}

export function ThemeCapturePanel({
  inspector,
}: {
  inspector: ThemeTokenInspectorState;
}) {
  const captureLabel = inspector.capturedDraft ? "Refresh" : "Capture";
  const sourceTitle = inspector.capturedDraft?.sourceTitle || null;
  const sourceUrl = inspector.capturedDraft?.sourceUrl || null;
  const sourceHostname = sourceUrl
    ? new URL(sourceUrl).hostname.replace(/^www\./, "")
    : null;

  return (
    <section className="flex flex-col gap-2">
      <p className="text-balance text-foreground text-sm leading-tight">
        {inspector.captureSummary}
      </p>

      {inspector.capturedDraft ? (
        <p className="truncate text-muted-foreground text-xs leading-none">
          {sourceTitle || sourceHostname || sourceUrl}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button
          disabled={inspector.isLoading}
          onClick={inspector.captureCurrentTheme}
          size="sm"
          type="button"
          variant="outline"
        >
          {inspector.copiedKey === "capture-saved" ? (
            <CheckIcon data-icon="inline-start" />
          ) : (
            <PaletteIcon data-icon="inline-start" />
          )}
          {captureLabel}
        </Button>
        <Button
          disabled={!inspector.capturedDraft}
          onClick={inspector.copyCapturedTheme}
          size="sm"
          type="button"
          variant="ghost"
        >
          <CopyIcon data-icon="inline-start" />
          {inspector.copiedKey === "captured-theme"
            ? "Copied saved"
            : "Copy saved"}
        </Button>
        <Button
          disabled={!inspector.capturedDraft}
          onClick={inspector.clearCapturedTheme}
          size="sm"
          type="button"
          variant="ghost"
        >
          <Trash2Icon data-icon="inline-start" />
          Clear saved
        </Button>
      </div>

      {inspector.localhostMode ? (
        <>
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground text-xs leading-none">
              Local preview
            </span>
            <Badge
              className={
                inspector.appliedDraft ? "text-xs" : "invisible text-xs"
              }
              variant="outline"
            >
              Live
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              disabled={!inspector.capturedDraft}
              onClick={inspector.applyCapturedTheme}
              size="sm"
              type="button"
              variant="secondary"
            >
              <RocketIcon data-icon="inline-start" />
              Apply to localhost
            </Button>
            <Button
              disabled={!inspector.appliedDraft}
              onClick={inspector.clearAppliedTheme}
              size="sm"
              type="button"
              variant="ghost"
            >
              <RotateCcwIcon data-icon="inline-start" />
              Reset local
            </Button>
          </div>
        </>
      ) : null}

      {inspector.isLoading ? (
        <p className="text-[11px] text-muted-foreground">
          Refreshing active page tokens…
        </p>
      ) : null}
    </section>
  );
}

export function ThemeTokenTabs({
  inspector,
}: {
  inspector: ThemeTokenInspectorState;
}) {
  if (!inspector.snapshots) {
    return null;
  }

  const activeThemeSelector =
    inspector.snapshots.mode === "dark" ? ".dark" : ":root";

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2.5 text-xs">
          <Badge variant="outline">
            {inspector.snapshots.mode === "dark" ? "Dark" : "Light"}
          </Badge>
          <span className="text-muted-foreground">
            {inspector.snapshots.snapshot.foundCount}/
            {inspector.snapshots.snapshot.totalCount} tokens found
          </span>
        </div>
        <ButtonGroup aria-label="Current theme actions">
          <Button
            disabled={inspector.isLoading}
            onClick={inspector.refresh}
            size="xs"
            type="button"
            variant="outline"
          >
            {inspector.isLoading ? (
              <LoaderCircleIcon
                className="animate-spin"
                data-icon="inline-start"
              />
            ) : (
              <RotateCwIcon data-icon="inline-start" />
            )}
            {inspector.isLoading ? "Reading..." : "Reread"}
          </Button>
          <Button
            onClick={inspector.copyTheme}
            size="xs"
            type="button"
            variant="outline"
          >
            <CopyIcon data-icon="inline-start" />
            {inspector.copiedKey === "theme-active"
              ? `Copied ${activeThemeSelector}`
              : `Copy ${activeThemeSelector}`}
          </Button>
        </ButtonGroup>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <ThemeTokenRows
          copiedKey={inspector.copiedKey}
          onCopy={inspector.copyValue}
          snapshot={inspector.snapshots.snapshot}
        />
      </div>
    </div>
  );
}
