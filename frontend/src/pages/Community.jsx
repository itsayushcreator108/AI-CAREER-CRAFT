import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import {
  UserRound,
  PlusCircle,
  SendHorizonal,
  LogIn,
  Loader2,
} from "lucide-react"; // Lucide icons

// ------------------- Create Post Form -------------------
const CreatePostForm = ({ onPostSubmit, onCancel }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/users/profile", {
          headers: { Authorization: `Bearer ${await getToken()}` },
        });
        if (res.data.success) setUserData(res.data.user);
      } catch (err) {
        console.error("❌ Error fetching user profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [getToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("⚠️ Please fill out title and content.");
      return;
    }
    if (!userData) {
      alert("⚠️ User profile not found. Please login.");
      return;
    }
    const res = await axios.post("http://localhost:4000/api/posts", {
      author: userData.fullName,
      userId: `@${userData.clerkId}`,
      title,
      content,
    });
    onPostSubmit(res.data);
    setTitle("");
    setContent("");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-emerald-400 text-lg animate-pulse gap-2">
        <Loader2 className="animate-spin h-7 w-7" />
        Loading profile...
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-red-400 gap-3">
        <LogIn className="h-8 w-8 mb-2" />
        <p className="text-lg font-medium">⚠️ Could not fetch user profile. Please login.</p>
        <button
          onClick={onCancel}
          className="mt-6 px-8 py-3 border border-red-500 text-red-400 rounded-xl font-semibold hover:bg-red-900/40 transition-all duration-300 shadow-lg shadow-red-900 flex items-center gap-2"
        >
          <LogIn className="mr-2 h-5 w-5" /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative w-full h-[calc(93vh-56px)] p-6 font-sans text-gray-100 overflow-auto">
      <div className="max-w-2xl mx-auto pt-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-10 bg-gradient-to-r from-emerald-400 via-blue-400 to-teal-300 bg-clip-text text-transparent drop-shadow-lg flex items-center justify-center gap-2">
          <PlusCircle className="h-8 w-8 text-emerald-400 drop-shadow-md" />
          Create a New Post
        </h1>

        <div className="backdrop-blur-2xl bg-white/5 rounded-3xl shadow-2xl p-8 border border-white/20 hover:border-emerald-400/50 transition-all duration-300">
          <div className="text-center mb-8 flex flex-col items-center gap-1">
            <UserRound className="h-10 w-10 text-emerald-400 mb-2 drop-shadow-lg" />
            <p className="text-xl font-bold text-emerald-400">{userData.fullName}</p>
            <p className="text-gray-400">{`@${userData.clerkId}`}</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="title" className="block text-gray-300 font-semibold mb-2">
                Post Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-5 py-3 backdrop-blur-lg bg-slate-800/70 border border-emerald-500/30 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all duration-300 font-medium"
                placeholder="🚀 My First React Project"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="content" className="block text-gray-300 font-semibold mb-2">
                Post Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-5 py-3 backdrop-blur-lg bg-slate-800/70 border border-emerald-500/30 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all duration-300 font-medium"
                rows="6"
                placeholder="💡 Write your post..."
                required
              ></textarea>
            </div>
            <div className="flex justify-between space-x-6">
              <button
                type="button"
                onClick={onCancel}
                className="w-1/2 border-2 border-red-500 text-red-400 font-bold py-3 rounded-xl hover:bg-red-900/40 transition-all duration-300 shadow-md flex items-center justify-center gap-2"
              >
                <LogIn className="h-5 w-5" /> Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400 text-gray-900 font-bold py-3 rounded-xl hover:scale-105 hover:shadow-emerald-400/50 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
              >
                <SendHorizonal className="h-5 w-5" /> Post Now
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ------------------- Main Community App -------------------
const Community = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState("community");

  useEffect(() => {
    axios.get("http://localhost:4000/api/posts").then((res) => {
      setPosts(res.data);
    });
  }, []);

  const handleCreatePost = (newPost) => {
    setPosts([newPost, ...posts]);
    setCurrentPage("community");
  };

  if (currentPage === "create-post") {
    return (
      <CreatePostForm
        onPostSubmit={handleCreatePost}
        onCancel={() => setCurrentPage("community")}
      />
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-gray-100 relative w-full h-[calc(93vh-56px)] p-8 font-sans overflow-auto">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-10 bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-500 bg-clip-text text-transparent drop-shadow-lg tracking-wide flex items-center justify-center gap-3">
          <UserRound className="h-9 w-9 text-emerald-400 drop-shadow" />
          Community Wall
        </h1>
        <div className="mb-12 text-center">
          <button
            onClick={() => setCurrentPage("create-post")}
            className="bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400 text-gray-900 font-bold py-3 px-10 rounded-2xl hover:scale-105 hover:shadow-xl hover:shadow-emerald-400/40 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
          >
            <PlusCircle className="mr-1 h-6 w-6" /> Create Post
          </button>
        </div>
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          {posts.map((post) => (
            <div
              key={post.id}
              className="backdrop-blur-xl bg-gradient-to-br from-slate-800/80 via-slate-900/80 to-slate-800/80 rounded-3xl shadow-lg border border-white/10 hover:border-emerald-400/40 p-6 transition-all duration-300 hover:scale-[1.03] hover:shadow-emerald-400/30"
            >
              <div className="flex items-center mb-5">
                <div className="bg-gradient-to-br from-emerald-500/30 via-blue-500/20 to-teal-400/30 p-4 rounded-full mr-4 shadow-inner shadow-emerald-500/20 flex items-center justify-center">
                  <UserRound className="h-8 w-8 text-emerald-400" />
                </div>
                <div>
                  <p className="text-emerald-400 text-lg font-bold">{post.author}</p>
                  <span className="text-gray-400 text-sm">{post.userId}</span>
                  {post.date && <p className="text-gray-500 text-xs">{post.date}</p>}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-100 mb-3">{post.title}</h3>
              <p className="text-gray-300 text-base leading-relaxed">{post.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Community;
