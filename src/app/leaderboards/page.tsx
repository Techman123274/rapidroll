"use client";

import Leaderboard from "@/components/Leaderboard";

export default function LeaderboardsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-white">Global Leaderboards</h1>
        <p className="text-sm text-gray-500">
          Track the top players across Rapid Role. Filter by metric, timeframe, and scope to see
          who&apos;s running hot.
        </p>
      </header>
      <section>
        <Leaderboard />
      </section>
    </div>
  );
}

