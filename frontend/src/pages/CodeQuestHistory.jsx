import React, { useState, useEffect } from "react";
import {
  Clock,
  Trash2,
  Search,
  Calendar,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

const CollapsibleText = ({ text }) => {
  if (!text) return null;
  return (
    <pre className="font-mono text-sm whitespace-pre-wrap break-words bg-gray-950/70 border border-gray-700/40 rounded-lg p-4 shadow-inner text-gray-200 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
      {text}
    </pre>
  );
};

const QuestionDisplay = ({ question }) => {
  try {
    const formatted = JSON.stringify(JSON.parse(question), null, 2);
    return <CollapsibleText text={formatted} />;
  } catch {
    return <CollapsibleText text={question} />;
  }
};

const Tile = ({ title, color, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-4 py-3 bg-gray-900/70 hover:bg-gray-800/80 transition"
      >
        <span className={`text-sm font-semibold ${color}`}>{title}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>
      {open && <div className="p-4 bg-gray-950/60">{children}</div>}
    </div>
  );
};

const CodeQuestHistory = () => {
  const { getToken } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const backendUrl = "http://localhost:4000";

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

  // extract unique languages for sidebar
  const languages = [...new Set(history.map((h) => h.language).filter(Boolean))];

  const toggleLanguage = (lang) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const filteredHistory = history.filter((item) => {
    const matchesSearch = JSON.stringify(item.question)
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesLang =
      selectedLanguages.length === 0 || selectedLanguages.includes(item.language);

    return matchesSearch && matchesLang;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center text-gray-400">
          <Clock className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-400" />
          Loading submission history...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex">
      {/* Sidebar */}
      <div className="w-60 bg-gray-900/90 border-r border-gray-800 p-6 sticky top-0 h-screen">
        <h2 className="text-lg font-semibold text-white mb-4">Filter by Language</h2>
        <div className="space-y-2">
          {languages.length === 0 ? (
            <p className="text-gray-500 text-sm">No languages yet</p>
          ) : (
            languages.map((lang) => (
              <button
                key={lang}
                onClick={() => toggleLanguage(lang)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition ${
                  selectedLanguages.includes(lang)
                    ? "bg-blue-600/80 text-white"
                    : "bg-gray-800/60 text-gray-300 hover:bg-gray-700/60"
                }`}
              >
                {lang}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 z-10 shadow-md">
          <div className="p-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">Submission History</h1>
              <p className="text-gray-400 text-sm">
                {filteredHistory.length} submission
                {filteredHistory.length !== 1 ? "s" : ""} found
              </p>
            </div>
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search submissions..."
                className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Submissions List */}
        <div className="max-w-5xl mx-auto p-6 space-y-4">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-300">
                No submissions found
              </h3>
              <p className="text-gray-500 text-sm">
                {searchTerm || selectedLanguages.length > 0
                  ? "Try a different filter."
                  : "Your coding journey starts here! Submit your first solution."}
              </p>
            </div>
          ) : (
            filteredHistory.map((item, index) => {
              const isOpen = expanded === item._id;
              return (
                <div
                  key={item._id}
                  className="bg-gray-900/60 border border-gray-800 rounded-xl shadow hover:border-blue-500/40 transition"
                >
                  {/* Row Header */}
                  <div
                    className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-800/70"
                    onClick={() => setExpanded(isOpen ? null : item._id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-md flex items-center justify-center text-white text-xs font-bold">
                        {item.language?.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {item.language}
                        </p>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {item.submittedAt
                            ? new Date(item.submittedAt).toLocaleString()
                            : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-xs text-gray-500">
                        #{filteredHistory.length - index}
                      </p>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isOpen && (
                    <div className="p-6 space-y-4 border-t border-gray-800">
                      <Tile title="📘 Question" color="text-blue-400">
                        <QuestionDisplay question={item.question} />
                      </Tile>
                      <Tile title="💻 Solution Code" color="text-purple-400">
                        <CollapsibleText text={item.code} />
                      </Tile>
                      <Tile title="📝 Review Report" color="text-amber-400">
                        <CollapsibleText text={item.report} />
                      </Tile>

                      {/* Actions */}
                      <div className="flex justify-end pt-4">
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="flex items-center gap-2 text-red-400 hover:text-white text-sm font-semibold px-4 py-2 rounded-lg border border-red-500/40 hover:bg-red-500/20 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Submission
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeQuestHistory;
