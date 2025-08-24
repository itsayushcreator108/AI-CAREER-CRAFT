import mongoose from "mongoose";

const roadmapStepSchema = new mongoose.Schema(
  {
    learningPath: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LearningPath", // Each step belongs to a roadmap
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    resources: [
      {
        type: String, // could be a link to blog/video/github repo
      },
    ],
    order: {
      type: Number, // step number (1, 2, 3...)
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    deadline: {
      type: Date, // optional deadline for that step
    },
  },
  { timestamps: true }
);

const RoadmapStep = mongoose.model("RoadmapStep", roadmapStepSchema);

export default RoadmapStep;
