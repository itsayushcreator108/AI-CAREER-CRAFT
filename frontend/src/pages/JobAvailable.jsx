// import React, { useEffect, useState, useMemo } from "react";
// import {
//   Search,
//   MapPin,
//   Briefcase,
//   Clock,
//   DollarSign,
//   Filter,
//   Bookmark,
//   BookmarkCheck,
//   ChevronLeft,
//   ChevronRight,
//   Building2,
//   Globe,
//   Users,
//   X,
//   SlidersHorizontal,
//   MoreHorizontal
// } from "lucide-react";

// const titles = [
//   "Frontend Developer", "Backend Developer", "Full Stack Engineer",
//   "UI/UX Designer", "Data Analyst", "DevOps Engineer",
//   "Project Manager", "AI Engineer", "Software Architect",
//   "Mobile Developer", "Cloud Engineer", "Database Administrator",
//   "Product Manager", "QA Engineer", "Cybersecurity Analyst",
//   "Machine Learning Engineer", "Site Reliability Engineer", "Technical Lead"
// ];

// const companies = [
//   "TCS", "Infosys", "Wipro", "HCL", "Tech Mahindra", "Cognizant",
//   "Accenture", "IBM India", "Microsoft India", "Google India",
//   "Amazon India", "Flipkart", "Paytm", "Zomato", "Swiggy", "BYJU'S",
//   "Ola", "PhonePe", "Razorpay", "Freshworks", "Zoho", "Mindtree"
// ];

// const locations = [
//   "Bangalore", "Hyderabad", "Pune", "Chennai", "Mumbai", "Delhi NCR",
//   "Kolkata", "Ahmedabad", "Kochi", "Indore", "Jaipur", "Remote",
//   "Noida", "Gurgaon", "Coimbatore", "Thiruvananthapuram"
// ];

// const skills = [
//   "React", "Node.js", "Python", "Java", "JavaScript", "TypeScript",
//   "AWS", "Docker", "Kubernetes", "MongoDB", "PostgreSQL", "Redis",
//   "GraphQL", "REST API", "Microservices", "DevOps", "CI/CD", "Git"
// ];

// const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

// const generateJobs = (count) => {
//   const jobs = [];
//   for (let i = 1; i <= count; i++) {
//     const title = randomElement(titles);
//     const company = randomElement(companies);
//     const location = randomElement(locations);
//     const minSalary = 300000 + Math.floor(Math.random() * 700000);
//     const maxSalary = minSalary + Math.floor(Math.random() * 1000000);

//     jobs.push({
//       id: i,
//       title,
//       company,
//       location,
//       salary: `₹${(minSalary / 100000).toFixed(1)}L - ₹${(maxSalary / 100000).toFixed(1)}L`,
//       type: Math.random() > 0.3 ? "Full-time" : Math.random() > 0.5 ? "Part-time" : "Contract",
//       remote: Math.random() > 0.4,
//       experience: `${Math.floor(Math.random() * 8) + 1}-${Math.floor(Math.random() * 5) + Math.floor(Math.random() * 8) + 2} years`,
//       posted: Math.floor(Math.random() * 30) + 1,
//       promoted: Math.random() > 0.9,
//       applicants: Math.floor(Math.random() * 500) + 10,
//       skills: Array.from(new Set([...Array(Math.floor(Math.random() * 4) + 2)].map(() => randomElement(skills)))),
//       description: `We are looking for a talented ${title.toLowerCase()} to join our dynamic team at ${company}. This role offers excellent growth opportunities and competitive compensation.`,
//       companySize: randomElement(["1-10", "11-50", "51-200", "201-500", "500-1000", "1000+"]),
//       industry: randomElement(["Technology", "E-commerce", "Fintech", "Healthcare", "Education", "Gaming", "SaaS"])
//     });
//   }
//   return jobs;
// };

// const JOBS_PER_PAGE = 10;

