/**
 * Lightweight helpers to seed test data into MongoDB for
 * promotions, chat, and leaderboards.
 *
 * Call these from a one-off script or a protected API route
 * when you want fake data to exercise the admin panel.
 */

import dbConnect from "./mongodb";
import {
  Promotion,
  LeaderboardEntry,
  ChatMessage,
  User,
} from "@/models";

export async function seedTestPromotions() {
  await dbConnect();
  const count = await Promotion.countDocuments({});
  if (count > 0) return;

  await Promotion.insertMany([
    {
      name: "Daily Login Bonus",
      slug: "daily-login",
      description: "Claim a small stack of coins once per day.",
      kind: "daily_login",
      rewardType: "coins",
      rewardValue: 100,
      recurrence: "daily",
      status: "active",
    },
    {
      name: "Mines Weekend Multiplier",
      slug: "mines-weekend",
      description: "Boosted multipliers on Crypto Mines all weekend.",
      kind: "event_milestone",
      rewardType: "multiplier",
      rewardValue: 1.2,
      recurrence: "weekly",
      status: "scheduled",
    },
  ]);
}

export async function seedTestLeaderboards() {
  await dbConnect();
  const count = await LeaderboardEntry.countDocuments({});
  if (count > 0) return;

  const now = new Date();
  await LeaderboardEntry.insertMany([
    {
      userId: new (require("mongoose").Types.ObjectId)(),
      username: "WhaleKing",
      metric: "total_coins",
      scope: "global",
      timeframe: "daily",
      value: 45230,
      rank: 1,
      snapshotAt: now,
    },
    {
      userId: new (require("mongoose").Types.ObjectId)(),
      username: "CryptoQueen",
      metric: "total_coins",
      scope: "global",
      timeframe: "daily",
      value: 38100,
      rank: 2,
      snapshotAt: now,
    },
  ]);
}

export async function seedTestChat() {
  await dbConnect();
  const count = await ChatMessage.countDocuments({ channelId: "global" });
  if (count > 0) return;

  await ChatMessage.insertMany([
    {
      channelId: "global",
      channelType: "global",
      fromUsername: "NeonTrader",
      text: "Rapid Jackpot is huge today! 🚀",
    },
    {
      channelId: "global",
      channelType: "global",
      fromUsername: "Satoshi_7",
      text: "Just doubled my RC on Mines.",
    },
    {
      channelId: "global",
      channelType: "global",
      fromUsername: "Admin",
      text: "Welcome to the Beta launch!",
      isAdmin: true,
    },
  ]);
}

export async function seedAdminUserIfMissing() {
  await dbConnect();
  const existing = await User.findOne({ role: "admin" });
  if (existing) return;

  await User.create({
    username: "admin",
    email: "admin@example.com",
    passwordHash: "CHANGE_ME",
    role: "admin",
  });
}

