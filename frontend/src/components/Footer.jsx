import { Monitor, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="container-lg">
                <div className="footer-grid">
                    <div className="footer-info">
                        <div className="footer-logo">
                            <Monitor className="text-gradient" size={32} />
                            <span>PathFinder AI</span>
                        </div>
                        <p className="footer-desc">
                            Empowering the next generation of software engineers with precision AI career mapping and professional trajectory analysis. Built for excellence.
                        </p>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <a href="#" className="btn-icon" style={{ padding: '10px' }}><Mail size={20} /></a>
                            <a href="#" className="btn-icon" style={{ padding: '10px' }}><Monitor size={20} /></a>
                        </div>
                    </div>

                    <div className="footer-col">
                        <h4>Platform</h4>
                        <ul className="footer-links">
                            <li><a href="/">Home</a></li>
                            <li><a href="/analytics">Global Stats</a></li>
                            <li><a href="/articles">Career Articles</a></li>
                            <li><a href="/dashboard">My History</a></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Support</h4>
                        <ul className="footer-links">
                            <li><a href="#">Help Center</a></li>
                            <li><a href="#">Documentation</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Terms of Service</a></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Contact</h4>
                        <ul className="footer-links">
                            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Mail size={16} /> support@pathfinder.ai
                            </li>
                            <li>Addis Ababa, Ethiopia</li>
                            <li>San Francisco, CA</li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© 2026 PathFinder AI. All rights reserved.</p>
                    <div style={{ display: 'flex', gap: '24px' }}>
                        <span>Status: Operational</span>
                        <span>v2.4.0-premium</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
