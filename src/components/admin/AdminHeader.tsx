"use client";

import Link from "next/link";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export default function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-[#1a1a1a] bg-[#050505] px-6 py-4">
      <div>
        <h1 className="text-lg font-bold text-white">{title}</h1>
        {subtitle && (
          <p className="text-xs text-gray-500">
            {subtitle}
          </p>
        )}
      </div>
      <Link
        href="/play"
        className="text-xs text-gray-400 hover:text-white"
      >
        Back to Casino
      </Link>
    </header>
  );
}

