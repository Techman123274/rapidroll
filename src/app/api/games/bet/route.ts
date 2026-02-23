import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/games/bet
 * Records a bet for Crypto Mines or Lunar Crash.
 * Wire this when MongoDB + auth are ready.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gameId, userId, wager, sessionData } = body;

    if (!gameId || !userId || typeof wager !== "number" || wager <= 0) {
      return NextResponse.json(
        { error: "Invalid request: gameId, userId, wager required" },
        { status: 400 }
      );
    }

    // TODO: Use MongoDB transaction to:
    // 1. Deduct balance from User
    // 2. Create Bet record with status 'pending'
    // 3. Return betId for cashout/result

    return NextResponse.json({
      success: true,
      betId: `bet_${Date.now()}`,
      message: "Bet recorded (stub - wire to MongoDB when ready)",
    });
  } catch (e) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
