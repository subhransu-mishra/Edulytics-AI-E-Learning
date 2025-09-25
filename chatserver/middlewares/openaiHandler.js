import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

/**
 * Generate a response using OpenAI's API
 * @param {string} prompt - The user's question or prompt
 * @param {string} model - The OpenAI model to use (default: gpt-3.5-turbo)
 * @returns {Promise<string>} - The AI-generated response
 */
export const generateOpenAIResponse = async (
  prompt,
  model = "openai/o3" // Standard OpenAI chat model
) => {
  try {
    // Validate API key
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is not set in environment variables");
      throw new Error(
        "API key is not configured. Please add your OpenRouter API key to the .env file."
      );
    }

    // Initialize OpenAI client with OpenRouter configuration
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENAI_API_KEY,
      defaultHeaders: {
        "HTTP-Referer": "http://localhost:5173", // Your frontend URL
        "X-Title": "AI Chat Application", // Your application name
      },
    });

    console.log(
      "Generating OpenRouter response for prompt:",
      prompt.substring(0, 50) + "..."
    );

    try {
      const completion = await openai.chat.completions.create({
        model: model,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt,
              },
            ],
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      if (
        !completion ||
        !completion.choices ||
        !completion.choices[0] ||
        !completion.choices[0].message
      ) {
        console.error(
          "Invalid response structure from API:",
          JSON.stringify(completion)
        );
        throw new Error("Invalid response structure from API");
      }

      return completion.choices[0].message.content;
    } catch (apiError) {
      // Handle specific API errors
      if (apiError.status === 401) {
        console.error("API Authentication Error:", apiError.message);
        throw new Error(
          "API authentication failed. Please check your API key."
        );
      } else if (apiError.status === 429) {
        console.error("API Rate Limit Exceeded:", apiError.message);
        throw new Error("API rate limit exceeded. Please try again later.");
      } else if (apiError.status === 404) {
        console.error("API Model Not Found:", apiError.message);
        throw new Error(
          `The model "${model}" was not found. Please check the model name and try again.`
        );
      } else {
        // Re-throw other errors
        throw apiError;
      }
    }
  } catch (error) {
    console.error("Error with API:", error);
    throw new Error(`Failed to generate response: ${error.message}`);
  }
};
