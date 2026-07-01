"use client";

import { usePixiGame } from "@/hooks/usePixiGame";

export function GameCanvas() {
  const containerRef = usePixiGame();

  return (
    <div
      ref={containerRef}
      className="h-full w-full cursor-crosshair select-none overflow-hidden bg-bg-void"
    />
  );
}
