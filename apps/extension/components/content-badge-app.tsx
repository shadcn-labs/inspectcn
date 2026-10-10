import { useEffect, useRef, useState } from "react";

import {
  ThemeCapturePanel,
  ThemeTokenEmptyState,
  ThemeTokenLoadingState,
  ThemeTokenTabs,
  useThemeTokenInspector,
} from "@/components/theme-token-inspector";
import { Button } from "@/components/ui/button";
import { InspectcnLogo } from "@/components/ui/inspectcn-logo";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  type BadgePosition,
  DEFAULT_ANCHOR_INDEX,
  findNearestAnchor,
  getAnchorPoints,
  getPopoverPlacement,
} from "@/lib/content-badge/anchors";
import { applyStoredLocalhostThemeForCurrentPage } from "@/lib/content-badge/theme-overrides";
import { cn } from "@/lib/utils";

const DRAG_THRESHOLD = 6;
const STORAGE_KEY = "inspectcn:anchor-index";

function getViewport() {
  return {
    height: window.innerHeight,
    width: window.innerWidth,
  };
}

export function ContentBadgeApp({ shadowRoot }: { shadowRoot: ShadowRoot }) {
  const [anchorIndex, setAnchorIndex] = useState(DEFAULT_ANCHOR_INDEX);
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState<BadgePosition | null>(null);
  const [viewport, setViewport] = useState(getViewport);

  const draggedInteractionRef = useRef(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const dragOriginRef = useRef<BadgePosition | null>(null);
  const startPointRef = useRef<BadgePosition | null>(null);
  const hasMovedRef = useRef(false);

  const anchorPoints = getAnchorPoints(viewport.width, viewport.height);
  const fallbackAnchor = anchorPoints[DEFAULT_ANCHOR_INDEX] ?? anchorPoints[0];
  const inspector = useThemeTokenInspector(isOpen);

  if (!fallbackAnchor) {
    throw new Error("Expected at least one anchor point.");
  }

  const activeAnchor = anchorPoints[anchorIndex] ?? fallbackAnchor;
  const position = dragPosition ?? activeAnchor;
  useEffect(() => {
    let cancelled = false;

    const readAnchor = async () => {
      const stored = (await browser.storage.local.get(STORAGE_KEY)) as Record<string, number | undefined>;

      if (cancelled) {
        return;
      }

      const storedAnchorIndex = stored[STORAGE_KEY];

      if (typeof storedAnchorIndex === "number") {
        setAnchorIndex(storedAnchorIndex);
      }
    };

    void readAnchor();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    void applyStoredLocalhostThemeForCurrentPage();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setViewport(getViewport());
      setDragPosition(null);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!isDragging) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (
        pointerIdRef.current === null ||
        event.pointerId !== pointerIdRef.current ||
        !dragOriginRef.current ||
        !startPointRef.current
      ) {
        return;
      }

      const deltaX = event.clientX - startPointRef.current.x;
      const deltaY = event.clientY - startPointRef.current.y;

      if (!hasMovedRef.current) {
        hasMovedRef.current = Math.hypot(deltaX, deltaY) >= DRAG_THRESHOLD;
      }

      if (!hasMovedRef.current) {
        return;
      }

      event.preventDefault();
      setDragPosition({
        x: dragOriginRef.current.x + deltaX,
        y: dragOriginRef.current.y + deltaY,
      });
    };

    const finishDrag = async (event: PointerEvent) => {
      if (pointerIdRef.current === null || event.pointerId !== pointerIdRef.current) {
        return;
      }

      if (buttonRef.current?.hasPointerCapture(pointerIdRef.current)) {
        buttonRef.current.releasePointerCapture(pointerIdRef.current);
      }

      pointerIdRef.current = null;
      dragOriginRef.current = null;
      startPointRef.current = null;
      setIsDragging(false);

      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", finishDrag);
      window.removeEventListener("pointercancel", finishDrag);

      if (!hasMovedRef.current || !dragPosition) {
        hasMovedRef.current = false;
        setDragPosition(null);
        return;
      }

      const nearestAnchor = findNearestAnchor(dragPosition, viewport.width, viewport.height);

      hasMovedRef.current = false;
      setDragPosition(null);
      setAnchorIndex(nearestAnchor.index);
      draggedInteractionRef.current = true;

      await browser.storage.local.set({
        [STORAGE_KEY]: nearestAnchor.index,
      });
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", finishDrag);
    window.addEventListener("pointercancel", finishDrag);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", finishDrag);
      window.removeEventListener("pointercancel", finishDrag);
    };
  }, [dragPosition, isDragging, viewport.height, viewport.width]);

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) {
      return;
    }

    buttonRef.current = event.currentTarget;
    pointerIdRef.current = event.pointerId;
    dragOriginRef.current = activeAnchor;
    startPointRef.current = { x: event.clientX, y: event.clientY };
    draggedInteractionRef.current = false;
    hasMovedRef.current = false;
    setDragPosition(activeAnchor);
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleClickCapture = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!draggedInteractionRef.current) {
      return;
    }

    draggedInteractionRef.current = false;
    event.preventDefault();
    event.stopPropagation();
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (draggedInteractionRef.current) {
      draggedInteractionRef.current = false;
      return;
    }

    setIsOpen(nextOpen);
  };

  const popoverPlacement = getPopoverPlacement(activeAnchor.id);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[2147483647]"
      data-anchor={activeAnchor.id}
      data-dragging={isDragging}
      data-inspectcn-ui="true"
    >
      <div
        className="pointer-events-auto absolute"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
          <PopoverTrigger
            aria-expanded={isOpen}
            aria-label="Open InspectCN"
            onClickCapture={handleClickCapture}
            data-slot="badge"
            onPointerDown={handlePointerDown}
            render={
              <Button
                className={cn(
                  "touch-none select-none shadow-[0_8px_24px_rgba(15,23,42,0.18)]",
                  isDragging ? "cursor-grabbing" : "cursor-grab",
                )}
                size="icon-lg"
                variant="secondary"
              >
                <InspectcnLogo />
              </Button>
            }
          />

          <PopoverContent
            align={popoverPlacement.align}
            className="h-[min(42rem,calc(100vh-2rem))] w-[min(24rem,calc(100vw-2rem))] gap-2 overflow-hidden font-sans"
            container={shadowRoot}
            initialFocus={false}
            side={popoverPlacement.side}
            sideOffset={10}
          >
            <PopoverHeader className="gap-0.5">
              <PopoverTitle className="font-pixel-line tracking-tight">Inspectcn</PopoverTitle>
              <PopoverDescription className="text-xs">Inspect theme tokens on this page.</PopoverDescription>
            </PopoverHeader>
            <Separator />

            {isOpen && !inspector.snapshots ? (
              <ThemeTokenLoadingState />
            ) : !inspector.snapshots ? (
              <ThemeTokenEmptyState />
            ) : (
              <>
                <ThemeCapturePanel inspector={inspector} />
                <Separator />
                <ThemeTokenTabs inspector={inspector} />
              </>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
