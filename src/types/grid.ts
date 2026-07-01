/**
 * Coordinate types for the building grid.
 *
 * GridCoord = discrete cell coordinates (integers, e.g. { x: 12, y: 4 })
 * WorldCoord = continuous pixel coordinates in the Pixi world/camera space
 */

export interface GridCoord {
  x: number;
  y: number;
}

export interface WorldCoord {
  x: number;
  y: number;
}

/** Cardinal edge of a grid cell, used for wall placement. */
export type CellEdge = "north" | "south" | "east" | "west";

/**
 * A wall segment is stored on the edge between two cells, identified by
 * the cell it "belongs to" plus which edge of that cell it occupies.
 * This avoids storing duplicate walls when two cells share a border.
 */
export interface WallSegment {
  cell: GridCoord;
  edge: CellEdge;
}

/** Serializes a GridCoord into a stable string key for use in Maps/Sets. */
export function gridKey(cell: GridCoord): string {
  return `${cell.x},${cell.y}`;
}

/** Serializes a WallSegment into a stable string key for use in Maps/Sets. */
export function wallKey(wall: WallSegment): string {
  return `${wall.cell.x},${wall.cell.y}:${wall.edge}`;
}
