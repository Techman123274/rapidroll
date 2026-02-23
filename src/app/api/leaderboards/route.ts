import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { LeaderboardEntry } from "@/models";

/**
 * GET /api/leaderboards
 *
 * Query params:
 * - metric: "total_coins" | "highest_win" | "consistency"
 * - scope: "global" | "game"
 * - timeframe: "daily" | "weekly" | "monthly" | "all_time"
 * - gameSlug?: string (required when scope=game)
 * - limit?: number (default 10, max 100)
 */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);

    const metric = searchParams.get("metric") ?? "total_coins";
    const scope = searchParams.get("scope") ?? "global";
    const timeframe = searchParams.get("timeframe") ?? "daily";
    const gameSlug = searchParams.get("gameSlug");
    const limitParam = searchParams.get("limit");
    const limit = Math.min(Number(limitParam || 10), 100);

    if (scope === "game" && !gameSlug) {
      return NextResponse.json(
        { error: "gameSlug is required when scope=game" },
        { status: 400 }
      );
    }

    const query: Record<string, unknown> = {
      metric,
      scope,
      timeframe,
    };
    if (scope === "game" && gameSlug) {
      query.gameSlug = gameSlug;
    }

    const entries = await LeaderboardEntry.find(query)
      .sort({ value: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ entries });
  } catch (error) {
    console.error("GET /api/leaderboards error", error);
    return NextResponse.json(
      { error: "Failed to load leaderboard" },
      { status: 500 }
    );
  }
}

