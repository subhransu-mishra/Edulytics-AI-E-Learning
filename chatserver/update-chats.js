import mongoose from "mongoose";
import { Chat } from "./models/Chat.js";
import dotenv from "dotenv";

dotenv.config();

// Script to update all existing chats to have an aiProvider field

async function updateChats() {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(process.env.Db_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to database. Finding chats without aiProvider...");

    // Find all chats that don't have an aiProvider set
    const chatsToUpdate = await Chat.find({ aiProvider: { $exists: false } });

    console.log(`Found ${chatsToUpdate.length} chats without aiProvider.`);

    if (chatsToUpdate.length === 0) {
      console.log(
        "No chats need updating. All chats already have an aiProvider set."
      );
      process.exit(0);
    }

    console.log("Updating chats...");

    // Update all chats to use Gemini as default
    const result = await Chat.updateMany(
      { aiProvider: { $exists: false } },
      { $set: { aiProvider: "gemini" } }
    );

    console.log(
      `Updated ${result.modifiedCount} chats to use Gemini as default.`
    );
    console.log("Update completed successfully.");

    process.exit(0);
  } catch (error) {
    console.error("Error updating chats:", error);
    process.exit(1);
  }
}

updateChats();