// const JobPortal = () => {
//   const [jobs] = useState(() => generateJobs(500));
//   const [search, setSearch] = useState("");
//   const [locationFilter, setLocationFilter] = useState("");
//   const [experienceFilter, setExperienceFilter] = useState("");
//   const [typeFilter, setTypeFilter] = useState("All");
//   const [page, setPage] = useState(1);
//   const [savedJobs, setSavedJobs] = useState(new Set());
//   const [showFilters, setShowFilters] = useState(false);

//   const filteredJobs = useMemo(() => {
//     let result = jobs;

//     if (search) {
//       result = result.filter(job =>
//         job.title.toLowerCase().includes(search.toLowerCase()) ||
//         job.company.toLowerCase().includes(search.toLowerCase()) ||
//         job.location.toLowerCase().includes(search.toLowerCase()) ||
//         job.skills.some(skill => skill.toLowerCase().includes(search.toLowerCase()))
//       );
//     }

//     if (locationFilter && locationFilter !== "All") {
//       result = result.filter(job =>
//         locationFilter === "Remote" ? job.remote : job.location === locationFilter
//       );
//     }

//     if (typeFilter !== "All") {
//       if (typeFilter === "Remote") {
//         result = result.filter(job => job.remote);
//       } else {
//         result = result.filter(job => job.type === typeFilter);
//       }
//     }

//     if (experienceFilter && experienceFilter !== "All") {
//       const expNum = parseInt(experienceFilter);
//       result = result.filter(job => {
//         const minExp = parseInt(job.experience.split('-')[0]);
//         return minExp <= expNum;
//       });
//     }

//     return result;
//   }, [jobs, search, locationFilter, experienceFilter, typeFilter]);

//   const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
//   const currentJobs = filteredJobs.slice((page - 1) * JOBS_PER_PAGE, page * JOBS_PER_PAGE);

//   const toggleSaveJob = (jobId) => {
//     const newSavedJobs = new Set(savedJobs);
//     if (newSavedJobs.has(jobId)) {
//       newSavedJobs.delete(jobId);
//     } else {
//       newSavedJobs.add(jobId);
//     }
//     setSavedJobs(newSavedJobs);
//   };

//   const resetFilters = () => {
//     setSearch("");
//     setLocationFilter("");
//     setExperienceFilter("");
//     setTypeFilter("All");
//     setPage(1);
//   };

//   const getDaysText = (days) => {
//     if (days === 1) return "1 day ago";
//     if (days < 7) return `${days} days ago`;
//     if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`;
//     return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''} ago`;
//   };

//   return (
//     <div className="min-h-screen bg-gray-900">
//       {/* Header */}
//       <div className="bg-gray-800 border-b border-gray-700">
//         <div className="max-w-7xl mx-auto px-4 py-6">
//           <h1 className="text-3xl font-semibold text-white mb-6">Jobs</h1>

//           {/* Search Section */}
//           <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
//             <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                 <input
//                   type="text"
//                   placeholder="Search jobs..."
//                   value={search}
//                   onChange={(e) => {
//                     setSearch(e.target.value);
//                     setPage(1);
//                   }}
//                   className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
//                 />
//               </div>

//               <div className="relative">
//                 <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                 <select
//                   value={locationFilter}
//                   onChange={(e) => {
//                     setLocationFilter(e.target.value);
//                     setPage(1);
//                   }}
//                   className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none appearance-none"
//                 >
//                   <option value="">All locations</option>
//                   <option value="Remote">Remote</option>
//                   {[...new Set(locations)].sort().map(location => (
//                     <option key={location} value={location}>{location}</option>
//                   ))}
//                 </select>
//               </div>

//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="flex items-center justify-center gap-2 py-2 px-4 bg-gray-800 border border-gray-600 rounded text-white hover:bg-gray-700 transition-colors"
//               >
//                 <Filter className="w-4 h-4" />
//                 All filters
//               </button>

//               <button className="py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors">
//                 Search
//               </button>
//             </div>
//           </div>

