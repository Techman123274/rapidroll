import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

const SALT_ROUNDS = 10;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Username, email, and password required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const sanitizedUsername = String(username).trim().slice(0, 50);
    const sanitizedEmail = String(email).trim().toLowerCase().slice(0, 100);

    if (!/^[a-zA-Z0-9_-]+$/.test(sanitizedUsername)) {
      return NextResponse.json(
        { error: "Username can only contain letters, numbers, underscore, hyphen" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    await dbConnect();

    const existing = await User.findOne({
      $or: [
        { username: new RegExp(`^${sanitizedUsername}$`, "i") },
        { email: sanitizedEmail },
      ],
    });

    if (existing) {
      return NextResponse.json(
        { error: "Username or email already taken" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
      username: sanitizedUsername,
      email: sanitizedEmail,
      passwordHash,
      balance: mongoose.Types.Decimal128.fromString("100"),
    });

    return NextResponse.json({
      id: user._id.toString(),
      username: user.username,
      email: user.email,
    });
  } catch (e) {
    console.error("Register error:", e);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
