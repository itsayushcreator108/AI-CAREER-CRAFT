import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Loader } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";

const SkillGapAnalyser = () => {
  const { getToken } = useAuth();
  const [formData, setFormData] = useState({
    resume: null,
    skills: "",
  });

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
    setError(""); // Clear error when user makes changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.resume || !formData.skills.trim()) {
      setError("Please upload a resume and enter your skills");
      return;
    }

    if (formData.resume.type !== "application/pdf") {
      setError("Please upload a PDF file only");
      return;
    }

    if (formData.resume.size > 10 * 1024 * 1024) {
      // 10MB limit
      setError("File size should be less than 10MB");
      return;
    }

    setLoading(true);
    setError("");
    setAnalysis(null);

    try {
      const token = await getToken();
      const formDataToSend = new FormData();
      formDataToSend.append("resume", formData.resume);
      formDataToSend.append("skills", formData.skills.trim());

      const response = await fetch(
        "http://localhost:4000/api/skill-gap-analysis",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      const result = await response.json();

      if (response.ok) {
        setAnalysis(result.data);
        toast.success("Analysis completed successfully!");
      } else {
        setError(result.message || "Failed to analyze skills");
        toast.error(result.message || "Analysis failed");
      }
    } catch (error) {
      console.error("Error analyzing skills:", error);
      setError("Network error occurred. Please try again.");
      toast.error("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!analysis) return;

    const reportContent = `
SKILL GAP ANALYSIS REPORT
========================

Current Skills: ${formData.skills}
Resume File: ${formData.resume?.name}
Analysis Date: ${new Date().toLocaleDateString()}

${analysis.analysis}

RECOMMENDATIONS:
${analysis.recommendations}

TRENDING SKILLS FOR ${new Date().getFullYear()}:
${analysis.trendingSkills}

LEARNING PATH:
${analysis.learningPath}
    `;

    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `skill-gap-analysis-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col md:flex-row relative w-full h-[calc(93vh-56px)] bg-slate-900 text-white pt-[56px] px-6 pb-10 gap-6">
      {/* Left: Form */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full md:w-1/2 bg-slate-800 p-6 rounded-2xl shadow-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-emerald-400">
          Skill Gap Analyser
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Resume Upload */}
          <div>
            <label className="block text-gray-300 font-medium mb-2">
              Upload Resume (PDF) <span className="text-red-400">*</span>
            </label>
            <label className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 cursor-pointer transition-all w-full">
              <FileText className="w-5 h-5 text-emerald-400" />
              <span className="flex-1 truncate">
                {formData.resume
                  ? formData.resume.name
                  : "Choose PDF file (Max 10MB)"}
              </span>
              <input
                type="file"
                name="resume"
                accept="application/pdf"
                onChange={handleChange}
                className="hidden"
              />
            </label>
            {formData.resume && (
              <p className="text-xs text-gray-400 mt-1">
                File size: {(formData.resume.size / 1024 / 1024).toFixed(2)} MB
              </p>
            )}
          </div>

          {/* Skills Input */}
          <div>
            <label className="block text-gray-300 font-medium mb-2">
              Your Current Skills <span className="text-red-400">*</span>
            </label>
            <textarea
              name="skills"
              placeholder="e.g., React, Node.js, JavaScript, Python, SQL, MongoDB, Git, Docker..."
              value={formData.skills}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition resize-none"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              Separate skills with commas for better analysis
            </p>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <motion.button
              whileHover={{ scale: loading ? 1 : 1.05 }}
              whileTap={{ scale: loading ? 1 : 0.95 }}
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-2xl bg-emerald-400 text-slate-900 font-semibold hover:bg-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Skill Gap"
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Right: Response */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full md:w-1/2 bg-slate-800 p-6 rounded-2xl shadow-md flex flex-col"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-emerald-400">
            Analysis Result
          </h2>
          {analysis && (
            <button
              onClick={downloadReport}
              className="flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              Download Report
            </button>
          )}
        </div>

        <div className="flex-1 bg-slate-900 p-4 rounded-xl overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Loader className="w-8 h-8 animate-spin text-emerald-400 mb-4" />
              <p className="text-gray-400">
                Analyzing your resume and skills...
              </p>
              <p className="text-sm text-gray-500 mt-2">
                This may take a few moments
              </p>
            </div>
          ) : analysis ? (
            <div className="reset-tw">
              <Markdown>
                {`
### 📊 Analysis Overview
${analysis.analysis}

### 💡 Recommendations
${analysis.recommendations}

### 🔥 Trending Skills ${new Date().getFullYear()}
${analysis.trendingSkills}

### 🎯 Suggested Learning Path
${analysis.learningPath}
    `}
              </Markdown>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <FileText className="w-16 h-16 text-gray-600 mb-4" />
              <p className="text-gray-400 mb-2">
                Upload your resume and enter your skills to get started
              </p>
              <p className="text-sm text-gray-500">
                Our AI will analyze your profile and suggest improvement areas
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SkillGapAnalyser;
