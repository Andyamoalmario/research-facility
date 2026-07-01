import type { CellEdge, GridCoord, WallSegment, WorldCoord } from "@/types/grid";
import { TILE_SIZE } from "@/game/building/grid";

/** Returns the two world-space endpoints of a cell's edge, for drawing a wall segment. */
export function edgeEndpoints(cell: GridCoord, edge: CellEdge): [WorldCoord, WorldCoord] {
  const x0 = cell.x * TILE_SIZE;
  const y0 = cell.y * TILE_SIZE;
  const x1 = x0 + TILE_SIZE;
  const y1 = y0 + TILE_SIZE;

  switch (edge) {
    case "north":
      return [{ x: x0, y: y0 }, { x: x1, y: y0 }];
    case "south":
      return [{ x: x0, y: y1 }, { x: x1, y: y1 }];
    case "west":
      return [{ x: x0, y: y0 }, { x: x0, y: y1 }];
    case "east":
      return [{ x: x1, y: y0 }, { x: x1, y: y1 }];
  }
}

/**
 * Given a world-space point and the grid cell it falls in, determines which of the
 * cell's four edges the point is closest to. Used to translate a mouse position into
 * "which wall the player is pointing at".
 */
export function closestEdge(point: WorldCoord, cell: GridCoord): CellEdge {
  const localX = point.x - cell.x * TILE_SIZE;
  const localY = point.y - cell.y * TILE_SIZE;

  const distances: Record<CellEdge, number> = {
    north: localY,
    south: TILE_SIZE - localY,
    west: localX,
    east: TILE_SIZE - localX,
  };

  let closest: CellEdge = "north";
  let minDistance = distances.north;
  for (const edge of ["south", "west", "east"] as CellEdge[]) {
    if (distances[edge] < minDistance) {
      minDistance = distances[edge];
      closest = edge;
    }
  }
  return closest;
}

/**
 * Normalizes a wall so that shared edges between neighboring cells always resolve
 * to the same segment (e.g. cell A's east edge === cell B's west edge). Prevents
 * double-walls being drawn on the same border from two different cells.
 */
export function normalizeWall(wall: WallSegment): WallSegment {
  if (wall.edge === "south") {
    return { cell: { x: wall.cell.x, y: wall.cell.y + 1 }, edge: "north" };
  }
  if (wall.edge === "east") {
    return { cell: { x: wall.cell.x + 1, y: wall.cell.y }, edge: "west" };
  }
  return wall;
}
