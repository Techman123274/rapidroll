"use client";

interface Channel {
  id: string;
  label: string;
}

interface ChannelSwitcherProps {
  channels: Channel[];
  activeChannelId: string;
  onSelect: (id: string) => void;
}

export default function ChannelSwitcher({
  channels,
  activeChannelId,
  onSelect,
}: ChannelSwitcherProps) {
  return (
    <div className="flex gap-1 border-b border-[#1a1a1a] px-2 py-1 text-xs">
      {channels.map((ch) => (
        <button
          key={ch.id}
          type="button"
          onClick={() => onSelect(ch.id)}
          className={`rounded-lg px-2 py-1 font-medium transition-colors ${
            ch.id === activeChannelId
              ? "bg-primary text-black"
              : "bg-[#141414] text-gray-400 hover:bg-[#1a1a1a] hover:text-white"
          }`}
        >
          {ch.label}
        </button>
      ))}
    </div>
  );
}

