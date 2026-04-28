import React from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';

const Hero = () => {
    return (
        <div className="hero-section container-lg">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', padding: '8px 16px', borderRadius: '100px', fontSize: '0.9rem', fontWeight: '700', marginBottom: '32px' }}>
                <Sparkles size={16} />
                <span>Next-Gen Career Intelligence</span>
            </div>
            <h1 className="hero-title">
                Navigate Your <span className="text-gradient">Professional Destiny</span> with AI
            </h1>
            <p className="hero-subtitle">
                The world's most advanced career recommender for IT & Software Engineering. Unlock your true potential with data-driven insights and interactive guidance.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                <a href="#recommend" className="btn-hero">
                    Get Started Free <ChevronRight size={20} style={{ verticalAlign: 'middle', marginLeft: '4px' }} />
                </a>
                <a href="/articles" style={{ padding: '18px 40px', fontSize: '1.15rem', fontWeight: '700', borderRadius: '18px', background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', textDecoration: 'none', transition: 'all 0.3s' }}>
                    View Resources
                </a>
            </div>
        </div>
    );
};

export default Hero;
