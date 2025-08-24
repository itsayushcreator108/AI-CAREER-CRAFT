import MockInterview from "../model/MockInterview.js";
import User from "../model/User.js";
import OpenAI from "openai";

// Enhanced Gemini AI configuration
const ai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY || "AIzaSyBNLVWoqfnsLHV24EsPym5l2C1W_luytMc",

  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

class MockInterviewController {
  // =======================
  // ENHANCED AI PART
  // =======================

  // ✅ Enhanced AI Interview Response Generation
  static async generateResponse(req, res) {
    try {
      const { message, mode = "text", conversationHistory = [] } = req.body;

      if (!message || !message.trim()) {
        return res.status(400).json({ 
          success: false, 
          error: "Message is required" 
        });
      }

      // Enhanced prompts based on mode
      let systemPrompt, userPrompt;

      if (mode === "voice") {
        systemPrompt = `You are an expert AI Career Coach conducting a voice-based mock interview. 
        
        Guidelines:
        - Respond conversationally in 1-3 sentences (perfect for text-to-speech)
        - Ask follow-up questions naturally
        - Give constructive feedback and encouragement
        - Keep responses concise but meaningful
        - Avoid special characters and formatting
        - Focus on practical career advice
        - Maintain a professional but friendly tone`;

        userPrompt = `The candidate said: "${message}"
        
        Previous conversation context: ${conversationHistory.slice(-4).map(msg => `${msg.role}: ${msg.content}`).join('\n')}
        
        Respond naturally as an experienced career coach conducting a voice interview.`;

      } else {
        systemPrompt = `You are an expert AI Career Coach conducting a text-based mock interview.
        
        Guidelines:
        - Provide professional, detailed responses (2-4 sentences)
        - Include follow-up questions and practical advice
        - Give specific, actionable feedback
        - Encourage the candidate while being constructive
        - Focus on career development and interview skills
        - Maintain professionalism throughout`;

        userPrompt = `The candidate wrote: "${message}"
        
        Previous conversation context: ${conversationHistory.slice(-4).map(msg => `${msg.role}: ${msg.content}`).join('\n')}
        
        Provide comprehensive career coaching feedback and next steps.`;
      }

      // Enhanced API call with conversation context
      const messages = [
        { role: "system", content: systemPrompt },
        ...conversationHistory.slice(-6), // Include recent context
        { role: "user", content: userPrompt }
      ];

      const response = await ai.chat.completions.create({
        model: "gemini-2.0-flash",
        messages: messages,
        temperature: 0.7,
        max_tokens: mode === "voice" ? 150 : 300,
      });

      const aiReply = response.choices?.[0]?.message?.content || 
                     "I couldn't generate a response. Could you please try again?";

      // Clean response for better speech synthesis
      const cleanReply = mode === "voice" ? 
                        aiReply.replace(/[*#_`]/g, '').trim() : 
                        aiReply;

      res.status(200).json({
        success: true,
        reply: cleanReply,
        mode,
        source: "gemini-2.0-flash",
        conversationLength: conversationHistory.length,
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      console.error("❌ Enhanced Gemini API Error:", error);
      
      // Enhanced fallback responses
      const fallbackResponses = {
        voice: [
          "That's interesting. Could you tell me more about that experience?",
          "I see. How did you handle that situation?",
          "Great point. What was the outcome of that decision?",
          "That shows good thinking. What would you do differently next time?",
          "I appreciate you sharing that. What did you learn from it?"
        ],
        text: [
          "That's an excellent point. Can you walk me through your thought process on this challenge and how you approached it?",
          "Great insight! Tell me about a specific time when you had to overcome a significant obstacle in your career and what strategies you used.",
          "Interesting approach. How would you handle this situation under pressure, and what contingency plans would you have in place?",
          "I appreciate that thoughtful response. What drives your passion for this field, and how do you stay motivated during challenging times?",
          "Wonderful perspective! What questions do you have about our company culture, and how do you see yourself contributing to our team dynamics?"
        ]
      };

      const responses = fallbackResponses[mode] || fallbackResponses.text;
      const fallbackReply = responses[Math.floor(Math.random() * responses.length)];

      res.status(200).json({
        success: true,
        reply: fallbackReply,
        mode,
        source: "fallback",
        timestamp: new Date().toISOString(),
      });
    }
  }

  // ✅ Enhanced Interview Session Starter
  static async startInterview(req, res) {
    try {
      const { type } = req.body;

      if (!type) {
        return res.status(400).json({ 
          success: false, 
          message: "Interview type required" 
        });
      }

      const startPrompts = {
        text: `You are starting a text-based mock interview. Create a warm, professional welcome message that:
        - Welcomes the candidate to the interview
        - Explains this is practice to help them improve
        - Asks them to introduce themselves and their background
        - Sets a comfortable, encouraging tone
        
        Keep it professional yet approachable (3-4 sentences).`,

        voice: `You are starting a voice-based mock interview. Create a brief, conversational welcome that:
        - Warmly welcomes them to the voice interview
        - Mentions this is practice to build confidence
        - Asks them to introduce themselves
        - Uses natural, spoken language
        
        Keep it concise for voice (1-2 sentences).`,

        video: `You are starting a video mock interview. Create a professional video call greeting that:
        - Welcomes them to the video interview session
        - Explains the format and that it's practice
        - Asks them to introduce themselves professionally
        - Sets expectations for the video format
        
        Keep it professional and clear (2-3 sentences).`
      };

      const response = await ai.chat.completions.create({
        model: "gemini-2.0-flash",
        messages: [{ 
          role: "user", 
          content: startPrompts[type] || startPrompts.text 
        }],
        temperature: 0.6,
        max_tokens: type === "voice" ? 100 : 200,
      });

      const firstQuestion = response.choices?.[0]?.message?.content || 
                           `Welcome to your ${type} mock interview! This is a safe space to practice and improve your interview skills. I'm your AI career coach, and I'm here to help you succeed. Please start by introducing yourself and telling me about your professional background.`;

      res.json({ 
        success: true, 
        question: firstQuestion,
        type: type,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error("❌ Start Interview Error:", error);
      
      const defaultWelcomes = {
        text: "Welcome to your mock interview session! I'm your AI career coach, and I'm excited to help you practice and improve your interview skills. This is a safe environment where you can build confidence and get valuable feedback. Please start by introducing yourself and sharing your professional background.",
        voice: "Hello! Welcome to your voice interview practice session. I'm your AI career coach. Please introduce yourself and tell me about your background.",
        video: "Welcome to your video mock interview! I'm your AI career coach here to help you practice. Please introduce yourself and share your professional experience with me."
      };

      res.json({ 
        success: true, 
        question: defaultWelcomes[req.body.type] || defaultWelcomes.text,
        type: req.body.type || "text",
        source: "fallback"
      });
    }
  }

  // ✅ Enhanced Interview Tips Generation
  static async getInterviewTips(req, res) {
    try {
      const tipsPrompt = `Generate 6 practical, actionable interview preparation tips. Return as a JSON array with this exact format:
      [
        {
          "category": "Preparation",
          "tip": "Research the company thoroughly",
          "details": "Study the company's mission, values, recent news, and industry position to show genuine interest and preparation."
        }
      ]
      
      Cover these categories: Preparation, Communication, Body Language, Questions, Follow-up, Mindset.
      Make tips specific and immediately actionable.`;

      const response = await ai.chat.completions.create({
        model: "gemini-2.0-flash",
        messages: [{ role: "user", content: tipsPrompt }],
        temperature: 0.5,
        max_tokens: 800,
      });

      let tipsText = response.choices?.[0]?.message?.content || "[]";
      
      // Clean the response to extract JSON
      const jsonMatch = tipsText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        tipsText = jsonMatch;
      }

      let tips;
      try {
        tips = JSON.parse(tipsText);
        // Validate structure
        if (!Array.isArray(tips) || tips.length === 0) {
          throw new Error("Invalid tips format");
        }
      } catch (parseError) {
        console.error("Tips parsing error:", parseError);
        // Enhanced fallback tips
        tips = [
          {
            category: "Preparation", 
            tip: "Research the company and role thoroughly", 
            details: "Study the company's mission, values, recent news, and the specific job requirements to demonstrate genuine interest."
          },
          {
            category: "Communication", 
            tip: "Practice the STAR method", 
            details: "Structure your answers using Situation, Task, Action, Result to provide clear, compelling examples from your experience."
          },
          {
            category: "Body Language", 
            tip: "Maintain confident posture and eye contact", 
            details: "Sit up straight, make appropriate eye contact, and use natural hand gestures to convey confidence and engagement."
          },
          {
            category: "Questions", 
            tip: "Prepare thoughtful questions about the role", 
            details: "Ask about team dynamics, growth opportunities, and company culture to show your genuine interest in the position."
          },
          {
            category: "Follow-up", 
            tip: "Send a thank you email within 24 hours", 
            details: "Express gratitude, reiterate your interest, and briefly mention key points from your conversation."
          },
          {
            category: "Mindset", 
            tip: "Practice positive visualization", 
            details: "Visualize successful interview scenarios and prepare for common questions to build confidence and reduce anxiety."
          }
        ];
      }

      res.status(200).json({ 
        success: true, 
        tips, 
        count: tips.length,
        source: tips.length > 0 ? "gemini-ai" : "fallback",
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error("❌ Tips Generation Error:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to generate interview tips",
        message: error.message 
      });
    }
  }

  // ✅ Enhanced API Health Check
  static async healthCheck(req, res) {
    try {
      const testPrompt = "Respond with exactly: 'API connection successful - Gemini AI is operational'";
      
      const response = await ai.chat.completions.create({
        model: "gemini-2.0-flash",
        messages: [{ role: "user", content: testPrompt }],
        max_tokens: 50,
      });

      const testText = response.choices?.[0]?.message?.content || "";
      const isSuccessful = testText.toLowerCase().includes("successful");

      res.status(200).json({
        success: true,
        message: "Mock Interview API is operational",
        geminiStatus: isSuccessful ? "Connected" : "Partial",
        testResponse: testText,
        timestamp: new Date().toISOString(),
        model: "gemini-2.0-flash"
      });

    } catch (error) {
      console.error("❌ Health Check Error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Health check failed", 
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  // =======================
  // DATABASE OPERATIONS
  // =======================

  // ✅ Create new mock interview record
  static async createMockInterview(req, res) {
    try {
      const { userId } = req.auth;
      const { score, feedback, questions, duration, interviewType } = req.body;

      const user = await User.findOne({ clerkId: userId });
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: "User not found" 
        });
      }

      const mockInterview = new MockInterview({
        user: user._id,
        score,
        feedback,
        questions,
        duration,
        interviewType,
        completedAt: new Date()
      });

      await mockInterview.save();

      res.status(201).json({ 
        success: true, 
        message: "Mock interview saved successfully", 
        data: mockInterview 
      });

    } catch (error) {
      console.error("❌ DB Save Error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to save mock interview",
        error: error.message 
      });
    }
  }

  // ✅ Get all mock interviews (admin)
  static async getAllMockInterviews(req, res) {
    try {
      const interviews = await MockInterview.find()
        .populate("user", "fullName email photoImgUrl")
        .sort({ createdAt: -1 })
        .limit(100); // Limit for performance

      res.json({ 
        success: true, 
        data: interviews,
        count: interviews.length 
      });

    } catch (error) {
      console.error("❌ DB Fetch All Error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch mock interviews" 
      });
    }
  }

  // ✅ Get mock interviews for logged-in user
  static async getUserMockInterviews(req, res) {
    try {
      const { userId } = req.auth;
      const user = await User.findOne({ clerkId: userId });
      
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: "User not found" 
        });
      }

      const interviews = await MockInterview.find({ user: user._id })
        .sort({ createdAt: -1 })
        .limit(50); // User's recent interviews

      res.json({ 
        success: true, 
        data: interviews,
        count: interviews.length 
      });

    } catch (error) {
      console.error("❌ DB User Fetch Error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch user interviews" 
      });
    }
  }

