import React, { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import {
  Search,
  Filter,
  UserCircle,
  MapPin,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
} from "lucide-react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

// ---------------- Leaflet Icon Fix ----------------
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// ---------------- Mock Data Pools ----------------
// Dummy job data sets
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

const cityCoordinates = {
  Remote: [20.5937, 78.9629], // India's central location
  Bangalore: [12.9716, 77.5946],
  Hyderabad: [17.385, 78.4867],
  Delhi: [28.6791, 77.0697],
  Mumbai: [19.076, 72.8777],
  Chennai: [13.0827, 80.2707],
  Pune: [18.5204, 73.8567],
  SanFrancisco: [37.7749, -122.4194],
  London: [51.5074, -0.1278],
  Berlin: [52.52, 13.405],
  NewYork: [40.7128, -74.006],
  Paris: [48.8566, 2.3522],
  Tokyo: [35.6897, 139.6922],
  Singapore: [1.3521, 103.8198],
  Sydney: [-33.8688, 151.2093],
  Toronto: [43.6532, -79.3832],
  Amsterdam: [52.3676, 4.9041],
  Dublin: [53.3498, -6.2603],
  Zurich: [47.3769, 8.5417],
  MexicoCity: [19.4326, -99.1332],
  Dubai: [25.2048, 55.2708],
  Seoul: [37.5665, 126.978],
  HongKong: [22.3193, 114.1694],
  LosAngeles: [34.0522, -118.2437],
  Chicago: [41.8781, -87.6298],
  Boston: [42.3601, -71.0589],
  Melbourne: [-37.8136, 144.9631],
  Vancouver: [49.2827, -123.1207],
  Barcelona: [41.3851, 2.1734],
  Moscow: [55.7558, 37.6173],
  SaoPaulo: [-23.5505, -46.6333],
  Johannesburg: [-26.2041, 28.0473],
  Stockholm: [59.3293, 18.0686],
  Vienna: [48.2082, 16.3738],
  Brussels: [50.8503, 4.3517],
  Copenhagen: [55.6761, 12.5683],
  Munich: [48.1351, 11.582],
  Lisbon: [38.7223, -9.1393],
  Budapest: [47.4979, 19.0402],
  Warsaw: [52.2297, 21.0122],
  Madrid: [40.4168, -3.7038],
  Rome: [41.9028, 12.4964],
  KualaLumpur: [3.139, 101.6869],
  Bangkok: [13.7563, 100.5018],
  Jakarta: [-6.2088, 106.8456],
  CapeTown: [-33.9249, 18.4241],
  Helsinki: [60.1699, 24.9384],
  Oslo: [59.9139, 10.7522],
  Montreal: [45.5017, -73.5673],
  Lagos: [6.5244, 3.3792],
  BuenosAires: [-34.6037, -58.3816],
  Quito: [-0.1807, -78.4678],
  Bogota: [4.711, -74.0721],
  Caracas: [10.4806, -66.9036],
  Lima: [-12.0464, -77.0428],
  Santiago: [-33.4489, -70.6693],
  Prague: [50.0755, 14.4378],
  Ljubljana: [46.0569, 14.5058],
  Tallinn: [59.437, 24.7536],
  Riga: [56.9496, 24.1052],
  Vilnius: [54.6872, 25.2797],
  Luxembourg: [49.6116, 6.1319],
  Athens: [37.9838, 23.7275],
  Brisbane: [-27.4698, 153.0251],
  Adelaide: [-34.9285, 138.6007],
  Perth: [-31.9505, 115.8605],
  Calgary: [51.0447, -114.0719],
  Halifax: [44.6488, -63.5752],
  Ottawa: [45.4215, -75.6997],
  Montpellier: [43.6108, 3.8767],
  Nantes: [47.2184, -1.5536],
  Dusseldorf: [51.2277, 6.7735],
  Frankfurt: [50.1109, 8.6821],
  Hamburg: [53.5511, 9.9937],
  Cologne: [50.9375, 6.9603],
  Leipzig: [51.3397, 12.3731],
  Bilbao: [43.263, -2.935],
  Valencia: [39.4699, -0.3763],
  Seville: [37.3891, -5.9845],
  Florence: [43.7696, 11.2558],
  Venice: [45.4408, 12.3155],
  Bordeaux: [44.8378, -0.5792],
  Nice: [43.7102, 7.262],
  Glasgow: [55.8642, -4.2518],
  Edinburgh: [55.9533, -3.1883],
  Cardiff: [51.4816, -3.1791],
  Belfast: [54.5973, -5.9301],
  Leeds: [53.8008, -1.5491],
  Manchester: [53.4808, -2.2426],
  Liverpool: [53.4084, -2.9916],
  Bristol: [51.4545, -2.5879],
  Sheffield: [53.3811, -1.4701],
  Nottingham: [52.9548, -1.1581],
  Derby: [52.9225, -1.4746],
  Leicester: [52.6369, -1.1398],
  Coventry: [52.4068, -1.5197],
  Southampton: [50.9097, -1.4044],
  Portsmouth: [50.8198, -1.088],
  Brighton: [50.8225, -0.1372],
  Cambridge: [52.2053, 0.1218],
  Oxford: [51.752, -1.2577],
  York: [53.959, -1.0815],
  Durham: [54.7761, -1.5733],
};

// Utility: Random element
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Generate mock jobs
function generateJobs(count = 500) {
  return Array.from({ length: count }).map((_, i) => {
    const location = getRandom(locations);
    const minSalary = 5 + Math.floor(Math.random() * 10);
    const maxSalary = minSalary + Math.floor(Math.random() * 10);
    return {
      id: i + 1,
      title: getRandom(titles),
      company: getRandom(companies),
      location,
      coordinates: cityCoordinates[location],
      salary: `${minSalary} - ${maxSalary} LPA`,
      type: getRandom(jobTypes),
      applicants: Math.floor(Math.random() * 500),
      posted: `${1 + Math.floor(Math.random() * 30)} days ago`,
      description:
        "Join a dynamic team working on exciting projects with cutting edge technology.",
    };
  });
}

// ---------------- JobMap Component ----------------
const JobMap = ({ coordinates, location }) => (
  <MapContainer
    center={coordinates}
    zoom={13}
    style={{ height: "200px", width: "100%", borderRadius: 8, marginTop: 10 }}
    scrollWheelZoom={false}
  >
    <TileLayer
      attribution='©️ <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Marker position={coordinates}>
      <Popup>{location}</Popup>
    </Marker>
  </MapContainer>
);

// ---------------- JobCard Component ----------------
const JobCard = ({ job, isSaved, toggleSave, onApplyClick }) => {
  const [showMap, setShowMap] = useState(false);

  return (
    <div className="bg-gray-800 p-5 rounded-xl shadow-2xl transition-all duration-300 hover:shadow-cyan-500/20 hover:scale-[1.02] flex flex-col transform animate-fadeInUp">
      <div className="flex justify-between items-start">
        <div className="flex-grow">
          <h3 className="text-2xl text-white font-bold leading-tight">
            {job.title}
          </h3>
          <p className="text-gray-400 text-sm mt-1">{job.company}</p>
          <p className="text-gray-500 flex items-center gap-1 text-xs mt-1">
            <MapPin className="w-4 h-4 text-cyan-400" />
            {job.location}
          </p>
        </div>
        <button
          onClick={() => toggleSave(job.id)}
          title={isSaved ? "Unsave job" : "Save job"}
          className="p-2 transition-transform duration-200 hover:scale-125 active:scale-90"
        >
          {isSaved ? (
            <BookmarkCheck className="w-6 h-6 text-cyan-400" />
          ) : (
            <Bookmark className="w-6 h-6 text-gray-500" />
          )}
        </button>
      </div>
      <p className="mt-4 text-gray-300 text-sm leading-relaxed">
        {job.description}
      </p>
      <div className="flex items-center gap-4 text-sm mt-4 text-gray-500">
        <span className="flex items-center gap-1">
          <span className="bg-gray-700 px-2 py-1 rounded-full text-xs font-semibold">
            {job.type}
          </span>
        </span>
        <span className="flex items-center gap-1">
          <span className="bg-gray-700 px-2 py-1 rounded-full text-xs font-semibold">
            {job.salary}
          </span>
        </span>
        <span className="flex items-center gap-1">
          <span className="bg-gray-700 px-2 py-1 rounded-full text-xs font-semibold">
            {job.applicants} applicants
          </span>
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => setShowMap((s) => !s)}
          className="text-cyan-400 font-semibold text-sm hover:underline self-start transition-colors"
        >
          {showMap ? "Hide Location" : "Show Location"}
        </button>
        <button
          onClick={() => onApplyClick(job)}
          className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold px-6 py-2 rounded-full shadow-lg hover:shadow-cyan-500/50 transition-all transform hover:scale-105"
        >
          Apply Now
        </button>
      </div>
      {showMap && job.coordinates && (
        <JobMap coordinates={job.coordinates} location={job.location} />
      )}
    </div>
  );
};

