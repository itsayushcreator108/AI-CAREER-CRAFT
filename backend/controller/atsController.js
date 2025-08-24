import fs from "fs/promises";
import path from "path";
import pdf from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";

export const keywords = {
    // Programming Languages
    javascript: 12,
    typescript: 11,
    python: 13,
    java: 11,
    csharp: 9,
    cplusplus: 8,
    ruby: 7,
    php: 7,
    go: 8,
    rust: 8,
    swift: 7,
    kotlin: 7,
    scala: 7,
    perl: 5,
    objectivec: 5,
    bash: 6,
    shell: 6,
  
    // Frameworks/Libraries
    react: 15,
    "react.js": 13,
    angular: 13,
    vue: 12,
    svelte: 10,
    nextjs: 12,
    "next.js": 13,
    nuxtjs: 9,
    express: 11,
    "node.js": 12,
    node: 10,
    django: 12,
    flask: 10,
    spring: 8,
    rails: 8,
    laravel: 8,
    symfony: 6,
    fastapi: 10,
    electron: 8,
    jQuery: 7,
    "graphql": 11,
    "redux": 9,
    mobx: 5,
    rxjs: 6,
  
    // Cloud & DevOps
    aws: 14,
    "amazon web services": 13,
    azure: 13,
    gcp: 13,
    "google cloud": 12,
    docker: 12,
    kubernetes: 13,
    terraform: 12,
    ansible: 10,
    "ci/cd": 10,
    githubactions: 9,
    circleci: 8,
    jenkins: 10,
    gitlab: 8,
    git: 8,
    cloudformation: 8,
    vagrant: 7,
    heroku: 7,
    netlify: 8,
    vercel: 9,
  
    // Databases
    mysql: 9,
    postgresql: 10,
    mongodb: 11,
    redis: 10,
    cassandra: 8,
    oracle: 8,
    mariadb: 8,
    sqlite: 6,
    dynamodb: 9,
    elasticsearch: 10,
    snowflake: 10,
    bigquery: 8,
    firebase: 8,
    nebula: 7,
    timescaledb: 7,
    influxdb: 7,
    memcached: 7,
  
    // Data/Analytics/AI/ML
    "machine learning": 14,
    ml: 13,
    ai: 12,
    "deep learning": 12,
    nlp: 10,
    "natural language processing": 10,
    "computer vision": 11,
    tensors: 7,
    pytorch: 11,
    tensorflow: 12,
    keras: 10,
    scikit: 9,
    pandas: 11,
    numpy: 10,
    "data science": 12,
    "data analysis": 12,
    "data engineering": 11,
    "data lake": 10,
    "data warehouse": 10,
    snowflake: 10,
    tableau: 10,
    powerbi: 10,
    excel: 8,
    jupyter: 8,
    hadoop: 8,
    spark: 10,
  
    // Security
    security: 12,
    cybersecurity: 11,
    "penetration testing": 8,
    ssl: 7,
    tls: 7,
    authentication: 10,
    oauth: 8,
    saml: 7,
    encryption: 10,
    firewalls: 8,
    acm: 6,
    compliance: 8,
    "cloud security": 10,
    "identity access management": 10,
  
    // Frontend
    html: 8,
    css: 8,
    tailwind: 9,
    bootstrap: 8,
    sass: 7,
    less: 6,
    framer: 8,
    "framer motion": 8,
    webpack: 9,
    vite: 9,
    parcel: 7,
  
    // Design/UI/UX
    "ui/ux": 10,
    figma: 10,
    sketch: 9,
    zeplin: 8,
    adobe: 8,
    xd: 8,
    photoshop: 8,
    "user experience": 9,
    "user interface": 8,
    accessibility: 9,
    "responsive design": 10,
    "mobile first": 8,
    wireframe: 7,
  
    // APIs
    api: 8,
    rest: 8,
    restful: 8,
    graphql: 9,
    soap: 6,
    openapi: 8,
    swagger: 8,
    json: 9,
    xml: 7,
    "api gateway": 9,
  
    // Testing
    testing: 8,
    test: 6,
    jest: 9,
    mocha: 8,
    cypress: 10,
    playwright: 9,
    chai: 7,
    enzyme: 7,
    puppeteer: 9,
    selenium: 8,
    
    // Mobile
    "mobile development": 11,
    android: 10,
    ios: 10,
    reactnative: 11,
    flutter: 10,
    xcode: 8,
    swiftui: 8,
    kotlin: 8,
    "mobile apps": 9,
  
    // Architecture/Patterns
    "microservices": 11,
    "event driven": 8,
    "monolith": 7,
    "serverless": 11,
    soa: 8,
    patterns: 7,
    "design patterns": 9,
  
    // Big Data
    bigdata: 10,
    hadoop: 8,
    spark: 10,
    kafka: 9,
    databricks: 10,
  
    // Certifications
    aws_certified: 14,
    aws_saa: 12,
    gcp_certified: 12,
    azure_certified: 12,
    cissp: 10,
    pmp: 8,
    scrum: 8,
    csm: 8,
    cspo: 6,
    ocp: 8,
    ccna: 8,
    ccnp: 8,
  
    // Degrees
    "bachelor's": 8,
    "master's": 8,
    "phd": 10,
    btech: 8,
    mtech: 8,
    mba: 10,
    bsc: 7,
    msc: 7,
  
    // Job Titles
    "software engineer": 10,
    "full stack developer": 10,
    "front end developer": 9,
    "backend developer": 9,
    "data scientist": 10,
    "product manager": 8,
    "devops engineer": 10,
    "cloud architect": 10,
    "solutions architect": 10,
    "machine learning engineer": 10,
    "qa engineer": 8,
    "security analyst": 8,
  
    // Soft Skills
    "problem solving": 11,
    teamwork: 10,
    "communication skills": 10,
    leadership: 10,
    "project management": 11,
    "critical thinking": 10,
    "decision making": 9,
    "interpersonal": 8,
    adaptability: 9,
    initiative: 9,
    creativity: 8,
    "time management": 8,
    collaboration: 10,
    mentoring: 8,
    "client communication": 8,
  
    // Business/Management
    agile: 9,
    scrum: 9,
    kanban: 8,
    waterfall: 7,
    stakeholder: 7,
    business: 7,
    "cost optimization": 7,
    "process improvement": 8,
    sdlc: 8,
    roadmap: 7,
  
    // Misc Technical
    versioning: 7,
    github: 9,
    gitlab: 8,
    bitbucket: 7,
    jira: 9,
    confluence: 8,
    slack: 7,
    trello: 7,
    api: 8,
    json: 9,
    yaml: 8,
    markdown: 7,
    virtualization: 8,
    vmware: 8,
    citrix: 7,
  
    // Others / Popular Skills
    blockchain: 10,
    cryptocurrency: 9,
    iot: 9,
    vr: 8,
    ar: 8,
    drone: 7,
    robotics: 8,
    edge: 8,
  
    // Languages (Foreign)
    english: 5,
    hindi: 5,
    spanish: 5,
    german: 5,
    french: 5,
    chinese: 5,
    japanese: 5,
    portuguese: 5,
    russian: 5,
  };
  
  

