import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";

const PersonalisedJob = () => {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: "all",
    location: "all",
    remote: "all",
    experience: "all",
  });
  const [sortBy, setSortBy] = useState("match");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock Data
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
    "Data Scientist",
    "Digital Strategist",
    "IT Compliance Manager",
    "Scrum Master",
    "Linux Administrator",
    "Windows Administrator",
    "BI Analyst",
    "ERP Consultant",
    "Mobile QA Engineer",
    "AI Engineer",
    "Deep Learning Engineer",
    "Security Analyst",
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
    "Spotify",
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
    "Intel",
    "Qualcomm",
    "AMD",
    "Micron",
    "Texas Instruments",
    "Nokia",
    "Ericsson",
    "LG Electronics",
    "FICO",
    "Square Enix",
    "Electronic Arts",
    "Ubisoft",
    "Capcom",
    "Riot Games",
    "Activision Blizzard",
    "Valve",
    "Epic Games",
    "Dropbox",
    "Cloudflare",
    "GitLab",
    "HashiCorp",
    "Atlassian",
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
    "Cisco Systems",
    "Juniper Networks",
    "Arista Networks",
    "Box",
    "DocuSign",
    "Tableau",
    "Workday",
    "ServiceNow",
    "Splunk",
    "SAP SE",
    "Adobe Systems",
    "NVIDIA",
    "GitHub",
    "Slack Technologies",
    "Zoom Video Communications",
    "Asana",
    "Elastic NV",
    "Cloudflare, Inc.",
    "Stripe, Inc.",
    "Square, Inc.",
    "Dropbox, Inc.",
    "Pinterest, Inc.",
    "Robinhood",
    "Coinbase",
    "PayPal Holdings, Inc.",
    "Uber Technologies, Inc.",
    "Lyft, Inc.",
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
    "GitHub",
    "JetBrains",
    "Docker, Inc.",
    "Canonical",
    "Debian Project",
    "Linux Foundation",
    "Samsung Electronics",
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
    "Zurich",
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

  const allSkills = [
    "React",
    "Node.js",
    "Python",
    "Java",
    "AWS",
    "Docker",
    "Kubernetes",
    "MongoDB",
    "GraphQL",
    "DevOps",
    "JavaScript",
    "TypeScript",
    "C++",
    "C#",
    "Ruby",
    "PHP",
    "Scala",
    "Swift",
    "Objective-C",
    "Go",
    "Rust",
    "HTML",
    "CSS",
    "Sass",
    "Less",
    "Bootstrap",
    "Tailwind CSS",
    "jQuery",
    "Angular",
    "Vue.js",
    "Next.js",
    "Nuxt.js",
    "Express.js",
    "Flask",
    "Django",
    "Spring Boot",
    "Laravel",
    "Symfony",
    "ASP.NET",
    "SQL",
    "MySQL",
    "PostgreSQL",
    "Oracle",
    "SQLite",
    "Firebase",
    "Redis",
    "Cassandra",
    "Elasticsearch",
    "Hadoop",
    "Spark",
    "TensorFlow",
    "PyTorch",
    "OpenCV",
    "Scrum",
    "Kanban",
    "Agile",
    "Waterfall",
    "Jira",
    "Trello",
    "Confluence",
    "Git",
    "GitHub",
    "GitLab",
    "Bitbucket",
    "CircleCI",
    "Jenkins",
    "Travis CI",
    "Azure DevOps",
    "Terraform",
    "Ansible",
    "Chef",
    "Puppet",
    "Nagios",
    "Prometheus",
    "Grafana",
    "Selenium",
    "Cypress",
    "Jest",
    "Mocha",
    "Chai",
    "Enzyme",
    "Postman",
    "Swagger",
    "Rest API",
    "SOAP",
    "OAuth",
    "JWT",
    "WebSockets",
    "Microservices",
    "Serverless",
    "Lambda",
    "CloudFormation",
    "OpenStack",
    "VMware",
    "Docker Swarm",
    "Helm",
    "Apache Kafka",
    "RabbitMQ",
    "ActiveMQ",
    "Solidity",
    "Blockchain",
    "Ethereum",
    "Hyperledger",
    "AI",
    "Machine Learning",
    "Deep Learning",
    "Data Science",
    "Data Analysis",
    "Business Intelligence",
    "Excel",
    "Power BI",
    "Tableau",
    "Looker",
    "Qlik",
    "Google Analytics",
    "SEO",
    "Content Marketing",
    "Email Marketing",
    "Google Ads",
    "Facebook Ads",
    "Copywriting",
    "UX Design",
    "UI Design",
    "Wireframing",
    "Prototyping",
    "Figma",
    "Sketch",
    "Adobe XD",
    "Photoshop",
    "Illustrator",
    "InDesign",
    "Video Editing",
    "Final Cut Pro",
    "Premiere Pro",
    "After Effects",
    "Sound Editing",
    "Audacity",
    "Salesforce",
    "SAP",
    "Oracle ERP",
    "Microsoft Dynamics",
    "ServiceNow",
    "Zendesk",
    "CRM",
    "Help Desk",
    "Customer Service",
    "Communication",
    "Leadership",
    "Team Management",
    "Project Management",
    "Time Management",
    "Problem Solving",
    "Critical Thinking",
    "Negotiation",
    "Adaptability",
    "Creativity",
    "Collaboration",
    "Conflict Resolution",
    "Public Speaking",
    "Writing",
    "Presentation",
    "Research",
    "Analytical Skills",
    "Attention to Detail",
    "Multitasking",
    "Networking",
    "Cloud Security",
    "Data Privacy",
    "Risk Management",
    "Compliance",
    "Ethical Hacking",
    "Penetration Testing",
    "Threat Analysis",
    "Mobile Development",
    "Android",
    "iOS",
    "React Native",
    "Flutter",
    "Xamarin",
    "Unity",
    "Unreal Engine",
    "Game Development",
    "AR",
    "VR",
    "IoT",
    "Embedded Systems",
    "Automation",
    "Robotics",
    "3D Printing",
    "Bitcoin",
    "Cryptocurrency",
    "AWS Lambda",
    "Google Cloud Platform",
    "Microsoft Azure",
    "Cloud Migration",
    "Big Data",
    "Data Engineering",
    "HDFS",
    "Pig",
    "Hive",
    "Scala Spark",
    "Kotlin",
    "Groovy",
    "Objective-C",
    "Dart",
    "Clojure",
    "Elixir",
    "CoffeeScript",
    "Svelte",
    "Ember.js",
    "Backbone.js",
    "Redux",
    "MobX",
    "RxJS",
    "Webpack",
    "Rollup",
    "Parcel",
    "Gulp",
    "Grunt",
    "Babel",
    "ESLint",
    "Prettier",
    "Jasmine",
    "QUnit",
    "Karma",
    "Protractor",
    "Nightwatch.js",
    "Cucumber",
    "Scrapy",
    "Beautiful Soup",
    "Apache Airflow",
    "Jupyter Notebook",
    "R Programming",
    "MATLAB",
    "SAS",
    "SPSS",
    "Stata",
    "PowerPoint",
    "Word",
    "Google Docs",
    "Google Sheets",
    "Google Slides",
    "Microsoft Office",
    "System Design",
    "Data Structures",
    "Algorithms",
    "Networking Protocols",
    "Operating Systems",
    "Linux",
    "Unix",
    "Windows Server",
    "MacOS",
    "Shell Scripting",
    "Bash",
    "PowerShell",
    "Object-Oriented Programming",
    "Functional Programming",
    "RESTful API Design",
    "API Gateway",
    "Graph Databases",
    "Neo4j",
    "Firebase",
    "AWS S3",
    "AWS EC2",
    "AWS RDS",
    "Google BigQuery",
    "AWS CloudWatch",
    "AWS EKS",
    "Azure Functions",
    "CI/CD Pipelines",
    "Docker Compose",
    "Nginx",
    "Apache HTTP Server",
    "Load Balancing",
    "Caching",
    "Memcached",
    "Varnish",
    "SEO Optimization",
    "Google Search Console",
    "Web Analytics",
    "A/B Testing",
    "Growth Hacking",
    "Inbound Marketing",
    "Outbound Marketing",
    "Lead Generation",
    "Customer Retention",
    "Brand Management",
    "Market Research",
    "Sales Strategy",
    "Account Management",
    "Fundraising",
    "Investor Relations",
    "Data Governance",
    "Information Architecture",
    "Business Process Improvement",
    "Change Management",
  ];

  const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const generateJobs = (count) => {
    const jobs = [];
    for (let i = 1; i <= count; i++) {
      const title = randomElement(titles);
      const company = randomElement(companies);
      const location = randomElement(locations);
      const minSalary = 6 + Math.floor(Math.random() * 8);
      const maxSalary = minSalary + Math.floor(Math.random() * 10);

      jobs.push({
        id: i,
        title,
        company,
        location,
        salary: `₹${minSalary}L - ₹${maxSalary}L`,
        type: Math.random() > 0.3 ? "Full-time" : "Contract",
        remote: Math.random() > 0.5,
        experience: `${Math.floor(Math.random() * 5) + 1}-${
          Math.floor(Math.random() * 8) + 2
        } yrs`,
        posted: Math.floor(Math.random() * 30) + 1,
        promoted: Math.random() > 0.85,
        applicants: Math.floor(Math.random() * 500) + 10,
        skills: Array.from(
          new Set(
            [...Array(Math.floor(Math.random() * 4) + 2)].map(() =>
              randomElement(allSkills)
            )
          )
        ),
      });
    }
    return jobs;
  };

  useEffect(() => {
    fetchUserSkills();
  }, []);

  const fetchUserSkills = async () => {
    try {
      setLoading(true);
      const token = await getToken(); // Clerk JWT
      const response = await axios.get(
        "http://localhost:4000/api/users/skills",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const skills = response.data.skills;
        setUserSkills(skills);
        if (skills.length > 0) generatePersonalizedJobs(skills);
        else
          setError(
            "Please add skills to your profile to get personalized recommendations"
          );
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
      setError("Failed to fetch your skills. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generatePersonalizedJobs = (skills) => {
    const allJobs = generateJobs(200);
    const matchingJobs = allJobs
      .map((job) => {
        const matchingSkills = job.skills.filter((skill) =>
          skills.some(
            (userSkill) => userSkill.toLowerCase() === skill.toLowerCase()
          )
        );
        const skillMatchScore = matchingSkills.length / job.skills.length;
        const userSkillCoverage = matchingSkills.length / skills.length;
        const overallScore =
          (skillMatchScore * 0.6 + userSkillCoverage * 0.4) * 100;

        return { ...job, matchingSkills, overallScore };
      })
      .filter((job) => job.matchingSkills.length > 0)
      .sort((a, b) => b.overallScore - a.overallScore)
      .slice(0, 50);

    setJobs(matchingJobs);
  };

  // Derived state: filtered + sorted jobs
  const filteredJobs = jobs
    .filter((job) => {
      // filter by type
      if (filters.type !== "all" && job.type !== filters.type) return false;
      // filter by location
      if (filters.location !== "all" && job.location !== filters.location)
        return false;
      // filter remote
      if (filters.remote === "remote" && !job.remote) return false;
      if (filters.remote === "onsite" && job.remote) return false;
      // filter by experience (basic check)
      if (
        filters.experience !== "all" &&
        !job.experience.includes(filters.experience)
      )
        return false;
      // search by title or company
      if (
        searchTerm &&
        !(
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
        return false;

      return true;
    })
    // sort logic
    .sort((a, b) => {
      if (sortBy === "match") return b.overallScore - a.overallScore;
      if (sortBy === "posted") return a.posted - b.posted;
      if (sortBy === "salary")
        return (
          parseInt(b.salary.replace(/\D/g, "")) -
          parseInt(a.salary.replace(/\D/g, ""))
        );
      if (sortBy === "company") return a.company.localeCompare(b.company);
      return 0;
    });

  // ---------------------- UI remains SAME as your version ----------------------
  // (Loader, Error UI, Header, Filters, Jobs Grid)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 p-6 text-gray-100">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/10 mb-6">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-400/70 shadow"></span>
          Jobs Tailored For You
        </h1>
        <p className="text-gray-400 mb-4">
          Personalized recommendations based on your skills and preferences
        </p>

        {/* Stats */}
        <div className="flex gap-4 flex-wrap">
          <div className="bg-gradient-to-r from-indigo-600/40 to-blue-600/40 px-5 py-3 rounded-xl shadow-lg backdrop-blur-md border border-white/10">
            <span className="block text-2xl font-bold text-white">
              {jobs.length}
            </span>
            <span className="text-sm text-gray-300">Perfect Matches</span>
          </div>
          <div className="bg-gradient-to-r from-emerald-500/30 to-teal-600/30 px-5 py-3 rounded-xl shadow-lg backdrop-blur-md border border-white/10">
            <span className="block text-2xl font-bold text-white">
              {userSkills.length}
            </span>
            <span className="text-sm text-gray-300">Your Skills</span>
          </div>
          <div className="bg-gradient-to-r from-gray-600/40 to-gray-800/40 px-5 py-3 rounded-xl shadow-lg backdrop-blur-md border border-white/10">
            <span className="block text-2xl font-bold text-white">
              {filteredJobs.length}
            </span>
            <span className="text-sm text-gray-300">Showing</span>
          </div>
        </div>

        {userSkills.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-gray-300 mb-2">Your Skills</h3>
            <div className="flex flex-wrap gap-2">
              {userSkills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500/20 to-indigo-600/20 text-blue-300 shadow-md border border-blue-400/20"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/10 mb-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search jobs, companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-3 justify-between">
          <div className="flex flex-wrap gap-3">
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Job Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Contract">Contract</option>
            </select>
            <select
              value={filters.remote}
              onChange={(e) =>
                setFilters({ ...filters, remote: e.target.value })
              }
              className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="remote">Remote</option>
              <option value="onsite">On-site</option>
            </select>
            <input
              type="text"
              placeholder="Filter by city..."
              value={filters.location === "all" ? "" : filters.location}
              onChange={(e) =>
                setFilters({ ...filters, location: e.target.value || "all" })
              }
              className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-blue-500"
          >
            <option value="match">Best Match</option>
            <option value="posted">Recently Posted</option>
            <option value="salary">Salary</option>
            <option value="company">Company</option>
          </select>
        </div>
      </div>

      {/* Jobs */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredJobs.length === 0 ? (
          <div className="col-span-full text-center bg-white/5 backdrop-blur-xl p-10 rounded-2xl shadow-lg border border-white/10">
            <div className="text-5xl mb-3 text-gray-500">🔎</div>
            <h3 className="text-lg font-bold text-white">No jobs found</h3>
            <p className="text-gray-400">
              Try adjusting your filters or search terms
            </p>
            <button
              onClick={() => {
                setFilters({
                  type: "all",
                  location: "all",
                  remote: "all",
                  experience: "all",
                });
                setSearchTerm("");
              }}
              className="mt-5 px-5 py-2 bg-gradient-to-r from-blue-600/70 to-indigo-700/70 text-white rounded-lg shadow hover:scale-105 transition"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg p-5 transition hover:-translate-y-1 hover:shadow-2xl"
            >
              {job.promoted && (
                <div className="absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-blue-400/70 to-indigo-500/70 text-white rounded-md text-xs font-semibold shadow">
                  Promoted
                </div>
              )}
              <div className="flex justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {job.title}
                  </h3>
                  <p className="text-gray-400">{job.company}</p>
                </div>
                <div className="text-center">
                  <div
                    className={`w-14 h-14 flex items-center justify-center rounded-full text-white font-bold text-sm mx-auto mb-1 shadow-md ${
                      job.overallScore >= 80
                        ? "bg-gradient-to-r from-blue-500/80 to-indigo-600/80"
                        : job.overallScore >= 60
                        ? "bg-gradient-to-r from-emerald-500/70 to-teal-600/70"
                        : "bg-gradient-to-r from-gray-600/60 to-gray-800/60"
                    }`}
                  >
                    {Math.round(job.overallScore)}%
                  </div>
                  <small className="text-gray-400">Match</small>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-2 py-1 bg-white/10 text-gray-300 rounded text-xs">
                  {job.location}
                </span>
                {job.remote && (
                  <span className="px-2 py-1 bg-emerald-400/20 text-emerald-300 rounded text-xs">
                    Remote
                  </span>
                )}
                <span className="px-2 py-1 bg-white/10 text-gray-300 rounded text-xs">
                  {job.type}
                </span>
                <span className="px-2 py-1 bg-white/10 text-gray-300 rounded text-xs">
                  {job.experience}
                </span>
              </div>

              <div className="mb-3">
                <span className="text-blue-400 font-semibold">
                  {job.salary}
                </span>
              </div>

              <div className="mb-3">
                <div className="flex justify-between mb-2 text-sm font-medium text-gray-300">
                  <span>Required Skills</span>
                  <span className="px-2 py-1 bg-blue-600/50 text-white rounded-full text-xs">
                    {job.matchingSkills.length}/{job.skills.length} match
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, i) => (
                    <span
                      key={i}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        job.matchingSkills.includes(skill)
                          ? "bg-gradient-to-r from-blue-600/70 to-indigo-700/70 text-white"
                          : "bg-white/10 text-gray-400"
                      }`}
                    >
                      {skill}
                      {job.matchingSkills.includes(skill) && " ✓"}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-white/10 pt-3">
                <div className="text-xs text-gray-400 flex gap-3">
                  <span>{job.applicants} applicants</span>
                  <span>{job.posted}d ago</span>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-600/70 to-indigo-700/70 text-white rounded-lg text-sm font-medium hover:scale-105 transition">
                    Apply
                  </button>
                  <button className="px-3 py-2 border border-white/20 rounded-lg text-sm text-gray-300 hover:bg-white/10">
                    Save
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PersonalisedJob;
