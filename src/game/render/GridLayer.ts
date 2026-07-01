import * as PIXI from "pixi.js";
import { GRID_WIDTH, GRID_HEIGHT, TILE_SIZE } from "@/game/building/grid";
import { THEME } from "@/game/render/theme";

/**
 * Draws the static grid of thin lines plus an outer border.
 * This is drawn once — the grid itself never changes, only the camera moves over it.
 */
export function createGridLayer(): PIXI.Graphics {
  const g = new PIXI.Graphics();
  const width = GRID_WIDTH * TILE_SIZE;
  const height = GRID_HEIGHT * TILE_SIZE;

  for (let x = 0; x <= GRID_WIDTH; x++) {
    g.moveTo(x * TILE_SIZE, 0);
    g.lineTo(x * TILE_SIZE, height);
  }
  for (let y = 0; y <= GRID_HEIGHT; y++) {
    g.moveTo(0, y * TILE_SIZE);
    g.lineTo(width, y * TILE_SIZE);
  }
  g.stroke({ width: 1, color: THEME.gridLine, alpha: 0.7 });

  g.rect(0, 0, width, height);
  g.stroke({ width: 2, color: THEME.greenMonitor, alpha: 0.3 });

  return g;
}
