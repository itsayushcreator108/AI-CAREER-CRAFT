import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Aitool() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const tools = [
    { name: "Resume Analyser", route: "/resume" },
    { name: "Job Matcher", route: "/jobs" },
    { name: "Skill Gap Analyser", route: "/skills" },
    { name: "AI Interview Coach", route: "/interview" },
    { name: "Portfolio Generator", route: "/portfolio" },
    { name: "Community", route: "/community" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
      {/* Background same as Hero.jsx */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#050505] via-[#0f172a] to-[#1f2937]" />
        <div className="absolute inset-0 opacity-25 bg-gradient-to-tr from-emerald-400/20 via-transparent to-cyan-400/20" />
        <div className="absolute inset-0 opacity-25 bg-gradient-to-bl from-cyan-500/20 via-transparent to-emerald-400/20" />
        <div
          className="absolute inset-0 opacity-40 transition-all duration-300"
          style={{
            background: `radial-gradient(500px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(16,255,180,0.15), transparent 40%)`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <h2 className="text-center text-4xl sm:text-5xl font-bold mb-12">
          <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
            AI Tools
          </span>
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool, index) => (
            <div
              key={index}
              onClick={() => navigate(tool.route)}
              className="cursor-pointer group bg-gray-900/40 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-8 shadow-lg shadow-emerald-500/10 transition transform hover:scale-105 hover:shadow-emerald-400/20"
            >
              <h3 className="text-2xl font-semibold mb-4 text-gray-200 group-hover:text-emerald-400 transition">
                {tool.name}
              </h3>
              <p className="text-gray-400">
                Explore the {tool.name} powered by AI.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
