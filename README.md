# ChatBot with Multiple AI Providers (Gemini , OpenAI , Deepseek )

This educational platform is designed to break language barriers for students by translating content from English into regional languages using AI-powered chat-based interactions.

## Features

- Support for multiple AI providers (Gemini ,OpenAI and Deepseek)
- Chat history storage per user
- User authentication
- Model selection for each chat session

## Setup Instructions

1. Clone the repository
2. Install dependencies:

   ```
   cd chatserver
   npm install

   cd ../chat-frontend
   npm install
   ```

3. Set up environment variables:

   - Copy `.env.example` to `.env` in the chatserver directory
   - Fill in your MongoDB connection string, JWT secret, and API keys:

     ```
      PORT=5000
      Db_url=your_mongodb_connection_string
      JWT_SECRET=your_jwt_secret
      Password=password_here
      Gmail=gmail_here
      Activation_sec=activation_secret_here
      
      # AI API Keys
      GEMINI_API_KEY=Gemini_api_key_here
      OPENAI_API_KEY=your_openai_api_key
      DEEPSEEK_API_KEY=your_deepseek_api_key
     ```

4. Start the backend server:

   ```
   cd chatserver
   npm start
   ```

5. Start the frontend:
   ```
   cd chat-frontend
   npm run dev
   ```

## API Endpoints

### Chat Endpoints

- `POST /api/chat/new` - Create a new chat (optional body: `{ "aiProvider": "gemini" | "openai" }`)
- `GET /api/chat/all` - Get all chats for the logged-in user
- `POST /api/chat/:id` - Add a conversation to a chat (body: `{ "question": "your question" }`)
- `GET /api/chat/:id` - Get conversations for a specific chat
- `DELETE /api/chat/:id` - Delete a chat
- `PATCH /api/chat/:id/provider` - Update AI provider for a chat (body: `{ "aiProvider": "gemini" | "openai" }`)

### User Endpoints

- Refer to existing documentation for user authentication endpoints

## Testing AI Providers

You can test both AI providers using the included test script:

```
cd chatserver
node test-ai-providers.js
```

## Frontend Integration

The frontend needs to be updated to support model selection with a dropdown menu. Updates should include:

1. Modify the ChatContext to include model selection
2. Add a dropdown in the UI for selecting between Gemini and OpenAI
3. Pass the selected model to the backend when creating a new chat or updating an existing one

## Troubleshooting

- If you encounter issues with API keys, make sure they are correctly set in the `.env` file
- For OpenAI integration issues, ensure you have proper billing set up for your OpenAI account
- For MongoDB connection issues, verify your connection string and network settings
