import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Referral, User } from "@/models";

/**
 * POST /api/referrals
 * - Creates a referral code for a given user.
 *
 * GET /api/referrals?code=ABC123
 * - Looks up a referral code (for signup flows).
 */
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { ownerUserId, code, rewardCoins, rewardMultiplier, rewardSpins } = body;

    if (!ownerUserId) {
      return NextResponse.json({ error: "ownerUserId is required" }, { status: 400 });
    }

    // TODO: Enforce auth and ensure ownerUserId === current user (or admin).
    const owner = await User.findById(ownerUserId);
    if (!owner) {
      return NextResponse.json({ error: "Owner user not found" }, { status: 404 });
    }

    const existing = await Referral.findOne({ code });
    if (existing) {
      return NextResponse.json({ error: "Referral code already exists" }, { status: 409 });
    }

    const referral = await Referral.create({
      ownerUserId,
      code,
      rewardCoins,
      rewardMultiplier,
      rewardSpins,
    });

    return NextResponse.json({ referral }, { status: 201 });
  } catch (error) {
    console.error("POST /api/referrals error", error);
    return NextResponse.json(
      { error: "Failed to create referral" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ error: "code query param is required" }, { status: 400 });
    }

    const referral = await Referral.findOne({ code: code.toUpperCase() });
    if (!referral) {
      return NextResponse.json({ error: "Referral not found" }, { status: 404 });
    }

    return NextResponse.json({ referral });
  } catch (error) {
    console.error("GET /api/referrals error", error);
    return NextResponse.json(
      { error: "Failed to load referral" },
      { status: 500 }
    );
  }
}

