import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    modelUsed: {
      type: String,
      enum: ["gemini", "openai", "deepseek"],
      default: "gemini",
    },
  },
  {
    timestamps: true,
  }
);

export const Conversation = mongoose.model("Conversation", schema);
