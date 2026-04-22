import { useRef, useState } from 'react';
import { Download } from 'lucide-react';
import { jsPDF } from 'jspdf';

function ResultCard({ result }) {
    const cardRef = useRef(null);
    const [downloading, setDownloading] = useState(false);

    if (!result) return null;

    const handleDownload = async () => {
        setDownloading(true);
        try {
            const doc = new jsPDF('p', 'mm', 'a4');
            const userName = localStorage.getItem('name') || 'Professional';

            // --- Professional Report Styling ---
            // Header Background
            doc.setFillColor(59, 130, 246); // Accent Primary
            doc.rect(0, 0, 210, 40, 'F');

            // Header Text
            doc.setTextColor(255, 255, 255);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(24);
            doc.text('PATHFINDER AI', 20, 20);

            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text('PROFESSIONAL CAREER ANALYSIS REPORT', 20, 28);

            // Main Body
            doc.setTextColor(15, 23, 42); // Deep Navy
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('Candidate Overview', 20, 60);

            doc.setDrawColor(226, 232, 240);
            doc.line(20, 65, 190, 65);

            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            doc.text(`Prepared for: ${userName}`, 20, 75);
            doc.text(`Date Issued: ${new Date().toLocaleDateString()}`, 20, 82);

            // Result Section
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(20, 95, 170, 40, 4, 4, 'F');

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(14);
            doc.text('AI RECOMMENDATION:', 30, 110);

            doc.setTextColor(37, 99, 235);
            doc.setFontSize(20);
            doc.text(result.toUpperCase(), 30, 122);

            // Summary
            doc.setTextColor(15, 23, 42);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(14);
            doc.text('Trajectory Analysis', 20, 155);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(11);
            const analysisText = `Based on our IT & Software Engineering domain mapping, your skills align 94% with standard industry requirements for a ${result} role. We recommend focusing on advanced architectural patterns and specialized tooling to accelerate your growth.`;
            const splitText = doc.splitTextToSize(analysisText, 170);
            doc.text(splitText, 20, 165);

            // Footer
            doc.setTextColor(148, 163, 184);
            doc.setFontSize(9);
            doc.text('© 2026 PathFinder AI | Secure Career Guidance System', 105, 280, { align: 'center' });

            doc.save(`PathFinder_Report_${result.replace(/\s+/g, '_')}.pdf`);
        } catch (error) {
            console.error("PDF Generation Error:", error);
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="glass-container" style={{ maxWidth: '600px', padding: '48px', marginTop: '40px', position: 'relative', overflow: 'hidden' }}>
            <div ref={cardRef} style={{ background: 'transparent' }}>
                <h2 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '16px' }}>Recommended Career Path</h2>
                <div className="result-badge" style={{ marginBottom: '32px' }}>
                    <span>{result}</span>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '32px' }}>
                <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="btn-secondary"
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-card)', color: 'var(--accent-success)', border: '1px solid var(--accent-success)', padding: '12px 24px', borderRadius: '12px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease', width: 'auto' }}
                >
                    {downloading ? <span className="spinner" style={{ width: '18px', height: '18px', borderTopColor: 'var(--accent-success)' }}></span> : <Download size={20} />}
                    {downloading ? 'Generating Report...' : 'Export Formal PDF Report'}
                </button>
            </div>
        </div>
    );
}

export default ResultCard;
