import { IoIosCloseCircle } from "react-icons/io";
import { ChatData } from "../context/ChatContext";
import { MdDelete } from "react-icons/md";
import { LoadingSpinner } from "./Loading";
import { UserData } from "../context/UserContext";
import { FaRobot } from "react-icons/fa";
import { useState } from "react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const {
    chats,
    createChat,
    createLod,
    setSelected,
    deleteChat,
    aiProvider,
    setAiProvider,
  } = ChatData();
  const [newChatProvider, setNewChatProvider] = useState("gemini");

  const { logoutHandler } = UserData();

  const deleteChatHandler = (id) => {
    if (confirm("are you sure you want to delete this chat")) {
      deleteChat(id);
    }
  };

  const clickEvent = (id) => {
    setSelected(id);
    toggleSidebar();
  };

  const handleCreateChat = () => {
    // Set the provider for the new chat
    setAiProvider(newChatProvider);
    createChat();
  };

  return (
    <div
      className={`fixed top-0 left-0 ${
        isOpen ? "w-screen h-screen" : "w-0 h-0 pointer-events-none"
      } md:static md:w-1/4 md:h-auto p-4 transition-transform duration-500 transform md:translate-x-0 z-50 ${
        isOpen
          ? "translate-x-0 opacity-100 animate-fadein"
          : "-translate-x-full opacity-0"
      } sidebar-theme`}
      style={{
        animationDuration: "0.5s",
        background: "linear-gradient(135deg, #121212 80%, #00BFFF 100%)",
        boxShadow: "0 0 32px 4px #00BFFF, 0 0 16px 2px #DC143C",
        borderRadius: "1.5rem",
        border: "2px solid #23272f",
      }}
    >
      <button
        className="md:hidden p-2 mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg rounded-full text-2xl hover:scale-110 transition-transform duration-200"
        onClick={toggleSidebar}
        style={{ boxShadow: "0 0 12px 2px #00BFFF" }}
      >
        <IoIosCloseCircle />
      </button>

      <div className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 font-mono drop-shadow-lg tracking-wide">
        EDULYTICS
      </div>
      <div className="mb-4">
        <div className="flex flex-col gap-2 mb-2">
          <div className="flex items-center">
            <FaRobot className="text-tech-blue text-xl mr-2" />
            <select
              value={newChatProvider}
              onChange={(e) => setNewChatProvider(e.target.value)}
              className="py-1 px-2 bg-slate-800/80 rounded-lg text-white outline-none border border-tech-blue focus:border-tech-purple transition-all duration-300 appearance-none cursor-pointer text-sm w-full"
            >
              <option value="gemini">Gemini AI</option>
              <option value="openai">OpenAI</option>
            </select>
          </div>
          <button
            onClick={handleCreateChat}
            className="w-full py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold rounded-lg shadow-md hover:scale-105 hover:shadow-xl transition-all duration-200 border-2 border-blue-400"
            style={{ boxShadow: "0 0 12px 2px #00BFFF" }}
          >
            {createLod ? <LoadingSpinner /> : "New Chat +"}
          </button>
        </div>
      </div>
      <div>
        <p className="text-sm text-blue-400 mb-2 font-mono tracking-wide">
          Recent
        </p>
        <div className="max-h-[500px] overflow-y-auto mb-20 md:mb-0 thin-scrollbar">
          {chats && chats.length > 0 ? (
            chats.map((e) => (
              <button
                key={e._id}
                className="w-full text-left py-2 px-2 bg-gradient-to-r from-gray-900 via-blue-900 to-blue-700 hover:from-blue-800 hover:to-purple-700 rounded-lg mt-2 flex justify-between items-center shadow-md hover:scale-102 transition-all duration-200 border border-blue-700"
                onClick={() => clickEvent(e._id)}
              >
                <div className="flex flex-col">
                  <span className="text-white font-mono tracking-tight">
                    {e.latestMessage.slice(0, 30)}...
                  </span>
                  <span className="text-xs text-gray-400">
                    {e.aiProvider ? `${e.aiProvider.toUpperCase()}` : "GEMINI"}
                  </span>
                </div>
                <span
                  className="bg-gradient-to-r from-red-600 to-pink-500 text-white text-xl px-3 py-2 rounded-md hover:scale-110 shadow-lg cursor-pointer border-2 border-red-400"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    deleteChatHandler(e._id);
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <MdDelete />
                </span>
              </button>
            ))
          ) : (
            <p className="text-gray-400 font-mono">No chats yet</p>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 mb-6 w-full">
        <button
          className="bg-gradient-to-r from-red-600 to-pink-500 text-white text-xl px-3 py-2 rounded-lg font-semibold shadow-lg hover:scale-105 transition-transform duration-200 border-2 border-red-400"
          onClick={logoutHandler}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
