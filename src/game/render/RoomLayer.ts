import * as PIXI from "pixi.js";
import type { Room } from "@/types/room";
import { TILE_SIZE } from "@/game/building/grid";
import { THEME } from "@/game/render/theme";

/**
 * Draws a subtle floor tint over every cell belonging to a detected room.
 * Purely a readout of buildingStore.rooms — carries no logic of its own.
 */
export class RoomLayer {
  readonly graphics: PIXI.Graphics;

  constructor() {
    this.graphics = new PIXI.Graphics();
  }

  redraw(rooms: Room[]): void {
    this.graphics.clear();
    for (const room of rooms) {
      for (const cell of room.cells) {
        this.graphics.rect(cell.x * TILE_SIZE, cell.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
    this.graphics.fill({ color: THEME.greenMonitor, alpha: 0.08 });
  }
}