//           {/* Advanced Filters */}
//           {showFilters && (
//             <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//                 <select
//                   value={experienceFilter}
//                   onChange={(e) => {
//                     setExperienceFilter(e.target.value);
//                     setPage(1);
//                   }}
//                   className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none"
//                 >
//                   <option value="">Experience level</option>
//                   <option value="0">Entry level (0-2 years)</option>
//                   <option value="3">Mid level (3-5 years)</option>
//                   <option value="6">Senior level (6+ years)</option>
//                 </select>

//                 <select
//                   value={typeFilter}
//                   onChange={(e) => {
//                     setTypeFilter(e.target.value);
//                     setPage(1);
//                   }}
//                   className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none"
//                 >
//                   <option value="All">Job type</option>
//                   <option value="Full-time">Full-time</option>
//                   <option value="Part-time">Part-time</option>
//                   <option value="Contract">Contract</option>
//                   <option value="Remote">Remote</option>
//                 </select>

//                 <button
//                   onClick={resetFilters}
//                   className="flex items-center justify-center gap-2 py-2 px-4 text-blue-400 hover:text-blue-300 transition-colors"
//                 >
//                   <X className="w-4 h-4" />
//                   Clear all
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 py-6">
//         {/* Results Info */}
//         <div className="flex items-center justify-between mb-6">
//           <p className="text-gray-300">
//             {filteredJobs.length.toLocaleString()} results
//           </p>
//           <div className="text-sm text-gray-400">
//             Showing {((page - 1) * JOBS_PER_PAGE) + 1}-{Math.min(page * JOBS_PER_PAGE, filteredJobs.length)} of {filteredJobs.length}
//           </div>
//         </div>

//         {/* Job List */}
//         <div className="space-y-4">
//           {currentJobs.map((job) => (
//             <div
//               key={job.id}
//               className="bg-gray-800 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors"
//             >
//               <div className="p-6">
//                 <div className="flex justify-between items-start">
//                   <div className="flex-1">
//                     {/* Job Header */}
//                     <div className="flex items-start justify-between mb-3">
//                       <div>
//                         <h3 className="text-xl font-semibold text-white mb-1 hover:text-blue-400 cursor-pointer">
//                           {job.title}
//                         </h3>
//                         <p className="text-gray-300 text-lg">{job.company}</p>
//                         <p className="text-gray-400 text-sm">{job.location} · {getDaysText(job.posted)}</p>
//                       </div>

//                       <div className="flex items-center gap-2">
//                         <button
//                           onClick={() => toggleSaveJob(job.id)}
//                           className="p-2 hover:bg-gray-700 rounded transition-colors"
//                           title={savedJobs.has(job.id) ? "Unsave" : "Save"}
//                         >
//                           {savedJobs.has(job.id) ? (
//                             <BookmarkCheck className="w-5 h-5 text-blue-400" />
//                           ) : (
//                             <Bookmark className="w-5 h-5 text-gray-400" />
//                           )}
//                         </button>
//                         <button className="p-2 hover:bg-gray-700 rounded transition-colors">
//                           <MoreHorizontal className="w-5 h-5 text-gray-400" />
//                         </button>
//                       </div>
//                     </div>

//                     {/* Job Details */}
//                     <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-400">
//                       <span className="flex items-center gap-1">
//                         <Briefcase className="w-4 h-4" />
//                         {job.type}
//                       </span>
//                       <span className="flex items-center gap-1">
//                         <DollarSign className="w-4 h-4" />
//                         {job.salary}
//                       </span>
//                       <span className="flex items-center gap-1">
//                         <Clock className="w-4 h-4" />
//                         {job.experience}
//                       </span>
//                       {job.remote && (
//                         <span className="flex items-center gap-1">
//                           <Globe className="w-4 h-4" />
//                           Remote
//                         </span>
//                       )}
//                       <span className="flex items-center gap-1">
//                         <Users className="w-4 h-4" />
//                         {job.applicants} applicants
//                       </span>
//                     </div>

