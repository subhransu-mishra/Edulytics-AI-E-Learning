Here are the suggested changes for the ChatContext.jsx file to support OpenAI integration:

```jsx
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { server } from "../main";
import toast from "react-hot-toast";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [newRequestLoading, setNewRequestLoading] = useState(false);
  // Add new state for AI provider selection
  const [aiProvider, setAiProvider] = useState("gemini");

  async function fetchResponse() {
    if (prompt === "") return alert("Write prompt");
    setNewRequestLoading(true);
    setPrompt("");
    try {
      let aiResponse;

      if (aiProvider === "gemini") {
        // Use Gemini API
        const response = await axios({
          url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=GEMINI_API_KEY_HERE",
          method: "post",
          data: {
            contents: [{ parts: [{ text: prompt }] }],
          },
        });

        aiResponse =
          response["data"]["candidates"][0]["content"]["parts"][0]["text"];
      } else {
        // The backend will handle the OpenAI API call
        // We just need to pass the question to the backend
        aiResponse = ""; // Will be set by the response from the backend
      }

      // Now send to backend which will handle routing to the appropriate AI provider
      const { data } = await axios.post(
        `${server}/api/chat/${selected}`,
        {
          question: prompt,
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      // Update with the response from the backend
      const message = {
        question: prompt,
        answer: data.conversation.answer,
      };

      setMessages((prev) => [...prev, message]);
      setNewRequestLoading(false);
    } catch (error) {
      alert("something went wrong");
      console.log(error);
      setNewRequestLoading(false);
    }
  }

  const [chats, setChats] = useState([]);
  const [selected, setSelected] = useState(null);

  async function fetchChats() {
    try {
      const { data } = await axios.get(`${server}/api/chat/all`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      setChats(data);
      if (data && data.length > 0) {
        setSelected(data[0]._id);
        // Set the AI provider based on the selected chat
        setAiProvider(data[0].aiProvider || "gemini");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const [createLod, setCreateLod] = useState(false);

  async function createChat() {
    setCreateLod(true);
    try {
      const { data } = await axios.post(
        `${server}/api/chat/new`,
        {
          aiProvider: aiProvider,
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      fetchChats();
      setCreateLod(false);
    } catch (error) {
      toast.error("something went wrong");
      setCreateLod(false);
    }
  }

  // Add function to update AI provider for a chat
  async function updateChatAIProvider(chatId, newProvider) {
    try {
      const { data } = await axios.patch(
        `${server}/api/chat/${chatId}/provider`,
        {
          aiProvider: newProvider,
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      setAiProvider(newProvider);
      toast.success(`Switched to ${newProvider} AI`);

      // Update the chat in the chats array
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === chatId ? { ...chat, aiProvider: newProvider } : chat
        )
      );

      return data;
    } catch (error) {
      console.log(error);
      toast.error("Failed to change AI provider");
      return null;
    }
  }

  const [loading, setLoading] = useState(false);

  async function fetchMessages() {
    setLoading(true);
    try {
      const { data } = await axios.get(`${server}/api/chat/${selected}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setMessages(data);

      // Update AI provider based on the selected chat
      const selectedChat = chats.find((chat) => chat._id === selected);
      if (selectedChat) {
        setAiProvider(selectedChat.aiProvider || "gemini");
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  async function deleteChat(id) {
    try {
      const { data } = await axios.delete(`${server}/api/chat/${id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      toast.success(data.message);
      fetchChats();
    } catch (error) {
      console.log(error);
      alert("something went wrong");
    }
  }

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (selected) {
      fetchMessages();
    }
  }, [selected]);

  return (
    <ChatContext.Provider
      value={{
        fetchResponse,
        messages,
        prompt,
        setPrompt,
        newRequestLoading,
        chats,
        createChat,
        createLod,
        selected,
        setSelected,
        loading,
        setLoading,
        deleteChat,
        fetchChats,
        // Add new values to the context
        aiProvider,
        setAiProvider,
        updateChatAIProvider,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatData = () => useContext(ChatContext);
```

You'll also need to create a UI component for selecting between AI providers. Here's a suggestion for a dropdown component to add to your Sidebar.jsx or Home.jsx:

```jsx
// Add this to your Sidebar or Home component
import { ChatData } from "../context/ChatContext";
import { useState } from "react";

function AIProviderSelector() {
  const { aiProvider, updateChatAIProvider, selected } = ChatData();
  const [isChanging, setIsChanging] = useState(false);

  const handleChange = async (e) => {
    const newProvider = e.target.value;
    setIsChanging(true);
    await updateChatAIProvider(selected, newProvider);
    setIsChanging(false);
  };

  return (
    <div className="flex flex-col mb-4">
      <label className="text-sm font-medium mb-1">AI Provider:</label>
      <select
        value={aiProvider}
        onChange={handleChange}
        disabled={isChanging || !selected}
        className="bg-gray-700 text-white rounded p-2"
      >
        <option value="gemini">Gemini</option>
        <option value="openai">OpenAI</option>
      </select>
      {isChanging && <p className="text-xs mt-1">Changing provider...</p>}
    </div>
  );
}

export default AIProviderSelector;
```
