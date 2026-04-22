const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// GET /history (Protected sequentially via user local Token headers)
router.get('/', auth, async (req, res) => {
    try {
        const history = await User.find({ accountId: req.account.id }).sort({ createdAt: -1 }); // Get newest first
        res.json({ success: true, count: history.length, history });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server error routing historically.' });
    }
});

module.exports = router;
