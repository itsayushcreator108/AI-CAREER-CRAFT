import User from "../model/User.js";
import Application from "../model/Application.js";
import LearningPath from "../model/LearningPath.js";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import fs from "fs";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ------------------- Get User Profile (basic) -------------------
export const getUserProfile = async (req, res) => {
  const { userId } = req.auth?.() || {};
  if (!userId)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  try {
    const user = await User.findOne({ clerkId: userId });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (err) {
    console.error("🔥 Error in getUserProfile:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

// ------------------- Get User Profile (full details) -------------------
export const getUserProfileAll = async (req, res) => {
  const { userId } = req.auth?.() || {};
  if (!userId)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  try {
    const user = await User.findOne({ clerkId: userId });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({
      success: true,
      data: {
        fullName: user.fullName,
        email: user.email,
        headline: user.headline,
        bio: user.bio,
        location: user.location,
        phone: user.phone,
        website: user.website,
        skills: user.skills,
        experience: user.experience,
        education: user.education,
        projects: user.projects,
      },
    });
  } catch (err) {
    console.error("🔥 Error in getUserProfileAll:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

// ------------------- Create User Profile -------------------
export const createUserProfile = async (req, res) => {
  const { userId } = req.auth?.() || {};
  if (!userId)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  try {
    const existingUser = await User.findOne({ clerkId: userId });
    if (existingUser)
      return res
        .status(400)
        .json({ success: false, message: "Profile already exists" });

    const newUser = new User({
      clerkId: userId,
      fullName: req.body.fullName,
      email: req.body.email,
      headline: req.body.headline || "",
      bio: req.body.bio || "",
      location: req.body.location || "",
      phone: req.body.phone || "",
      website: req.body.website || "",
      skills: req.body.skills || [],
      education: req.body.education || [],
      experience: req.body.experience || [],
      projects: req.body.projects || [],
      photoImgUrl: req.body.photoImgUrl || "",
    });

    await newUser.save();
    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.error("🔥 Error in createUserProfile:", error);
    res.status(500).json({
      success: false,
      message: "Error creating profile",
      error: error.message,
    });
  }
};

// ------------------- Update User Profile -------------------
export const updateUserProfile = async (req, res) => {
  const { userId } = req.auth?.() || {};
  if (!userId)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  try {
    const { fullName, headline, location, bio, skills, phone, website } = req.body;

    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      {
        fullName,
        headline,
        location,
        bio,
        skills,
        phone,
        website,
      },
      { new: true, upsert: true }
    );

    res.json({ success: true, user });
  } catch (error) {
    console.error("🔥 Error in updateUserProfile:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};

// ------------------- Add Skill -------------------
export const addSkill = async (req, res) => {
  const { userId } = req.auth?.() || {};
  if (!userId)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  try {
    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      { $addToSet: { skills: req.body.skill } },
      { new: true }
    );

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, skills: user.skills });
  } catch (error) {
    console.error("🔥 Error in addSkill:", error);
    res.status(500).json({
      success: false,
      message: "Error adding skill",
      error: error.message,
    });
  }
};

// ------------------- Remove Skill -------------------
export const removeSkill = async (req, res) => {
  const { userId } = req.auth?.() || {};
  if (!userId)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  try {
    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      { $pull: { skills: req.params.skill } },
      { new: true }
    );

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, skills: user.skills });
  } catch (error) {
    console.error("🔥 Error in removeSkill:", error);
    res.status(500).json({
      success: false,
      message: "Error removing skill",
      error: error.message,
    });
  }
};

// ------------------- Add Education -------------------
export const addEducation = async (req, res) => {
  const { userId } = req.auth?.() || {};
  if (!userId)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  try {
    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      { $push: { education: req.body } },
      { new: true }
    );

    res.json({ success: true, education: user.education });
  } catch (error) {
    console.error("🔥 Error in addEducation:", error);
    res.status(500).json({
      success: false,
      message: "Error adding education",
      error: error.message,
    });
  }
};

// ------------------- Remove Education -------------------
export const deleteEducation = async (req, res) => {
  const { userId } = req.auth?.() || {};
  if (!userId)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  try {
    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      { $pull: { education: { _id: req.params.id } } },
      { new: true }
    );

    res.json({ success: true, education: user.education });
  } catch (error) {
    console.error("🔥 Error in deleteEducation:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting education",
      error: error.message,
    });
  }
};

// ------------------- Add Experience -------------------
export const addExperience = async (req, res) => {
  const { userId } = req.auth?.() || {};
  if (!userId)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  try {
    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      { $push: { experience: req.body } },
      { new: true }
    );

    res.json({ success: true, experience: user.experience });
  } catch (error) {
    console.error("🔥 Error in addExperience:", error);
    res.status(500).json({
      success: false,
      message: "Error adding experience",
      error: error.message,
    });
  }
};

