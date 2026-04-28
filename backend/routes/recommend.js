const express = require('express');
const axios = require('axios');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const User = require('../models/User');
const { validateRecommendationRequest } = require('../middleware/validation');

const router = express.Router();

// Setup multer for resume upload (Max 5MB)
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(pdf|docx)$/i)) {
            return cb(new Error('Please upload a PDF or DOCX file.'));
        }
        cb(undefined, true);
    }
});

// Helper for ML Prediction
async function getPrediction(skills) {
    let predictedJob = "Software Engineer";
    try {
        const mlApiUrl = process.env.ML_API_URL || 'http://localhost:5001/predict';
        const mlResponse = await axios.post(mlApiUrl, { skills }, { timeout: 1500 });
        if (mlResponse.data && mlResponse.data.job) {
            predictedJob = mlResponse.data.job;
        }
    } catch (error) {
        console.log('ML API unavailable or timed out. Falling back to simple heuristic prediction.');
        const skillsLower = skills.toLowerCase();
        if (skillsLower.includes('data') || skillsLower.includes('machine learning') || skillsLower.includes('python')) {
            predictedJob = "Data Scientist";
        } else if (skillsLower.includes('react') || skillsLower.includes('node') || skillsLower.includes('fullstack') || skillsLower.includes('javascript')) {
            predictedJob = "Full Stack Developer";
        } else if (skillsLower.includes('design') || skillsLower.includes('ui') || skillsLower.includes('ux')) {
            predictedJob = "UI/UX Designer";
        }
    }
    return predictedJob;
}

// 1. Standard Manual Recommendation
router.post('/', validateRecommendationRequest, async (req, res) => {
    try {
        const { skills } = req.body;
        const skillsLower = skills.toLowerCase();

        // Scope Filter
        const outOfScopeWords = ['food', 'car', 'water', 'cook', 'sports', 'medical', 'doctor', 'nurse', 'politics', 'music', 'art', 'dance', 'mechanic', 'teacher', 'plumber', 'driver'];
        const techTerms = ['python', 'java', 'html', 'css', 'react', 'node', 'sql', 'aws', 'machine learning', 'data', 'code', 'develop', 'engineer', 'software', 'app', 'web', 'program', 'c++', 'c#', 'php', 'ruby', 'go', 'azure', 'pandas'];

        const token = req.header('x-auth-token');
        let accountId = null;
        if (token) {
            try {
                const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET || 'supersecretfallback_dev_only');
                accountId = decoded.account.id;
            } catch (e) { console.log('Anonymous fallback evaluated implicitly natively.') }
        }

        const isExplicitlyOut = outOfScopeWords.some(word => skillsLower.includes(word));
        const hasTechContext = techTerms.some(term => skillsLower.includes(term));

        if (isExplicitlyOut || !hasTechContext) {
            return res.status(400).json({ success: false, message: "This is not my scope! I can only help you within the IT & Software Engineering Domain. Please try again." });
        }

        const predictedJob = await getPrediction(skills);

        const requestRecord = new User({
            skills,
            predictedJob,
            accountId: accountId || undefined,
            source: 'manual'
        });
        await requestRecord.save();

        return res.status(200).json({ success: true, input: skills, prediction: predictedJob });
    } catch (error) {
        console.error(`Error processing recommendation: ${error.message}`);
        return res.status(500).json({ success: false, message: 'Internal server error while processing the request. Please try again later.' });
    }
});

// 2. Resume Analyzer
router.post('/analyze-resume', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No resume file provided." });
        }

        let extractedText = "";
        if (req.file.originalname.endsWith('.pdf')) {
            const data = await pdfParse(req.file.buffer);
            extractedText = data.text;
        } else {
            // Simplified fallback for docx
            extractedText = req.file.buffer.toString('utf8').replace(/[^a-zA-Z0-9., ]/g, " ");
        }

        // Sanitize and Limit Length
        const skills = extractedText.substring(0, 5000);

        const predictedJob = await getPrediction(skills);

        const token = req.header('x-auth-token') || req.header('Authorization')?.split(' ')[1];
        let accountId = null;
        if (token) {
            try {
                const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET || 'supersecretfallback_dev_only');
                accountId = decoded.account.id;
            } catch (e) { }
        }

        const requestRecord = new User({
            skills: "RESUME_EXTRACTION",
            predictedJob,
            accountId: accountId || undefined,
            source: 'resume'
        });
        await requestRecord.save();

        return res.status(200).json({ success: true, prediction: predictedJob });
    } catch (error) {
        console.error(`Error processing resume: ${error.message}`);
        return res.status(500).json({ success: false, message: 'Error analyzing resume. Please ensure it is a valid PDF.' });
    }
});

// 3. Career Switch Engine
router.post('/career-switch', async (req, res) => {
    try {
        const { current_skills, target } = req.body;

        if (!current_skills || !target) {
            return res.status(400).json({ success: false, message: "Current skills and target role are required." });
        }

        const predictedJob = await getPrediction(current_skills);

        const isAligned = predictedJob.toLowerCase() === target.toLowerCase();

        const targetLower = target.toLowerCase();
        let missing_skills = [];

        if (!isAligned) {
            if (targetLower.includes('ai') || targetLower.includes('data') || targetLower.includes('machine learning')) {
                missing_skills = ['Python Mastery', 'TensorFlow / PyTorch', 'Data Structures', 'Statistical Modeling'];
            } else if (targetLower.includes('frontend') || targetLower.includes('react') || targetLower.includes('ui')) {
                missing_skills = ['Advanced React Frameworks', 'CSS Design Systems', 'State Management', 'Web Accessibility (A11y)'];
            } else if (targetLower.includes('backend') || targetLower.includes('node') || targetLower.includes('db')) {
                missing_skills = ['Microservices Architecture', 'SQL/NoSQL Optimization', 'API Security (OAuth/JWT)', 'Docker / Kubernetes'];
            } else if (targetLower.includes('security') || targetLower.includes('cyber')) {
                missing_skills = ['Network Topologies', 'Penetration Testing Utilities', 'Cryptography Basics', 'OWASP Top 10'];
            } else {
                missing_skills = ['System Design Complexity', 'Cloud Infrastructure (AWS/Azure)', 'Algorithm Optimization', 'CI/CD Pipelines'];
            }
        }

        const switchData = {
            current_prediction: predictedJob,
            target: target,
            aligned: isAligned,
            missing_skills: missing_skills
        };

        const token = req.header('x-auth-token') || req.header('Authorization')?.split(' ')[1];
        let accountId = null;
        if (token) {
            try {
                const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET || 'supersecretfallback_dev_only');
                accountId = decoded.account.id;
            } catch (e) { }
        }

        // Log switch attempts as manual source with special indicator
        if (accountId) {
            const requestRecord = new User({
                skills: `SWITCH_FROM: ${current_skills.substring(0, 200)} TO: ${target}`,
                predictedJob,
                accountId: accountId,
                source: 'manual'
            });
            await requestRecord.save();
        }

        return res.status(200).json({ success: true, data: switchData });

    } catch (error) {
        console.error(`Error processing career switch: ${error.message}`);
        return res.status(500).json({ success: false, message: 'Server error processing career trajectory.' });
    }
});

module.exports = router;
