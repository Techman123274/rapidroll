"use server";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import Bet from "@/models/Bet";
import mongoose from "mongoose";
import { createCyberCrimeEngine } from "@/slots/engine/cyberCrimeGame";
import type { BonusState, VolatilityMode } from "@/slots/engine/PaylineEvaluator";

interface SpinBody {
  betPerLine: number;
  linesCount?: number;
  volatilityMode?: VolatilityMode;
  bonusState?: BonusState;
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: SpinBody;
  try {
    body = (await request.json()) as SpinBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const betPerLine = Number(body.betPerLine);
  const linesCount = body.linesCount ?? 50;

  if (!Number.isFinite(betPerLine) || betPerLine <= 0) {
    return NextResponse.json({ error: "Invalid bet amount" }, { status: 400 });
  }
  if (linesCount <= 0 || linesCount > 50) {
    return NextResponse.json({ error: "Invalid lines count" }, { status: 400 });
  }

  const totalBet = betPerLine * linesCount;

  await dbConnect();

  const user = await User.findById(session.user.id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const currentBalance = parseFloat(user.balance.toString());
  if (currentBalance < totalBet && !(body.bonusState && body.bonusState.active)) {
    return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
  }

  const engine = createCyberCrimeEngine();
  const outcome = engine.spin({
    betPerLine,
    linesCount,
    bonusState: body.bonusState,
  });

  // Wallet adjustment
  const isBonusSpin = !!body.bonusState?.active;
  const wager = isBonusSpin ? 0 : totalBet;
  const newBalance = currentBalance - wager + outcome.totalWin;

  user.balance = mongoose.Types.Decimal128.fromString(newBalance.toFixed(2));
  const wagered = (user.stats?.wagered ?? 0) + wager;
  const lifetime =
    (user.stats?.lifetimeEarnings ?? 0) + Math.max(0, outcome.totalWin - wager);
  user.stats = { ...user.stats, wagered, lifetimeEarnings: lifetime };
  await user.save();

  if (wager > 0) {
    await Transaction.create({
      userId: user._id,
      amount: -wager,
      balanceBefore: currentBalance,
      balanceAfter: currentBalance - wager,
      reason: "GAME_BET",
      description: `Cyber Crime bet: -${wager.toFixed(2)}`,
      meta: { gameId: "cyber-crime-v2" },
    });
  }

  if (outcome.totalWin > 0) {
    await Transaction.create({
      userId: user._id,
      amount: outcome.totalWin,
      balanceBefore: currentBalance - wager,
      balanceAfter: newBalance,
      reason: "GAME_WIN",
      description: `Cyber Crime win: +${outcome.totalWin.toFixed(2)}`,
      meta: {
        gameId: "cyber-crime-v2",
        paylinesHit: outcome.paylinesHit.map((l) => l.lineIndex),
        scatterCount: outcome.scatter.scatterCount,
        bonusActive: outcome.bonusState?.active ?? false,
      },
    });
  }

  await Bet.create({
    userId: user._id,
    gameId: "cyber-crime-v2",
    wager: mongoose.Types.Decimal128.fromString(wager.toFixed(2)),
    payout: mongoose.Types.Decimal128.fromString(outcome.totalWin.toFixed(2)),
    multiplier: wager > 0 ? outcome.totalWin / wager : 0,
    status: outcome.totalWin > 0 ? "won" : "lost",
  });

  return NextResponse.json({
    ok: true,
    grid: outcome.grid,
    totalWin: outcome.totalWin,
    paylinesHit: outcome.paylinesHit,
    scatter: outcome.scatter,
    multipliers: outcome.multipliers,
    bonusState: outcome.bonusState,
    bonusTriggered: outcome.bonusTriggered,
    balance: newBalance.toFixed(2),
  });
}

