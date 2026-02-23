import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { AdminApplication } from "@/models";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { name, email, discord, experience, motivation, roleInterest } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "name and email are required" },
        { status: 400 }
      );
    }

    await AdminApplication.create({
      name,
      email,
      discord,
      experience,
      motivation,
      roleInterest,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("POST /api/admin/applications error", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}

