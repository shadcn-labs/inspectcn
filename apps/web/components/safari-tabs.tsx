"use client";

import type { CapturedThemeDraft } from "@inspectcn/inspector/types";
import { Globe, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { Tabs } from "radix-ui";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { Safari } from "@/components/ui/safari";
import { cn } from "@/lib/utils";

// Match the SVG screen's 11-unit radius at every frame width.
const screenRadius = `${(11 / 1203) * 100}cqw`;
const screenBorderRadius = `0 0 ${screenRadius} ${screenRadius}`;

const tabs = [
  {
    icon: Globe,
    title: "studio-admin.arhamkhnz.com/dashboard/crm",
    url: "https://studio-admin.arhamkhnz.com/dashboard/crm",
  },
  { icon: Monitor, title: "localhost:3000", url: "localhost:3000" },
];

export const SafariTabs = () => {
  const { resolvedTheme } = useTheme();
  const frames = useRef<(HTMLIFrameElement | null)[]>([]);
  const [capturedDraft, setCapturedDraft] = useState<CapturedThemeDraft | null>(
    null
  );
  const sendState = (target: Window | null) =>
    target?.postMessage(
      {
        draft: capturedDraft,
        mode: resolvedTheme,
        type: "inspectcn-demo-state",
      },
      window.location.origin
    );

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (
        event.origin !== window.location.origin ||
        !frames.current.some((frame) => frame?.contentWindow === event.source)
      ) {
        return;
      }
      if (event.data?.type === "inspectcn-demo-capture") {
        setCapturedDraft(event.data.draft ?? null);
      }
      if (event.data?.type === "inspectcn-demo-ready") {
        sendState(event.source as Window);
      }
      if (
        event.data?.type === "inspectcn-demo-scroll" &&
        typeof event.data.deltaY === "number"
      ) {
        window.scrollBy({ behavior: "instant", top: event.data.deltaY });
      }
    };
    window.addEventListener("message", receive);
    for (const frame of frames.current) {
      sendState(frame?.contentWindow ?? null);
    }
    return () => window.removeEventListener("message", receive);
  }, [capturedDraft, resolvedTheme]);

  const [activeTab, setActiveTab] = useState("0");
  const [frame, setFrame] = useState<HTMLDivElement | null>(null);
  const [scale, setScale] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (!frame) {
      return;
    }
    const measure = () => setScale((frame.clientWidth * 1200) / 1203 / 1280);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [frame]);

  return (
    <Tabs.Root
      ref={setFrame}
      className="relative w-full max-w-6xl"
      style={{ containerType: "inline-size" }}
      value={activeTab}
      onValueChange={setActiveTab}
    >
      <p
        className="pointer-events-none absolute -top-24 right-12 hidden max-w-80 -rotate-3 text-xl font-medium leading-tight text-muted-foreground lg:block"
        style={{ fontFamily: "var(--font-handwriting), cursive" }}
      >
        Give it a try!
        <br />
        Capture theme from Dashboard &amp; try applying on localhost.
      </p>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 -right-10 z-30 hidden w-54 text-muted-foreground lg:block"
        style={{ height: `calc(${(52 / 753) * 100}% + 128px)` }}
        viewBox="0 0 216 180"
        preserveAspectRatio="none"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M152 8C220 34 228 90 188 156" />
        <path d="M193 142L188 156L202 150" />
      </svg>
      <Safari url={tabs[Number(activeTab)].url} />
      <div
        className="absolute z-20 flex flex-col items-center justify-center gap-2 overflow-hidden bg-background px-4 text-center lg:hidden"
        style={{
          borderRadius: screenBorderRadius,
          bottom: `${(1 / 753) * 100}%`,
          left: `${(1 / 1203) * 100}%`,
          top: `${(52 / 753) * 100}%`,
          width: `${(1200 / 1203) * 100}%`,
        }}
      >
        <p className="text-sm font-medium sm:text-base">
          Try the interactive demo on desktop
        </p>
        <p className="max-w-sm text-xs text-muted-foreground sm:text-sm">
          Open this page on a larger screen to capture and apply themes.
        </p>
      </div>
      <Tabs.List
        aria-label="Browser tabs"
        className="absolute z-20 hidden h-9 items-stretch gap-px border-b bg-muted/70 p-1 lg:flex"
        style={{
          left: `${(1 / 1203) * 100}%`,
          top: `${(52 / 753) * 100}%`,
          width: `${(1200 / 1203) * 100}%`,
        }}
      >
        {tabs.map((tab, index) => (
          <Tabs.Trigger
            key={tab.url}
            value={String(index)}
            className={cn(
              "relative flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md px-2 text-[11px] focus-visible:outline-2 focus-visible:outline-ring",
              String(index) === activeTab
                ? "bg-background font-medium text-foreground shadow-[0_0_0_1px_color-mix(in_oklch,var(--foreground)_7%,transparent),0_1px_2px_rgb(0_0_0/0.06)]"
                : "text-muted-foreground"
            )}
          >
            <tab.icon aria-hidden="true" className="size-3.5 shrink-0" />
            <span className="truncate">{tab.title}</span>
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {tabs.map((tab, index) => (
        <Tabs.Content
          key={tabs[index].url}
          value={String(index)}
          forceMount
          className="absolute z-20 hidden overflow-hidden bg-background lg:block data-[state=inactive]:hidden"
          style={{
            borderRadius: screenBorderRadius,
            bottom: `${(1 / 753) * 100}%`,
            left: `${(1 / 1203) * 100}%`,
            top: `calc(${(52 / 753) * 100}% + 36px)`,
            width: `${(1200 / 1203) * 100}%`,
          }}
        >
          <iframe
            ref={(node) => {
              frames.current[index] = node;
            }}
            title={
              index === 0 ? "CRM dashboard preview" : "Kanban board preview"
            }
            src={index === 0 ? "/demo/crm" : "/demo/kanban"}
            onLoad={() =>
              sendState(frames.current[index]?.contentWindow ?? null)
            }
            className="absolute top-0 left-0 origin-top-left border-0"
            style={{
              height: `${100 / (scale ?? 1)}%`,
              transform: `scale(${scale ?? 1})`,
              visibility: scale === null ? "hidden" : "visible",
              width: 1280,
            }}
          />
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
};
