import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { User } from "@/models";

/**
 * GET /api/admin/users
 * - Basic paginated list of users.
 *
 * POST /api/admin/users
 * - Stub endpoint to create a user (for testing tools).
 * - In production, registration should go through auth flows instead.
 */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const page = Math.max(Number(searchParams.get("page") || 1), 1);
    const pageSize = Math.min(Number(searchParams.get("pageSize") || 20), 100);

    const [items, total] = await Promise.all([
      User.find({})
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean(),
      User.countDocuments({}),
    ]);

    return NextResponse.json({
      items,
      pagination: {
        page,
        pageSize,
        total,
      },
    });
  } catch (error) {
    console.error("GET /api/admin/users error", error);
    return NextResponse.json(
      { error: "Failed to load users" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { username, email, passwordHash, role } = body;

    if (!username || !email || !passwordHash) {
      return NextResponse.json(
        { error: "username, email and passwordHash are required" },
        { status: 400 }
      );
    }

    // TODO: Admin-only. This is a stub helper for test data.
    const user = await User.create({
      username,
      email,
      passwordHash,
      role: role ?? "user",
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/users error", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

