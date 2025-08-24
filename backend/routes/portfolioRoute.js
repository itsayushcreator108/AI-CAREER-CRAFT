import express from "express";
import { createPortfolio, getUserPortfolios } from "../controller/portfolioController.js";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

router.post("/create", upload.single("resume"), createPortfolio);
router.get("/:userId", getUserPortfolios);

export default router;
