const express = require('express');
const axios = require('axios');
const User = require('../models/User');
const { validateRecommendationRequest } = require('../middleware/validation');

const router = express.Router();

router.post('/', validateRecommendationRequest, async (req, res) => {
    try {
        const { skills } = req.body;
        const skillsLower = skills.toLowerCase();

        // Scope Filter: Intercept items clearly out of the IT domain natively
        const outOfScopeWords = ['food', 'car', 'water', 'cook', 'sports', 'medical', 'doctor', 'nurse', 'politics', 'music', 'art', 'dance', 'mechanic', 'teacher', 'plumber', 'driver'];
        const techTerms = ['python', 'java', 'html', 'css', 'react', 'node', 'sql', 'aws', 'machine learning', 'data', 'code', 'develop', 'engineer', 'software', 'app', 'web', 'program', 'c++', 'c#', 'php', 'ruby', 'go', 'azure', 'pandas'];

        // Securely intercept optional tokens assigning account ids implicitly
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
            return res.status(400).json({
                success: false,
                message: "This is not my scope! I can only help you within the IT & Software Engineering Domain. Please try again."
            });
        }

        let predictedJob = "Software Engineer"; // Default prediction

        // Call ML Model via Python API (Preferred Option A)
        try {
            const mlApiUrl = process.env.ML_API_URL || 'http://localhost:8000/predict';
            // Fast response design: timeout early if ML is down
            const mlResponse = await axios.post(mlApiUrl, { skills }, { timeout: 1500 });

            if (mlResponse.data && mlResponse.data.job) {
                predictedJob = mlResponse.data.job;
            }
        } catch (error) {
            console.log('ML API unavailable or timed out. Falling back to simple heuristic prediction.');

            // Mock prediction for standalone execution (Demo only)
            const skillsLower = skills.toLowerCase();
            if (skillsLower.includes('data') || skillsLower.includes('machine learning') || skillsLower.includes('python')) {
                predictedJob = "Data Scientist";
            } else if (skillsLower.includes('react') || skillsLower.includes('node') || skillsLower.includes('fullstack')) {
                predictedJob = "Full Stack Developer";
            } else if (skillsLower.includes('design') || skillsLower.includes('ui') || skillsLower.includes('ux')) {
                predictedJob = "UI/UX Designer";
            }
        }

        // Save history in MongoDB mapping standard fallback logic to local profiles actively mapping keys
        const requestRecord = new User({
            skills,
            predictedJob,
            accountId: accountId || undefined
        });
        await requestRecord.save();

        // Standardized mapped output requirement
        return res.status(200).json({
            success: true,
            input: skills,
            prediction: predictedJob
        });

    } catch (error) {
        console.error(`Error processing recommendation: ${error.message}`);
        // Clear error message adhering to HCI principles
        return res.status(500).json({
            success: false,
            message: 'Internal server error while processing the request. Please try again later.'
        });
    }
});

module.exports = router;
