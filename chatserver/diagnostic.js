import dotenv from "dotenv";
import { generateGeminiResponse } from "./middlewares/geminiHandler.js";
import { generateOpenAIResponse } from "./middlewares/openaiHandler.js";

dotenv.config();

console.log("\n===== DIAGNOSTIC SCRIPT =====\n");

// Check environment variables
console.log("Checking environment variables:");
console.log("- PORT:", process.env.PORT ? "✓ Set" : "✗ Not set");
console.log(
  "- GEMINI_API_KEY:",
  process.env.GEMINI_API_KEY ? "✓ Set" : "✗ Not set"
);
console.log(
  "- OPENAI_API_KEY:",
  process.env.OPENAI_API_KEY ? "✓ Set" : "✗ Not set"
);

// Test functions
const runTests = async () => {
  console.log("\nTesting AI providers:");

  // Test Gemini
  try {
    console.log("\n1. Testing Gemini API...");
    const geminiResponse = await generateGeminiResponse(
      "Hello, this is a test request. Please respond with 'Gemini is working'."
    );
    console.log("- Response:", geminiResponse);
    console.log("- Status: ✓ Working");
  } catch (error) {
    console.error("- Status: ✗ Error:", error.message);
  }

  // Test OpenAI
  try {
    console.log("\n2. Testing OpenAI API...");
    const openaiResponse = await generateOpenAIResponse(
      "Hello, this is a test request. Please respond with 'OpenAI is working'."
    );
    console.log("- Response:", openaiResponse);
    console.log("- Status: ✓ Working");
  } catch (error) {
    console.error("- Status: ✗ Error:", error.message);
  }

  console.log("\n===== DIAGNOSTIC COMPLETE =====\n");
};

runTests();
