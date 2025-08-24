import express from "express";
import MockInterviewController from "../controller/mockInterviewController.js";
import { requireAuth } from "@clerk/clerk-sdk-node"; // Assuming you're using Clerk

const MockInterviewControllerrouter = express.Router();

// =======================
// 🔹 DATABASE ROUTES (Protected)
// =======================

// Create a new mock interview (requires auth)
MockInterviewControllerrouter.post(
  "/",
  requireAuth,
  MockInterviewController.createMockInterview
);

// Get all mock interviews (admin only)
MockInterviewControllerrouter.get(
  "/admin/all",
  requireAuth,
  MockInterviewController.getAllMockInterviews
);

// Get logged-in user's mock interviews
MockInterviewControllerrouter.get(
  "/my-interviews",
  requireAuth,
  MockInterviewController.getUserMockInterviews
);

// Get user interview analytics
MockInterviewControllerrouter.get(
  "/analytics",
  requireAuth,
  MockInterviewController.getInterviewAnalytics
);

// Delete a mock interview (requires auth)
MockInterviewControllerrouter.delete(
  "/:id",
  requireAuth,
  MockInterviewController.deleteMockInterview
);

// =======================
// 🔹 ENHANCED GEMINI AI ROUTES (Public for interview functionality)
// =======================

// Enhanced AI response generation (voice/text with conversation history)
MockInterviewControllerrouter.post(
  "/ai/response",
  MockInterviewController.generateResponse
);

// Enhanced interview session starter
MockInterviewControllerrouter.post(
  "/ai/start",
  MockInterviewController.startInterview
);

// Enhanced AI-powered interview tips
MockInterviewControllerrouter.get(
  "/ai/tips",
  MockInterviewController.getInterviewTips
);

// Enhanced API health check
MockInterviewControllerrouter.get(
  "/ai/health",
  MockInterviewController.healthCheck
);

// =======================
// 🔹 VOICE-SPECIFIC ROUTES
// =======================

// Voice conversation endpoint (enhanced for speech-to-text)
MockInterviewControllerrouter.post(
  "/voice/conversation",
  MockInterviewController.generateResponse
);

// Voice interview starter (optimized for speech synthesis)
MockInterviewControllerrouter.post("/voice/start", (req, res) => {
  req.body.type = "voice";
  MockInterviewController.startInterview(req, res);
});

// =======================
// 🔹 UTILITY ROUTES
// =======================

// Get supported voice languages (for speech recognition)
MockInterviewControllerrouter.get("/voice/languages", (req, res) => {
  const supportedLanguages = [
    { code: "en-US", name: "English (US)", flag: "🇺🇸" },
    { code: "en-GB", name: "English (UK)", flag: "🇬🇧" },
    { code: "hi-IN", name: "Hindi (India)", flag: "🇮🇳" },
    { code: "es-ES", name: "Spanish (Spain)", flag: "🇪🇸" },
    { code: "fr-FR", name: "French (France)", flag: "🇫🇷" },
    { code: "de-DE", name: "German (Germany)", flag: "🇩🇪" },
  ];

  res.json({
    success: true,
    languages: supportedLanguages,
    default: "en-US",
  });
});

// Test voice features
MockInterviewControllerrouter.get("/voice/test", (req, res) => {
  res.json({
    success: true,
    message: "Voice features are operational",
    features: {
      speechRecognition: "Supported in Chrome, Edge, Safari",
      speechSynthesis: "Supported in all modern browsers",
      autoReply: "3-second silence detection",
      conversationFlow: "Maintains context across turns",
    },
    timestamp: new Date().toISOString(),
  });
});

// =======================
// 🔹 ERROR HANDLING MIDDLEWARE
// =======================

// Global error handler for this router
MockInterviewControllerrouter.use((error, req, res, next) => {
  console.error("Mock Interview Router Error:", error);

  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
});

export default MockInterviewControllerrouter;
