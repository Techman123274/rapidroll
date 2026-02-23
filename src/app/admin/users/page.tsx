"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface AdminUser {
  _id: string;
  username: string;
  email: string;
  role: string;
  isBanned?: boolean;
  balance?: { $numberDecimal: string };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [resettingId, setResettingId] = useState<string | null>(null);
  const [unmutingId, setUnmutingId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/users?page=1&pageSize=20");
        if (!res.ok) return;
        const data = await res.json();
        setUsers(data.items ?? []);
      } catch {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const resetPassword = async (userId: string) => {
    setResettingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/reset-password`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error ?? "Failed to reset password");
      } else if (data.temporaryPassword) {
        alert(`Temporary password: ${data.temporaryPassword}`);
      } else {
        alert("Password reset.");
      }
    } catch {
      alert("Network error while resetting password.");
    } finally {
      setResettingId(null);
    }
  };

  const unmuteUser = async (userId: string) => {
    setUnmutingId(userId);
    try {
      const res = await fetch("/api/chat/moderation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "unmute_user", userId }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error ?? "Failed to unmute user");
      } else {
        alert("User unmuted.");
      }
    } catch {
      alert("Network error while unmuting user.");
    } finally {
      setUnmutingId(null);
    }
  };

  return (
    <div className="space-y-4 text-xs">
      <h2 className="text-sm font-semibold text-white">Player Directory</h2>
      {loading && <p className="text-gray-500">Loading users…</p>}
      {!loading && !users.length && (
        <p className="text-gray-500">
          No users yet. Seed test users via the auth flows or{" "}
          <code className="rounded bg-[#111] px-1 py-0.5">/api/admin/users</code>.
        </p>
      )}
      {!!users.length && (
        <div className="overflow-x-auto rounded-xl border border-[#1a1a1a] bg-[#050505]">
          <table className="min-w-full border-collapse text-left">
            <thead className="bg-[#0b0b0b] text-[11px] uppercase text-gray-500">
              <tr>
                <th className="px-3 py-2">Username</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t border-[#111]">
                  <td className="px-3 py-2 text-white">{u.username}</td>
                  <td className="px-3 py-2 text-gray-300">{u.email}</td>
                  <td className="px-3 py-2 text-gray-300">{u.role}</td>
                  <td className="px-3 py-2 text-gray-300">
                    {u.isBanned ? (
                      <span className="rounded-full bg-red-900/40 px-2 py-0.5 text-[10px] uppercase text-red-300">
                        Banned
                      </span>
                    ) : (
                      <span className="rounded-full bg-emerald-900/30 px-2 py-0.5 text-[10px] uppercase text-emerald-300">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => resetPassword(u._id)}
                        disabled={resettingId === u._id}
                        className="rounded-lg bg-[#222] px-2 py-1 text-[11px] text-gray-100 hover:bg-primary/70 hover:text-black disabled:opacity-60"
                      >
                        {resettingId === u._id ? "Resetting…" : "Reset Password"}
                      </button>
                      <button
                        type="button"
                        onClick={() => unmuteUser(u._id)}
                        disabled={unmutingId === u._id}
                        className="rounded-lg bg-[#222] px-2 py-1 text-[11px] text-gray-100 hover:bg-emerald-600 disabled:opacity-60"
                      >
                        {unmutingId === u._id ? "Unmuting…" : "Unmute"}
                      </button>
                      <Link
                        href={`/admin/users/${u._id}/activity`}
                        className="text-[11px] text-primary hover:underline"
                      >
                        Activity
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

