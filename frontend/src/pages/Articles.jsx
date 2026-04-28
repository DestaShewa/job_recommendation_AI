import React from 'react';
import { ArrowRight, BookOpen, Clock, User } from 'lucide-react';

const articles = [
    {
        tag: "Artificial Intelligence",
        title: "The Future of AI in Modern Software Engineering",
        excerpt: "Discover how Large Language Models are reshaping the way we architect, write, and maintain enterprise software in 2026.",
        img: "/assets/ai_dev.png",
        author: "Dr. Elena Vance",
        time: "8 min read"
    },
    {
        tag: "Career Growth",
        title: "Mastering Technical Interviews in a Competitive Market",
        excerpt: "A comprehensive guide on how to demonstrate both technical depth and system design thinking during high-stakes interviews.",
        img: "/assets/interviews.png",
        author: "James Wilson",
        time: "12 min read"
    },
    {
        tag: "Remote Work",
        title: "Productivity Secrets for Globally Distributed Teams",
        excerpt: "Learn the communication patterns and tooling used by top engineering organizations to maintain high velocity remotely.",
        img: "/assets/remote_work.png",
        author: "Sarah Chen",
        time: "6 min read"
    }
];

const Articles = () => {
    return (
        <div className="container-lg" style={{ padding: '80px 40px' }}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)', fontWeight: '700', marginBottom: '16px' }}>
                    <BookOpen size={20} />
                    <span>PathFinder Resources</span>
                </div>
                <h2 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '24px' }}>Latest <span className="text-gradient">Career Insights</span></h2>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
                    Curated articles and deep dives to help you stay ahead in the rapidly evolving technology landscape.
                </p>
            </div>

            <div className="article-grid">
                {articles.map((article, idx) => (
                    <div key={idx} className="article-card">
                        <img src={article.img} alt={article.title} className="article-img" />
                        <div className="article-content">
                            <span className="article-tag">{article.tag}</span>
                            <h3 className="article-title">{article.title}</h3>
                            <p className="article-excerpt">{article.excerpt}</p>

                            <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-glass)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <User size={16} color="var(--text-muted)" />
                                    </div>
                                    <div style={{ fontSize: '0.85rem' }}>
                                        <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{article.author}</div>
                                        <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Clock size={12} /> {article.time}
                                        </div>
                                    </div>
                                </div>
                                <ArrowRight size={20} color="var(--accent-primary)" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '80px' }}>
                <button style={{ padding: '16px 32px', borderRadius: '14px', background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', fontWeight: '700', cursor: 'pointer' }}>
                    View All Articles
                </button>
            </div>
        </div>
    );
};

export default Articles;
