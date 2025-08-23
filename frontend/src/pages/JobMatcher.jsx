import React from "react";
import { motion } from "framer-motion";
import { Briefcase, Settings, BarChart2, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";

const JobMatcher = () => {
  const navigator = useNavigate();
  return (
    <div className="relative w-full h-[calc(93vh-56px)] bg-slate-900 text-white pt-20 px-4 sm:px-6 md:px-16 lg:px-24 overflow-x-hidden">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-10 text-center md:text-left"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold">Job Matcher</h1>
        <p className="text-gray-400 mt-2 text-sm sm:text-base">
          Explore, personalize, and analyze jobs for your career growth.
        </p>
      </motion.div>

      {/* Jobs Available */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="flex flex-col md:flex-row items-center justify-between p-6 bg-slate-800 rounded-xl shadow-md mb-6 w-full"
      >
        <div className="flex items-center gap-4 mb-4 md:mb-0 md:flex-1">
          <div className="p-3 bg-slate-700 rounded-full flex-shrink-0">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold">Jobs Available</h2>
            <p className="text-gray-300 text-sm sm:text-base">
              Browse all currently available job opportunities.
            </p>
          </div>
        </div>
        <motion.button
          onClick={() => navigator("/ai/job-matcher/job-avalable")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 md:mt-0 px-8 py-3 rounded-2xl font-semibold bg-slate-700 hover:bg-slate-600 transition-colors flex-shrink-0"
        >
          View Jobs
        </motion.button>
      </motion.div>

      {/* Job Personalize */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="flex flex-col md:flex-row items-center justify-between p-6 bg-slate-800 rounded-xl shadow-md mb-6 w-full"
      >
        <div className="flex items-center gap-4 mb-4 md:mb-0 md:flex-1">
          <div className="p-3 bg-slate-700 rounded-full flex-shrink-0">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold">Personalize Job</h2>
            <p className="text-gray-300 text-sm sm:text-base">
              Get job recommendations tailored to your profile.
            </p>
          </div>
        </div>
        <motion.button
          onClick={() => navigator("/ai/job-matcher/personalised-job")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 md:mt-0 px-8 py-3 rounded-2xl font-semibold bg-slate-700 hover:bg-slate-600 transition-colors flex-shrink-0"
        >
          Personalize Jobs
        </motion.button>
      </motion.div>

      {/* Salary Trend */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="flex flex-col md:flex-row items-center justify-between p-6 bg-slate-800 rounded-xl shadow-md mb-6 w-full"
      >
        <div className="flex items-center gap-4 mb-4 md:mb-0 md:flex-1">
          <div className="p-3 bg-slate-700 rounded-full flex-shrink-0">
            <BarChart2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold">Salary Trend</h2>
            <p className="text-gray-300 text-sm sm:text-base">
              Analyze salary trends for your role and industry.
            </p>
          </div>
        </div>
        <motion.button
          onClick={() => navigator("/ai/job-matcher/salary")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 md:mt-0 px-8 py-3 rounded-2xl font-semibold bg-slate-700 hover:bg-slate-600 transition-colors flex-shrink-0"
        >
          View Trends
        </motion.button>
      </motion.div>
    </div>
  );
};

export default JobMatcher;
