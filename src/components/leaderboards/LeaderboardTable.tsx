"use client";

interface LeaderboardEntry {
  _id?: string;
  username: string;
  value: number;
  rank?: number;
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
}

export default function LeaderboardTable({ entries }: LeaderboardTableProps) {
  if (!entries.length) {
    return (
      <p className="text-sm text-gray-500">
        No leaderboard data yet. Play some games to populate the rankings.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {entries.map((p, index) => {
        const rank = p.rank ?? index + 1;
        return (
          <li
            key={p._id ?? `${p.username}-${rank}`}
            className="flex items-center gap-3 rounded-lg bg-[#141414]/50 px-3 py-2"
          >
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                rank === 1
                  ? "bg-primary/20 text-primary"
                  : rank === 2
                    ? "bg-gray-400/20 text-gray-300"
                    : rank === 3
                      ? "bg-amber-700/30 text-amber-400"
                      : "bg-[#1a1a1a] text-gray-500"
              }`}
            >
              {rank}
            </span>
            <span className="flex-1 truncate text-sm font-medium">{p.username}</span>
            <span className="text-sm font-bold text-accent-green">
              {p.value.toLocaleString()}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

