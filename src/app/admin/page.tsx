import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <section className="grid gap-4 sm:grid-cols-3">
        <SummaryCard label="Total GGR" value="$142,840.00" />
        <SummaryCard label="Active Bets" value="842" />
        <SummaryCard label="System Status" value="ONLINE" accent="text-accent-green" />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <AdminCard
          title="Users"
          description="View and manage player profiles, balances, bans, and more."
          href="/admin/users"
        />
        <AdminCard
          title="Promotions"
          description="Create and schedule bonuses, referrals, and events."
          href="/admin/promotions"
        />
        <AdminCard
          title="Leaderboards"
          description="Inspect and reset rankings across games."
          href="/admin/leaderboards"
        />
        <AdminCard
          title="Chat"
          description="Moderate messages, mute or ban disruptive users."
          href="/admin/chat"
        />
        <AdminCard
          title="Settings & SFX"
          description="Configure audio, visuals, and emergency mode."
          href="/admin/settings"
        />
      </section>
    </div>
  );
}

interface AdminCardProps {
  title: string;
  description: string;
  href: string;
}

function AdminCard({ title, description, href }: AdminCardProps) {
  return (
    <Link
      href={href}
      className="flex flex-col justify-between rounded-xl border border-[#1a1a1a] bg-[#050505] p-4 transition-transform hover:-translate-y-0.5 hover:border-primary/60"
    >
      <div>
        <h2 className="mb-1 text-sm font-semibold text-white">{title}</h2>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <span className="mt-3 text-xs font-medium text-primary">Open →</span>
    </Link>
  );
}

interface SummaryCardProps {
  label: string;
  value: string;
  accent?: string;
}

function SummaryCard({ label, value, accent }: SummaryCardProps) {
  return (
    <div className="rounded-xl border border-[#1a1a1a] bg-[#0d0d0d] p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`mt-1 text-xl font-bold ${accent ?? ""}`}>{value}</p>
    </div>
  );
}
