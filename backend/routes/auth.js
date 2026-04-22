const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Account = require('../models/Account');
const { check, validationResult } = require('express-validator');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretfallback_dev_only';

// POST /auth/register
router.post('/register', [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: errors.array()[0].msg });

    const { name, email, password } = req.body;

    try {
        let account = await Account.findOne({ email });
        if (account) return res.status(400).json({ success: false, message: 'Account email already actively mapped.' });

        account = new Account({ name, email, password });

        // Hash Password natively securely
        const salt = await bcrypt.genSalt(10);
        account.password = await bcrypt.hash(password, salt);

        await account.save();

        // Return mapped JWT
        const payload = { account: { id: account.id } };
        jwt.sign(payload, JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ success: true, token, name: account.name });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server error during local registration mappings' });
    }
});

// POST /auth/login
router.post('/login', [
    check('email', 'Please include a securely valid email').isEmail(),
    check('password', 'Password field requirement missing').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: errors.array()[0].msg });

    const { email, password } = req.body;

    try {
        let account = await Account.findOne({ email });
        if (!account) return res.status(400).json({ success: false, message: 'Mapping Invalid. No records found securely.' });

        const isMatch = await bcrypt.compare(password, account.password);
        if (!isMatch) return res.status(400).json({ success: false, message: 'Authentication Failure securely.' });

        const payload = { account: { id: account.id } };
        jwt.sign(payload, JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ success: true, token, name: account.name });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server routing exception safely thrown' });
    }
});

module.exports = router;
