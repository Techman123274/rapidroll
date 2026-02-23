import mongoose, { Schema, Document, Model } from "mongoose";

export type UserRole = "owner" | "admin" | "user";

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  balance: mongoose.Types.Decimal128;
  role: UserRole;
  activeSeeds?: string[];
  stats?: { wagered?: number; lifetimeEarnings?: number };
  isBanned?: boolean;
  chatMutedUntil?: Date | null;
  chatMuteReason?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    balance: {
      type: Schema.Types.Decimal128,
      required: true,
      default: mongoose.Types.Decimal128.fromString("0"),
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    activeSeeds: {
      type: [String],
      default: [],
    },
    stats: {
      wagered: { type: Number, default: 0 },
      lifetimeEarnings: { type: Number, default: 0 },
    },
    isBanned: {
      type: Boolean,
      default: false,
      index: true,
    },
    chatMutedUntil: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>("User", UserSchema);

export default User;
