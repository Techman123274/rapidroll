"use server";

import { auth } from "@/lib/auth-server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Bet from "@/models/Bet";
import Transaction from "@/models/Transaction";
import mongoose from "mongoose";

const GAME_ID = "cyber-crime";

/**
 * Deduct bet before spin. Returns new balance or error.
 */
export async function placeSlotBet(
  totalBet: number
): Promise<{ ok: true; balance: string } | { ok: false; error: string }> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Please log in to play" };
  if (totalBet <= 0) return { ok: false, error: "Invalid bet amount" };

  await dbConnect();
  const user = await User.findById(session.user.id);
  if (!user) return { ok: false, error: "User not found" };

  const credits = parseFloat(user.balance.toString());
  if (credits < totalBet) return { ok: false, error: "Insufficient balance" };

  const newCredits = credits - totalBet;
  user.balance = mongoose.Types.Decimal128.fromString(newCredits.toFixed(2));
  const wagered = (user.stats?.wagered ?? 0) + totalBet;
  user.stats = { ...user.stats, wagered };
  await user.save();

  await Transaction.create({
    userId: user._id,
    amount: -totalBet,
    balanceBefore: credits,
    balanceAfter: newCredits,
    reason: "GAME_BET",
    description: `Slot wager: -${totalBet.toFixed(2)}`,
    meta: { gameId: GAME_ID },
  });

  return { ok: true, balance: newCredits.toFixed(2) };
}

/**
 * Credit winnings after spin. Call after client has run engine and has win amount.
 */
export async function creditSlotWin(
  totalBet: number,
  winAmount: number,
  grid: string[][],
  provablyFair?: { serverSeed?: string; clientSeed?: string; nonce?: number }
): Promise<{ ok: true; balance: string } | { ok: false; error: string }> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };

  await dbConnect();
  const user = await User.findById(session.user.id);
  if (!user) return { ok: false, error: "User not found" };

  const currentCredits = parseFloat(user.balance.toString());
  const newCredits = Math.round((currentCredits + winAmount) * 100) / 100;
  const profit = winAmount - totalBet;

  user.balance = mongoose.Types.Decimal128.fromString(newCredits.toFixed(2));
  const lifetime = (user.stats?.lifetimeEarnings ?? 0) + (profit > 0 ? profit : 0);
  user.stats = { ...user.stats, lifetimeEarnings: lifetime };
  await user.save();

  if (winAmount > 0) {
    await Transaction.create({
      userId: user._id,
      amount: winAmount,
      balanceBefore: currentCredits,
      balanceAfter: newCredits,
      reason: "GAME_WIN",
      description: `Slot win: +${winAmount.toFixed(2)}`,
      meta: { gameId: GAME_ID, totalBet, winAmount },
    });
  }

  await Bet.create({
    userId: user._id,
    gameId: GAME_ID,
    wager: mongoose.Types.Decimal128.fromString(totalBet.toFixed(2)),
    payout: mongoose.Types.Decimal128.fromString(winAmount.toFixed(2)),
    multiplier: totalBet > 0 ? winAmount / totalBet : 0,
    status: winAmount > 0 ? "won" : "lost",
    provablyFair: provablyFair
      ? {
          serverSeed: provablyFair.serverSeed ?? "",
          serverSeedHash: "",
          clientSeed: provablyFair.clientSeed ?? "",
          nonce: provablyFair.nonce ?? 0,
          result: grid,
        }
      : undefined,
  });

  return { ok: true, balance: newCredits.toFixed(2) };
}
