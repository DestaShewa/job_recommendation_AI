import { useState, useRef } from 'react';
import axios from 'axios';
import { UploadCloud, FileText, CheckCircle2 } from 'lucide-react';

function FileUpload({ onExtractSuccess }) {
    const [isHovering, setIsHovering] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [fileName, setFileName] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");
    const fileInputRef = useRef(null);

    const handleFileSubmit = async (file) => {
        if (!file) return;
        if (file.type !== 'application/pdf') {
            setErrorMsg("⚠️ Only PDF files are supported.");
            return;
        }

        setErrorMsg("");
        setIsUploading(true);
        setFileName(file.name);

        const formData = new FormData();
        formData.append('resume', file);

        try {
            const res = await axios.post("http://localhost:5000/upload", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data?.success && res.data?.extractedSkills) {
                onExtractSuccess(res.data.extractedSkills);
            }
        } catch (err) {
            console.error(err);
            setErrorMsg(err.response?.data?.message || "❌ Failed to parse PDF natively.");
            setFileName(null);
        } finally {
            setIsUploading(false);
        }
    };

    const onDrop = (e) => {
        e.preventDefault();
        setIsHovering(false);
        handleFileSubmit(e.dataTransfer?.files[0]);
    };

    const onFileSelect = (e) => {
        handleFileSubmit(e.target.files[0]);
    };

    return (
        <div style={{ marginBottom: '8px' }}>
            <div
                className={`file-upload-zone ${isHovering ? 'hovering' : ''} ${fileName ? 'success' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setIsHovering(true); }}
                onDragLeave={() => setIsHovering(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    accept="application/pdf"
                    onChange={onFileSelect}
                    style={{ display: 'none' }}
                />

                {isUploading ? (
                    <div className="upload-content">
                        <span className="spinner" style={{ borderColor: 'rgba(59, 130, 246, 0.3)', borderTopColor: '#3b82f6' }}></span>
                        <p style={{ color: '#3b82f6', fontWeight: 600 }}>Parsing Resume AI...</p>
                    </div>
                ) : fileName ? (
                    <div className="upload-content success-content">
                        <CheckCircle2 color="#10b981" size={28} />
                        <p style={{ color: '#10b981', fontWeight: 600 }}>{fileName} Processed!</p>
                    </div>
                ) : (
                    <div className="upload-content">
                        <UploadCloud color="#64748b" size={32} />
                        <p><b>Drag & Drop your Resume</b> or click to browse</p>
                        <span>Extracts logic automatically via PDF AI</span>
                    </div>
                )}
            </div>
            {errorMsg && <p className="error-message" style={{ marginTop: '12px', justifyContent: 'center' }}>{errorMsg}</p>}
        </div>
    );
}

export default FileUpload;
