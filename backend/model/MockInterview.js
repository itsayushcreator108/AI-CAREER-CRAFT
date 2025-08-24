import mongoose from "mongoose";

const mockInterviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, default: Date.now },
    score: Number,
    feedback: String,
    questions: [
      {
        question: String,
        userAnswer: String,
        aiFeedback: String,
      },
    ],
  });
  
  export default mongoose.model("MockInterview", mockInterviewSchema);
  