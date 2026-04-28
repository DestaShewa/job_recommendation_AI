import { useState } from 'react';
import axios from 'axios';
import { Route, Map, GitCommit, CheckCircle2, Circle, AlertCircle } from 'lucide-react';

const SkillTree = () => {
    const [target, setTarget] = useState("");
    const [milestones, setMilestones] = useState([]);
    const [analyzing, setAnalyzing] = useState(false);
    const [error, setError] = useState("");

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!target.trim()) return;

        setAnalyzing(true);
        setError("");

        try {
            const res = await axios.post('http://localhost:5000/roadmap/generate', { target });
            if (res.data.success) {
                setMilestones(res.data.milestones);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to map career timeline.");
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '8px' }}>Career <span className="text-gradient">Skill Tree</span></h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Map out your exact technical trajectory. Discover the milestones required to reach your target engineering role.</p>
            </div>

            <div className="glass-container" style={{ padding: '40px', borderRadius: '24px', marginBottom: '40px' }}>
                <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-primary)' }}>Target Role</label>
                        <input
                            type="text"
                            value={target}
                            onChange={(e) => setTarget(e.target.value)}
                            placeholder="e.g. AI Engineer, React Developer, Backend Architect"
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
                        disabled={!target.trim() || analyzing}
                        className="btn-hero"
                        style={{ padding: '16px', borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', opacity: (!target.trim() || analyzing) ? 0.6 : 1 }}
                    >
                        {analyzing ? <span className="spinner" style={{ width: '20px', height: '20px', borderTopColor: 'white' }}></span> : <Map size={20} />}
                        {analyzing ? 'Mapping Skill Architecture...' : 'Generate Skill Tree'}
                    </button>
                </form>
            </div>

            {/* Skeleton Loader during analysis */}
            {analyzing && milestones.length === 0 && (
                <div className="glass-container skeleton-pulse" style={{ padding: '40px', borderRadius: '24px', opacity: 0.7, height: '300px' }}>
                    <div style={{ height: '40px', width: '200px', background: 'var(--border-color)', borderRadius: '8px', marginBottom: '40px' }}></div>
                    <div style={{ height: '20px', width: '100%', background: 'var(--border-color)', borderRadius: '4px', marginBottom: '20px' }}></div>
                    <div style={{ height: '20px', width: '80%', background: 'var(--border-color)', borderRadius: '4px' }}></div>
                </div>
            )}

            {/* Timeline UI */}
            {milestones.length > 0 && !analyzing && (
                <div className="glass-container slide-up-anim" style={{ padding: '40px', borderRadius: '24px', position: 'relative' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '32px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>Mastery Timeline</h2>

                    <div style={{ position: 'relative', paddingLeft: '30px' }}>
                        {/* The vertical timeline connector */}
                        <div style={{ position: 'absolute', left: '11px', top: '10px', bottom: '20px', width: '2px', background: 'var(--border-color)', borderRadius: '2px' }}></div>

                        {milestones.map((node, i) => (
                            <div key={i} style={{ position: 'relative', marginBottom: i === milestones.length - 1 ? 0 : '40px', display: 'flex', flexDirection: 'column', gap: '8px' }}>

                                {/* Timeline Node Indicator */}
                                <div style={{ position: 'absolute', left: '-30px', top: '0px', background: 'var(--bg-card)', borderRadius: '50%', padding: '2px', color: node.active ? 'var(--accent-success)' : 'var(--text-muted)', zIndex: 1 }}>
                                    {node.active ? <CheckCircle2 size={20} fill="currentColor" color="white" /> : <Circle size={20} />}
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: node.active ? 'var(--accent-success)' : 'var(--text-primary)' }}>{node.title}</h3>
                                    <span style={{ fontSize: '0.8rem', padding: '4px 12px', background: 'var(--bg-primary)', borderRadius: '20px', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontWeight: '600' }}>
                                        {node.time}
                                    </span>
                                </div>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                                    {node.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SkillTree;
