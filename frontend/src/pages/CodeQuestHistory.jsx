import React, { useState, useEffect } from "react";
import { Clock, Code, Trash2, ChevronDown, ChevronUp, Search, Calendar, FileText } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

// Collapsible Text Helper
const CollapsibleText = ({ text, charLimit = 700 }) => {
  const [expanded, setExpanded] = useState(false);
  if (!text) return null;
  const isLong = text.length > charLimit;
  return (
    <div className="relative group">
      <pre className="font-mono text-sm whitespace-pre-wrap break-words max-h-64 overflow-y-auto bg-gradient-to-br from-gray-950 to-gray-900 border border-gray-700/50 rounded-xl p-4 shadow-inner transition-all duration-200 hover:border-gray-600/50 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {expanded || !isLong ? text : text.slice(0, charLimit) + "..."}
      </pre>
      {isLong && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="absolute right-3 bottom-3 text-xs text-blue-400 hover:text-blue-300 bg-gray-800/90 hover:bg-gray-700/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-gray-600/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-lg"
        >
          {expanded ? (
            <>Show Less <ChevronUp className="inline w-3 h-3 ml-1" /></>
          ) : (
            <>Show More <ChevronDown className="inline w-3 h-3 ml-1" /></>
          )}
        </button>
      )}
    </div>
  );
};

// Pretty Print Question Section
const QuestionDisplay = ({ question }) => {
  let formatted;
  try {
    formatted = JSON.stringify(JSON.parse(question), null, 2);
    return <CollapsibleText text={formatted} charLimit={900} />;
  } catch {
    return <CollapsibleText text={question} charLimit={900} />;
  }
};

const CodeQuestHistory = () => {
  const { getToken } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const backendUrl = 'http://localhost:4000'

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = await getToken();
        const res = await axios.get(`${backendUrl}/api/codequest/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setHistory(res.data.submissions || []);
        }
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [getToken]);

  const handleDelete = async (id) => {
    try {
      const token = await getToken({ template: "standard" });
      await axios.delete(`${backendUrl}/api/codequest/history/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Failed to delete submission:", err);
    }
  };

  // Filter history based on search term
  const filteredHistory = history.filter((item) =>
    JSON.stringify(item.question).toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl mb-4 animate-pulse">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <div className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-ping opacity-20"></div>
          </div>
          <p className="text-gray-300 text-lg font-medium">Loading your submission history...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-gray-100">
      {/* Header */}
      <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700/50 z-10">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-2xl">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Submission History
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  {filteredHistory.length} submission{filteredHistory.length !== 1 ? 's' : ''} found
                </p>
              </div>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative max-w-lg">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search through your questions and solutions..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-800/50 text-gray-100 border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-200 placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-12 h-12 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No submissions found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {searchTerm ? "Try adjusting your search terms or clear the search to see all submissions." : "Your coding journey starts here! Submit your first solution to see it appear in your history."}
              </p>
            </div>
          ) : (
            filteredHistory.map((item, index) => (
              <div
                key={item._id}
                className="group bg-gradient-to-br from-gray-800/80 to-gray-800/40 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] overflow-hidden"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
                        <Code className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span className="font-bold text-lg text-gray-100 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                          {item.language}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="w-3 h-3 text-gray-500" />
                          <span className="text-sm text-gray-400">
                            {item.submittedAt ? new Date(item.submittedAt).toLocaleString() : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 font-medium">Submission #{filteredHistory.length - index}</div>
                    </div>
                  </div>

                  {/* Content Sections */}
                  <div className="space-y-6">
                    {/* Question */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">Question</h3>
                      </div>
                      <QuestionDisplay question={item.question} />
                    </div>

                    {/* Code */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider">Solution Code</h3>
                      </div>
                      <CollapsibleText text={item.code} charLimit={600} />
                    </div>

                    {/* Report */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Review Report</h3>
                      </div>
                      <CollapsibleText text={item.report} charLimit={700} />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end pt-6 border-t border-gray-700/50 mt-6">
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="group/btn flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-semibold px-4 py-2 rounded-lg border border-red-500/20 hover:border-red-500/40 hover:bg-red-500/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                    >
                      <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" />
                      Delete Submission
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeQuestHistory;