import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  FileText,
  Download,
  Eye,
  User,
  Palette,
  Monitor,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Globe,
  Loader2,
} from "lucide-react";

// Mocking external libraries for a self-contained canvas environment
const toast = {
  success: (message) => console.log("Toast Success:", message),
  error: (message) => console.log("Toast Error:", message),
};
const Toaster = () => null;
const useAuth = () => ({
  isSignedIn: true,
  userId: "mock-user-id",
  getToken: async () => "mock-token",
});
const useUser = () => ({
  user: {
    id: "mock-user-id",
  },
});

/**
 * A simple loading spinner component.
 * @returns {JSX.Element} The loading spinner.
 */
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-4">
    <Loader2 className="animate-spin h-6 w-6 text-white" />
    <span className="ml-2 text-white">Loading...</span>
  </div>
);

/**
 * The main component for the portfolio generator application.
 * It handles all state, form input, template selection, and preview/download logic.
 * @returns {JSX.Element} The main application interface.
 */
const PortfolioGenerator = () => {
  // Mocking Clerk authentication for a self-contained app
  const { isSignedIn, userId, getToken } = useAuth();
  const { user } = useUser();

  // State to manage form data
  const [formData, setFormData] = useState({
    resume: null,
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    about: "",
    skills: "",
    projects: "",
    education: "",
    experience: "",
    github: "",
    linkedin: "",
    website: "",
  });

  // UI state variables
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [activeTemplate, setActiveTemplate] = useState("modern");
  const [showPreview, setShowPreview] = useState(false);

  // Array of available templates with their properties
  const templates = [
    { id: "modern", name: "Modern", icon: Monitor, color: "emerald" },
    { id: "creative", name: "Creative", icon: Palette, color: "purple" },
    {
      id: "professional",
      name: "Professional",
      icon: Briefcase,
      color: "blue",
    },
  ];

  /**
   * Handles changes to form inputs, including text and file inputs.
   * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e The event object.
   */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const newValue = files ? files[0] : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  /**
   * Handles form submission, sets up the preview, and attempts to save to a backend.
   * NOTE: The backend save functionality is mocked to prevent errors in this environment.
   * @param {React.FormEvent} e The form event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    setPreview(formData);
    setShowPreview(true);

    if (!user) {
      toast.error("Please sign in first to save your portfolio!");
      return;
    }

    setLoading(true);
    try {
      // NOTE: This API call is commented out as it requires a specific backend setup.
      // It's here to show the intended functionality.

      const token = await getToken();
      const payload = new FormData();
      payload.append("userId", user.id);
      Object.keys(formData).forEach((key) => {
        if (formData[key]) payload.append(key, formData[key]);
      });

      const response = await axios.post(
        "http://localhost:4000/api/portfolio/create",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success("Portfolio saved successfully!");
      } else {
        toast.error("Failed to save portfolio!");
      }

      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      toast.success("Portfolio data is ready for preview and download!");
    } catch (err) {
      toast.error(err?.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Generates and downloads a static HTML file of the selected portfolio template.
   */
  const downloadPortfolio = () => {
    const portfolioHTML = generatePortfolioHTML();
    const blob = new Blob([portfolioHTML], { type: "text/html" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${
      formData.name || "portfolio"
    }-${activeTemplate}-portfolio.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  /**
   * Generates the full HTML content for the selected template.
   * @returns {string} The complete HTML string.
   */
  const generatePortfolioHTML = () => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${formData.name} - Portfolio</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: 'Inter', sans-serif; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .animate-fade-in { animation: fadeIn 0.6s ease-in-out; }
    .animate-slide-up { animation: slideUp 0.8s ease-out; }
  </style>
</head>
<body class="bg-slate-900 text-white">
  ${getTemplateHTML()}
</body>
</html>
`;
  };

  /**
   * Retrieves the HTML string for the active template.
   * @returns {string} The HTML string for the current template.
   */
  const getTemplateHTML = () => {
    switch (activeTemplate) {
      case "modern":
        return getModernTemplate();
      case "creative":
        return getCreativeTemplate();
      case "professional":
        return getProfessionalTemplate();
      default:
        return getModernTemplate();
    }
  };

  // Helper functions to generate static HTML for each template
  const getModernTemplate = () => `
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 font-sans text-gray-100">
    <main class="relative z-[10]">
      <section id="about" class="pt-24 pb-16 max-w-7xl mx-auto px-6 text-center">
        <h1 class="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">${
          formData.name || "Your Name"
        }</h1>
        <h2 class="text-2xl md:text-3xl text-gray-300 mb-8">${
          formData.title || "Your Title"
        }</h2>
        <p class="text-lg text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">${
          formData.about || "Your professional summary will appear here."
        }</p>
        <div class="flex justify-center space-x-6">
          ${
            formData.email
              ? `<a href="mailto:${formData.email}" class="bg-emerald-500 hover:bg-emerald-600 px-8 py-3 rounded-lg font-semibold transition text-gray-900">Contact Me</a>`
              : ""
          }
          ${
            formData.github
              ? `<a href="${formData.github}" target="_blank" class="border border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white px-8 py-3 rounded-lg font-semibold transition">GitHub</a>`
              : ""
          }
        </div>
      </section>
  
      <div class="bg-slate-800/50">
        <section id="skills" class="py-16 max-w-7xl mx-auto px-6">
          <h2 class="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">Skills</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            ${formData.skills
              .split(",")
              .filter((s) => s.trim())
              .map(
                (s) => `
              <div class="bg-slate-700 rounded-lg p-4 text-center hover:bg-slate-600 transition animate-slide-up">
                <span class="font-medium">${s.trim()}</span>
              </div>
            `
              )
              .join("")}
          </div>
        </section>
      </div>
  
      <section id="projects" class="py-16 max-w-7xl mx-auto px-6">
        <h2 class="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">Projects</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          ${formData.projects
            .split("\n")
            .filter((p) => p.trim())
            .map(
              (p) => `
            <div class="bg-slate-800 rounded-xl p-6 hover:bg-slate-700 transition animate-slide-up">
              <h3 class="text-xl font-bold mb-3 text-emerald-400">Project</h3>
              <p class="text-gray-300 leading-relaxed">${p.trim()}</p>
            </div>
          `
            )
            .join("")}
        </div>
      </section>
  
      <div class="bg-slate-800/50">
        <section id="experience" class="py-16 max-w-7xl mx-auto px-6">
          <h2 class="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">Experience</h2>
          <div class="space-y-8">
            ${formData.experience
              .split("\n")
              .filter((e) => e.trim())
              .map(
                (e) => `
              <div class="bg-slate-800 rounded-xl p-6 animate-slide-up">
                <p class="text-gray-300 leading-relaxed">${e.trim()}</p>
              </div>
            `
              )
              .join("")}
          </div>
        </section>
      </div>
  
      <section id="education" class="py-16 max-w-7xl mx-auto px-6">
        <h2 class="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">Education</h2>
        <div class="space-y-8">
          ${formData.education
            .split("\n")
            .filter((e) => e.trim())
            .map(
              (e) => `
            <div class="bg-slate-800 rounded-xl p-6 animate-slide-up">
              <p class="text-gray-300 leading-relaxed">${e.trim()}</p>
            </div>
          `
            )
            .join("")}
        </div>
      </section>
  
      <div class="bg-slate-800/50">
        <section id="contact" class="py-16 max-w-7xl mx-auto px-6 text-center">
          <h2 class="text-4xl font-bold mb-12 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">Get In Touch</h2>
          <div class="flex flex-wrap justify-center space-x-6 space-y-4 mb-8 text-lg">
            ${
              formData.email
                ? `<a href="mailto:${formData.email}" class="hover:text-emerald-400 transition block">📧 ${formData.email}</a>`
                : ""
            }
            ${
              formData.phone
                ? `<a href="tel:${formData.phone}" class="hover:text-emerald-400 transition block">📱 ${formData.phone}</a>`
                : ""
            }
            ${
              formData.location
                ? `<span class="flex items-center space-x-2 justify-center hover:text-emerald-400 transition"><span>📍</span> <span>${formData.location}</span></span>`
                : ""
            }
          </div>
          <div class="flex justify-center space-x-6">
            ${
              formData.github
                ? `<a href="${formData.github}" target="_blank" class="bg-slate-700 hover:bg-slate-600 p-3 rounded-lg transition">GitHub</a>`
                : ""
            }
            ${
              formData.linkedin
                ? `<a href="${formData.linkedin}" target="_blank" class="bg-slate-700 hover:bg-slate-600 p-3 rounded-lg transition">LinkedIn</a>`
                : ""
            }
            ${
              formData.website
                ? `<a href="${formData.website}" target="_blank" class="bg-slate-700 hover:bg-slate-600 p-3 rounded-lg transition">Website</a>`
                : ""
            }
          </div>
        </section>
      </div>
    </main>
    
    <footer class="py-8 text-center text-gray-400 border-t border-slate-700">
      <p>&copy; 2025 ${formData.name || "Your Name"}. All rights reserved.</p>
    </footer>
  </div>
  `;
  const getCreativeTemplate = () => `
<div class="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-pink-900 font-mono text-white">
  <header class="py-12 text-center border-b border-pink-700">
    <h1 class="text-6xl font-extrabold mb-2 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">${
      formData.name || "Your Name"
    }</h1>
    <h2 class="text-2xl text-pink-300 mb-8">${
      formData.title || "Your Creative Role"
    }</h2>
    <p class="max-w-3xl mx-auto text-pink-200 px-4">${
      formData.about || "Tell the world what makes you unique and creative."
    }</p>
  </header>
  <main class="max-w-6xl mx-auto py-16 px-6">
    <section id="skills" class="mb-12">
      <h2 class="text-4xl font-bold mb-6 text-pink-300">Skills</h2>
      <div class="flex flex-wrap justify-center gap-4">
        ${formData.skills
          .split(",")
          .filter((s) => s.trim())
          .map(
            (s) =>
              `<span class="bg-pink-600/80 text-white rounded-full px-5 py-2 text-sm font-semibold shadow">${s.trim()}</span>`
          )
          .join("")}
      </div>
    </section>
    <section id="projects" class="mb-12">
      <h2 class="text-4xl font-bold mb-6 text-pink-300">Projects</h2>
      ${formData.projects
        .split("\n")
        .filter((p) => p.trim())
        .map(
          (p) => `
        <article class="bg-pink-800/40 p-6 rounded-xl mb-4 shadow-lg hover:bg-pink-700 transition">
          <h3 class="text-xl font-bold mb-2 text-pink-100">Project</h3>
          <p>${p.trim()}</p>
        </article>
      `
        )
        .join("")}
    </section>
    <section id="experience" class="mb-12">
      <h2 class="text-4xl font-bold mb-6 text-pink-300">Experience</h2>
      ${formData.experience
        .split("\n")
        .filter((e) => e.trim())
        .map(
          (e) =>
            `<p class="mb-3 leading-relaxed border-l-4 border-pink-400 pl-4">${e.trim()}</p>`
        )
        .join("")}
    </section>
    <section id="education" class="mb-12">
      <h2 class="text-4xl font-bold mb-6 text-pink-300">Education</h2>
      ${formData.education
        .split("\n")
        .filter((e) => e.trim())
        .map(
          (e) =>
            `<p class="mb-3 leading-relaxed border-l-4 border-pink-400 pl-4">${e.trim()}</p>`
        )
        .join("")}
    </section>
    <section id="contact" class="text-center">
      <h2 class="text-4xl font-bold mb-6 text-pink-300">Get In Touch</h2>
      <div class="flex flex-col space-y-3 items-center mb-8">
        ${
          formData.email
            ? `<a href="mailto:${formData.email}" class="hover:underline">📧 ${formData.email}</a>`
            : ""
        }
        ${
          formData.phone
            ? `<a href="tel:${formData.phone}" class="hover:underline">📱 ${formData.phone}</a>`
            : ""
        }
        ${formData.location ? `<p>📍 ${formData.location}</p>` : ""}
      </div>
      <div class="flex justify-center space-x-6">
        ${
          formData.github
            ? `<a href="${formData.github}" class="hover:underline">GitHub</a>`
            : ""
        }
        ${
          formData.linkedin
            ? `<a href="${formData.linkedin}" class="hover:underline">LinkedIn</a>`
            : ""
        }
        ${
          formData.website
            ? `<a href="${formData.website}" class="hover:underline">Website</a>`
            : ""
        }
      </div>
    </section>
  </main>
  <footer class="py-8 text-center text-pink-400 border-t border-pink-700">
    <p>&copy; 2025 ${formData.name || "Your Name"}. All rights reserved.</p>
  </footer>
</div>
`;

  const getProfessionalTemplate = () => `
<div class="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-900 font-sans text-center text-white">
  <header class="py-20 border-b border-indigo-700">
    <h1 class="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">${
      formData.name || "Your Name"
    }</h1>
    <h2 class="text-3xl text-indigo-300 mb-4">${
      formData.title || "Professional Title"
    }</h2>
    <p class="max-w-3xl mx-auto px-4 leading-relaxed">${
      formData.about || "A professional summary about your expertise and goals."
    }</p>
  </header>
  <main class="max-w-5xl mx-auto py-20 px-6 grid grid-cols-1 md:grid-cols-2 gap-16 text-left">
    <section id="experience">
      <h2 class="text-4xl font-bold mb-8 text-indigo-300">Experience</h2>
      ${formData.experience
        .split("\n")
        .filter((e) => e.trim())
        .map(
          (e) => `
        <article class="mb-6 p-4 bg-indigo-800 rounded-md shadow-md">
          <p>${e.trim()}</p>
        </article>
      `
        )
        .join("")}
    </section>
    <section id="education">
      <h2 class="text-4xl font-bold mb-8 text-indigo-300">Education</h2>
      ${formData.education
        .split("\n")
        .filter((e) => e.trim())
        .map(
          (e) => `
        <article class="mb-6 p-4 bg-indigo-800 rounded-md shadow-md">
          <p>${e.trim()}</p>
        </article>
      `
        )
        .join("")}
    </section>
    <section id="skills" class="md:col-span-2">
      <h2 class="text-4xl font-bold mb-6 text-indigo-300 text-center">Skills</h2>
      <div class="flex flex-wrap justify-center gap-3">
        ${formData.skills
          .split(",")
          .filter((s) => s.trim())
          .map(
            (s) =>
              `<span class="bg-indigo-700 rounded-full text-white px-5 py-2 font-semibold shadow">${s.trim()}</span>`
          )
          .join("")}
      </div>
    </section>
    <section id="projects" class="md:col-span-2">
      <h2 class="text-4xl font-bold mb-6 text-indigo-300 text-center">Projects</h2>
      ${formData.projects
        .split("\n")
        .filter((p) => p.trim())
        .map(
          (p) => `
        <article class="mb-6 p-6 bg-indigo-800 rounded-lg shadow hover:bg-indigo-700 transition">
          <h3 class="text-xl font-semibold mb-2 text-indigo-200">Project</h3>
          <p>${p.trim()}</p>
        </article>
      `
        )
        .join("")}
    </section>
    <section id="contact" class="md:col-span-2 text-center mt-12">
      <h2 class="text-4xl font-bold mb-6 text-indigo-300">Get In Touch</h2>
      <div class="flex justify-center gap-8 mb-6 text-lg flex-wrap">
        ${
          formData.email
            ? `<a href="mailto:${formData.email}" class="hover:text-indigo-400 transition">📧 ${formData.email}</a>`
            : ""
        }
        ${
          formData.phone
            ? `<a href="tel:${formData.phone}" class="hover:text-indigo-400 transition">📱 ${formData.phone}</a>`
            : ""
        }
        ${
          formData.location
            ? `<span class="flex items-center space-x-2 justify-center hover:text-indigo-400 transition"><span>📍</span><span>${formData.location}</span></span>`
            : ""
        }
      </div>
      <div class="flex justify-center space-x-8">
        ${
          formData.github
            ? `<a href="${formData.github}" class="px-4 py-2 bg-indigo-700 rounded-lg hover:bg-indigo-600">GitHub</a>`
            : ""
        }
        ${
          formData.linkedin
            ? `<a href="${formData.linkedin}" class="px-4 py-2 bg-indigo-700 rounded-lg hover:bg-indigo-600">LinkedIn</a>`
            : ""
        }
        ${
          formData.website
            ? `<a href="${formData.website}" class="px-4 py-2 bg-indigo-700 rounded-lg hover:bg-indigo-600">Website</a>`
            : ""
        }
      </div>
    </section>
  </main>
  <footer class="py-8 border-t border-indigo-700 text-indigo-400 text-center">
    <p>&copy; 2025 ${formData.name || "Your Name"}. All rights reserved.</p>
  </footer>
</div>
`;

  // React Preview Components
  const ModernPreview = () => (
    <div className="min-h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 font-sans">
      <header className="bg-slate-800/80 backdrop-blur-sm p-6 border-b border-slate-700 fixed top-0 w-full z-30">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
            {preview?.name || "Your Name"}
          </h1>
          <nav className="hidden md:flex space-x-8 text-sm">
            <a
              href="#about"
              className="hover:text-emerald-400 transition cursor-pointer"
            >
              About
            </a>
            <a
              href="#skills"
              className="hover:text-emerald-400 transition cursor-pointer"
            >
              Skills
            </a>
            <a
              href="#projects"
              className="hover:text-emerald-400 transition cursor-pointer"
            >
              Projects
            </a>
            <a
              href="#experience"
              className="hover:text-emerald-400 transition cursor-pointer"
            >
              Experience
            </a>
            <a
              href="#education"
              className="hover:text-emerald-400 transition cursor-pointer"
            >
              Education
            </a>
            <a
              href="#contact"
              className="hover:text-emerald-400 transition cursor-pointer"
            >
              Contact
            </a>
          </nav>
        </div>
      </header>
      <section
        id="about"
        className="pt-28 pb-16 max-w-7xl mx-auto px-6 text-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 bg-clip-text text-transparent"
        >
          {preview?.name || "Your Name"}
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="text-2xl md:text-3xl text-gray-300 mb-8"
        >
          {preview?.title || "Your Professional Title"}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-lg text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          {preview?.about || "Your professional summary will appear here..."}
        </motion.p>
      </section>
      {preview?.skills && (
        <section id="skills" className="py-16 bg-slate-800/50">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
            Skills
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-6xl mx-auto px-6">
            {preview.skills.split(",").map((skill, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-700 rounded-lg p-4 text-center hover:bg-slate-600 transition"
              >
                <span className="font-medium">{skill.trim()}</span>
              </motion.div>
            ))}
          </div>
        </section>
      )}
      {preview?.projects && (
        <section id="projects" className="py-16 px-6 max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
            Projects
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {preview.projects
              .split("\n")
              .filter((p) => p.trim())
              .map((project, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.2 }}
                  className="bg-slate-800 rounded-xl p-6 hover:bg-slate-700 transition"
                >
                  <h3 className="text-xl font-bold mb-3 text-emerald-400">
                    Project {idx + 1}
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    {project.trim()}
                  </p>
                </motion.div>
              ))}
          </div>
        </section>
      )}
      {preview?.experience && (
        <section id="experience" className="py-16 bg-slate-800/50">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
            Experience
          </h2>
          <div className="space-y-8 max-w-6xl mx-auto px-6">
            {preview.experience
              .split("\n")
              .filter((e) => e.trim())
              .map((exp, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.2 }}
                  className="bg-slate-800 rounded-xl p-6"
                >
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {exp.trim()}
                  </p>
                </motion.div>
              ))}
          </div>
        </section>
      )}
      {preview?.education && (
        <section id="education" className="py-16 px-6 max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
            Education
          </h2>
          <div className="space-y-8">
            {preview.education
              .split("\n")
              .filter((e) => e.trim())
              .map((edu, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.2 }}
                  className="bg-slate-800 rounded-xl p-6"
                >
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {edu.trim()}
                  </p>
                </motion.div>
              ))}
          </div>
        </section>
      )}
      <section id="contact" className="py-16 bg-slate-800/50 text-center">
        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
          Get In Touch
        </h2>
        <div className="flex justify-center space-x-6 mb-8 text-sm flex-wrap justify-center gap-6">
          {preview?.email && (
            <div className="flex items-center space-x-2 hover:text-emerald-400 transition">
              <Mail className="w-4 h-4" />
              <span>{preview.email}</span>
            </div>
          )}
          {preview?.phone && (
            <div className="flex items-center space-x-2 hover:text-emerald-400 transition">
              <Phone className="w-4 h-4" />
              <span>{preview.phone}</span>
            </div>
          )}
          {preview?.location && (
            <div className="flex items-center space-x-2 hover:text-emerald-400 transition">
              <MapPin className="w-4 h-4" />
              <span>{preview.location}</span>
            </div>
          )}
        </div>
        <div className="flex justify-center space-x-4">
          {preview?.github && (
            <a
              href={preview.github}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-700 hover:bg-slate-600 p-2 rounded-lg transition"
            >
              <Github className="w-5 h-5" />
            </a>
          )}
          {preview?.linkedin && (
            <a
              href={preview.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-700 hover:bg-slate-600 p-2 rounded-lg transition"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          )}
          {preview?.website && (
            <a
              href={preview.website}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-700 hover:bg-slate-600 p-2 rounded-lg transition"
            >
              <Globe className="w-5 h-5" />
            </a>
          )}
        </div>
      </section>
      <footer className="py-8 text-center text-gray-400 border-t border-slate-700">
        <p>&copy; 2025 {preview?.name || "Your Name"}. All rights reserved.</p>
      </footer>
    </div>
  );

  const CreativePreview = () => (
    <div className="min-h-full bg-gradient-to-br from-purple-900 via-slate-900 to-pink-900 font-mono text-white">
      <header className="py-12 text-center border-b border-pink-700">
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-6xl font-extrabold mb-2 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"
        >
          {preview?.name || "Your Name"}
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="text-2xl text-pink-300 mb-8"
        >
          {preview?.title || "Your Creative Role"}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="max-w-3xl mx-auto text-pink-200 px-4"
        >
          {preview?.about ||
            "Tell the world what makes you unique and creative."}
        </motion.p>
      </header>
      <main className="max-w-6xl mx-auto py-16 px-6 font-mono">
        {preview?.skills && (
          <section id="skills" className="mb-12">
            <h2 className="text-4xl font-bold mb-6 text-pink-300">Skills</h2>
            <motion.div
              initial="hidden"
              animate="visible"
              className="flex flex-wrap justify-center gap-4"
            >
              {preview.skills.split(",").map((skill, idx) => (
                <motion.span
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ delay: 0.1 * idx }}
                  className="bg-pink-600/80 text-white rounded-full px-5 py-2 text-sm font-semibold shadow cursor-default select-none"
                >
                  {skill.trim()}
                </motion.span>
              ))}
            </motion.div>
          </section>
        )}
        {preview?.projects && (
          <section id="projects" className="mb-12">
            <h2 className="text-4xl font-bold mb-6 text-pink-300">Projects</h2>
            {preview.projects
              .split("\n")
              .filter((p) => p.trim())
              .map((project, idx) => (
                <motion.article
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.2 }}
                  className="bg-pink-800/40 p-6 rounded-xl mb-4 shadow-lg hover:bg-pink-700 transition"
                >
                  <h3 className="text-xl font-bold mb-2 text-pink-100">
                    Project {idx + 1}
                  </h3>
                  <p className="text-sm">{project.trim()}</p>
                </motion.article>
              ))}
          </section>
        )}
        {preview?.experience && (
          <section id="experience" className="mb-12">
            <h2 className="text-4xl font-bold mb-6 text-pink-300">
              Experience
            </h2>
            {preview.experience
              .split("\n")
              .filter((e) => e.trim())
              .map((exp, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.2 }}
                  className="mb-3 leading-relaxed border-l-4 border-pink-400 pl-4"
                >
                  <p className="text-sm">{exp.trim()}</p>
                </motion.div>
              ))}
          </section>
        )}
        {preview?.education && (
          <section id="education" className="mb-12">
            <h2 className="text-4xl font-bold mb-6 text-pink-300">Education</h2>
            {preview.education
              .split("\n")
              .filter((e) => e.trim())
              .map((edu, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.2 }}
                  className="mb-3 leading-relaxed border-l-4 border-pink-400 pl-4"
                >
                  <p className="text-sm">{edu.trim()}</p>
                </motion.div>
              ))}
          </section>
        )}
        <section id="contact" className="text-center">
          <h2 className="text-4xl font-bold mb-6 text-pink-300">
            Get In Touch
          </h2>
          <div className="flex flex-col space-y-3 items-center mb-8">
            {preview?.email && (
              <a href={`mailto:${preview.email}`} className="hover:underline">
                <span className="flex items-center space-x-2">
                  <Mail />
                  <span>{preview.email}</span>
                </span>
              </a>
            )}
            {preview?.phone && (
              <a href={`tel:${preview.phone}`} className="hover:underline">
                <span className="flex items-center space-x-2">
                  <Phone />
                  <span>{preview.phone}</span>
                </span>
              </a>
            )}
            {preview?.location && (
              <div className="flex items-center space-x-2">
                <MapPin />
                <span>{preview.location}</span>
              </div>
            )}
          </div>
          <div className="flex justify-center space-x-6">
            {preview?.github && (
              <a
                href={preview.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-400 transition"
              >
                <Github />
              </a>
            )}
            {preview?.linkedin && (
              <a
                href={preview.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-400 transition"
              >
                <Linkedin />
              </a>
            )}
            {preview?.website && (
              <a
                href={preview.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-400 transition"
              >
                <Globe />
              </a>
            )}
          </div>
        </section>
      </main>
      <footer className="py-8 text-center text-pink-400 border-t border-pink-700">
        <p>&copy; 2025 {preview?.name || "Your Name"}. All rights reserved.</p>
      </footer>
    </div>
  );

  const ProfessionalPreview = () => (
    <div className="min-h-full bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-900 font-sans text-white">
      <header className="py-20 border-b border-indigo-700 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent"
        >
          {preview?.name || "Your Name"}
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-3xl text-indigo-300 mb-4"
        >
          {preview?.title || "Professional Title"}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="max-w-3xl mx-auto px-4 leading-relaxed"
        >
          {preview?.about ||
            "A professional summary about your expertise and goals."}
        </motion.p>
      </header>
      <main className="max-w-5xl mx-auto py-20 px-6 grid grid-cols-1 md:grid-cols-2 gap-16 text-left">
        {preview?.experience && (
          <section id="experience">
            <h2 className="text-4xl font-bold mb-8 text-indigo-300">
              Experience
            </h2>
            {preview.experience
              .split("\n")
              .filter((e) => e.trim())
              .map((exp, idx) => (
                <motion.article
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.2 }}
                  className="mb-6 p-4 bg-indigo-800 rounded-md shadow-md"
                >
                  <p className="text-sm">{exp.trim()}</p>
                </motion.article>
              ))}
          </section>
        )}
        {preview?.education && (
          <section id="education">
            <h2 className="text-4xl font-bold mb-8 text-indigo-300">
              Education
            </h2>
            {preview.education
              .split("\n")
              .filter((e) => e.trim())
              .map((edu, idx) => (
                <motion.article
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.2 }}
                  className="mb-6 p-4 bg-indigo-800 rounded-md shadow-md"
                >
                  <p className="text-sm">{edu.trim()}</p>
                </motion.article>
              ))}
          </section>
        )}
        {preview?.skills && (
          <section id="skills" className="md:col-span-2">
            <h2 className="text-4xl font-bold mb-6 text-indigo-300 text-center">
              Skills
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {preview.skills.split(",").map((skill, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-indigo-700 rounded-full text-white px-5 py-2 font-semibold shadow"
                >
                  {skill.trim()}
                </motion.span>
              ))}
            </div>
          </section>
        )}
        {preview?.projects && (
          <section id="projects" className="md:col-span-2">
            <h2 className="text-4xl font-bold mb-6 text-indigo-300 text-center">
              Projects
            </h2>
            {preview.projects
              .split("\n")
              .filter((p) => p.trim())
              .map((project, idx) => (
                <motion.article
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.2 }}
                  className="mb-6 p-6 bg-indigo-800 rounded-lg shadow hover:bg-indigo-700 transition"
                >
                  <h3 className="text-xl font-semibold mb-2 text-indigo-200">
                    Project {idx + 1}
                  </h3>
                  <p className="text-sm">{project.trim()}</p>
                </motion.article>
              ))}
          </section>
        )}
        <section id="contact" className="md:col-span-2 text-center mt-12">
          <h2 className="text-4xl font-bold mb-6 text-indigo-300">
            Get In Touch
          </h2>
          <div className="flex justify-center gap-8 mb-6 text-lg flex-wrap">
            {preview?.email && (
              <div className="flex items-center space-x-2 hover:text-indigo-400 transition">
                <Mail />
                <span>{preview.email}</span>
              </div>
            )}
            {preview?.phone && (
              <div className="flex items-center space-x-2 hover:text-indigo-400 transition">
                <Phone />
                <span>{preview.phone}</span>
              </div>
            )}
            {preview?.location && (
              <div className="flex items-center space-x-2 hover:text-indigo-400 transition">
                <MapPin />
                <span>{preview.location}</span>
              </div>
            )}
          </div>
          <div className="flex justify-center space-x-8">
            {preview?.github && (
              <a
                href={preview.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-indigo-700 rounded-lg hover:bg-indigo-600"
              >
                <Github />
              </a>
            )}
            {preview?.linkedin && (
              <a
                href={preview.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-indigo-700 rounded-lg hover:bg-indigo-600"
              >
                <Linkedin />
              </a>
            )}
            {preview?.website && (
              <a
                href={preview.website}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-indigo-700 rounded-lg hover:bg-indigo-600"
              >
                <Globe />
              </a>
            )}
          </div>
        </section>
      </main>
      <footer className="py-8 border-t border-indigo-700 text-indigo-400 text-center">
        <p>&copy; 2025 {preview?.name || "Your Name"}. All rights reserved.</p>
      </footer>
    </div>
  );

  const renderPreview = () => {
    switch (activeTemplate) {
      case "modern":
        return <ModernPreview />;
      case "creative":
        return <CreativePreview />;
      case "professional":
        return <ProfessionalPreview />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col items-center p-4 md:p-8 relative">
      <Toaster />
      <div className="w-full max-w-5xl bg-slate-900 rounded-xl shadow-lg p-6 md:p-8 z-10 flex flex-col">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8 border-b border-slate-800 pb-4">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-slate-200 to-slate-500 bg-clip-text text-transparent mb-4 md:mb-0">
            Portfolio Builder
          </h1>
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="w-full md:w-auto px-5 py-2 flex items-center justify-center space-x-2 rounded-full bg-emerald-600 hover:bg-emerald-700 transition"
            >
              <Eye className="w-5 h-5" />
              <span>{showPreview ? "Edit" : "Preview"}</span>
            </button>
            <button
              onClick={downloadPortfolio}
              className="w-full md:w-auto px-5 py-2 flex items-center justify-center space-x-2 rounded-full bg-blue-600 hover:bg-blue-700 transition"
              disabled={!showPreview}
            >
              <Download className="w-5 h-5" />
              <span>Download</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="w-full flex-grow">
          <AnimatePresence mode="wait">
            {showPreview ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="w-full min-h-[600px] bg-slate-800 rounded-lg overflow-hidden"
              >
                {preview ? renderPreview() : <LoadingSpinner />}
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <form
                  onSubmit={handleSubmit}
                  className="space-y-6 md:space-y-8"
                >
                  {/* Template Selector */}
                  <div className="flex justify-center space-x-4">
                    {templates.map((template) => (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => setActiveTemplate(template.id)}
                        className={`p-3 md:p-4 flex flex-col items-center justify-center rounded-lg transition-all
                          ${
                            activeTemplate === template.id
                              ? `bg-slate-700 text-${template.color}-400 ring-2 ring-${template.color}-400`
                              : "bg-slate-800 hover:bg-slate-700"
                          }`}
                      >
                        <template.icon className="w-6 h-6 md:w-8 md:h-8" />
                        <span className="mt-2 text-sm">{template.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Personal Info Section */}
                  <div className="bg-slate-800 rounded-xl p-6 space-y-4">
                    <h2 className="flex items-center space-x-2 text-xl font-semibold text-slate-300">
                      <User className="w-5 h-5 text-slate-400" />
                      <span>Personal Information</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <label htmlFor="name" className="text-sm mb-1">
                          Full Name
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          className="px-4 py-2 rounded-md bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                          required
                        />
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="title" className="text-sm mb-1">
                          Professional Title
                        </label>
                        <input
                          id="title"
                          name="title"
                          type="text"
                          value={formData.title}
                          onChange={handleChange}
                          className="px-4 py-2 rounded-md bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="email" className="text-sm mb-1">
                          Email
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="px-4 py-2 rounded-md bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="phone" className="text-sm mb-1">
                          Phone
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          className="px-4 py-2 rounded-md bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="location" className="text-sm mb-1">
                          Location
                        </label>
                        <input
                          id="location"
                          name="location"
                          type="text"
                          value={formData.location}
                          onChange={handleChange}
                          className="px-4 py-2 rounded-md bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="github" className="text-sm mb-1">
                          GitHub URL
                        </label>
                        <input
                          id="github"
                          name="github"
                          type="url"
                          value={formData.github}
                          onChange={handleChange}
                          className="px-4 py-2 rounded-md bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="linkedin" className="text-sm mb-1">
                          LinkedIn URL
                        </label>
                        <input
                          id="linkedin"
                          name="linkedin"
                          type="url"
                          value={formData.linkedin}
                          onChange={handleChange}
                          className="px-4 py-2 rounded-md bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="website" className="text-sm mb-1">
                          Personal Website URL
                        </label>
                        <input
                          id="website"
                          name="website"
                          type="url"
                          value={formData.website}
                          onChange={handleChange}
                          className="px-4 py-2 rounded-md bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Summary Section */}
                  <div className="bg-slate-800 rounded-xl p-6 space-y-4">
                    <h2 className="flex items-center space-x-2 text-xl font-semibold text-slate-300">
                      <FileText className="w-5 h-5 text-slate-400" />
                      <span>About You</span>
                    </h2>
                    <textarea
                      name="about"
                      value={formData.about}
                      onChange={handleChange}
                      placeholder="Write a brief professional summary."
                      rows="4"
                      className="w-full px-4 py-2 rounded-md bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-y"
                    />
                  </div>

                  {/* Skills Section */}
                  <div className="bg-slate-800 rounded-xl p-6 space-y-4">
                    <h2 className="flex items-center space-x-2 text-xl font-semibold text-slate-300">
                      <Briefcase className="w-5 h-5 text-slate-400" />
                      <span>Skills</span>
                    </h2>
                    <textarea
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      placeholder="List your skills, separated by commas (e.g., JavaScript, React, Tailwind CSS)."
                      rows="2"
                      className="w-full px-4 py-2 rounded-md bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-y"
                    />
                  </div>

                  {/* Projects, Experience, and Education Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="bg-slate-800 rounded-xl p-6 space-y-4">
                      <h2 className="flex items-center space-x-2 text-xl font-semibold text-slate-300">
                        <Monitor className="w-5 h-5 text-slate-400" />
                        <span>Projects</span>
                      </h2>
                      <textarea
                        name="projects"
                        value={formData.projects}
                        onChange={handleChange}
                        placeholder="List your projects, one per line. Include a brief description."
                        rows="6"
                        className="w-full px-4 py-2 rounded-md bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-y"
                      />
                    </div>
                    <div className="bg-slate-800 rounded-xl p-6 space-y-4">
                      <h2 className="flex items-center space-x-2 text-xl font-semibold text-slate-300">
                        <Briefcase className="w-5 h-5 text-slate-400" />
                        <span>Work Experience</span>
                      </h2>
                      <textarea
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        placeholder="List your work experience, one per line. Include company, role, and dates."
                        rows="6"
                        className="w-full px-4 py-2 rounded-md bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-y"
                      />
                    </div>
                    <div className="bg-slate-800 rounded-xl p-6 space-y-4 md:col-span-2">
                      <h2 className="flex items-center space-x-2 text-xl font-semibold text-slate-300">
                        <FileText className="w-5 h-5 text-slate-400" />
                        <span>Education</span>
                      </h2>
                      <textarea
                        name="education"
                        value={formData.education}
                        onChange={handleChange}
                        placeholder="List your education history, one per line. Include institution, degree, and dates."
                        rows="4"
                        className="w-full px-4 py-2 rounded-md bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-y"
                      />
                    </div>
                  </div>

                  {/* Submission Button */}
                  <div className="w-full flex justify-center">
                    <button
                      type="submit"
                      className="w-full md:w-auto px-10 py-3 rounded-full bg-blue-600 hover:bg-blue-700 transition font-semibold flex items-center justify-center space-x-2"
                      disabled={loading}
                    >
                      {loading && <Loader2 className="animate-spin" />}
                      <span>
                        {loading ? "Generating..." : "Generate Portfolio"}
                      </span>
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default PortfolioGenerator;
