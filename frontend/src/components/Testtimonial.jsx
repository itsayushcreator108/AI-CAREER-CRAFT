import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";

const Testimonial = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [fade, setFade] = useState(true);

  const testimonials = [
    {
      name: "Arjun Mehta",
      role: "Software Engineer",
      text: "AI Career OS helped me optimize my resume and land interviews at top companies. The AI tools are simply next-level!",
      img: "https://ui-avatars.com/api/?name=Arjun+Mehta&background=0D8ABC&color=fff",
      rating: 5,
    },
    {
      name: "Sneha Sharma",
      role: "Data Analyst",
      text: "The Job Matcher and Skill Gap Analyser guided me towards the right opportunities and courses. Game changer!",
      img: "https://ui-avatars.com/api/?name=Sneha+Sharma&background=10B981&color=fff",
      rating: 4,
    },
    {
      name: "Ravi Patel",
      role: "Full Stack Developer",
      text: "The AI Interview Coach gave me real confidence. I cracked my dream role thanks to AI Career OS!",
      img: "https://ui-avatars.com/api/?name=Ravi+Patel&background=F59E0B&color=fff",
      rating: 5,
    },
    {
      name: "Neha Kapoor",
      role: "Product Manager",
      text: "Portfolio Generator made my profile shine. Recruiters reached out within a week!",
      img: "https://ui-avatars.com/api/?name=Neha+Kapoor&background=EC4899&color=fff",
      rating: 4,
    },
    {
      name: "Karan Singh",
      role: "ML Engineer",
      text: "AI Career OS community is amazing. I connected with peers, mentors, and learned cutting-edge AI skills.",
      img: "https://ui-avatars.com/api/?name=Karan+Singh&background=6366F1&color=fff",
      rating: 5,
    },
    {
      name: "Aditi Verma",
      role: "UX Designer",
      text: "From skill gap analysis to interview prep, this platform truly feels like an AI-powered career companion.",
      img: "https://ui-avatars.com/api/?name=Aditi+Verma&background=EF4444&color=fff",
      rating: 5,
    },
  ];

  // ✅ Smooth Auto Slide with Fade
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        setFade(true);
      }, 500);
    }, 1000);

    return () => clearInterval(interval);
  }, [isHovered, testimonials.length]);

  // Background cursor effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-20 px-4 sm:px-6 lg:px-8"
    >
      {/* Background */}
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

      <div className="relative z-10 max-w-5xl w-full">
        <h2 className="text-center text-4xl sm:text-5xl font-bold mb-12">
          <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
            What People Say
          </span>
        </h2>

        {/* ✅ Testimonial Card with Smooth Fade */}
        <article
          key={currentIndex}
          className={`bg-gray-900/40 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-10 shadow-lg shadow-emerald-500/10 transition-opacity duration-500 ease-in-out ${
            fade ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="text-gray-300 italic mb-8 text-xl leading-relaxed text-center">
            “{testimonials[currentIndex].text}”
          </p>
          <div className="flex justify-center mb-6">
            {Array.from({ length: testimonials[currentIndex].rating }).map((_, idx) => (
              <FaStar key={idx} className="text-yellow-400 text-2xl mx-1" />
            ))}
          </div>
          <div className="flex items-center justify-center gap-5">
            <img
              src={testimonials[currentIndex].img}
              alt={testimonials[currentIndex].name}
              className="w-16 h-16 rounded-full border border-emerald-400/40 shadow-md"
            />
            <div>
              <h3 className="text-xl font-semibold text-emerald-400">
                {testimonials[currentIndex].name}
              </h3>
              <p className="text-gray-400 text-sm">{testimonials[currentIndex].role}</p>
            </div>
          </div>
        </article>

        {/* Navigation Dots */}
        <nav aria-label="Testimonials navigation" className="flex justify-center mt-8 gap-3">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-current={idx === currentIndex}
              className={`w-4 h-4 rounded-full transition-colors border-2 border-emerald-400 ${
                idx === currentIndex ? "bg-emerald-400" : "bg-transparent hover:bg-emerald-600"
              }`}
              type="button"
            />
          ))}
        </nav>

        {/* ✅ Stats & Ratings Section */}
        <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          <div className="p-6 bg-gray-900/30 border border-gray-700 rounded-2xl shadow-lg hover:scale-105 transition">
            <h3 className="text-4xl font-extrabold text-emerald-400">4.8/5</h3>
            <p className="text-gray-400">Average Rating</p>
          </div>
          <div className="p-6 bg-gray-900/30 border border-gray-700 rounded-2xl shadow-lg hover:scale-105 transition">
            <h3 className="text-4xl font-extrabold text-cyan-400">10k+</h3>
            <p className="text-gray-400">Users Helped</p>
          </div>
          <div className="p-6 bg-gray-900/30 border border-gray-700 rounded-2xl shadow-lg hover:scale-105 transition">
            <h3 className="text-4xl font-extrabold text-emerald-400">95%</h3>
            <p className="text-gray-400">Success Rate</p>
          </div>
          <div className="p-6 bg-gray-900/30 border border-gray-700 rounded-2xl shadow-lg hover:scale-105 transition">
            <h3 className="text-4xl font-extrabold text-cyan-400">500+</h3>
            <p className="text-gray-400">Companies Hired</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
