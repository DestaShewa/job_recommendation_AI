const { check, validationResult } = require('express-validator');
const xss = require('xss');

// Validate and sanitize skills input (Integrity & XSS Protection)
const validateRecommendationRequest = [
    check('skills')
        .notEmpty().withMessage('Skills input cannot be empty')
        .isString().withMessage('Skills must be a string')
        .isLength({ min: 3 }).withMessage('Skills input must be at least 3 characters long')
        .custom(value => {
            if (/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/i.test(value)) {
                throw new Error('Invalid input provided');
            }
            return true;
        })
        .customSanitizer(value => {
            // Clean input using xss package to prevent cross-site scripting
            return xss(value);
        }),
    (req, res, next) => {
        const errors = validationResult(req);
        // Return standard failure response securely
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Invalid input provided"
            });
        }
        next();
    }
];

module.exports = { validateRecommendationRequest };
