import { GRID_WIDTH, GRID_HEIGHT, TILE_SIZE } from "@/game/building/grid";
import { normalizeWall } from "@/game/building/walls";
import type { WallSegment, WorldCoord } from "@/types/grid";

/**
 * A point on the grid lattice (corner where 4 cells meet), not a cell.
 * Ranges from (0,0) to (GRID_WIDTH, GRID_HEIGHT) inclusive.
 */
export interface GridPoint {
  x: number;
  y: number;
}

/** Snaps a world-space position to the nearest grid corner. */
export function nearestGridPoint(worldPoint: WorldCoord): GridPoint {
  const x = clamp(Math.round(worldPoint.x / TILE_SIZE), 0, GRID_WIDTH);
  const y = clamp(Math.round(worldPoint.y / TILE_SIZE), 0, GRID_HEIGHT);
  return { x, y };
}

/**
 * Computes the wall segments for a drag between two grid points, Prison
 * Architect style:
 * - Drag stays on one axis (horizontal or vertical) -> a single straight line.
 * - Drag moves on both axes -> the full rectangular perimeter between the
 *   two points (four walls), letting a single drag frame an entire room.
 * There is never a diagonal wall.
 */
export function wallsForDrag(start: GridPoint, end: GridPoint): WallSegment[] {
  if (start.x === end.x && start.y === end.y) return [];

  const movesOnBothAxes = start.x !== end.x && start.y !== end.y;
  if (movesOnBothAxes) {
    const xMin = Math.min(start.x, end.x);
    const xMax = Math.max(start.x, end.x);
    const yMin = Math.min(start.y, end.y);
    const yMax = Math.max(start.y, end.y);
    return [
      ...horizontalLine(xMin, xMax, yMin),
      ...horizontalLine(xMin, xMax, yMax),
      ...verticalLine(yMin, yMax, xMin),
      ...verticalLine(yMin, yMax, xMax),
    ];
  }

  if (start.y === end.y) {
    return horizontalLine(Math.min(start.x, end.x), Math.max(start.x, end.x), start.y);
  }
  return verticalLine(Math.min(start.y, end.y), Math.max(start.y, end.y), start.x);
}

function horizontalLine(xMin: number, xMax: number, y: number): WallSegment[] {
  const walls: WallSegment[] = [];
  for (let x = xMin; x < xMax; x++) {
    walls.push(normalizeWall({ cell: { x, y }, edge: "north" }));
  }
  return walls;
}

function verticalLine(yMin: number, yMax: number, x: number): WallSegment[] {
  const walls: WallSegment[] = [];
  for (let y = yMin; y < yMax; y++) {
    walls.push(normalizeWall({ cell: { x, y }, edge: "west" }));
  }
  return walls;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
