import React from "react";
import { motion } from "framer-motion";
import { Briefcase, FileText, BarChart2, Image, Bell } from "lucide-react";

const stats = [
  {
    label: "Jobs Matched",
    value: 24,
    icon: <Briefcase className="w-6 h-6 text-white" />,
    gradient: "from-slate-700 via-slate-800 to-slate-900",
  },
  {
    label: "Resumes Analyzed",
    value: 12,
    icon: <FileText className="w-6 h-6 text-white" />,
    gradient: "from-slate-700 via-slate-800 to-slate-900",
  },
  {
    label: "Skill Gaps Found",
    value: 8,
    icon: <BarChart2 className="w-6 h-6 text-white" />,
    gradient: "from-slate-700 via-slate-800 to-slate-900",
  },
  {
    label: "Portfolios Created",
    value: 5,
    icon: <Image className="w-6 h-6 text-white" />,
    gradient: "from-slate-700 via-slate-800 to-slate-900",
  },
];

const Dashboard = () => {
  return (
    <div className="relative w-full h-[calc(93vh-56px)] bg-slate-900 text-white overflow-y-auto pt-[56px] px-6">
      {/* Subtle Floating Shapes */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-slate-700/20 rounded-full blur-3xl animate-float pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-slate-800/20 rounded-full blur-3xl animate-float-delayed pointer-events-none"></div>

      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold drop-shadow-md">
          Welcome Back, <br />
          <span className="text-emerald-400">AI Enthusiast</span>
        </h1>
        <p className="text-gray-300 mt-2 max-w-xl mx-auto">
          Your AI Career OS Dashboard – Manage, Analyze & Supercharge your Career
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 max-w-7xl mx-auto">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ scale: 1.03 }}
            className={`flex items-center justify-between p-5 rounded-xl shadow-md bg-gradient-to-r ${stat.gradient} bg-opacity-80 transition-all`}
          >
            <div>
              <h2 className="text-2xl font-bold">{stat.value}</h2>
              <p className="text-sm mt-1 text-gray-200">{stat.label}</p>
            </div>
            <div className="p-3 bg-slate-700/30 rounded-full">{stat.icon}</div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 mb-10 justify-center max-w-4xl mx-auto">
        {["Analyze Resume", "Find Jobs", "Check Skill Gaps", "Generate Portfolio"].map(
          (action) => (
            <motion.button
              key={action}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-xl font-semibold bg-slate-700 hover:bg-slate-600 transition-colors"
            >
              {action}
            </motion.button>
          )
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-800/40 backdrop-blur-md rounded-xl p-6 shadow-inner max-w-4xl mx-auto">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" /> Recent Activity
        </h3>
        <ul className="space-y-2 text-gray-200">
          <li>✅ Resume analyzed for "John Doe"</li>
          <li>✅ Job matcher suggested 5 new jobs</li>
          <li>⚠️ Skill gap detected in "React & Spring Boot"</li>
          <li>✅ Portfolio created for "Jane Smith"</li>
        </ul>
      </div>

      {/* Animations */}
      <style jsx global>{`
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 8s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
