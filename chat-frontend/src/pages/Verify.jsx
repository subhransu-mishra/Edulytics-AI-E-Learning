import React, { useState } from "react";
import { UserData } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../components/Loading";
import { ChatData } from "../context/ChatContext";

const Verify = () => {
  const [otp, setOtp] = useState("");
  const { verifyUser, btnLoading } = UserData();
  const { fetchChats } = ChatData();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    verifyUser(Number(otp), navigate, fetchChats);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-900 via-tech-blue to-tech-purple text-white animate-fadein">
      <form
        className="w-full md:w-[400px] p-8 rounded-2xl shadow-2xl bg-gradient-to-br from-[#121212] via-[#23272f] to-[#1a1a2e] border-2 border-tech-blue animate-fadein"
        onSubmit={submitHandler}
      >
        <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 font-mono drop-shadow-lg tracking-wide animate-bounce">
          Enter OTP
        </h2>
        <div className="mb-6">
          <label
            className="block text-tech-blue mb-2 font-semibold"
            htmlFor="otp"
          >
            OTP:
          </label>
          <input
            type="number"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-4 rounded-xl bg-slate-800/80 text-white outline-none border-2 border-tech-blue focus:border-tech-purple focus:ring-2 focus:ring-tech-purple transition-all duration-300 text-lg font-mono shadow-md animate-fadein"
            required
            autoFocus
          />
        </div>
        <button
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold text-lg shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 border-2 border-blue-400 animate-bounce flex items-center justify-center gap-2"
          type="submit"
        >
          {btnLoading ? <LoadingSpinner /> : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Verify;
