import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Promotion } from "@/models";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    await dbConnect();
    const { id } = await context.params;

    const promotion = await Promotion.findById(id);
    if (!promotion) {
      return NextResponse.json({ error: "Promotion not found" }, { status: 404 });
    }

    return NextResponse.json({ promotion });
  } catch (error) {
    console.error("GET /api/promotions/[id] error", error);
    return NextResponse.json(
      { error: "Failed to load promotion" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    await dbConnect();
    const { id } = await context.params;
    const update = await request.json();

    // TODO: validate fields and enforce admin auth.

    const promotion = await Promotion.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!promotion) {
      return NextResponse.json({ error: "Promotion not found" }, { status: 404 });
    }

    return NextResponse.json({ promotion });
  } catch (error) {
    console.error("PATCH /api/promotions/[id] error", error);
    return NextResponse.json(
      { error: "Failed to update promotion" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    await dbConnect();
    const { id } = await context.params;

    // Soft delete via status in production; for now, hard delete is fine for stubs.
    const promotion = await Promotion.findByIdAndDelete(id);
    if (!promotion) {
      return NextResponse.json({ error: "Promotion not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/promotions/[id] error", error);
    return NextResponse.json(
      { error: "Failed to delete promotion" },
      { status: 500 }
    );
  }
}

