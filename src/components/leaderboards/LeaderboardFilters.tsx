"use client";

interface LeaderboardFiltersProps {
  metric: string;
  timeframe: string;
  scope: string;
  onChange: (next: { metric?: string; timeframe?: string; scope?: string }) => void;
}

export default function LeaderboardFilters({
  metric,
  timeframe,
  scope,
  onChange,
}: LeaderboardFiltersProps) {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
      <select
        value={metric}
        onChange={(e) => onChange({ metric: e.target.value })}
        className="rounded-lg border border-[#333] bg-[#141414] px-2 py-1 text-xs text-white"
      >
        <option value="total_coins">Total Coins</option>
        <option value="highest_win">Highest Win</option>
        <option value="consistency">Consistency</option>
      </select>
      <select
        value={timeframe}
        onChange={(e) => onChange({ timeframe: e.target.value })}
        className="rounded-lg border border-[#333] bg-[#141414] px-2 py-1 text-xs text-white"
      >
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
        <option value="all_time">All Time</option>
      </select>
      <select
        value={scope}
        onChange={(e) => onChange({ scope: e.target.value })}
        className="rounded-lg border border-[#333] bg-[#141414] px-2 py-1 text-xs text-white"
      >
        <option value="global">Global</option>
        <option value="game">Game-specific</option>
      </select>
    </div>
  );
}