//                     {/* Job Description */}
//                     <p className="text-gray-300 mb-4 line-clamp-2">
//                       {job.description}
//                     </p>

//                     {/* Skills */}
//                     <div className="flex flex-wrap gap-2 mb-4">
//                       {job.skills.slice(0, 4).map((skill, idx) => (
//                         <span
//                           key={idx}
//                           className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm border border-gray-600"
//                         >
//                           {skill}
//                         </span>
//                       ))}
//                       {job.skills.length > 4 && (
//                         <span className="px-3 py-1 text-gray-400 text-sm">
//                           +{job.skills.length - 4} more
//                         </span>
//                       )}
//                     </div>

//                     {/* Promoted Label */}
//                     {job.promoted && (
//                       <div className="text-xs text-gray-500 mb-3">
//                         Promoted
//                       </div>
//                     )}
//                   </div>

//                   {/* Apply Button */}
//                   <div className="ml-6 flex flex-col gap-2">
//                     <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors whitespace-nowrap">
//                       Easy Apply
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* No Results */}
//         {currentJobs.length === 0 && (
//           <div className="text-center py-20 bg-gray-800 rounded-lg border border-gray-700">
//             <div className="text-6xl mb-4">🔍</div>
//             <h3 className="text-2xl font-semibold text-white mb-2">No jobs found</h3>
//             <p className="text-gray-400 mb-6">
//               Try broadening your search or check back later for new opportunities
//             </p>
//             <button
//               onClick={resetFilters}
//               className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors"
//             >
//               Clear filters
//             </button>
//           </div>
//         )}

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex justify-center items-center gap-4 mt-8">
//             <button
//               onClick={() => setPage(Math.max(1, page - 1))}
//               disabled={page === 1}
//               className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
//             >
//               <ChevronLeft className="w-4 h-4" />
//               Previous
//             </button>

//             <div className="flex gap-1">
//               {[...Array(Math.min(7, totalPages))].map((_, i) => {
//                 const pageNum = Math.max(1, Math.min(totalPages - 6, page - 3)) + i;
//                 if (pageNum > totalPages) return null;

//                 return (
//                   <button
//                     key={pageNum}
//                     onClick={() => setPage(pageNum)}
//                     className={`w-10 h-10 rounded font-medium transition-colors ${
//                       page === pageNum
//                         ? "bg-blue-600 text-white"
//                         : "bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700"
//                     }`}
//                   >
//                     {pageNum}
//                   </button>
//                 );
//               })}
//             </div>

//             <button
//               onClick={() => setPage(Math.min(totalPages, page + 1))}
//               disabled={page === totalPages}
//               className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
//             >
//               Next
//               <ChevronRight className="w-4 h-4" />
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default JobPortal;

import React, { useEffect, useState, useMemo } from "react";
import { assets } from "../assets/assets";
import toast, { Toaster } from "react-hot-toast";
import {
  Search,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  Building2,
  Globe,
  Users,
  X,
  MoreHorizontal,
  Sun,
  Moon,
} from "lucide-react";

