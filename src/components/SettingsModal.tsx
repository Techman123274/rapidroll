"use client";

import { useState } from "react";
import { useDashboard } from "@/context/DashboardContext";

export default function SettingsModal() {
  const { settingsOpen, setSettingsOpen, currency, setCurrency } = useDashboard();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [chatEnabled, setChatEnabled] = useState(true);

  if (!settingsOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm"
      onClick={() => setSettingsOpen(false)}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-[#1a1a1a] bg-[#121212] p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setSettingsOpen(false)}
          className="absolute right-5 top-5 text-gray-500 hover:text-white"
          aria-label="Close"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold">Settings</h2>

        <div className="mt-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400">
              Display Currency
            </label>
            <div className="mt-2 flex gap-2">
              {["ETH", "BTC", "RC"].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCurrency(c)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium ${
                    currency === c
                      ? "bg-primary text-black"
                      : "bg-[#1a1a1a] text-gray-400 hover:bg-[#222]"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-[#1a1a1a] p-4">
            <span className="text-sm">Sound effects</span>
            <button
              type="button"
              role="switch"
              aria-checked={soundEnabled}
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                soundEnabled ? "bg-primary" : "bg-[#333]"
              }`}
            >
              <span
                className={`absolute top-0.5 block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  soundEnabled ? "left-6 translate-x-0" : "left-0.5"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-[#1a1a1a] p-4">
            <span className="text-sm">Global chat</span>
            <button
              type="button"
              role="switch"
              aria-checked={chatEnabled}
              onClick={() => setChatEnabled(!chatEnabled)}
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                chatEnabled ? "bg-primary" : "bg-[#333]"
              }`}
            >
              <span
                className={`absolute top-0.5 block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  chatEnabled ? "left-6 translate-x-0" : "left-0.5"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
