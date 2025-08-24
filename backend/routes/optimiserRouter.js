import express from "express";
import multer from "multer";
import path from "path";
import { optimiseResume } from "../controller/optimiserController.js";

const optimiserRouter = express.Router();

// Multer storage setup to preserve original extension
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "-");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({ storage });

optimiserRouter.post("/optimise-resume", upload.single("resume"), optimiseResume);


export default optimiserRouter;
