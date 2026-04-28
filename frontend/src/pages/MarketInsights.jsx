import { useState } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, CartesianGrid } from 'recharts';
import { TrendingUp, Briefcase, DollarSign, Search, AlertCircle } from 'lucide-react';

const MarketInsights = () => {
    const [target, setTarget] = useState("");
    const [insights, setInsights] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!target.trim()) return;

        setAnalyzing(true);
        setError("");

        try {
            const res = await axios.get(`http://localhost:5000/market/insights/${encodeURIComponent(target)}`);
            if (res.data.success) {
                setInsights(res.data.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load market telemetry limits.");
        } finally {
            setAnalyzing(false);
        }
    };

    const COLORS = ['rgba(59, 130, 246, 0.8)', 'rgba(16, 185, 129, 0.8)', 'rgba(245, 158, 11, 0.8)'];

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '8px' }}>Market <span className="text-gradient">Insights</span></h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Query live simulated statistics for your target role. Gauge compensation trends, remote vs location splits, and associated skill demands.</p>
            </div>

            <div className="glass-container" style={{ padding: '32px', borderRadius: '24px', marginBottom: '40px', width: '100%', maxWidth: '100%' }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '16px' }}>
                    <input
                        type="text"
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        placeholder="Search a role (e.g. Lead React Developer)"
                        style={{ flex: 1, padding: '16px 24px', borderRadius: '16px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '1.05rem' }}
                        required
                    />
                    <button
                        type="submit"
                        disabled={!target.trim() || analyzing}
                        className="btn-hero"
                        style={{ padding: '16px 32px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '10px', opacity: (!target.trim() || analyzing) ? 0.6 : 1 }}
                    >
                        {analyzing ? <span className="spinner" style={{ width: '20px', height: '20px', borderTopColor: 'white' }}></span> : <Search size={20} />}
                        {analyzing ? 'Querying Data...' : 'Analyze Market'}
                    </button>
                </form>
                {error && <div style={{ marginTop: '16px', color: 'var(--error)' }}><AlertCircle size={16} /> {error}</div>}
            </div>

            {/* Skeleton Layout */}
            {analyzing && !insights && (
                <div style={{ display: 'grid', gridTemplateColumns: 'reapto-fit, minmax(300px, 1fr)', gap: '24px' }}>
                    <div className="glass-container skeleton-pulse" style={{ height: '300px' }}></div>
                    <div className="glass-container skeleton-pulse" style={{ height: '300px' }}></div>
                </div>
            )}

            {/* Analytical Results Rendering */}
            {insights && !analyzing && (
                <div className="slide-up-anim" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>

                    {/* Salary Trend Area Chart */}
                    <div className="glass-container" style={{ padding: '32px', width: '100%', maxWidth: '100%' }}>
                        <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', color: 'var(--text-primary)' }}>
                            <DollarSign size={20} className="text-gradient" /> Compensation Trajectory
                        </h3>
                        <div style={{ height: '260px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={insights.salaryTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorSalary" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="level" tick={{ fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val / 1000}k`} />
                                    <Tooltip contentStyle={{ background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border-color)', backdropFilter: 'var(--glass-blur)' }} />
                                    <Area type="monotone" dataKey="salary" stroke="var(--accent-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorSalary)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Remote vs On-Site Pie Mapping */}
                    <div className="glass-container" style={{ padding: '32px', width: '100%', maxWidth: '100%' }}>
                        <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', color: 'var(--text-primary)' }}>
                            <Briefcase size={20} color="var(--accent-success)" /> Location Flexibility Distribution
                        </h3>
                        <div style={{ height: '260px', width: '100%', position: 'relative' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={insights.remoteRatio} innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none">
                                        {insights.remoteRatio.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ background: 'var(--bg-card)', borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-sm)' }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>100%</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>MKT</span>
                            </div>
                        </div>
                    </div>

                    {/* Top Associated Skills */}
                    <div className="glass-container" style={{ padding: '32px', width: '100%', maxWidth: '100%', gridColumn: '1 / -1' }}>
                        <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', color: 'var(--text-primary)' }}>
                            <TrendingUp size={20} color="#f59e0b" /> Core Role Technical Demands
                        </h3>
                        <div style={{ height: '300px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={insights.topSkills} layout="vertical" margin={{ top: 0, right: 30, left: 30, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-color)" />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="skill" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-primary)', fontWeight: '600' }} />
                                    <Tooltip cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }} contentStyle={{ background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border-color)', backdropFilter: 'var(--glass-blur)' }} />
                                    <Bar dataKey="demand" fill="var(--accent-primary)" radius={[0, 8, 8, 0]}>
                                        {insights.topSkills.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={`rgba(59, 130, 246, ${1 - index * 0.15})`} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default MarketInsights;
