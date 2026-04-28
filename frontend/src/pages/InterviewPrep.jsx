import { useState } from 'react';
import axios from 'axios';
import { PlayCircle, MessageSquare, CheckCircle2, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react';

const InterviewPrep = () => {
    const [role, setRole] = useState("");
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answer, setAnswer] = useState("");
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [sessionComplete, setSessionComplete] = useState(false);

    const handleGenerate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await axios.post('http://localhost:5000/interview/generate', { role });
            if (res.data.success) {
                setQuestions(res.data.questions);
                setCurrentIndex(0);
                setAnswer("");
                setFeedback(null);
                setSessionComplete(false);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Error generating mock questions.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitAnswer = async () => {
        if (!answer.trim()) return;
        setLoading(true);

        try {
            const res = await axios.post('http://localhost:5000/interview/evaluate', {
                question: questions[currentIndex],
                answer
            });
            if (res.data.success) {
                setFeedback(res.data);
            }
        } catch (err) {
            setError("Error evaluating response.");
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setAnswer("");
            setFeedback(null);
        } else {
            setSessionComplete(true);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '8px' }}>Mock <span className="text-gradient">Interviewer</span></h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Sharpen your technical communication. Request role-specific questions and refine your responses natively.</p>
            </div>

            {error && (
                <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            {questions.length === 0 && !loading && (
                <div className="glass-container slide-up-anim" style={{ padding: '40px', borderRadius: '24px', textAlign: 'center' }}>
                    <div style={{ width: '80px', height: '80px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                        <PlayCircle size={40} />
                    </div>
                    <form onSubmit={handleGenerate}>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', color: 'var(--text-primary)' }}>Start a New Session</h2>
                        <input
                            type="text"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            placeholder="e.g. Senior Frontend Engineer"
                            style={{ width: '100%', maxWidth: '400px', padding: '16px', borderRadius: '12px', marginBottom: '24px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                            required
                        />
                        <br />
                        <button type="submit" className="btn-hero" style={{ padding: '14px 32px' }}>Generate Scenario</button>
                    </form>
                </div>
            )}

            {loading && questions.length === 0 && (
                <div className="glass-container skeleton-pulse" style={{ padding: '40px', height: '300px', borderRadius: '24px' }}>
                    <div style={{ height: '40px', width: '60%', background: 'var(--border-color)', borderRadius: '8px', margin: '40px auto 20px' }}></div>
                    <div style={{ height: '20px', width: '40%', background: 'var(--border-color)', borderRadius: '4px', margin: '0 auto' }}></div>
                </div>
            )}

            {questions.length > 0 && !sessionComplete && (
                <div className="glass-container slide-up-anim" style={{ padding: '40px', borderRadius: '24px', textAlign: 'left' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                        <span style={{ fontWeight: '800', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Question {currentIndex + 1} of {questions.length}
                        </span>
                    </div>

                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', lineHeight: '1.4', marginBottom: '32px', color: 'var(--text-primary)' }}>
                        "{questions[currentIndex]}"
                    </h2>

                    <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Draft your response here... (Aim for 30 - 100 words)"
                        rows={6}
                        disabled={feedback !== null}
                        style={{ width: '100%', padding: '20px', borderRadius: '16px', background: 'var(--bg-primary)', border: '2px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '1.05rem', fontFamily: 'inherit', resize: 'vertical', marginBottom: '24px', opacity: feedback !== null ? 0.6 : 1 }}
                    />

                    {!feedback ? (
                        <button
                            onClick={handleSubmitAnswer}
                            disabled={!answer.trim() || loading}
                            className="btn-hero"
                            style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', opacity: (!answer.trim() || loading) ? 0.6 : 1 }}
                        >
                            {loading ? <span className="spinner" style={{ width: '20px', height: '20px' }}></span> : <MessageSquare size={20} />}
                            {loading ? 'Evaluating Pitch...' : 'Submit Answer'}
                        </button>
                    ) : (
                        <div className="slide-up-anim" style={{ background: feedback.metrics.status === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', border: `1px solid ${feedback.metrics.status === 'success' ? 'var(--accent-success)' : '#f59e0b'}`, padding: '24px', borderRadius: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: feedback.metrics.status === 'success' ? 'var(--accent-success)' : '#f59e0b', fontWeight: '800' }}>
                                {feedback.metrics.status === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                                Technical Evaluation
                            </div>
                            <p style={{ color: 'var(--text-primary)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '24px' }}>
                                {feedback.feedback}
                            </p>
                            <button
                                onClick={handleNext}
                                className="btn-hero"
                                style={{ width: '100%', background: 'var(--text-primary)', color: 'var(--bg-primary)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                            >
                                {currentIndex < questions.length - 1 ? 'Next Scenario \u2192' : 'Finish Session'}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {sessionComplete && (
                <div className="glass-container slide-up-anim" style={{ padding: '40px', borderRadius: '24px', textAlign: 'center' }}>
                    <div style={{ width: '100px', height: '100px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                        <CheckCircle2 size={50} />
                    </div>
                    <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '16px', color: 'var(--text-primary)' }}>Session Complete!</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '32px' }}>You successfully defended your technical architecture and concepts.</p>
                    <button onClick={() => { setQuestions([]); setSessionComplete(false); setRole(""); }} className="btn-hero" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <RefreshCw size={20} />
                        Run Another Simulation
                    </button>
                </div>
            )}
        </div>
    );
};

export default InterviewPrep;
