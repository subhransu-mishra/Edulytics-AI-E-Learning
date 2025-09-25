import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import { GiHamburgerMenu } from "react-icons/gi";
import Header from "../components/Header";
import { ChatData } from "../context/ChatContext";
import { CgProfile } from "react-icons/cg";
import { FaRobot } from "react-icons/fa";
import { LoadingBig, LoadingSmall } from "../components/Loading";
import { IoMdSend } from "react-icons/io";
import studentImage from "../assets/studentpic.png";
import "../APP.css";
import ModelSelector from "../components/ModelSelector";
import TypewriterText from "../components/TypewriterText";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const {
    fetchResponse,
    messages,
    prompt,
    setPrompt,
    newRequestLoading,
    loading,
    chats,
  } = ChatData();

  const submitHandler = (e) => {
    e.preventDefault();
    fetchResponse();
  };

  const messagecontainerRef = useRef();

  useEffect(() => {
    if (messagecontainerRef.current) {
      messagecontainerRef.current.scrollTo({
        top: messagecontainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gradient-to-br from-slate-900 via-tech-blue to-tech-purple text-white">
      {/* Sidebar left */}
      <Sidebar
        isOpen={isOpen || window.innerWidth >= 768}
        toggleSidebar={toggleSidebar}
        className="z-30 md:w-1/4"
      />

      {/* Chat container center */}
      <div
        className="flex-1 flex flex-col backdrop-blur-lg bg-slate-900/80 rounded-2xl m-2 md:m-6 shadow-glass min-h-0 relative animate-fadein border-4 border-transparent glow-pulse-border z-20"
        style={{
          boxShadow: "0 0 32px 4px #00BFFF44, 0 0 16px 2px #DC143C44",
          transition: "box-shadow 0.5s cubic-bezier(.4,0,.2,1)",
        }}
      >
        <button
          onClick={toggleSidebar}
          className="md:hidden p-4 bg-gray-800 text-2xl"
        >
          <GiHamburgerMenu />
        </button>

        <div className="flex flex-1 flex-col min-h-0">
          <Header />
          {/* Expanded chat box for better visibility */}
          <div className="flex-1 min-h-0 p-2 md:p-6 relative">
            <div
              className="w-full h-full max-h-[calc(100vh-180px)] mx-auto overflow-y-auto thin-scrollbar rounded-2xl bg-gradient-to-br from-slate-900 via-tech-blue to-tech-purple shadow-glass"
              style={{
                paddingBottom: "80px",
              }}
              ref={messagecontainerRef}
            >
              {loading ? (
                <LoadingBig />
              ) : messages && messages.length > 0 ? (
                messages.map((e, i) => (
                  <div key={i} className="mb-4">
                    {/* User chat bubble */}
                    <div className="mb-2 flex gap-2 items-center">
                      <CgProfile className="text-tech-blue text-2xl" />
                      <div className="rounded-xl px-4 py-2 bg-gradient-to-r from-slate-900 via-tech-blue to-tech-purple text-white shadow-lg border border-tech-blue animate-fadein">
                        {e.question}
                      </div>
                    </div>
                    {/* Bot chat bubble */}
                    <div className="flex gap-2 items-center">
                      <FaRobot className="text-tech-purple text-2xl" />
                      <div className="rounded-xl px-4 py-2 bg-gradient-to-r from-tech-purple via-tech-blue to-slate-900 text-white shadow-lg border border-tech-purple animate-fadein">
                        {/* Model indicator */}
                        <div className="text-xs text-gray-400 mb-1 italic">
                          {e.modelUsed
                            ? `Model: ${e.modelUsed.toUpperCase()}`
                            : ""}
                        </div>
                        <TypewriterText text={e.answer} speed={15} />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-lg text-tech-blue animate-fadein">
                  No chat yet
                </p>
              )}
              {newRequestLoading && <LoadingSmall />}
            </div>
          </div>
        </div>
        {/* Only one input bar fixed at bottom, inside chat area */}
        {chats && chats.length === 0 ? (
          ""
        ) : (
          <div
            className="absolute bottom-0 left-0 right-0 z-10 p-2 md:p-4 bg-gradient-to-r from-slate-900 via-tech-blue to-tech-purple w-full shadow-lg animate-fadein border-t border-tech-blue flex justify-center items-center"
            style={{ height: "80px" }}
          >
            <form
              onSubmit={submitHandler}
              className="flex flex-col sm:flex-row justify-center items-center w-full gap-2"
            >
              <ModelSelector />
              <div className="relative w-full sm:flex-grow">
                <input
                  className="w-full p-2 md:p-4 bg-slate-800/80 rounded-xl text-white outline-none border border-tech-blue focus:border-tech-purple transition-all duration-300 pr-10"
                  type="text"
                  placeholder="Enter a prompt here"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-tech-blue hover:text-tech-purple transition-all duration-300 text-xl md:text-2xl"
                >
                  <IoMdSend />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Student image right side, only desktop */}
      <div className="hidden md:flex flex-col items-center justify-center md:w-1/4 h-full py-8">
        <img
          src={studentImage}
          alt="Student Reading"
          className="side-image drop-shadow-[0_0_20px_rgba(0,255,255,0.6)] w-64 h-auto object-contain animate-fadein"
          style={{
            opacity: 1,
            transform: "scale(1)",
            transition: "opacity 1.2s ease-out, transform 1.2s ease-out",
          }}
        />
      </div>
    </div>
  );
};

export default Home;
