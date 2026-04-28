const express = require('express');
const router = express.Router();

router.post('/generate', (req, res) => {
    const { role } = req.body;
    if (!role) return res.status(400).json({ success: false, message: 'Target role is required to simulate questions.' });

    const target = role.toLowerCase();
    let questions = [];

    if (target.includes('frontend') || target.includes('react') || target.includes('ui')) {
        questions = [
            "Explain the concept of the Virtual DOM and how React optimizes rendering pipelines.",
            "What are React Hooks? Could you explain how useEffect differs from standard lifecycle methods?",
            "How do you manage complex global state in massive frontend architectures?",
            "Describe CSS Specificity and how you prevent namespace collisions universally."
        ];
    } else if (target.includes('data') || target.includes('machine learning') || target.includes('ai')) {
        questions = [
            "Explain the explicit difference between supervised and unsupervised learning algorithms.",
            "How do you handle missing outliers or corrupted entries in a massive raw dataset?",
            "Describe the bias-variance tradeoff and how it directly affects model accuracy.",
            "What is K-Fold cross-validation and why is it critical before deployment?"
        ];
    } else if (target.includes('backend') || target.includes('node') || target.includes('api')) {
        questions = [
            "Explain the Event Loop architecture natively in Node.js.",
            "What is the core difference between relational SQL and NoSQL document databases?",
            "How would you securely handle user authentication payloads and password salting?",
            "Explain horizontal vs vertical distributed scaling in server architecture."
        ];
    } else if (target.includes('security') || target.includes('cyber')) {
        questions = [
            "Explain the difference between Symmetric and Asymmetric encryption.",
            "How do you prevent Cross-Site Scripting (XSS) and SQL Injection in modern web apps?",
            "Describe what a CSRF attack is and the standard tokenization defense.",
            "Explain the OWASP top 10 vulnerabilities seamlessly."
        ];
    } else {
        questions = [
            "Could you describe a time you overcame a deeply painful technical architectural challenge?",
            "Explain your heuristic approach when initially bootstrapping a new software codebase.",
            "How do you isolate performance bottlenecks to reduce application latency?",
            "Describe your explicit experience with Git version control and team CI/CD pipelines."
        ];
    }

    // Shuffle and pick 3
    const shuffled = questions.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);

    res.json({ success: true, questions: selected });
});

router.post('/evaluate', (req, res) => {
    const { answer, question } = req.body;
    if (!answer || !question) return res.status(400).json({ success: false, message: 'Both the Question and Answer payloads are required.' });

    const words = answer.trim().split(/\s+/);
    const answerLength = words.length;
    let feedback = "";

    if (answerLength < 15) {
        feedback = "Your answer is dangerously brief. Technical interviews require elaboration. Expand on the core concepts and provide real-world examples.";
    } else if (answerLength > 120) {
        feedback = "Very detailed insight! Just be careful of rambling. Ensure you hit the core technical terminology clearly and concisely to respect the interviewer's time.";
    } else {
        feedback = "Solid, professional response. You communicated the requested concept securely and efficiently within the sweet-spot length. Excellent job.";
    }

    res.json({
        success: true,
        feedback,
        metrics: { word_count: answerLength, status: answerLength < 15 ? 'warning' : 'success' }
    });
});

module.exports = router;
