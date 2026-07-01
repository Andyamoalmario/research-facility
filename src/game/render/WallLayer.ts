import * as PIXI from "pixi.js";
import type { WallSegment } from "@/types/grid";
import { edgeEndpoints } from "@/game/building/walls";
import { THEME } from "@/game/render/theme";

const WALL_THICKNESS = 6;
const WALL_HIGHLIGHT_THICKNESS = 2;

/**
 * Owns the Graphics object used to draw all placed walls.
 * Call redraw() whenever the wall set changes — full redraw is cheap
 * enough for the wall counts this game will realistically have.
 *
 * Drawn as two overlaid strokes (dark base + thin light highlight) to give
 * a beveled, technical look rather than a flat line.
 */
export class WallLayer {
  readonly graphics: PIXI.Graphics;

  constructor() {
    this.graphics = new PIXI.Graphics();
  }

  redraw(walls: Iterable<WallSegment>): void {
    this.graphics.clear();
    const segments = Array.from(walls);
    if (segments.length === 0) return;

    for (const wall of segments) {
      const [a, b] = edgeEndpoints(wall.cell, wall.edge);
      this.graphics.moveTo(a.x, a.y).lineTo(b.x, b.y);
    }
    this.graphics.stroke({
      width: WALL_THICKNESS,
      color: THEME.bgPanel,
      cap: "square",
      join: "round",
    });

    for (const wall of segments) {
      const [a, b] = edgeEndpoints(wall.cell, wall.edge);
      this.graphics.moveTo(a.x, a.y).lineTo(b.x, b.y);
    }
    this.graphics.stroke({
      width: WALL_HIGHLIGHT_THICKNESS,
      color: THEME.textPrimary,
      alpha: 0.8,
      cap: "square",
    });
  }
}

