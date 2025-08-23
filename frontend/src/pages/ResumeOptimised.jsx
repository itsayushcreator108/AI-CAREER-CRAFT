import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

const ResumeOptimiser = () => {
  const { isSignedIn } = useAuth();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [isPublic, setIsPublic] = useState(false);

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

  const handleOptimise = async () => {
    if (!isSignedIn) {
      toast.error("Please sign in to optimise your resume.");
      return;
    }
    if (!file) {
      toast.error("Please upload your resume first!");
      return;
    }
    setLoading(true);
    setDownloadUrl("");

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("visibility", isPublic ? "public" : "private");

      const response = await axios.post(
        "http://localhost:4000/api/opt/optimise-resume",
        formData,
        { responseType: "blob" }
      );

      setDownloadUrl(URL.createObjectURL(response.data));
      toast.success("Resume optimised successfully!");
    } catch (err) {
      toast.error(
        err?.response?.data?.error ||
          err.message ||
          "Failed to optimise resume."
      );
    }
    setLoading(false);
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0f172a]">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[#1e293b] rounded-2xl shadow-lg p-8"
        >
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 drop-shadow-sm mb-6">
            RESUME OPTIMISER
          </h1>
          <p className="text-gray-300 text-lg mb-4">
            Please sign in to use the Resume Optimiser.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-[#0f172a] py-16 px-4">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 drop-shadow-sm mb-12"
      >
        RESUME OPTIMISER
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl bg-[#1e293b] rounded-2xl shadow-lg p-8"
      >
        <h2 className="text-xl font-semibold text-gray-200 mb-4">
          Upload Resume
        </h2>
        <label
          className="border-2 border-dashed border-gray-600 rounded-xl p-10 flex flex-col items-center justify-center text-gray-400 hover:border-teal-400 hover:bg-[#0f172a] transition cursor-pointer mb-6"
          htmlFor="resumeUpload"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-teal-400 mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <p className="text-gray-300">
            {file ? file.name : "Click to upload PDF/DOCX resume"}
          </p>
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            className="hidden"
            id="resumeUpload"
            disabled={loading}
          />
        </label>
        <div className="flex items-center gap-2 mb-6">
          <input
            id="publish"
            type="checkbox"
            checked={isPublic}
            onChange={() => setIsPublic(!isPublic)}
            className="w-4 h-4 text-teal-400 border-gray-500 rounded focus:ring-teal-400 bg-[#0f172a]"
            disabled={loading}
          />
          <label htmlFor="publish" className="text-gray-300">
            Publish as Public
          </label>
        </div>
        <button
          className="w-full py-3 bg-gradient-to-r from-teal-400 to-blue-500 text-white font-semibold rounded-xl shadow-md hover:opacity-90 transition disabled:opacity-40"
          onClick={handleOptimise}
          disabled={loading}
        >
          {loading ? "Optimising..." : "Optimise Resume"}
        </button>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full max-w-2xl bg-[#1e293b] rounded-2xl shadow-lg p-8 mt-10"
      >
        <h2 className="text-xl font-semibold text-gray-200 mb-4">
          Optimised Resume Preview
        </h2>
        <p className="text-gray-400 mb-6">
          {downloadUrl
            ? "Your optimised resume is ready! Download below."
            : "Upload a resume to see the optimised version here."}
        </p>
        <a
          href={downloadUrl}
          download="Optimised_Resume.pdf"
          className={`w-full py-3 block bg-gradient-to-r from-teal-400 to-blue-500 text-white font-semibold rounded-xl shadow-md transition text-center ${
            downloadUrl
              ? "hover:opacity-90"
              : "bg-gray-700 text-gray-500 cursor-not-allowed"
          }`}
          style={{ pointerEvents: downloadUrl ? "auto" : "none" }}
        >
          Download Resume
        </a>
      </motion.div>
    </div>
  );
};

export default ResumeOptimiser;
