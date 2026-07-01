import type { GridCoord } from "@/types/grid";

/**
 * A Room is an enclosed, wall-bounded region of the grid detected by flood-fill.
 * It has no function yet (dormitorio/laboratorio/...) — that gets assigned in a
 * later step, once a room can be selected and given a purpose.
 */
export interface Room {
  /** Stable id derived from the first cell discovered during flood-fill. */
  id: string;
  cells: GridCoord[];
  areaCells: number;
}
