const express = require('express');
const router = express.Router();

router.get('/insights/:role', (req, res) => {
    const target = req.params.role.toLowerCase();

    // Simulate real-world SaaS logic based on queried path mappings natively
    let data = {
        salaryTrend: [],
        remoteRatio: [],
        topSkills: []
    };

    if (target.includes('frontend') || target.includes('react')) {
        data.salaryTrend = [
            { level: 'Junior', salary: 75000 },
            { level: 'Mid', salary: 110000 },
            { level: 'Senior', salary: 145000 },
            { level: 'Lead', salary: 175000 }
        ];
        data.remoteRatio = [
            { name: 'Remote', value: 65 },
            { name: 'Hybrid', value: 25 },
            { name: 'On-Site', value: 10 }
        ];
        data.topSkills = [
            { skill: 'React', demand: 95 },
            { skill: 'TypeScript', demand: 85 },
            { skill: 'Next.js', demand: 75 },
            { skill: 'GraphQL', demand: 60 },
            { skill: 'CSS Grid', demand: 55 }
        ];
    } else if (target.includes('data') || target.includes('ai') || target.includes('machine learning')) {
        data.salaryTrend = [
            { level: 'Junior', salary: 90000 },
            { level: 'Mid', salary: 130000 },
            { level: 'Senior', salary: 165000 },
            { level: 'Lead', salary: 200000 }
        ];
        data.remoteRatio = [
            { name: 'Remote', value: 70 },
            { name: 'Hybrid', value: 20 },
            { name: 'On-Site', value: 10 }
        ];
        data.topSkills = [
            { skill: 'Python', demand: 98 },
            { skill: 'TensorFlow', demand: 85 },
            { skill: 'SQL', demand: 80 },
            { skill: 'AWS/GCP', demand: 70 },
            { skill: 'Pandas', demand: 65 }
        ];
    } else {
        data.salaryTrend = [
            { level: 'Junior', salary: 70000 },
            { level: 'Mid', salary: 105000 },
            { level: 'Senior', salary: 140000 },
            { level: 'Lead', salary: 165000 }
        ];
        data.remoteRatio = [
            { name: 'Remote', value: 50 },
            { name: 'Hybrid', value: 30 },
            { name: 'On-Site', value: 20 }
        ];
        data.topSkills = [
            { skill: 'Problem Solving', demand: 95 },
            { skill: 'System Design', demand: 85 },
            { skill: 'Algorithms', demand: 80 },
            { skill: 'Communication', demand: 70 },
            { skill: 'Agile/Git', demand: 60 }
        ];
    }

    res.json({ success: true, target: target, data });
});

module.exports = router;
