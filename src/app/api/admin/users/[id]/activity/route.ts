import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { ChatMessage, Bet } from "@/models";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    await dbConnect();
    const { id } = await context.params;

    const [chats, bets] = await Promise.all([
      ChatMessage.find({ fromUserId: id })
        .sort({ createdAt: -1 })
        .limit(100)
        .lean(),
      Bet.find({ userId: id })
        .sort({ createdAt: -1 })
        .limit(100)
        .lean(),
    ]);

    return NextResponse.json({
      chats,
      bets,
    });
  } catch (error) {
    console.error("GET /api/admin/users/[id]/activity error", error);
    return NextResponse.json(
      { error: "Failed to load activity" },
      { status: 500 }
    );
  }
}

