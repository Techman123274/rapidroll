"use client";

import Link from "next/link";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useDashboard } from "@/context/DashboardContext";

export default function DashboardHeader() {
  const { data: session, status } = useSession();
  const {
    balance,
    currency,
    setDepositOpen,
    setProfileOpen,
  } = useDashboard();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[] | null>(null);

  const toggleNotifications = async () => {
    if (!notificationsOpen && notifications === null) {
      try {
        const res = await fetch("/api/promotions?status=active");
        if (res.ok) {
          const data = await res.json();
          setNotifications(data.promotions ?? []);
        } else {
          setNotifications([]);
        }
      } catch {
        setNotifications([]);
      }
    }
    setNotificationsOpen((v) => !v);
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#1a1a1a] bg-[#0a0a0a] px-6">
      <Link href="/play" className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-black text-black">
          R
        </div>
        <span className="text-lg font-extrabold tracking-wide">RAPID ROLE</span>
        <span className="rounded-full bg-accent-green/20 px-2 py-0.5 text-xs font-medium text-accent-green">
          BETA
        </span>
      </Link>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggleNotifications}
          className="relative text-gray-400 transition-colors hover:text-white"
          aria-label="Notifications"
        >
          <span className="text-xl">🔔</span>
          {notifications && notifications.length > 0 && (
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-danger" />
          )}
        </button>
        {notificationsOpen && (
          <div className="absolute right-6 top-14 z-50 w-64 rounded-xl border border-[#1a1a1a] bg-[#050505] p-3 text-xs shadow-lg">
            <p className="mb-2 font-semibold text-white">Notifications</p>
            {!notifications || notifications.length === 0 ? (
              <p className="text-[11px] text-gray-500">No active promotions.</p>
            ) : (
              <ul className="space-y-1 text-[11px] text-gray-300">
                {notifications.map((p) => (
                  <li key={p._id}>
                    <span className="font-medium text-primary">{p.name}</span>
                    {p.description && <> — {p.description}</>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {session ? (
          <>
            <button
              type="button"
              onClick={() => setDepositOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-[#1a1a1a] bg-[#141414] px-4 py-2 font-semibold text-white transition-colors hover:border-[#333]"
            >
              <span className="text-primary">◆</span>
              <span>{balance.toFixed(2)} {currency}</span>
              <span className="text-gray-500">▼</span>
            </button>
            <button
              type="button"
              onClick={() => setDepositOpen(true)}
              className="rounded-xl bg-primary px-5 py-2 font-extrabold text-black transition-opacity hover:opacity-90"
            >
              DEPOSIT
            </button>
            <button
              type="button"
              onClick={() => setProfileOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1a1a1a] text-white"
              aria-label="Profile"
            >
              👤
            </button>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-sm text-gray-500 hover:text-white"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login?callbackUrl=/play"
              className="rounded-xl border border-[#333] px-4 py-2 text-sm font-medium hover:border-[#555]"
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-primary px-5 py-2 font-extrabold text-black"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
