import * as PIXI from "pixi.js";
import { Camera } from "@/game/render/Camera";
import { createGridLayer } from "@/game/render/GridLayer";
import { WallLayer } from "@/game/render/WallLayer";
import { THEME } from "@/game/render/theme";
import { worldToGrid, isInBounds } from "@/game/building/grid";
import { closestEdge, normalizeWall } from "@/game/building/walls";
import { buildingStore } from "@/stores/buildingStore";
import type { WorldCoord } from "@/types/grid";

const ZOOM_STEP = 1.1;

/**
 * Owns the Pixi Application and everything drawn inside it: camera, grid,
 * walls, and raw pointer/wheel input. Knows nothing about React — it is
 * mounted into a plain HTMLDivElement and driven by DOM events and the
 * vanilla building store.
 */
export class PixiGame {
  readonly app: PIXI.Application;
  readonly camera: Camera;

  private wallLayer: WallLayer;
  private unsubscribeWalls: () => void = () => {};

  private isPanning = false;
  private isPaintingWalls = false;
  private lastPointerScreen: WorldCoord = { x: 0, y: 0 };

  private constructor(app: PIXI.Application, camera: Camera, wallLayer: WallLayer) {
    this.app = app;
    this.camera = camera;
    this.wallLayer = wallLayer;
  }

  static async create(container: HTMLDivElement): Promise<PixiGame> {
    const app = new PIXI.Application();
    await app.init({
      resizeTo: container,
      backgroundColor: THEME.bgVoid,
      antialias: true,
      autoDensity: true,
      resolution: window.devicePixelRatio || 1,
    });
    container.appendChild(app.canvas);

    const world = new PIXI.Container();
    app.stage.addChild(world);

    const camera = new Camera(world);
    camera.pan(64, 48); // small initial offset so the map origin isn't flush with the corner

    world.addChild(createGridLayer());

    const wallLayer = new WallLayer();
    world.addChild(wallLayer.graphics);

    const game = new PixiGame(app, camera, wallLayer);
    game.setupInput(container);
    game.subscribeToStore();

    return game;
  }

  private subscribeToStore(): void {
    this.wallLayer.redraw(buildingStore.getState().walls.values());
    this.unsubscribeWalls = buildingStore.subscribe((state) => {
      this.wallLayer.redraw(state.walls.values());
    });
  }

  private setupInput(container: HTMLDivElement): void {
    const stage = this.app.stage;
    stage.eventMode = "static";
    stage.hitArea = this.app.screen;

    container.addEventListener("contextmenu", (e) => e.preventDefault());

    stage.on("pointerdown", (e: PIXI.FederatedPointerEvent) => {
      const tool = buildingStore.getState().activeTool;
      const isRightButton = e.button === 2;
      const isLeftButton = e.button === 0;

      if (isRightButton || (isLeftButton && tool === "none")) {
        this.isPanning = true;
        this.lastPointerScreen = { x: e.global.x, y: e.global.y };
      } else if (isLeftButton && tool === "wall") {
        this.isPaintingWalls = true;
        this.paintWallAt(e.global);
      }
    });

    stage.on("pointermove", (e: PIXI.FederatedPointerEvent) => {
      if (this.isPanning) {
        const dx = e.global.x - this.lastPointerScreen.x;
        const dy = e.global.y - this.lastPointerScreen.y;
        this.camera.pan(dx, dy);
        this.lastPointerScreen = { x: e.global.x, y: e.global.y };
      } else if (this.isPaintingWalls) {
        this.paintWallAt(e.global);
      }
    });

    const stopInteraction = () => {
      this.isPanning = false;
      this.isPaintingWalls = false;
    };
    stage.on("pointerup", stopInteraction);
    stage.on("pointerupoutside", stopInteraction);

    container.addEventListener(
      "wheel",
      (e: WheelEvent) => {
        e.preventDefault();
        const rect = container.getBoundingClientRect();
        const screenPoint = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        const factor = e.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP;
        this.camera.zoomAt(screenPoint, factor);
      },
      { passive: false },
    );
  }

  private paintWallAt(screenPoint: PIXI.PointData): void {
    const worldPoint = this.camera.screenToWorld(screenPoint);
    const cell = worldToGrid(worldPoint);
    if (!isInBounds(cell)) return;

    const edge = closestEdge(worldPoint, cell);
    const wall = normalizeWall({ cell, edge });
    buildingStore.getState().addWall(wall);
  }

  destroy(): void {
    this.unsubscribeWalls();
    this.app.destroy(true, { children: true });
  }
}
