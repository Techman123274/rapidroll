import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Promotion, type IPromotion } from "@/models";

/**
 * GET /api/promotions
 * - Optional query params:
 *   - status: draft|scheduled|active|expired|disabled
 *   - kind: see PromotionKind
 *
 * POST /api/promotions
 * - Admin-only in production. Stubbed here with no auth.
 */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const kind = searchParams.get("kind");

    const query: Partial<Record<keyof IPromotion, unknown>> = {};

    if (status) query.status = status as IPromotion["status"];
    if (kind) query.kind = kind as IPromotion["kind"];

    const promotions = await Promotion.find(query).sort({ startsAt: 1 }).lean();

    return NextResponse.json({ promotions });
  } catch (error) {
    console.error("GET /api/promotions error", error);
    return NextResponse.json(
      { error: "Failed to load promotions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const {
      name,
      slug,
      description,
      kind,
      rewardType,
      rewardValue,
      perUserCap,
      globalCap,
      startsAt,
      endsAt,
      recurrence,
      status,
      eligibility,
      config,
    } = body;

    if (!name || !slug || !rewardType || typeof rewardValue !== "number") {
      return NextResponse.json(
        { error: "name, slug, rewardType and rewardValue are required" },
        { status: 400 }
      );
    }

    // TODO: Enforce admin auth/authorization.

    const promotion = await Promotion.create({
      name,
      slug,
      description,
      kind,
      rewardType,
      rewardValue,
      perUserCap,
      globalCap,
      startsAt,
      endsAt,
      recurrence,
      status,
      eligibility,
      config,
    });

    return NextResponse.json(
      { promotion },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/promotions error", error);
    return NextResponse.json(
      { error: "Failed to create promotion" },
      { status: 500 }
    );
  }
}

