import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/admin/system/emergency
 *
 * Body:
 * - gamesPaused: boolean
 * - chatDisabled: boolean
 * - promotionsDisabled: boolean
 * - hideChat: boolean
 * - hideLeaderboard: boolean
 *
 * This is an in-memory stub for an "Emergency Mode" toggle and
 * global UI visibility controls. For production, persist this to
 * MongoDB or a config service.
 */

let emergencyState = {
  gamesPaused: false,
  chatDisabled: false,
  promotionsDisabled: false,
  hideChat: false,
  hideLeaderboard: false,
};

export async function GET() {
  return NextResponse.json(emergencyState);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    emergencyState = {
      gamesPaused:
        typeof body.gamesPaused === "boolean"
          ? body.gamesPaused
          : emergencyState.gamesPaused,
      chatDisabled:
        typeof body.chatDisabled === "boolean"
          ? body.chatDisabled
          : emergencyState.chatDisabled,
      promotionsDisabled:
        typeof body.promotionsDisabled === "boolean"
          ? body.promotionsDisabled
          : emergencyState.promotionsDisabled,
      hideChat:
        typeof body.hideChat === "boolean"
          ? body.hideChat
          : emergencyState.hideChat,
      hideLeaderboard:
        typeof body.hideLeaderboard === "boolean"
          ? body.hideLeaderboard
          : emergencyState.hideLeaderboard,
    };

    // TODO: Gate with admin auth and propagate to game servers.

    return NextResponse.json(emergencyState);
  } catch (error) {
    console.error("POST /api/admin/system/emergency error", error);
    return NextResponse.json(
      { error: "Failed to update emergency state" },
      { status: 500 }
    );
  }
}

