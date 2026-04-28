import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchHistory = async () => {
            try {
                const res = await axios.get('http://localhost:5000/history', {
                    headers: { 'x-auth-token': token }
                });
                setHistory(res.data.history);
            } catch (err) {
                console.error(err);
                if (err.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [navigate]);

    return (
        <div className="glass-container" style={{ maxWidth: '800px', width: '100%', textAlign: 'left' }}>
            <h1 style={{ marginBottom: '8px' }}>Your Local Analytics Array</h1>
            <p className="subtitle" style={{ marginBottom: '32px' }}>Review your past skill evaluations efficiently</p>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><span className="spinner" style={{ borderTopColor: 'var(--accent-primary)', borderColor: 'var(--border-color)' }}></span></div>
            ) : history.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', background: 'var(--bg-glass)', borderRadius: '24px', border: '1px dotted var(--border-color)' }}>
                    <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>No mappings loaded actively. Request an evaluation!</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {history.map((record, idx) => (
                        <div key={idx} style={{
                            background: 'var(--bg-card)',
                            padding: '28px',
                            borderRadius: '20px',
                            border: '1px solid var(--border-color)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            boxShadow: 'var(--shadow-sm)',
                            transition: 'transform 0.2s ease'
                        }}>
                            <div style={{ flex: 1, paddingRight: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {new Date(record.createdAt).toLocaleDateString()} at {new Date(record.createdAt).toLocaleTimeString()}
                                    </p>
                                    <span style={{ padding: '2px 8px', fontSize: '0.7rem', fontWeight: '700', borderRadius: '4px', textTransform: 'uppercase', background: record.source === 'resume' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(156, 163, 175, 0.15)', color: record.source === 'resume' ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>
                                        {record.source || 'manual'}
                                    </span>
                                </div>
                                <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                                    <strong style={{ color: 'var(--text-secondary)' }}>Skills:</strong> {record.skills.length > 120 ? record.skills.slice(0, 120) + '...' : record.skills}
                                </p>
                            </div>
                            <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-success)', padding: '10px 20px', borderRadius: '14px', fontWeight: 700, fontSize: '0.95rem', whiteSpace: 'nowrap', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                🎯 {record.predictedJob}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Dashboard;
