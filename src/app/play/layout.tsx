import DashboardShell from "@/components/DashboardShell";

export default function PlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
