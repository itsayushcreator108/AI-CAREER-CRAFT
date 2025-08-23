import React from "react";
import { motion } from "framer-motion";
import { Mic, Code, BarChart2, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AIinterviewCoach = () => {
    const navigator = useNavigate();
  return (
    <div className="relative w-full h-[calc(93vh-56px)] bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white pt-[56px] px-6 pb-16 flex flex-col items-center gap-12">
      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.1 }}
        className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-cyan-400 to-blue-500 drop-shadow-lg text-center"
      >
        AI Interview Coach
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-xl text-center text-gray-300 text-lg tracking-wide leading-relaxed"
      >
        Practice mock interviews, solve coding challenges, and track your progress to ace your next opportunity.
      </motion.p>

      {/* Buttons Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl w-full">
        {/* Mock Interview */}
        <motion.button
        onClick={()=>navigator('/ai/interview-coach/mock-interview')}
          whileHover={{ scale: 1.1, boxShadow: "0 8px 20px rgba(72, 187, 120, 0.6)" }}
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center justify-center gap-3 bg-gradient-to-tr from-emerald-400 via-cyan-400 to-blue-500 rounded-3xl py-6 px-8 text-slate-900 font-semibold shadow-lg cursor-pointer hover:brightness-110 transition duration-300"
        >
          <Mic className="text-white drop-shadow-lg w-6 h-6" />
          <span className="text-lg">Mock Interview</span>
        </motion.button>

        {/* CodeQuest */}
        <motion.button
        onClick={()=>navigator('/ai/interview-coach/codequest')}
          whileHover={{ scale: 1.1, boxShadow: "0 8px 20px rgba(72, 187, 120, 0.6)" }}
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center justify-center gap-3 bg-gradient-to-tr from-emerald-400 via-cyan-400 to-blue-500 rounded-3xl py-6 px-8 text-slate-900 font-semibold shadow-lg cursor-pointer hover:brightness-110 transition duration-300"
        >
          <Code className="text-white drop-shadow-lg w-6 h-6" />
          <span className="text-lg">CodeQuest</span>
        </motion.button>

        {/* Progress */}
        <motion.button
        onClick={()=>navigator('/ai/interview-coach/progress')}
          whileHover={{ scale: 1.1, boxShadow: "0 8px 20px rgba(72, 187, 120, 0.6)" }}
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center justify-center gap-3 bg-gradient-to-tr from-emerald-400 via-cyan-400 to-blue-500 rounded-3xl py-6 px-8 text-slate-900 font-semibold shadow-lg cursor-pointer hover:brightness-110 transition duration-300"
        >
          <BarChart2 className="text-white drop-shadow-lg w-6 h-6" />
          <span className="text-lg">CodeQuest Progress</span>
        </motion.button>

        {/* History */}
        <motion.button
        onClick={()=>navigator("/ai/interview-coach/codequest/history")}
          whileHover={{ scale: 1.1, boxShadow: "0 8px 20px rgba(72, 187, 120, 0.6)" }}
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center justify-center gap-3 bg-gradient-to-tr from-emerald-400 via-cyan-400 to-blue-500 rounded-3xl py-6 px-8 text-slate-900 font-semibold shadow-lg cursor-pointer hover:brightness-110 transition duration-300"
        >
          <Clock className="text-white drop-shadow-lg w-6 h-6" />
          <span className="text-lg">CodeQuest History</span>
        </motion.button>
      </div>

      {/* Subtle animated background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 rounded-full opacity-10 blur-3xl animate-[pulse_6s_ease-in-out_infinite]" />
      </div>
    </div>
  );
};

export default AIinterviewCoach;
