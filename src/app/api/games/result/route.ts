import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/games/result
 * Records a loss (mine hit / crash).
 * Wire this when MongoDB + auth are ready.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { betId, userId, provablyFair } = body;

    if (!betId || !userId) {
      return NextResponse.json(
        { error: "Invalid request: betId, userId required" },
        { status: 400 }
      );
    }

    // TODO: Update Bet record: status='lost', provablyFair
    // Balance already deducted at bet time

    return NextResponse.json({
      success: true,
      message: "Loss recorded (stub - wire to MongoDB when ready)",
    });
  } catch (e) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
