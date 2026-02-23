import mongoose, { Schema, Document, Model } from "mongoose";

export type AdminActionArea =
  | "auth"
  | "users"
  | "games"
  | "promotions"
  | "leaderboards"
  | "chat"
  | "sfx"
  | "system";

export interface IAdminActivityLog extends Document {
  adminUserId: mongoose.Types.ObjectId;
  area: AdminActionArea;
  action: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const AdminActivityLogSchema = new Schema<IAdminActivityLog>(
  {
    adminUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    area: {
      type: String,
      enum: ["auth", "users", "games", "promotions", "leaderboards", "chat", "sfx", "system"],
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
    },
    targetId: {
      type: String,
      default: null,
      index: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

AdminActivityLogSchema.index({ area: 1, createdAt: -1 });

const AdminActivityLog: Model<IAdminActivityLog> =
  mongoose.models.AdminActivityLog ??
  mongoose.model<IAdminActivityLog>("AdminActivityLog", AdminActivityLogSchema);

export default AdminActivityLog;

