import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { ChatMessage, User } from "@/models";

/**
 * GET /api/chat/messages
 * - Query params:
 *   - channelId (required)
 *   - limit (optional, default 100, max 200)
 *
 * POST /api/chat/messages
 * - Body:
 *   - channelId
 *   - channelType
 *   - text
 *   - fromUserId (optional)
 *   - fromUsername (fallback if no user)
 *
 * This is a stub for real-time chat; WebSocket/broker integration
 * should be layered on top of this HTTP API.
 */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const channelId = searchParams.get("channelId");
    const limitParam = searchParams.get("limit");

    if (!channelId) {
      return NextResponse.json(
        { error: "channelId query param is required" },
        { status: 400 }
      );
    }

    const limit = Math.min(Number(limitParam || 100), 200);

    const messages = await ChatMessage.find({
      channelId,
      deletedAt: null,
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ messages: messages.reverse() });
  } catch (error) {
    console.error("GET /api/chat/messages error", error);
    return NextResponse.json(
      { error: "Failed to load chat messages" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { channelId, channelType, text, fromUserId, fromUsername } = body;

    if (!channelId || !channelType || !text) {
      return NextResponse.json(
        { error: "channelId, channelType and text are required" },
        { status: 400 }
      );
    }

    let finalUsername = fromUsername || "Guest";
    let isAdmin = false;

    if (fromUserId) {
      const user = await User.findById(fromUserId);
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      if (user.isBanned) {
        return NextResponse.json({ error: "User is banned" }, { status: 403 });
      }
      if (user.chatMutedUntil && user.chatMutedUntil > new Date()) {
        return NextResponse.json(
          {
            error: "User is muted",
            mutedUntil: user.chatMutedUntil,
            reason: user.chatMuteReason ?? "Muted by admin",
          },
          { status: 403 }
        );
      }
      finalUsername = user.username;
      isAdmin = user.role === "admin";
    }

    const message = await ChatMessage.create({
      channelId,
      channelType,
      text: text.slice(0, 500),
      fromUserId: fromUserId || null,
      fromUsername: finalUsername,
      isAdmin,
    });

    // TODO: Publish event to WebSocket / message broker for real-time updates.

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error("POST /api/chat/messages error", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

