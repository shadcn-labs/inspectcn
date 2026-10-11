"use client";

import type { CapturedThemeDraft } from "@inspectcn/inspector/types";
import { Globe, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { Tabs } from "radix-ui";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { Safari } from "@/components/ui/safari";
import { cn } from "@/lib/utils";

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
      value={activeTab}
      onValueChange={setActiveTab}
    >
      <Safari url={tabs[Number(activeTab)].url} />
      <Tabs.List
        aria-label="Browser tabs"
        className="absolute z-20 flex h-9 items-stretch gap-px border-b bg-muted/70 p-1"
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
          className="absolute z-20 overflow-hidden rounded-b-xl bg-background data-[state=inactive]:hidden"
          style={{
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
