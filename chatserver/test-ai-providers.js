import { generateOpenAIResponse } from "./middlewares/openaiHandler.js";
import { generateGeminiResponse } from "./middlewares/geminiHandler.js";
import dotenv from "dotenv";

dotenv.config();

const testAIProviders = async () => {
  const testPrompt =
    "Explain the benefits of multilingual education in 2-3 sentences.";

  console.log("Testing AI Providers with prompt:", testPrompt);
  console.log("----------------------------------------");

  try {
    console.log("Testing Gemini API...");
    const geminiResponse = await generateGeminiResponse(testPrompt);
    console.log("Gemini Response:", geminiResponse);
    console.log("----------------------------------------");
  } catch (error) {
    console.error("Gemini API Error:", error.message);
  }

  try {
    console.log("Testing OpenAI API...");
    const openaiResponse = await generateOpenAIResponse(testPrompt);
    console.log("OpenAI Response:", openaiResponse);
    console.log("----------------------------------------");
  } catch (error) {
    console.error("OpenAI API Error:", error.message);
  }

  console.log("Test completed.");
};

testAIProviders();