// Helper: parse resume file (PDF, DOCX, DOC)
export const parseResumeFile = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();

  try {
    if (ext === ".pdf") {
      const fileBuffer = await fs.readFile(filePath);
      const data = await pdf(fileBuffer);
      return data.text;
    } else if (ext === ".docx" || ext === ".doc") {
      const data = await mammoth.extractRawText({ path: filePath });
      return data.value;
    } else {
      console.error("Unsupported file type:", ext);
      throw new Error("Unsupported file type. Only PDF, DOCX, DOC are allowed.");
    }
  } catch (err) {
    console.error("Error parsing file:", err);
    throw new Error("Failed to parse resume file.");
  }
};

// ATS check controller
export const atsCheck = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Resume file is required." });
    }

    console.log("Uploaded file info:", req.file);

    const filePath = req.file.path;
    const text = await parseResumeFile(filePath);

    // Delete file after parsing
    await fs.unlink(filePath);

    const lowerText = text.toLowerCase();
    let totalWeight = 0;
    let achievedWeight = 0;

    Object.entries(keywords).forEach(([word, weight]) => {
      totalWeight += weight;
      const regex = new RegExp(`\\b${word.replace(".", "\\.")}\\b`, "gi");
      if (regex.test(lowerText)) {
        achievedWeight += weight;
      }
    });

    const score = Math.min(100, Math.round((achievedWeight / totalWeight) * 100));

    let feedback = "";
    if (score > 85) feedback = "Outstanding match! Your resume is ATS-friendly.";
    else if (score > 65) feedback = "Good match, consider improving some skills.";
    else feedback = "Your resume needs improvement for better ATS compatibility.";

    res.json({
      score,
      feedback,
      visibility: req.body.visibility || "private",
      excerpt: text.substring(0, 1000),
    });
  } catch (error) {
    console.error("ATS Check Error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};
