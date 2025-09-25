import { Chat } from "../models/Chat.js";
import { Conversation } from "../models/Conversation.js";
import { generateGeminiResponse } from "../middlewares/geminiHandler.js";
import { generateOpenAIResponse } from "../middlewares/openaiHandler.js";
import deepseekHandler from "../middlewares/deepseekHandler.js";

export const createChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const { aiProvider } = req.body;

    const chat = await Chat.create({
      user: userId,
      aiProvider: aiProvider || "gemini", // Default to gemini if not specified
    });

    res.json(chat);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(chats);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const addConversation = async (req, res) => {
  try {
    console.log("Adding conversation for chat ID:", req.params.id);
    console.log("Request body:", req.body);

    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      console.log("Chat not found with ID:", req.params.id);
      return res.status(404).json({
        message: "No chat with this id",
      });
    }

    // Get the question from the request body
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        message: "Question is required",
      });
    }

    // Determine which AI provider to use
    const aiProvider = chat.aiProvider || "gemini";
    console.log("Using AI provider:", aiProvider);

    // Generate AI response based on provider
    let answer;
    let actualModelUsed = aiProvider;
    let fallbackUsed = false;

    try {
      if (aiProvider === "openai") {
        try {
          // Try OpenAI first
          console.log("Generating OpenAI response");
          answer = await generateOpenAIResponse(question);
        } catch (openAIError) {
          console.warn(
            "OpenAI API failed, falling back to Gemini:",
            openAIError.message
          );

          // Fallback to Gemini if OpenAI fails
          console.log("Falling back to Gemini API");
          answer = await generateGeminiResponse(question);
          actualModelUsed = "gemini";
          fallbackUsed = true;

          // Prefix the answer with a notice about the fallback
          answer =
            "⚠️ OpenAI API error occurred. Falling back to Gemini AI.\n\n" +
            answer;
        }
      } else if (aiProvider === "deepseek") {
        try {
          // Use DeepSeek
          console.log("Generating DeepSeek response");
          const req = { body: { prompt: question } };
          const res = { json: (data) => data };
          await deepseekHandler(req, res, () => {});
          answer = req.aiResponse;
        } catch (deepseekError) {
          console.warn(
            "DeepSeek API failed, falling back to Gemini:",
            deepseekError.message
          );

          // Fallback to Gemini if DeepSeek fails
          console.log("Falling back to Gemini API");
          answer = await generateGeminiResponse(question);
          actualModelUsed = "gemini";
          fallbackUsed = true;

          // Prefix the answer with a notice about the fallback
          answer =
            "⚠️ DeepSeek API error occurred. Falling back to Gemini AI.\n\n" +
            answer;
        }
      } else {
        // Default to Gemini
        console.log("Generating Gemini response");
        answer = await generateGeminiResponse(question);
      }

      console.log("AI response generated successfully using", actualModelUsed);
    } catch (aiError) {
      console.error("Error generating AI response:", aiError);
      return res.status(500).json({
        message: "Failed to generate AI response: " + aiError.message,
      });
    }
    const conversation = await Conversation.create({
      chat: chat._id,
      question: question,
      answer: answer,
      modelUsed: aiProvider, // Use the original aiProvider instead of actualModelUsed
    });

    // If we used a fallback, update the chat to use Gemini for future queries
    if (fallbackUsed) {
      const updatedChat = await Chat.findByIdAndUpdate(
        req.params.id,
        {
          latestMessage: question,
          aiProvider: actualModelUsed, // Update to the model that actually worked
        },
        { new: true }
      );

      res.json({
        conversation,
        updatedChat,
        fallbackUsed: true,
        fallbackMessage:
          "OpenAI API key error. Automatically switched to Gemini AI.",
      });
    } else {
      const updatedChat = await Chat.findByIdAndUpdate(
        req.params.id,
        { latestMessage: question },
        { new: true }
      );

      res.json({
        conversation,
        updatedChat,
      });
    }

    console.log("Conversation created successfully");
    // The response is already sent above, don't send it again
  } catch (error) {
    console.error("Error in addConversation:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getConversation = async (req, res) => {
  try {
    const conversation = await Conversation.find({ chat: req.params.id });

    if (!conversation)
      return res.status(404).json({
        message: "No conversation with this id",
      });

    res.json(conversation);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);

    if (!chat)
      return res.status(404).json({
        message: "No chat with this id",
      });

    if (chat.user.toString() !== req.user._id.toString())
      return res.status(403).json({
        message: "Unauthorized",
      });

    await chat.deleteOne();

    res.json({
      message: "Chat Deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateChatAIProvider = async (req, res) => {
  try {
    const { aiProvider } = req.body;

    if (!aiProvider || !["gemini", "openai", "deepseek"].includes(aiProvider)) {
      return res.status(400).json({
        message: "Invalid AI provider specified",
      });
    }

    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({
        message: "No chat with this id",
      });
    }

    if (chat.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      req.params.id,
      { aiProvider },
      { new: true }
    );

    res.json(updatedChat);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
