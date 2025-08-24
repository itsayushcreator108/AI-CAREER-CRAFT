import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ClipboardList } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@clerk/clerk-react";

const JobPortal = () => {
  const { getToken, isSignedIn, userId } = useAuth();
  const navigate = useNavigate();
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppliedJobs = async () => {
    if (!isSignedIn) {
      toast.error("Please sign in to see applied jobs.");
      setLoading(false);
      return;
    }

    try {
      const token = await getToken();
      const response = await axios.get(
        `http://localhost:4000/api/appliedjob/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAppliedJobs(response.data); // array of applied jobs
    } catch (error) {
      console.error("Failed to fetch applied jobs:", error);
      toast.error("Failed to fetch applied jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppliedJobs();
  }, [isSignedIn, userId, getToken]);

  return (
    <div className="min-h-screen bg-gray-900 p-6 max-w-4xl mx-auto text-white">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-teal-600 rounded hover:bg-teal-700 flex items-center gap-2"
      >
        <ChevronLeft size={20} />
        Back
      </button>

      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <ClipboardList size={28} />
        Applied Jobs ({appliedJobs.length})
      </h1>

      {loading ? (
        <p className="text-center text-gray-400">Loading applied jobs...</p>
      ) : appliedJobs.length === 0 ? (
        <p className="text-center text-gray-400">No jobs applied yet.</p>
      ) : (
        <ul className="grid gap-6">
          {appliedJobs.map(({ _id, title, company, appliedDate }) => (
            <li
              key={_id}
              className="bg-gray-800 p-6 rounded shadow hover:shadow-teal-500 transition"
            >
              <h2 className="text-xl font-semibold text-teal-400 mb-1">{title}</h2>
              <p className="text-gray-300 mb-2">{company}</p>
              <p className="text-gray-400 text-sm">
                Applied on: {new Date(appliedDate).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}

      <ToastContainer position="top-right" autoClose={2500} />
    </div>
  );
};

export default JobPortal;
