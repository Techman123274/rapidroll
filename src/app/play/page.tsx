"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import JackpotBanner from "@/components/JackpotBanner";
import GameGrid from "@/components/GameGrid";
import { DEFAULT_GAMES } from "@/lib/games-data";

const CATEGORIES = [
  { id: "all", label: "All Games" },
  { id: "Originals", label: "Originals" },
  { id: "Slots", label: "Slots" },
];

export default function PlayPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredGames = useMemo(() => {
    if (activeCategory === "all") return DEFAULT_GAMES;
    return DEFAULT_GAMES.filter((g) => g.category === activeCategory);
  }, [activeCategory]);

  const trendingGames = DEFAULT_GAMES.filter((g) => g.featured).slice(0, 4);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Jackpot Banner */}
      <JackpotBanner />

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-colors ${
              activeCategory === cat.id
                ? "bg-primary text-black"
                : "bg-[#141414] text-gray-400 hover:bg-[#1a1a1a] hover:text-white"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Trending Now */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            🔥 Trending Now
            <span className="text-sm font-normal text-gray-500">
              {trendingGames.length} games
            </span>
          </h2>
          <Link
            href="/slots"
            className="text-sm font-medium text-primary transition-colors hover:underline"
          >
            View All
          </Link>
        </div>
        <GameGrid games={trendingGames} />
      </section>

      {/* Full Game Grid */}
      <section>
        <h2 className="mb-4 text-xl font-bold">All Games</h2>
        <GameGrid games={filteredGames} />
      </section>
    </div>
  );
}
