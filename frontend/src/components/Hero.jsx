import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative flex flex-col justify-center items-center w-full min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-[url('/gradientBackground.png')] bg-cover bg-no-repeat opacity-30 animate-pulse"></div>

      {/* Floating Shapes for Depth */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-cyan-400/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-float-delayed"></div>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center px-6 z-10"
      >
        <h1 className="text-4xl sm:text-6xl md:text-7xl 2xl:text-8xl font-extrabold leading-tight text-center drop-shadow-xl relative z-10">
          Welcome To India's First <br />
          <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent animate-gradient-text">
            Career OS
          </span>{" "}
          <br />
          with AI-Powered Tools
        </h1>

        {/* CSS for smooth gradient animation and glow */}
        <style jsx global>{`
          @keyframes gradientShift {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }

          .animate-gradient-text {
            background-size: 200% 200%;
            animation: gradientShift 6s ease infinite;
            text-shadow: 0 0 8px rgba(16, 255, 180, 0.6),
              0 0 12px rgba(56, 189, 248, 0.3);
          }
        `}</style>

        <p className="mt-6 max-w-xl sm:max-w-2xl mx-auto text-gray-300 text-sm sm:text-lg leading-relaxed">
          Supercharge your workflow with AI. Write stunning articles, generate
          breathtaking images, and enhance your productivity like never before.
        </p>
      </motion.div>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="flex flex-wrap justify-center gap-6 mt-10 z-10"
      >
        {/* Start Creating Now */}
        <motion.button
          onClick={() => navigate("/ai")}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.96 }}
          className="relative px-10 py-4 rounded-2xl font-bold text-lg text-white bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 shadow-[0_0_25px_rgba(34,211,238,0.6)] transition-all duration-500 overflow-hidden group"
        >
          <span className="relative z-10">Start Creating Now</span>
          <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-all duration-300 rounded-2xl"></span>
        </motion.button>

        {/* Watch Demo */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.96 }}
          className="relative px-10 py-4 rounded-2xl font-bold text-lg text-white backdrop-blur-lg bg-white/10 border border-white/20 hover:border-emerald-400 hover:bg-white/20 transition-all duration-500 shadow-lg overflow-hidden group"
        >
          <span className="relative z-10">Watch Demo</span>
          <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-emerald-400 to-cyan-400 opacity-0 group-hover:opacity-25 transition-all duration-300 rounded-2xl"></span>
        </motion.button>
      </motion.div>

      {/* Trusted Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="flex items-center gap-4 mt-10 mx-auto text-gray-400 z-10 text-sm sm:text-base"
      >
        <img src={assets.user_group} alt="Trusted" className="h-8 opacity-80" />
        <span>
          Trusted by <strong className="text-white">10k+</strong> creators
          worldwide
        </span>
      </motion.div>
    </section>
  );
};

export default Hero;
