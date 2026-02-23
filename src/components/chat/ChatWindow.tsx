"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import TypingIndicator from "./TypingIndicator";

interface ChatMessage {
  _id?: string;
  id?: string;
  fromUsername: string;
  text: string;
  isAdmin?: boolean;
  createdAt?: string;
}

interface ChatWindowProps {
  channelId: string;
  channelType: "global" | "game" | "private" | "system";
  initialMessages?: ChatMessage[];
}

export default function ChatWindow({
  channelId,
  channelType,
  initialMessages = [],
}: ChatWindowProps) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages.length]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const res = await fetch(
          `/api/chat/messages?channelId=${encodeURIComponent(channelId)}`
        );
        if (!res.ok) return;
        const data = await res.json();
        if (!isMounted) return;
        setMessages(data.messages ?? []);
      } catch {
        // swallow for now; UI will keep initial messages
      }
    };
    load();
    // Basic polling stub; real-time should use websockets.
    const id = setInterval(load, 5000);
    return () => {
      isMounted = false;
      clearInterval(id);
    };
  }, [channelId]);

  useEffect(() => {
    if (!input) return;
    const username = "You";
    if (!typingUsers.includes(username)) {
      setTypingUsers((prev) => [...prev, username]);
    }
    const timeout = setTimeout(() => {
      setTypingUsers((prev) => prev.filter((n) => n !== username));
    }, 1500);
    return () => clearTimeout(timeout);
  }, [input, typingUsers]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isSending) return;
    setIsSending(true);
    setError(null);
    const fromUserId = (session?.user as any)?.id as string | undefined;
    const fromUsername = session?.user?.name ?? "Guest";
    try {
      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channelId,
          channelType,
          text,
          fromUserId,
          fromUsername,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error === "User is muted" && data.mutedUntil) {
          const until = new Date(data.mutedUntil);
          setError(
            `${data.reason ?? "You are muted"} until ${until.toLocaleString()}.`
          );
        } else {
          setError(data.error ?? "Failed to send message.");
        }
        return;
      }
      setMessages((prev) => [...prev, data.message]);
      setInput("");
    } catch {
      setError("Network error while sending message.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col rounded-xl border border-[#1a1a1a] bg-[#0d0d0d] overflow-hidden">
      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto p-3"
      >
        <div className="flex flex-col gap-2">
          {messages.map((m, idx) => (
            <div key={m._id ?? m.id ?? idx} className="text-xs leading-relaxed">
              <span
                className={`font-semibold ${
                  m.isAdmin ? "text-primary" : "text-primary"
                }`}
              >
                {m.fromUsername}:
              </span>{" "}
              <span className="text-gray-300">{m.text}</span>
            </div>
          ))}
        </div>
      </div>
      <TypingIndicator usernames={typingUsers} />
      {error && (
        <div className="border-t border-[#1a1a1a] bg-[#1a1a1a] px-3 py-2 text-[11px] text-amber-300">
          {error}
        </div>
      )}
      <form
        onSubmit={handleSend}
        className="shrink-0 border-t border-[#1a1a1a] p-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          maxLength={200}
          className="w-full rounded-lg border border-[#333] bg-[#141414] px-3 py-2 text-xs text-white placeholder:text-gray-500 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
        />
      </form>
    </div>
  );
}

