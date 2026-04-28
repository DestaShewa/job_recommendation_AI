import { useState } from 'react';
import axios from 'axios';
import { FileText, UploadCloud, AlertCircle } from 'lucide-react';

const ResumeAnalyzer = () => {
    const [file, setFile] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError("");
        setResult(null);
    };

    const handleAnalyze = async () => {
        if (!file) {
            setError("Please upload a resume first.");
            return;
        }

        setAnalyzing(true);
        setError("");

        const formData = new FormData();
        formData.append('resume', file);

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/recommend/analyze-resume', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.data.success) {
                setResult(res.data.prediction);
            } else {
                setError(res.data.message || "Failed to analyze resume.");
            }
        } catch (err) {
            console.error("Analysis error:", err);
            setError(err.response?.data?.message || "An error occurred during analysis.");
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '8px' }}>Resume <span className="text-gradient">Analyzer</span></h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Upload your CV to extract your technical profile and discover your optimal career trajectory using AI.</p>
            </div>

            <div className="glass-container" style={{ padding: '40px', borderRadius: '24px' }}>

                <div style={{ padding: '40px', border: `2px dashed ${file ? 'var(--accent-primary)' : 'var(--border-color)'}`, borderRadius: '20px', background: file ? 'rgba(59, 130, 246, 0.05)' : 'var(--bg-primary)', textAlign: 'center', transition: 'all 0.3s', marginBottom: '24px' }}>
                    <UploadCloud size={48} color={file ? "var(--accent-primary)" : "var(--text-muted)"} style={{ marginBottom: '16px' }} />
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--text-primary)' }}>
                        {file ? file.name : "Drag & Drop your Resume"}
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>Supports PDF and DOCX (Max 5MB)</p>

                    <input type="file" id="resume-upload" hidden onChange={handleFileChange} accept=".pdf,.docx" />
                    <label htmlFor="resume-upload" className="btn-hero" style={{ padding: '12px 24px', fontSize: '0.95rem', display: 'inline-block', cursor: 'pointer' }}>
                        Browse Files
                    </label>
                </div>

                {error && (
                    <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}

                <button
                    onClick={handleAnalyze}
                    disabled={!file || analyzing}
                    style={{ width: '100%', padding: '16px', borderRadius: '16px', background: (!file || analyzing) ? 'var(--border-color)' : 'var(--accent-primary)', color: (!file || analyzing) ? 'var(--text-muted)' : 'white', border: 'none', fontSize: '1.1rem', fontWeight: '700', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', cursor: (!file || analyzing) ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
                >
                    {analyzing ? <span className="spinner" style={{ width: '20px', height: '20px', borderTopColor: 'currentColor' }}></span> : <FileText size={20} />}
                    {analyzing ? 'Analyzing Core Competencies...' : 'Extract & Analyze Profile'}
                </button>
            </div>

            {result && (
                <div className="glass-container" style={{ marginTop: '40px', padding: '40px', textAlign: 'center', animation: 'fadeUp 0.5s ease' }}>
                    <h2 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', fontWeight: '700' }}>AI Recommended Path</h2>
                    <div className="result-badge" style={{ fontSize: '1.75rem', padding: '16px 32px' }}>
                        {result}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResumeAnalyzer;
