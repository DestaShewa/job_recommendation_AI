import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Moon, Sun, Monitor, LogOut } from 'lucide-react';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Chatbot from './components/Chatbot';
import Footer from './components/Footer';
import Articles from './pages/Articles';
import DashboardLayout from './components/DashboardLayout';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import CareerSwitch from './pages/CareerSwitch';
import ATSScanner from './pages/ATSScanner';
import InterviewPrep from './pages/InterviewPrep';
import SkillTree from './pages/SkillTree';
import MarketInsights from './pages/MarketInsights';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const token = localStorage.getItem('token');
  const name = localStorage.getItem('name');

  const isDashboardRoute = location.pathname.startsWith('/dashboard');

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
      {!isDashboardRoute && (
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
          <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 900, fontSize: '1.4rem', letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Monitor size={24} color="var(--accent-primary)" />
            PathFinder AI
          </Link>

          <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/articles" className="nav-link">Resources</Link>

            <button onClick={toggleTheme} className="theme-toggle" style={{ marginLeft: '8px' }}>
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {token ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginLeft: '12px', borderLeft: '1px solid var(--border-color)', paddingLeft: '28px' }}>
                <Link to="/dashboard" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 600 }}>Dashboard</Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.8rem' }}>
                    {name ? name[0].toUpperCase() : 'U'}
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{name}</span>
                </div>
                <button onClick={handleLogout} className="btn-icon">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginLeft: '12px' }}>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="btn-hero" style={{ padding: '10px 20px', fontSize: '0.9rem', borderRadius: '12px' }}>Start Free Journey</Link>
              </div>
            )}
          </div>
        </nav>
      )}

      <main style={{ flex: 1, width: '100%' }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/articles" element={<Articles />} />

          {/* Authenticated Sidebar Layout Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="resume-analyzer" element={<ResumeAnalyzer />} />
            <Route path="career-switch" element={<CareerSwitch />} />
            <Route path="ats-scanner" element={<ATSScanner />} />
            <Route path="interview-prep" element={<InterviewPrep />} />
            <Route path="skill-tree" element={<SkillTree />} />
            <Route path="market-insights" element={<MarketInsights />} />
          </Route>
        </Routes>
      </main>

      {!isDashboardRoute && <Footer />}
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
