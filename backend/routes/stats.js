const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', async (req, res) => {
    try {
        const pipeline = [
            {
                $group: {
                    _id: "$predictedJob",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ];

        const results = await User.aggregate(pipeline);

        // Map securely bridging the React UI Recharts mapping format globally explicitly
        const formattedResults = results.map(row => ({
            name: row._id,
            total: row.count
        }));

        res.json({ success: true, stats: formattedResults });

    } catch (err) {
        console.error("Aggregation Error", err.message);
        res.status(500).json({ success: false, message: 'Server error parsing local metrics securely.' });
    }
});

module.exports = router;
