import mongoose from "mongoose";

const learningPathSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  steps: [
    {
      name: String,
      description: String,
      status: {
        type: String,
        enum: ["Pending", "In Progress", "Completed"],
        default: "Pending",
      },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("LearningPath", learningPathSchema);