/* ---------------- Mock Job Pools ---------------- */
const titles = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "UI/UX Designer",
  "Mobile Developer",
  "DevOps Engineer",
  "Data Scientist",
  "Product Manager",
  "ML Engineer",
  "Cloud Architect",
  "QA Engineer",
  "Security Analyst",
  "Software Engineer",
  "Software Architect",
  "Network Engineer",
  "System Administrator",
  "Database Administrator",
  "Solutions Architect",
  "Technical Lead",
  "Chief Technology Officer",
  "Business Analyst",
  "Scrum Master",
  "Test Automation Engineer",
  "Embedded Systems Engineer",
  "Blockchain Developer",
  "Game Developer",
  "Hardware Engineer",
  "Site Reliability Engineer",
  "Data Engineer",
  "Big Data Engineer",
  "AI Researcher",
  "Machine Learning Scientist",
  "Data Analyst",
  "IT Manager",
  "Cloud Engineer",
  "Mobile App Developer",
  "Cybersecurity Engineer",
  "Penetration Tester",
  "Security Consultant",
  "Technical Writer",
  "Release Manager",
  "Support Engineer",
  "Sales Engineer",
  "Customer Success Manager",
  "Digital Marketing Manager",
  "SEO Specialist",
  "Content Strategist",
  "Graphic Designer",
  "Frontend Lead",
  "Backend Lead",
  "QA Lead",
  "DevOps Lead",
  "Infrastructure Engineer",
  "Software Tester",
  "UX Researcher",
  "Database Developer",
  "Web Developer",
  "Wordpress Developer",
  "E-commerce Manager",
  "Mobile UX Designer",
  "Android Developer",
  "iOS Developer",
  "Cloud Solutions Architect",
  "AR/VR Developer",
  "Robotics Engineer",
  "AI Developer",
  "Analytics Manager",
  "Data Warehouse Architect",
  "IT Security Manager",
  "Technical Support Specialist",
  "CRM Administrator",
  "IT Consultant",
  "Product Owner",
  "Hardware Technician",
  "Network Security Specialist",
  "Performance Engineer",
  "Big Data Analyst",
  "Systems Engineer",
  "Voice Engineer",
  "Middleware Developer",
  "API Developer",
  "Embedded Software Developer",
  "Firmware Engineer",
  "Release Engineer",
  "Cloud Security Engineer",
  "IT Auditor",
  "Operations Manager",
  "Test Engineer",
  "Quality Assurance Engineer",
  "Mobile Game Developer",
  "E-learning Developer",
  "Business Intelligence Developer",
  "Application Support Analyst",
  "Cloud Infrastructure Engineer",
  "DevSecOps Engineer",
  "Information Security Analyst",
  "Scrum Product Owner",
  "Agile Coach",
  "Data Visualisation Designer",
  "Helpdesk Technician",
  "IT Trainer",
  "UX/UI Specialist",
  "Research Scientist",
  "Software Development Manager",
  "Chief Information Officer",
  "Technical Project Manager",
  "Instructional Designer",
  "Systems Architect",
  "Security Engineer",
  "Java Developer",
  "Python Developer",
  "Ruby on Rails Developer",
  "PHP Developer",
  "C++ Developer",
  "C# Developer",
  "Go Developer",
  "Scala Developer",
  "Perl Developer",
  "SQL Developer",
  "Salesforce Developer",
  "SAP Consultant",
  "Oracle Developer",
  "Business Systems Analyst",
  "Release Coordinator",
  "Network Administrator",
  "Cloud Developer",
  "Digital Product Manager",
  "IT Infrastructure Manager",
  "Network Architect",
  "Storage Engineer",
  "Data Migration Consultant",
  "ETL Developer",
  "Technical Architect",
  "User Researcher",
  "Content Developer",
  "Media Buyer",
  "Social Media Manager",
  "Email Marketing Specialist",
  "Mobile Solutions Architect",
  "IT Operations Specialist",
  "Game Designer",
  "AR Developer",
  "VR Designer",
  "Technology Evangelist",
  "Front-end Engineer",
  "Back-end Engineer",
  "Full Stack Engineer",
  "Technical Consultant",
  "Solutions Engineer",
  "Embedded Engineer",
  "Systems Programmer",
  "Data Governance Specialist",
  "Security Analyst",
  "Cloud Consultant",
  "Information Systems Manager",
  "Business Development Manager",
  "Technical Recruiter",
  "IT Business Analyst",
  "MuleSoft Developer",
  "Digital Strategist",
  "IT Compliance Manager",
  "Linux Administrator",
  "Windows Administrator",
  "BI Analyst",
  "ERP Consultant",
  "Mobile QA Engineer",
  "AI Engineer",
  "Deep Learning Engineer",
  "Pen Tester",
  "UI Developer",
  "UX Designer",
  "Web Designer",
  "SEO Analyst",
  "Content Manager",
  "Video Producer",
  "Customer Support Specialist",
  "Business Intelligence Manager",
  "Network Engineer",
  "Cloud Engineer",
  "QA Automation Engineer",
  "Mobile Developer",
  "Cybersecurity Consultant",
];

