import mongoose, { Schema, Document, Model } from "mongoose";

export type PromotionStatus = "draft" | "scheduled" | "active" | "expired" | "disabled";

export type PromotionRecurrence = "once" | "daily" | "weekly" | "monthly" | "custom";

export type PromotionKind =
  | "welcome_bonus"
  | "daily_login"
  | "weekly_rakeback"
  | "event_holiday"
  | "event_milestone"
  | "new_game_launch"
  | "referral"
  | "manual";

export type PromotionRewardType = "coins" | "multiplier" | "free_spins";

export interface IPromotion extends Document {
  name: string;
  slug: string;
  description?: string;
  kind: PromotionKind;
  rewardType: PromotionRewardType;
  rewardValue: number;
  /**
   * Optional cap per-player (e.g. max coins or spins)
   */
  perUserCap?: number;
  /**
   * Optional global cap for this promotion.
   */
  globalCap?: number;
  startsAt?: Date;
  endsAt?: Date;
  recurrence: PromotionRecurrence;
  status: PromotionStatus;
  /**
   * Arbitrary JSON-safe config for custom logic, used by backend only.
   */
  config?: Record<string, unknown>;
  /**
   * Lightweight eligibility filters for common cases.
   * More complex rules can live in `config`.
   */
  eligibility?: {
    minBalance?: number;
    maxBalance?: number;
    minTotalWagered?: number;
    minLifetimeEarnings?: number;
    newUsersOnly?: boolean;
    countriesAllowlist?: string[];
    countriesBlocklist?: string[];
    rolesAllowlist?: string[];
  };
  analytics?: {
    views: number;
    claimed: number;
    uniqueClaimants: number;
    lastClaimAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const PromotionSchema = new Schema<IPromotion>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    kind: {
      type: String,
      enum: [
        "welcome_bonus",
        "daily_login",
        "weekly_rakeback",
        "event_holiday",
        "event_milestone",
        "new_game_launch",
        "referral",
        "manual",
      ],
      default: "manual",
    },
    rewardType: {
      type: String,
      enum: ["coins", "multiplier", "free_spins"],
      required: true,
    },
    rewardValue: {
      type: Number,
      required: true,
      min: 0,
    },
    perUserCap: {
      type: Number,
      default: null,
    },
    globalCap: {
      type: Number,
      default: null,
    },
    startsAt: {
      type: Date,
      default: null,
    },
    endsAt: {
      type: Date,
      default: null,
    },
    recurrence: {
      type: String,
      enum: ["once", "daily", "weekly", "monthly", "custom"],
      default: "once",
    },
    status: {
      type: String,
      enum: ["draft", "scheduled", "active", "expired", "disabled"],
      default: "draft",
      index: true,
    },
    config: {
      type: Schema.Types.Mixed,
      default: {},
    },
    eligibility: {
      type: {
        minBalance: Number,
        maxBalance: Number,
        minTotalWagered: Number,
        minLifetimeEarnings: Number,
        newUsersOnly: Boolean,
        countriesAllowlist: [String],
        countriesBlocklist: [String],
        rolesAllowlist: [String],
      },
      default: {},
    },
    analytics: {
      type: {
        views: { type: Number, default: 0 },
        claimed: { type: Number, default: 0 },
        uniqueClaimants: { type: Number, default: 0 },
        lastClaimAt: { type: Date, default: null },
      },
      default: {
        views: 0,
        claimed: 0,
        uniqueClaimants: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

PromotionSchema.index({ status: 1, startsAt: 1, endsAt: 1 });
PromotionSchema.index({ kind: 1 });

const Promotion: Model<IPromotion> =
  mongoose.models.Promotion ?? mongoose.model<IPromotion>("Promotion", PromotionSchema);

export default Promotion;

