import mongoose, { Schema, Document, Model } from "mongoose";

export type AdminApplicationStatus = "pending" | "reviewed" | "accepted" | "rejected";

export interface IAdminApplication extends Document {
  name: string;
  email: string;
  discord?: string;
  experience?: string;
  motivation?: string;
  roleInterest?: string;
  createdAt: Date;
  updatedAt: Date;
  status: AdminApplicationStatus;
}

const AdminApplicationSchema = new Schema<IAdminApplication>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    discord: {
      type: String,
      default: "",
      trim: true,
    },
    experience: {
      type: String,
      default: "",
      trim: true,
    },
    motivation: {
      type: String,
      default: "",
      trim: true,
    },
    roleInterest: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "accepted", "rejected"],
      default: "pending",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const AdminApplication: Model<IAdminApplication> =
  mongoose.models.AdminApplication ??
  mongoose.model<IAdminApplication>("AdminApplication", AdminApplicationSchema);

export default AdminApplication;

