import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPromotionClaim extends Document {
  userId: mongoose.Types.ObjectId;
  promotionId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const PromotionClaimSchema = new Schema<IPromotionClaim>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    promotionId: {
      type: Schema.Types.ObjectId,
      ref: "Promotion",
      required: true,
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

PromotionClaimSchema.index({ userId: 1, promotionId: 1 }, { unique: true });

const PromotionClaim: Model<IPromotionClaim> =
  mongoose.models.PromotionClaim ??
  mongoose.model<IPromotionClaim>("PromotionClaim", PromotionClaimSchema);

export default PromotionClaim;

