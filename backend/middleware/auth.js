const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretfallback_dev_only';

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ success: false, message: 'No token, authorization denied securely' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.account = decoded.account; // attach account id securely to all downstream pipeline routes
        next();
    } catch (err) {
        res.status(401).json({ success: false, message: 'Token evaluated entirely invalid' });
    }
};
