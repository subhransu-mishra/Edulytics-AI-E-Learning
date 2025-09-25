import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const router = express.Router();

// Text formatting utilities
const formatText = (text) => {
  if (!text) return "";

  try {
    // Clean up text
    let formatted = text
      // Remove control characters
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
      // Fix spacing issues
      .replace(/\s{2,}/g, " ")
      // Ensure proper paragraph breaks
      .replace(/\n{3,}/g, "\n\n");

    // Make sure markdown formatting is proper
    formatted = formatted
      // Fix broken headings
      .replace(/(?:\n|^)([A-Z][A-Za-z0-9 ]{2,40}):\s*/g, "\n\n**$1**: ")
      // Fix bullet points
      .replace(/(?:\n|^)\s*[-•*]\s*/g, "\n\n• ")
      // Fix numbered lists
      .replace(/(?:\n|^)\s*(\d+)[.)]\s*/g, "\n\n$1. ");

    return formatted;
  } catch (error) {
    console.error("Error formatting text:", error);
    return text;
  }
};

// Route for text formatting
router.post("/format-text", (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        error: "No text provided",
      });
    }

    const formattedText = formatText(text);

    return res.json({
      success: true,
      originalLength: text.length,
      formattedLength: formattedText.length,
      formattedText,
    });
  } catch (error) {
    console.error("Error in format-text endpoint:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Route for text diagnostics
router.post("/diagnose-text", (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        error: "No text provided",
      });
    }

    // Analyze the text
    const analysis = {
      length: text.length,
      paragraphs: text.split("\n\n").length,
      lines: text.split("\n").length,
      words: text.split(/\s+/).length,
      specialChars: (text.match(/[^\w\s]/g) || []).length,
      controlChars: (text.match(/[\u0000-\u001F\u007F-\u009F]/g) || []).length,
      sample: text.substring(0, 100) + (text.length > 100 ? "..." : ""),
    };

    return res.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("Error in diagnose-text endpoint:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
