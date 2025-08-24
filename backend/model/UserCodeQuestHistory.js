import mongoose from "mongoose";

// Single submission schema
const SubmissionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  report: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
    enum: [
      "C++", "Java", "Python", "JavaScript", "Python3",
      "C", "C#", "Ruby", "Swift", "Go",
      "Scala", "Kotlin", "Rust", "PHP",
    ],
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

// User-specific CodeQuest history schema
const UserCodeQuestHistorySchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: "User", // assuming you have a User model
    required: true,
  },
  submissions: [SubmissionSchema], // Array of all submissions
});

// Create model
const UserCodeQuestHistory = mongoose.model(
  "UserCodeQuestHistory",
  UserCodeQuestHistorySchema
);

export default UserCodeQuestHistory;