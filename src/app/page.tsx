import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#070707] text-slate-50">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-black text-black">
            R
          </div>
          <span className="text-lg font-extrabold tracking-wide">RAPID ROLE</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/play"
            className="text-sm text-gray-400 transition-colors hover:text-white"
          >
            THE VAULT
          </Link>
          <Link
            href="/play"
            className="rounded-full border border-primary/50 px-3 py-1 text-xs text-primary"
          >
            THE FUTURE OF IGAMING IS HERE
          </Link>
          <Link
            href="/login"
            className="text-sm text-gray-300 transition-colors hover:text-white"
          >
            LOG IN
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-black transition-opacity hover:opacity-90"
          >
            SIGN UP
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
        <div className="mb-6 flex items-center gap-2 rounded-full border border-primary/50 py-1 pl-2 pr-4">
          <span className="h-2 w-2 rounded-full bg-accent-green" />
          <span className="text-xs font-medium text-white">
            THE FUTURE OF IGAMING IS HERE
          </span>
        </div>

        <h1 className="mb-4 max-w-4xl text-5xl font-black tracking-tight md:text-7xl">
          <span className="bg-gradient-to-r from-accent-green to-white bg-clip-text text-transparent">
            HIGH STAKES.
          </span>
          <br />
          <span className="text-primary">HIGH PERFORMANCE.</span>
        </h1>

        <p className="mb-10 max-w-xl text-base text-gray-400 md:text-lg">
          Provably fair. Instant withdrawals. Built for degens who demand speed,
          anonymity, and zero compromise.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/play"
            className="group flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-bold text-black shadow-[0_0_30px_rgba(255,223,0,0.3)] transition-all hover:shadow-[0_0_40px_rgba(255,223,0,0.4)]"
          >
            ENTER THE ARENA
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
          <Link
            href="/slots"
            className="rounded-xl border border-white/30 bg-transparent px-8 py-4 text-lg font-semibold text-white transition-colors hover:border-white/50 hover:bg-white/5"
          >
            Explore Games
          </Link>
        </div>
      </main>

      {/* Stats Row */}
      <section className="border-t border-[#1a1a1a] px-6 py-8">
        <p className="mb-6 text-center text-xs text-gray-600">SCROLL</p>
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-4">
          <div className="flex items-start gap-4 text-center sm:flex-col sm:items-center">
            <span className="text-2xl text-primary">⚡</span>
            <div>
              <div className="text-2xl font-bold text-white">$12.4M+</div>
              <div className="text-sm text-gray-500">Paid out this week</div>
            </div>
          </div>
          <div className="flex items-start gap-4 text-center sm:flex-col sm:items-center">
            <span className="text-2xl text-primary">👥</span>
            <div>
              <div className="text-2xl font-bold text-white">48,000+</div>
              <div className="text-sm text-gray-500">Active players</div>
            </div>
          </div>
          <div className="flex items-start gap-4 text-center sm:flex-col sm:items-center">
            <span className="text-2xl text-primary">🛡️</span>
            <div>
              <div className="text-2xl font-bold text-white">100%</div>
              <div className="text-sm text-gray-500">Provably fair</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
