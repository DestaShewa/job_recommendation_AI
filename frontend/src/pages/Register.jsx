import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/auth/register', { name, email, password });
            if (res.data.success) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('name', res.data.name);
                navigate('/dashboard');
            }
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Secure Registration Failure.');
        }
    };

    return (
        <div className="glass-container" style={{ maxWidth: '400px' }}>
            <h1>Create Account</h1>
            <p className="subtitle">Track your AI career history</p>
            <form onSubmit={handleRegister} className="form-group">
                <input type="text" placeholder="Full Registered Name" value={name} onChange={e => setName(e.target.value)} required />
                <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password (min 6 char)" value={password} onChange={e => setPassword(e.target.value)} minLength="6" required />
                <button type="submit">Register Mappings</button>
            </form>
            {errorMsg && <p className="error-message" style={{ justifyContent: 'center' }}>{errorMsg}</p>}
            <p style={{ marginTop: '20px', color: '#64748b', fontSize: '0.9rem' }}>
                Already have an account? <Link to="/login" style={{ color: '#3b82f6', fontWeight: 600 }}>Proceed via Login</Link>
            </p>
        </div>
    );
}

export default Register;
