"use client";

import {
  ChartNoAxesCombinedIcon,
  CheckIcon,
  CopyIcon,
  LayoutDashboardIcon,
  PaletteIcon,
  SettingsIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { LogoMark } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Safari } from "@/components/ui/safari";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TOKEN_GROUPS = [
  {
    label: "Surface",
    names: ["background", "foreground", "card", "muted", "border"],
  },
  {
    label: "Semantic",
    names: ["primary", "secondary", "accent", "destructive", "ring"],
  },
];

const METRICS = [
  { change: "+12.8% this month", label: "Total revenue", value: "$24,580" },
  { change: "+84 this month", label: "Customers", value: "1,284" },
  { change: "+18.6% this month", label: "Orders", value: "342" },
];

const REVENUE = [32, 48, 38, 65, 54, 72, 61, 83, 70, 91, 78, 100];

export const InspectcnDemo = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isOpen, setIsOpen] = useState(false);
  const [screen, setScreen] = useState<HTMLDivElement | null>(null);
  const [tokens, setTokens] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<string | null>(null);
  const [captured, setCaptured] = useState(false);
  const [maxHeight, setMaxHeight] = useState(440);

  const readTokens = () => {
    if (!screen) {
      return;
    }
    const styles = getComputedStyle(screen);
    setTokens(
      Object.fromEntries(
        TOKEN_GROUPS.flatMap((group) =>
          group.names.map((name) => [
            name,
            styles.getPropertyValue(`--${name}`).trim(),
          ])
        )
      )
    );
    setMaxHeight(Math.max(128, Math.min(440, screen.clientHeight - 96)));
    setCopied(null);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      readTokens();
      setCaptured(false);
    }
  };

  const captureTheme = () => {
    readTokens();
    setCaptured(true);
  };

  const copy = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
    } catch {
      toast.error(
        "Could not copy. Please allow clipboard access and try again."
      );
    }
  };

  const copyTheme = () => {
    const selector = screen?.closest(".dark") ? ".dark" : ":root";
    const declarations = Object.entries(tokens)
      .filter(([, value]) => value)
      .map(([name, value]) => `  --${name}: ${value};`)
      .join("\n");
    return copy(`${selector} {\n${declarations}\n}`, "theme");
  };

  return (
    <div className="relative w-full max-w-6xl">
      <Safari url={`workspace.example/${activeTab}`} />
      <div
        ref={setScreen}
        className="absolute isolate overflow-hidden rounded-b-[1%] bg-background text-foreground"
        style={{
          height: `${(700 / 753) * 100}%`,
          left: `${(1 / 1203) * 100}%`,
          top: `${(52 / 753) * 100}%`,
          transform: "translateZ(0)",
          width: `${(1200 / 1203) * 100}%`,
          zIndex: 20,
        }}
      >
        <Tabs
          className="h-full gap-0"
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value);
            setIsOpen(false);
            setCaptured(false);
          }}
        >
          <div className="shrink-0 border-b px-5 py-3 sm:px-8">
            <TabsList
              aria-label="Sample browser tabs"
              className="w-full sm:w-fit"
            >
              <TabsTrigger value="dashboard">
                <LayoutDashboardIcon />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <ChartNoAxesCombinedIcon />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="settings">
                <SettingsIcon />
                Settings
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="dashboard" className="min-h-0 overflow-auto">
            <div className="flex flex-col gap-6 p-5 pb-20 sm:p-8 sm:pb-20">
              <header className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                    Overview
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    A little snapshot of your business.
                  </p>
                </div>
                <Badge variant="outline">Last 30 days</Badge>
              </header>
              <div className="grid gap-4 sm:grid-cols-3">
                {METRICS.map((metric) => (
                  <Card key={metric.label}>
                    <CardHeader>
                      <CardDescription>{metric.label}</CardDescription>
                      <CardTitle>{metric.value}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {metric.change}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue</CardTitle>
                    <CardDescription>
                      Your revenue over the last 12 months.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div
                      aria-label="Monthly revenue is trending upward over the last twelve months."
                      className="flex h-36 items-end gap-2"
                      role="img"
                    >
                      {REVENUE.map((value, index) => (
                        <div
                          key={`month-${index + 1}`}
                          className="flex-1 rounded-t-sm bg-primary"
                          style={{ height: `${value}%` }}
                        />
                      ))}
                    </div>
                    <div className="mt-3 flex justify-between text-xs text-muted-foreground">
                      <span>Jan</span>
                      <span>Jun</span>
                      <span>Dec</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Recent orders</CardTitle>
                    <CardDescription>
                      Three customers checked out today.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    {[
                      {
                        amount: "$49",
                        item: "Studio plan",
                        name: "Alex Morgan",
                      },
                      { amount: "$99", item: "Team plan", name: "Sam Taylor" },
                      {
                        amount: "$49",
                        item: "Studio plan",
                        name: "Jordan Lee",
                      },
                    ].map((order) => (
                      <div
                        key={order.name}
                        className="flex items-center justify-between gap-3"
                      >
                        <div>
                          <p className="text-sm font-medium">{order.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {order.item}
                          </p>
                        </div>
                        <span className="text-sm font-medium">
                          {order.amount}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="min-h-0 overflow-auto">
            <div className="flex flex-col gap-6 p-5 pb-20 sm:p-8 sm:pb-20">
              <header className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                    Analytics
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    See how visitors discover your workspace.
                  </p>
                </div>
                <Badge variant="outline">Last 30 days</Badge>
              </header>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  {
                    change: "+24.6% this month",
                    label: "Visitors",
                    value: "18,420",
                  },
                  {
                    change: "+16.2% this month",
                    label: "Page views",
                    value: "42,816",
                  },
                  {
                    change: "+0.6% this month",
                    label: "Conversion rate",
                    value: "3.8%",
                  },
                ].map((metric) => (
                  <Card key={metric.label}>
                    <CardHeader>
                      <CardDescription>{metric.label}</CardDescription>
                      <CardTitle>{metric.value}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {metric.change}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Traffic sources</CardTitle>
                  <CardDescription>
                    Where your visitors come from.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-5">
                  {[
                    { label: "Search", value: 48 },
                    { label: "Direct", value: 32 },
                    { label: "Social", value: 14 },
                    { label: "Referrals", value: 6 },
                  ].map((source) => (
                    <div key={source.label} className="flex flex-col gap-2">
                      <div className="flex justify-between text-sm">
                        <span>{source.label}</span>
                        <span className="text-muted-foreground">
                          {source.value}%
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${source.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="settings" className="min-h-0 overflow-auto">
            <div className="flex flex-col gap-6 p-5 pb-20 sm:p-8 sm:pb-20">
              <header className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                  Settings
                </h2>
                <p className="text-sm text-muted-foreground">
                  Your sample workspace, at a glance.
                </p>
              </header>
              <Card>
                <CardHeader>
                  <CardTitle>Workspace</CardTitle>
                  <CardDescription>
                    Details for this demo workspace.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <dl className="flex flex-col divide-y">
                    {[
                      { label: "Workspace name", value: "Studio workspace" },
                      { label: "Contact email", value: "hello@example.com" },
                      { label: "Plan", value: "Studio" },
                      { label: "Timezone", value: "UTC" },
                    ].map((detail) => (
                      <div
                        key={detail.label}
                        className="flex flex-wrap justify-between gap-2 py-4 first:pt-0 last:pb-0"
                      >
                        <dt className="text-sm text-muted-foreground">
                          {detail.label}
                        </dt>
                        <dd className="text-sm font-medium">{detail.value}</dd>
                      </div>
                    ))}
                  </dl>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        <div className="absolute right-4 bottom-4 flex items-center gap-2">
          <span className="rounded-md bg-background/90 px-2 py-1 text-xs text-muted-foreground">
            Try inspectcn
          </span>
          <Popover open={isOpen} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
              <Button
                aria-label="Open inspectcn demo"
                size="icon-lg"
                variant="secondary"
                className="shadow-lg"
              >
                <LogoMark />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              collisionBoundary={screen}
              collisionPadding={12}
              container={screen}
              side="top"
              sideOffset={10}
              className="flex w-[min(22rem,calc(100vw-4rem))] flex-col gap-3 overflow-hidden"
              style={{ maxHeight }}
            >
              <div className="flex items-center gap-2">
                <LogoMark />
                <div>
                  <h3 className="font-semibold">Inspectcn</h3>
                  <p className="text-xs text-muted-foreground">
                    Inspect theme tokens on this page.
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={captureTheme}>
                  <PaletteIcon data-icon="inline-start" />
                  {captured ? "Refresh" : "Capture"}
                </Button>
                <Button size="sm" variant="outline" onClick={copyTheme}>
                  {copied === "theme" ? (
                    <CheckIcon data-icon="inline-start" />
                  ) : (
                    <CopyIcon data-icon="inline-start" />
                  )}
                  {copied === "theme" ? "Copied CSS" : "Copy CSS"}
                </Button>
              </div>
              <p aria-live="polite" className="text-xs text-muted-foreground">
                {captured
                  ? "Theme captured for this demo session."
                  : "Read the dashboard’s active theme tokens."}
              </p>
              <div className="flex min-h-0 flex-col gap-4 overflow-y-auto overscroll-contain">
                {TOKEN_GROUPS.map((group) => (
                  <div key={group.label} className="flex flex-col gap-2">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase">
                      {group.label}
                    </h4>
                    <div className="overflow-hidden rounded-xl border">
                      {group.names.map((name) => (
                        <div
                          key={name}
                          className="flex items-center gap-3 border-b px-3 py-2 last:border-b-0"
                        >
                          <span
                            aria-hidden="true"
                            className="size-7 shrink-0 rounded-md border"
                            style={{ backgroundColor: tokens[name] }}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-mono text-[11px]">
                              --{name}
                            </p>
                            <p className="truncate font-mono text-[10px] text-muted-foreground">
                              {tokens[name] || "Not found"}
                            </p>
                          </div>
                          <Button
                            aria-label={`Copy ${name} token`}
                            disabled={!tokens[name]}
                            onClick={() =>
                              copy(`--${name}: ${tokens[name]};`, name)
                            }
                            size="icon-sm"
                            variant="ghost"
                          >
                            {copied === name ? <CheckIcon /> : <CopyIcon />}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};
