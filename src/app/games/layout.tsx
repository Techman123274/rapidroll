import DashboardShell from "@/components/DashboardShell";

export default function GamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
