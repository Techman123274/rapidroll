"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useDashboard } from "@/context/DashboardContext";

const baseNav = [
  { href: "/play", icon: "🏠", label: "Home" },
  { href: "/slots", icon: "🎰", label: "Slots" },
  { href: "/originals", icon: "🎮", label: "Originals" },
  { href: "/promos", icon: "🎁", label: "Promos" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { setSettingsOpen } = useDashboard();
  const { data: session } = useSession();
  const role = (session?.user as any)?.role as string | undefined;

  const navItems =
    role === "admin" || role === "owner"
      ? [...baseNav, { href: "/admin", icon: "⚙️", label: "Admin" }]
      : baseNav;

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-16 flex-col items-center gap-6 border-r border-[#1a1a1a] bg-[#0d0d0d] py-5">
      <Link
        href="/"
        className="text-xl font-black tracking-tight text-primary"
        aria-label="Rapid Role"
      >
        R
      </Link>
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
              isActive
                ? "bg-primary/10 text-primary"
                : "text-gray-500 hover:bg-[#1a1a1a] hover:text-white"
            }`}
            title={item.label}
            aria-label={item.label}
          >
            <span className="text-xl">{item.icon}</span>
            {isActive && (
              <span
                className="absolute -right-1 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-accent-green shadow-[0_0_8px_#4ade80]"
                aria-hidden
              />
            )}
          </Link>
        );
      })}
      <button
        type="button"
        onClick={() => setSettingsOpen(true)}
        className="mt-auto flex h-11 w-11 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-[#1a1a1a] hover:text-white"
        title="Settings"
        aria-label="Settings"
      >
        🔧
      </button>
    </aside>
  );
}
