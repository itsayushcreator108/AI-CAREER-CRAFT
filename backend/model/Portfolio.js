import mongoose from "mongoose";

const PortfolioSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    skills: { type: [String], default: [] },
    projects: { type: Array, default: [] }, // [{title, description, link}]
    bio: { type: String },
    socialLinks: { type: Object, default: {} }, // { github, linkedin, twitter, etc. }
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Portfolio", PortfolioSchema);
