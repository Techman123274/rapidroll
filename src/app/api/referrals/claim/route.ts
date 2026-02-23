import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Referral, User } from "@/models";

/**
 * POST /api/referrals/claim
 * - Stub endpoint for claiming a referral reward.
 *
 * Body:
 * - code: referral code
 * - newUserId: user who signed up
 */
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { code, newUserId } = body;

    if (!code || !newUserId) {
      return NextResponse.json(
        { error: "code and newUserId are required" },
        { status: 400 }
      );
    }

    const referral = await Referral.findOne({ code: code.toUpperCase() });
    if (!referral) {
      return NextResponse.json({ error: "Referral not found" }, { status: 404 });
    }

    if (referral.isRewardGranted) {
      return NextResponse.json(
        { error: "Referral reward already granted" },
        { status: 409 }
      );
    }

    const newUser = await User.findById(newUserId);
    if (!newUser) {
      return NextResponse.json({ error: "New user not found" }, { status: 404 });
    }

    // TODO: Transactionally credit balances of owner + new user.
    // For now, just mark as granted.

    referral.referredUserId = newUser._id;
    referral.isRewardGranted = true;
    await referral.save();

    return NextResponse.json({
      success: true,
      referral,
      message: "Referral claim recorded (stub - wire rewards logic).",
    });
  } catch (error) {
    console.error("POST /api/referrals/claim error", error);
    return NextResponse.json(
      { error: "Failed to claim referral" },
      { status: 500 }
    );
  }
}

