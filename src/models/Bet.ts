import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProvablyFairData {
  serverSeed: string;
  serverSeedHash: string;
  clientSeed: string;
  nonce: number;
  result?: string | number; // Game-specific outcome for verification
}

export interface IBet extends Document {
  userId: mongoose.Types.ObjectId;
  gameId: mongoose.Types.ObjectId | string;
  wager: mongoose.Types.Decimal128;
  payout: mongoose.Types.Decimal128;
  multiplier: number;
  provablyFair?: IProvablyFairData;
  status: "pending" | "won" | "lost" | "refunded";
  createdAt: Date;
  updatedAt: Date;
}

const ProvablyFairSchema = new Schema<IProvablyFairData>(
  {
    serverSeed: { type: String, required: true },
    serverSeedHash: { type: String, required: true },
    clientSeed: { type: String, required: true },
    nonce: { type: Number, required: true },
    result: { type: Schema.Types.Mixed },
  },
  { _id: false }
);

const BetSchema = new Schema<IBet>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    gameId: {
      type: Schema.Types.Mixed,
      required: true,
    },
    wager: {
      type: Schema.Types.Decimal128,
      required: true,
    },
    payout: {
      type: Schema.Types.Decimal128,
      required: true,
    },
    multiplier: {
      type: Number,
      required: true,
      default: 1,
    },
    provablyFair: {
      type: ProvablyFairSchema,
    },
    status: {
      type: String,
      enum: ["pending", "won", "lost", "refunded"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

BetSchema.index({ userId: 1, createdAt: -1 });
BetSchema.index({ gameId: 1, createdAt: -1 });

const Bet: Model<IBet> =
  mongoose.models.Bet ?? mongoose.model<IBet>("Bet", BetSchema);

export default Bet;
