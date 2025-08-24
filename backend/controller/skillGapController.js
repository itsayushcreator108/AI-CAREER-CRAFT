import multer from 'multer';
import path from 'path';
import fs from 'fs';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import OpenAI from 'openai';

// Enhanced OpenAI configuration
const ai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY || "AIzaSyBNLVWoqfnsLHV24EsPym5l2C1W_luytMc",
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/resumes';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Extract text from PDF
const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
};

// Generate skill gap analysis using OpenAI
const generateSkillGapAnalysis = async (resumeText, userSkills) => {
  try {
    const currentYear = new Date().getFullYear();
    const financialYear = `${currentYear}-${currentYear + 1}`;
    
    const prompt = `
You are the world's leading career strategist, AI expert, and industry analyst with 20+ years of experience in talent development across Fortune 500 companies. You have deep expertise in emerging technologies, market trends, and career advancement strategies for ${financialYear}.

CONTEXT & DATA TO ANALYZE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RESUME CONTENT:
${resumeText}

CURRENT DECLARED SKILLS:
${userSkills}

ANALYSIS MISSION:
Create the most comprehensive, actionable, and personalized skill gap analysis that transforms careers. Your analysis should be so detailed and valuable that it becomes the candidate's career blueprint for ${financialYear}.

DELIVER ANALYSIS IN THIS STRUCTURE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 **1. CANDIDATE PROFILE ASSESSMENT**
• **Experience Level**: [Specify: Entry/Mid/Senior/Expert level with years]
• **Domain Expertise**: [Primary and secondary domains identified]
• **Current Market Value**: [Estimated salary range in current market]
• **Skill Maturity Score**: [Rate each skill 1-10 with justification]
• **Career Trajectory**: [Current path analysis and potential]
• **Unique Strengths**: [Top 5 differentiating factors]
• **Professional Gaps**: [Areas limiting career growth]

🔍 **2. COMPREHENSIVE SKILL GAP MATRIX**
• **CRITICAL GAPS** (Blocking career advancement):
  - [Skill Name]: Impact Level (High/Medium/Low) | Market Demand (%) | Learning Priority (1-5)
• **EMERGING TECH GAPS** (Future-proofing):
  - [List with specific technologies, frameworks, tools]
• **SOFT SKILL GAPS** (Leadership & Communication):
  - [Specific areas with improvement strategies]
• **INDUSTRY-SPECIFIC GAPS** (Domain knowledge):
  - [Regulations, standards, best practices missing]

🚀 **3. 2025 MARKET INTELLIGENCE & TRENDING SKILLS**
• **TOP 10 MOST IN-DEMAND SKILLS** for ${financialYear}:
  1. [Skill]: Market Growth (+X%), Avg Salary Impact (+$X), Job Openings (X,XXX)
  2. [Continue with specific data for each]
• **EMERGING TECHNOLOGIES TO WATCH**:
  - [List with adoption timeline and market impact]
• **SKILLS BECOMING OBSOLETE**:
  - [Technologies/skills to transition away from]
• **SALARY BENCHMARK DATA**:
  - Current skills portfolio value: $X - $Y
  - With recommended skills: $X - $Y (projected increase)

💡 **4. HYPER-PERSONALIZED RECOMMENDATIONS**
• **IMMEDIATE ACTION ITEMS** (Next 30 days):
  1. [Specific actionable step with resources]
  2. [Continue with timeline and expected outcomes]
• **SKILL ACQUISITION STRATEGY**:
  - **High ROI Skills** (learn first): [Ranked list with reasoning]
  - **Learning Resources**: [Specific platforms, courses, certifications]
  - **Practice Projects**: [Real-world projects to build portfolio]
• **CERTIFICATION ROADMAP**:
  - [Industry-recognized certifications with timelines and costs]
• **NETWORKING STRATEGY**:
  - [Specific communities, events, thought leaders to follow]

🎯 **5. CAREER TRANSFORMATION OPPORTUNITIES**
• **CURRENT ROLE OPTIMIZATION**:
  - Skills to leverage immediately for promotion/raise
  - Internal mobility opportunities
• **TARGET ROLES** (with skill gaps filled):
  - Role 1: [Title] | Salary: $X-$Y | Required Skills Gap: [List]
  - Role 2: [Title] | Salary: $X-$Y | Companies hiring: [Examples]
• **INDUSTRY PIVOT OPPORTUNITIES**:
  - Adjacent industries where skills transfer
  - Required additional skills for transition
• **ENTREPRENEURSHIP POTENTIAL**:
  - Skills suitable for freelancing/consulting
  - Market opportunities and rates

📈 **6. PRECISION LEARNING ROADMAP (6-MONTH SPRINT)**

**MONTH 1-2: FOUNDATION BUILDING**
• Week 1-2: [Specific skills with daily hour commitment]
• Week 3-4: [Hands-on projects with deliverables]
• Success Metrics: [Measurable outcomes]
• Budget Required: $[Amount] for courses/tools

**MONTH 3-4: SKILL ADVANCEMENT**
• Advanced concepts to master: [List]
• Portfolio projects: [3-4 specific projects]
• Networking milestones: [Events, connections, content creation]

**MONTH 5-6: MARKET POSITIONING**
• Certification completion: [Specific certs]
• Portfolio showcase: [Platform and content strategy]
• Job market entry strategy: [Application timeline, interview prep]

🎯 **7. COMPETITIVE MARKET POSITIONING**
• **PEER BENCHMARK ANALYSIS**:
  - How you compare to industry peers
  - Skills that give competitive advantage
• **PERSONAL BRAND STRATEGY**:
  - LinkedIn optimization keywords
  - Content creation topics
  - Thought leadership opportunities
• **PORTFOLIO REQUIREMENTS**:
  - Essential projects to showcase
  - GitHub/portfolio platform setup
  - Case studies to develop

💰 **8. ROI & SUCCESS METRICS**
• **Investment Breakdown**:
  - Time investment: [Hours per week]
  - Financial investment: $[Amount breakdown]
• **Expected Outcomes** (6-month timeline):
  - Salary increase potential: [Percentage or amount]
  - Job opportunities: [Number of additional roles accessible]
  - Market competitiveness score: [Current vs projected]
• **Success Tracking KPIs**:
  - Skills assessment scores
  - Project completion milestones
  - Interview success rates
  - Salary negotiation improvements

⚡ **9. RAPID EXECUTION PLAN**
• **WEEK 1 ACTIONS** (Start immediately):
  1. [Specific action with resource link]
  2. [Next action with time commitment]
• **MONTHLY CHECKPOINTS**:
  - Skills to assess and validate
  - Portfolio pieces to complete
  - Network connections to make

🔮 **10. FUTURE-PROOFING STRATEGY**
• **5-YEAR CAREER VISION** alignment
• **Technology Trend Preparation** for 2026-2030
• **Continuous Learning Framework** setup
• **Industry Evolution Adaptability** plan

Make every recommendation specific, actionable, and measurable. Include real numbers, specific resources, exact timelines, and concrete success metrics. This analysis should serve as a complete career transformation blueprint that guarantees professional growth and market competitiveness.
    `;

    const completion = await ai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8
    });

    const analysisText = completion.choices[0].message.content;
    
    // Enhanced parsing to extract different sections with better accuracy
    const sections = analysisText.split(/🎯|🔍|🚀|💡|📈|⚡|🔮|💰/);
    
    return {
      profileAssessment: sections[1] || 'Comprehensive profile assessment will be provided based on your resume analysis.',
      skillGapMatrix: sections[2] || 'Detailed skill gap matrix analyzing critical and emerging technology gaps.',
      marketIntelligence: sections[3] || 'Latest market intelligence and trending skills for the financial year.',
      recommendations: sections[4] || 'Hyper-personalized recommendations tailored to your career goals.',
      careerOpportunities: sections[5] || 'Career transformation opportunities and target role analysis.',
      learningRoadmap: sections[6] || 'Precision 6-month learning roadmap with specific milestones.',
      competitivePositioning: sections[7] || 'Market positioning strategy and competitive analysis.',
      roiMetrics: sections[8] || 'ROI analysis and success metrics for skill development investment.',
      executionPlan: sections[9] || 'Rapid execution plan with immediate actionable steps.',
      futureProofing: sections[10] || 'Future-proofing strategy for long-term career success.',
      fullAnalysis: analysisText
    };
    
  } catch (error) {
    console.error('Error generating analysis with OpenAI:', error);
    throw new Error('Failed to generate skill gap analysis');
  }
};

