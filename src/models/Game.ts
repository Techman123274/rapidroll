import mongoose, { Schema, Document, Model } from "mongoose";

export type GameCategory = "Slots" | "Originals";

export interface IGame extends Document {
  title: string;
  slug: string;
  thumbnail: string;
  category: GameCategory;
  providerUrl: string;
  featured?: boolean;
  order?: number;
  createdAt: Date;
  updatedAt: Date;
}

const GameSchema = new Schema<IGame>(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Slots", "Originals"],
      required: true,
    },
    providerUrl: {
      type: String,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

GameSchema.index({ category: 1 });
GameSchema.index({ featured: 1, order: 1 });

const Game: Model<IGame> =
  mongoose.models.Game ?? mongoose.model<IGame>("Game", GameSchema);

export default Game;
