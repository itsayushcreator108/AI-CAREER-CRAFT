import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import connetCloudinary from "./config/cloudinary.js";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express"; // only middleware, not redirecting requireAuth
import fs from "fs";
import router from "./routes/userRoutes.js";
import codeQuestRoutes from "./routes/codeQuestRoutes.js";
import MockInterviewControllerrouter from "./routes/mockInterviewRouter.js";
import SkillGaprouter from "./routes/skillGapRoutes.js";
import atsrouter from "./routes/atsRoutes.js";
import optimiserouter from "./routes/optimiserRouter.js";
import optimisedbrouter from "./routes/optimiseResumeRoutes.js";
import portfoliorouter from "./routes/portfolioRoute.js";

dotenv.config();
connetCloudinary();
connectDB();

const app = express();

// ✅ CORS setup
app.use(
  cors({
    origin: "http://localhost:5173", // React frontend
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// ✅ Clerk middleware (adds auth info to req.auth)
app.use(clerkMiddleware());

// Health check route
app.get("/", (req, res) => res.send("✅ Server is running..."));

// Protected Routes (use requireAuth inside routes instead of here)

app.use(
  "/api/users",
  (req, res, next) => {
    console.log("➡️ /api/users route hit:", req.method, req.url);
    next();
  },
  router
);

app.use("/api/codequest", codeQuestRoutes);
app.use("/api/mockinterview", MockInterviewControllerrouter);
// Add this with your other route imports
app.use("/api/skill-gap-analysis", SkillGaprouter);
app.use('/api/ats',atsrouter) ;
app.use('/api/opt',optimiserouter)
app.use('/api/optdb',optimisedbrouter)
app.use('/api/portfolio',portfoliorouter)


// GET all posts
app.get("/api/posts", (req, res) => {
  const data = JSON.parse(fs.readFileSync("dummy.json"));
  res.json(data.posts);
});

// ADD new post
app.post("/api/posts", (req, res) => {
  const data = JSON.parse(fs.readFileSync("dummy.json"));
  const newPost = {
    id: data.posts.length + 1,
    author: req.body.author,
    title: req.body.title,
    content: req.body.content,
  };
  data.posts.push(newPost);

  fs.writeFileSync("dummy.json", JSON.stringify(data, null, 2));

  res.status(201).json(newPost);
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`👉 Open: http://localhost:${PORT}`);
});
