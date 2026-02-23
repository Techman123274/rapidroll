"use client";

import { useEffect, useState } from "react";
import { X, MessageCircle } from "lucide-react";
import ChatWindow from "./chat/ChatWindow";
import ChannelSwitcher from "./chat/ChannelSwitcher";

export default function GlobalChat() {
  const [onlineCount] = useState(0);
  const [activeChannelId, setActiveChannelId] = useState("global");
  const [hiddenByAdmin, setHiddenByAdmin] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const channels = [
    { id: "global", label: "Global" },
    { id: "mines", label: "Mines" },
    { id: "slots", label: "Slots" },
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/system/emergency");
        if (!res.ok) return;
        const data = await res.json();
        setHiddenByAdmin(Boolean(data.hideChat));
      } catch {
        // ignore
      }
    };
    load();
  }, []);

  if (hiddenByAdmin) {
    return null;
  }

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        className="flex items-center justify-center gap-2 rounded-xl border border-[#1a1a1a] bg-[#0d0d0d] px-3 py-2 text-xs text-gray-300 hover:bg-[#141414]"
      >
        <MessageCircle size={14} />
        <span>Show chat</span>
      </button>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col rounded-xl border border-[#1a1a1a] bg-[#0d0d0d] overflow-hidden">
      <div className="flex shrink-0 items-center justify-between border-b border-[#1a1a1a] px-4 py-3">
        <span className="font-bold">CHAT</span>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-accent-green">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-green" />
            {onlineCount.toLocaleString()}
          </span>
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            className="rounded-full p-1 text-xs text-gray-500 hover:bg-[#222] hover:text-gray-200"
            aria-label="Close chat"
          >
            <X size={12} />
          </button>
        </div>
      </div>
      <ChannelSwitcher
        channels={channels}
        activeChannelId={activeChannelId}
        onSelect={setActiveChannelId}
      />
      <div className="flex-1 p-2">
        <ChatWindow
          channelId={activeChannelId}
          channelType={activeChannelId === "global" ? "global" : "game"}
        />
      </div>
    </div>
  );
}
