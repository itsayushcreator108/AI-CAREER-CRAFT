// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth, useUser } from "@clerk/clerk-react";
// import toast, { Toaster } from "react-hot-toast";
// import {
//   X,
//   Loader2,
//   Trash2,
//   Plus,
//   Save,
//   User,
//   Briefcase,
//   GraduationCap,
//   Code,
//   Folder,
//   Mail,
//   MapPin,
//   Calendar,
//   ExternalLink,
//   Camera,
// } from "lucide-react";

// const MyProfile = () => {
//   const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:4000";
//   const { getToken } = useAuth();
//   const { user } = useUser();

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [profile, setProfile] = useState(null);
//   const [activeSection, setActiveSection] = useState("basic");
//   const [isNewUser, setIsNewUser] = useState(false);

//   const [imagePreview, setImagePreview] = useState(null);
//   const [uploadingImage, setUploadingImage] = useState(false);

//   const [form, setForm] = useState({
//     fullName: "",
//     email: "",
//     headline: "",
//     bio: "",
//     location: "",
//     phone: "",
//     website: "",
//     photoUrl: "",
//     skills: [],
//     education: [],
//     experience: [],
//     projects: [],
//   });

//   const [newItems, setNewItems] = useState({
//     skill: "",
//     education: {
//       institution: "",
//       degree: "",
//       fieldOfStudy: "",
//       startYear: "",
//       endYear: "",
//       grade: "",
//       description: "",
//     },
//     experience: {
//       company: "",
//       role: "",
//       description: "",
//       startDate: "",
//       endDate: "",
//       location: "",
//       isCurrentJob: false,
//     },
//     project: {
//       name: "",
//       description: "",
//       link: "",
//       githubLink: "",
//       techStack: "",
//       startDate: "",
//       endDate: "",
//       status: "completed",
//     },
//   });

//   // Fetch profile
//   const fetchProfile = async () => {
//     setLoading(true);
//     try {
//       const token = await getToken();
//       const res = await axios.get(`${BASE_URL}/api/users/profile/all`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (res.data?.success && res.data.data) {
//         const data = res.data.data;
//         setProfile(data);
//         setForm({
//           fullName: data.fullName || user?.fullName || "",
//           email: data.email || user?.email || "",
//           headline: data.headline || "",
//           bio: data.bio || "",
//           location: data.location || "",
//           phone: data.phone || "",
//           website: data.website || "",
//           photoUrl: data.photoUrl || "",
//           skills: data.skills || [],
//           education: data.education || [],
//           experience: data.experience || [],
//           projects: data.projects || [],
//         });
//         setImagePreview(data.photoUrl || "");
//         setIsNewUser(false);
//       } else {
//         setIsNewUser(true);
//         setForm({
//           fullName: user?.fullName || "",
//           email: user?.email || "",
//           headline: "",
//           bio: "",
//           location: "",
//           phone: "",
//           website: "",
//           photoUrl: "",
//           skills: [],
//           education: [],
//           experience: [],
//           projects: [],
//         });
//         setImagePreview("");
//       }
//     } catch (err) {
//       if (err.response?.status === 404) {
//         setIsNewUser(true);
//       } else {
//         toast.error("Failed to load profile ❌");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (user) fetchProfile();
//   }, [user]);

//   // Image upload handler
//   const handleImageUpload = async (file) => {
//     if (!file) return;
//     if (!file.type.startsWith("image/")) {
//       toast.error("Please select a valid image file");
//       return;
//     }
//     if (file.size > 5 * 1024 * 1024) {
//       toast.error("File size must be less than 5MB");
//       return;
//     }
//     setUploadingImage(true);
//     try {
//       const token = await getToken();
//       const formData = new FormData();
//       formData.append("profileImage", file);
//       const res = await axios.post(`${BASE_URL}/api/users/profile-image`, formData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (res.data?.success) {
//         setForm((f) => ({ ...f, photoUrl: res.data.imageUrl }));
//         setProfile((p) => ({ ...p, photoUrl: res.data.imageUrl }));
//         setImagePreview(res.data.imageUrl);
//         toast.success("Profile image updated!");
//         await fetchProfile();
//       }
//     } catch {
//       toast.error("Failed to upload image ❌");
//     } finally {
//       setUploadingImage(false);
//     }
//   };

//   // Remove profile image
//   const handleRemoveImage = async () => {
//     try {
//       const token = await getToken();
//       const res = await axios.delete(`${BASE_URL}/api/users/profile-image`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (res.data?.success) {
//         setForm((f) => ({ ...f, photoUrl: "" }));
//         setProfile((p) => ({ ...p, photoUrl: "" }));
//         setImagePreview(null);
//         toast.success("Profile image removed!");
//       }
//     } catch {
//       toast.error("Failed to remove image ❌");
//     }
//   };

//   // Handle image selection
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => setImagePreview(reader.result);
//       reader.readAsDataURL(file);
//       handleImageUpload(file);
//     }
//   };

