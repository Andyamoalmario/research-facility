import { GRID_WIDTH, GRID_HEIGHT } from "@/game/building/grid";
import { normalizeWall } from "@/game/building/walls";
import { wallKey, gridKey } from "@/types/grid";
import type { GridCoord, WallSegment, CellEdge } from "@/types/grid";
import type { Room } from "@/types/room";

/** Enclosed regions smaller than this are ignored — avoids stray 1-cell pockets registering as rooms. */
const MIN_ROOM_CELLS = 4;

const NEIGHBOR_OFFSETS: { edge: CellEdge; dx: number; dy: number }[] = [
  { edge: "north", dx: 0, dy: -1 },
  { edge: "south", dx: 0, dy: 1 },
  { edge: "west", dx: -1, dy: 0 },
  { edge: "east", dx: 1, dy: 0 },
];

function hasWallOnEdge(wallKeys: Set<string>, cell: GridCoord, edge: CellEdge): boolean {
  return wallKeys.has(wallKey(normalizeWall({ cell, edge })));
}

/**
 * Flood-fills the whole grid, partitioning it into connected regions separated
 * by walls. A region that can reach the outside of the map through any unwalled
 * boundary edge is "open" and is not a room. Fully enclosed regions become Rooms.
 *
 * Recomputes from scratch every call. At the current map size (80x60 = 4800
 * cells) this is cheap enough to run on every wall edit. If the map grows much
 * larger, this can be optimized to re-flood only the region touched by the edit.
 */
export function detectRooms(walls: Map<string, WallSegment>): Room[] {
  const wallKeys = new Set(walls.keys());
  const visited = new Set<string>();
  const rooms: Room[] = [];

  for (let y = 0; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      const start: GridCoord = { x, y };
      const startKey = gridKey(start);
      if (visited.has(startKey)) continue;

      const component: GridCoord[] = [];
      const queue: GridCoord[] = [start];
      visited.add(startKey);
      let touchesOutside = false;

      while (queue.length > 0) {
        const cell = queue.pop()!;
        component.push(cell);

        for (const { edge, dx, dy } of NEIGHBOR_OFFSETS) {
          if (hasWallOnEdge(wallKeys, cell, edge)) continue;

          const neighbor: GridCoord = { x: cell.x + dx, y: cell.y + dy };
          const outOfBounds =
            neighbor.x < 0 || neighbor.y < 0 || neighbor.x >= GRID_WIDTH || neighbor.y >= GRID_HEIGHT;

          if (outOfBounds) {
            touchesOutside = true;
            continue;
          }

          const neighborKey = gridKey(neighbor);
          if (visited.has(neighborKey)) continue;
          visited.add(neighborKey);
          queue.push(neighbor);
        }
      }

      if (!touchesOutside && component.length >= MIN_ROOM_CELLS) {
        rooms.push({
          id: startKey,
          cells: component,
          areaCells: component.length,
        });
      }
    }
  }

  return rooms;
}
