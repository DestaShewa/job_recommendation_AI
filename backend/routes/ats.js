const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');

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

// Basic TF-IDF/Keyword overlap engine natively in Express
router.post('/', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No resume file provided." });
        }
        const { job_description } = req.body;
        if (!job_description) {
            return res.status(400).json({ success: false, message: "Job description is required." });
        }

        // Parse PDF
        let resumeText = "";
        if (req.file.originalname.endsWith('.pdf')) {
            const data = await pdfParse(req.file.buffer);
            resumeText = data.text.toLowerCase();
        } else {
            resumeText = req.file.buffer.toString('utf8').toLowerCase();
        }

        // Extract Keywords from JD natively
        const stopWords = ['the', 'and', 'a', 'to', 'of', 'in', 'i', 'is', 'that', 'it', 'on', 'you', 'this', 'for', 'but', 'with', 'are', 'have', 'be', 'at', 'or', 'as', 'was', 'so', 'if', 'out', 'not', 'we', 'our', 'will', 'can', 'an', 'by', 'from', 'your', 'all', 'any'];
        const words = job_description.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/);

        let jdKeywords = {};
        words.forEach(w => {
            if (w.length > 2 && !stopWords.includes(w)) {
                jdKeywords[w] = (jdKeywords[w] || 0) + 1;
            }
        });

        // Take top 20 keywords from JD
        const topKeywords = Object.keys(jdKeywords)
            .sort((a, b) => jdKeywords[b] - jdKeywords[a])
            .slice(0, 20);

        let matched = [];
        let missing = [];

        topKeywords.forEach(kw => {
            if (resumeText.includes(kw)) {
                matched.push(kw);
            } else {
                missing.push(kw);
            }
        });

        const score = topKeywords.length > 0 ? Math.round((matched.length / topKeywords.length) * 100) : 0;

        return res.json({
            success: true,
            score,
            matched,
            missing
        });

    } catch (error) {
        console.error(`ATS Error: ${error.message}`);
        res.status(500).json({ success: false, message: 'Server error processing ATS logic.' });
    }
});

module.exports = router;