const companies = [
  "OpenAI",
  "Google",
  "Microsoft",
  "Amazon",
  "Meta",
  "Netflix",
  "Tesla",
  "Apple",
  "Stripe",
  "Airbnb",
  "Spotify",
  "Adobe",
  "Salesforce",
  "Oracle",
  "IBM",
  "Intel",
  "Cisco",
  "Uber",
  "Dropbox",
  "Nvidia",
  "Slack",
  "Twitter",
  "Square",
  "Zoom",
  "Snapchat",
  "Pinterest",
  "PayPal",
  "Atlassian",
  "Red Hat",
  "VMware",
  "Huawei",
  "SAP",
  "Dell",
  "Accenture",
  "Infosys",
  "Wipro",
  "TCS",
  "HCL Technologies",
  "Cognizant",
  "Capgemini",
  "Fujitsu",
  "Samsung",
  "LG",
  "Siemens",
  "Sony",
  "eBay",
  "Booking.com",
  "LinkedIn",
  "GitHub",
  "ZoomInfo",
  "Twitch",
  "Yahoo",
  "Yelp",
  "Zillow",
  "Baidu",
  "Tencent",
  "Alibaba",
  "JD.com",
  "Flipkart",
  "Paytm",
  "Zomato",
  "Swiggy",
  "Ola",
  "PhonePe",
  "Razorpay",
  "Freshworks",
  "Zoho",
  "Mindtree",
  "Qualcomm",
  "AMD",
  "Micron",
  "Texas Instruments",
  "Nokia",
  "Ericsson",
  "Square Enix",
  "Electronic Arts",
  "Ubisoft",
  "Capcom",
  "Riot Games",
  "Activision Blizzard",
  "Valve",
  "Epic Games",
  "Cloudflare",
  "GitLab",
  "HashiCorp",
  "MongoDB",
  "Datadog",
  "New Relic",
  "Snowflake",
  "Twilio",
  "Elastic",
  "Okta",
  "PagerDuty",
  "CrowdStrike",
  "Fortinet",
  "Proofpoint",
  "McAfee",
  "Check Point",
  "Juniper Networks",
  "Arista Networks",
  "Box",
  "DocuSign",
  "Tableau",
  "Workday",
  "ServiceNow",
  "Splunk",
  "Asana",
  "Robinhood",
  "Coinbase",
  "Lyft",
  "Instacart",
  "DoorDash",
  "Postmates",
  "Grubhub",
  "Reddit",
  "Quora",
  "Medium",
  "Tumblr",
  "WordPress.com",
  "Mozilla",
  "Automattic",
  "JetBrains",
  "Docker, Inc.",
  "Canonical",
  "Linux Foundation",
  "Blue Origin",
  "SpaceX",
  "Rocket Lab",
  "Virgin Galactic",
  "Boeing",
  "Lockheed Martin",
  "Northrop Grumman",
  "Raytheon Technologies",
  "General Dynamics",
  "Honeywell",
  "Siemens Healthineers",
  "GE Healthcare",
  "Philips Healthcare",
  "Medtronic",
  "Stryker",
  "Boston Scientific",
  "3M Health Care",
  "Johnson & Johnson",
  "Abbott Laboratories",
  "Roche",
  "Novartis",
  "Pfizer",
  "Merck & Co.",
  "AstraZeneca",
  "GlaxoSmithKline",
];

