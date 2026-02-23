"use client";

import { useEffect, useState } from "react";

export default function AdminSettingsPage() {
  const [gamesPaused, setGamesPaused] = useState(false);
  const [chatDisabled, setChatDisabled] = useState(false);
  const [promotionsDisabled, setPromotionsDisabled] = useState(false);
  const [hideChat, setHideChat] = useState(false);
  const [hideLeaderboard, setHideLeaderboard] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/system/emergency");
        if (!res.ok) return;
        const data = await res.json();
        setGamesPaused(data.gamesPaused);
        setChatDisabled(data.chatDisabled);
        setPromotionsDisabled(data.promotionsDisabled);
        setHideChat(Boolean(data.hideChat));
        setHideLeaderboard(Boolean(data.hideLeaderboard));
      } catch {
        // ignore
      }
    };
    load();
  }, []);

  const save = async () => {
    try {
      await fetch("/api/admin/system/emergency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gamesPaused,
          chatDisabled,
          promotionsDisabled,
          hideChat,
          hideLeaderboard,
        }),
      });
    } catch {
      // TODO: surface error toasts
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-[#1a1a1a] bg-[#050505] p-4 text-xs">
        <h2 className="mb-2 text-sm font-semibold text-white">Emergency Mode</h2>
        <p className="mb-3 text-gray-500">
          Quickly pause games or disable chat/promotions if something goes wrong. This
          page controls a simple in-memory config stubbed behind an API.
        </p>
        <div className="space-y-2">
          <ToggleRow
            label="Pause all games"
            checked={gamesPaused}
            onChange={setGamesPaused}
          />
          <ToggleRow
            label="Disable chat"
            checked={chatDisabled}
            onChange={setChatDisabled}
          />
          <ToggleRow
            label="Disable promotions"
            checked={promotionsDisabled}
            onChange={setPromotionsDisabled}
          />
        </div>
        <button
          type="button"
          onClick={save}
          className="mt-3 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-black"
        >
          Save Emergency State
        </button>
      </section>

      <section className="rounded-xl border border-[#1a1a1a] bg-[#050505] p-4 text-xs">
        <h2 className="mb-2 text-sm font-semibold text-white">Layout Visibility</h2>
        <p className="mb-3 text-gray-500">
          Control whether global chat and the main leaderboard are visible across the
          player-facing dashboard.
        </p>
        <div className="space-y-2">
          <ToggleRow
            label="Hide chat"
            checked={hideChat}
            onChange={setHideChat}
          />
          <ToggleRow
            label="Hide leaderboard"
            checked={hideLeaderboard}
            onChange={setHideLeaderboard}
          />
        </div>
      </section>

      <section className="rounded-xl border border-[#1a1a1a] bg-[#050505] p-4 text-xs">
        <h2 className="mb-2 text-sm font-semibold text-white">Mines & Game Audio</h2>
        <p className="mb-3 text-gray-500">
          The in-game Mines panel already exposes per-session volume and mute controls.
          Use this section if you later want to introduce global defaults or hard limits.
        </p>
        <ul className="list-disc pl-4 text-[11px] text-gray-400">
          <li>Global master volume limits for all games.</li>
          <li>Per-game overrides for particularly loud SFX.</li>
          <li>Preset profiles (e.g. streamer mode).</li>
        </ul>
      </section>
    </div>
  );
}

interface ToggleRowProps {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

function ToggleRow({ label, checked, onChange }: ToggleRowProps) {
  return (
    <label className="flex items-center justify-between gap-4">
      <span className="text-gray-200">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-[#333] bg-[#141414]"
      />
    </label>
  );
}

