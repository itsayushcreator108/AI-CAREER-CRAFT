import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  status: {
    type: String,
    enum: ["Applied", "In Review", "Shortlisted", "Rejected", "Selected"],
    default: "Applied",
  },
  appliedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Application", applicationSchema);
