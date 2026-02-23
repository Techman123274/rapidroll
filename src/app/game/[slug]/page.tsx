import { notFound } from "next/navigation";
import { DEFAULT_GAMES } from "@/lib/games-data";
import GameRenderer from "@/components/games/GameRenderer";

interface GamePageProps {
  params: Promise<{ slug: string }>;
}

export default async function GamePage({ params }: GamePageProps) {
  const { slug } = await params;
  const game = DEFAULT_GAMES.find((g) => g.slug === slug);

  if (!game) notFound();

  return <GameRenderer slug={slug} />;
}
