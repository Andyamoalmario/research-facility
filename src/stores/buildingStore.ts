import { createStore } from "zustand/vanilla";
import { useStore } from "zustand/react";
import type { WallSegment } from "@/types/grid";
import { wallKey } from "@/types/grid";

export type BuildTool = "none" | "wall" | "demolish";

export interface BuildingState {
  activeTool: BuildTool;
  /** Placed walls, keyed by wallKey() for O(1) lookup and de-duplication. */
  walls: Map<string, WallSegment>;
  setTool: (tool: BuildTool) => void;
  addWall: (wall: WallSegment) => void;
  removeWall: (wall: WallSegment) => void;
  hasWall: (wall: WallSegment) => boolean;
}

/**
 * Vanilla store — no React dependency. This is what the Pixi engine layer
 * subscribes to directly, keeping the simulation/render code framework-agnostic.
 */
export const buildingStore = createStore<BuildingState>((set, get) => ({
  activeTool: "none",
  walls: new Map(),

  setTool: (tool) => set({ activeTool: tool }),

  addWall: (wall) =>
    set((state) => {
      const key = wallKey(wall);
      if (state.walls.has(key)) return state;
      const next = new Map(state.walls);
      next.set(key, wall);
      return { walls: next };
    }),

  removeWall: (wall) =>
    set((state) => {
      const key = wallKey(wall);
      if (!state.walls.has(key)) return state;
      const next = new Map(state.walls);
      next.delete(key);
      return { walls: next };
    }),

  hasWall: (wall) => get().walls.has(wallKey(wall)),
}));

/** React hook wrapper for use inside components — selector-based to avoid over-rendering. */
export function useBuildingStore<T>(selector: (state: BuildingState) => T): T {
  return useStore(buildingStore, selector);
}
