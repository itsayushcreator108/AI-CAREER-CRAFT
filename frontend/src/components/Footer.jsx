import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <footer className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#0f172a] to-[#1f2937]" />
        {/* Emerald / Cyan overlays */}
        <div className="absolute inset-0 opacity-20 bg-gradient-to-tr from-emerald-400/15 via-transparent to-cyan-400/15" />
        <div className="absolute inset-0 opacity-20 bg-gradient-to-bl from-cyan-500/15 via-transparent to-emerald-400/15" />
        {/* Mouse-follow glow */}
        <div
          className="absolute inset-0 opacity-30 transition-all duration-500"
          style={{
            background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(16,255,180,0.1), transparent 50%)`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 md:px-16 lg:px-24 xl:px-32 pt-16 pb-8">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between w-full gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:max-w-96">
            <div className="mb-6">
              <img className="h-10 brightness-110" src={assets.logo} alt="QuickAI Logo" />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Experience the power of AI with{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent font-semibold">
                AI CAREER CRAFT
              </span>
              . Transform your Content Creation with our suite of premium AI tools. 
              Write Articles, Generate Images, and Enhance your workflow.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4">
              {[
                { name: 'Twitter', icon: '𝕏' },
                { name: 'LinkedIn', icon: '💼' },
                { name: 'GitHub', icon: '🐱' },
                { name: 'Discord', icon: '💬' }
              ].map((social, index) => (
                <div 
                  key={index}
                  className="w-10 h-10 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 flex items-center justify-center cursor-pointer hover:bg-emerald-500/20 hover:border-emerald-400/50 transition-all duration-300 group"
                >
                  <span className="text-gray-400 group-hover:text-emerald-400 transition-colors">
                    {social.icon}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col md:flex-row items-start md:justify-end gap-12">
            {/* Company Links */}
            <div className="min-w-[160px]">
              <h2 className="font-semibold mb-6 text-white text-lg">
                Company
              </h2>
              <ul className="text-sm space-y-3">
                {['Home', 'About us', 'Contact us', 'Privacy policy'].map((item, index) => (
                  <li key={index}>
                    <a 
                      href="#" 
                      className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 hover:translate-x-1 transform inline-block"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter Section */}
            <div className="min-w-[280px]">
              <h2 className="font-semibold text-white mb-6 text-lg">
                Subscribe to our newsletter
              </h2>
              <div className="text-sm space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Get the latest AI insights, articles, and resources delivered to your inbox weekly.
                </p>
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      className="w-full h-12 px-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl placeholder-gray-500 text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400/50 outline-none transition-all duration-200"
                      type="email"
                      placeholder="Enter your email"
                    />
                  </div>
                  <button className="w-full h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/25 transform hover:-translate-y-0.5">
                    Subscribe Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Border with Glow */}
        <div className="relative mb-8">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
          <div className="absolute inset-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent blur-sm"></div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-gray-400 text-sm">
            Copyright 2024 ©️ 
            <span className="text-emerald-400 font-semibold mx-1">AI CAREER CRAFT</span>
            All Rights Reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Cookies</a>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 right-10 w-2 h-2 bg-emerald-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute bottom-20 left-10 w-1 h-1 bg-cyan-400 rounded-full animate-pulse opacity-40"></div>
      </div>
    </footer>
  );
};

export default Footer;