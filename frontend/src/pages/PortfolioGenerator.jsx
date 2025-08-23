import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Download, 
  Eye, 
  User, 
  Code, 
  Briefcase, 
  GraduationCap, 
  Award,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Globe,
  Calendar,
  ExternalLink,
  Star,
  Palette,
  Monitor
} from "lucide-react";

const PortfolioGenerator = () => {
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

  const [preview, setPreview] = useState(null);
  const [activeTemplate, setActiveTemplate] = useState('modern');
  const [showPreview, setShowPreview] = useState(false);

  const templates = [
    { id: 'modern', name: 'Modern', icon: Monitor, color: 'emerald' },
    { id: 'creative', name: 'Creative', icon: Palette, color: 'purple' },
    { id: 'professional', name: 'Professional', icon: Briefcase, color: 'blue' }
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const newValue = files ? files[0] : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPreview(formData);
    setShowPreview(true);
  };

  const downloadPortfolio = () => {
    const portfolioHTML = generatePortfolioHTML();
    const blob = new Blob([portfolioHTML], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.name || 'portfolio'}-website.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const generatePortfolioHTML = () => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${formData.name} - Portfolio</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    animation: {
                        'fade-in': 'fadeIn 0.6s ease-in-out',
                        'slide-up': 'slideUp 0.8s ease-out',
                    }
                }
            }
        }
    </script>
    <style>
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.6s ease-in-out; }
        .animate-slide-up { animation: slideUp 0.8s ease-out; }
    </style>
</head>
<body class="bg-slate-900 text-white">
    ${getTemplateHTML()}
