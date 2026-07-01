import type { GridCoord, WorldCoord } from "@/types/grid";

/** Size of a single grid cell in world pixels (before camera zoom). */
export const TILE_SIZE = 32;

/** Default map dimensions, in cells. */
export const GRID_WIDTH = 80;
export const GRID_HEIGHT = 60;

/** Converts a grid cell coordinate to the world-space position of its top-left corner. */
export function gridToWorld(cell: GridCoord): WorldCoord {
  return {
    x: cell.x * TILE_SIZE,
    y: cell.y * TILE_SIZE,
  };
}

/** Converts a world-space position to the grid cell that contains it. */
export function worldToGrid(point: WorldCoord): GridCoord {
  return {
    x: Math.floor(point.x / TILE_SIZE),
    y: Math.floor(point.y / TILE_SIZE),
  };
}

/** Returns true if the given cell lies within the map bounds. */
export function isInBounds(cell: GridCoord): boolean {
  return cell.x >= 0 && cell.y >= 0 && cell.x < GRID_WIDTH && cell.y < GRID_HEIGHT;
}
