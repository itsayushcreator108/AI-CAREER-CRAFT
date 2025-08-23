import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const AtsChecker = () => {
  const { isSignedIn } = useAuth();
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isSignedIn) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0f172a] text-white">
        <p className="text-lg">Please sign in to use the ATS Checker.</p>
      </div>
    );
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (
      selectedFile &&
      (selectedFile.type === "application/pdf" ||
        selectedFile.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    ) {
      setFile(selectedFile);
    } else {
      toast.error("Please upload PDF or DOCX files only.");
      setFile(null);
    }
  };

  const handleCheckResume = async () => {
    if (!file) {
      toast.error("Please upload a resume first.");
      return;
    }
  
    setLoading(true);
    setResult(null);
  
    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("visibility", isPublic ? "public" : "private");
  
      const response = await axios.post(
        "http://localhost:4000/api/ats/ats-checker",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      setResult(response.data);
      toast.success("Resume analyzed successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="h-screen w-full bg-[#0f172a] text-white flex flex-col items-center justify-center px-4">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-extrabold mb-10 bg-gradient-to-r from-blue-400 to-indigo-500 text-transparent bg-clip-text drop-shadow-lg"
      >
        ATS CHECKER
      </motion.h1>

      {/* Main Section */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10"
      >
        {/* Upload */}
        <div className="bg-[#1f2937] rounded-2xl p-8 shadow-lg flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-6">Upload Resume</h2>

          <div className="border-2 border-dashed border-gray-500 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer">
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              className="hidden"
              id="resumeUpload"
              disabled={loading}
            />
            <label
              htmlFor="resumeUpload"
              className="cursor-pointer flex flex-col items-center space-y-3"
            >
              <FileText className="w-12 h-12 text-blue-400" />
              <span className="text-gray-400 truncate max-w-xs">
                {file ? file.name : "Click to upload PDF or DOCX resume"}
              </span>
            </label>
          </div>

          {/* Publish as public checkbox */}
          <label className="flex items-center space-x-3 mt-6 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={() => setIsPublic(!isPublic)}
              className="w-5 h-5 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              disabled={loading}
            />
            <span className="text-gray-300">Publish as Public</span>
          </label>

          <button
            disabled={loading}
            onClick={handleCheckResume}
            className="mt-6 w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90 px-5 py-3 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Analyzing..." : "Check Resume"}
          </button>
        </div>

        {/* Result */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-[#1f2937] rounded-2xl p-8 shadow-lg flex flex-col overflow-auto max-h-[650px]"
        >
          <h2 className="text-2xl font-bold mb-6 mt-2">ATS Result</h2>

          {result ? (
            <div className="space-y-4">
              <p className="text-lg font-semibold">
                ATS Score:{" "}
                <span className="text-blue-400 text-xl font-bold">{result.score}%</span>
              </p>
              <p className="text-gray-300">{result.feedback}</p>
              <p className="text-sm text-gray-500">
                Visibility:{" "}
                <span className="font-semibold text-blue-400">{result.visibility}</span>
              </p>

              <div className="mt-6 text-sm overflow-auto max-h-96 bg-gray-900 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Resume Preview</h3>
                <pre className="whitespace-pre-wrap break-words text-gray-300 max-h-96 overflow-scroll rounded p-2 bg-gray-800">
                  {result.excerpt}
                </pre>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">
              Upload a resume and click "Check Resume" to see the ATS score.
            </p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AtsChecker;
