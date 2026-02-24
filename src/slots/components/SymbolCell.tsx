"use client";

import { getSymbolImageUrl } from "@/lib/slot-engine/cyberCrimeAssets";

export interface SymbolCellProps {
  symbolId: string;
  isWinning?: boolean;
}

export function SymbolCell({ symbolId, isWinning }: SymbolCellProps) {
  const src = getSymbolImageUrl(symbolId);

  return (
    <div
      className={`flex h-[72px] w-full flex-shrink-0 items-center justify-center rounded-md bg-black/40 transition-all duration-200 ${
        isWinning ? "symbol-cell-win" : ""
      }`}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={symbolId}
          className="h-14 w-14 object-contain drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]"
        />
      ) : (
        <span className="text-lg font-bold text-cyan-400">{symbolId.slice(0, 2)}</span>
      )}
    </div>
  );
}

