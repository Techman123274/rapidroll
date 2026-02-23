"use client";

import { useState } from "react";
import { useDashboard } from "@/context/DashboardContext";

const CRYPTO_OPTIONS = [
  { id: "btc", name: "Bitcoin", symbol: "BTC", address: "bc1qxy2kgdy6jrsqz7u6n8x9abc123def456" },
  { id: "eth", name: "Ethereum", symbol: "ETH", address: "0x742d35Cc6634C0532925a3b844Bc9e7595f12345" },
];

export default function DepositModal() {
  const { depositOpen, setDepositOpen } = useDashboard();
  const [selectedCrypto, setSelectedCrypto] = useState<(typeof CRYPTO_OPTIONS)[0]>(CRYPTO_OPTIONS[1]);
  const [copied, setCopied] = useState(false);

  if (!depositOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedCrypto.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm"
      onClick={() => setDepositOpen(false)}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-[#1a1a1a] bg-[#121212] p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setDepositOpen(false)}
          className="absolute right-5 top-5 text-gray-500 hover:text-white"
          aria-label="Close"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold">Deposit</h2>
        <p className="mt-1 text-sm text-gray-500">
          Select a network, copy your unique address, and send funds from your wallet.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {CRYPTO_OPTIONS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCrypto(c)}
              className={`rounded-xl border p-4 text-left transition-colors ${
                selectedCrypto.id === c.id
                  ? "border-primary bg-primary/10"
                  : "border-[#333] bg-[#0a0a0a] hover:border-[#444]"
              }`}
            >
              <span className="font-semibold">{c.name}</span>
              <span className="ml-1 text-gray-500">({c.symbol})</span>
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-xl bg-[#050505] p-4">
          <p className="mb-2 text-xs text-gray-500">Deposit address</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 truncate rounded bg-[#0a0a0a] px-3 py-2 text-xs">
              {selectedCrypto.address}
            </code>
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-lg bg-primary px-3 py-2 text-sm font-bold text-black"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        <div className="mt-6 border-t border-[#1a1a1a] pt-4 text-xs text-gray-400">
          <p className="mb-2 font-semibold text-gray-200">How it works</p>
          <ol className="list-decimal space-y-1 pl-4">
            <li>Send crypto to the address above from your wallet or exchange.</li>
            <li>Wait for network confirmations (timing depends on the network).</li>
            <li>Your on-site balance will update automatically once the deposit is confirmed.</li>
          </ol>
          <p className="mt-3 text-[11px] text-gray-500">
            Never deposit from an unsupported network. Test deposits with small amounts first.
          </p>
        </div>
      </div>
    </div>
  );
}