// ---------------- JobPortalHeader ----------------
const JobPortalHeader = ({
  search,
  setSearch,
  showFilters,
  setShowFilters,
  userName = "Guest",
  appliedCount,
}) => {
  const navigator = useNavigate();
  return (
    <header className="sticky top-0 z-50 bg-gray-950/70 backdrop-blur-lg border-b border-indigo-700 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xl">
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-br from-indigo-700 to-indigo-900 rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-transform hover:scale-110">
         <img src={assets.logo} alt="" />
        </div>
        <h1 className="text-white text-2xl font-extrabold tracking-wide select-none">
          AI Career <span className="text-cyan-400">Craft</span>
        </h1>
      </div>
      <div className="flex flex-grow max-w-xl relative">
        <Search className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
        <input
          type="search"
          aria-label="Search jobs"
          placeholder="Search jobs by title or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-full pl-10 pr-4 py-2 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all"
        />
      </div>
      <div className="flex items-center gap-4">
        <div className="relative p-2 bg-gray-800 rounded-full shadow-md">
          <ClipboardCheck onClick={()=>navigator('/ai/job-matcher/job-avalable/jobportal')} className="text-cyan-400 w-6 h-6" />
          <span className="absolute top-0 right-0 -mt-1 -mr-1 px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
            {appliedCount}
          </span>
        </div>
        <button
          aria-label="Toggle Filters"
          onClick={() => setShowFilters((show) => !show)}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:from-emerald-700 active:to-teal-700 text-white font-semibold px-4 py-2 rounded-full shadow-lg transition-all"
        >
          <Filter className="w-5 h-5" />
          <span className="hidden sm:inline">Filters</span>
        </button>
        
      </div>
    </header>
  );
};

