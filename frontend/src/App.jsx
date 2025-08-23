import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import ResumeAnalyser from "./pages/ResumeAnalyser";
import JobMatcher from "./pages/JobMatcher";
import SkillGapAnalyser from "./pages/SkillGapAnalyser";
import AIinterviewCoach from "./pages/AIinterviewCoach";
import PortfolioGenerator from "./pages/PortfolioGenerator";
import Community from "./pages/Community";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import ResumeUpload from "./pages/ResumeUpload";
import Ats from "./pages/Ats";
import ResumeOptimised from "./pages/ResumeOptimised";
import JobAvailable from "./pages/JobAvailable";
import PersonalisedJob from "./pages/PersonalisedJob";
import Salary from "./pages/Salary";
import Suggestion from "./pages/Suggestion";
import MockInterview from "./pages/MockInterview";
import Codequest from "./pages/Codequest";
import Progress from "./pages/Progress";

import Myprofile from "./pages/Myprofile";
import CodeQuestHistory from "./pages/CodeQuestHistory";
export default function App() {
  const { getToken } = useAuth();

  useEffect(() => {
    getToken().then((token) => console.log(token));
  }, []);
  return (
    <div>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ai" element={<Layout />}>
          <Route index element={<Dashboard />}></Route>
          <Route path="resume-analyser" element={<ResumeAnalyser />}></Route>
          <Route path="job-matcher" element={<JobMatcher />}></Route>
          <Route
            path="skill-gap-analyser"
            element={<SkillGapAnalyser />}
          ></Route>
          <Route path="interview-coach" element={<AIinterviewCoach />}></Route>
          <Route path="community" element={<Community />}></Route>
        </Route>

        <Route
          path="/ai/resume-analyser/resume-upload"
          element={<ResumeUpload />}
        />
        <Route path="/ai/resume-analyser/ats" element={<Ats />} />
        <Route
          path="/ai/resume-analyser/optimised"
          element={<ResumeOptimised />}
        />

        <Route path="/ai/job-matcher/job-avalable" element={<JobAvailable />} />
        <Route
          path="/ai/job-matcher/personalised-job"
          element={<PersonalisedJob />}
        />
        <Route path="/ai/job-matcher/salary" element={<Salary />} />
        <Route path="/ai/job-matcher/suggestions" element={<Suggestion />} />

        <Route
          path="/ai/interview-coach/mock-interview"
          element={<MockInterview />}
        />
        <Route path="/ai/interview-coach/codequest" element={<Codequest />} />
        <Route path="/ai/interview-coach/progress" element={<Progress />} />


        <Route path="/ai/my-profile" element={<Myprofile/>} />
        <Route path="/ai/interview-coach/codequest/history" element={<CodeQuestHistory/>} />
        <Route
            path="/ai/portfolio-generator"
            element={<PortfolioGenerator />}
          ></Route>
      </Routes>
    </div>
  );
}
