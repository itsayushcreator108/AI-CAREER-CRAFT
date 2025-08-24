import express from "express";
import { atsCheck } from "../controller/atsController.js";
import multer from "multer";
import path from "path";

const atsrouter = express.Router();

// Multer storage to keep original file extension
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // .pdf or .docx
    const safeName = file.originalname.replace(/\s+/g, "-"); // remove spaces
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({ storage });

atsrouter.post("/ats-checker", upload.single("resume"), atsCheck);

export default atsrouter;
