import { useState } from 'react';
import axios from 'axios';
import { Target, UploadCloud, AlertCircle, FileCheck, CheckCircle2, XCircle } from 'lucide-react';

const ATSScanner = () => {
    const [jobDescription, setJobDescription] = useState("");
    const [file, setFile] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleAtsScan = async (e) => {
        e.preventDefault();
        if (!file || !jobDescription) {
            setError("Both Job Description and Resume PDF are required.");
            return;
        }

        setAnalyzing(true);
        setError("");
        setResult(null);

        const formData = new FormData();
        formData.append('resume', file);
        formData.append('job_description', jobDescription);

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/ats-scan', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.data.success) {
                setResult({
                    score: res.data.score,
                    matched: res.data.matched,
                    missing: res.data.missing
                });
            } else {
                setError(res.data.message || "Failed to analyze ATS compatibility.");
            }
        } catch (err) {
            console.error("ATS Scan Error:", err);
            setError(err.response?.data?.message || "An error occurred during ATS evaluation.");
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '8px' }}>ATS <span className="text-gradient">Match Scanner</span></h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Ensure your resume gets past the Applicant Tracking System. Paste the job description and upload your resume to identify critical missing keywords.</p>
            </div>

            <div className="glass-container" style={{ padding: '40px', borderRadius: '24px', marginBottom: '40px' }}>
                <form onSubmit={handleAtsScan} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-primary)' }}>Target Job Description</label>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the full job description here..."
                            rows={6}
                            style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '1rem', fontFamily: 'inherit', resize: 'vertical' }}
                            required
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-primary)' }}>Your Resume (PDF)</label>
                        <div style={{ padding: '30px', border: `2px dashed ${file ? 'var(--accent-primary)' : 'var(--border-color)'}`, borderRadius: '16px', background: file ? 'rgba(59, 130, 246, 0.05)' : 'var(--bg-primary)', textAlign: 'center', transition: 'all 0.3s' }}>
                            <input type="file" id="resume-upload-ats" hidden onChange={handleFileChange} accept=".pdf,.docx" required />
                            <label htmlFor="resume-upload-ats" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', gap: '12px' }}>
                                <UploadCloud size={32} color={file ? "var(--accent-primary)" : "var(--text-muted)"} />
                                <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{file ? file.name : "Click to select a file"}</span>
                            </label>
                        </div>
                    </div>

                    {error && (
                        <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <AlertCircle size={20} />
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={!file || !jobDescription || analyzing}
                        className="btn-hero"
                        style={{ padding: '16px', borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', opacity: (!file || !jobDescription || analyzing) ? 0.6 : 1 }}
                    >
                        {analyzing ? <span className="spinner" style={{ width: '20px', height: '20px', borderTopColor: 'white' }}></span> : <Target size={20} />}
                        {analyzing ? 'Simulating ATS Parse Engine...' : 'Scan ATS Compatibility'}
                    </button>
                </form>
            </div>

            {/* Skeleton Loader during analysis */}
            {analyzing && !result && (
                <div className="glass-container skeleton-pulse" style={{ padding: '40px', borderRadius: '24px', opacity: 0.7 }}>
                    <div style={{ height: '40px', width: '200px', background: 'var(--border-color)', borderRadius: '8px', marginBottom: '24px' }}></div>
                    <div style={{ height: '100px', width: '100px', background: 'var(--border-color)', borderRadius: '50%', margin: '0 auto 32px' }}></div>
                    <div style={{ height: '20px', width: '100%', background: 'var(--border-color)', borderRadius: '4px', marginBottom: '12px' }}></div>
                    <div style={{ height: '20px', width: '80%', background: 'var(--border-color)', borderRadius: '4px' }}></div>
                </div>
            )}

            {result && !analyzing && (
                <div className="glass-container slide-up-anim" style={{ padding: '40px', borderRadius: '24px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <h2 style={{ fontSize: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px', fontWeight: '700' }}>Compatibility Score</h2>
                        <div style={{ width: '140px', height: '140px', borderRadius: '50%', background: result.score >= 80 ? 'rgba(16, 185, 129, 0.1)' : result.score >= 50 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '0 auto', border: `4px solid ${result.score >= 80 ? 'var(--accent-success)' : result.score >= 50 ? '#f59e0b' : 'var(--error)'}` }}>
                            <span style={{ fontSize: '2.5rem', fontWeight: '900', color: result.score >= 80 ? 'var(--accent-success)' : result.score >= 50 ? '#f59e0b' : 'var(--error)' }}>
                                {result.score}%
                            </span>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '40px' }}>

                        {/* Missing Keywords */}
                        <div style={{ background: 'var(--bg-primary)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--error)', fontWeight: '700', marginBottom: '20px', fontSize: '1.1rem' }}>
                                <XCircle size={20} />
                                Critical Missing Keywords
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {result.missing.length > 0 ? result.missing.map((kw, i) => (
                                    <span key={i} style={{ padding: '6px 12px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600' }}>
                                        {kw}
                                    </span>
                                )) : <span style={{ color: 'var(--text-muted)' }}>No critical missing keywords!</span>}
                            </div>
                        </div>

                        {/* Matched Keywords */}
                        <div style={{ background: 'var(--bg-primary)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-success)', fontWeight: '700', marginBottom: '20px', fontSize: '1.1rem' }}>
                                <CheckCircle2 size={20} />
                                Matched Keywords
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {result.matched.length > 0 ? result.matched.map((kw, i) => (
                                    <span key={i} style={{ padding: '6px 12px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-success)', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600' }}>
                                        {kw}
                                    </span>
                                )) : <span style={{ color: 'var(--text-muted)' }}>No keywords matched.</span>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ATSScanner;