// ---------------- JobPortal Main ----------------
export default function JobPortal() {
  const { getToken, userId, isSignedIn, user } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [appliedJobsCount, setAppliedJobsCount] = useState(0);

  // ---------------- Fetch Applied Jobs ----------------
  const fetchAppliedJobsCount = async () => {
    if (!isSignedIn) return;
    try {
      const token = await getToken();
      const response = await axios.get(
        `http://localhost:4000/api/appliedjobs/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppliedJobsCount(response.data.length);
    } catch (error) {
      console.error("Failed to fetch applied jobs:", error);
    }
  };

  // ---------------- Apply Job ----------------
  const handleApplyClick = async (job) => {
    if (!isSignedIn) {
      alert("Please sign in to apply for jobs!");
      return;
    }
    try {
      const token = await getToken();
      await axios.post(
        "http://localhost:4000/api/appliedjobs/apply",
        { userId, jobId: job.id, title: job.title, company: job.company },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Applied successfully!");
      fetchAppliedJobsCount();
    } catch (error) {
      console.error("Error applying for job:", error);
      alert(error.response?.data?.message || "Error applying for job.");
    }
  };

  // ---------------- Generate Jobs ----------------
  useEffect(() => {
    setJobs(generateJobs(500));
    fetchAppliedJobsCount();
  }, [isSignedIn]);

  // ---------------- Filters ----------------
  const filteredJobs = useMemo(() => {
    const s = search.toLowerCase();
    return jobs.filter(
      (job) =>
        (job.title.toLowerCase().includes(s) ||
          job.company.toLowerCase().includes(s)) &&
        (locationFilter ? job.location === locationFilter : true) &&
        (typeFilter ? job.type === typeFilter : true)
    );
  }, [jobs, search, locationFilter, typeFilter]);

  const JOBS_PER_PAGE = 10;
  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
  const currentJobs = filteredJobs.slice(
    (page - 1) * JOBS_PER_PAGE,
    page * JOBS_PER_PAGE
  );

  const toggleSaveJob = (id) => {
    setSavedJobs((prev) => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
  };

  return (
    <div className="min-h-screen font-sans antialiased text-gray-200 bg-gray-900 relative">
      <div
        className="bg-fixed bg-cover bg-center absolute inset-0 -z-10"
        style={{
          backgroundImage: `url('https://source.unsplash.com/random/1920x1080/?tech,abstract')`,
        }}
      >
        <div className="absolute inset-0 bg-gray-900/80"></div>
      </div>

      <JobPortalHeader
        search={search}
        setSearch={setSearch}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        userName={user?.firstName || "Guest"}
        appliedCount={appliedJobsCount}
      />

      {showFilters && (
        <div className="max-w-7xl mx-auto px-6 py-4 bg-gray-900/70 backdrop-blur-md text-white rounded-b-lg shadow-inner flex gap-4 flex-wrap justify-center sticky top-20 z-40">
          <select
            className="p-2 rounded bg-gray-800 text-white border-none focus:ring-2 focus:ring-cyan-400 focus:outline-none"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <option value="">All Locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          <select
            className="p-2 rounded bg-gray-800 text-white border-none focus:ring-2 focus:ring-cyan-400 focus:outline-none"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            {jobTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 py-8 grid gap-6">
        {currentJobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            isSaved={savedJobs.has(job.id)}
            toggleSave={toggleSaveJob}
            onApplyClick={handleApplyClick}
          />
        ))}
      </main>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-3 py-4">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 disabled:opacity-50"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 disabled:opacity-50"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
