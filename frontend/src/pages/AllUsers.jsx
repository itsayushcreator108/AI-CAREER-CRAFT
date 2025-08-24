// import React, { useState, useEffect } from "react";
// import { User, Search, BookOpen, Briefcase, LayoutGrid } from "lucide-react";
// import axios from "axios";
// import { useAuth } from "@clerk/clerk-react";
// import toast, { Toaster } from "react-hot-toast";

// const Community = () => {
//   const { isSignedIn, getToken } = useAuth();
//   const [users, setUsers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!isSignedIn) return;

//     const fetchUsers = async () => {
//       try {
//         const token = await getToken();
//         const res = await axios.get(
//           "http://localhost:4000/api/users/profile-alluser",
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         if (res.data.success) {
//           setUsers(res.data.data); // ✅ direct array set
//         } else {
//           toast.error("Failed to fetch community data");
//         }
//       } catch (err) {
//         console.error(err);
//         toast.error("Error fetching community data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, [isSignedIn, getToken]);

//   const filteredUsers = users.filter(
//     (u) =>
//       u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       u.skills?.some((s) =>
//         s.toLowerCase().includes(searchTerm.toLowerCase())
//       ) ||
//       u.headline?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen text-gray-400">
//         Loading community...
//       </div>
//     );
//   }

//   return (
//     <div className="relative w-full h-[calc(93vh-56px)] p-6 bg-gray-900 text-gray-100">


//       <h1 className="text-3xl font-bold mb-6 animate-fade-in">Community Feed</h1>

//       {/* 🔍 Search */}
//       <div className="mb-6 flex items-center gap-2">
//         <Search className="w-5 h-5 text-gray-400" />
//         <input
//           type="text"
//           placeholder="Search by name, skills, headline..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="flex-1 p-2 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none text-gray-100 shadow-inner"
//         />
//       </div>

//       {/* 👥 User Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredUsers.length === 0 ? (
//           <p className="text-gray-400 col-span-full text-center mt-10">
//             No users found.
//           </p>
//         ) : (
//           filteredUsers.map((u, idx) => (
//             <div
//               key={idx}
//               className="bg-gray-800 border border-gray-700 rounded-xl p-5 shadow-lg flex flex-col gap-4 transform transition-transform hover:scale-[1.02] hover:shadow-xl animate-fade-in-up"
//             >
//               {/* 🖼 Profile Header */}
//               <div className="flex items-center gap-4">
//                 <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center text-2xl font-bold text-gray-100">
//                   {u.photoImgUrl ? (
//                     <img
//                       src={u.photoImgUrl}
//                       alt={u.fullName}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : u.fullName ? (
//                     u.fullName[0].toUpperCase()
//                   ) : (
//                     <User className="w-6 h-6" />
//                   )}
//                 </div>
//                 <div>
//                   <h2 className="text-lg font-semibold">{u.fullName}</h2>
//                   <p className="text-gray-400 text-sm">
//                     {u.headline || "No headline"}
//                   </p>
//                   <p className="text-gray-500 text-xs">
//                     {u.location || "Unknown"}
//                   </p>
//                 </div>
//               </div>

//               {/* 🛠 Skills */}
//               <div>
//                 <h3 className="text-xs text-gray-400 mb-2 font-semibold flex items-center gap-1">
//                   <LayoutGrid className="w-4 h-4" /> Skills
//                 </h3>
//                 <div className="flex flex-wrap gap-2">
//                   {u.skills?.length ? (
//                     u.skills.map((skill, i) => (
//                       <span
//                         key={i}
//                         className="bg-blue-600 text-gray-100 px-2 py-1 rounded-full text-xs font-medium"
//                       >
//                         {skill}
//                       </span>
//                     ))
//                   ) : (
//                     <span className="text-gray-500 text-xs">
//                       No skills added
//                     </span>
//                   )}
//                 </div>
//               </div>

//               {/* 📚 Projects */}
//               <div>
//                 <h3 className="text-xs text-gray-400 mb-2 font-semibold flex items-center gap-1">
//                   <BookOpen className="w-4 h-4" /> Projects
//                 </h3>
//                 <ul className="list-disc list-inside text-gray-300 text-sm max-h-24 overflow-y-auto">
//                   {u.projects?.length ? (
//                     u.projects.map((p, i) => <li key={i}>{p.title}</li>)
//                   ) : (
//                     <li className="text-gray-500 text-xs">No projects added</li>
//                   )}
//                 </ul>
//               </div>

//               {/* 💼 Experience */}
//               <div>
//                 <h3 className="text-xs text-gray-400 mb-2 font-semibold flex items-center gap-1">
//                   <Briefcase className="w-4 h-4" /> Experience
//                 </h3>
//                 <ul className="list-disc list-inside text-gray-300 text-sm max-h-24 overflow-y-auto">
//                   {u.experience?.length ? (
//                     u.experience.map((e, i) => (
//                       <li key={i}>
//                         {e.role} at {e.company}
//                       </li>
//                     ))
//                   ) : (
//                     <li className="text-gray-500 text-xs">
//                       No experience added
//                     </li>
//                   )}
//                 </ul>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default Community;

import React, { useState, useEffect } from "react";
import {
  User,
  Search,
  BookOpen,
  Briefcase,
  LayoutGrid,
  Gamepad,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

const AllUsers = () => {
  const { isSignedIn, getToken } = useAuth();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showGame, setShowGame] = useState(false);

  // =================== MASTER QUESTIONS ===================
  const seedQuestions = [
    { q: "What does CPU stand for?", a: "Central Processing Unit" },
    { q: "Time complexity of Merge Sort?", a: "O(n log n)" },
    { q: "Father of Computer Science?", a: "Alan Turing" },
    { q: "React is primarily used for?", a: "Building UI" },
    { q: "HTTP stands for?", a: "HyperText Transfer Protocol" },
    { q: "Who coined AI?", a: "John McCarthy" },
    { q: "Big O complexity of Binary Search?", a: "O(log n)" },
    { q: "SQL expands to?", a: "Structured Query Language" },
    { q: "RAM stands for?", a: "Random Access Memory" },
    { q: "O(1) is also called?", a: "Constant Time" },
    { q: "HTML expands to?", a: "HyperText Markup Language" },
    { q: "Protocol for secure web?", a: "HTTPS" },
    { q: "First programming language?", a: "Fortran" },
    { q: "Creator of Python?", a: "Guido van Rossum" },
    { q: "Java is ______ typed?", a: "Statically" },
    { q: "Scheduling algo in OS avoiding starvation?", a: "Aging" },
    { q: "Page replacement algo in OS?", a: "LRU" },
    { q: "AI technique using backtracking search?", a: "DFS" },
    { q: "Complexity of Quick Sort avg case?", a: "O(n log n)" },
    { q: "Complexity of Quick Sort worst case?", a: "O(n^2)" },
    { q: "Which Normal Form removes transitive dependency?", a: "3NF" },
    { q: "Indexing improves ___?", a: "Query speed" },
    { q: "Protocol for email sending?", a: "SMTP" },
    { q: "Protocol for email reading?", a: "IMAP" },
    { q: "OSI Model has how many layers?", a: "7" },
    { q: "Which layer does IP exist in OSI?", a: "Network Layer" },
    { q: "TCP is ____ oriented?", a: "Connection" },
    { q: "UDP is ____ oriented?", a: "Connectionless" },
    { q: "Deadlock requires how many conditions?", a: "4" },
    { q: "Deadlock prevention method?", a: "Resource ordering" },
    { q: "ML algorithm for classification?", a: "Decision Tree" },
    { q: "ML technique for reducing dimensions?", a: "PCA" },
  ];

  // auto generate 2000
  const questions = Array.from({ length: 2000 }, (_, i) => {
    return {
      question: `Tech Question #${i + 1}: Lorem Ipsum Placeholder`,
      answer: `Answer ${i + 1}`,
    };
  });

  // replace some with real
  seedQuestions.forEach((item, i) => {
    questions[i] = { question: item.q, answer: item.a };
  });

  // 🎮 Game States
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);

  // ✅ Fetch community users
  useEffect(() => {
    if (!isSignedIn) return;
    const fetchUsers = async () => {
      try {
        const token = await getToken();
        const res = await axios.get(
          "http://localhost:4000/api/users/profile-alluser",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.data.success) setUsers(res.data.data);
        else toast.error("Failed to fetch community data");
      } catch (err) {
        console.error(err);
        toast.error("Error fetching community data");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [isSignedIn, getToken]);

  const filteredUsers = users.filter(
    (u) =>
      u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.skills?.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      u.headline?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🎮 Game logic
  const handleSubmit = () => {
    if (
      answer.trim().toLowerCase() ===
      questions[currentQ].answer.toLowerCase()
    ) {
      setFeedback("✅ Correct!");
    } else {
      setFeedback(`❌ Wrong! Correct: ${questions[currentQ].answer}`);
    }
  };
  const nextQuestion = () => {
    setAnswer("");
    setFeedback(null);
    setCurrentQ((prev) => Math.min(prev + 1, questions.length - 1));
  };

  // ================= GAME UI =================
  if (showGame) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-950 text-gray-100 px-4">
        <button
          onClick={() => setShowGame(false)}
          className="absolute top-6 left-6 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg shadow text-sm"
        >
          ⬅ Back
        </button>

        <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 animate-pulse">
          🚀 Bhayankar Tech Battle Arena
        </h1>

        <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 relative overflow-hidden">
          {/* Gradient particles */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500 opacity-20 blur-3xl rounded-full"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-500 opacity-20 blur-3xl rounded-full"></div>

          <h2 className="text-xl font-semibold text-blue-300 mb-6">
            Q{currentQ + 1} / {questions.length}: {questions[currentQ].question}
          </h2>

          <input
            type="text"
            placeholder="Type your answer..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full p-4 bg-gray-900 border border-gray-600 rounded-lg mb-6
                       focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 shadow-inner"
          />

          {!feedback ? (
            <button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 rounded-xl 
                         font-bold shadow-lg hover:scale-105 transition-transform"
            >
              Submit
            </button>
          ) : (
            <div>
              <p
                className={`mt-4 font-bold ${
                  feedback.includes("✅") ? "text-green-400" : "text-red-400"
                }`}
              >
                {feedback}
              </p>
              {currentQ < questions.length - 1 ? (
                <button
                  onClick={nextQuestion}
                  className="mt-6 bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-3 rounded-xl 
                             font-bold shadow-lg hover:scale-105 transition-transform"
                >
                  Next →
                </button>
              ) : (
                <p className="mt-6 text-yellow-400 font-bold">
                  🎉 Game Completed - You survived 2000 questions!
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ================ COMMUNITY UI =================
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        Loading community...
      </div>
    );
  }

  return (
    <div className="relative w-full h-[calc(93vh-56px)] p-6 bg-gray-900 text-gray-100 overflow-y-auto">
      <h1 className="text-3xl font-bold mb-6 animate-fade-in">Community Feed</h1>

      {/* 🎮 Game Button */}


      {/* 🔍 Search */}
      <div className="mb-6 flex items-center gap-2">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, skills, headline..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-2 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none text-gray-100 shadow-inner"
        />
      </div>

      {/* 👥 User Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.length === 0 ? (
          <p className="text-gray-400 col-span-full text-center mt-10">
            No users found.
          </p>
        ) : (
          filteredUsers.map((u, idx) => (
            <div
              key={idx}
              className="bg-gray-800 border border-gray-700 rounded-xl p-5 shadow-lg flex flex-col gap-4 transform transition-transform hover:scale-[1.02] hover:shadow-xl animate-fade-in-up"
            >
              {/* profile */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center text-2xl font-bold text-gray-100">
                  {u.photoImgUrl ? (
                    <img
                      src={u.photoImgUrl}
                      alt={u.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : u.fullName ? (
                    u.fullName[0].toUpperCase()
                  ) : (
                    <User className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{u.fullName}</h2>
                  <p className="text-gray-400 text-sm">
                    {u.headline || "No headline"}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {u.location || "Unknown"}
                  </p>
                </div>
              </div>
              {/* Skills */}
              <div>
                <h3 className="text-xs text-gray-400 mb-2 font-semibold flex items-center gap-1">
                  <LayoutGrid className="w-4 h-4" /> Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {u.skills?.length ? (
                    u.skills.map((s, i) => (
                      <span
                        key={i}
                        className="bg-blue-600 text-gray-100 px-2 py-1 rounded-full text-xs font-medium"
                      >
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-xs">No skills added</span>
                  )}
                </div>
              </div>
              {/* Projects */}
              <div>
                <h3 className="text-xs text-gray-400 mb-2 font-semibold flex items-center gap-1">
                  <BookOpen className="w-4 h-4" /> Projects
                </h3>
                <ul className="list-disc list-inside text-gray-300 text-sm max-h-24 overflow-y-auto">
                  {u.projects?.length ? (
                    u.projects.map((p, i) => <li key={i}>{p.title}</li>)
                  ) : (
                    <li className="text-gray-500 text-xs">No projects</li>
                  )}
                </ul>
              </div>
              {/* Experience */}
              <div>
                <h3 className="text-xs text-gray-400 mb-2 font-semibold flex items-center gap-1">
                  <Briefcase className="w-4 h-4" /> Experience
                </h3>
                <ul className="list-disc list-inside text-gray-300 text-sm max-h-24 overflow-y-auto">
                  {u.experience?.length ? (
                    u.experience.map((e, i) => (
                      <li key={i}>
                        {e.role} at {e.company}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500 text-xs">No experience</li>
                  )}
                </ul>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AllUsers;