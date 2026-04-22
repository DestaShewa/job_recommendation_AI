const express = require('express');
const multer = require('multer');
const { PDFParse } = require('pdf-parse');

const router = express.Router();

// Setup Multer memory storage preventing server disk bloat (Availability)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF format is allowed!'), false);
        }
    }
});

router.post('/', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No PDF file uploaded!" });
        }

        // Parse PDF text exactly from binary memory buffer using v2 API
        const parser = new PDFParse({ data: req.file.buffer });
        const data = await parser.getText();
        await parser.destroy(); // Free memory
        const extractedText = data.text;

        if (!extractedText || extractedText.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Failed to extract text from PDF. It may be an image-only scan."
            });
        }

        // Return standardized mapped output requirement natively
        return res.status(200).json({
            success: true,
            extractedSkills: extractedText.trim().replace(/\n/g, ' ').slice(0, 3000) // Sanitize and limit context length
        });

    } catch (error) {
        console.error(`PDF Parsing Error: ${error.message}`);
        // Handle Multer type errors gracefully
        if (error.message && error.message.includes('Only PDF')) {
            return res.status(400).json({ success: false, message: "Invalid file type. Only PDF is allowed." });
        }
        return res.status(500).json({
            success: false,
            message: "Internal server error while parsing the PDF layer."
        });
    }
});

module.exports = router;
