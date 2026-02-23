"use client";

import { useState, useEffect, useCallback } from "react";
import { Play, Settings2, Coins } from "lucide-react";

// Colors from your screenshot
const THEME = {
  bg: "#0d0f14",
  card: "#161920",
  accent: "#72f238",
  accentMuted: "rgba(114, 242, 56, 0.15)",
  danger: "#ff4d4d",
  textGray: "#94a3b8"
};

type GameState = "waiting" | "rising" | "crashed";

export default function CrashGame() {
  const [gameState, setGameState] = useState<GameState>("waiting");
  const [multiplier, setMultiplier] = useState(1.0);
  const [betAmount, setBetAmount] = useState(100);
  const [hasBet, setHasBet] = useState(false);
  const [hasCashedOut, setHasCashedOut] = useState(false);
  const [cashedOutAt, setCashedOutAt] = useState(0);

  // Simulation Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === "rising") {
      const startTime = Date.now();
      interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        // Exponential growth formula for that smooth curve
        const newMultiplier = Math.pow(Math.E, 0.08 * elapsed);
        setMultiplier(newMultiplier);

        // Random crash logic (for demo purposes)
        if (newMultiplier > 5.0 || (newMultiplier > 1.2 && Math.random() < 0.005)) {
          setGameState("crashed");
          setHasBet(false);
        }
      }, 50);
    } else if (gameState === "crashed") {
      setTimeout(() => {
        setGameState("waiting");
        setMultiplier(1.0);
        setHasCashedOut(false);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  const handleAction = () => {
    if (gameState === "waiting") {
      setGameState("rising");
      setHasBet(true);
      setHasCashedOut(false);
    } else if (gameState === "rising" && hasBet && !hasCashedOut) {
      setHasCashedOut(true);
      setCashedOutAt(multiplier);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans" style={{ backgroundColor: THEME.bg }}>
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* LEFT PANEL: BETTING CONTROLS */}
        <div className="md:col-span-3 rounded-2xl p-5 flex flex-col gap-6" style={{ backgroundColor: THEME.card }}>
          <div className="flex bg-black/40 rounded-xl p-1">
            <button className="flex-1 py-2 text-xs font-bold rounded-lg bg-[#72f23820] text-[#72f238]">MANUAL</button>
            <button className="flex-1 py-2 text-xs font-bold text-gray-500">AUTO</button>
          </div>

          <div className="space-y-4">
            <div className="relative">
                <p className="text-[10px] text-gray-500 font-bold mb-2 uppercase tracking-wider">Amount</p>
                <div className="bg-black/30 border border-white/5 rounded-xl p-3 flex items-center justify-between">
                    <input 
                        type="number" 
                        value={betAmount} 
                        onChange={(e) => setBetAmount(Number(e.target.value))}
                        className="bg-transparent text-xl font-bold outline-none w-full text-white" 
                    />
                    <Coins size={16} className="text-[#72f238]" />
                </div>
            </div>

            <button 
                onClick={handleAction}
                disabled={gameState === "crashed" || hasCashedOut}
                className={`w-full py-4 rounded-xl font-black text-lg transition-all active:scale-95 shadow-2xl
                    ${hasCashedOut ? 'bg-gray-700 text-gray-400 opacity-50' : 'bg-[#72f238] text-black hover:brightness-110'}
                `}
                style={{ 
                    boxShadow: !hasCashedOut ? `0 0 30px ${THEME.accent}40` : 'none',
                    backgroundColor: gameState === "crashed" ? THEME.danger : (hasCashedOut ? '#1f2937' : THEME.accent)
                }}
            >
              {gameState === "waiting" ? "BET" : hasCashedOut ? "CASHED OUT" : "CASHOUT"}
            </button>
          </div>

          <div className="mt-auto border-t border-white/5 pt-4">
            <div className="flex justify-between items-center text-[10px] text-gray-500 mb-2 font-bold uppercase">
                <span>1 Players</span>
                <span>$ {hasCashedOut ? (betAmount * cashedOutAt).toFixed(2) : "0.00"}</span>
            </div>
            <div className="bg-black/20 rounded-lg p-3 flex justify-between text-sm">
                <span className="text-gray-300">Demo User</span>
                <span className="text-[#72f238] font-mono">{betAmount} RC</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: THE GRAPH */}
        <div className="md:col-span-9 rounded-2xl relative overflow-hidden flex flex-col border border-white/5" style={{ backgroundColor: THEME.card }}>
          
          {/* History Bar */}
          <div className="p-4 flex gap-2 overflow-x-auto border-b border-white/5 bg-black/10">
            {[1.51, 3.87, 1.03, 11.2, 1.44].map((h, i) => (
               <div key={i} className="px-3 py-1 rounded-full bg-black/40 text-[10px] font-mono font-bold" style={{ color: h > 2 ? THEME.accent : '#94a3b8' }}>{h.toFixed(2)}x</div>
            ))}
          </div>

          <div className="flex-1 relative flex items-center justify-center">
            {/* Background Grid/Stars effect */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '40px 40px' }} />

            {/* Main Multiplier Display */}
            <div className="text-center z-10">
                <h1 className={`text-7xl md:text-8xl font-black tracking-tighter transition-all duration-75 ${gameState === 'crashed' ? 'text-red-500' : 'text-[#72f238]'}`}
                    style={{ textShadow: gameState !== 'crashed' ? `0 0 40px ${THEME.accent}60` : 'none' }}>
                    {multiplier.toFixed(2)}x
                </h1>
                {hasCashedOut && (
                    <p className="text-white font-bold animate-bounce mt-2">CASHED OUT AT {cashedOutAt.toFixed(2)}x</p>
                )}
            </div>

            {/* SVG Graph Line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
               <path 
                d={`M 0 400 Q ${200 * multiplier} 380 ${800} ${400 - (multiplier * 20)}`}
                fill="none" 
                stroke={gameState === 'crashed' ? THEME.danger : THEME.accent} 
                strokeWidth="4"
                className="transition-all duration-100"
               />
            </svg>

            {/* Rocket Asset */}
            <img 
              src="/assets/rocket.png" 
              className={`absolute bottom-10 right-10 w-24 h-24 transition-transform duration-100 ${gameState === 'rising' ? 'animate-pulse' : ''}`}
              style={{ 
                transform: `translateY(${-multiplier * 5}px) rotate(${-multiplier * 2}deg)`,
                filter: gameState === 'crashed' ? 'grayscale(1) opacity(0.5)' : 'none'
              }}
              alt="rocket"
            />
          </div>

          {/* X-Axis labels */}
          <div className="p-4 flex justify-between text-[10px] text-gray-600 font-mono border-t border-white/5">
              <span>0s</span><span>2s</span><span>4s</span><span>6s</span><span>8s</span><span>10s</span>
          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
}