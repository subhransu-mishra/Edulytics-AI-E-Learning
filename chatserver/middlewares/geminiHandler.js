import dotenv from "dotenv";

dotenv.config();

/**
 * Generate a response using Gemini API
 * @param {string} prompt - The user's question or prompt
 * @returns {Promise<string>} - The AI-generated response
 */
export const generateGeminiResponse = async (prompt) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set in environment variables");
      throw new Error("API key for Gemini is not configured");
    }

    console.log(
      "Generating Gemini response for prompt:",
      prompt.substring(0, 50) + "..."
    );
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    console.log("Making request to Gemini API...");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API Error (${response.status}):`, errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    console.log("Parsing Gemini API response...");
    const data = await response.json();

    if (
      !data ||
      !data.candidates ||
      !data.candidates[0] ||
      !data.candidates[0].content ||
      !data.candidates[0].content.parts ||
      !data.candidates[0].content.parts[0]
    ) {
      console.error(
        "Invalid response structure from Gemini API:",
        JSON.stringify(data)
      );
      throw new Error("Invalid response structure from Gemini API");
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error with Gemini API:", error);
    throw new Error(
      `Failed to generate response from Gemini: ${error.message}`
    );
  }
};
