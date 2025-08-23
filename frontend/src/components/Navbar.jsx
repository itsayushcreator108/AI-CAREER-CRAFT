import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { openSignIn } = useClerk();

  return (
    <nav className="fixed top-0 z-50 w-full bg-gray-900/50 backdrop-blur-xl border-b border-emerald-400/20 transition-all duration-300">
      <div className="flex justify-between items-center py-4 px-6 sm:px-20 xl:px-32 max-w-7xl mx-auto">
        
        {/* Logo Section */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          {/* Logo with Glow */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-500 rounded-xl blur-md opacity-20 group-hover:opacity-40 transition-all duration-500"></div>
            
            <div className="relative bg-gray-800/60 backdrop-blur-lg rounded-xl p-2 shadow-md group-hover:shadow-xl transition-all duration-300 border border-emerald-400/30">
              <img
                src={assets.logo}
                alt="AI Career OS Logo"
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain filter drop-shadow-sm"
              />
            </div>

            <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <Sparkles className="w-4 h-4 text-emerald-300 animate-pulse" />
            </div>
          </div>

          {/* Brand Text */}
          <div className="flex flex-col">
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-500 bg-clip-text text-transparent group-hover:from-emerald-300 group-hover:via-cyan-300 group-hover:to-emerald-400 transition-all duration-500">
              AI Career OS
            </h1>
            <p className="text-xs text-gray-400 font-medium opacity-0 group-hover:opacity-100 transform -translate-y-1 group-hover:translate-y-0 transition-all duration-300">
              Shape Your Future
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              {/* User welcome text */}
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-medium text-gray-200">
                  Welcome back
                </span>
                <span className="text-xs text-gray-400">
                  {user.firstName || user.emailAddresses[0]?.emailAddress.split("@")[0]}
                </span>
              </div>
              
              {/* UserButton */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full blur-lg opacity-20"></div>
                <div className="relative bg-gray-800/60 backdrop-blur-md rounded-full p-1 shadow-md border border-emerald-400/30">
                  <UserButton 
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "w-9 h-9 sm:w-10 sm:h-10",
                        userButtonPopoverCard: "backdrop-blur-xl bg-gray-900/90 border border-emerald-400/20"
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Get Started Button */
            <button
              onClick={openSignIn}
              className="group relative flex items-center gap-2 px-6 sm:px-8 py-3 text-sm font-semibold text-white rounded-full overflow-hidden transition-all duration-300 hover:scale-105"
            >
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-cyan-500 to-emerald-400 opacity-90"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-emerald-400 to-cyan-500 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              {/* Button Text */}
              <div className="relative flex items-center gap-2">
                <span className="group-hover:scale-105 transition-transform duration-200">
                  Get Started
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </div>

              {/* Shine Effect */}
              <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
