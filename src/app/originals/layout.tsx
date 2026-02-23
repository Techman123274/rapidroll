import DashboardShell from "@/components/DashboardShell";

export default function OriginalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