// ------------------- Remove Experience -------------------
export const deleteExperience = async (req, res) => {
  const { userId } = req.auth?.() || {};
  if (!userId)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  try {
    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      { $pull: { experience: { _id: req.params.id } } },
      { new: true }
    );

    res.json({ success: true, experience: user.experience });
  } catch (error) {
    console.error("🔥 Error in deleteExperience:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting experience",
      error: error.message,
    });
  }
};

// ------------------- Add Project -------------------
export const addProject = async (req, res) => {
  const { userId } = req.auth?.() || {};
  if (!userId)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  try {
    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      { $push: { projects: req.body } },
      { new: true }
    );

    res.json({ success: true, projects: user.projects });
  } catch (error) {
    console.error("🔥 Error in addProject:", error);
    res.status(500).json({
      success: false,
      message: "Error adding project",
      error: error.message,
    });
  }
};

// ------------------- Remove Project -------------------
export const deleteProject = async (req, res) => {
  const { userId } = req.auth?.() || {};
  if (!userId)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  try {
    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      { $pull: { projects: { _id: req.params.id } } },
      { new: true }
    );

    res.json({ success: true, projects: user.projects });
  } catch (error) {
    console.error("🔥 Error in deleteProject:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting project",
      error: error.message,
    });
  }
};

// ------------------- Get User Applications -------------------
export const getUserApplications = async (req, res) => {
  const { userId } = req.auth?.() || {};
  if (!userId)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  try {
    const user = await User.findOne({ clerkId: userId });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const applications = await Application.find({ user: user._id })
      .populate("job", "title company location")
      .sort({ appliedAt: -1 });

    res.json({ success: true, applications });
  } catch (error) {
    console.error("🔥 Error in getUserApplications:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// ------------------- Get User Learning Path -------------------
export const getUserLearningPath = async (req, res) => {
  const { userId } = req.auth?.() || {};
  if (!userId)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  try {
    const user = await User.findOne({ clerkId: userId });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const learningPaths = await LearningPath.find({ user: user._id });

    res.status(200).json({
      success: true,
      count: learningPaths.length,
      data: learningPaths,
    });
  } catch (error) {
    console.error("🔥 Error in getUserLearningPath:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch learning paths",
      error: error.message,
    });
  }
};

// ------------------- Upload Profile Photo (Cloudinary) -------------------
export const updateProfilePhoto = async (req, res) => {
  const { userId } = req.auth?.() || {};
  if (!userId)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  try {
    if (!req.file)
      return res.status(400).json({ success: false, message: "No file uploaded" });

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "career_os_profiles",
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    });

    // Remove temp file
    fs.unlinkSync(req.file.path);

    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      { photoImgUrl: result.secure_url },
      { new: true }
    );

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, user, photoImgUrl: user.photoImgUrl });
  } catch (error) {
    console.error("🔥 Error in updateProfilePhoto:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update photo",
      error: error.message,
    });
  }
};

// ------------------- Multer Config -------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(process.cwd(), "uploads/profile");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files allowed"));
  },
});

// ------------------- Upload Profile Image (local storage) -------------------
export const uploadProfileImage = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    if (!req.file)
      return res.status(400).json({ success: false, message: "No file uploaded" });

    const imageUrl = `/uploads/profile/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      userId,
      { profileImgUrl: imageUrl },
      { new: true }
    );

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({
      success: true,
      message: "Profile image uploaded successfully",
      imageUrl: user.profileImgUrl,
    });
  } catch (error) {
    console.error("🔥 Error in uploadProfileImage:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------- Delete Profile Image -------------------
export const deleteProfileImage = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const user = await User.findById(userId);

    if (!user || !user.profileImgUrl)
      return res.status(404).json({ success: false, message: "No profile image found" });

    const filePath = path.join(process.cwd(), user.profileImgUrl);

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    user.profileImgUrl = "";
    await user.save();

    res.json({ success: true, message: "Profile image removed successfully" });
  } catch (error) {
    console.error("🔥 Error in deleteProfileImage:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------- Get All Users -------------------
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("🔥 Error in getAllUsers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};
// ------------------- Get User Skills Only -------------------
export const getUserSkills = async (req, res) => {
  const { userId } = req.auth?.() || {};
  if (!userId)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  try {
    const user = await User.findOne({ clerkId: userId });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({ 
      success: true, 
      skills: user.skills || [],
      message: `Found ${user.skills?.length || 0} skills`
    });
  } catch (error) {
    console.error("🔥 Error in getUserSkills:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching skills",
      error: error.message,
    });
  }
};