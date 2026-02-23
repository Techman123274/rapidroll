\"use client\";

import { useEffect, useState } from \"react\";
import { useSession } from \"next-auth/react\";

interface Promo {
  _id: string;
  name: string;
  description?: string;
  rewardType: string;
  rewardValue: number;
  status: string;
}

export default function PromosPage() {
  const { data: session } = useSession();
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(false);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(\"/api/promotions?status=active\");
        if (!res.ok) {
          setPromos([]);
          return;
        }
        const data = await res.json();
        setPromos(data.promotions ?? []);
      } catch {
        setPromos([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const claim = async (promotionId: string) => {
    if (!session?.user?.id) {
      alert(\"You must be logged in to claim promotions.\");
      return;
    }
    setClaimingId(promotionId);
    try {
      const res = await fetch(\"/api/promotions/claim\", {
        method: \"POST\",
        headers: { \"Content-Type\": \"application/json\" },
        body: JSON.stringify({
          promotionId,
          userId: (session.user as any).id,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error ?? \"Failed to claim promotion\");
      } else {
        alert(\"Promotion claimed!\");
      }
    } catch {
      alert(\"Network error while claiming promotion.\");
    } finally {
      setClaimingId(null);
    }
  };

  return (
    <div className=\"mx-auto max-w-4xl space-y-5 p-4 md:p-8\">
      <div className=\"flex flex-col gap-2 md:flex-row md:items-end md:justify-between\">
        <div>
          <h1 className=\"text-2xl font-bold text-white\">Promotions</h1>
          <p className=\"text-sm text-gray-500\">
            Claim bonuses, reloads, and limited-time events curated for Rapid Role players.
          </p>
        </div>
        <div className=\"rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs text-primary\">
          {session ? \"Logged in\" : \"Log in to claim rewards\"}
        </div>
      </div>

      {loading && (
        <div className=\"grid gap-4 md:grid-cols-2\">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className=\"h-32 animate-pulse rounded-2xl border border-[#141414] bg-[#050505]\"
            />
          ))}
        </div>
      )}

      {!loading && !promos.length && (
        <div className=\"rounded-2xl border border-dashed border-[#2a2a2a] bg-[#050505] p-6 text-sm text-gray-400\">
          <p className=\"font-medium text-white\">No active promotions right now</p>
          <p className=\"mt-1 text-xs text-gray-500\">
            Check back soon for welcome boosts, reload bonuses, and seasonal events.
          </p>
        </div>
      )}

      {!loading && promos.length > 0 && (
        <div className=\"grid gap-4 md:grid-cols-2\">
          {promos.map((p) => (
            <div
              key={p._id}
              className=\"group flex flex-col justify-between rounded-2xl border border-[#1a1a1a] bg-gradient-to-br from-[#090909] via-[#050505] to-[#020202] p-4 shadow-[0_0_25px_rgba(0,0,0,0.6)] transition-transform hover:-translate-y-0.5 hover:border-primary/50\"
            >
              <div className=\"flex items-start justify-between gap-3\">
                <div>
                  <p className=\"text-sm font-semibold text-white\">{p.name}</p>
                  {p.description && (
                    <p className=\"mt-1 text-[11px] text-gray-400 line-clamp-3\">
                      {p.description}
                    </p>
                  )}
                </div>
                <span className=\"rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary\">
                  {p.rewardValue} {p.rewardType}
                </span>
              </div>

              <div className=\"mt-4 flex items-center justify-between gap-3\">
                <p className=\"text-[11px] text-gray-500\">
                  Status:{\" "}
                  <span className=\"font-medium text-accent-green\">
                    {p.status === \"active\" ? \"Live\" : p.status}
                  </span>
                </p>
                <button
                  type=\"button\"
                  onClick={() => claim(p._id)}
                  disabled={claimingId === p._id}
                  className=\"rounded-lg bg-primary px-3 py-1.5 text-[11px] font-semibold text-black shadow-[0_0_18px_rgba(250,204,21,0.35)] transition-opacity group-hover:opacity-95 disabled:opacity-60\"
                >
                  {claimingId === p._id ? \"Claiming…\" : \"Claim bonus\"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

