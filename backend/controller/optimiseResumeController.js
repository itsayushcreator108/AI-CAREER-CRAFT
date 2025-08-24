import OptimisedResume from "../model/OptimisedResume.js";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import pdf from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";
import fs from "fs/promises";
import path from "path";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
export const upload = multer({ storage });

// ✅ Optimise & Save Resume
export const optimiseResume = async (req, res) => {
  try {
    const { isPublic } = req.body;

    const authData = req.auth ? req.auth() : null;
    const userId = authData?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthenticated" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Resume file is required." });
    }

    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();
    let plainText = "";

    // Extract text
    if (ext === ".pdf") {
      const fileBuffer = await fs.readFile(filePath);
      const parsed = await pdf(fileBuffer);
      plainText = parsed.text;
    } else if (ext === ".docx") {
      const data = await mammoth.extractRawText({ path: filePath });
      plainText = data.value;
    } else {
      await fs.unlink(filePath);
      return res.status(400).json({ error: "Unsupported file type. Only PDF/DOCX allowed." });
    }

    // TODO: Add resume optimisation logic with plainText here

    // Upload to Cloudinary
    const uploadRes = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
      folder: "resumes",
      use_filename: true,
      unique_filename: true,
    });

    // Remove local file
    await fs.unlink(filePath);

    // Save record in DB
    const newResume = new OptimisedResume({
      userId,
      fileUrl: uploadRes.secure_url,
      isPublic: isPublic === "true" || isPublic === true,
    });

    await newResume.save();

    res.status(200).json({ success: true, fileUrl: uploadRes.secure_url });
  } catch (error) {
    console.error("Error in optimiseResume:", error);
    res.status(500).json({ error: "Server error optimizing resume." });
  }
};

// ✅ Get All Optimised Resumes of User
export const getOptimisedResumes = async (req, res) => {
  try {
    const authData = req.auth ? req.auth() : null;
    const userId = authData?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthenticated" });
    }

    const resumes = await OptimisedResume.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: resumes });
  } catch (error) {
    console.error("Error in getOptimisedResumes:", error);
    res.status(500).json({ error: "Server error fetching resumes." });
  }
};
