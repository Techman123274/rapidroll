interface UserActivityPageProps {
  params: { id: string };
}

async function fetchActivity(userId: string) {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  const res = await fetch(`${base}/api/admin/users/${userId}/activity`, {
    cache: "no-store",
  });
  if (!res.ok) {
    return { chats: [], bets: [] };
  }
  return res.json();
}

export default async function UserActivityPage({ params }: UserActivityPageProps) {
  const { id } = params;
  const data = await fetchActivity(id);

  return (
    <div className="space-y-6 text-xs">
      <h2 className="text-sm font-semibold text-white">
        Activity for User ID: <span className="font-mono text-primary">{id}</span>
      </h2>

      <section className="rounded-xl border border-[#1a1a1a] bg-[#050505] p-4">
        <h3 className="mb-2 text-xs font-semibold text-white">Chat Messages</h3>
        {!data.chats?.length ? (
          <p className="text-gray-500">No chat messages found for this user.</p>
        ) : (
          <div className="max-h-64 overflow-y-auto">
            <table className="min-w-full border-collapse text-left">
              <thead className="bg-[#0b0b0b] text-[11px] uppercase text-gray-500">
                <tr>
                  <th className="px-3 py-2">Channel</th>
                  <th className="px-3 py-2">Text</th>
                  <th className="px-3 py-2">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {data.chats.map((c: any) => (
                  <tr key={c._id} className="border-t border-[#111]">
                    <td className="px-3 py-2 text-gray-300">
                      {c.channelType} / {c.channelId}
                    </td>
                    <td className="px-3 py-2 text-white">{c.text}</td>
                    <td className="px-3 py-2 text-gray-400">
                      {c.createdAt ? new Date(c.createdAt).toLocaleString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-[#1a1a1a] bg-[#050505] p-4">
        <h3 className="mb-2 text-xs font-semibold text-white">Bets</h3>
        {!data.bets?.length ? (
          <p className="text-gray-500">No bets found for this user.</p>
        ) : (
          <div className="max-h-64 overflow-y-auto">
            <table className="min-w-full border-collapse text-left">
              <thead className="bg-[#0b0b0b] text-[11px] uppercase text-gray-500">
                <tr>
                  <th className="px-3 py-2">Game</th>
                  <th className="px-3 py-2">Wager</th>
                  <th className="px-3 py-2">Payout</th>
                  <th className="px-3 py-2">Multiplier</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {data.bets.map((b: any) => (
                  <tr key={b._id} className="border-t border-[#111]">
                    <td className="px-3 py-2 text-gray-300">
                      {typeof b.gameId === "string" ? b.gameId : String(b.gameId)}
                    </td>
                    <td className="px-3 py-2 text-white">
                      {b.wager?.$numberDecimal ?? "-"}
                    </td>
                    <td className="px-3 py-2 text-white">
                      {b.payout?.$numberDecimal ?? "-"}
                    </td>
                    <td className="px-3 py-2 text-gray-300">{b.multiplier}x</td>
                    <td className="px-3 py-2 text-gray-300">{b.status}</td>
                    <td className="px-3 py-2 text-gray-400">
                      {b.createdAt ? new Date(b.createdAt).toLocaleString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

