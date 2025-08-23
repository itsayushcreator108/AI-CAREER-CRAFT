import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  FileText,
  Briefcase,
  BarChart2,
  Smartphone,
  Image,
  Users,
  LogOut,
} from "lucide-react"; // Updated icons
import { useUser, useClerk, Protect } from "@clerk/clerk-react";
import { motion } from "framer-motion";

// Meaningful icon mapping for each tool
const navItems = [
  { to: "/ai", label: "Dashboard", Icon: Home },
  { to: "/ai/resume-analyser", label: "Resume Analyzer", Icon: FileText },
  { to: "/ai/job-matcher", label: "Job Matcher", Icon: Briefcase },
  { to: "/ai/skill-gap-analyser", label: "Skill Gap Analyzer", Icon: BarChart2 },
  { to: "/ai/interview-coach", label: "Interview Coach", Icon: Smartphone },
  { to: "/ai/portfolio-generator", label: "Portfolio Generator", Icon: Image },
  { to: "/ai/community", label: "Community", Icon: Users },
];

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  if (!user) return null;

  return (
    <motion.div
      initial={{ x: sidebar ? 0 : -300 }}
      animate={{ x: sidebar ? 0 : -300 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className={`w-64 fixed sm:static top-14 bottom-0 z-40 flex flex-col justify-between backdrop-blur-xl 
        bg-gradient-to-b from-slate-900/80 via-slate-950/70 to-slate-900/80 border-r border-gray-800 
        shadow-lg rounded-r-2xl overflow-hidden`}
      style={{ height: "calc(100vh - 56px)" }}
    >
      {/* Top Section */}
      <div className="flex flex-col items-center px-6 py-6 overflow-hidden">
        {/* Navigation */}
        <nav className="mt-8 flex flex-col gap-3 w-full overflow-y-auto flex-grow pr-2">
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/ai"}
              onClick={() => setSidebar(false)}
            >
              {({ isActive }) => (
                <motion.div
                  whileHover={{ scale: 1.05, translateX: 5 }}
                  whileTap={{ scale: 0.97 }}
                  className={`group relative px-4 py-3 flex items-center gap-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 text-white shadow-lg"
                      : "hover:bg-slate-800 text-gray-300 hover:text-white"
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-700 text-cyan-400 group-hover:bg-slate-600"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium">{label}</span>
                </motion.div>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer Section */}
      <footer className="w-full border-t border-gray-800 px-6 py-5 bg-gradient-to-t from-slate-950/70 to-slate-900/70 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div
            onClick={openUserProfile}
            className="flex gap-3 items-center cursor-pointer group"
          >
            <img
              src={user.imageUrl}
              className="w-12 h-12 rounded-xl border-2 border-cyan-400/50 shadow-sm group-hover:scale-105 transition-transform"
              alt="User"
            />
            <div>
              <h1 className="text-sm font-semibold text-white group-hover:text-emerald-400">
                {user.fullName}
              </h1>
              <p className="text-xs text-cyan-400 font-medium">
                <Protect plan="premium" fallback="Free">
                  Premium Plan
                </Protect>
              </p>
            </div>
          </div>

          <button
            onClick={signOut}
            className="p-2 rounded-xl hover:bg-red-50/20 text-gray-300 hover:text-red-400 transition"
            title="Sign Out"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </footer>
    </motion.div>
  );
};

export default Sidebar;
