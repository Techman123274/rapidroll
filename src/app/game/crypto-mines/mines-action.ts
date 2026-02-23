"use server";

import { auth } from "@/lib/auth-server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Bet from "@/models/Bet";
import Transaction from "@/models/Transaction";
import {
  generateServerSeed,
  hashSeed,
  deriveMinePositions,
  computeMultiplier,
} from "@/lib/fairness";
import mongoose from "mongoose";

interface ActiveGame {
  serverSeed: string;
  clientSeed: string;
  nonce: number;
  minesCount: number;
  betAmount: number;
  userId: string;
  minePositions: number[];
}

const activeGames = new Map<string, ActiveGame>();

export async function startMinesGame(
  betAmount: number,
  minesCount: number,
  clientSeed: string,
  nonce: number
): Promise<
  | { ok: true; seedHash: string; nonce: number; balance: string }
  | { ok: false; error: string }
> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Please log in to play" };

  if (betAmount <= 0) return { ok: false, error: "Invalid bet amount" };
  if (minesCount < 1 || minesCount > 24) return { ok: false, error: "Invalid mine count" };

  await dbConnect();

  const user = await User.findById(session.user.id);
  if (!user) return { ok: false, error: "User not found" };

  const credits = parseFloat(user.balance.toString());
  if (credits < betAmount) return { ok: false, error: "Insufficient balance" };

  const newCredits = credits - betAmount;
  user.balance = mongoose.Types.Decimal128.fromString(newCredits.toFixed(2));
  const wagered = (user.stats?.wagered ?? 0) + betAmount;
  user.stats = { ...user.stats, wagered };
  await user.save();

  await Transaction.create({
    userId: user._id,
    amount: -betAmount,
    balanceBefore: credits,
    balanceAfter: newCredits,
    reason: "GAME_BET",
    description: `Mines wager: -${betAmount}`,
    meta: { gameId: "mines", minesCount, nonce },
  });

  const serverSeed = generateServerSeed();
  const seedHash = hashSeed(serverSeed);
  const minePositions = deriveMinePositions(serverSeed, clientSeed, nonce, minesCount);

  const gameKey = `${session.user.id}:${nonce}`;
  activeGames.set(gameKey, {
    serverSeed,
    clientSeed,
    nonce,
    minesCount,
    betAmount,
    userId: session.user.id,
    minePositions,
  });

  return { ok: true, seedHash, nonce, balance: newCredits.toFixed(2) };
}

export async function revealMinesTile(
  tileIndex: number,
  nonce: number
): Promise<
  | { ok: true; safe: true; multiplier: number }
  | { ok: true; safe: false; minePositions: number[]; serverSeed: string }
  | { ok: false; error: string }
> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };

  const gameKey = `${session.user.id}:${nonce}`;
  const game = activeGames.get(gameKey);
  if (!game) return { ok: false, error: "No active game found" };

  if (tileIndex < 0 || tileIndex > 24) return { ok: false, error: "Invalid tile" };

  if (game.minePositions.includes(tileIndex)) {
    activeGames.delete(gameKey);

    await dbConnect();
    await Bet.create({
      userId: game.userId,
      gameId: "mines",
      wager: game.betAmount,
      multiplier: 0,
      payout: 0,
      status: "lost",
      provablyFair: {
        serverSeed: game.serverSeed,
        serverSeedHash: hashSeed(game.serverSeed),
        clientSeed: game.clientSeed,
        nonce: game.nonce,
        result: game.minePositions,
      },
    });

    return {
      ok: true,
      safe: false,
      minePositions: game.minePositions,
      serverSeed: game.serverSeed,
    };
  }

  const revealedCount = 1; // We reveal one at a time; client tracks total
  const multiplier = computeMultiplier(game.minesCount, revealedCount);
  return { ok: true, safe: true, multiplier };
}

export async function cashOutMines(
  revealedTiles: number[],
  nonce: number
): Promise<
  | { ok: true; payout: number; serverSeed: string; balance: string }
  | { ok: false; error: string }
> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };

  const gameKey = `${session.user.id}:${nonce}`;
  const game = activeGames.get(gameKey);
  if (!game) return { ok: false, error: "No active game found" };

  if (revealedTiles.length === 0) return { ok: false, error: "No tiles revealed" };

  for (const tile of revealedTiles) {
    if (game.minePositions.includes(tile)) {
      return { ok: false, error: "Invalid cashout: revealed tile is a mine" };
    }
  }

  const multiplier = computeMultiplier(game.minesCount, revealedTiles.length);
  const payout = Math.floor(game.betAmount * multiplier * 100) / 100;

  activeGames.delete(gameKey);

  await dbConnect();

  const user = await User.findById(session.user.id);
  if (!user) return { ok: false, error: "User not found" };

  const currentCredits = parseFloat(user.balance.toString());
  const newCredits = currentCredits + payout;
  const profit = payout - game.betAmount;

  user.balance = mongoose.Types.Decimal128.fromString(newCredits.toFixed(2));
  const lifetime = (user.stats?.lifetimeEarnings ?? 0) + (profit > 0 ? profit : 0);
  user.stats = { ...user.stats, lifetimeEarnings: lifetime };
  await user.save();

  await Transaction.create({
    userId: user._id,
    amount: payout,
    balanceBefore: currentCredits,
    balanceAfter: newCredits,
    reason: "GAME_WIN",
    description: `Mines cashout: +${payout} (${multiplier}x)`,
    meta: { gameId: "mines", multiplier, revealedTiles: revealedTiles.length },
  });

  await Bet.create({
    userId: game.userId,
    gameId: "mines",
    wager: game.betAmount,
    multiplier,
    payout,
    status: "won",
    provablyFair: {
      serverSeed: game.serverSeed,
      serverSeedHash: hashSeed(game.serverSeed),
      clientSeed: game.clientSeed,
      nonce: game.nonce,
      result: { minePositions: game.minePositions, revealedTiles },
    },
  });

  return { ok: true, payout, serverSeed: game.serverSeed, balance: newCredits.toFixed(2) };
}
