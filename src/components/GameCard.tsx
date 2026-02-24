import Link from "next/link";

export interface GameCardProps {
  title: string;
  slug: string;
  thumbnail: string;
  provider?: string;
  hot?: boolean;
  gradient?: string;
}

const CARD_GRADIENTS: Record<string, string> = {
  "crypto-mines": "from-purple-900/80 to-indigo-950",
  "lunar-crash": "from-blue-900/80 to-cyan-950",
  "quantum-roulette": "from-amber-900/50 to-orange-950",
  "cyber-crime": "from-cyan-900/80 to-violet-950",
  default: "from-[#1a1a1a] to-[#0d0d0d]",
};

export default function GameCard({
  title,
  slug,
  thumbnail,
  provider = "Rapid Originals",
  hot = false,
  gradient,
}: GameCardProps) {
  const bgGradient = gradient ?? CARD_GRADIENTS[slug] ?? CARD_GRADIENTS.default;
  const hasValidThumbnail =
    thumbnail.startsWith("http") && !thumbnail.includes("/games/");

  const href = slug === "cyber-crime" ? "/games/cyber-crime" : `/game/${slug}`;
  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#1a1a1a] bg-[#121212] transition-all hover:-translate-y-1 hover:border-[#333]"
    >
      <div
        className={`relative aspect-[4/3] w-full ${hasValidThumbnail ? "" : `bg-gradient-to-br ${bgGradient}`}`}
      >
        {hasValidThumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnail}
            alt={title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${bgGradient}`}
          >
            <span className="text-3xl font-bold text-white/30">{title[0]}</span>
          </div>
        )}
        {hot && (
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-primary/90 px-2 py-0.5 text-xs font-bold text-black">
            🔥 HOT
          </span>
        )}
      </div>
      <div className="flex flex-col gap-0.5 p-4">
        <span className="font-bold text-white">{title}</span>
        <span className="text-xs text-gray-500">{provider}</span>
      </div>
    </Link>
  );
}
