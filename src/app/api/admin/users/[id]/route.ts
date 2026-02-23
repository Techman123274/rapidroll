import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { User } from "@/models";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    await dbConnect();
    const { id } = await context.params;
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ user });
  } catch (error) {
    console.error("GET /api/admin/users/[id] error", error);
    return NextResponse.json(
      { error: "Failed to load user" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    await dbConnect();
    const { id } = await context.params;
    const patch = await request.json();

    // TODO: Validate fields and enforce admin auth.
    const user = await User.findByIdAndUpdate(id, patch, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ user });
  } catch (error) {
    console.error("PATCH /api/admin/users/[id] error", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

