import React, { useState } from "react";
import { ChatData } from "../context/ChatContext";
import { IoLanguageOutline } from "react-icons/io5";
import { FaRobot } from "react-icons/fa6";
import toast from "react-hot-toast";

const ModelSelector = () => {
  const { aiProvider, updateChatAIProvider, selected } = ChatData();
  const [isChanging, setIsChanging] = useState(false);

  const handleChange = async (e) => {
    const newProvider = e.target.value;
    if (newProvider === aiProvider) return;

    setIsChanging(true);
    await updateChatAIProvider(newProvider);
    setIsChanging(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center">
        <FaRobot className="absolute left-3 text-tech-blue text-xl" />
        <select
          value={aiProvider}
          onChange={handleChange}
          disabled={isChanging || !selected}
          className="pl-10 py-2 pr-10 bg-slate-800/80 rounded-xl text-white outline-none border border-tech-blue focus:border-tech-purple transition-all duration-300 appearance-none cursor-pointer"
        >
          <option value="gemini">Gemini AI</option>
          <option value="openai">OpenAI</option>
          <option value="deepseek">DeepSeek AI</option>
        </select>
        {isChanging && (
          <div className="ml-2 animate-spin h-4 w-4 border-2 border-tech-blue border-t-transparent rounded-full"></div>
        )}
      </div>
    </div>
  );
};

export default ModelSelector;
