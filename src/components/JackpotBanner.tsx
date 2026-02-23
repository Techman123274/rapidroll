export default function JackpotBanner() {
  return (
    <div className="rounded-2xl border border-[#1a1a1a] bg-gradient-to-br from-[#0d0d0d] to-[#050505] p-8 md:p-10">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xl font-bold text-primary">⚡ RAPID JACKPOT</span>
        <span className="flex items-center gap-1.5 rounded-full bg-accent-green/20 px-2 py-0.5 text-xs font-medium text-accent-green">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-green" /> LIVE
        </span>
      </div>
      <div className="mt-2 font-mono text-5xl font-black tracking-tight text-primary md:text-6xl">
        $ 1,847,678.13
      </div>
      <div className="mt-6 flex flex-wrap gap-8">
        <div>
          <span className="block text-xs text-gray-500">24H VOLUME</span>
          <span className="font-semibold text-white">$2.4M</span>
        </div>
        <div>
          <span className="block text-xs text-gray-500">ACTIVE PLAYERS</span>
          <span className="font-semibold text-accent-green">12,847</span>
        </div>
        <div>
          <span className="block text-xs text-gray-500">LAST WIN</span>
          <span className="font-semibold text-primary">$4,291.00</span>
        </div>
      </div>
    </div>
  );
}
