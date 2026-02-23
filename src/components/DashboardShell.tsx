"use client";

import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";
import GlobalChat from "./GlobalChat";
import DepositModal from "./DepositModal";
import SettingsModal from "./SettingsModal";
import ProfileModal from "./ProfileModal";
import { DashboardProvider } from "@/context/DashboardContext";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProvider>
      <div className="flex h-screen min-h-0 overflow-hidden bg-[#070707]">
        <Sidebar />
        <div className="relative flex min-h-0 min-w-0 flex-1 flex-col pl-16">
          <DashboardHeader />
          <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
          <div className="pointer-events-none fixed bottom-4 right-4 z-40">
            <div className="pointer-events-auto w-80 max-w-[90vw]">
              <GlobalChat />
            </div>
          </div>
        </div>
      </div>
      <DepositModal />
      <SettingsModal />
      <ProfileModal />
    </DashboardProvider>
  );
}