//   // Save profile
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     try {
//       const token = await getToken();
//       const payload = {
//         fullName: form.fullName,
//         email: form.email,
//         headline: form.headline,
//         bio: form.bio,
//         location: form.location,
//         phone: form.phone,
//         website: form.website,
//         photoUrl: form.photoUrl,
//         skills: form.skills,
//         education: form.education,
//         experience: form.experience,
//         projects: form.projects,
//       };
//       const res = profile && !isNewUser
//         ? await axios.put(`${BASE_URL}/api/users/profile`, payload, { headers: { Authorization: `Bearer ${token}` } })
//         : await axios.post(`${BASE_URL}/api/users/profile`, payload, { headers: { Authorization: `Bearer ${token}` } });
//       if (res.data.success) {
//         setProfile(res.data.user || res.data.data);
//         setIsNewUser(false);
//         toast.success(profile ? "Profile updated!" : "Profile created!");
//         await fetchProfile();
//       }
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Failed to save profile ❌");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Skills handlers
//   const handleAddSkill = async () => {
//     const skill = newItems.skill.trim();
//     if (!skill) return;
//     try {
//       if (profile && !isNewUser) {
//         const token = await getToken();
//         const res = await axios.post(`${BASE_URL}/api/users/skills`, { skill }, { headers: { Authorization: `Bearer ${token}` } });
//         if (res.data.success) {
//           setForm((f) => ({ ...f, skills: res.data.skills }));
//           toast.success("Skill added!");
//         }
//       } else {
//         setForm((f) => ({ ...f, skills: [...f.skills, skill] }));
//         toast.success("Skill added!");
//       }
//       setNewItems((prev) => ({ ...prev, skill: "" }));
//     } catch {
//       toast.error("Failed to add skill!");
//     }
//   };

//   const handleRemoveSkill = async (skill) => {
//     try {
//       if (profile && !isNewUser) {
//         const token = await getToken();
//         const res = await axios.delete(`${BASE_URL}/api/users/skills/${skill}`, { headers: { Authorization: `Bearer ${token}` } });
//         if (res.data.success) {
//           setForm((f) => ({ ...f, skills: res.data.skills }));
//           toast.success("Skill removed!");
//         }
//       } else {
//         setForm((f) => ({ ...f, skills: f.skills.filter((s) => s !== skill) }));
//         toast.success("Skill removed!");
//       }
//     } catch {
//       toast.error("Failed to remove skill!");
//     }
//   };

//   // Education handlers
//   const handleAddEducation = async () => {
//     const { institution, degree } = newItems.education;
//     if (!institution || !degree) {
//       toast.error("Institution and degree are required!");
//       return;
//     }
//     try {
//       if (profile && !isNewUser) {
//         const token = await getToken();
//         const res = await axios.post(`${BASE_URL}/api/users/education`, newItems.education, { headers: { Authorization: `Bearer ${token}` } });
//         if (res.data.success) {
//           setForm((f) => ({ ...f, education: res.data.education }));
//           toast.success("Education added!");
//         }
//       } else {
//         const newEdu = { ...newItems.education, _id: Date.now().toString() };
//         setForm((f) => ({ ...f, education: [...f.education, newEdu] }));
//         toast.success("Education added!");
//       }
//       setNewItems((prev) => ({
//         ...prev,
//         education: { institution: "", degree: "", fieldOfStudy: "", startYear: "", endYear: "", grade: "", description: "" },
//       }));
//     } catch {
//       toast.error("Failed to add education!");
//     }
//   };

//   const handleRemoveEducation = async (id) => {
//     try {
//       if (profile && !isNewUser) {
//         const token = await getToken();
//         const res = await axios.delete(`${BASE_URL}/api/users/education/${id}`, { headers: { Authorization: `Bearer ${token}` } });
//         if (res.data.success) {
//           setForm((f) => ({ ...f, education: res.data.education }));
//           toast.success("Education removed!");
//         }
//       } else {
//         setForm((f) => ({ ...f, education: f.education.filter((e) => e._id !== id) }));
//         toast.success("Education removed!");
//       }
//     } catch {
//       toast.error("Failed to remove education!");
//     }
//   };

//   // Experience handlers
//   const handleAddExperience = async () => {
//     const { company, role } = newItems.experience;
//     if (!company || !role) {
//       toast.error("Company and role are required!");
//       return;
//     }
//     try {
//       if (profile && !isNewUser) {
//         const token = await getToken();
//         const res = await axios.post(`${BASE_URL}/api/users/experience`, newItems.experience, { headers: { Authorization: `Bearer ${token}` } });
//         if (res.data.success) {
//           setForm((f) => ({ ...f, experience: res.data.experience }));
//           toast.success("Experience added!");
//         }
//       } else {
//         const newExp = { ...newItems.experience, _id: Date.now().toString() };
//         setForm((f) => ({ ...f, experience: [...f.experience, newExp] }));
//         toast.success("Experience added!");
//       }
//       setNewItems((prev) => ({
//         ...prev,
//         experience: { company: "", role: "", description: "", startDate: "", endDate: "", location: "", isCurrentJob: false },
//       }));
//     } catch {
//       toast.error("Failed to add experience!");
//     }
//   };

//   const handleRemoveExperience = async (id) => {
//     try {
//       if (profile && !isNewUser) {
//         const token = await getToken();
//         const res = await axios.delete(`${BASE_URL}/api/users/experience/${id}`, { headers: { Authorization: `Bearer ${token}` } });
//         if (res.data.success) {
//           setForm((f) => ({ ...f, experience: res.data.experience }));
//           toast.success("Experience removed!");
//         }
//       } else {
//         setForm((f) => ({ ...f, experience: f.experience.filter((e) => e._id !== id) }));
//         toast.success("Experience removed!");
//       }
//     } catch {
//       toast.error("Failed to remove experience!");
//     }
//   };

//   // Project handlers
//   const handleAddProject = async () => {
//     const { name, description } = newItems.project;
//     if (!name || !description) {
//       toast.error("Project name and description are required!");
//       return;
//     }
//     const formatted = {
//       ...newItems.project,
//       techStack: newItems.project.techStack.split(",").map((t) => t.trim()).filter(Boolean),
//     };
//     try {
//       if (profile && !isNewUser) {
//         const token = await getToken();
//         const res = await axios.post(`${BASE_URL}/api/users/projects`, formatted, { headers: { Authorization: `Bearer ${token}` } });
//         if (res.data.success) {
//           setForm((f) => ({ ...f, projects: res.data.projects }));
//           toast.success("Project added!");
//         }
//       } else {
//         const newProj = { ...formatted, _id: Date.now().toString() };
//         setForm((f) => ({ ...f, projects: [...f.projects, newProj] }));
//         toast.success("Project added!");
//       }
//       setNewItems((prev) => ({
//         ...prev,
//         project: { name: "", description: "", link: "", githubLink: "", techStack: "", startDate: "", endDate: "", status: "completed" },
//       }));
//     } catch {
//       toast.error("Failed to add project!");
//     }
//   };

//   const handleRemoveProject = async (id) => {
//     try {
//       if (profile && !isNewUser) {
//         const token = await getToken();
//         const res = await axios.delete(`${BASE_URL}/api/users/projects/${id}`, { headers: { Authorization: `Bearer ${token}` } });
//         if (res.data.success) {
//           setForm((f) => ({ ...f, projects: res.data.projects }));
//           toast.success("Project removed!");
//         }
//       } else {
//         setForm((f) => ({ ...f, projects: f.projects.filter((p) => p._id !== id) }));
//         toast.success("Project removed!");
//       }
//     } catch {
//       toast.error("Failed to remove project!");
//     }
//   };

//   if (loading) return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-black">
//       <Loader2 className="w-12 h-12 animate-spin text-cyan-400" />
//       <Toaster />
//       <p className="text-white mt-4">Loading profile...</p>
//     </div>
//   );

//   const sections = [
//     { id: "basic", name: "Basic Info", icon: User },
//     { id: "skills", name: "Skills", icon: Code },
//     { id: "education", name: "Education", icon: GraduationCap },
//     { id: "experience", name: "Experience", icon: Briefcase },
//     { id: "projects", name: "Projects", icon: Folder },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
//       <Toaster position="top-right" />
//       {/* Header */}
//       <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 shadow-xl">
//         <div className="max-w-7xl mx-auto p-6 text-center">
//           <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border border-gray-700 bg-gray-800 flex items-center justify-center">
//             {imagePreview ? (
//               <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
//             ) : form.photoUrl ? (
//               <img src={form.photoUrl} alt="Profile" className="w-full h-full object-cover" />
//             ) : (
//               <User className="text-gray-400 w-16 h-16" />
//             )}
//             <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 hover:opacity-100 flex items-center justify-center">
//               <label className="text-white cursor-pointer flex flex-col items-center">
//                 <Camera className="mb-1" />
//                 <span className="text-xs">Change Photo</span>
//                 <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} disabled={uploadingImage} />
//               </label>
//             </div>
//             {(form.photoUrl || imagePreview) && (
//               <button onClick={handleRemoveImage} title="Remove Photo" className="absolute -top-2 -right-2 bg-red-600 p-1 rounded-full text-white shadow-md hover:bg-red-700">
//                 <X className="w-4 h-4" />
//               </button>
//             )}
//           </div>
//           <h1 className="text-4xl font-extrabold text-white">{isNewUser ? "Create Your Profile" : "My Profile"}</h1>
//           <p className="mt-2 text-gray-400 text-lg">{isNewUser ? "Let's build your professional profile" : "Manage your profile information"}</p>
//         </div>
//       </div>

//       {/* Main content */}
//       <div className="max-w-7xl mx-auto p-6 flex flex-col lg:flex-row gap-6">
//         {/* Sidebar */}
//         <nav className="w-full lg:w-1/4 bg-gray-800 rounded-lg p-4 shadow-lg sticky top-20">
//           {sections.map(({ id, name, icon: Icon }) => (
//             <button
//               key={id}
//               type="button"
//               onClick={() => setActiveSection(id)}
//               className={`flex items-center gap-3 w-full p-3 mb-2 text-white rounded-lg font-semibold transition-colors ${
//                 activeSection === id ? "bg-cyan-600" : "hover:bg-gray-700"
//               }`}
//             >
//               <Icon />
//               {name}
//             </button>
//           ))}
//         </nav>

//         {/* Form */}
//         <main className="flex-1 max-h-[85vh] overflow-y-auto px-4">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {activeSection === "basic" && (
//               <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white space-y-6">
//                 {/* Basic Info form fields */}
//                 <div>
//                   <label className="block mb-2 font-semibold">Full Name *</label>
//                   <input
//                     type="text"
//                     value={form.fullName}
//                     onChange={e => setForm({ ...form, fullName: e.target.value })}
//                     required
//                     className="w-full p-3 rounded-md bg-gray-900 border border-gray-700"
//                     placeholder="Full name"
//                   />
//                 </div>

//                 <div>
//                   <label className="block mb-2 font-semibold">Email *</label>
//                   <input
//                     type="email"
//                     value={form.email}
//                     onChange={e => setForm({ ...form, email: e.target.value })}
//                     required
//                     readOnly={!isNewUser}
//                     className="w-full p-3 rounded-md bg-gray-900 border border-gray-700"
//                     placeholder="Email"
//                   />
//                 </div>

//                 <div>
//                   <label className="block mb-2 font-semibold">Professional Headline</label>
//                   <input
//                     type="text"
//                     value={form.headline}
//                     onChange={e => setForm({ ...form, headline: e.target.value })}
//                     className="w-full p-3 rounded-md bg-gray-900 border border-gray-700"
//                     placeholder="Professional headline"
//                   />
//                 </div>

//                 <div>
//                   <label className="block mb-2 font-semibold">Location</label>
//                   <input
//                     type="text"
//                     value={form.location}
//                     onChange={e => setForm({ ...form, location: e.target.value })}
//                     className="w-full p-3 rounded-md bg-gray-900 border border-gray-700"
//                     placeholder="Location"
//                   />
//                 </div>

//                 <div>
//                   <label className="block mb-2 font-semibold">Phone</label>
//                   <input
//                     type="tel"
//                     value={form.phone}
//                     onChange={e => setForm({ ...form, phone: e.target.value })}
//                     className="w-full p-3 rounded-md bg-gray-900 border border-gray-700"
//                     placeholder="Phone number"
//                   />
//                 </div>

//                 <div>
//                   <label className="block mb-2 font-semibold">Website</label>
//                   <input
//                     type="url"
//                     value={form.website}
//                     onChange={e => setForm({ ...form, website: e.target.value })}
//                     className="w-full p-3 rounded-md bg-gray-900 border border-gray-700"
//                     placeholder="Website"
//                   />
//                 </div>

//                 <div>
//                   <label className="block mb-2 font-semibold">Bio</label>
//                   <textarea
//                     value={form.bio}
//                     onChange={e => setForm({ ...form, bio: e.target.value })}
//                     rows={4}
//                     className="w-full p-3 rounded-md bg-gray-900 border border-gray-700 resize-none"
//                     placeholder="Tell us about yourself"
//                   />
//                 </div>
//               </div>
//             )}

//             {activeSection === "skills" && (
//               <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white space-y-6">
//                 <div>
//                   <label className="block mb-2 font-semibold">Skills</label>
//                   <div className="flex flex-wrap gap-2 mb-4">
//                     {form.skills.length === 0 && (
//                       <p className="italic text-gray-400">No skills added yet.</p>
//                     )}
//                     {form.skills.map((skill, idx) => (
//                       <div key={idx} className="px-3 py-1 rounded-full bg-cyan-700 flex items-center gap-2">
//                         {skill}
//                         <button type="button" onClick={() => handleRemoveSkill(skill)}>
//                           <X size={16} />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                   <div className="flex gap-2">
//                     <input
//                       value={newItems.skill}
//                       onChange={e => setNewItems({ ...newItems, skill: e.target.value })}
//                       onKeyDown={e => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
//                       type="text"
//                       className="flex-grow p-3 rounded-md bg-gray-900 border border-gray-700"
//                       placeholder="Add a skill"
//                     />
//                     <button type="button" onClick={handleAddSkill} className="p-3 bg-cyan-600 rounded-md">
//                       <Plus />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Education Section */}
//             {activeSection === "education" && (
//               <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white space-y-6">
//                 <h2 className="mb-4 text-2xl font-bold">Education</h2>
//                 <div className="space-y-4 max-h-72 overflow-y-auto">
//                   {form.education.length === 0 && <p className="italic text-gray-400">No education added yet.</p>}
//                   {form.education.map((edu) => (
//                     <div key={edu._id} className="p-4 rounded bg-gray-900 flex justify-between items-start">
//                       <div>
//                         <h3 className="font-semibold">{edu.degree}</h3>
//                         <p className="text-sm text-cyan-400">{edu.institution}</p>
//                         {edu.fieldOfStudy && <p className="text-sm">{edu.fieldOfStudy}</p>}
//                         {(edu.startYear || edu.endYear) && (
//                           <p className="text-sm">{edu.startYear || ""} - {edu.endYear || "Present"}</p>
//                         )}
//                         {edu.grade && <p className="text-sm">Grade: {edu.grade}</p>}
//                         {edu.description && <p className="mt-2 text-sm">{edu.description}</p>}
//                       </div>
//                       <button onClick={() => handleRemoveEducation(edu._id)} className="text-red-500 hover:text-red-400">
//                         <Trash2 />
//                       </button>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <input
//                     value={newItems.education.institution}
//                     onChange={e => setNewItems({ ...newItems, education: { ...newItems.education, institution: e.target.value } })}
//                     placeholder="Institution *"
//                     className="p-3 rounded-md bg-gray-900 border border-gray-700"
//                   />
//                   <input
//                     value={newItems.education.degree}
//                     onChange={e => setNewItems({ ...newItems, education: { ...newItems.education, degree: e.target.value } })}
//                     placeholder="Degree *"
//                     className="p-3 rounded-md bg-gray-900 border border-gray-700"
//                   />
//                   <input
//                     value={newItems.education.fieldOfStudy}
//                     onChange={e => setNewItems({ ...newItems, education: { ...newItems.education, fieldOfStudy: e.target.value } })}
//                     placeholder="Field of Study"
//                     className="p-3 rounded-md bg-gray-900 border border-gray-700"
//                   />
//                   <input
//                     value={newItems.education.grade}
//                     onChange={e => setNewItems({ ...newItems, education: { ...newItems.education, grade: e.target.value } })}
//                     placeholder="Grade"
//                     className="p-3 rounded-md bg-gray-900 border border-gray-700"
//                   />
//                   <input
//                     value={newItems.education.startYear}
//                     onChange={e => setNewItems({ ...newItems, education: { ...newItems.education, startYear: e.target.value } })}
//                     type="number"
//                     placeholder="Start Year"
//                     className="p-3 rounded-md bg-gray-900 border border-gray-700"
//                   />
//                   <input
//                     value={newItems.education.endYear}
//                     onChange={e => setNewItems({ ...newItems, education: { ...newItems.education, endYear: e.target.value } })}
//                     type="number"
//                     placeholder="End Year"
//                     className="p-3 rounded-md bg-gray-900 border border-gray-700"
//                   />
//                   <textarea
//                     value={newItems.education.description}
//                     onChange={e => setNewItems({ ...newItems, education: { ...newItems.education, description: e.target.value } })}
//                     placeholder="Description"
//                     rows={3}
//                     className="p-3 rounded-md bg-gray-900 border border-gray-700 resize-none md:col-span-2"
//                   />
//                 </div>
//                 <button type="button" onClick={handleAddEducation} className="mt-3 bg-cyan-600 p-3 rounded-md w-full max-w-sm mx-auto block hover:bg-cyan-700">
//                   Add Education
//                 </button>
//               </div>
//             )}

//             {/* Experience Section */}
//             {activeSection === "experience" && (
//               <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white space-y-6">
//                 <h2 className="mb-4 text-2xl font-bold">Experience</h2>
//                 <div className="space-y-4 max-h-72 overflow-y-auto">
//                   {form.experience.length === 0 && <p className="italic text-gray-400">No experience added yet.</p>}
//                   {form.experience.map((exp) => (
//                     <div key={exp._id} className="p-4 rounded bg-gray-900 flex justify-between items-start">
//                       <div>
//                         <h3 className="font-semibold">{exp.role}</h3>
//                         <p className="text-sm text-cyan-400">{exp.company}</p>
//                         {(exp.startDate || exp.endDate) && (
//                           <p className="text-sm">
//                             {exp.startDate || ""} - {exp.isCurrentJob ? "Present" : exp.endDate || ""}
//                           </p>
//                         )}
//                         {exp.location && <p className="text-sm">{exp.location}</p>}
//                         {exp.description && <p className="mt-2 text-sm">{exp.description}</p>}
//                       </div>
//                       <button onClick={() => handleRemoveExperience(exp._id)} className="text-red-500 hover:text-red-400">
//                         <Trash2 />
//                       </button>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <input
//                     value={newItems.experience.company}
//                     onChange={e => setNewItems({ ...newItems, experience: { ...newItems.experience, company: e.target.value } })}
//                     placeholder="Company *"
//                     className="p-3 rounded-md bg-gray-900 border border-gray-700"
//                   />
//                   <input
//                     value={newItems.experience.role}
//                     onChange={e => setNewItems({ ...newItems, experience: { ...newItems.experience, role: e.target.value } })}
//                     placeholder="Role *"
//                     className="p-3 rounded-md bg-gray-900 border border-gray-700"
//                   />
//                   <input
//                     value={newItems.experience.location}
//                     onChange={e => setNewItems({ ...newItems, experience: { ...newItems.experience, location: e.target.value } })}
//                     placeholder="Location"
//                     className="p-3 rounded-md bg-gray-900 border border-gray-700"
//                   />
//                   <input
//                     type="date"
//                     value={newItems.experience.startDate}
//                     onChange={e => setNewItems({ ...newItems, experience: { ...newItems.experience, startDate: e.target.value } })}
//                     className="p-3 rounded-md bg-gray-900 border border-gray-700"
//                   />
//                   <input
//                     type="date"
//                     value={newItems.experience.endDate}
//                     onChange={e => setNewItems({ ...newItems, experience: { ...newItems.experience, endDate: e.target.value } })}
//                     disabled={newItems.experience.isCurrentJob}
//                     className="p-3 rounded-md bg-gray-900 border border-gray-700 disabled:opacity-50"
//                   />
//                   <label className="flex items-center gap-2 text-gray-400">
//                     <input
//                       type="checkbox"
//                       checked={newItems.experience.isCurrentJob}
//                       onChange={e =>
//                         setNewItems({ ...newItems, experience: { ...newItems.experience, isCurrentJob: e.target.checked, endDate: "" } })
//                       }
//                       className="rounded border-gray-600 text-cyan-500"
//                     />
//                     Current job
//                   </label>
//                   <textarea
//                     value={newItems.experience.description}
//                     onChange={e => setNewItems({ ...newItems, experience: { ...newItems.experience, description: e.target.value } })}
//                     placeholder="Description"
//                     rows={3}
//                     className="p-3 rounded-md bg-gray-900 border border-gray-700 resize-none md:col-span-2"
//                   />
//                 </div>
//                 <button type="button" onClick={handleAddExperience} className="mt-3 bg-cyan-600 p-3 rounded-md w-full max-w-sm mx-auto block hover:bg-cyan-700">
//                   Add Experience
//                 </button>
//               </div>
//             )}

//             {/* Projects Section */}
//             {activeSection === "projects" && (
//               <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white space-y-6">
//                 <h2 className="mb-4 text-2xl font-bold">Projects</h2>
//                 <div className="space-y-4 max-h-72 overflow-y-auto">
//                   {form.projects.length === 0 && <p className="italic text-gray-400">No projects added yet.</p>}
//                   {form.projects.map((proj) => (
//                     <div key={proj._id} className="p-4 rounded bg-gray-900 flex justify-between items-start">
//                       <div>
//                         <h3 className="font-semibold flex items-center gap-2">
//                           {proj.name}
//                           <span
//                             className={`text-xs px-2 py-1 rounded ${
//                               proj.status === "completed"
//                                 ? "bg-green-700 text-green-300"
//                                 : proj.status === "in-progress"
//                                 ? "bg-yellow-700 text-yellow-300"
//                                 : "bg-gray-700 text-gray-400"
//                             }`}
//                           >
//                             {proj.status}
//                           </span>
//                         </h3>
//                         <p className="mt-1 text-sm">{proj.description}</p>
//                         {proj.techStack?.length > 0 && (
//                           <div className="flex flex-wrap mt-2 gap-2">
//                             {proj.techStack.map((tech, idx) => (
//                               <span key={idx} className="text-xs bg-orange-700 px-2 py-0.5 rounded">
//                                 {tech}
//                               </span>
//                             ))}
//                           </div>
//                         )}
//                         <div className="flex gap-4 mt-2 text-sm text-gray-400">
//                           {(proj.startDate || proj.endDate) && (
//                             <p>
//                               <Calendar className="inline w-4 h-4 mr-1" />
//                               {proj.startDate || ""} - {proj.endDate || "Present"}
//                             </p>
//                           )}
//                           {proj.link && (
//                             <a href={proj.link} target="_blank" rel="noreferrer" className="hover:text-cyan-400 flex items-center gap-1">
//                               <ExternalLink className="w-4 h-4" /> Live demo
//                             </a>
//                           )}
//                           {proj.githubLink && (
//                             <a href={proj.githubLink} target="_blank" rel="noreferrer" className="hover:text-cyan-400 flex items-center gap-1">
//                               <Code className="w-4 h-4" /> GitHub
//                             </a>
//                           )}
//                         </div>
//                       </div>
//                       <button onClick={() => handleRemoveProject(proj._id)} className="text-red-500 hover:text-red-400">
//                         <Trash2 />
//                       </button>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <input
//                     value={newItems.project.name}
//                     onChange={e => setNewItems({ ...newItems, project: { ...newItems.project, name: e.target.value } })}
//                     placeholder="Project Name *"
//                     className="p-3 rounded-md bg-gray-900 border border-gray-700"
//                   />
//                   <select
//                     value={newItems.project.status}
//                     onChange={e => setNewItems({ ...newItems, project: { ...newItems.project, status: e.target.value } })}
//                     className="p-3 rounded-md bg-gray-900 border border-gray-700"
//                   >
//                     <option value="completed">Completed</option>
//                     <option value="in-progress">In progress</option>
//                     <option value="planned">Planned</option>
//                   </select>
//                   <input
//                     value={newItems.project.link}
//                     onChange={e => setNewItems({ ...newItems, project: { ...newItems.project, link: e.target.value } })}
//                     type="url"
//                     placeholder="Live Demo URL"
//                     className="p-3 rounded-md bg-gray-900 border border-gray-700"
//                   />
//                   <input
//                     value={newItems.project.githubLink}
//                     onChange={e => setNewItems({ ...newItems, project: { ...newItems.project, githubLink: e.target.value } })}
//                     type="url"
//                     placeholder="GitHub URL"
//                     className="p-3 rounded-md bg-gray-900 border border-gray-700"
//                   />
//                   <input
//                     value={newItems.project.startDate}
//                     onChange={e => setNewItems({ ...newItems, project: { ...newItems.project, startDate: e.target.value } })}
//                     type="date"
//                     className="p-3 rounded-md bg-gray-900 border border-gray-700"
//                   />
//                   <input
//                     value={newItems.project.endDate}
//                     onChange={e => setNewItems({ ...newItems, project: { ...newItems.project, endDate: e.target.value } })}
//                     type="date"
//                     className="p-3 rounded-md bg-gray-900 border border-gray-700"
//                   />
//                   <textarea
//                     value={newItems.project.description}
//                     onChange={e => setNewItems({ ...newItems, project: { ...newItems.project, description: e.target.value } })}
//                     placeholder="Description"
//                     rows={3}
//                     className="p-3 rounded-md bg-gray-900 border border-gray-700 resize-none md:col-span-2"
//                   />
//                   <input
//                     value={newItems.project.techStack}
//                     onChange={e => setNewItems({ ...newItems, project: { ...newItems.project, techStack: e.target.value } })}
//                     placeholder="Tech Stack (comma separated)"
//                     className="p-3 rounded-md bg-gray-900 border border-gray-700 md:col-span-2"
//                   />
//                 </div>

//                 <button type="button" onClick={handleAddProject} className="mt-3 bg-cyan-600 p-3 rounded-md w-full max-w-sm mx-auto block hover:bg-cyan-700">
//                   Add Project
//                 </button>
//               </div>
//             )}

//             {/* Submit */}
//             <div className="sticky bottom-6 bg-gradient-to-t from-slate-900/50 to-transparent pt-4">
//               <button
//                 type="submit"
//                 disabled={saving}
//                 className="w-full p-4 text-lg bg-cyan-600 rounded-md hover:bg-cyan-700 disabled:opacity-70 flex items-center justify-center gap-3 shadow-lg"
//               >
//                 {saving && <Loader2 className="animate-spin" />}
//                 <Save />
//                 {isNewUser ? "Create Profile" : "Save Changes"}
//               </button>
//               {isNewUser && (
//                 <p className="text-cyan-400 text-center mt-2 text-sm">
//                   Your profile will be saved and editable anytime
//                 </p>
//               )}
//             </div>
//           </form>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default MyProfile;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import toast, { Toaster } from "react-hot-toast";
import {
  X,
  Loader2,
  Trash2,
  Plus,
  Save,
  User,
  Briefcase,
  GraduationCap,
  Code,
  Folder,
  Calendar,
  ExternalLink,
  Camera,
} from "lucide-react";

/** ---- Helpers ---- **/
const getNormalizedPhotoUrl = (obj) => {
  if (!obj) return "";
  // Accept common variations from DB / API
  const candidate =
    obj.photoUrl ??
    obj.photoURL ??
    obj.photoImgUrl ??
    obj.photoIMGUrl ??
    obj.photoimgurl ??
    obj.imageUrl ??
    (obj.photo && (obj.photo.url ?? obj.photo.link));
  return typeof candidate === "string" ? candidate : "";
};

const MyProfile = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:4000";
  const { getToken } = useAuth();
  const { user } = useUser();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [activeSection, setActiveSection] = useState("basic");
  const [isNewUser, setIsNewUser] = useState(false);

  const [imagePreview, setImagePreview] = useState(null); // local preview / latest uploaded URL
  const [uploadingImage, setUploadingImage] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    headline: "",
    bio: "",
    location: "",
    phone: "",
    website: "",
    photoUrl: "",
    skills: [],
    education: [],
    experience: [],
    projects: [],
  });

  const [newItems, setNewItems] = useState({
    skill: "",
    education: {
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startYear: "",
      endYear: "",
      grade: "",
      description: "",
    },
    experience: {
      company: "",
      role: "",
      description: "",
      startDate: "",
      endDate: "",
      location: "",
      isCurrentJob: false,
    },
    project: {
      name: "",
      description: "",
      link: "",
      githubLink: "",
      techStack: "",
      startDate: "",
      endDate: "",
      status: "completed",
    },
  });

  /** Fetch profile (including photo URL, normalized) */
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await axios.get(`${BASE_URL}/api/users/profile/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.success && res.data.data) {
        const data = res.data.data;
        const normalizedPhoto = getNormalizedPhotoUrl(data);

        setProfile(data);
        setForm({
          fullName: data.fullName || user?.fullName || "",
          // Clerk usually: user.primaryEmailAddress.emailAddress (kept your architecture)
          email: data.email || user?.email || "",
          headline: data.headline || "",
          bio: data.bio || "",
          location: data.location || "",
          phone: data.phone || "",
          website: data.website || "",
          photoUrl: normalizedPhoto || "",
          skills: data.skills || [],
          education: data.education || [],
          experience: data.experience || [],
          projects: data.projects || [],
        });

        if (normalizedPhoto) {
          setImagePreview((prev) => prev ?? normalizedPhoto);
        }

        setIsNewUser(false);
      } else {
        setIsNewUser(true);
        setForm({
          fullName: user?.fullName || "",
          email: user?.email || "",
          headline: "",
          bio: "",
          location: "",
          phone: "",
          website: "",
          photoUrl: "",
          skills: [],
          education: [],
          experience: [],
          projects: [],
        });
        setImagePreview("");
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setIsNewUser(true);
      } else {
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  /** Upload image (and ensure profile persists the URL) */
  const handleImageUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setUploadingImage(true);
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("profileImage", file);

      const res = await axios.post(
        `${BASE_URL}/api/users/profile-image`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data?.success) {
        // Normalize any image url field the API might return
        const uploadedUrl =
          getNormalizedPhotoUrl(res.data) ||
          res.data.imageUrl ||
          res.data.url ||
          "";

        if (!uploadedUrl) {
          toast.error("Upload succeeded but no image URL returned.");
          return;
        }

        // Update local state immediately for snappy UI
        setForm((f) => ({ ...f, photoUrl: uploadedUrl }));
        setProfile((p) => ({
          ...(p || {}),
          photoUrl: uploadedUrl,
          photoImgUrl: uploadedUrl,
        }));
        setImagePreview(uploadedUrl);

        // If your /profile-image endpoint DOESN'T persist to DB, this PUT will:
        try {
          const token2 = await getToken();
          await axios.put(
            `${BASE_URL}/api/users/profile`,
            { photoUrl: uploadedUrl },
            { headers: { Authorization: `Bearer ${token2}` } }
          );
        } catch {
          // If server already persisted, this will be a no-op; we ignore errors here on purpose.
        }

        toast.success("Profile image updated!");
        await fetchProfile(); // refresh all fields from DB
      } else {
        toast.error(res.data?.message || "Failed to upload image ");
      }
    } catch {
      toast.error("Failed to upload image ");
    } finally {
      setUploadingImage(false);
    }
  };

  /** Remove profile image (and clear in DB) */
  const handleRemoveImage = async () => {
    try {
      const token = await getToken();
      const res = await axios.delete(`${BASE_URL}/api/users/profile-image`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.success) {
        setForm((f) => ({ ...f, photoUrl: "" }));
        setProfile((p) => ({ ...(p || {}), photoUrl: "", photoImgUrl: "" }));
        setImagePreview(null);
        toast.success("Profile image removed!");
      } else {
        toast.error(res.data?.message || "Failed to remove image ");
      }
    } catch {
      toast.error("Failed to remove image ");
    }
  };

  /** Select image (preview instantly, then upload) */
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instant preview
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);

    // Upload in background
    handleImageUpload(file);
  };

  /** Save profile */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = await getToken();
      const payload = {
        fullName: form.fullName,
        email: form.email,
        headline: form.headline,
        bio: form.bio,
        location: form.location,
        phone: form.phone,
        website: form.website,
        photoUrl: form.photoUrl, // keep writing normalized field
        skills: form.skills,
        education: form.education,
        experience: form.experience,
        projects: form.projects,
      };
      const res =
        profile && !isNewUser
          ? await axios.put(`${BASE_URL}/api/users/profile`, payload, {
              headers: { Authorization: `Bearer ${token}` },
            })
          : await axios.post(`${BASE_URL}/api/users/profile`, payload, {
              headers: { Authorization: `Bearer ${token}` },
            });

      if (res.data.success) {
        const saved = res.data.user || res.data.data || {};
        setProfile(saved);
        // keep local form photo in sync using normalizer (covers server renaming field)
        const normalizedPhoto = getNormalizedPhotoUrl(saved);
        setForm((f) => ({ ...f, photoUrl: normalizedPhoto || f.photoUrl }));
        setIsNewUser(false);
        toast.success(profile ? "Profile updated!" : "Profile created!");
        await fetchProfile();
      } else {
        toast.error(res.data?.message || "Failed to save profile ❌");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save profile ❌");
    } finally {
      setSaving(false);
    }
  };

  /** Skills */
  const handleAddSkill = async () => {
    const skill = newItems.skill.trim();
    if (!skill) return;
    try {
      if (profile && !isNewUser) {
        const token = await getToken();
        const res = await axios.post(
          `${BASE_URL}/api/users/skills`,
          { skill },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.success) {
          setForm((f) => ({ ...f, skills: res.data.skills }));
          toast.success("Skill added!");
        }
      } else {
        setForm((f) => ({ ...f, skills: [...f.skills, skill] }));
        toast.success("Skill added!");
      }
      setNewItems((prev) => ({ ...prev, skill: "" }));
    } catch {
      toast.error("Failed to add skill!");
    }
  };

  const handleRemoveSkill = async (skill) => {
    try {
      if (profile && !isNewUser) {
        const token = await getToken();
        const res = await axios.delete(
          `${BASE_URL}/api/users/skills/${skill}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.data.success) {
          setForm((f) => ({ ...f, skills: res.data.skills }));
          toast.success("Skill removed!");
        }
      } else {
        setForm((f) => ({ ...f, skills: f.skills.filter((s) => s !== skill) }));
        toast.success("Skill removed!");
      }
    } catch {
      toast.error("Failed to remove skill!");
    }
  };

  /** Education */
  const handleAddEducation = async () => {
    const { institution, degree } = newItems.education;
    if (!institution || !degree) {
      toast.error("Institution and degree are required!");
      return;
    }
    try {
      if (profile && !isNewUser) {
        const token = await getToken();
        const res = await axios.post(
          `${BASE_URL}/api/users/education`,
          newItems.education,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.data.success) {
          setForm((f) => ({ ...f, education: res.data.education }));
          toast.success("Education added!");
        }
      } else {
        const newEdu = { ...newItems.education, _id: Date.now().toString() };
        setForm((f) => ({ ...f, education: [...f.education, newEdu] }));
        toast.success("Education added!");
      }
      setNewItems((prev) => ({
        ...prev,
        education: {
          institution: "",
          degree: "",
          fieldOfStudy: "",
          startYear: "",
          endYear: "",
          grade: "",
          description: "",
        },
      }));
    } catch {
      toast.error("Failed to add education!");
    }
  };

  const handleRemoveEducation = async (id) => {
    try {
      if (profile && !isNewUser) {
        const token = await getToken();
        const res = await axios.delete(
          `${BASE_URL}/api/users/education/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.data.success) {
          setForm((f) => ({ ...f, education: res.data.education }));
          toast.success("Education removed!");
        }
      } else {
        setForm((f) => ({
          ...f,
          education: f.education.filter((e) => e._id !== id),
        }));
        toast.success("Education removed!");
      }
    } catch {
      toast.error("Failed to remove education!");
    }
  };

  /** Experience */
  const handleAddExperience = async () => {
    const { company, role } = newItems.experience;
    if (!company || !role) {
      toast.error("Company and role are required!");
      return;
    }
    try {
      if (profile && !isNewUser) {
        const token = await getToken();
        const res = await axios.post(
          `${BASE_URL}/api/users/experience`,
          newItems.experience,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.data.success) {
          setForm((f) => ({ ...f, experience: res.data.experience }));
          toast.success("Experience added!");
        }
      } else {
        const newExp = { ...newItems.experience, _id: Date.now().toString() };
        setForm((f) => ({ ...f, experience: [...f.experience, newExp] }));
        toast.success("Experience added!");
      }
      setNewItems((prev) => ({
        ...prev,
        experience: {
          company: "",
          role: "",
          description: "",
          startDate: "",
          endDate: "",
          location: "",
          isCurrentJob: false,
        },
      }));
    } catch {
      toast.error("Failed to add experience!");
    }
  };

  const handleRemoveExperience = async (id) => {
    try {
      if (profile && !isNewUser) {
        const token = await getToken();
        const res = await axios.delete(
          `${BASE_URL}/api/users/experience/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.data.success) {
          setForm((f) => ({ ...f, experience: res.data.experience }));
          toast.success("Experience removed!");
        }
      } else {
        setForm((f) => ({
          ...f,
          experience: f.experience.filter((e) => e._id !== id),
        }));
        toast.success("Experience removed!");
      }
    } catch {
      toast.error("Failed to remove experience!");
    }
  };

  /** Projects */
  const handleAddProject = async () => {
    const { name, description } = newItems.project;
    if (!name || !description) {
      toast.error("Project name and description are required!");
      return;
    }
    const formatted = {
      ...newItems.project,
      techStack: newItems.project.techStack
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    try {
      if (profile && !isNewUser) {
        const token = await getToken();
        const res = await axios.post(
          `${BASE_URL}/api/users/projects`,
          formatted,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.data.success) {
          setForm((f) => ({ ...f, projects: res.data.projects }));
          toast.success("Project added!");
        }
      } else {
        const newProj = { ...formatted, _id: Date.now().toString() };
        setForm((f) => ({ ...f, projects: [...f.projects, newProj] }));
        toast.success("Project added!");
      }
      setNewItems((prev) => ({
        ...prev,
        project: {
          name: "",
          description: "",
          link: "",
          githubLink: "",
          techStack: "",
          startDate: "",
          endDate: "",
          status: "completed",
        },
      }));
    } catch {
      toast.error("Failed to add project!");
    }
  };

  const handleRemoveProject = async (id) => {
    try {
      if (profile && !isNewUser) {
        const token = await getToken();
        const res = await axios.delete(`${BASE_URL}/api/users/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setForm((f) => ({ ...f, projects: res.data.projects }));
          toast.success("Project removed!");
        }
      } else {
        setForm((f) => ({
          ...f,
          projects: f.projects.filter((p) => p._id !== id),
        }));
        toast.success("Project removed!");
      }
    } catch {
      toast.error("Failed to remove project!");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        <Loader2 className="w-12 h-12 animate-spin text-cyan-400" />
        <Toaster />
        <p className="text-white mt-4">Loading profile...</p>
      </div>
    );

  const sections = [
    { id: "basic", name: "Basic Info", icon: User },
    { id: "skills", name: "Skills", icon: Code },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "projects", name: "Projects", icon: Folder },
  ];

  // Final display URL priority: local preview (if any) → form value → profile value
  const displayPhoto =
    imagePreview ||
    getNormalizedPhotoUrl(form) ||
    getNormalizedPhotoUrl(profile) ||
    "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 shadow-xl">
        <div className="max-w-7xl mx-auto p-6 text-center">
          <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border border-gray-700 bg-gray-800 flex items-center justify-center">
            {displayPhoto ? (
              <img
                src={displayPhoto}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Graceful fallback if URL 404s/broken
                  e.currentTarget.src = "";
                  setImagePreview(null);
                  setForm((f) => ({ ...f, photoUrl: "" }));
                }}
              />
            ) : (
              <User className="text-gray-400 w-16 h-16" />
            )}

            {/* Hover overlay for change photo */}
            <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
              <label className="text-white cursor-pointer flex flex-col items-center">
                {uploadingImage ? (
                  <Loader2 className="mb-1 animate-spin" />
                ) : (
                  <Camera className="mb-1" />
                )}
                <span className="text-xs">
                  {uploadingImage ? "Uploading..." : "Change Photo"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={uploadingImage}
                />
              </label>
            </div>

            {/* Remove button */}
            {(displayPhoto || imagePreview) && !uploadingImage && (
              <button
                onClick={handleRemoveImage}
                title="Remove Photo"
                className="absolute -top-2 -right-2 bg-red-600 p-1 rounded-full text-white shadow-md hover:bg-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <h1 className="text-4xl font-extrabold text-white">
            {isNewUser ? "Create Your Profile" : "My Profile"}
          </h1>
          <p className="mt-2 text-gray-400 text-lg">
            {isNewUser
              ? "Let's build your professional profile"
              : "Manage your profile information"}
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto p-6 flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <nav className="w-full lg:w-1/4 bg-gray-800 rounded-lg p-4 shadow-lg sticky top-20">
          {sections.map(({ id, name, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveSection(id)}
              className={`flex items-center gap-3 w-full p-3 mb-2 text-white rounded-lg font-semibold transition-colors ${
                activeSection === id ? "bg-cyan-600" : "hover:bg-gray-700"
              }`}
            >
              <Icon />
              {name}
            </button>
          ))}
        </nav>

        {/* Form */}
        <main className="flex-1 max-h-[85vh] overflow-y-auto px-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {activeSection === "basic" && (
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white space-y-6">
                <div>
                  <label className="block mb-2 font-semibold">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) =>
                      setForm({ ...form, fullName: e.target.value })
                    }
                    required
                    className="w-full p-3 rounded-md bg-gray-900 border border-gray-700"
                    placeholder="Full name"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold">Email *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                    readOnly={!isNewUser}
                    className="w-full p-3 rounded-md bg-gray-900 border border-gray-700"
                    placeholder="Email"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold">
                    Professional Headline
                  </label>
                  <input
                    type="text"
                    value={form.headline}
                    onChange={(e) =>
                      setForm({ ...form, headline: e.target.value })
                    }
                    className="w-full p-3 rounded-md bg-gray-900 border border-gray-700"
                    placeholder="Professional headline"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold">Location</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                    className="w-full p-3 rounded-md bg-gray-900 border border-gray-700"
                    placeholder="Location"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    className="w-full p-3 rounded-md bg-gray-900 border border-gray-700"
                    placeholder="Phone number"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold">Website</label>
                  <input
                    type="url"
                    value={form.website}
                    onChange={(e) =>
                      setForm({ ...form, website: e.target.value })
                    }
                    className="w-full p-3 rounded-md bg-gray-900 border border-gray-700"
                    placeholder="Website"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold">Bio</label>
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    rows={4}
                    className="w-full p-3 rounded-md bg-gray-900 border border-gray-700 resize-none"
                    placeholder="Tell us about yourself"
                  />
                </div>
              </div>
            )}

            {activeSection === "skills" && (
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white space-y-6">
                <div>
                  <label className="block mb-2 font-semibold">Skills</label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {form.skills.length === 0 && (
                      <p className="italic text-gray-400">
                        No skills added yet.
                      </p>
                    )}
                    {form.skills.map((skill, idx) => (
                      <div
                        key={idx}
                        className="px-3 py-1 rounded-full bg-cyan-700 flex items-center gap-2"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={newItems.skill}
                      onChange={(e) =>
                        setNewItems({ ...newItems, skill: e.target.value })
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleAddSkill())
                      }
                      type="text"
                      className="flex-grow p-3 rounded-md bg-gray-900 border border-gray-700"
                      placeholder="Add a skill"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="p-3 bg-cyan-600 rounded-md"
                    >
                      <Plus />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Education Section */}
            {activeSection === "education" && (
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white space-y-6">
                <h2 className="mb-4 text-2xl font-bold">Education</h2>
                <div className="space-y-4 max-h-72 overflow-y-auto">
                  {form.education.length === 0 && (
                    <p className="italic text-gray-400">
                      No education added yet.
                    </p>
                  )}
                  {form.education.map((edu) => (
                    <div
                      key={edu._id}
                      className="p-4 rounded bg-gray-900 flex justify-between items-start"
                    >
                      <div>
                        <h3 className="font-semibold">{edu.degree}</h3>
                        <p className="text-sm text-cyan-400">
                          {edu.institution}
                        </p>
                        {edu.fieldOfStudy && (
                          <p className="text-sm">{edu.fieldOfStudy}</p>
                        )}
                        {(edu.startYear || edu.endYear) && (
                          <p className="text-sm">
                            {edu.startYear || ""} - {edu.endYear || "Present"}
                          </p>
                        )}
                        {edu.grade && (
                          <p className="text-sm">Grade: {edu.grade}</p>
                        )}
                        {edu.description && (
                          <p className="mt-2 text-sm">{edu.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveEducation(edu._id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <Trash2 />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    value={newItems.education.institution}
                    onChange={(e) =>
                      setNewItems({
                        ...newItems,
                        education: {
                          ...newItems.education,
                          institution: e.target.value,
                        },
                      })
                    }
                    placeholder="Institution *"
                    className="p-3 rounded-md bg-gray-900 border border-gray-700"
                  />
                  <input
                    value={newItems.education.degree}
                    onChange={(e) =>
                      setNewItems({
                        ...newItems,
                        education: {
                          ...newItems.education,
                          degree: e.target.value,
                        },
                      })
                    }
                    placeholder="Degree *"
                    className="p-3 rounded-md bg-gray-900 border border-gray-700"
                  />
                  <input
                    value={newItems.education.fieldOfStudy}
                    onChange={(e) =>
                      setNewItems({
                        ...newItems,
                        education: {
                          ...newItems.education,
                          fieldOfStudy: e.target.value,
                        },
                      })
                    }
                    placeholder="Field of Study"
                    className="p-3 rounded-md bg-gray-900 border border-gray-700"
                  />
                  <input
                    value={newItems.education.grade}
                    onChange={(e) =>
                      setNewItems({
                        ...newItems,
                        education: {
                          ...newItems.education,
                          grade: e.target.value,
                        },
                      })
                    }
                    placeholder="Grade"
                    className="p-3 rounded-md bg-gray-900 border border-gray-700"
                  />
                  <input
                    value={newItems.education.startYear}
                    onChange={(e) =>
                      setNewItems({
                        ...newItems,
                        education: {
                          ...newItems.education,
                          startYear: e.target.value,
                        },
                      })
                    }
                    type="number"
                    placeholder="Start Year"
                    className="p-3 rounded-md bg-gray-900 border border-gray-700"
                  />
                  <input
                    value={newItems.education.endYear}
                    onChange={(e) =>
                      setNewItems({
                        ...newItems,
                        education: {
                          ...newItems.education,
                          endYear: e.target.value,
                        },
                      })
                    }
                    type="number"
                    placeholder="End Year"
                    className="p-3 rounded-md bg-gray-900 border border-gray-700"
                  />
                  <textarea
                    value={newItems.education.description}
                    onChange={(e) =>
                      setNewItems({
                        ...newItems,
                        education: {
                          ...newItems.education,
                          description: e.target.value,
                        },
                      })
                    }
                    placeholder="Description"
                    rows={3}
                    className="p-3 rounded-md bg-gray-900 border border-gray-700 resize-none md:col-span-2"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddEducation}
                  className="mt-3 bg-cyan-600 p-3 rounded-md w-full max-w-sm mx-auto block hover:bg-cyan-700"
                >
                  Add Education
                </button>
              </div>
            )}

            {/* Experience Section */}
            {activeSection === "experience" && (
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white space-y-6">
                <h2 className="mb-4 text-2xl font-bold">Experience</h2>
                <div className="space-y-4 max-h-72 overflow-y-auto">
                  {form.experience.length === 0 && (
                    <p className="italic text-gray-400">
                      No experience added yet.
                    </p>
                  )}
                  {form.experience.map((exp) => (
                    <div
                      key={exp._id}
                      className="p-4 rounded bg-gray-900 flex justify-between items-start"
                    >
                      <div>
                        <h3 className="font-semibold">{exp.role}</h3>
                        <p className="text-sm text-cyan-400">{exp.company}</p>
                        {(exp.startDate || exp.endDate) && (
                          <p className="text-sm">
                            {exp.startDate || ""} -{" "}
                            {exp.isCurrentJob ? "Present" : exp.endDate || ""}
                          </p>
                        )}
                        {exp.location && (
                          <p className="text-sm">{exp.location}</p>
                        )}
                        {exp.description && (
                          <p className="mt-2 text-sm">{exp.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveExperience(exp._id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <Trash2 />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    value={newItems.experience.company}
                    onChange={(e) =>
                      setNewItems({
                        ...newItems,
                        experience: {
                          ...newItems.experience,
                          company: e.target.value,
                        },
                      })
                    }
                    placeholder="Company *"
                    className="p-3 rounded-md bg-gray-900 border border-gray-700"
                  />
                  <input
                    value={newItems.experience.role}
                    onChange={(e) =>
                      setNewItems({
                        ...newItems,
                        experience: {
                          ...newItems.experience,
                          role: e.target.value,
                        },
                      })
                    }
                    placeholder="Role *"
                    className="p-3 rounded-md bg-gray-900 border border-gray-700"
                  />
                  <input
                    value={newItems.experience.location}
                    onChange={(e) =>
                      setNewItems({
                        ...newItems,
                        experience: {
                          ...newItems.experience,
                          location: e.target.value,
                        },
                      })
                    }
                    placeholder="Location"
                    className="p-3 rounded-md bg-gray-900 border border-gray-700"
                  />
                  <input
                    type="date"
                    value={newItems.experience.startDate}
                    onChange={(e) =>
                      setNewItems({
                        ...newItems,
                        experience: {
                          ...newItems.experience,
                          startDate: e.target.value,
                        },
                      })
                    }
                    className="p-3 rounded-md bg-gray-900 border border-gray-700"
                  />
                  <input
                    type="date"
                    value={
                      新Items?.experience?.isCurrentJob
                        ? ""
                        : newItems.experience.endDate
                    }
                    onChange={(e) =>
                      setNewItems({
                        ...newItems,
                        experience: {
                          ...newItems.experience,
                          endDate: e.target.value,
                        },
                      })
                    }
                    disabled={newItems.experience.isCurrentJob}
                    className="p-3 rounded-md bg-gray-900 border border-gray-700 disabled:opacity-50"
                  />
                  <label className="flex items-center gap-2 text-gray-400">
                    <input
                      type="checkbox"
                      checked={newItems.experience.isCurrentJob}
                      onChange={(e) =>
                        setNewItems({
                          ...newItems,
                          experience: {
                            ...newItems.experience,
                            isCurrentJob: e.target.checked,
                            endDate: "",
                          },
                        })
                      }
                      className="rounded border-gray-600 text-cyan-500"
                    />
                    Current job
                  </label>
                  <textarea
                    value={newItems.experience.description}
                    onChange={(e) =>
                      setNewItems({
                        ...newItems,
                        experience: {
                          ...newItems.experience,
                          description: e.target.value,
                        },
                      })
                    }
                    placeholder="Description"
                    rows={3}
                    className="p-3 rounded-md bg-gray-900 border border-gray-700 resize-none md:col-span-2"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddExperience}
                  className="mt-3 bg-cyan-600 p-3 rounded-md w-full max-w-sm mx-auto block hover:bg-cyan-700"
                >
                  Add Experience
                </button>
              </div>
            )}

            {/* Projects Section */}
            {activeSection === "projects" && (
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white space-y-6">
                <h2 className="mb-4 text-2xl font-bold">Projects</h2>
                <div className="space-y-4 max-h-72 overflow-y-auto">
                  {form.projects.length === 0 && (
                    <p className="italic text-gray-400">
                      No projects added yet.
                    </p>
                  )}
                  {form.projects.map((proj) => (
                    <div
                      key={proj._id}
                      className="p-4 rounded bg-gray-900 flex justify-between items-start"
                    >
                      <div>
                        <h3 className="font-semibold flex items-center gap-2">
                          {proj.name}
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              proj.status === "completed"
                                ? "bg-green-700 text-green-300"
                                : proj.status === "in-progress"
                                ? "bg-yellow-700 text-yellow-300"
                                : "bg-gray-700 text-gray-400"
                            }`}
                          >
                            {proj.status}
                          </span>
                        </h3>
                        <p className="mt-1 text-sm">{proj.description}</p>
                        {proj.techStack?.length > 0 && (
                          <div className="flex flex-wrap mt-2 gap-2">
                            {proj.techStack.map((tech, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-orange-700 px-2 py-0.5 rounded"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-4 mt-2 text-sm text-gray-400">
                          {(proj.startDate || proj.endDate) && (
                            <p>
                              <Calendar className="inline w-4 h-4 mr-1" />
                              {proj.startDate || ""} -{" "}
                              {proj.endDate || "Present"}
                            </p>
                          )}
                          {proj.link && (
                            <a
                              href={proj.link}
                              target="_blank"
                              rel="noreferrer"
                              className="hover:text-cyan-400 flex items-center gap-1"
                            >
                              <ExternalLink className="w-4 h-4" /> Live demo
                            </a>
                          )}
                          {proj.githubLink && (
                            <a
                              href={proj.githubLink}
                              target="_blank"
                              rel="noreferrer"
                              className="hover:text-cyan-400 flex items-center gap-1"
                            >
                              <Code className="w-4 h-4" /> GitHub
                            </a>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveProject(proj._id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <Trash2 />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    value={newItems.project.name}
                    onChange={(e) =>
                      setNewItems({
                        ...newItems,
                        project: { ...newItems.project, name: e.target.value },
                      })
                    }
                    placeholder="Project Name *"
                    className="p-3 rounded-md bg-gray-900 border border-gray-700"
                  />
                  <select
                    value={newItems.project.status}
                    onChange={(e) =>
                      setNewItems({
                        ...newItems,
                        project: {
                          ...newItems.project,
                          status: e.target.value,
                        },
                      })
                    }
                    className="p-3 rounded-md bg-gray-900 border border-gray-700"
                  >
                    <option value="completed">Completed</option>
                    <option value="in-progress">In progress</option>
                    <option value="planned">Planned</option>
                  </select>
                  <input
                    value={newItems.project.link}
                    onChange={(e) =>
                      setNewItems({
                        ...newItems,
                        project: { ...newItems.project, link: e.target.value },
                      })
                    }
                    type="url"
                    placeholder="Live Demo URL"
                    className="p-3 rounded-md bg-gray-900 border border-gray-700"
                  />
                  <input
                    value={newItems.project.githubLink}
                    onChange={(e) =>
                      setNewItems({
                        ...newItems,
                        project: {
                          ...newItems.project,
                          githubLink: e.target.value,
                        },
                      })
                    }
                    type="url"
                    placeholder="GitHub URL"
                    className="p-3 rounded-md bg-gray-900 border border-gray-700"
                  />
                  <input
                    value={newItems.project.startDate}
                    onChange={(e) =>
                      setNewItems({
                        ...newItems,
                        project: {
                          ...newItems.project,
                          startDate: e.target.value,
                        },
                      })
                    }
                    type="date"
                    className="p-3 rounded-md bg-gray-900 border border-gray-700"
                  />
                  <input
                    value={newItems.project.endDate}
                    onChange={(e) =>
                      setNewItems({
                        ...newItems,
                        project: {
                          ...newItems.project,
                          endDate: e.target.value,
                        },
                      })
                    }
                    type="date"
                    className="p-3 rounded-md bg-gray-900 border border-gray-700"
                  />
                  <textarea
                    value={newItems.project.description}
                    onChange={(e) =>
                      setNewItems({
                        ...newItems,
                        project: {
                          ...newItems.project,
                          description: e.target.value,
                        },
                      })
                    }
                    placeholder="Description"
                    rows={3}
                    className="p-3 rounded-md bg-gray-900 border border-gray-700 resize-none md:col-span-2"
                  />
                  <input
                    value={newItems.project.techStack}
                    onChange={(e) =>
                      setNewItems({
                        ...newItems,
                        project: {
                          ...newItems.project,
                          techStack: e.target.value,
                        },
                      })
                    }
                    placeholder="Tech Stack (comma separated)"
                    className="p-3 rounded-md bg-gray-900 border border-gray-700 md:col-span-2"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddProject}
                  className="mt-3 bg-cyan-600 p-3 rounded-md w-full max-w-sm mx-auto block hover:bg-cyan-700"
                >
                  Add Project
                </button>
              </div>
            )}

            {/* Submit */}
            <div className="sticky bottom-6 bg-gradient-to-t from-slate-900/50 to-transparent pt-4">
              <button
                type="submit"
                disabled={saving}
                className="w-full p-4 text-lg bg-cyan-600 rounded-md hover:bg-cyan-700 disabled:opacity-70 flex items-center justify-center gap-3 shadow-lg"
              >
                {saving && <Loader2 className="animate-spin" />}
                <Save />
                {isNewUser ? "Create Profile" : "Save Changes"}
              </button>
              {isNewUser && (
                <p className="text-cyan-400 text-center mt-2 text-sm">
                  Your profile will be saved and editable anytime
                </p>
              )}
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default MyProfile;
