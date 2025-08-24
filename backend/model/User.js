// models/User.js
import mongoose from "mongoose";

// 🎓 Education Schema
const educationSchema = new mongoose.Schema(
  {
    institution: { type: String, required: true, trim: true },
    degree: { type: String, required: true, trim: true },
    fieldOfStudy: { type: String, trim: true },
    startYear: { type: String, trim: true },
    endYear: { type: String, trim: true },
    grade: { type: String, trim: true },
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

// 💼 Experience Schema
const experienceSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    startDate: { type: String, trim: true },
    endDate: { type: String, trim: true },
    location: { type: String, trim: true },
    isCurrentJob: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// 🚀 Project Schema
const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    link: { type: String, trim: true },
    githubLink: { type: String, trim: true },
    techStack: [{ type: String, trim: true }],
    startDate: { type: String, trim: true },
    endDate: { type: String, trim: true },
    status: {
      type: String,
      enum: ["completed", "in-progress", "planned"],
      default: "completed",
    },
  },
  { timestamps: true }
);

// 👤 Main User Schema
const userSchema = new mongoose.Schema(
  {
    // Clerk ID
    clerkId: { type: String, required: true, unique: true },

    // Basic Information
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    photoImgUrl: { type: String, trim: true, default: "" },
    headline: { type: String, trim: true },
    bio: { type: String, trim: true },
    location: { type: String, trim: true },
    phone: { type: String, trim: true },
    website: { type: String, trim: true },

    // Skills
    skills: [{ type: String, trim: true }],

    // Nested Schemas
    education: [educationSchema],
    experience: [experienceSchema],
    projects: [projectSchema],
  },
  { timestamps: true }
);

// ✅ Export Model (prevent model overwrite in dev mode)
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
