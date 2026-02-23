"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useSession } from "next-auth/react";

interface DashboardContextType {
  balance: number;
  setBalance: (v: number | ((prev: number) => number)) => void;
  currency: string;
  setCurrency: (v: string) => void;
  depositOpen: boolean;
  setDepositOpen: (v: boolean) => void;
  settingsOpen: boolean;
  setSettingsOpen: (v: boolean) => void;
  profileOpen: boolean;
  setProfileOpen: (v: boolean) => void;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [balance, setBalance] = useState(0);
  const [currency, setCurrency] = useState("ETH");
  const [depositOpen, setDepositOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadBalance = async () => {
      if (!session?.user?.id) {
        setBalance(0);
        return;
      }
      try {
        const res = await fetch("/api/user/balance");
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && typeof data.balance === "string") {
          setBalance(parseFloat(data.balance));
        }
      } catch {
        // ignore fetch errors for header balance
      }
    };

    loadBalance();
    const intervalId = setInterval(loadBalance, 30000);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [session?.user?.id]);

  return (
    <DashboardContext.Provider
      value={{
        balance,
        setBalance,
        currency,
        setCurrency,
        depositOpen,
        setDepositOpen,
        settingsOpen,
        setSettingsOpen,
        profileOpen,
        setProfileOpen,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
}
