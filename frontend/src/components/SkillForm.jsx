import { useState } from "react";
import axios from "axios";
import FileUpload from "./FileUpload";

function SkillForm({ setResult }) {
    const [skills, setSkills] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Auto-clear previous result on new request
        setResult("");
        setErrorMsg("");

        const inputVal = skills.trim();
        if (!inputVal) {
            setErrorMsg("⚠️ Please enter valid skills.");
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post("http://localhost:5000/recommend", {
                skills: inputVal,
            }, {
                headers: token ? { 'x-auth-token': token } : {}
            });

            // Navigate exactly through our newly standardized Express API mapping
            if (res.data?.success && res.data?.prediction) {
                setResult(res.data.prediction);
            } else {
                setErrorMsg("Failed to extract job recommendation.");
            }
        } catch (err) {
            console.error(err);
            setErrorMsg(
                err.response?.data?.message || "❌ Network error. Please try again later."
            );
        } finally {
            setLoading(false);
        }
    };

    const isButtonDisabled = loading || !skills.trim();

    return (
        <form className="form-group" onSubmit={handleSubmit}>
            <FileUpload onExtractSuccess={(text) => setSkills(text)} />
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '12px', margin: '8px 0' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '0.1em' }}>OR</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
            </div>
            <input
                type="text"
                placeholder="React, Node, JavaScript, CSS"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                aria-label="Enter your skills"
                style={{ marginBottom: '20px' }}
            />

            <button type="submit" disabled={isButtonDisabled}>
                {loading ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className="spinner" style={{ width: '18px', height: '18px', borderTopColor: 'white' }}></span>
                        Analyzing...
                    </div>
                ) : (
                    "Get AI Recommendation"
                )}
            </button>

            {errorMsg && <p className="error-message" role="alert" style={{ marginTop: '16px', color: '#ef4444', fontSize: '0.85rem', fontWeight: 600 }}>{errorMsg}</p>}
        </form>
    );
}

export default SkillForm;
