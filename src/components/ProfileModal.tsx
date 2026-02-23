"use client";

import { useDashboard } from "@/context/DashboardContext";

export default function ProfileModal() {
  const { profileOpen, setProfileOpen, setSettingsOpen } = useDashboard();

  if (!profileOpen) return null;

  const openSettings = () => {
    setProfileOpen(false);
    setSettingsOpen(true);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm"
      onClick={() => setProfileOpen(false)}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-[#1a1a1a] bg-[#121212] p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setProfileOpen(false)}
          className="absolute right-5 top-5 text-gray-500 hover:text-white"
          aria-label="Close"
        >
          ✕
        </button>
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary font-black text-2xl text-black">
            P
          </div>
          <h3 className="text-lg font-bold">Player</h3>
          <p className="mt-1 text-sm text-gray-500">Wagered: 0 RC</p>
        </div>
        <button
          type="button"
          onClick={openSettings}
          className="mt-6 w-full rounded-xl border border-[#333] bg-[#1a1a1a] py-3 font-medium transition-colors hover:bg-[#222]"
        >
          Account Settings
        </button>
      </div>
    </div>
  );
}
