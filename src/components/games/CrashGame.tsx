"use client";

import { useEffect, useMemo, useState } from "react";
import { Play, Settings2 } from "lucide-react";

const BG_COLOR = "#0d0f14";
const CARD_COLOR = "#161920";
const NEON_GREEN = "#72f238";

type CrashTab = "manual" | "auto";

export default function CrashGame() {
  const [tab, setTab] = useState<CrashTab>("manual");
  const [cashoutMultiplier, setCashoutMultiplier] = useState(1.5);
  const [currentMultiplier, setCurrentMultiplier] = useState(1.0);

  useEffect(() => {
    let frame: number;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = (now - start) / 1000;
      const mult = 1 + elapsed * 0.3;
      setCurrentMultiplier(parseFloat(mult.toFixed(2)));
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const graphPath = useMemo(() => {
    const points: string[] = [];
    const samples = 40;
    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      const x = 10 + t * 80;
      const y = 80 - Math.min(3.5, currentMultiplier) / 3.5 * 60 * t;
      points.push(`${x},${y}`);
    }
    return points.join(" ");
  }, [currentMultiplier]);

  return (
    <div
      className="min-h-screen w-full px-4 py-6 md:px-8"
      style={{ backgroundColor: BG_COLOR }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row">
        {/* Left betting panel */}
        <aside
          className="w-full rounded-2xl p-4 text-sm text-white md:w-80"
          style={{ backgroundColor: CARD_COLOR }}
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="inline-flex rounded-full bg-black/40 p-1 text-xs">
              <button
                type="button"
                onClick={() => setTab("manual")}
                className={`rounded-full px-4 py-1 font-semibold ${
                  tab === "manual"
                    ? "bg-[rgba(114,242,56,0.15)] text-[color:#72f238]"
                    : "text-gray-400"
                }`}
              >
                MANUAL
              </button>
              <button
                type="button"
                onClick={() => setTab("auto")}
                className={`rounded-full px-4 py-1 font-semibold ${
                  tab === "auto"
                    ? "bg-[rgba(114,242,56,0.15)] text-[color:#72f238]"
                    : "text-gray-400"
                }`}
              >
                AUTO
              </button>
            </div>
            <Settings2 size={16} className="text-gray-500" />
          </div>

          <div className="mb-6 space-y-2">
            <p className="text-xs uppercase text-gray-400">Cashout at</p>
            <div className="flex items-center rounded-xl border border-white/10 bg-black/30 px-3 py-2">
              <input
                type="number"
                min={1}
                step={0.01}
                value={cashoutMultiplier}
                onChange={(e) =>
                  setCashoutMultiplier(
                    Math.max(1, parseFloat(e.target.value) || 1)
                  )
                }
                className="w-full bg-transparent text-2xl font-bold outline-none"
              />
              <span className="ml-1 text-xl font-bold text-gray-400">x</span>
            </div>
            {tab === "auto" && (
              <p className="text-[11px] text-gray-500">
                Auto cashout will trigger when the rocket reaches this
                multiplier.
              </p>
            )}
          </div>

          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[color:#72f238] bg-[color:#72f238] py-3 text-base font-bold text-white shadow-[0_0_25px_rgba(114,242,56,0.8)] transition-transform hover:scale-[1.02]"
          >
            <Play size={18} />
            CASHOUT
          </button>

          <div className="mt-6 rounded-xl border border-white/5 bg-black/20 p-3 text-xs text-gray-400">
            <p className="mb-1 text-[11px] uppercase tracking-wide text-gray-500">
              1 Player
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/80">Demo</span>
              <span className="font-mono text-[color:#72f238]">800 RC</span>
            </div>
          </div>
        </aside>

        {/* Center graph area */}
        <section className="relative flex-1 rounded-2xl border border-white/5 bg-gradient-to-b from-[#11131a] to-[#0b0d12] p-4 md:p-6">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Crash</span>
            <div className="flex gap-1">
              {[1.08, 3.87, 1.03, 1.44, 3.87].map((m, idx) => (
                <span
                  key={idx}
                  className="rounded-full bg-black/40 px-2 py-0.5 font-mono text-[10px] text-[color:#72f238]"
                >
                  {m.toFixed(2)}x
                </span>
              ))}
            </div>
          </div>

          <div className="relative mt-6 h-64 overflow-hidden rounded-2xl border border-white/5 bg-[#06070c]">
            <svg viewBox="0 0 100 100" className="h-full w-full">
              <defs>
                <linearGradient id="crash-bg" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#11131a" />
                  <stop offset="100%" stopColor="#06070c" />
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="100" height="100" fill="url(#crash-bg)" />
              <polyline
                fill="none"
                stroke={NEON_GREEN}
                strokeWidth="0.9"
                strokeLinecap="round"
                points={graphPath}
              />
            </svg>

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="matrix-glow text-4xl font-extrabold tracking-tight text-[color:#72f238] md:text-5xl">
                {currentMultiplier.toFixed(2)}x
              </span>
            </div>

            <img
              src="/assets/rocket.png"
              alt="Crash rocket"
              className="pointer-events-none absolute bottom-6 right-6 h-16 w-16"
              style={{ animation: "float 2.4s ease-in-out infinite" }}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

