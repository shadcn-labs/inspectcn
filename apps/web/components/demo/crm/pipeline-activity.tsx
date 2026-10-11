"use client";

import { useId, useState } from "react";

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

// Data and layout from arhamkhnz/next-shadcn-admin-dashboard CRM.
const pipelineValues = [34, 38, 31, 47, 42, 51, 44, 40, 58, 46, 43, 49];
const pipelineMonths = [
  "Nov",
  "Dec",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
];
const rangeLabels: Record<string, string> = {
  "1": "last 30 days",
  "12": "last 12 months",
  "3": "last quarter",
};

export const PipelineActivity = () => {
  const patternId = useId();
  const [range, setRange] = useState("12");
  const values = pipelineValues.slice(-Number(range));
  const totalQualified = values.reduce((sum, value) => sum + value, 0);
  const allQualified = pipelineValues.reduce((sum, value) => sum + value, 0);
  const discoveryCallsBooked = Math.round(
    (184 / allQualified) * totalQualified
  );
  const discoveryProgress = Math.round(
    (discoveryCallsBooked / totalQualified) * 100
  );
  const chartData = values.map((qualified, index) => ({
    month: pipelineMonths[pipelineMonths.length - values.length + index],
    qualified,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Qualified Lead Flow</CardTitle>
        <CardAction>
          <NativeSelect
            aria-label="Lead flow range"
            size="sm"
            value={range}
            onChange={(event) => setRange(event.target.value)}
          >
            <NativeSelectOption value="1">Last 30 days</NativeSelectOption>
            <NativeSelectOption value="3">Last quarter</NativeSelectOption>
            <NativeSelectOption value="12">Last 12 months</NativeSelectOption>
          </NativeSelect>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 @3xl:grid-cols-12">
          <svg
            viewBox="0 0 720 288"
            role="img"
            aria-label="Qualified leads by month"
            className="h-72 w-full @3xl:col-span-8"
          >
            <defs>
              <pattern
                id={patternId}
                width="4"
                height="4"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)"
              >
                <rect
                  width="6"
                  height="6"
                  fill="var(--chart-2)"
                  fillOpacity="0.15"
                />
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="6"
                  stroke="var(--chart-2)"
                  strokeWidth="1.25"
                  strokeOpacity="0.4"
                />
              </pattern>
            </defs>
            {[0, 1, 2, 3, 4].map((tick) => (
              <line
                key={tick}
                x1="0"
                x2="720"
                y1={16 + tick * 60}
                y2={16 + tick * 60}
                stroke="var(--border)"
              />
            ))}
            {chartData.map((item, index) => {
              const slotWidth = 720 / chartData.length;
              const x = slotWidth * index + slotWidth / 2;
              const height = (item.qualified / 60) * 240;
              return (
                <g key={item.month}>
                  <rect
                    x={x - 19}
                    y={256 - height}
                    width="38"
                    height={height}
                    rx="8"
                    fill={`url(#${patternId})`}
                    stroke="var(--chart-2)"
                    strokeOpacity="0.5"
                    strokeWidth="0.5"
                  >
                    <title>{`${item.month}: ${item.qualified} qualified leads`}</title>
                  </rect>
                  <text
                    x={x}
                    y="282"
                    textAnchor="middle"
                    fill="var(--muted-foreground)"
                    fontSize="12"
                  >
                    {item.month}
                  </text>
                </g>
              );
            })}
          </svg>
          <div className="flex flex-col gap-5 rounded-lg p-4 @3xl:col-span-4">
            <div className="flex flex-col gap-1">
              <div className="font-medium text-4xl tabular-nums leading-none">
                {totalQualified}{" "}
                <span className="font-normal text-lg text-muted-foreground">
                  leads
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                Total qualified leads captured over the {rangeLabels[range]}.
              </p>
            </div>
            <div className="flex flex-col gap-3 rounded-lg border border-border/60 p-3">
              <div className="text-[11px] text-muted-foreground uppercase tracking-widest">
                Discovery Calls Booked
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="font-medium text-2xl tabular-nums leading-none">
                  {discoveryCallsBooked}{" "}
                  <span className="font-normal text-muted-foreground text-sm">
                    meetings
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">
                  {discoveryProgress}% of qualified leads booked a first call.
                </p>
              </div>
              <div className="flex flex-col gap-2 pt-0.5">
                <div
                  role="progressbar"
                  aria-label="Discovery calls booked"
                  aria-valuenow={discoveryProgress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className="h-2.5 overflow-hidden rounded-full bg-chart-2/12"
                >
                  <div
                    className="h-full bg-chart-2"
                    style={{ width: `${discoveryProgress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="font-medium tabular-nums">
                    {discoveryCallsBooked} booked
                  </div>
                  <div className="text-muted-foreground tabular-nums">
                    {totalQualified} qualified
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
