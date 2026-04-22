import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function Analytics() {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('http://localhost:5000/stats');
                if (res.data.success) {
                    setStats(res.data.stats);
                }
            } catch (err) {
                console.error("Failed to load global AI metrics", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="glass-container" style={{ maxWidth: '900px', width: '100%', textAlign: 'left' }}>
            <h1 style={{ marginBottom: '8px' }}>Global AI Metrics</h1>
            <p className="subtitle" style={{ marginBottom: '32px' }}>Real-time aggregate visualization of system trajectories globally</p>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><span className="spinner" style={{ borderTopColor: 'var(--accent-primary)', borderColor: 'var(--border-color)' }}></span></div>
            ) : stats.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>No system metric data generated natively yet.</p>
            ) : (
                <div style={{ width: '100%', minHeight: '400px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '32px', position: 'relative', boxShadow: 'var(--shadow-sm)' }}>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={stats} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--text-secondary)', fontSize: 13, fontWeight: 500 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--text-secondary)', fontSize: 13, fontWeight: 500 }}
                            />
                            <Tooltip
                                cursor={{ fill: 'var(--bg-glass)' }}
                                contentStyle={{
                                    borderRadius: '12px',
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border-color)',
                                    boxShadow: 'var(--shadow-lg)',
                                    color: 'var(--text-primary)'
                                }}
                                itemStyle={{ color: 'var(--accent-primary)', fontWeight: 600 }}
                            />
                            <Bar dataKey="total" fill="var(--accent-primary)" radius={[6, 6, 0, 0]} barSize={45} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}

export default Analytics;
