import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileText, CheckCircle, Upload } from "lucide-react";

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [publish, setPublish] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      alert("Please upload only PDF files.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please upload a PDF resume.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setResult({
        score: 92,
        feedback:
          "Strong resume! Add measurable achievements to further improve ATS ranking.",
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen w-full bg-[#0f172a] text-white flex">
      {/* Left Side - Upload */}
      <motion.div
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="w-2/6 bg-[#111827] p-10 flex flex-col justify-center border-r border-gray-700"
      >
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <Upload className="w-7 h-7 text-blue-400" /> Upload Resume
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Upload Box */}
          <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-blue-500 transition">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
              id="resumeUpload"
            />
            <label
              htmlFor="resumeUpload"
              className="cursor-pointer flex flex-col items-center space-y-2"
            >
              {file ? (
                <span className="text-gray-200 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-400" />
                  {file.name}
                </span>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-blue-400" />
                  <span className="text-gray-400">
                    Click here to upload PDF resume
                  </span>
                </>
              )}
            </label>
          </div>

          {/* Publish Checkbox */}
          <label className="flex items-center gap-2 cursor-pointer text-gray-300">
            <input
              type="checkbox"
              checked={publish}
              onChange={(e) => setPublish(e.target.checked)}
              className="h-4 w-4 text-blue-500 rounded"
            />
            Publish as Public
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-xl py-3 font-medium shadow-md"
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>
        </form>
      </motion.div>

      {/* Right Side - Results */}
      <motion.div
        initial={{ x: 80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="w-4/6 bg-[#111827] p-12 flex flex-col justify-center"
      >
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <CheckCircle className="w-7 h-7 text-green-400" /> Result
        </h2>

        <div className="bg-[#1f2937] rounded-xl shadow-lg p-8 min-h-[350px] flex flex-col justify-center">
          {loading ? (
            <p className="text-gray-400 animate-pulse">
              Processing your resume...
            </p>
          ) : result ? (
            <div className="space-y-4">
              <p className="text-lg font-semibold">
                ATS Score:{" "}
                <span className="text-blue-400">{result.score}%</span>
              </p>
              <p className="text-gray-300">{result.feedback}</p>
            </div>
          ) : (
            <p className="text-gray-500">
              Upload and analyze your resume to see results here.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ResumeUpload;