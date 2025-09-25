import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    latestMessage: {
      type: String,
      default: "New Chat",
    },
    aiProvider: {
      type: String,
      enum: ["gemini", "openai", "deepseek"],
      default: "gemini",
    },
  },
  {
    timestamps: true,
  }
);

export const Chat = mongoose.model("Chat", schema);
