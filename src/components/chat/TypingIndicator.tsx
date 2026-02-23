"use client";

interface TypingIndicatorProps {
  usernames: string[];
}

export default function TypingIndicator({ usernames }: TypingIndicatorProps) {
  if (!usernames.length) return null;

  const label =
    usernames.length === 1
      ? `${usernames[0]} is typing...`
      : `${usernames.slice(0, 2).join(", ")}${
          usernames.length > 2 ? " and others" : ""
        } are typing...`;

  return (
    <div className="px-3 pb-2 text-xs text-gray-500">
      <span className="mr-2 inline-flex h-2 w-6 items-center justify-between">
        <span className="h-1 w-1 rounded-full bg-gray-400 animate-pulse" />
        <span className="h-1 w-1 rounded-full bg-gray-400 animate-pulse" />
        <span className="h-1 w-1 rounded-full bg-gray-400 animate-pulse" />
      </span>
      {label}
    </div>
  );
}

