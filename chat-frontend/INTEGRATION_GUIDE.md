# Frontend Integration Guide for AI Model Switching

This guide describes the integration of multiple AI models (Gemini and OpenAI) in the educational platform frontend.

## Changes Made

### 1. ChatContext Updates

The `ChatContext.jsx` has been updated with:

- Added state for tracking the selected AI provider (`aiProvider`)
- Updated `fetchResponse` to delegate AI model selection to the backend
- Added `updateChatAIProvider` function to switch between AI models
- Modified `createChat` to include the selected AI provider
- Updated `fetchChats` and `fetchMessages` to track the AI provider for each chat

### 2. New Components

- Added `ModelSelector.jsx` for selecting between AI models
- Integrated the selector in both the Home page (for existing chats) and Sidebar (for new chats)

### 3. UI Enhancements

- Added AI model indicators in chat messages and the sidebar
- Updated the UI to show which AI model was used for each response

## How to Use

### Creating a New Chat

1. Select the desired AI model (Gemini or OpenAI) from the dropdown in the sidebar
2. Click "New Chat +" to create a chat with the selected model

### Changing Models for Existing Chats

1. Select a chat from the sidebar
2. Use the model selector dropdown near the input field to switch between Gemini and OpenAI
3. The change will apply to all future messages in that chat

### Viewing Model Information

- Each chat in the sidebar displays which model it's using
- Each message shows which model was used to generate the response

## Backend Requirements

For this frontend integration to work correctly, ensure the backend is properly configured:

1. The backend should have both Gemini and OpenAI handlers set up
2. The Chat model should include an `aiProvider` field
3. The Conversation model should include a `modelUsed` field
4. The `/api/chat/:id/provider` endpoint should be implemented to change the AI provider
5. The OpenAI API key should be set in the server's `.env` file

## Testing

To verify the integration is working:

1. Create a new chat with Gemini
2. Send a test message
3. Switch to OpenAI and send another message
4. Verify that both the UI and the actual responses are using the correct models
5. Check that the model information is properly displayed in the chat messages and sidebar