const locations = [
  "Remote",
  "Bangalore",
  "Hyderabad",
  "Delhi",
  "Mumbai",
  "Chennai",
  "Pune",
  "San Francisco",
  "London",
  "Berlin",
  "New York",
  "Paris",
  "Tokyo",
  "Singapore",
  "Sydney",
  "Toronto",
  "Amsterdam",
  "Dublin",
  "Zurich",
  "Mexico City",
  "Dubai",
  "Seoul",
  "Hong Kong",
  "Los Angeles",
  "Chicago",
  "Boston",
  "Melbourne",
  "Vancouver",
  "Barcelona",
  "Moscow",
  "São Paulo",
  "Johannesburg",
  "Stockholm",
  "Vienna",
  "Brussels",
  "Copenhagen",
  "Munich",
  "Lisbon",
  "Budapest",
  "Warsaw",
  "Madrid",
  "Rome",
  "Kuala Lumpur",
  "Bangkok",
  "Jakarta",
  "Cape Town",
  "Helsinki",
  "Oslo",
  "Montreal",
  "Lagos",
  "Buenos Aires",
  "Quito",
  "Bogotá",
  "Caracas",
  "Lima",
  "Santiago",
  "Prague",
  "Ljubljana",
  "Tallinn",
  "Riga",
  "Vilnius",
  "Luxembourg",
  "Athens",
  "Brisbane",
  "Adelaide",
  "Perth",
  "Calgary",
  "Halifax",
  "Ottawa",
  "Montpellier",
  "Nantes",
  "Düsseldorf",
  "Frankfurt",
  "Hamburg",
  "Cologne",
  "Leipzig",
  "Bilbao",
  "Valencia",
  "Seville",
  "Florence",
  "Venice",
  "Bordeaux",
  "Nice",
  "Glasgow",
  "Edinburgh",
  "Cardiff",
  "Belfast",
  "Leeds",
  "Manchester",
  "Liverpool",
  "Bristol",
  "Sheffield",
  "Nottingham",
  "Derby",
  "Leicester",
  "Coventry",
  "Southampton",
  "Portsmouth",
  "Brighton",
  "Cambridge",
  "Oxford",
  "York",
  "Durham",
];

const jobTypes = ["Full-Time", "Part-Time", "Internship", "Contract"];

/* ---------------- Utility ---------------- */
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateJobs = (count = 500) =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: getRandom(titles),
    company: getRandom(companies),
    location: getRandom(locations),
    type: getRandom(jobTypes),
    salary: `${5 + Math.floor(Math.random() * 25)} - ${
      15 + Math.floor(Math.random() * 35)
    } LPA`,
    applicants: Math.floor(Math.random() * 500),
    posted: `${1 + Math.floor(Math.random() * 30)}d ago`,
    remote: Math.random() > 0.5,
    description:
      "Join our team to work on cutting-edge projects, collaborate with top talent, and make an impact at scale.",
  }));

