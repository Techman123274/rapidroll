import DashboardShell from "@/components/DashboardShell";

export default function SlotsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
