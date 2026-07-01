import * as PIXI from "pixi.js";
import { Camera } from "@/game/render/Camera";
import { createGridLayer } from "@/game/render/GridLayer";
import { WallLayer } from "@/game/render/WallLayer";
import { GhostWallLayer } from "@/game/render/GhostWallLayer";
import { RoomLayer } from "@/game/render/RoomLayer";
import { THEME } from "@/game/render/theme";
import { nearestGridPoint, wallsForDrag } from "@/game/building/wallDrag";
import type { GridPoint } from "@/game/building/wallDrag";
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
  private ghostWallLayer: GhostWallLayer;
  private roomLayer: RoomLayer;
  private unsubscribeStore: () => void = () => {};

  private isPanning = false;
  private lastPointerScreen: WorldCoord = { x: 0, y: 0 };

  /** Start corner of an in-progress wall drag, in grid-point coordinates (null when not dragging). */
  private wallDragStart: GridPoint | null = null;

  private constructor(
    app: PIXI.Application,
    camera: Camera,
    wallLayer: WallLayer,
    ghostWallLayer: GhostWallLayer,
    roomLayer: RoomLayer,
  ) {
    this.app = app;
    this.camera = camera;
    this.wallLayer = wallLayer;
    this.ghostWallLayer = ghostWallLayer;
    this.roomLayer = roomLayer;
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

    const roomLayer = new RoomLayer();
    world.addChild(roomLayer.graphics);

    world.addChild(createGridLayer());

    const wallLayer = new WallLayer();
    world.addChild(wallLayer.graphics);

    const ghostWallLayer = new GhostWallLayer();
    world.addChild(ghostWallLayer.graphics);

    const game = new PixiGame(app, camera, wallLayer, ghostWallLayer, roomLayer);
    game.setupInput(container);
    game.subscribeToStore();

    return game;
  }

  private subscribeToStore(): void {
    const state = buildingStore.getState();
    this.wallLayer.redraw(state.walls.values());
    this.roomLayer.redraw(state.rooms);

    this.unsubscribeStore = buildingStore.subscribe((next) => {
      this.wallLayer.redraw(next.walls.values());
      this.roomLayer.redraw(next.rooms);
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
        this.wallDragStart = nearestGridPoint(this.camera.screenToWorld(e.global));
      }
    });

    stage.on("pointermove", (e: PIXI.FederatedPointerEvent) => {
      if (this.isPanning) {
        const dx = e.global.x - this.lastPointerScreen.x;
        const dy = e.global.y - this.lastPointerScreen.y;
        this.camera.pan(dx, dy);
        this.lastPointerScreen = { x: e.global.x, y: e.global.y };
      } else if (this.wallDragStart) {
        const current = nearestGridPoint(this.camera.screenToWorld(e.global));
        this.ghostWallLayer.redraw(wallsForDrag(this.wallDragStart, current));
      }
    });

    const commitWallDrag = (e: PIXI.FederatedPointerEvent) => {
      if (!this.wallDragStart) return;
      const end = nearestGridPoint(this.camera.screenToWorld(e.global));
      const walls = wallsForDrag(this.wallDragStart, end);
      for (const wall of walls) {
        buildingStore.getState().addWall(wall);
      }
      this.wallDragStart = null;
      this.ghostWallLayer.redraw([]);
    };

    stage.on("pointerup", (e: PIXI.FederatedPointerEvent) => {
      this.isPanning = false;
      commitWallDrag(e);
    });
    stage.on("pointerupoutside", (e: PIXI.FederatedPointerEvent) => {
      this.isPanning = false;
      commitWallDrag(e);
    });

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

  destroy(): void {
    this.unsubscribeStore();
    this.app.destroy(true, { children: true });
  }
}
