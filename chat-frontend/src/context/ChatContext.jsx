import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { server } from "../main";
import toast from "react-hot-toast";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [newRequestLoading, setNewRequestLoading] = useState(false);
  const [aiProvider, setAiProvider] = useState("gemini"); // Default to Gemini

  async function fetchResponse() {
    if (prompt === "") return toast.error("Please enter a prompt");
    if (!selected) return toast.error("No chat selected");

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to continue");
      return;
    }

    const currentPrompt = prompt;
    setNewRequestLoading(true);
    setPrompt("");

    try {
      console.log("Sending request to:", `${server}/api/chat/${selected}`);
      console.log("Request data:", { question: currentPrompt });

      const { data } = await axios.post(
        `${server}/api/chat/${selected}`,
        {
          question: currentPrompt,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            token: token,
          },
        }
      );

      console.log("Response received:", data);

      if (!data || !data.conversation) {
        throw new Error("Invalid response format from server");
      }

      // Add message to state with data returned from backend
      const message = {
        question: currentPrompt,
        answer: data.conversation.answer,
        modelUsed: data.conversation.modelUsed,
      };

      // Try to clean up any potential garbled text through our text processing service
      try {
        const { data: processedData } = await axios.post(
          `${server}/api/text/format-text`,
          { text: message.answer },
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          }
        );

        if (processedData.success && processedData.formattedText) {
          message.answer = processedData.formattedText;
          console.log("Text formatting applied successfully");
        }
      } catch (processingError) {
        console.warn("Failed to process text:", processingError);
        // Continue with original text if processing fails
      }

      setMessages((prev) => [...prev, message]);

      // If the server used a fallback model, update the UI and notify the user
      if (data.fallbackUsed) {
        toast(data.fallbackMessage || "Fallback to Gemini AI was used", {
          icon: "⚠️",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        // Update the aiProvider state to match what's now set on the server
        setAiProvider(data.updatedChat.aiProvider);
      }

      setNewRequestLoading(false);
    } catch (error) {
      console.error("Error in fetchResponse:", error);

      if (error.response) {
        // The request was made and the server responded with a status code
        console.error("Response error data:", error.response.data);
        toast.error(`Error: ${error.response.data.message || "Server error"}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
        toast.error("Server not responding. Please try again later.");
      } else {
        // Something happened in setting up the request
        toast.error(`Error: ${error.message}`);
      }

      // Add the failed message to the state so the user knows it was attempted
      const failedMessage = {
        question: currentPrompt,
        answer: "Sorry, I couldn't process your request. Please try again.",
        failed: true,
      };

      setMessages((prev) => [...prev, failedMessage]);
      setNewRequestLoading(false);
    }
  }

  const [chats, setChats] = useState([]);

  const [selected, setSelected] = useState(null);

  async function fetchChats() {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found");
      return;
    }

    try {
      const { data } = await axios.get(`${server}/api/chat/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
          token: token, // keeping for backwards compatibility
        },
      });

      setChats(data);
      if (data && data.length > 0) {
        setSelected(data[0]._id);
        setAiProvider(data[0].aiProvider || "gemini");
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        // Redirect to login or handle expired session
        window.location.href = "/login";
      } else {
        toast.error("Failed to fetch chats");
      }
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
      toast.error("Something went wrong");
      console.log(error);
      setCreateLod(false);
    }
  }

  const [loading, setLoading] = useState(false);

  async function fetchMessages() {
    if (!selected) return;

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
      toast.error("Failed to fetch messages");
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
      window.location.reload();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  }

  // Function to update AI provider for the current chat
  async function updateChatAIProvider(newProvider) {
    if (!selected) return;

    try {
      await axios.patch(
        `${server}/api/chat/${selected}/provider`,
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
      toast.success(`Switched to ${newProvider.toUpperCase()} AI`);

      // Update the chat in the chats array
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === selected ? { ...chat, aiProvider: newProvider } : chat
        )
      );
    } catch (error) {
      console.log(error);
      toast.error("Failed to change AI provider");
    }
  }

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    fetchMessages();
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
