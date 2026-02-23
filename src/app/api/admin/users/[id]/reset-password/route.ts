import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import { User } from "@/models";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    await dbConnect();
    const { id } = await context.params;
    let body: { newPassword?: string } = {};
    try {
      body = await request.json();
    } catch {
      // allow empty body
    }

    const plain =
      typeof body.newPassword === "string" && body.newPassword.length >= 8
        ? body.newPassword
        : `Temp-${Math.random().toString(36).slice(2, 10)}`;

    const passwordHash = await bcrypt.hash(plain, 10);

    const user = await User.findByIdAndUpdate(
      id,
      { passwordHash },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // NOTE: For real systems, send this via email or secure channel instead.
    return NextResponse.json({
      user,
      temporaryPassword: body.newPassword ? undefined : plain,
    });
  } catch (error) {
    console.error("POST /api/admin/users/[id]/reset-password error", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}

