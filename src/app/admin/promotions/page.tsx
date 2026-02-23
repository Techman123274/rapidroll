import { Suspense } from "react";
import PromoFormClient from "@/components/admin/PromoFormClient";

export default function AdminPromotionsPage() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="mb-2 text-sm font-semibold text-white">Promo Scheduling</h2>
        <p className="mb-4 text-xs text-gray-500">
          Create daily, weekly, or event-based promotions. This view operates on top of
          the Mongo-backed promotions API.
        </p>
        <Suspense fallback={<div className="text-xs text-gray-500">Loading promos…</div>}>
          <PromotionsTable />
        </Suspense>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-white">New Promotion</h2>
        <div className="rounded-xl border border-[#1a1a1a] bg-[#050505] p-4 text-xs text-gray-200">
          <PromoFormClient />
        </div>
      </section>
    </div>
  );
}

async function fetchPromotions() {
  const base = process.env.NEXT_PUBLIC_BASE_URL;
  const baseUrl =
    base && base.startsWith("http")
      ? base.replace(/\/$/, "")
      : "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/promotions`, {
    // This is a server component fetch; do not cache in production if you need live data.
    next: { revalidate: 5 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.promotions ?? [];
}

async function PromotionsTable() {
  const promotions = await fetchPromotions();
  if (!promotions.length) {
    return <p className="text-xs text-gray-500">No promotions yet.</p>;
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-[#1a1a1a] bg-[#050505] text-xs">
      <table className="min-w-full border-collapse">
        <thead className="bg-[#0b0b0b] text-left text-[11px] uppercase text-gray-500">
          <tr>
            <th className="px-3 py-2">Name</th>
            <th className="px-3 py-2">Kind</th>
            <th className="px-3 py-2">Reward</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2">Window</th>
          </tr>
        </thead>
        <tbody>
          {promotions.map((p: any) => (
            <tr key={p._id} className="border-t border-[#111]">
              <td className="px-3 py-2 text-white">{p.name}</td>
              <td className="px-3 py-2 text-gray-300">{p.kind}</td>
              <td className="px-3 py-2 text-primary">
                {p.rewardValue} {p.rewardType}
              </td>
              <td className="px-3 py-2">
                <span className="rounded-full bg-[#111] px-2 py-0.5 text-[10px] uppercase text-gray-400">
                  {p.status}
                </span>
              </td>
              <td className="px-3 py-2 text-gray-400">
                {p.startsAt ? new Date(p.startsAt).toLocaleString() : "—"} →{" "}
                {p.endsAt ? new Date(p.endsAt).toLocaleString() : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
