import Leaderboard from "@/components/Leaderboard";

export default function AdminLeaderboardsPage() {
  return (
    <div className="space-y-4">
      <section>
        <h2 className="mb-2 text-sm font-semibold text-white">Live Leaderboards</h2>
        <p className="mb-3 text-xs text-gray-500">
          Inspect how players are ranking across different metrics and timeframes. For
          resets or adjustments, add admin-only mutations on top of the{" "}
          <code className="rounded bg-[#111] px-1 py-0.5">/api/leaderboards</code> API.
        </p>
        <Leaderboard />
      </section>
    </div>
  );
}

