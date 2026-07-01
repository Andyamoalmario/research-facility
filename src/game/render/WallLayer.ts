import * as PIXI from "pixi.js";
import type { WallSegment } from "@/types/grid";
import { edgeEndpoints } from "@/game/building/walls";
import { THEME } from "@/game/render/theme";

const WALL_THICKNESS = 4;

/**
 * Owns the Graphics object used to draw all placed walls.
 * Call redraw() whenever the wall set changes — full redraw is cheap
 * enough for the wall counts this game will realistically have.
 */
export class WallLayer {
  readonly graphics: PIXI.Graphics;

  constructor() {
    this.graphics = new PIXI.Graphics();
  }

  redraw(walls: Iterable<WallSegment>): void {
    this.graphics.clear();
    for (const wall of walls) {
      const [a, b] = edgeEndpoints(wall.cell, wall.edge);
      this.graphics.moveTo(a.x, a.y).lineTo(b.x, b.y);
    }
    this.graphics.stroke({
      width: WALL_THICKNESS,
      color: THEME.textPrimary,
      cap: "square",
    });
  }
}
