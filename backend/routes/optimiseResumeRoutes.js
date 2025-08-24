import express from "express";
import { optimiseResume, upload , getOptimisedResumes } from "../controller/optimiseResumeController.js";


const optimisedbrouter = express.Router();

// Use multer middleware upload.single for file upload, Clerk auth for user
optimisedbrouter.post(
  "/optimisedb-resume",

  upload.single("resume"),
  optimiseResume
);
optimisedbrouter.get("/list", getOptimisedResumes);

export default optimisedbrouter;