"use client";

import { useEffect } from "react";

import { CrmDashboard } from "./crm/crm-dashboard";
import { DemoInspector } from "./demo-inspector";
import { KanbanBoard } from "./kanban-board";

export const DemoPage = ({ kind }: { kind: "crm" | "kanban" }) => {
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        return;
      }
      const path = event.composedPath();
      const canScroll = path.some((node) => {
        if (!(node instanceof HTMLElement)) {
          return false;
        }
        const overflow = getComputedStyle(node).overflowY;
        if (overflow !== "auto" && overflow !== "scroll") {
          return false;
        }
        return event.deltaY < 0
          ? node.scrollTop > 0
          : node.scrollTop + node.clientHeight < node.scrollHeight - 1;
      });
      if (canScroll) {
        return;
      }
      const root = document.scrollingElement;
      if (!root) {
        return;
      }
      const atEdge =
        event.deltaY < 0
          ? root.scrollTop <= 0
          : root.scrollTop + root.clientHeight >= root.scrollHeight - 1;
      if (atEdge) {
        window.parent.postMessage(
          { deltaY: event.deltaY, type: "inspectcn-demo-scroll" },
          window.location.origin
        );
      }
    };
    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <>
      <style>{`html, body { min-height: 100%; overscroll-behavior: auto; }`}</style>
      {kind === "crm" ? <CrmDashboard /> : <KanbanBoard />}
      <DemoInspector localhostMode={kind === "kanban"} />
    </>
  );
};
