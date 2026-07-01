import * as PIXI from "pixi.js";
import type { WallSegment } from "@/types/grid";
import { edgeEndpoints } from "@/game/building/walls";
import { THEME } from "@/game/render/theme";

/**
 * Renders the in-progress wall preview while the player is dragging —
 * translucent, thinner than a committed wall, cleared once the drag ends
 * (either committed to the store or cancelled).
 */
export class GhostWallLayer {
  readonly graphics: PIXI.Graphics;

  constructor() {
    this.graphics = new PIXI.Graphics();
  }

  redraw(walls: WallSegment[]): void {
    this.graphics.clear();
    if (walls.length === 0) return;

    for (const wall of walls) {
      const [a, b] = edgeEndpoints(wall.cell, wall.edge);
      this.graphics.moveTo(a.x, a.y).lineTo(b.x, b.y);
    }
    this.graphics.stroke({
      width: 5,
      color: THEME.greenMonitor,
      alpha: 0.45,
      cap: "square",
    });
  }
}
