import { useState } from 'react';
import axios from 'axios';
import { SwitchCamera, AlertCircle, CheckCircle2 } from 'lucide-react';

const CareerSwitch = () => {
    const [currentSkills, setCurrentSkills] = useState("");
    const [targetRole, setTargetRole] = useState("");
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const handleSwitchAnalyze = async (e) => {
        e.preventDefault();
        setAnalyzing(true);
        setError("");

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/career-switch', {
                current_skills: currentSkills,
                target: targetRole
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.data.success) {
                setResult(res.data.data);
            } else {
                setError(res.data.message);
            }
        } catch (err) {
            console.error("Career switch error:", err);
            setError("Failed to analyze career switch trajectory.");
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '8px' }}>Career <span className="text-gradient">Switch Engine</span></h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Map the distance between your current technical stack and your target professional role.</p>
            </div>

            <div className="glass-container" style={{ padding: '40px', borderRadius: '24px' }}>
                <form onSubmit={handleSwitchAnalyze} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-primary)' }}>Current Technical Profile</label>
                        <textarea
                            value={currentSkills}
                            onChange={(e) => setCurrentSkills(e.target.value)}
                            placeholder="e.g. JavaScript, React, HTML, CSS"
                            rows={3}
                            style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '1rem', fontFamily: 'inherit', resize: 'vertical' }}
                            required
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-primary)' }}>Target Professional Interest</label>
                        <input
                            type="text"
                            value={targetRole}
                            onChange={(e) => setTargetRole(e.target.value)}
                            placeholder="e.g. AI Engineer, Data Scientist, Site Reliability Engineer"
                            style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '1rem' }}
                            required
                        />
                    </div>

                    {error && (
                        <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <AlertCircle size={20} />
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={!currentSkills || !targetRole || analyzing}
                        className="btn-hero"
                        style={{ padding: '16px', borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', opacity: (!currentSkills || !targetRole || analyzing) ? 0.6 : 1 }}
                    >
                        {analyzing ? <span className="spinner" style={{ width: '20px', height: '20px', borderTopColor: 'white' }}></span> : <SwitchCamera size={20} />}
                        {analyzing ? 'Mapping Trajectory...' : 'Generate Switch Map'}
                    </button>
                </form>
            </div>

            {result && (
                <div className="glass-container" style={{ marginTop: '40px', padding: '40px', borderRadius: '24px', animation: 'fadeUp 0.5s ease' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                        <div>
                            <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Current Prediction</h3>
                            <div style={{ padding: '20px', background: 'var(--bg-primary)', borderRadius: '16px', border: '1px solid var(--border-color)', fontWeight: '700', fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                                {result.current_prediction}
                            </div>
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Target Goal Alignment</h3>
                            <div style={{ padding: '20px', background: result.aligned ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', borderRadius: '16px', border: `1px solid ${result.aligned ? 'var(--accent-success)' : '#f59e0b'}`, fontWeight: '700', fontSize: '1.2rem', color: result.aligned ? 'var(--accent-success)' : '#f59e0b', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                {result.aligned ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                                {result.aligned ? 'Highly Aligned' : 'Skill Gap Detected'}
                            </div>
                        </div>
                    </div>

                    {!result.aligned && result.missing_skills && result.missing_skills.length > 0 && (
                        <div style={{ marginTop: '40px', paddingTop: '32px', borderTop: '1px solid var(--border-color)' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '20px', color: 'var(--text-primary)' }}>Critical Missing Skills for {result.target}</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                {result.missing_skills.map((skill, idx) => (
                                    <span key={idx} style={{ padding: '8px 16px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', borderRadius: '100px', fontSize: '0.95rem', fontWeight: '600', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CareerSwitch;
