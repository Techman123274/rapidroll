import mongoose, { Schema, Document, Model } from "mongoose";

export type LeaderboardMetric = "total_coins" | "highest_win" | "consistency";

export type LeaderboardScope = "global" | "game";

export type LeaderboardTimeframe = "daily" | "weekly" | "monthly" | "all_time";

export interface ILeaderboardEntry extends Document {
  userId: mongoose.Types.ObjectId;
  username: string;
  gameSlug?: string | null;
  metric: LeaderboardMetric;
  scope: LeaderboardScope;
  timeframe: LeaderboardTimeframe;
  value: number;
  rank?: number;
  snapshotAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LeaderboardEntrySchema = new Schema<ILeaderboardEntry>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    gameSlug: {
      type: String,
      default: null,
      index: true,
    },
    metric: {
      type: String,
      enum: ["total_coins", "highest_win", "consistency"],
      required: true,
      index: true,
    },
    scope: {
      type: String,
      enum: ["global", "game"],
      required: true,
      index: true,
    },
    timeframe: {
      type: String,
      enum: ["daily", "weekly", "monthly", "all_time"],
      required: true,
      index: true,
    },
    value: {
      type: Number,
      required: true,
    },
    rank: {
      type: Number,
      default: null,
    },
    snapshotAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

LeaderboardEntrySchema.index(
  { metric: 1, scope: 1, timeframe: 1, snapshotAt: -1, value: -1 },
  { name: "leaderboard_rank_query" }
);

const LeaderboardEntry: Model<ILeaderboardEntry> =
  mongoose.models.LeaderboardEntry ??
  mongoose.model<ILeaderboardEntry>("LeaderboardEntry", LeaderboardEntrySchema);

export default LeaderboardEntry;

