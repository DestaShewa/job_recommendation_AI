import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi! I'm your AI Guide. Not sure what skills to type? Ask me!", isAI: true }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { text: userMsg, isAI: false }]);
        setInput('');

        // Extremely native simple heuristic simulated conversational response mechanism
        setTimeout(() => {
            let aiResponse = "Interesting! You should type those exact words natively into the Resume Parser or manual text box.";
            const lowerMsg = userMsg.toLowerCase();

            if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
                aiResponse = "Hello! Try asking me 'What skills are good for data science?' or 'I like design'.";
            } else if (lowerMsg.includes('data') || lowerMsg.includes('python')) {
                aiResponse = "For Data Science, try inputting: Python, Pandas, Scikit-learn, SQL, and Machine Learning!";
            } else if (lowerMsg.includes('design') || lowerMsg.includes('ui') || lowerMsg.includes('ux')) {
                aiResponse = "For UI/UX logic, try inputting: Figma, HTML, CSS, React, and User Research.";
            } else if (lowerMsg.includes('web') || lowerMsg.includes('react')) {
                aiResponse = "For Web Development profiles, definitely list: React, Node.js, Express, HTML, CSS, and MongoDB.";
            }

            setMessages(prev => [...prev, { text: aiResponse, isAI: true }]);
        }, 600);
    };

    return (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000 }}>
            {isOpen ? (
                <div style={{
                    width: '360px',
                    height: '500px',
                    background: 'var(--bg-glass)',
                    backdropFilter: 'var(--glass-blur)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '24px',
                    boxShadow: 'var(--shadow-lg)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    animation: 'fadeUp 0.3s ease-out'
                }}>
                    <div style={{ background: 'var(--accent-primary)', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '12px' }}>
                                <MessageSquare size={20} />
                            </div>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>AI Career Guide</div>
                                <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Always active</div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', padding: '8px', borderRadius: '10px', display: 'flex' }}><X size={18} /></button>
                    </div>

                    <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {messages.map((msg, idx) => (
                            <div key={idx} style={{
                                alignSelf: msg.isAI ? 'flex-start' : 'flex-end',
                                background: msg.isAI ? 'var(--bg-card)' : 'var(--accent-primary)',
                                color: msg.isAI ? 'var(--text-primary)' : 'white',
                                padding: '12px 16px',
                                borderRadius: msg.isAI ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                                fontSize: '0.9rem',
                                maxWidth: '85%',
                                lineHeight: '1.5',
                                border: msg.isAI ? '1px solid var(--border-color)' : 'none',
                                boxShadow: 'var(--shadow-sm)'
                            }}>
                                {msg.text}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSend} style={{ padding: '20px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '12px', background: 'var(--bg-card)' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about careers..."
                            style={{ flex: 1, padding: '12px 18px', borderRadius: '14px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '0.9rem' }}
                        />
                        <button type="submit" style={{ background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '14px', width: '46px', height: '46px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', flexShrink: 0, transition: 'transform 0.2s ease' }}>
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            ) : (
                <div style={{ position: 'relative' }}>
                    <button
                        onClick={() => setIsOpen(true)}
                        style={{ width: '70px', height: '70px', borderRadius: '24px', background: 'var(--accent-primary)', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4)', transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1) translateY(-5px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1) translateY(0)'}
                    >
                        <MessageSquare size={32} />
                        <span style={{ position: 'absolute', top: -4, right: -4, width: '18px', height: '18px', background: '#ef4444', borderRadius: '50%', border: '3px solid var(--bg-primary)' }}></span>
                    </button>
                </div>
            )}
        </div>
    );
}

export default Chatbot;
