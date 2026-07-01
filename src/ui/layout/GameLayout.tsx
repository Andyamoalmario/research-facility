"use client";

import { GameCanvas } from "@/ui/components/GameCanvas";
import { Toolbar } from "@/ui/components/Toolbar";
import { Inspector } from "@/ui/components/Inspector";
import { EventLog } from "@/ui/components/EventLog";
import { ResourceBar } from "@/ui/hud/ResourceBar";

export function GameLayout() {
  return (
    <div className="flex h-screen w-screen flex-col bg-bg-void text-text-primary">
      <ResourceBar />
      <div className="flex flex-1 overflow-hidden">
        <Toolbar />
        <main className="relative flex-1 overflow-hidden">
          <GameCanvas />
        </main>
        <Inspector />
      </div>
      <EventLog />
    </div>
  );
}
