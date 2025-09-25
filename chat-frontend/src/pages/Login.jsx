import React, { useState } from "react";
import { UserData } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../components/Loading";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const { loginUser, btnLoading } = UserData();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    loginUser(email, navigate);
  };

  // Container animation (whole form appears after pieces assemble)
  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.4,
        delayChildren: 0.6,
      },
    },
  };

  // Destroyed → Constructed animation
  const pieceVariants = {
    hidden: {
      opacity: 0,
      x: (Math.random() - 0.5) * 800,
      y: (Math.random() - 0.5) * 600,
      rotate: Math.random() * 720 - 360,
      scale: 0.2,
    },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 overflow-hidden">
      <motion.form
        onSubmit={submitHandler}
        className="p-8 rounded-2xl w-full md:w-[500px] relative overflow-hidden
                   border-2 border-cyan-400 shadow-[0_0_25px_5px_rgba(0,255,255,0.6)]"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Title */}
        <motion.h2
          variants={pieceVariants}
          className="text-3xl font-extrabold text-center mb-6 text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.9)]"
        >
          Login
        </motion.h2>

        {/* Input */}
        <motion.div variants={pieceVariants} className="mb-4">
          <label className="block text-gray-300 mb-2" htmlFor="email">
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-800 text-white border border-gray-600 p-2 w-full rounded outline-none focus:ring-2 focus:ring-cyan-400"
            required
          />
        </motion.div>

        {/* Button with gradient */}
        <motion.button
          variants={pieceVariants}
          className="w-full py-2 px-4 rounded text-white font-semibold
                     bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600
                     hover:from-purple-600 hover:to-cyan-500 transition-all duration-500 shadow-lg"
          disabled={btnLoading}
        >
          {btnLoading ? <LoadingSpinner /> : "Submit"}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default Login;