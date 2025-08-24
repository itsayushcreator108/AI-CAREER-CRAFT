// controllers/codequestController.js
import axios from "axios";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import UserCodeQuestHistory from "../model/UserCodeQuestHistory.js";
import { Buffer } from "buffer";
dotenv.config();

/* ────────────────────────────────────────────────────────── */
/*  Helpers                                                  */
/* ────────────────────────────────────────────────────────── */

const languageMap = {
  "C++": 54,
  C: 50,
  Python: 71,
  Python3: 71,
  Java: 62,
  JavaScript: 63,
  "C#": 51,
  Ruby: 72,
  Swift: 83,
  Go: 60,
  Scala: 76,
  Kotlin: 78,
  Rust: 73,
  PHP: 68,
};

const rapidHeaders = {
  "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
  "x-rapidapi-key": process.env.JUDGE0_API_KEY,
  "content-type": "application/json",
};

// Initialize Gemini client
const ai = new GoogleGenAI({
  apiKey: "AIzaSyBNLVWoqfnsLHV24EsPym5l2C1W_luytMc",
});

/* ────────────────────────────────────────────────────────── */
/*  1️⃣ Generate Question                                     */
/* ────────────────────────────────────────────────────────── */

export const generateQuestion = async (req, res) => {
  try {
    // Validate and set language
    const supportedLanguages = [
      "C++",
      "Java",
      "Python",
      "JavaScript",
      "Python3",
      "C",
      "C#",
      "Ruby",
      "Swift",
      "Go",
      "Scala",
      "Kotlin",
      "Rust",
      "PHP",
    ];
    let lang = req.body.language || "Python";
    if (!supportedLanguages.includes(lang)) lang = "Python";

    // Optional: allow dynamic difficulty
    const difficulty = req.body.difficulty || "medium";

    // Build the prompt
    const prompt = `
  You are an expert coding-problem setter for technical interviews.
  
  Generate one *${difficulty}-difficulty* problem in **${lang}** suitable for LeetCode-style platforms.
  
  Return output with these numbered sections, exactly in this order:
  
  1. Title  
  2. Problem Statement  
  3. Difficulty  
  4. Input Format  
  5. Output Format  
  6. Constraints  
  7. Sample Input  
  8. Sample Output  
  9. Explanation  
  10. Edge Cases  
  11. Hints (Optional)  
  12. Tags  
  13. JSON Output (identical content in valid JSON)
  
  Do not include any extra commentary or notes. Ensure the response is clean and well-formatted.
  `;

    // Generate content using AI
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    console.log(response.text);

    const text = (response.text || "").trim();

    if (!text) {
      return res
        .status(500)
        .json({ success: false, message: "AI returned empty response" });
    }

    // Return the question text
    res.json({ success: true, question: text });
  } catch (err) {
    console.error("Question generation error:", err);
    res.status(500).json({
      success: false,
      message: "Could not generate question. Please try again later.",
    });
  }
};

/* ────────────────────────────────────────────────────────── */
/*  2️⃣ Evaluate Submission                                   */
/* ────────────────────────────────────────────────────────── */

export const evaluateSubmission = async (req, res) => {
    const { code, language, question } = req.body;
  
    // Clerk v5 authentication
    const session = await req.auth();
    const userId = session?.userId; // string from Clerk
  
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });
  
    if (!code || !language || !question)
      return res
        .status(400)
        .json({ success: false, message: "Missing payload fields" });
  
    try {
      // 1️⃣ Encode code in Base64 for Judge0
      const base64Code = Buffer.from(code, "utf-8").toString("base64");
  
      const judgePayload = {
        source_code: base64Code,
        language_id: languageMap[language],
        stdin: "", // optional input
      };
  
      const { data: judgeData } = await axios.post(
        "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true",
        judgePayload,
        { headers: rapidHeaders }
      );
  
      // 2️⃣ Decode stdout/stderr from Base64
      const simulatedOutput = judgeData.stdout
        ? Buffer.from(judgeData.stdout, "base64").toString("utf-8").trim()
        : judgeData.stderr
        ? Buffer.from(judgeData.stderr, "base64").toString("utf-8").trim()
        : "No output";
  
      // 3️⃣ AI code review via Gemini
      const reviewPrompt = `
  You are an experienced programming tutor.  
  Evaluate the following submission.
  
  Language  : ${language}
  
  Submission:
  \`\`\`
  ${code}
  \`\`\`
  
  Program Output:
  \`\`\`
  ${simulatedOutput}
  \`\`\`
  
  Return STRICTLY valid JSON:
  
  {
    "correct": "Yes" | "No",
    "codeQuality": 0-100,
    "suggestions": ["...", "..."]
  }
  `;
  
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: reviewPrompt,
      });
  
      const report = response.text.trim()|| "No review generated";
  
      // 4️⃣ Save submission in user's history
      let history = await UserCodeQuestHistory.findOne({ userId });
  
      if (!history) {
        history = new UserCodeQuestHistory({ userId, submissions: [] });
      }
  
      history.submissions.push({
        question,
        code,
        report,
        language,
        submittedAt: new Date(),
      });
  
      await history.save();
  
      res.json({ success: true, simulatedOutput, report });
    } catch (err) {
      console.error("Eval error:", err);
      res
        .status(500)
        .json({ success: false, message: err?.message || "Evaluation failed" });
    }
  };

/* ────────────────────────────────────────────────────────── */
/*  3️⃣ Get User History                                       */
/* ────────────────────────────────────────────────────────── */

export const getUserHistory = async (req, res) => {
  const session = await req.auth();
  const userId = session?.userId;

  if (!userId)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  try {
    const history = await UserCodeQuestHistory.findOne({ userId }).lean();
    const submissions =
      history?.submissions
        ?.slice()
        ?.sort((a, b) => b.submittedAt - a.submittedAt) || [];

    res.json({ success: true, submissions });
  } catch (err) {
    console.error("History error:", err);
    res
      .status(500)
      .json({ success: false, message: "Could not fetch history" });
  }
};


export const deleteSubmission = async (req, res) => {
    const session = await req.auth();
    const userId = session?.userId;
  
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });
  
    const submissionId = req.params.id;
  
    try {
      const history = await UserCodeQuestHistory.findOne({ userId });
  
      if (!history)
        return res.status(404).json({ success: false, message: "No history found" });
  
      // Filter out the submission to delete
      const originalLength = history.submissions.length;
      history.submissions = history.submissions.filter(
        (sub) => sub._id.toString() !== submissionId
      );
  
      if (history.submissions.length === originalLength)
        return res.status(404).json({ success: false, message: "Submission not found" });
  
      await history.save();
  
      res.json({ success: true, message: "Submission deleted successfully" });
    } catch (err) {
      console.error("Delete submission error:", err);
      res.status(500).json({ success: false, message: "Failed to delete submission" });
    }
  };