</body>
</html>`;
  };

  const getTemplateHTML = () => {
    switch(activeTemplate) {
      case 'modern':
        return getModernTemplate();
      case 'creative':
        return getCreativeTemplate();
      case 'professional':
        return getProfessionalTemplate();
      default:
        return getModernTemplate();
    }
  };

  const getModernTemplate = () => `
    <!-- Modern Template -->
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <!-- Header -->
        <header class="bg-slate-800/80 backdrop-blur-sm fixed w-full top-0 z-50 border-b border-slate-700">
            <nav class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <h1 class="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                    ${formData.name}
                </h1>
                <div class="hidden md:flex space-x-8">
                    <a href="#about" class="hover:text-emerald-400 transition">About</a>
                    <a href="#skills" class="hover:text-emerald-400 transition">Skills</a>
                    <a href="#projects" class="hover:text-emerald-400 transition">Projects</a>
                    <a href="#experience" class="hover:text-emerald-400 transition">Experience</a>
                    <a href="#education" class="hover:text-emerald-400 transition">Education</a>
                    <a href="#contact" class="hover:text-emerald-400 transition">Contact</a>
                </div>
            </nav>
        </header>

        <!-- Hero Section -->
        <section class="pt-24 pb-16">
            <div class="max-w-7xl mx-auto px-6 text-center">
                <div class="animate-fade-in">
                    <h1 class="text-5xl md:text-7xl font-bold mb-6">
                        <span class="bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                            ${formData.name}
                        </span>
                    </h1>
                    <h2 class="text-2xl md:text-3xl text-gray-300 mb-8">${formData.title}</h2>
                    <p class="text-lg text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                        ${formData.about}
                    </p>
                    <div class="flex justify-center space-x-6">
                        ${formData.email ? `<a href="mailto:${formData.email}" class="bg-emerald-500 hover:bg-emerald-600 px-8 py-3 rounded-lg font-semibold transition">Contact Me</a>` : ''}
                        ${formData.github ? `<a href="${formData.github}" class="border border-emerald-500 hover:bg-emerald-500 px-8 py-3 rounded-lg font-semibold transition">GitHub</a>` : ''}
                    </div>
                </div>
            </div>
        </section>

        <!-- Skills Section -->
        <section id="skills" class="py-16 bg-slate-800/50">
            <div class="max-w-7xl mx-auto px-6">
                <h2 class="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">Skills</h2>
                <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    ${formData.skills.split(',').map(skill => `
                        <div class="bg-slate-700 rounded-lg p-4 text-center hover:bg-slate-600 transition animate-slide-up">
                            <span class="font-medium">${skill.trim()}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>

        <!-- Projects Section -->
        <section id="projects" class="py-16">
            <div class="max-w-7xl mx-auto px-6">
                <h2 class="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">Projects</h2>
                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    ${formData.projects.split('\n').filter(p => p.trim()).map(project => `
                        <div class="bg-slate-800 rounded-xl p-6 hover:bg-slate-700 transition animate-slide-up">
                            <h3 class="text-xl font-bold mb-3 text-emerald-400">Project</h3>
                            <p class="text-gray-300 leading-relaxed">${project.trim()}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>

        <!-- Experience Section -->
        <section id="experience" class="py-16 bg-slate-800/50">
            <div class="max-w-7xl mx-auto px-6">
                <h2 class="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">Experience</h2>
                <div class="space-y-8">
                    ${formData.experience.split('\n').filter(exp => exp.trim()).map(experience => `
                        <div class="bg-slate-800 rounded-xl p-6 animate-slide-up">
                            <p class="text-gray-300 leading-relaxed">${experience.trim()}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>

        <!-- Education Section -->
        <section id="education" class="py-16">
            <div class="max-w-7xl mx-auto px-6">
                <h2 class="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">Education</h2>
                <div class="space-y-8">
                    ${formData.education.split('\n').filter(edu => edu.trim()).map(education => `
                        <div class="bg-slate-800 rounded-xl p-6 animate-slide-up">
                            <p class="text-gray-300 leading-relaxed">${education.trim()}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>

        <!-- Contact Section -->
        <section id="contact" class="py-16 bg-slate-800/50">
            <div class="max-w-7xl mx-auto px-6 text-center">
                <h2 class="text-4xl font-bold mb-12 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">Get In Touch</h2>
                <div class="flex justify-center space-x-8 mb-8">
                    ${formData.email ? `<a href="mailto:${formData.email}" class="flex items-center space-x-2 hover:text-emerald-400 transition"><span>📧</span><span>${formData.email}</span></a>` : ''}
                    ${formData.phone ? `<a href="tel:${formData.phone}" class="flex items-center space-x-2 hover:text-emerald-400 transition"><span>📱</span><span>${formData.phone}</span></a>` : ''}
                </div>
                <div class="flex justify-center space-x-6">
                    ${formData.github ? `<a href="${formData.github}" class="bg-slate-700 hover:bg-slate-600 p-3 rounded-lg transition">GitHub</a>` : ''}
                    ${formData.linkedin ? `<a href="${formData.linkedin}" class="bg-slate-700 hover:bg-slate-600 p-3 rounded-lg transition">LinkedIn</a>` : ''}
                    ${formData.website ? `<a href="${formData.website}" class="bg-slate-700 hover:bg-slate-600 p-3 rounded-lg transition">Website</a>` : ''}
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="py-8 text-center text-gray-400 border-t border-slate-700">
            <p>&copy; 2025 ${formData.name}. All rights reserved.</p>
        </footer>
    </div>
  `;

  const getCreativeTemplate = () => `
    <!-- Creative Template -->
    <div class="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-pink-900">
        <!-- Similar structure with creative styling -->
        <div class="text-center py-20">
            <h1 class="text-6xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                ${formData.name}
            </h1>
            <h2 class="text-2xl text-purple-200 mb-8">${formData.title}</h2>
            <!-- Add more creative sections here -->
        </div>
    </div>
  `;

  const getProfessionalTemplate = () => `
    <!-- Professional Template -->
    <div class="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-900">
        <!-- Similar structure with professional styling -->
        <div class="text-center py-20">
            <h1 class="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                ${formData.name}
            </h1>
            <h2 class="text-2xl text-blue-200 mb-8">${formData.title}</h2>
            <!-- Add more professional sections here -->
        </div>
    </div>
  `;

  const ModernPreview = () => (
    <div className="min-h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-sm p-6 border-b border-slate-700">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
            {preview?.name || 'Your Name'}
          </h1>
          <div className="hidden md:flex space-x-6 text-sm">
            <span className="hover:text-emerald-400 cursor-pointer">About</span>
            <span className="hover:text-emerald-400 cursor-pointer">Skills</span>
            <span className="hover:text-emerald-400 cursor-pointer">Projects</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              {preview?.name || 'Your Name'}
            </span>
          </h1>
          <h2 className="text-xl md:text-2xl text-gray-300 mb-6">
            {preview?.title || 'Your Professional Title'}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            {preview?.about || 'Your professional summary will appear here...'}
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-emerald-500 hover:bg-emerald-600 px-6 py-2 rounded-lg font-semibold transition text-sm">
              Contact Me
            </button>
            <button className="border border-emerald-500 hover:bg-emerald-500 px-6 py-2 rounded-lg font-semibold transition text-sm">
              View Work
            </button>
          </div>
        </motion.div>
      </section>

      {/* Skills Section */}
      {preview?.skills && (
        <section className="py-12 px-6 bg-slate-800/50">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
            Skills
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
            {preview.skills.split(',').map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-700 rounded-lg p-3 text-center hover:bg-slate-600 transition"
              >
                <span className="font-medium text-sm">{skill.trim()}</span>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Projects Section */}
      {preview?.projects && (
        <section className="py-12 px-6">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
            Projects
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {preview.projects.split('\n').filter(p => p.trim()).map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-slate-800 rounded-xl p-6 hover:bg-slate-700 transition"
              >
                <h3 className="text-lg font-bold mb-3 text-emerald-400">Project {index + 1}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{project.trim()}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Experience Section */}
      {preview?.experience && (
        <section className="py-12 px-6 bg-slate-800/50">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
            Experience
          </h2>
          <div className="space-y-6 max-w-4xl mx-auto">
            {preview.experience.split('\n').filter(exp => exp.trim()).map((experience, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-slate-800 rounded-xl p-6"
              >
                <p className="text-gray-300 text-sm leading-relaxed">{experience.trim()}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Education Section */}
      {preview?.education && (
        <section className="py-12 px-6">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
            Education
          </h2>
          <div className="space-y-6 max-w-4xl mx-auto">
            {preview.education.split('\n').filter(edu => edu.trim()).map((education, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-slate-800 rounded-xl p-6"
              >
                <p className="text-gray-300 text-sm leading-relaxed">{education.trim()}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="py-12 px-6 bg-slate-800/50 text-center">
        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
          Get In Touch
        </h2>
        <div className="flex justify-center space-x-6 mb-6 text-sm">
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
            <button className="bg-slate-700 hover:bg-slate-600 p-2 rounded-lg transition">
              <Github className="w-5 h-5" />
            </button>
          )}
          {preview?.linkedin && (
            <button className="bg-slate-700 hover:bg-slate-600 p-2 rounded-lg transition">
              <Linkedin className="w-5 h-5" />
            </button>
          )}
          {preview?.website && (
            <button className="bg-slate-700 hover:bg-slate-600 p-2 rounded-lg transition">
              <Globe className="w-5 h-5" />
            </button>
          )}
        </div>
      </section>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                  Portfolio Generator
                </h1>
                <p className="text-sm text-gray-400">Create your professional portfolio website</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {!showPreview ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 xl:grid-cols-3 gap-8"
            >
              {/* Form Section */}
              <div className="xl:col-span-2">
                <motion.form
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-2xl p-8 border border-slate-700"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <User className="w-8 h-8 text-emerald-400" />
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                      Portfolio Details
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {/* Personal Information */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-300 font-medium mb-2">Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 font-medium mb-2">Professional Title *</label>
                        <input
                          type="text"
                          name="title"
                          placeholder="Full Stack Developer"
                          value={formData.title}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                          required
                        />
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-gray-300 font-medium mb-2">Email</label>
                        <input
                          type="email"
                          name="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 font-medium mb-2">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          placeholder="+1 234 567 8900"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 font-medium mb-2">Location</label>
                        <input
                          type="text"
                          name="location"
                          placeholder="New York, USA"
                          value={formData.location}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                        />
                      </div>
                    </div>

                    {/* Resume Upload */}
                    <div>
                      <label className="block text-gray-300 font-medium mb-2">Resume (PDF)</label>
                      <label className="flex items-center gap-3 p-4 rounded-xl bg-slate-700 hover:bg-slate-600 cursor-pointer transition-all border-2 border-dashed border-slate-500 hover:border-emerald-400">
                        <FileText className="w-6 h-6 text-emerald-400" />
                        <span className="flex-1">
                          {formData.resume ? formData.resume.name : "Upload your resume (PDF)"}
                        </span>
                        <input
                          type="file"
                          name="resume"
                          accept="application/pdf"
                          onChange={handleChange}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* About Section */}
                    <div>
                      <label className="block text-gray-300 font-medium mb-2">About Me *</label>
                      <textarea
                        name="about"
                        placeholder="Write a compelling professional summary about yourself, your expertise, and what you're passionate about..."
                        value={formData.about}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition resize-none"
                        required
                      />
                    </div>

                    {/* Skills */}
                    <div>
                      <label className="block text-gray-300 font-medium mb-2">Skills *</label>
                      <input
                        type="text"
                        name="skills"
                        placeholder="React, Node.js, Python, AWS, Docker, JavaScript, TypeScript, MongoDB..."
                        value={formData.skills}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                        required
                      />
                      <p className="text-xs text-gray-400 mt-1">Separate skills with commas</p>
                    </div>

                    {/* Projects */}
                    <div>
                      <label className="block text-gray-300 font-medium mb-2">Projects & Achievements *</label>
                      <textarea
                        name="projects"
                        placeholder="Describe your key projects, one per line:&#10;&#10;E-commerce Platform - Built a full-stack web application using React and Node.js&#10;Mobile App - Developed iOS/Android app with 10k+ downloads&#10;Open Source Library - Created and maintained a popular npm package"
                        value={formData.projects}
                        onChange={handleChange}
                        rows={6}
                        className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition resize-none"
                        required
                      />
                    </div>

                    {/* Experience */}
                    <div>
                      <label className="block text-gray-300 font-medium mb-2">Work Experience *</label>
                      <textarea
                        name="experience"
                        placeholder="List your work experience, one per line:&#10;&#10;Senior Software Engineer at Tech Corp (2022-Present) - Led development of microservices architecture&#10;Full Stack Developer at StartupXYZ (2020-2022) - Built scalable web applications&#10;Junior Developer at WebCo (2018-2020) - Developed responsive websites"
                        value={formData.experience}
                        onChange={handleChange}
                        rows={6}
                        className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition resize-none"
                        required
                      />
                    </div>

                    {/* Education */}
                    <div>
                      <label className="block text-gray-300 font-medium mb-2">Education & Certifications *</label>
                      <textarea
                        name="education"
                        placeholder="List your education and certifications, one per line:&#10;&#10;B.S. Computer Science, University of Technology (2018)&#10;AWS Certified Solutions Architect (2023)&#10;Google Cloud Professional Developer (2022)"
                        value={formData.education}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition resize-none"
                        required
                      />
                    </div>

                    {/* Social Links */}
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-gray-300 font-medium mb-2">GitHub</label>
                        <input
                          type="url"
                          name="github"
                          placeholder="https://github.com/yourusername"
                          value={formData.github}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 font-medium mb-2">LinkedIn</label>
                        <input
                          type="url"
                          name="linkedin"
                          placeholder="https://linkedin.com/in/yourusername"
                          value={formData.linkedin}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 font-medium mb-2">Website</label>
                        <input
                          type="url"
                          name="website"
                          placeholder="https://yourwebsite.com"
                          value={formData.website}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="text-center pt-6">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="px-12 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-blue-500 text-slate-900 font-bold text-lg hover:from-emerald-500 hover:via-emerald-600 hover:to-blue-600 transition-all shadow-xl flex items-center gap-3 mx-auto"
                      >
                        <Eye className="w-6 h-6" />
                        Generate Portfolio Preview
                      </motion.button>
                    </div>
                  </div>
                </motion.form>
              </div>

              {/* Template Selection */}
              <div className="xl:col-span-1">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-2xl p-6 border border-slate-700 h-fit">
                  <h3 className="text-xl font-bold text-emerald-400 mb-6 flex items-center gap-2">
                    <Palette className="w-6 h-6" />
                    Choose Template
                  </h3>
                  <div className="space-y-4">
                    {templates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => setActiveTemplate(template.id)}
                        className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                          activeTemplate === template.id
                            ? `border-${template.color}-400 bg-${template.color}-900/30`
                            : 'border-slate-600 hover:border-slate-500'
                        }`}
                      >
                        <template.icon className={`w-6 h-6 text-${template.color}-400`} />
                        <div className="text-left">
                          <div className="font-semibold">{template.name}</div>
                          <div className="text-sm text-gray-400">
                            {template.id === 'modern' && 'Clean and professional'}
                            {template.id === 'creative' && 'Bold and artistic'}
                            {template.id === 'professional' && 'Corporate style'}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-8 p-4 bg-slate-700/50 rounded-xl">
                    <h4 className="font-semibold text-emerald-400 mb-2">Features:</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Responsive design</li>
                      <li>• Professional layouts</li>
                      <li>• Smooth animations</li>
                      <li>• Mobile optimized</li>
                      <li>• SEO friendly</li>
                      <li>• Download as HTML</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Preview Header */}
              <div className="flex justify-between items-center bg-slate-800 p-6 rounded-2xl">
                <div>
                  <h2 className="text-2xl font-bold text-emerald-400">Portfolio Preview</h2>
                  <p className="text-gray-400">Preview your professional portfolio website</p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowPreview(false)}
                    className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition font-medium"
                  >
                    Edit Details
                  </button>
                  <button
                    onClick={downloadPortfolio}
                    className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 rounded-lg transition font-medium flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download HTML
                  </button>
                </div>
              </div>

              {/* Portfolio Preview */}
              <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="h-[80vh] overflow-y-auto">
                  <ModernPreview />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PortfolioGenerator;