  // ✅ Delete mock interview
  static async deleteMockInterview(req, res) {
    try {
      const { id } = req.params;
      const deleted = await MockInterview.findByIdAndDelete(id);

      if (!deleted) {
        return res.status(404).json({ 
          success: false, 
          message: "Mock interview not found" 
        });
      }

      res.json({ 
        success: true, 
        message: "Mock interview deleted successfully" 
      });

    } catch (error) {
      console.error("❌ DB Delete Error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to delete mock interview" 
      });
    }
  }

  // ✅ Get interview analytics
  static async getInterviewAnalytics(req, res) {
    try {
      const { userId } = req.auth;
      const user = await User.findOne({ clerkId: userId });
      
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: "User not found" 
        });
      }

      const analytics = await MockInterview.aggregate([
        { $match: { user: user._id } },
        {
          $group: {
            _id: null,
            totalInterviews: { $sum: 1 },
            averageScore: { $avg: "$score" },
            totalDuration: { $sum: "$duration" },
            interviewTypes: { $push: "$interviewType" }
          }
        }
      ]);

      res.json({ 
        success: true, 
        data: analytics[0] || {
          totalInterviews: 0,
          averageScore: 0,
          totalDuration: 0,
          interviewTypes: []
        }
      });

    } catch (error) {
      console.error("❌ Analytics Error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch analytics" 
      });
    }
  }
}

export default MockInterviewController;