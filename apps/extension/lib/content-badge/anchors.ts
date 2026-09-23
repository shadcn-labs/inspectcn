export const BADGE_MARGIN = 16;
export const BADGE_SIZE = 40;
export const DEFAULT_ANCHOR_INDEX = 1;

export type BadgePosition = {
  x: number;
  y: number;
};

export type AnchorId =
  | "top-left"
  | "top-center"
  | "top-right"
  | "middle-left"
  | "middle-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type AnchorPoint = BadgePosition & {
  id: AnchorId;
  index: number;
};

export type PopoverPlacement = {
  align: "start" | "center" | "end";
  side: "top" | "right" | "bottom" | "left";
};

export function getAnchorPoints(viewportWidth: number, viewportHeight: number): AnchorPoint[] {
  const centerX = viewportWidth / 2 - BADGE_SIZE / 2;
  const centerY = viewportHeight / 2 - BADGE_SIZE / 2;
  const maxX = viewportWidth - BADGE_MARGIN - BADGE_SIZE;
  const maxY = viewportHeight - BADGE_MARGIN - BADGE_SIZE;

  return [
    { id: "top-left", index: 0, x: BADGE_MARGIN, y: BADGE_MARGIN },
    { id: "top-center", index: 1, x: centerX, y: BADGE_MARGIN },
    { id: "top-right", index: 2, x: maxX, y: BADGE_MARGIN },
    { id: "middle-left", index: 3, x: BADGE_MARGIN, y: centerY },
    { id: "middle-right", index: 4, x: maxX, y: centerY },
    { id: "bottom-left", index: 5, x: BADGE_MARGIN, y: maxY },
    { id: "bottom-center", index: 6, x: centerX, y: maxY },
    { id: "bottom-right", index: 7, x: maxX, y: maxY },
  ];
}

export function findNearestAnchor(position: BadgePosition, viewportWidth: number, viewportHeight: number): AnchorPoint {
  const anchorPoints = getAnchorPoints(viewportWidth, viewportHeight);
  const fallbackAnchor = anchorPoints[DEFAULT_ANCHOR_INDEX] ?? anchorPoints[0];

  if (!fallbackAnchor) {
    throw new Error("Expected at least one anchor point.");
  }

  return anchorPoints.reduce((nearest, point) => {
    const nearestDistance = Math.hypot(nearest.x - position.x, nearest.y - position.y);
    const distance = Math.hypot(point.x - position.x, point.y - position.y);

    return distance < nearestDistance ? point : nearest;
  }, fallbackAnchor);
}

export function getPopoverPlacement(anchorId: AnchorId): PopoverPlacement {
  switch (anchorId) {
    case "top-left":
      return { side: "bottom", align: "start" };
    case "top-center":
      return { side: "bottom", align: "center" };
    case "top-right":
      return { side: "bottom", align: "end" };
    case "middle-left":
      return { side: "right", align: "center" };
    case "middle-right":
      return { side: "left", align: "center" };
    case "bottom-left":
      return { side: "top", align: "start" };
    case "bottom-center":
      return { side: "top", align: "center" };
    case "bottom-right":
      return { side: "top", align: "end" };
  }
}
