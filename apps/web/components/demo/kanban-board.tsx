"use client";

import {
  CalendarDays,
  CheckCheck,
  Circle,
  CircleDashed,
  ClipboardCheck,
  Lightbulb,
} from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

import styles from "./kanban-board.module.css";

type Status = "ideas" | "todo" | "progress" | "qa" | "done";
type Priority = "Low" | "Medium" | "High";
interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assignee: string;
  due?: string;
  progress?: number;
  team?: string;
}

const columns = [
  { icon: Lightbulb, id: "ideas", title: "Ideas" },
  { icon: CircleDashed, id: "todo", title: "Planned" },
  { icon: Circle, id: "progress", title: "Building" },
  { icon: ClipboardCheck, id: "qa", title: "QA" },
  { icon: CheckCheck, id: "done", title: "Shipped" },
] as const;

const initialTasks: Task[] = [
  {
    assignee: "Alex Morgan",
    description: "Make the first visit feel simple and welcoming.",
    id: "1",
    priority: "High",
    status: "todo",
    title: "Design the onboarding flow",
  },
  {
    assignee: "Sam Taylor",
    description: "Help new teammates find their way around.",
    id: "2",
    priority: "Medium",
    status: "todo",
    title: "Write the getting started guide",
  },
  {
    assignee: "Jordan Lee",
    description: "Add helpful copy when there is nothing to show.",
    id: "3",
    priority: "Low",
    status: "todo",
    title: "Review empty states",
  },
  {
    assignee: "Sam Taylor",
    description: "Bring milestones, tasks, and progress together.",
    id: "4",
    priority: "High",
    status: "progress",
    title: "Build the project overview",
  },
  {
    assignee: "Alex Morgan",
    description: "Give every card a little more room to breathe.",
    id: "5",
    priority: "Medium",
    status: "progress",
    title: "Polish the mobile layout",
  },
  {
    assignee: "Jordan Lee",
    description: "Shared components and tokens are ready to use.",
    id: "6",
    priority: "High",
    status: "done",
    title: "Set up the design system",
  },
  {
    assignee: "Alex Morgan",
    description: "The team has a new place to plan and ship.",
    id: "7",
    priority: "Low",
    status: "done",
    title: "Create the project workspace",
  },
  {
    assignee: "Jordan Lee",
    description: "Give customers a place to track their requests.",
    due: "Oct 22",
    id: "8",
    priority: "Medium",
    status: "ideas",
    team: "Product",
    title: "Explore a customer portal",
  },
  {
    assignee: "Alex Morgan",
    description: "Collect ideas and agree on the next milestones.",
    due: "Oct 24",
    id: "9",
    priority: "Low",
    status: "ideas",
    team: "Design",
    title: "Plan the next release",
  },
  {
    assignee: "Sam Taylor",
    description: "Review focus states and every interactive control.",
    due: "Oct 18",
    id: "10",
    priority: "High",
    status: "qa",
    team: "QA",
    title: "Check keyboard navigation",
  },
  {
    assignee: "Jordan Lee",
    description: "Verify validation, success, and error states.",
    due: "Oct 19",
    id: "11",
    priority: "Medium",
    status: "qa",
    team: "QA",
    title: "Test the signup flow",
  },
];

export const KanbanBoard = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const completed = tasks.filter((task) => task.status === "done").length;

  return (
    <div
      className={`${styles.board} flex min-h-full flex-col gap-6 bg-background p-6 text-left text-foreground`}
    >
      <div className="flex items-center justify-between border-b pb-5">
        <div className="flex items-center gap-3">
          <Badge variant="secondary">Project board</Badge>
          <span className="text-sm text-muted-foreground">
            {tasks.length} tasks · {completed} completed
          </span>
        </div>
        <div aria-label="Project team" className="flex -space-x-2">
          {["Alex Morgan", "Sam Taylor", "Jordan Lee"].map((name) => (
            <span
              key={name}
              title={name}
              aria-label={name}
              className="flex size-9 items-center justify-center rounded-full border-2 border-background bg-secondary text-xs font-medium text-secondary-foreground"
            >
              {name
                .split(" ")
                .map((part) => part[0])
                .join("")}
            </span>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="grid min-w-[1500px] grid-cols-5 items-start gap-4">
          {columns.map((column) => {
            const columnTasks = tasks.filter(
              (task) => task.status === column.id
            );
            return (
              <section
                key={column.id}
                aria-label={column.title}
                className="flex flex-col gap-3 rounded-xl border bg-muted/50 p-3"
              >
                <header className="flex items-center gap-2">
                  <column.icon className="size-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium">{column.title}</h3>
                  <Badge variant="secondary" className="ml-auto">
                    {columnTasks.length}
                  </Badge>
                </header>
                {columnTasks.map((task) => (
                  <Card key={task.id} className={styles.task}>
                    <CardContent className="flex flex-col gap-3 px-4">
                      <div className="flex items-center justify-between gap-2">
                        <Badge className={styles[task.priority.toLowerCase()]}>
                          {task.priority}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          TASK-{task.id.slice(0, 4)}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <h4 className="text-sm font-medium">{task.title}</h4>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {task.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                        <span>{task.assignee}</span>
                        <span className="flex items-center gap-1">
                          <CalendarDays className="size-3" />
                          {task.due ?? "Oct 20"}
                        </span>
                      </div>
                      {task.status === "progress" && (
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Progress</span>
                            <span>{task.progress ?? 45}%</span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full bg-primary"
                              style={{ width: `${task.progress ?? 45}%` }}
                            />
                          </div>
                          <Badge variant="secondary" className="w-fit">
                            {task.team ?? "Design"}
                          </Badge>
                        </div>
                      )}
                      <div className="flex items-center justify-between gap-2 border-t pt-3">
                        <span
                          title={task.assignee}
                          aria-label={task.assignee}
                          className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-[10px] font-medium text-secondary-foreground"
                        >
                          {task.assignee
                            .split(" ")
                            .map((part) => part[0])
                            .join("")}
                        </span>
                        <NativeSelect
                          aria-label={`Move ${task.title}`}
                          size="sm"
                          value={task.status}
                          onChange={(event) =>
                            setTasks((current) =>
                              current.map((item) =>
                                item.id === task.id
                                  ? {
                                      ...item,
                                      status: event.target.value as Status,
                                    }
                                  : item
                              )
                            )
                          }
                        >
                          {columns.map((option) => (
                            <NativeSelectOption
                              key={option.id}
                              value={option.id}
                            >
                              {option.title}
                            </NativeSelectOption>
                          ))}
                        </NativeSelect>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {columnTasks.length === 0 && (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    No tasks here yet.
                  </p>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
};
