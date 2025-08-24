import React, { useEffect, useMemo, useState, useRef } from "react";
import axios from "axios";
import { useUser, useAuth } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import {
  FileText,
  BarChart2,
  Image as ImageIcon,
  Bell,
  User,
  Mail,
  MapPin,
  Link as LinkIcon,
  ChevronRight,
  Loader2,
  CheckCircle2,
  XCircle,
  Code2,
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const cardGrad = "from-slate-700 via-slate-800 to-slate-900";

const StatCard = ({ icon: Icon, label, value }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    className={`flex items-center justify-between p-5 rounded-xl shadow-md bg-gradient-to-r ${cardGrad} bg-opacity-80 transition-all`}
  >
    <div>
      <h2 className="text-2xl font-bold">
        {Number.isFinite(value) ? value : "—"}
      </h2>
      <p className="text-sm mt-1 text-gray-200">{label}</p>
    </div>
    <div className="p-3 bg-slate-700/30 rounded-full">
      <Icon className="w-6 h-6 text-white" />
    </div>
  </motion.div>
);

const Pill = ({ children }) => (
  <span className="px-3 py-1 rounded-full text-xs bg-slate-700/60 border border-slate-600 text-gray-100">
    {children}
  </span>
);

const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-slate-700/40 rounded-md ${className}`} />
);

export default function Dashboard() {
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [applications, setApplications] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [appliedJobsCount, setAppliedJobsCount] = useState(0);

  const [activeSection, setActiveSection] = useState(null);

  // Section refs for smooth scrolling
  const refProfile = useRef(null);
  const refSkills = useRef(null);
  const refActivity = useRef(null);

  // Axios instance bound to Clerk token
  const api = useMemo(() => {
    const instance = axios.create({ baseURL: BASE_URL, withCredentials: true });
    instance.interceptors.request.use(async (config) => {
      try {
        const token = await getToken();
        if (token) config.headers["Authorization"] = `Bearer ${token}`;
      } catch (_) {}
      return config;
    });
    return instance;
  }, [getToken]);

  useEffect(() => {
    let alive = true;
    async function fetchAll() {
      if (!isSignedIn) return;
      setLoading(true);
      setError("");

      try {
        const uid = user?.id;
        const requests = [
          api.get("/api/users/profile"),
          api.get("/api/users/skills"),
          api.get("/api/users/applications"),
          api.get("/api/optdb/list"),
          uid
            ? api.get(`/api/portfolio/${uid}`)
            : Promise.resolve({ data: { data: [] } }),
          api.get("/api/codequest/history"),
          uid ? api.get(`/api/appliedjobs/${uid}`) : Promise.resolve({ data: [] }),
        ];

        const [p, s, a, r, pf, cq, aj] = await Promise.allSettled(requests);

        if (!alive) return;

        const val = (res, path) =>
          res?.status === "fulfilled"
            ? res.value?.data?.[path] ?? res.value?.data
            : null;
        setProfile(val(p, "user") || null);
        setSkills(val(s, "skills") || []);
        setApplications(val(a, "applications") || []);
        setResumes(val(r, "data") || []);
        setPortfolios(val(pf, "data") || []);
        setSubmissions(val(cq, "submissions") || []);
        setAppliedJobsCount(val(aj) ? (Array.isArray(val(aj)) ? val(aj).length : 0) : 0);

        const anyRejected = [p, s, a, r, pf, cq, aj].some(
          (x) => x.status === "rejected"
        );
        if (anyRejected)
          setError("Some sections failed to load. Showing what we could.");
      } catch (err) {
        setError(err?.message || "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
    return () => {
      alive = false;
    };
  }, [api, isSignedIn, user]);

  // Derived stats (no hardcoding)
  const stats = [
    {
      key: "codequest",
      label: "CodeQuest Attempted",
      value: submissions?.length || 0,
      icon: Code2,
    },
    { key: "resumes", label: "Resumes Analyzed", value: resumes?.length || 0, icon: FileText },
    { key: "skills", label: "Skill Count", value: skills?.length || 0, icon: BarChart2 },
    {
      key: "portfolios",
      label: "Portfolios Created",
      value: portfolios?.length || 0,
      icon: ImageIcon,
    },
    {
      key: "appliedJobs",
      label: "Applied Jobs",
      value: appliedJobsCount,
      icon: ChevronRight,
    },
  ];

  // Build a concise recent activity feed from all sources
  const activity = [];
  if (applications?.length) {
    const last = applications[0];
    activity.push({
      type: "application",
      text: `Applied to ${last?.job?.title || "a job"} @ ${
        last?.job?.company || "—"
      }`,
      ok: true,
      at: last?.appliedAt,
    });
  }
  if (resumes?.length) {
    const last = resumes[0];
    activity.push({
      type: "resume",
      text: "New resume uploaded/optimized",
      ok: true,
      at: last?.createdAt,
    });
  }
  if (submissions?.length) {
    const last = submissions[0];
    const parsed = safeParseJSON(last?.report);
    activity.push({
      type: "codequest",
      text: `CodeQuest: ${parsed?.correct === "Yes" ? "Passed" : "Reviewed"}`,
      ok: parsed?.correct === "Yes",
      at: last?.submittedAt,
    });
  }
  if (skills?.length) {
    activity.push({
      type: "skills",
      text: `Skills updated (${skills.length})`,
      ok: true,
    });
  }

  function safeParseJSON(s) {
    try {
      return typeof s === "string" ? JSON.parse(s) : s;
    } catch {
      return null;
    }
  }

  const displayName =
    profile?.fullName || user?.fullName || user?.firstName || "AI Professional";

  const scrollTo = (ref) =>
    ref?.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="relative w-full h-[calc(93vh-56px)] bg-slate-900 text-white flex flex-col overflow-hidden">
      {/* Top nav / greeting */}
      <header className="flex-shrink-0 sticky top-0 z-20 border-b border-slate-800 bg-slate-900/80 backdrop-blur flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-slate-800/70">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm text-slate-300">Welcome back</div>
            <div className="text-lg font-semibold">{displayName}</div>
          </div>
        </div>
        <nav className="flex items-center gap-2">
          <button
            onClick={() => scrollTo(refProfile)}
            className="px-3 py-1.5 text-sm rounded-lg bg-slate-800 hover:bg-slate-700 transition"
          >
            Profile
          </button>
          <button
            onClick={() => scrollTo(refSkills)}
            className="px-3 py-1.5 text-sm rounded-lg bg-slate-800 hover:bg-slate-700 transition"
          >
            Skills
          </button>
          <button
            onClick={() => scrollTo(refActivity)}
            className="px-3 py-1.5 text-sm rounded-lg bg-slate-800 hover:bg-slate-700 transition"
          >
            Activity
          </button>
        </nav>
      </header>

      {/* Scrollable content area (flex-grow ensures visible bottom) */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-6 custom-scroll space-y-8 relative">
        {/* Decorative blobs */}
        <div className="pointer-events-none select-none absolute inset-0">
          <div className="absolute top-24 left-10 w-40 h-40 bg-slate-700/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-slate-800/20 rounded-full blur-3xl animate-float-delayed"></div>
        </div>

        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold drop-shadow-md relative z-10">
            Your <span className="text-emerald-400">AI Career OS</span>
          </h1>
          <p className="text-gray-300 mt-2 max-w-2xl relative z-10">
            Manage profiles, applications, resumes, and practice — all in one
            place.
          </p>
          {error && (
            <div className="mt-3 text-sm text-amber-300 flex items-center gap-2 relative z-10">
              <XCircle className="w-4 h-4" /> {error}
            </div>
          )}
        </motion.div>

        {/* Stats */}
        <section className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-24" />
                ))
              : stats.map((s) => (
                  <div
                    key={s.key}
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      setActiveSection(activeSection === s.key ? null : s.key)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter")
                        setActiveSection(activeSection === s.key ? null : s.key);
                    }}
                    className="cursor-pointer"
                  >
                    <StatCard icon={s.icon} label={s.label} value={s.value} />
                  </div>
                ))}
          </div>

          {/* Conditional Detail Section */}
          {activeSection && (
            <section className="mt-6 p-6 bg-slate-800/40 rounded-xl shadow-inner text-white max-w-7xl mx-auto">
              {activeSection === "codequest" && (
                <>
                  <h3 className="text-2xl font-bold mb-4">CodeQuest Attempts</h3>
                  {loading ? (
                    <Skeleton className="h-32" />
                  ) : submissions.length ? (
                    <ul className="list-disc list-inside max-h-64 overflow-auto">
                      {submissions.map((item, idx) => {
                        const parsed = safeParseJSON(item.report);
                        return (
                          <li key={idx}>
                            Attempt on {new Date(item.submittedAt).toLocaleString()} -{" "}
                            {parsed?.correct === "Yes" ? (
                              <span className="text-emerald-400">Passed</span>
                            ) : (
                              <span className="text-amber-400">Reviewed</span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p>No CodeQuest attempts found.</p>
                  )}
                </>
              )}

              {activeSection === "resumes" && (
                <>
                  <h3 className="text-2xl font-bold mb-4">Resumes Analyzed</h3>
                  {loading ? (
                    <Skeleton className="h-32" />
                  ) : resumes.length ? (
                    <ul className="list-disc list-inside max-h-64 overflow-auto">
                      {resumes.map((r, idx) => (
                        <li key={idx}>
                          Uploaded on {new Date(r.createdAt).toLocaleString()}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No resumes uploaded yet.</p>
                  )}
                </>
              )}

              {activeSection === "skills" && (
                <>
                  <h3 className="text-2xl font-bold mb-4">Skills</h3>
                  {loading ? (
                    <Skeleton className="h-24" />
                  ) : skills.length ? (
                    <div className="flex flex-wrap gap-2">
                      {skills.map((sk, idx) => (
                        <Pill key={idx}>{sk}</Pill>
                      ))}
                    </div>
                  ) : (
                    <p>No skills added yet.</p>
                  )}
                </>
              )}

              {activeSection === "portfolios" && (
                <>
                  <h3 className="text-2xl font-bold mb-4">Portfolios Created</h3>
                  {loading ? (
                    <Skeleton className="h-32" />
                  ) : portfolios.length ? (
                    <ul className="list-disc list-inside max-h-64 overflow-auto">
                      {portfolios.map((pf, idx) => (
                        <li key={idx}>
                          {pf.title || "Untitled Portfolio"} - Created on{" "}
                          {new Date(pf.createdAt).toLocaleDateString()}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No portfolios created yet.</p>
                  )}
                </>
              )}

              {activeSection === "appliedJobs" && (
                <>
                  <h3 className="text-2xl font-bold mb-4">Applied Jobs</h3>
                  {loading ? (
                    <Skeleton className="h-32" />
                  ) : applications.length ? (
                    <ul className="list-disc list-inside max-h-64 overflow-auto">
                      {applications.map((app, idx) => (
                        <li key={idx}>
                          Applied to {app.job?.title || "a job"} @{" "}
                          {app.job?.company || "—"} on{" "}
                          {new Date(app.appliedAt).toLocaleString()}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No job applications found.</p>
                  )}
                </>
              )}
            </section>
          )}
        </section>

        {/* Profile Snapshot */}
        <section ref={refProfile} className="max-w-7xl mx-auto relative z-10">
          <div className="bg-slate-800/40 backdrop-blur-md rounded-xl p-6 shadow-inner">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <User className="w-5 h-5" /> Profile Snapshot
              </h3>
              <a
                href="#"
                className="text-emerald-400 text-sm inline-flex items-center gap-1 hover:underline"
              >
                View full profile <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-sm text-slate-200 items-center">
                {profile?.photoImgUrl ? (
                  <img
                    src={profile.photoImgUrl}
                    alt={profile?.fullName || "Profile"}
                    className="w-16 h-16 rounded-full object-cover border border-slate-600"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center">
                    <User className="w-6 h-6 text-slate-400" />
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {profile?.fullName || "—"}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {profile?.email ||
                    user?.primaryEmailAddress?.emailAddress ||
                    "—"}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {profile?.location || "—"}
                </div>
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" />
                  {profile?.website || "—"}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Skills */}
        <section ref={refSkills} className="max-w-7xl mx-auto relative z-10">
          <div className="bg-slate-800/40 backdrop-blur-md rounded-xl p-6 shadow-inner">
            <h3 className="text-xl font-bold mb-4">Skills</h3>
            {loading ? (
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-24" />
                ))}
              </div>
            ) : skills?.length ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((sk) => (
                  <Pill key={sk}>{sk}</Pill>
                ))}
              </div>
            ) : (
              <div className="text-sm text-slate-300">No skills added yet.</div>
            )}
          </div>
        </section>

        {/* Recent Activity */}
        <section ref={refActivity} className="max-w-4xl mx-auto relative z-10">
          <div className="bg-slate-800/40 backdrop-blur-md rounded-xl p-6 shadow-inner">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5" /> Recent Activity
            </h3>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-7" />
                ))}
              </div>
            ) : activity?.length ? (
              <ul className="space-y-2 text-gray-200">
                {activity.slice(0, 6).map((ev, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    {ev.ok ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-amber-300" />
                    )}
                    <span>{ev.text}</span>
                    {ev.at && (
                      <span className="text-xs text-slate-400">
                        • {new Date(ev.at).toLocaleString()}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-slate-300">
                No recent activity yet. Start by uploading a resume or applying
                to a job.
              </div>
            )}
          </div>
        </section>

        {/* Load state inline footer */}
        {loading && (
          <div className="flex items-center justify-center gap-2 text-slate-300 py-6">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading live data…
          </div>
        )}
      </main>

      {/* Global styles: custom scrollbar + gentle float */}
      <style jsx global>{`
        .custom-scroll::-webkit-scrollbar {
          height: 8px;
          width: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: rgba(100, 116, 139, 0.5);
          border-radius: 9999px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.6);
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 8s ease-in-out infinite;
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
        }
      `}</style>
    </div>
  );
}
