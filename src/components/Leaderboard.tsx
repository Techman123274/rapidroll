"use client";

import { useEffect, useState } from "react";
import { BarChart2, X } from "lucide-react";
import LeaderboardFilters from "./leaderboards/LeaderboardFilters";
import LeaderboardTable from "./leaderboards/LeaderboardTable";

interface ApiEntry {
  _id: string;
  username: string;
  value: number;
  rank?: number;
}

export default function Leaderboard() {
  const [metric, setMetric] = useState("total_coins");
  const [timeframe, setTimeframe] = useState("daily");
  const [scope, setScope] = useState("global");
  const [entries, setEntries] = useState<ApiEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [hiddenByAdmin, setHiddenByAdmin] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const loadVisibility = async () => {
      try {
        const res = await fetch("/api/admin/system/emergency");
        if (!res.ok) return;
        const data = await res.json();
        setHiddenByAdmin(Boolean(data.hideLeaderboard));
      } catch {
        // ignore
      }
    };
    loadVisibility();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          metric,
          timeframe,
          scope,
          limit: "5",
        });
        const res = await fetch(`/api/leaderboards?${params.toString()}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) {
          setEntries(data.entries ?? []);
        }
      } catch {
        if (!cancelled) {
          setEntries([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    const id = setInterval(load, 15000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [metric, timeframe, scope]);

  if (hiddenByAdmin) {
    return null;
  }

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#1a1a1a] bg-[#0d0d0d] px-3 py-2 text-xs text-gray-300 hover:bg-[#141414]"
      >
        <BarChart2 size={14} />
        <span>Show leaderboard</span>
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-[#1a1a1a] bg-[#0d0d0d] p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-bold">🏆 Leaderboard</h3>
        <div className="flex items-center gap-2">
          {loading && <span className="text-xs text-gray-500">Updating…</span>}
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            className="rounded-full p-1 text-xs text-gray-500 hover:bg-[#222] hover:text-gray-200"
            aria-label="Close leaderboard"
          >
            <X size={12} />
          </button>
        </div>
      </div>
      <LeaderboardFilters
        metric={metric}
        timeframe={timeframe}
        scope={scope}
        onChange={(next) => {
          if (next.metric) setMetric(next.metric);
          if (next.timeframe) setTimeframe(next.timeframe);
          if (next.scope) setScope(next.scope);
        }}
      />
      <LeaderboardTable entries={entries} />
    </div>
  );
}
