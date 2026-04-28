const express = require('express');
const router = express.Router();

router.post('/generate', (req, res) => {
    const { target } = req.body;
    if (!target) return res.status(400).json({ success: false, message: 'Target role is required to build the Skill Tree.' });

    const role = target.toLowerCase();
    let milestones = [];

    if (role.includes('frontend') || role.includes('react') || role.includes('ui')) {
        milestones = [
            { title: "Foundations", desc: "Master HTML5 semantics, modern CSS Grid/Flexbox, and core JavaScript ES6+ native mechanics.", time: "Phase 1", active: true },
            { title: "Framework Domination", desc: "Build Single Page Applications natively utilizing React hooks, state management, and the Virtual DOM.", time: "Phase 2", active: false },
            { title: "Advanced Architecture", desc: "Implement CI/CD deployments, Webpack bundlers, Next.js Server Side Rendering securely.", time: "Phase 3", active: false }
        ];
    } else if (role.includes('data') || role.includes('ai') || role.includes('machine learning')) {
        milestones = [
            { title: "Mathematical Fundamentals", desc: "Master basic Statistics, Linear Algebra vectors, and core Python data structures.", time: "Phase 1", active: true },
            { title: "Data Engineering", desc: "Utilize Pandas/NumPy natively to construct robust data ingestion pipelines and ETL mechanisms.", time: "Phase 2", active: false },
            { title: "Deep Learning Deployment", desc: "Deploy TensorFlow predictors and engineer hyper-parameter optimized neural networks securely.", time: "Phase 3", active: false }
        ];
    } else if (role.includes('backend') || role.includes('node') || role.includes('api')) {
        milestones = [
            { title: "Server Foundations", desc: "Master Node.js natively. Build raw Express REST APIs and parse HTTP/TCP lifecycle requests.", time: "Phase 1", active: true },
            { title: "Data Architecture", desc: "Engineer complex MongoDB schemas, SQL Relational mapping, and secure JWT authentication matrices.", time: "Phase 2", active: false },
            { title: "Cloud Deployment", desc: "Map Docker containers natively to AWS architecture integrating caching and load balancers.", time: "Phase 3", active: false }
        ];
    } else {
        milestones = [
            { title: "Core Fundamentals", desc: "Master the foundational syntax, compilation mechanics, and programmatic data structures natively.", time: "Phase 1", active: true },
            { title: "Object Oriented Architecture", desc: "Map complex project implementations locally utilizing exact explicit design patterns.", time: "Phase 2", active: false },
            { title: "Cloud Production Operations", desc: "Execute full remote deployment mechanics pushing mapped code outwards seamlessly.", time: "Phase 3", active: false }
        ];
    }

    res.json({ success: true, role: target, milestones });
});

module.exports = router;
