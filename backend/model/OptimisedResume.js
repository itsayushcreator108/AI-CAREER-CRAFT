import mongoose from "mongoose";

const OptimisedResumeSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Clerk User ID
  fileUrl: { type: String, required: true }, // Cloudinary PDF URL
  isPublic: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("OptimisedResume", OptimisedResumeSchema);