
import React, { useState, useRef } from "react";
import {
  Check,
  ChevronRight,
  Code,
  Zap,
  Clock,
  Loader2,
  AlertTriangle,
  RefreshCcw,
  Play,
  Terminal,
  BookOpen,
  Award,
  Sparkles,
  Copy,
  Download,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import toast, { Toaster } from "react-hot-toast";

// React Markdown imports
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const LANGUAGES = [
  "C++", "Java", "Python", "JavaScript", "Python3",
  "C", "C#", "Ruby", "Swift", "Go", "Scala", "Kotlin", "Rust", "PHP",
];

const DEFAULT_SNIPPET = "// Write your solution here...\n// Good luck! 🚀";

// LeetCode-style Custom Markdown Components
const MarkdownComponents = {
  // Main heading - problem title
  h1: ({children}) => (
    <h1 className="text-2xl font-bold text-gray-100 mb-6 pb-4 border-b border-gray-700/40">
      {children}
    </h1>
  ),
  
  // Section headings
  h2: ({children}) => (
    <h2 className="text-lg font-semibold text-gray-200 mb-4 mt-6">
      {children}
    </h2>
  ),
  
  h3: ({children}) => (
    <h3 className="text-base font-semibold text-gray-300 mb-3 mt-4">
      {children}
    </h3>
  ),

  // Paragraphs
  p: ({children}) => (
    <p className="text-gray-300 leading-relaxed mb-4 text-sm">
      {children}
    </p>
  ),

  // Lists
  ul: ({children}) => (
    <ul className="space-y-1 mb-4 ml-6">
      {children}
    </ul>
  ),
  
  li: ({children}) => (
    <li className="text-gray-300 text-sm list-disc">
      {children}
    </li>
  ),

  // Code blocks - LeetCode style
  code: ({inline, className, children, ...props}) => {
    const match = /language-(\w+)/.exec(className || '');
    
    if (!inline && match) {
      return (
        <div className="my-4">
          <pre className="bg-gray-900 p-3 rounded-md overflow-x-auto border border-gray-700">
            <code className="text-green-400 font-mono text-xs" {...props}>
              {children}
            </code>
          </pre>
        </div>
      );
    }
    
    return (
      <code 
        className="bg-gray-800 text-orange-300 px-1.5 py-0.5 rounded font-mono text-xs" 
        {...props}
      >
        {children}
      </code>
    );
  },

  // Strong text
  strong: ({children}) => (
    <strong className="text-white font-semibold">
      {children}
    </strong>
  ),

  // Emphasis
  em: ({children}) => (
    <em className="text-blue-300 italic">
      {children}
    </em>
  ),

  // Blockquotes
  blockquote: ({children}) => (
    <blockquote className="border-l-4 border-blue-500 bg-blue-900/20 pl-4 py-2 my-3 rounded-r">
      <div className="text-blue-200 text-sm">
        {children}
      </div>
    </blockquote>
  ),

  // Horizontal rule
  hr: () => (
    <hr className="border-gray-700 my-6" />
  ),

  // Links
  a: ({href, children}) => (
    <a 
      href={href} 
      className="text-blue-400 hover:text-blue-300 underline"
      target="_blank" 
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
};

const Codequest = () => {
  const [language, setLanguage] = useState("C++");
  const [code, setCode] = useState(DEFAULT_SNIPPET);
  const [loading, setLoading] = useState(false);
  const [questionLoading, setQuestionLoading] = useState(false);
  const [question, setQuestion] = useState(null);
  const [difficulty, setDifficulty] = useState("");
  const [report, setReport] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("problem");
  
  const backendUrl = "http://localhost:4000";
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const reportRef = useRef(null);

  const parseDifficulty = (text) => {
    if (!text) return "";
    const difficultyMatch = text.match(/(?:difficulty|level):\s*(\w+)/i) || 
                           text.match(/##\s*difficulty\s*:\s*(\w+)/i) ||
                           text.match(/\*\*difficulty\*\*:\s*(\w+)/i);
    return difficultyMatch ? difficultyMatch[1] : "Medium";
  };

  const getDifficultyColor = (diff) => {
    switch (diff?.toLowerCase()) {
      case "easy": return "bg-green-600/20 text-green-300 border-green-500/40";
      case "medium": return "bg-yellow-600/20 text-yellow-300 border-yellow-500/40";
      case "hard": return "bg-red-600/20 text-red-300 border-red-500/40";
      default: return "bg-blue-600/20 text-blue-300 border-blue-500/40";
    }
  };

  const authHeader = async () => {
    try {
      const token = await getToken();
      return token ? { Authorization: `Bearer ${token}` } : {};
    } catch (err) {
      console.error("Failed to get JWT:", err);
      return {};
    }
  };

  // Format question to proper markdown - LeetCode style
  const formatQuestion = (q) => {
    if (!q) return "";
    
    try {
      const obj = typeof q === "string" ? JSON.parse(q) : q;
      
      let formatted = "";
      
      // Title with problem number (LeetCode style)
      const problemNumber = Math.floor(Math.random() * 3000) + 1;
      if (obj.title || obj.Title) {
        formatted += `# ${problemNumber}. ${obj.title || obj.Title}\n\n`;
      }
      
      // Problem description
      if (obj.description || obj["Problem Statement"]) {
        formatted += `${obj.description || obj["Problem Statement"]}\n\n`;
      }
      
      // Examples section
      if (obj["Sample Input"] && obj["Sample Output"]) {
        formatted += `**Example 1:**\n\n`;
        formatted += `\`\`\`\nInput: ${obj["Sample Input"]}\nOutput: ${obj["Sample Output"]}\n\`\`\`\n\n`;
        
        if (obj.Explanation) {
          formatted += `**Explanation:** ${obj.Explanation}\n\n`;
        }
      }
      
      // Constraints
      if (obj.Constraints && Array.isArray(obj.Constraints)) {
        formatted += `**Constraints:**\n\n`;
        obj.Constraints.forEach(constraint => {
          formatted += `* \`${constraint}\`\n`;
        });
        formatted += `\n`;
      }
      
      return formatted;
      
    } catch (e) {
      // If not JSON, return as-is but add basic formatting
      return q;
    }
  };

  const fetchQuestion = async () => {
    setQuestion(null);
    setError("");
    setDifficulty("");
    setReport("");
    setCode(DEFAULT_SNIPPET);
    setQuestionLoading(true);
    setActiveTab("problem");
    
    try {
      const res = await axios.post(
        `${backendUrl}/api/codequest/generate-question`,
        { language },
        { headers: await authHeader() }
      );
      
      const rawQuestion = res.data.question;
      const formattedQuestion = formatQuestion(rawQuestion);
      
      setQuestion(formattedQuestion);
      setDifficulty(parseDifficulty(formattedQuestion));
      
      toast.success("New question generated! 🎯");
    } catch (e) {
      console.error(e);
      setError("Failed to fetch question.");
      toast.error("Failed to generate question 😞");
    } finally {
      setQuestionLoading(false);
    }
  };

  const evaluate = async () => {
    if (!question) return;
    setLoading(true);
    setReport("");
    setError("");
    setActiveTab("report");
    
    try {
      const res = await axios.post(
        `${backendUrl}/api/codequest/evaluate`,
        { code, language, question },
        { headers: await authHeader() }
      );
      setReport(
        `## Execution Results\n\n**Output:**\n\`\`\`\n${res.data.simulatedOutput}\n\`\`\`\n\n**Analysis:**\n${res.data.report}`
      );
      toast.success("Code executed successfully! ✅");
      setTimeout(() => reportRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || "Evaluation failed.");
      toast.error("Evaluation failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => fetchQuestion();
  
  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard! 📋");
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solution.${language.toLowerCase()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Code downloaded! 💾");
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-gray-100">

      
      {/* Top Bar */}
      <header className="bg-gray-800/90 backdrop-blur-sm shadow-2xl border-b border-gray-700/60 h-16 px-6 flex items-center justify-center flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              CodeQuest
            </h1>
            <p className="text-xs text-gray-400">AI-Powered Coding Challenge</p>
          </div>
        </div>
      </header>

      {/* Main Content with Fixed Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Scrollable Problem Section */}
        <div className="w-1/2 flex flex-col border-r border-gray-700/50">
          {/* Fixed Header */}
          <div className="bg-gray-800/60 backdrop-blur-sm border-b border-gray-700/50 p-4 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-bold text-gray-100">Problem</h2>
              </div>
              {difficulty && (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(difficulty)}`}>
                  {difficulty}
                </span>
              )}
            </div>

            {/* Tabs */}
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab("problem")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === "problem" 
                    ? "bg-gray-700 text-white" 
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("report")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === "report" 
                    ? "bg-gray-700 text-white" 
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
                }`}
              >
                Result
              </button>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-hidden">
            {activeTab === "problem" && (
              <div className="h-full overflow-y-auto custom-scrollbar">
                {questionLoading && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center space-y-3">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-cyan-400" />
                      <p className="text-gray-300 text-sm">Generating AI Question...</p>
                    </div>
                  </div>
                )}
                
                {!question && !error && !questionLoading && (
                  <div className="flex items-center justify-center h-full p-6">
                    <div className="text-center space-y-4">
                      <Sparkles className="w-16 h-16 mx-auto text-gray-500" />
                      <div>
                        <p className="text-lg text-gray-300 mb-2">Ready for Challenge?</p>
                        <p className="text-gray-400 text-sm mb-4">Generate a coding problem to get started</p>
                      </div>
                      <button
                        onClick={fetchQuestion}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                      >
                        Generate Problem
                      </button>
                    </div>
                  </div>
                )}
                
                {error && (
                  <div className="flex items-center justify-center h-full p-6">
                    <div className="text-center space-y-3">
                      <AlertTriangle className="w-12 h-12 mx-auto text-red-400" />
                      <p className="text-red-400 text-sm mb-3">{error}</p>
                      <button
                        onClick={fetchQuestion}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                )}
                
                {/* React Markdown Rendering - LeetCode Style */}
                {question && (
                  <div className="p-6">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={MarkdownComponents}
                    >
                      {question}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            )}

            {activeTab === "report" && (
              <div ref={reportRef} className="h-full overflow-y-auto custom-scrollbar">
                {loading && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center space-y-3">
                      <Terminal className="w-8 h-8 animate-pulse mx-auto text-emerald-400" />
                      <p className="text-gray-300 text-sm">Executing Code...</p>
                    </div>
                  </div>
                )}
                
                {!report && !loading && (
                  <div className="flex items-center justify-center h-full p-6">
                    <div className="text-center space-y-4">
                      <Terminal className="w-16 h-16 mx-auto text-gray-500" />
                      <div>
                        <p className="text-lg text-gray-300 mb-2">No Results Yet</p>
                        <p className="text-gray-400 text-sm">Run your code to see execution results</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {report && (
                  <div className="p-6">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={MarkdownComponents}
                    >
                      {report}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Fixed Code Editor */}
        <div className="w-1/2 flex flex-col bg-gray-800/40">
          {/* Fixed Header */}
          <div className="bg-gray-800/60 backdrop-blur-sm border-b border-gray-700/50 p-4 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-bold text-gray-100">Code</h2>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={copyCode} 
                  title="Copy code"
                  className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/60 text-gray-300 hover:text-gray-200 transition-all"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button 
                  onClick={downloadCode} 
                  title="Download code"
                  className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/60 text-gray-300 hover:text-gray-200 transition-all"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => navigate("/ai/interview-coach/codequest/history")}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/60 text-gray-300 hover:text-gray-200 transition-all"
                >
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">History</span>
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-gray-700/60 border border-gray-600/50 rounded-lg px-3 py-1.5 text-gray-200 text-sm focus:border-cyan-500 focus:outline-none hover:bg-gray-600/60 transition-all duration-300"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang} value={lang} className="bg-gray-800">{lang}</option>
                ))}
              </select>
              <div className="text-xs text-gray-400">
                <kbd className="bg-gray-600/50 px-1.5 py-0.5 rounded text-xs">Ctrl+Enter</kbd> to run
              </div>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 bg-gray-900/80">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full p-4 bg-transparent text-gray-100 font-mono text-sm resize-none outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all duration-300 leading-relaxed placeholder-gray-500"
              style={{ 
                fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace", 
                lineHeight: "1.5" 
              }}
              spellCheck={false}
              placeholder="// Start coding your solution here...\n// Good luck! 🚀"
            />
          </div>

          {/* Fixed Action Bar */}
          <div className="bg-gray-800/60 backdrop-blur-sm border-t border-gray-700/50 p-4 flex items-center justify-between flex-shrink-0">
            <button 
              onClick={fetchQuestion} 
              disabled={questionLoading}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100"
            >
              {questionLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCcw className="w-4 h-4" />
                  New Problem
                </>
              )}
            </button>
            
            <div className="flex gap-2">
              <button 
                onClick={evaluate} 
                disabled={loading || !question}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-2 rounded-lg text-sm font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Run
                  </>
                )}
              </button>
              
              <button 
                onClick={handleNext} 
                disabled={loading || questionLoading}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.5) rgba(31, 41, 55, 0.3);
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.3);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.7);
        }
      `}</style>
    </div>
  );
};

export default Codequest;