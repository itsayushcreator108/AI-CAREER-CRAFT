import express from "express";
import {
  getUserProfile,
  getUserProfileAll,
  updateUserProfile,
  createUserProfile,
  addSkill,
  removeSkill,
  getUserApplications,
  getUserLearningPath,
  addEducation,
  deleteEducation,
  addProject,
  deleteProject,
  addExperience,
  deleteExperience,
  getAllUsers,
  upload,
  uploadProfileImage,
  deleteProfileImage,
  getUserSkills,
} from "../controller/userController.js";
import multer from "multer";
const router = express.Router();

// Profile
router.get("/profile", getUserProfile);
router.get("/profile/all", getUserProfileAll);
router.post("/profile", createUserProfile);
router.put("/profile", updateUserProfile);
router.get("/profile-alluser", getAllUsers);

// Skills
router.post("/skills", addSkill);
router.delete("/skills/:skill", removeSkill);

// Applications
router.get("/applications", getUserApplications);

// Learning Paths
router.get("/learning-paths", getUserLearningPath);

// Education
router.post("/education", addEducation);
router.delete("/education/:id", deleteEducation);

// Projects
router.post("/projects", addProject);
router.delete("/projects/:id", deleteProject);

// Experience
router.post("/experience", addExperience);
router.delete("/experience/:id", deleteExperience);

// Upload Profile Image
router.post(
  "/profile-image",
  upload.single("profileImage"),
  uploadProfileImage
);

// Delete Profile Image
router.delete("/profile-image", deleteProfileImage);

// Skills route
router.get("/skills", getUserSkills);
export default router;
