import React, { useState, useEffect } from "react";
import { User, Search, BookOpen, Briefcase, LayoutGrid } from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast, { Toaster } from "react-hot-toast";

const Community = () => {
  const { isSignedIn, getToken } = useAuth();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

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

        if (res.data.success) {
          setUsers(res.data.data); // ✅ direct array set
        } else {
          toast.error("Failed to fetch community data");
        }
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
      u.skills?.some((s) =>
        s.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      u.headline?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        Loading community...
      </div>
    );
  }

  return (
    <div className="relative w-full h-[calc(93vh-56px)] p-6 bg-gray-900 text-gray-100">


      <h1 className="text-3xl font-bold mb-6 animate-fade-in">Community Feed</h1>

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
              {/* 🖼 Profile Header */}
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

              {/* 🛠 Skills */}
              <div>
                <h3 className="text-xs text-gray-400 mb-2 font-semibold flex items-center gap-1">
                  <LayoutGrid className="w-4 h-4" /> Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {u.skills?.length ? (
                    u.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-blue-600 text-gray-100 px-2 py-1 rounded-full text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-xs">
                      No skills added
                    </span>
                  )}
                </div>
              </div>

              {/* 📚 Projects */}
              <div>
                <h3 className="text-xs text-gray-400 mb-2 font-semibold flex items-center gap-1">
                  <BookOpen className="w-4 h-4" /> Projects
                </h3>
                <ul className="list-disc list-inside text-gray-300 text-sm max-h-24 overflow-y-auto">
                  {u.projects?.length ? (
                    u.projects.map((p, i) => <li key={i}>{p.title}</li>)
                  ) : (
                    <li className="text-gray-500 text-xs">No projects added</li>
                  )}
                </ul>
              </div>

              {/* 💼 Experience */}
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
                    <li className="text-gray-500 text-xs">
                      No experience added
                    </li>
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

export default Community;
