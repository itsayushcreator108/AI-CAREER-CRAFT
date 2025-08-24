const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: String,
    type: { type: String, enum: ["Full-time", "Part-time", "Internship", "Remote"], default: "Full-time" },
    description: String,
    skillsRequired: [String],
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // recruiter/admin
    postedAt: { type: Date, default: Date.now },
  });
  
  export default mongoose.model("Job", jobSchema);
  