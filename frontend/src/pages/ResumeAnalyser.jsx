import React from "react";
import { motion } from "framer-motion";
import { FileText, CheckCircle, FileCheck } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const ResumeAnalyser = () => {
  const { user } = useUser();
  const navigator = useNavigate();
  const sections = [
    {
      title: "Resume Upload",
      description: "Upload your latest resume to get started.",
      icon: <FileText className="w-6 h-6 text-white" />,
      action: "Upload Resume",
      to : 'resume-upload'
    },
    {
      title: "ATS Checker",
      description: "Analyze your resume for ATS compatibility.",
      icon: <CheckCircle className="w-6 h-6 text-white" />,
      action: "Check Resume",
      to : 'ats'
    },
    {
      title: "Optimized Resume",
      description: "Generate an optimized resume based on your profile.",
      icon: <FileCheck className="w-6 h-6 text-white" />,
      action: "Generate Resume",
      to : 'optimised'
    },
  ];

  return (
    <div className="relative w-full h-[calc(93vh-56px)] bg-slate-900 text-white pt-20 px-4 sm:px-6 md:px-16 lg:px-24 overflow-x-hidden">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-10 text-center md:text-left"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold">Resume Analyzer</h1>
        <p className="text-gray-400 mt-2 text-sm sm:text-base">
          Upload and optimize your resume to maximize your chances.
        </p>
      </motion.div>

      {/* Sections */}
      <div className="flex flex-col gap-6 w-full">
        {sections.map((section) => (
          <motion.div
            key={section.title}
            whileHover={{ scale: 1.02 }}
            className="flex flex-col md:flex-row items-center justify-between p-6 bg-slate-800 rounded-xl shadow-md w-full"
          >
            <div className="flex items-center gap-4 mb-4 md:mb-0 md:flex-1">
              <div className="p-3 bg-slate-700 rounded-full flex-shrink-0">
                {section.icon}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{section.title}</h2>
                <p className="text-gray-300 text-sm sm:text-base">
                  {section.description}
                </p>
              </div>
            </div>

            <motion.button
            onClick={()=>navigator(`/ai/resume-analyser/${section.to}`)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 md:mt-0 px-8 py-3 rounded-2xl font-semibold bg-slate-700 hover:bg-slate-600 transition-colors flex-shrink-0"
            >
              {section.action}
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ResumeAnalyser;
