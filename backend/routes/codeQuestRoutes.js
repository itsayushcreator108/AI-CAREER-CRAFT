// routes/codequest.js
import express from "express";
import { generateQuestion, evaluateSubmission , getUserHistory , deleteSubmission } from "../controller/codeQuestController.js";



const codeQuestRoutes = express.Router();

// Generate new AI question
codeQuestRoutes.post("/generate-question", generateQuestion);

// Evaluate user code
codeQuestRoutes.post("/evaluate",  evaluateSubmission);

// Get user history
codeQuestRoutes.get("/history",  getUserHistory);
codeQuestRoutes.delete("/history/:id", deleteSubmission);

export default codeQuestRoutes;
