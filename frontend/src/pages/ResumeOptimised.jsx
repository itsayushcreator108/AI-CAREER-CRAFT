import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

const ResumeOptimiser = () => {
  const { isSignedIn, getToken, userId } = useAuth();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(""); // PDF blob URL
  const [isPublic, setIsPublic] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    return () => {
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [downloadUrl]);

  // File upload handler
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
    setShowPreview(false);

    try {
      const token = await getToken();

      // ------------------------
      // Step 1: Call optimise API
      // ------------------------
      const formData = new FormData();
      formData.append("resume", file);

      const optimiseResponse = await axios.post(
        "http://localhost:4000/api/opt/optimise-resume",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob", // get PDF blob
        }
      );

      const blob = new Blob([optimiseResponse.data], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);
      setDownloadUrl(blobUrl);
      setShowPreview(true);
      toast.success("Resume optimised successfully!");

      // ------------------------
      // Step 2: Save to DB
      // ------------------------
      const saveForm = new FormData();
      saveForm.append("resume", blob, "Optimised_Resume.pdf");
      saveForm.append("visibility", isPublic ? "public" : "private");
      saveForm.append("userId", userId);

      await axios.post(
        "http://localhost:4000/api/optdb/optimisedb-resume",
        saveForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Resume saved to DB successfully!");
    } catch (err) {
      toast.error(
        err?.response?.data?.error || err.message || "Failed to process resume."
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
      <Toaster position="top-center" />

      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 drop-shadow-sm mb-12"
      >
        RESUME OPTIMISER
      </motion.h1>

      {/* Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl bg-[#1e293b] rounded-2xl shadow-lg p-8"
      >
        <h2 className="text-xl font-semibold text-gray-200 mb-4">Upload Resume</h2>
        <label
          htmlFor="resumeUpload"
          className="border-2 border-dashed border-gray-600 rounded-xl p-10 flex flex-col items-center justify-center text-gray-400 hover:border-teal-400 hover:bg-[#0f172a] transition cursor-pointer mb-6"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-teal-400 mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
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
            type="checkbox"
            id="publish"
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
          {loading ? "Processing..." : "Optimise & Save Resume"}
        </button>
      </motion.div>

      {/* PDF Preview */}
      {showPreview && downloadUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white w-[85%] h-[85%] rounded-lg shadow-xl relative flex flex-col">
            <button
              className="absolute top-3 right-4 text-gray-700 hover:text-red-500 text-2xl font-bold"
              onClick={() => setShowPreview(false)}
            >
              ✖
            </button>
            <iframe
              src={downloadUrl}
              className="w-full h-full rounded-b-lg"
              title="Optimised Resume Preview"
            />
          </div>
        </div>
      )}

      {/* Download Section */}
      {downloadUrl && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-2xl bg-[#1e293b] rounded-2xl shadow-lg p-8 mt-10"
        >
          <h2 className="text-xl font-semibold text-gray-200 mb-4">
            Download Optimised Resume
          </h2>
          <a
            href={downloadUrl}
            download="Optimised_Resume.pdf"
            className="w-full py-3 block bg-gradient-to-r from-teal-400 to-blue-500 text-white font-semibold rounded-xl shadow-md hover:opacity-90 transition text-center"
          >
            Download Resume
          </a>
        </motion.div>
      )}
    </div>
  );
};

export default ResumeOptimiser;
