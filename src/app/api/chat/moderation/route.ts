import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { ChatMessage, User } from "@/models";

/**
 * POST /api/chat/moderation
 *
 * Body:
 * - action: "delete_message" | "ban_user" | "mute_user" | "unmute_user"
 * - messageId? (for delete_message)
 * - userId? (for ban/mute/unmute)
 * - muteMinutes? (for mute_user)
 *
 * In production, this must be admin-only. Here it's stubbed without auth.
 */
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { action, messageId, userId, muteMinutes, reason } = body;

    switch (action) {
      case "delete_message": {
        if (!messageId) {
          return NextResponse.json(
            { error: "messageId is required for delete_message" },
            { status: 400 }
          );
        }
        const msg = await ChatMessage.findByIdAndUpdate(
          messageId,
          { deletedAt: new Date() },
          { new: true }
        );
        if (!msg) {
          return NextResponse.json({ error: "Message not found" }, { status: 404 });
        }
        return NextResponse.json({ message: msg });
      }

      case "ban_user": {
        if (!userId) {
          return NextResponse.json(
            { error: "userId is required for ban_user" },
            { status: 400 }
          );
        }
        const user = await User.findByIdAndUpdate(
          userId,
          { isBanned: true },
          { new: true }
        );
        if (!user) {
          return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        return NextResponse.json({ user });
      }

      case "mute_user": {
        if (!userId) {
          return NextResponse.json(
            { error: "userId is required for mute_user" },
            { status: 400 }
          );
        }
        const minutes = typeof muteMinutes === "number" ? muteMinutes : 60;
        const until = new Date(Date.now() + minutes * 60 * 1000);
        const user = await User.findByIdAndUpdate(
          userId,
          { chatMutedUntil: until, chatMuteReason: reason ?? "Muted by admin" },
          { new: true }
        );
        if (!user) {
          return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        return NextResponse.json({ user });
      }

      case "unmute_user": {
        if (!userId) {
          return NextResponse.json(
            { error: "userId is required for unmute_user" },
            { status: 400 }
          );
        }
        const user = await User.findByIdAndUpdate(
          userId,
          { chatMutedUntil: null, chatMuteReason: null },
          { new: true }
        );
        if (!user) {
          return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        return NextResponse.json({ user });
      }

      default:
        return NextResponse.json(
          { error: "Unsupported moderation action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("POST /api/chat/moderation error", error);
    return NextResponse.json(
      { error: "Failed to apply moderation action" },
      { status: 500 }
    );
  }
}

