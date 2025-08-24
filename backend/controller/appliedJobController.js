import AppliedJob from "../model/AppliedJob.js";

// Function to save a new applied job
export  const applyForJob = async (req, res) => {
  try {
    const { userId, jobId, title, company } = req.body;

    const newAppliedJob = new AppliedJob({
      userId,
      jobId,
      title,
      company
    });

    await newAppliedJob.save();
    res.status(201).json({ message: 'Job applied successfully!', appliedJob: newAppliedJob });
  } catch (error) {
    res.status(500).json({ message: 'Failed to apply for the job.', error: error.message });
  }
};

// Function to get all applied jobs for a specific user
export const getAppliedJobs = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);
    
    const appliedJobs = await AppliedJob.find({ userId });
    res.status(200).json(appliedJobs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch applied jobs.', error: error.message });
  }
};

