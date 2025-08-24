import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";

const Layout = () => {
  const [sidebar, setSidebar] = useState(false);
  const { user } = useUser();
  const navigator = useNavigate();

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white">
      {/* Navbar */}
      <header className="h-16 bg-gradient-to-r from-slate-900/80 via-gray-900/70 to-black/80 backdrop-blur-xl border-b border-gray-700 shadow-xl flex items-center justify-between px-6 sticky top-0 z-50 transition-all duration-300">
        {/* Left Section: Logo & Sidebar Toggle */}
        <div className="flex items-center gap-4">
          {/* Sidebar Toggle Button */}
          <button
            onClick={() => setSidebar(!sidebar)}
            className="sm:hidden p-2 rounded-lg hover:bg-white/20 transition-colors duration-200 shadow-md"
            aria-label="Toggle Sidebar"
          >
            {sidebar ? (
              <X className="w-6 h-6 text-emerald-400" />
            ) : (
              <Menu className="w-6 h-6 text-emerald-400" />
            )}
          </button>

          {/* Logo / Title */}
          <h1
            onClick={() => navigator("/")}
            className="cursor-pointer text-xl sm:text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-cyan-400 to-blue-500 drop-shadow-lg hover:brightness-110 transition-all duration-200"
          >
            AI Career Tools
          </h1>
        </div>

        {/* Right Section: User Avatar */}
        {user && (
          <div className="flex items-center gap-4">
            <div className="relative flex items-center gap-3 group cursor-pointer">
              {/* Left: User name and subtitle */}
              <div className="flex flex-col items-end mr-2">
                <span className="text-sm font-bold text-emerald-400 leading-tight">
                  {user.fullName}
                </span>
                <span className="text-xs text-cyan-400 opacity-80">
                  AI Enthusiast
                </span>
              </div>
              {/* Avatar */}
              <img
                onClick={() => navigator("/ai/my-profile")}
                src={user.imageUrl}
                alt="User"
                className="w-10 h-10 rounded-full border-2 border-emerald-400/70 shadow-lg transition-transform duration-300 group-hover:scale-110 group-active:scale-95 ring-2 ring-cyan-400/20 hover:ring-emerald-400/70"
                style={{ objectFit: "cover" }}
              />
              {/* Animated ring blink/pulse */}
              <span className="absolute -top-1 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white shadow animate-pulse" />
              {/* Tooltip */}
              <span
                className="absolute left-1/2 bottom-[-42px] -translate-x-1/2 px-3 py-1 text-xs
          font-semibold bg-slate-900/95 text-slate-100 rounded-[10px] opacity-0 pointer-events-none
          group-hover:opacity-100 group-hover:pointer-events-auto 
          group-focus:opacity-100 group-focus:pointer-events-auto shadow-xl border border-emerald-400/20 
          transition-all duration-200
          whitespace-nowrap z-30"
              >
                 Go to My Profile
              </span>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="flex flex-1 relative">
        {/* Desktop Sidebar */}
        <aside className="hidden sm:block">
          <Sidebar sidebar={true} setSidebar={setSidebar} />
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="sm:hidden fixed inset-0 z-40 flex"
          >
            {/* Dim Background */}
            <div
              className="flex-1 bg-black/50 backdrop-blur-sm"
              onClick={() => setSidebar(false)}
            />

            {/* Sidebar */}
            <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
          </motion.div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto backdrop-blur-sm bg-white/5 rounded-2xl m-2 shadow-inner">
          <Outlet />
        </main>
      </div>

      {/* Optional Floating Background Shapes */}
      <div className="pointer-events-none absolute top-20 left-10 w-40 h-40 bg-cyan-400/20 rounded-full blur-3xl animate-float"></div>
      <div className="pointer-events-none absolute bottom-20 right-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-float-delayed"></div>
    </div>
  );
};

export default Layout;
