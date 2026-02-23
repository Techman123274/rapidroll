import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReferral extends Document {
  /**
   * User who owns the referral code.
   */
  ownerUserId: mongoose.Types.ObjectId;
  /**
   * Public code a new player can use.
   */
  code: string;
  /**
   * User who signed up with this code.
   */
  referredUserId?: mongoose.Types.ObjectId;
  rewardCoins?: number;
  rewardMultiplier?: number;
  rewardSpins?: number;
  isRewardGranted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReferralSchema = new Schema<IReferral>(
  {
    ownerUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    referredUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    rewardCoins: {
      type: Number,
      default: 0,
    },
    rewardMultiplier: {
      type: Number,
      default: 0,
    },
    rewardSpins: {
      type: Number,
      default: 0,
    },
    isRewardGranted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

ReferralSchema.index({ ownerUserId: 1, isRewardGranted: 1 });

const Referral: Model<IReferral> =
  mongoose.models.Referral ?? mongoose.model<IReferral>("Referral", ReferralSchema);

export default Referral;

