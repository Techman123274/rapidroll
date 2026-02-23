import DashboardShell from "@/components/DashboardShell";

export default function LeaderboardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}

