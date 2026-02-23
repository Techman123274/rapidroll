import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  reason: string;
  description?: string;
  meta?: Record<string, unknown>;
  createdAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    balanceBefore: { type: Number, required: true },
    balanceAfter: { type: Number, required: true },
    reason: { type: String, required: true },
    description: String,
    meta: Schema.Types.Mixed,
  },
  { timestamps: true }
);

TransactionSchema.index({ userId: 1, createdAt: -1 });

const Transaction: Model<ITransaction> =
  mongoose.models.Transaction ??
  mongoose.model<ITransaction>("Transaction", TransactionSchema);

export default Transaction;
