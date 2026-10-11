import { KpiCards } from "./kpi-cards";
import { PipelineActivity } from "./pipeline-activity";
import { TaskReminders } from "./task-reminders";

export const CrmDashboard = () => (
  <div className="@container flex flex-col gap-6 bg-background p-6 text-left text-foreground">
    <KpiCards />
    <PipelineActivity />
    <TaskReminders />
  </div>
);
