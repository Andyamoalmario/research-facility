import * as PIXI from "pixi.js";

const MIN_ZOOM = 0.4;
const MAX_ZOOM = 3;

/**
 * Controls pan/zoom of a Pixi world container. Framework-independent:
 * knows nothing about React, only about the Pixi container it drives.
 */
export class Camera {
  readonly world: PIXI.Container;
  private zoom = 1;

  constructor(world: PIXI.Container) {
    this.world = world;
  }

  getZoom(): number {
    return this.zoom;
  }

  pan(dx: number, dy: number): void {
    this.world.x += dx;
    this.world.y += dy;
  }

  /** Zooms in/out by `factor`, keeping the point under `screenPoint` stationary on screen. */
  zoomAt(screenPoint: PIXI.PointData, factor: number): void {
    const newZoom = clamp(this.zoom * factor, MIN_ZOOM, MAX_ZOOM);
    if (newZoom === this.zoom) return;

    const worldPointBefore = this.screenToWorld(screenPoint);
    this.zoom = newZoom;
    this.world.scale.set(this.zoom);
    const worldPointAfter = this.screenToWorld(screenPoint);

    this.world.x += (worldPointAfter.x - worldPointBefore.x) * this.zoom;
    this.world.y += (worldPointAfter.y - worldPointBefore.y) * this.zoom;
  }

  screenToWorld(point: PIXI.PointData): PIXI.PointData {
    return {
      x: (point.x - this.world.x) / this.zoom,
      y: (point.y - this.world.y) / this.zoom,
    };
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
