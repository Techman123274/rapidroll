import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Promotion, PromotionClaim } from "@/models";

/**
 * POST /api/promotions/claim
 *
 * Body:
 * - promotionId: string
 * - userId: string  (for now passed from the client; in production, use the session)
 */
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { promotionId, userId } = body;

    if (!promotionId || !userId) {
      return NextResponse.json(
        { error: "promotionId and userId are required" },
        { status: 400 }
      );
    }

    const promo = await Promotion.findById(promotionId);
    if (!promo) {
      return NextResponse.json({ error: "Promotion not found" }, { status: 404 });
    }

    if (promo.status !== "active") {
      return NextResponse.json(
        { error: "Promotion is not active" },
        { status: 400 }
      );
    }

    const now = new Date();
    if ((promo.startsAt && promo.startsAt > now) || (promo.endsAt && promo.endsAt < now)) {
      return NextResponse.json(
        { error: "Promotion is not currently claimable" },
        { status: 400 }
      );
    }

    try {
      await PromotionClaim.create({
        userId,
        promotionId: promo._id,
      });
    } catch (e: any) {
      if (e?.code === 11000) {
        return NextResponse.json(
          { error: "Promotion already claimed by this user" },
          { status: 409 }
        );
      }
      throw e;
    }

    promo.analytics = promo.analytics ?? {
      views: 0,
      claimed: 0,
      uniqueClaimants: 0,
    };
    promo.analytics.claimed += 1;
    promo.analytics.uniqueClaimants += 1;
    promo.analytics.lastClaimAt = now;
    await promo.save();

    // TODO: Apply actual reward (coins, free spins, etc.) to the user.

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/promotions/claim error", error);
    return NextResponse.json(
      { error: "Failed to claim promotion" },
      { status: 500 }
    );
  }
}

