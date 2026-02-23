"use client";

import Link from "next/link";
import CryptoMinesGame from "./CryptoMinesGame";
import LunarCrashGame from "./LunarCrashGame";
import { DEFAULT_GAMES } from "@/lib/games-data";

interface GameRendererProps {
  slug: string;
}

export default function GameRenderer({ slug }: GameRendererProps) {
  const game = DEFAULT_GAMES.find((g) => g.slug === slug);

  if (!game) return null;

  if (slug === "crypto-mines") {
    return <CryptoMinesGame />;
  }

  if (slug === "lunar-crash") {
    return <LunarCrashGame />;
  }

  // External iframe for other games
  return (
    <div className="flex h-screen flex-col bg-[#070707]">
      <header className="flex h-16 items-center border-b border-[#1a1a1a] bg-[#0a0a0a] px-6">
        <Link
          href="/play"
          className="mr-6 text-gray-500 transition-colors hover:text-white"
        >
          ← Back
        </Link>
        <h1 className="text-xl font-bold">{game.title}</h1>
      </header>
      <div className="relative flex-1 p-6">
        <div className="aspect-video h-full w-full overflow-hidden rounded-2xl border border-[#1a1a1a] bg-black">
          <iframe
            src={game.providerUrl}
            title={game.title}
            className="h-full w-full"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
