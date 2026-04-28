require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Security & Middleware Imports
const { apiLimiter, requestLogger, encrypt } = require('./middleware/security');

// Route Imports
const recommendRoutes = require('./routes/recommend');
const uploadRoutes = require('./routes/upload');
const authRoutes = require('./routes/auth');
const historyRoutes = require('./routes/history');
const statsRoutes = require('./routes/stats');
const atsRoutes = require('./routes/ats');
const interviewRoutes = require('./routes/interview');
const roadmapRoutes = require('./routes/roadmap');
const marketRoutes = require('./routes/market');

// 1. Establish database connection (Availability)
connectDB();

// 2. Initialize application
const app = express();

// 3. Register standard middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON requests (Body-parser)
app.use(express.urlencoded({ extended: false }));

// 4. Register custom security & logging middleware
app.use(requestLogger);       // Log all incoming requests with timestamp
app.use('/recommend', apiLimiter); // Apply Rate-Limiting to recommendation route

// 5. Health Check Route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Job Recommendation API is healthy and running.'
    });
});

// Demonstrating Basic Encryption (optional demo route)
app.post('/demo-encrypt', (req, res) => {
    const { data } = req.body;
    if (!data) return res.status(400).json({ error: 'Data is required' });
    const encryptedText = encrypt(data);
    res.json({ success: true, original: data, encrypted: encryptedText });
});

// 6. Register core API routes
app.use('/recommend', recommendRoutes);
app.use('/upload', uploadRoutes);
app.use('/auth', authRoutes);
app.use('/history', historyRoutes);
app.use('/stats', statsRoutes);
app.use('/ats-scan', atsRoutes);
app.use('/interview', interviewRoutes);
app.use('/roadmap', roadmapRoutes);
app.use('/market', marketRoutes);

// 7. Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server cleanly running on port ${PORT}`);
});
