import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, SwitchCamera, BarChart3, LogOut, Monitor, Menu, X, Target, MessageSquare, Map, TrendingUp } from 'lucide-react';

const DashboardLayout = () => {
    const navigate = useNavigate();
    const name = localStorage.getItem('name');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        navigate('/login');
    };

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const navLinks = [
        { path: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Overview & History" },
        { path: "/dashboard/resume-analyzer", icon: <FileText size={20} />, label: "Resume Analyzer" },
        { path: "/dashboard/career-switch", icon: <SwitchCamera size={20} />, label: "Career Switch" },
        { path: "/dashboard/ats-scanner", icon: <Target size={20} />, label: "ATS Scanner" },
        { path: "/dashboard/interview-prep", icon: <MessageSquare size={20} />, label: "Mock Interviews" },
        { path: "/dashboard/skill-tree", icon: <Map size={20} />, label: "Career Roadmap" },
        { path: "/dashboard/market-insights", icon: <TrendingUp size={20} />, label: "Market Insights" },
        { path: "/dashboard/analytics", icon: <BarChart3 size={20} />, label: "Platform Analytics" }
    ];

    return (
        <div className="dashboard-container" style={{ display: 'flex', minHeight: '100vh', width: '100vw', background: 'var(--bg-primary)' }}>

            {/* Mobile Header overlay */}
            <div className="mobile-header" style={{ display: 'none', justifyContent: 'space-between', padding: '16px 24px', background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', position: 'fixed', top: 0, width: '100%', zIndex: 100 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', color: 'var(--text-primary)' }}>
                    <Monitor size={20} color="var(--accent-primary)" />
                    PathFinder AI
                </div>
                <button onClick={toggleSidebar} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
                    <Menu size={24} />
                </button>
            </div>

            {/* Sidebar Overlay for Mobile UX Blurs */}
            <div className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}></div>

            {/* Sidebar Navigation */}
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} style={{
                width: '280px',
                background: 'var(--bg-card)',
                borderRight: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease',
                zIndex: 99
            }}>
                <div className="sidebar-header" style={{ padding: '32px 24px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '900', fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                        <div style={{ padding: '8px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: 'var(--accent-primary)' }}>
                            <Monitor size={24} />
                        </div>
                        PathFinder AI
                    </div>
                    <button className="mobile-close-btn" onClick={toggleSidebar} style={{ display: 'none', background: 'none', border: 'none', color: 'var(--text-muted)' }}>
                        <X size={20} />
                    </button>
                </div>

                <div className="sidebar-nav" style={{ padding: '24px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '8px', paddingLeft: '12px' }}>
                        Platform Features
                    </div>
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            end={link.path === '/dashboard'}
                            onClick={() => setSidebarOpen(false)}
                            style={({ isActive }) => ({
                                display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '12px', textDecoration: 'none',
                                fontWeight: isActive ? '700' : '500',
                                color: isActive ? 'white' : 'var(--text-secondary)',
                                background: isActive ? 'var(--accent-primary)' : 'transparent',
                                transition: 'all 0.2s ease',
                                boxShadow: isActive ? '0 4px 12px rgba(37, 99, 235, 0.2)' : 'none'
                            })}
                        >
                            {link.icon}
                            {link.label}
                        </NavLink>
                    ))}
                </div>

                <div className="sidebar-footer" style={{ padding: '24px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.2rem' }}>
                            {name ? name[0].toUpperCase() : 'U'}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontWeight: '700', color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{name}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pro Member</div>
                        </div>
                    </div>
                    <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', padding: '8px', borderRadius: '8px', transition: 'background 0.2s' }} title="Logout">
                        <LogOut size={20} />
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="dashboard-main" style={{ flex: 1, padding: '40px', overflowY: 'auto', background: 'var(--bg-primary)' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
