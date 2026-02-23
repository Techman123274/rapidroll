"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/promotions", label: "Promotions" },
  { href: "/admin/leaderboards", label: "Leaderboards" },
  { href: "/admin/chat", label: "Chat" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 border-r border-[#1a1a1a] bg-[#050505]">
      <div className="px-4 py-4 text-sm font-bold text-primary">
        Rapid Admin
      </div>
      <nav className="space-y-1 px-2 text-sm">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/admin" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
                active
                  ? "bg-primary text-black"
                  : "text-gray-400 hover:bg-[#111] hover:text-white"
              }`}
            >
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

