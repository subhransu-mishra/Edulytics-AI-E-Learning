import express from "express";
import { generateGeminiResponse } from "../middlewares/geminiHandler.js";
import { generateOpenAIResponse } from "../middlewares/openaiHandler.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Get API key status
const getApiKeyStatus = (type) => {
  if (type === "gemini") {
    const key = process.env.GEMINI_API_KEY;
    if (!key) return { valid: false, message: "API key is not configured" };
    if (key.length < 20)
      return {
        valid: false,
        message: "API key appears to be invalid (too short)",
      };
    return { valid: true, message: "API key is configured" };
  } else if (type === "openai") {
    const key = process.env.OPENAI_API_KEY;
    if (!key) return { valid: false, message: "API key is not configured" };
    if (!key.startsWith("sk-"))
      return {
        valid: false,
        message: "API key appears to be invalid (should start with 'sk-')",
      };
    if (key.length < 40)
      return {
        valid: false,
        message: "API key appears to be invalid (too short)",
      };
    return { valid: true, message: "API key is configured" };
  }
  return { valid: false, message: "Unknown API type" };
};

// Test route for Gemini API
router.get("/test-gemini", async (req, res) => {
  const keyStatus = getApiKeyStatus("gemini");

  try {
    // Check API key before making the request
    if (!keyStatus.valid) {
      return res.status(400).json({
        success: false,
        message: "Gemini API key issue",
        apiKeyStatus: keyStatus,
        error: "API key validation failed: " + keyStatus.message,
      });
    }

    console.log("Testing Gemini API...");
    const startTime = Date.now();
    const response = await generateGeminiResponse(
      "Hello, can you introduce yourself in one sentence?"
    );
    const responseTime = Date.now() - startTime;

    res.json({
      success: true,
      message: "Gemini API is working",
      apiKeyStatus: keyStatus,
      responseTime: `${responseTime}ms`,
      response,
    });
  } catch (error) {
    console.error("Gemini API test failed:", error);

    // Determine error type
    let errorType = "unknown";
    let statusCode = 500;

    if (error.message.includes("API key")) {
      errorType = "api_key_error";
      statusCode = 401;
    } else if (
      error.message.includes("network") ||
      error.message.includes("timeout")
    ) {
      errorType = "network_error";
      statusCode = 503;
    } else if (
      error.message.includes("429") ||
      error.message.includes("rate limit")
    ) {
      errorType = "rate_limit_error";
      statusCode = 429;
    }

    res.status(statusCode).json({
      success: false,
      message: "Gemini API test failed",
      apiKeyStatus: keyStatus,
      errorType,
      error: error.message,
      troubleshooting:
        "Check your .env file and ensure your Gemini API key is correctly configured.",
    });
  }
});

// Test route for OpenAI API
router.get("/test-openai", async (req, res) => {
  const keyStatus = getApiKeyStatus("openai");

  try {
    // Check API key before making the request
    if (!keyStatus.valid) {
      return res.status(400).json({
        success: false,
        message: "OpenAI API key issue",
        apiKeyStatus: keyStatus,
        error: "API key validation failed: " + keyStatus.message,
        troubleshooting:
          "Get a valid API key from https://platform.openai.com/api-keys and update your .env file.",
      });
    }

    console.log("Testing OpenAI API...");
    const startTime = Date.now();
    const response = await generateOpenAIResponse(
      "Hello, can you introduce yourself in one sentence?"
    );
    const responseTime = Date.now() - startTime;

    res.json({
      success: true,
      message: "OpenAI API is working",
      apiKeyStatus: keyStatus,
      responseTime: `${responseTime}ms`,
      response,
    });
  } catch (error) {
    console.error("OpenAI API test failed:", error);

    // Determine error type
    let errorType = "unknown";
    let statusCode = 500;
    let troubleshooting =
      "Check your .env file and ensure your OpenAI API key is correctly configured.";

    if (error.message.includes("API key") || error.message.includes("401")) {
      errorType = "api_key_error";
      statusCode = 401;
      troubleshooting =
        "Your API key appears to be invalid. Get a valid API key from https://platform.openai.com/api-keys and update your .env file.";
    } else if (
      error.message.includes("network") ||
      error.message.includes("timeout")
    ) {
      errorType = "network_error";
      statusCode = 503;
      troubleshooting =
        "There seems to be a network issue. Check your internet connection and try again.";
    } else if (
      error.message.includes("429") ||
      error.message.includes("rate limit") ||
      error.message.includes("quota")
    ) {
      errorType = "rate_limit_error";
      statusCode = 429;
      troubleshooting =
        "You've hit a rate limit or quota with OpenAI. Check your usage at https://platform.openai.com/account/usage.";
    }

    res.status(statusCode).json({
      success: false,
      message: "OpenAI API test failed",
      apiKeyStatus: keyStatus,
      errorType,
      error: error.message,
      troubleshooting,
    });
  }
});

// Route to check both API configurations
router.get("/status", (req, res) => {
  const geminiStatus = getApiKeyStatus("gemini");
  const openaiStatus = getApiKeyStatus("openai");

  res.json({
    gemini: {
      configured: geminiStatus.valid,
      message: geminiStatus.message,
      envVar: "GEMINI_API_KEY",
      testEndpoint: "/api/test/test-gemini",
    },
    openai: {
      configured: openaiStatus.valid,
      message: openaiStatus.message,
      envVar: "OPENAI_API_KEY",
      testEndpoint: "/api/test/test-openai",
    },
  });
});

export default router;
