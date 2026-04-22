import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/auth/login', { email, password });
            if (res.data.success) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('name', res.data.name);
                navigate('/dashboard');
            }
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Secure Login Failure.');
        }
    };

    return (
        <div className="glass-container" style={{ maxWidth: '400px' }}>
            <h1>Welcome Back</h1>
            <p className="subtitle">Sign in to view your career analytics metrics</p>
            <form onSubmit={handleLogin} className="form-group">
                <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password Hash" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="submit">Login Securely</button>
            </form>
            {errorMsg && <p className="error-message" style={{ justifyContent: 'center' }}>{errorMsg}</p>}
            <p style={{ marginTop: '20px', color: '#64748b', fontSize: '0.9rem' }}>
                Don't have an account mappings? <Link to="/register" style={{ color: '#3b82f6', fontWeight: 600 }}>Setup</Link>
            </p>
        </div>
    );
}

export default Login;
