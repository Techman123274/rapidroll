import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/games/cashout
 * Records a successful cashout (win).
 * Wire this when MongoDB + auth are ready.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { betId, userId, payout, multiplier, provablyFair } = body;

    if (!betId || !userId || typeof payout !== "number") {
      return NextResponse.json(
        { error: "Invalid request: betId, userId, payout required" },
        { status: 400 }
      );
    }

    // TODO: Use MongoDB transaction to:
    // 1. Add payout to User balance
    // 2. Update Bet record: payout, multiplier, provablyFair, status='won'

    return NextResponse.json({
      success: true,
      payout,
      message: "Cashout recorded (stub - wire to MongoDB when ready)",
    });
  } catch (e) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
