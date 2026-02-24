/**
 * Static game data - no MongoDB dependency.
 * Used for UI display. For DB seeding, use lib/seed-games.ts
 */
export type GameCategory = "Slots" | "Originals";

export interface SeedGame {
  title: string;
  slug: string;
  thumbnail: string;
  category: GameCategory;
  providerUrl: string;
  provider?: string;
  featured?: boolean;
  hot?: boolean;
  order: number;
}

export const DEFAULT_GAMES: SeedGame[] = [
  {
    title: "Crypto Mines",
    slug: "crypto-mines",
    thumbnail: "/games/crypto-mines.png",
    category: "Originals",
    provider: "Rapid Originals",
    providerUrl:
      "https://asccw.playngonetwork.com/casino/ContainerLauncher?pid=2&gid=europeanroulette&lang=en_GB&practice=1&channel=desktop&demo=2",
    featured: true,
    hot: true,
    order: 1,
  },
  {
    title: "Lunar Crash",
    slug: "lunar-crash",
    thumbnail: "/games/lunar-crash.png",
    category: "Originals",
    provider: "Rapid Originals",
    providerUrl:
      "https://asccw.playngonetwork.com/casino/ContainerLauncher?pid=2&gid=mirrorjoker&lang=en_GB&practice=1&channel=desktop&demo=2",
    featured: true,
    hot: true,
    order: 2,
  },
  {
    title: "Mirror Joker",
    slug: "mirror-joker",
    thumbnail:
      "https://th.bing.com/th/id/OIP.pjx0zDqkQ49skZS1c2-9cAHaG3?w=189&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3",
    category: "Slots",
    provider: "Rapid Originals",
    providerUrl:
      "https://asccw.playngonetwork.com/casino/ContainerLauncher?pid=2&gid=mirrorjoker&lang=en_GB&practice=1&channel=desktop&demo=2",
    featured: true,
    hot: true,
    order: 3,
  },
  {
    title: "European Roulette",
    slug: "european-roulette",
    thumbnail: "https://static.playngo.com/web/logos/games/europeanroulette.png",
    category: "Slots",
    provider: "Rapid Originals",
    providerUrl:
      "https://asccw.playngonetwork.com/casino/ContainerLauncher?pid=2&gid=europeanroulette&lang=en_GB&practice=1&channel=desktop&demo=2",
    featured: true,
    hot: true,
    order: 4,
  },
  {
    title: "Quantum Roulette",
    slug: "quantum-roulette",
    thumbnail: "/games/quantum-roulette.png",
    category: "Slots",
    provider: "Evolution",
    providerUrl:
      "https://asccw.playngonetwork.com/casino/ContainerLauncher?pid=2&gid=europeanroulette&lang=en_GB&practice=1&channel=desktop&demo=2",
    featured: false,
    hot: true,
    order: 5,
  },
  {
    title: "Renderwolf Slots",
    slug: "renderwolf-slots",
    thumbnail: "/games/renderwolf-slots.png", // add image to /public/games/
    category: "Slots",
    provider: "Renderwolf",
    providerUrl: "https://slots.renderwolf.ai/embed/1771853851705",
    featured: true,
    hot: true,
    order: 6,
  },
  {
    title: "Cyber Crime",
    slug: "cyber-crime",
    thumbnail: "/games/cyber-crime/game_title/Game_Title_title_1771854534046_1.png",
    category: "Slots",
    provider: "Rapid Originals",
    providerUrl: "/games/cyber-crime",
    featured: true,
    hot: true,
    order: 7,
  },
];