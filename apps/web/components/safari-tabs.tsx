"use client";

import { Globe, Monitor } from "lucide-react";
import { Tabs } from "radix-ui";
import { useLayoutEffect, useState } from "react";

import { CrmDashboard } from "@/components/demo/crm/crm-dashboard";
import { KanbanBoard } from "@/components/demo/kanban-board";
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
      {[CrmDashboard, KanbanBoard].map((Content, index) => (
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
          <div
            aria-label={
              index === 0 ? "CRM dashboard preview" : "Kanban board preview"
            }
            role="region"
            tabIndex={0}
            className="absolute top-0 left-0 origin-top-left overflow-auto"
            style={{
              height: `${100 / (scale ?? 1)}%`,
              transform: `scale(${scale ?? 1})`,
              visibility: scale === null ? "hidden" : "visible",
              width: 1280,
            }}
          >
            <Content />
          </div>
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
};
