import express from 'express'
import { upload, analyzeSkillGap } from '../controller/skillGapController.js'

const SkillGaprouter = express.Router();

// Skill Gap Analysis Route
SkillGaprouter.post('/', upload.single('resume'), analyzeSkillGap);

// Health check route
SkillGaprouter.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Skill Gap Analyzer service is running',
    timestamp: new Date().toISOString()
  });
});

export default SkillGaprouter ;
