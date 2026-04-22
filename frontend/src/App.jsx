import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Moon, Sun, Monitor, LogOut } from 'lucide-react';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Chatbot from './components/Chatbot';

function AppContent() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const token = localStorage.getItem('token');
  const name = localStorage.getItem('name');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    navigate('/login');
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{
        padding: '16px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--nav-bg)',
        backdropFilter: 'var(--glass-blur)',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 800, fontSize: '1.4rem', letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Monitor size={24} color="var(--accent-primary)" />
          PathFinder AI
        </Link>

        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/analytics" className="nav-link">Analytics</Link>

          <button onClick={toggleTheme} className="theme-toggle">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {token ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginLeft: '12px', borderLeft: '1px solid var(--border-color)', paddingLeft: '24px' }}>
              <Link to="/dashboard" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 600 }}>Dashboard</Link>
              <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{name}</span>
              <button onClick={handleLogout} className="btn-icon">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn-primary">Get Started</Link>
            </div>
          )}
        </div>
      </nav>

      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '60px 40px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </main>
      <Chatbot />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