// Main controller function
const analyzeSkillGap = async (req, res) => {
  try {
    const { skills } = req.body;
    const resumeFile = req.file;
    
    // Validate input
    if (!resumeFile) {
      return res.status(400).json({
        success: false,
        message: 'Resume file is required'
      });
    }
    
    if (!skills || !skills.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Skills input is required'
      });
    }
    
    // Extract text from PDF
    const resumeText = await extractTextFromPDF(resumeFile.path);
    
    if (!resumeText || resumeText.trim().length < 100) {
      return res.status(400).json({
        success: false,
        message: 'Unable to extract sufficient text from the resume. Please ensure the PDF is not password protected or corrupted.'
      });
    }
    
    // Generate analysis using OpenAI
    const analysis = await generateSkillGapAnalysis(resumeText, skills.trim());
    
    // Clean up uploaded file
    try {
      fs.unlinkSync(resumeFile.path);
    } catch (cleanupError) {
      console.log('Warning: Could not delete uploaded file:', cleanupError);
    }
    
    res.status(200).json({
      success: true,
      message: 'Comprehensive skill gap analysis completed successfully',
      data: {
        profileAssessment: analysis.profileAssessment,
        skillGapMatrix: analysis.skillGapMatrix,
        marketIntelligence: analysis.marketIntelligence,
        recommendations: analysis.recommendations,
        careerOpportunities: analysis.careerOpportunities,
        learningRoadmap: analysis.learningRoadmap,
        competitivePositioning: analysis.competitivePositioning,
        roiMetrics: analysis.roiMetrics,
        executionPlan: analysis.executionPlan,
        futureProofing: analysis.futureProofing,
        analyzedAt: new Date().toISOString(),
        userSkills: skills,
        resumeProcessed: true,
        analysisVersion: "2025-Premium-AI-Enhanced"
      }
    });
    
  } catch (error) {
    console.error('Skill gap analysis error:', error);
    
    // Clean up uploaded file in case of error
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.log('Warning: Could not delete uploaded file during error handling');
      }
    }
    
    if (error.message.includes('PDF')) {
      return res.status(400).json({
        success: false,
        message: 'Error processing PDF file. Please ensure it\'s a valid, non-corrupted PDF.'
      });
    }
    
    if (error.message.includes('OpenAI') || error.message.includes('API')) {
      return res.status(503).json({
        success: false,
        message: 'AI analysis service is temporarily unavailable. Please try again later.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error occurred during analysis',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export  {
  upload,
  analyzeSkillGap,
};