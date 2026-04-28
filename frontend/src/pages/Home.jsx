import { useState, useEffect } from "react";
import SkillForm from "../components/SkillForm";
import ResultCard from "../components/ResultCard";
import Hero from "../components/Hero";
import { Lock } from "lucide-react";

function Home() {
    const [result, setResult] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    return (
        <div style={{ width: '100%' }}>
            <Hero />

            <div id="recommend" className="container-lg" style={{ padding: '40px 0 100px' }}>
                {isLoggedIn ? (
                    <div className="glass-container" style={{ margin: '0 auto' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '8px' }}>AI Career Intelligence</h2>
                        <p className="subtitle" style={{ marginBottom: '32px' }}>Analyze your technical DNA and map your trajectory</p>

                        <SkillForm setResult={setResult} />
                        <ResultCard result={result} />
                    </div>
                ) : (
                    <div className="glass-container" style={{ textAlign: 'center', padding: '60px 40px', border: '2px dashed var(--border-color)', margin: '0 auto' }}>
                        <div style={{ width: '64px', height: '64px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                            <Lock color="var(--accent-primary)" size={32} />
                        </div>
                        <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '16px' }}>Unlock Precision Recommendations</h2>
                        <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 32px', fontSize: '1.1rem' }}>
                            Register now to access our proprietary AI career mapping engine and export professional analysis reports.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                            <a href="/login" className="btn-hero" style={{ padding: '14px 28px', fontSize: '1rem' }}>Sign In to Unlock</a>
                            <a href="/register" style={{ padding: '14px 28px', borderRadius: '14px', background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', textDecoration: 'none', fontWeight: '700' }}>Create Free Account</a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;