/* ---------------- Component ---------------- */
export default function JobPortal() {
  /* Theme system */
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const initial = saved === "light" || saved === "dark" ? saved : "dark";
    setTheme(initial);
    document.documentElement.classList.add(initial);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(next);
  };

  /* Jobs */
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [savedJobs, setSavedJobs] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setJobs(generateJobs(500));
  }, []);

  /* Filtering */
  const filteredJobs = useMemo(
    () =>
      jobs.filter(
        (job) =>
          (search
            ? (job.title + job.company + job.location)
                .toLowerCase()
                .includes(search.toLowerCase())
            : true) &&
          (location ? job.location === location : true) &&
          (jobType ? job.type === jobType : true)
      ),
    [jobs, search, location, jobType]
  );

  /* Pagination */
  const jobsPerPage = 6;
  const paginatedJobs = filteredJobs.slice(
    (page - 1) * jobsPerPage,
    page * jobsPerPage
  );
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  /* Actions */
  const toggleSave = (id) => {
    setSavedJobs((prev) => {
      if (prev.includes(id)) {
        toast("Removed from saved jobs", { icon: "❌" });
        return prev.filter((jobId) => jobId !== id);
      } else {
        toast.success("Job saved successfully");
        return [...prev, id];
      }
    });
  };

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setJobType("");
    setPage(1);
    toast("Filters cleared", { icon: "🧹" });
  };

  const chip =
    "px-3 py-1 rounded-full border text-xs font-medium bg-white/5 dark:bg-white/5 border-white/10 text-gray-700 dark:text-gray-200";

  return (
    <div className="relative w-full h-[calc(120vh-56px)] transition-colors duration-300 bg-gray-50 dark:bg-[#0a0a0a]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-2xl bg-white/20 dark:bg-black/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between py-3">
          {/* Logo + Brand */}
          <div className="flex items-center gap-3">
            <div className="relative bg-gray-800/60 dark:bg-gray-900/50 backdrop-blur-lg rounded-2xl p-2 shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 border border-emerald-400/30">
              <img
                src={assets.logo}
                alt="AI Career OS Logo"
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain filter drop-shadow-md"
              />
            </div>
            <h1 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
              AI Career <span className="text-emerald-400">OS</span>
            </h1>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex px-3 py-1 rounded-full text-sm font-medium bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
              {filteredJobs.length} results
            </span>
          </div>
        </div>
      </nav>

      {/* Search & Filters */}
      <div className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
        <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-lg p-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search jobs..."
              className="w-full pl-10 pr-3 py-2 rounded-xl bg-white/90 dark:bg-black/30 border border-black/5 dark:border-white/10 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
            />
          </div>

          <select
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setPage(1);
            }}
            className="p-2 rounded-xl bg-white/90 dark:bg-black/30 border border-black/5 dark:border-white/10 text-gray-800 dark:text-gray-100"
          >
            <option value="">All Locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>

          <select
            value={jobType}
            onChange={(e) => {
              setJobType(e.target.value);
              setPage(1);
            }}
            className="p-2 rounded-xl bg-white/90 dark:bg-black/30 border border-black/5 dark:border-white/10 text-gray-800 dark:text-gray-100"
          >
            <option value="">All Job Types</option>
            {jobTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl shadow hover:bg-red-600"
          >
            <X className="w-4 h-4" /> Clear
          </button>
        </div>

        {/* Jobs Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedJobs.map((job) => (
            <div
              key={job.id}
              className="group rounded-2xl border border-black/5 dark:border-white/10 bg-white/80 dark:bg-white/[0.06] backdrop-blur-xl shadow-lg hover:shadow-xl transition overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-500 transition">
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                      <Building2 className="w-4 h-4" /> {job.company}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleSave(job.id)}
                    className="p-2 rounded-lg border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10"
                  >
                    {savedJobs.includes(job.id) ? (
                      <BookmarkCheck className="w-5 h-5 text-indigo-500" />
                    ) : (
                      <Bookmark className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                    )}
                  </button>
                </div>

                {/* Job Info */}
                <div className="mt-3 space-y-2 text-sm">
                  <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <MapPin className="w-4 h-4" /> {job.location}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Briefcase className="w-4 h-4" /> {job.type}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <DollarSign className="w-4 h-4" /> {job.salary}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Users className="w-4 h-4" /> {job.applicants} applicants
                  </p>
                  <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Clock className="w-4 h-4" /> {job.posted}
                  </p>
                </div>

                {/* Apply Button */}
                <button
                  onClick={() => toast.success("Applied Successfully 🚀")}
                  className="mt-4 w-full bg-gradient-to-r from-indigo-500 to-purple-600 
                                                   text-white py-2 rounded-xl shadow-lg hover:opacity-90 
                                                   transition-all duration-300"
                >
                  Easy Apply
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-3 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-2 rounded-full bg-white/80 dark:bg-white/10 border 
                                             border-black/5 dark:border-white/10 shadow hover:scale-105 
                                             disabled:opacity-40 disabled:hover:scale-100 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="font-medium text-gray-700 dark:text-gray-300">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-2 rounded-full bg-white/80 dark:bg-white/10 border 
                                             border-black/5 dark:border-white/10 shadow hover:scale-105 
                                             disabled:opacity-40 disabled:hover:scale-100 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
