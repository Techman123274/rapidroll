"use client";

import { useState } from "react";

const initialState = {
  name: "",
  slug: "",
  rewardType: "coins",
  rewardValue: 0,
};

export default function PromoFormClient() {
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const update = (field: keyof typeof initialState, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      const res = await fetch("/api/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          rewardValue: Number(form.rewardValue),
          status: "active",
          recurrence: "once",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error ?? "Failed to create promotion");
      } else {
        setMessage("Promotion created.");
        setForm(initialState);
      }
    } catch {
      setMessage("Network error while creating promotion");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 text-xs"
    >
      <div className="grid gap-2 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-gray-300">Name</span>
          <input
            required
            type="text"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="w-full rounded-lg border border-[#333] bg-[#141414] px-2 py-1 text-xs text-white"
          />
        </label>
        <label className="space-y-1">
          <span className="text-gray-300">Slug</span>
          <input
            required
            type="text"
            value={form.slug}
            onChange={(e) => update("slug", e.target.value)}
            className="w-full rounded-lg border border-[#333] bg-[#141414] px-2 py-1 text-xs text-white"
          />
        </label>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-gray-300">Reward Type</span>
          <select
            value={form.rewardType}
            onChange={(e) => update("rewardType", e.target.value)}
            className="w-full rounded-lg border border-[#333] bg-[#141414] px-2 py-1 text-xs text-white"
          >
            <option value="coins">Coins</option>
            <option value="multiplier">Multiplier</option>
            <option value="free_spins">Free spins</option>
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-gray-300">Reward Value</span>
          <input
            type="number"
            min={0}
            step={0.01}
            value={form.rewardValue}
            onChange={(e) => update("rewardValue", e.target.value)}
            className="w-full rounded-lg border border-[#333] bg-[#141414] px-2 py-1 text-xs text-white"
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-black disabled:opacity-60"
      >
        {submitting ? "Creating..." : "Create Promotion"}
      </button>
      {message && <p className="text-[11px] text-gray-400">{message}</p>}
    </form>
  );
}

