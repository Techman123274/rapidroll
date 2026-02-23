import mongoose, { Schema, Document, Model } from "mongoose";

export type ChatChannelType = "global" | "game" | "private" | "system";

export interface IChatMessage extends Document {
  channelId: string;
  channelType: ChatChannelType;
  fromUserId?: mongoose.Types.ObjectId;
  fromUsername: string;
  text: string;
  isAdmin?: boolean;
  isSystem?: boolean;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    channelId: {
      type: String,
      required: true,
      index: true,
    },
    channelType: {
      type: String,
      enum: ["global", "game", "private", "system"],
      required: true,
      index: true,
    },
    fromUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    fromUsername: {
      type: String,
      required: true,
      trim: true,
    },
    text: {
      type: String,
      required: true,
      maxlength: 500,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isSystem: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "chats",
  }
);

ChatMessageSchema.index({ channelId: 1, createdAt: -1 });

const ChatMessage: Model<IChatMessage> =
  mongoose.models.ChatMessage ?? mongoose.model<IChatMessage>("ChatMessage", ChatMessageSchema);

export default ChatMessage;

