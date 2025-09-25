import OpenAI from "openai";

const deepseekHandler = async (req, res, next) => {
  try {
    const { question } = req.body; // Changed from prompt to question to match the API

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.DEEPSEEK_API_KEY,
      defaultHeaders: {
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "ChatBot App",
      },
    });

    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat-v3.1:free",
      messages: [
        {
          role: "user",
          content: question,
        },
      ],
    });

    req.aiResponse = completion.choices[0].message.content;
    next();
  } catch (error) {
    console.error("DeepSeek AI Error:", error);
    res.status(500).json({
      success: false,
      message: "Error in DeepSeek AI response",
      error: error.message,
    });
  }
};

export default deepseekHandler;
