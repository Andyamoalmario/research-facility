import { useEffect, useRef } from "react";
import { PixiGame } from "@/game/render/PixiGame";

/**
 * Mounts a PixiGame instance into the returned container ref on mount,
 * and destroys it on unmount. Handles React StrictMode's double-invoke
 * in development by guarding against a stale async init.
 */
export function usePixiGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<PixiGame | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;

    PixiGame.create(container).then((game) => {
      if (cancelled) {
        game.destroy();
        return;
      }
      gameRef.current = game;
    });

    return () => {
      cancelled = true;
      gameRef.current?.destroy();
      gameRef.current = null;
    };
  }, []);

  return containerRef;
}
