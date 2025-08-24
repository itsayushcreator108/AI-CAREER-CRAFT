import mongoose from 'mongoose'

const appliedJobSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  jobId: {
    type: Number, // Assuming job IDs are numbers from your dummy data
    required: true
  },
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  appliedDate: {
    type: Date,
    default: Date.now
  }
});

const AppliedJob = mongoose.model('AppliedJob', appliedJobSchema);

export default AppliedJob;