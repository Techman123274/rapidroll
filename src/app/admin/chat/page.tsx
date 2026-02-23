"use client";

import { useEffect, useState } from "react";

interface AdminChatMessage {
  _id: string;
  text: string;
  fromUsername: string;
  fromUserId?: string;
  channelId: string;
  channelType: string;
  createdAt?: string;
}

export default function AdminChatPage() {
  const [messages, setMessages] = useState<AdminChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState("global");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/chat/messages?channelId=${encodeURIComponent(selectedChannel)}&limit=100`
        );
        if (!res.ok) {
          setMessages([]);
          return;
        }
        const data = await res.json();
        setMessages(data.messages ?? []);
      } catch {
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [selectedChannel]);

  const moderate = async (
    action: "delete_message" | "mute_user" | "ban_user",
    message: AdminChatMessage
  ) => {
    setActionLoadingId(message._id);
    try {
      const body: any = { action };
      if (action === "delete_message") body.messageId = message._id;
      if (action === "mute_user" || action === "ban_user") body.userId = message.fromUserId;
      const res = await fetch("/api/chat/moderation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error ?? "Moderation failed");
      } else {
        if (action === "delete_message") {
          setMessages((prev) => prev.filter((m) => m._id !== message._id));
        }
      }
    } catch {
      alert("Network error while applying moderation.");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-4 text-xs">
      <section className="rounded-xl border border-[#1a1a1a] bg-[#050505] p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Chat Moderation</h2>
          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="rounded-lg border border-[#333] bg-[#141414] px-2 py-1 text-[11px] text-white"
          >
            <option value="global">Global</option>
            <option value="mines">Mines</option>
            <option value="slots">Slots</option>
          </select>
        </div>
        {loading && <p className="text-gray-500">Loading messages…</p>}
        {!loading && !messages.length && (
          <p className="text-gray-500">No messages found for this channel.</p>
        )}
        {!!messages.length && (
          <div className="max-h-96 overflow-y-auto rounded-lg border border-[#111] bg-[#050505]">
            <table className="min-w-full border-collapse text-left">
              <thead className="bg-[#0b0b0b] text-[11px] uppercase text-gray-500">
                <tr>
                  <th className="px-3 py-2">User</th>
                  <th className="px-3 py-2">Message</th>
                  <th className="px-3 py-2">Time</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((m) => (
                  <tr key={m._id} className="border-t border-[#111]">
                    <td className="px-3 py-2 text-gray-300">
                      <div className="flex flex-col">
                        <span className="text-white">{m.fromUsername}</span>
                        {m.fromUserId && (
                          <span className="font-mono text-[10px] text-gray-500">
                            {m.fromUserId}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-white">{m.text}</td>
                    <td className="px-3 py-2 text-gray-400">
                      {m.createdAt ? new Date(m.createdAt).toLocaleString() : "—"}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={actionLoadingId === m._id}
                          onClick={() => moderate("delete_message", m)}
                          className="rounded-lg bg-[#222] px-2 py-1 text-[11px] text-gray-100 hover:bg-danger/60 disabled:opacity-60"
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          disabled={actionLoadingId === m._id || !m.fromUserId}
                          onClick={() => moderate("mute_user", m)}
                          className="rounded-lg bg-[#222] px-2 py-1 text-[11px] text-gray-100 hover:bg-amber-600/80 disabled:opacity-60"
                        >
                          Mute
                        </button>
                        <button
                          type="button"
                          disabled={actionLoadingId === m._id || !m.fromUserId}
                          onClick={() => moderate("ban_user", m)}
                          className="rounded-lg bg-[#222] px-2 py-1 text-[11px] text-gray-100 hover:bg-red-700 disabled:opacity-60"
                        >
                          Ban
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

