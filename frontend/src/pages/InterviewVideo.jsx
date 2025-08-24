import React from "react";

const InterviewVideo = () => {
  useEffect(() => {
    toast.info(
      <div className="text-left">
        <p className="font-semibold text-white">🚧 Feature Unavailable</p>
        <p className="text-gray-300 text-sm">
          Video Interviews need a{" "}
          <span className="font-medium text-cyan-400">paid AI API</span>. We’ll
          integrate this in future updates. Stay tuned! 🎯
        </p>
      </div>,
      {
        duration: 5000,
        icon: "⚡",
        style: {
          background: "linear-gradient(135deg, #1f2937, #111827)", // gradient dark
          border: "1px solid #374151", // subtle border
          borderRadius: "12px",
          padding: "16px",
          color: "#fff",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        },
      }
    );
  }, []);

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white flex flex-col">
      {" "}
      <div className="bg-gray-800 shadow-xl border-b border-gray-700 p-4">
        {" "}
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          {" "}
          <div className="flex items-center">
            {" "}
            <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center mr-3">
              {" "}
              <span className="text-xl">🎥</span>{" "}
            </div>{" "}
            <div>
              {" "}
              <h2 className="text-xl font-bold">Video Interview</h2>{" "}
              <p className="text-gray-400 text-sm">
                Professional Assessment Mode
              </p>{" "}
            </div>{" "}
          </div>{" "}
          <button
            onClick={resetInterview}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            {" "}
            ← Back{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
      <div className="flex-1 p-4 grid grid-cols-2 gap-4 max-w-6xl mx-auto w-full">
        {" "}
        <div className="bg-gray-800 rounded-xl shadow-xl flex items-center justify-center relative overflow-hidden border border-gray-700">
          {" "}
          <div className="text-center">
            {" "}
            <div className="w-20 h-20 bg-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              {" "}
              <span className="text-3xl">🎯</span>{" "}
            </div>{" "}
            <h3 className="text-2xl font-bold text-white mb-2">
              AI Career Coach
            </h3>{" "}
            <p className="text-gray-400">
              Professional • Experienced • Insightful
            </p>{" "}
            <div className="flex items-center justify-center gap-2 mt-4 bg-cyan-600/20 px-3 py-1 rounded-full">
              {" "}
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>{" "}
              <span className="text-cyan-300 text-sm">Ready to Interview</span>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        <div className="bg-gray-800 rounded-xl shadow-xl relative overflow-hidden border border-gray-700">
          {" "}
          <div className="absolute top-4 left-4 z-10">
            {" "}
            <h3 className="text-lg font-bold text-white">Your Camera</h3>{" "}
            <p className="text-sm text-gray-300">Click to toggle</p>{" "}
          </div>{" "}
          <div className="absolute top-4 right-4 z-10">
            {" "}
            <div className="flex items-center gap-2 bg-gray-800/80 px-2 py-1 rounded-full">
              {" "}
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>{" "}
              <span className="text-blue-300 text-xs">Ready</span>{" "}
            </div>{" "}
          </div>{" "}
          <div className="absolute inset-0">
            {" "}
            <SimpleWebcamToggle width="100%" height="100%" />{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      <div className="bg-gray-800 border-t border-gray-700 p-4">
        {" "}
        <div className="max-w-6xl mx-auto">
          {" "}
          <div className="flex justify-center">
            {" "}
            <button
              onClick={resetInterview}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2"
            >
              {" "}
              <span className="text-xl">⏹</span> End Interview Session{" "}
            </button>{" "}
          </div>{" "}
          <p className="text-center text-gray-400 text-sm mt-3">
            {" "}
            Professional Video Interview • AI Career Assessment{" "}
          </p>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};

export default InterviewVideo;
