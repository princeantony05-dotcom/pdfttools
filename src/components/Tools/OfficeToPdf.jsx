import { useState } from "react";
import { 
  FileText, 
  FileSpreadsheet, 
  Presentation,
  Download, 
  Loader2, 
  CheckCircle2, 
  Zap,
  ArrowRight
} from 'lucide-react';
import Dropzone from '../UI/Dropzone';
import { downloadBlob } from '../../utils/pdfHelpers';
import { motion } from 'framer-motion';

const OfficeToPdf = ({ type = 'word' }) => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, processing, success
  const [result, setResult] = useState(null);

  const getToolInfo = () => {
    switch (type) {
      case 'word': return { name: 'Word to PDF', icon: FileText, accept: '.docx,.doc', color: '#2563eb' };
      case 'excel': return { name: 'Excel to PDF', icon: FileSpreadsheet, accept: '.xlsx,.xls', color: '#059669' };
      case 'ppt': return { name: 'PPT to PDF', icon: Presentation, accept: '.pptx,.ppt', color: '#d97706' };
      default: return { name: 'Office to PDF', icon: FileText, accept: '.docx,.doc', color: '#2563eb' };
    }
  };

  const { icon: Icon, accept, color } = getToolInfo();

  const handleConvert = async () => {
    if (!file) return;
    setStatus('processing');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('format', '.pdf');

      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Server conversion failed');
      }

      const blob = await response.blob();
      setResult(blob);
      setStatus('success');
    } catch (err) {
      console.error('Server conversion failed:', err);
      setStatus('idle');
      alert(`Conversion failed: ${err.message}`);
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setStatus('idle');
  };

  return (
    <div style={{ width: '100%' }}>
      {!file && status === 'idle' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Dropzone 
            onFilesSelected={(f) => setFile(f[0])} 
            accept={accept} 
            multiple={false} 
            label={`Drag & Drop your ${type.toUpperCase()} file here`}
          />
        </motion.div>
      )}

      {file && status === 'idle' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'center' }}>
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ color: color, marginBottom: '1rem' }}><Icon size={64} style={{ margin: '0 auto' }} /></div>
            <h3 style={{ marginBottom: '0.5rem' }}>{file.name}</h3>
            <p style={{ fontSize: '0.9rem', opacity: 0.6 }}>{(file.size / 1024).toFixed(1)} KB</p>
          </div>

          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--border)' }}>
            <h4 style={{ marginBottom: '1.5rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.6 }}>Conversion Options</h4>
            <button className="btn-primary" onClick={handleConvert} style={{ width: '100%', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
              Convert to PDF <ArrowRight size={20} />
            </button>
            <button onClick={reset} className="btn-secondary" style={{ width: '100%', marginTop: '1rem' }}>Change File</button>
          </motion.div>
        </div>
      )}

      {status === 'processing' && (
        <div style={{ textAlign: 'center', padding: '6rem 0' }}>
          <Loader2 size={64} className="animate-spin" style={{ color: color, margin: '0 auto' }} />
          <h3 style={{ marginTop: '2rem' }}>Processing High-Fidelity PDF...</h3>
          <p style={{ color: 'var(--text-muted)' }}>Using LibreOffice Engine for perfect alignment.</p>
        </div>
      )}

      {status === 'success' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'center' }}>
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', borderColor: '#10b981' }}>
            <CheckCircle2 size={80} color="#10b981" style={{ margin: '0 auto 1.5rem' }} />
            <h3>{file.name.split('.')[0]}.pdf</h3>
            <p style={{ color: '#10b981', fontWeight: 600 }}>Ready for download</p>
          </div>

          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} style={{ backgroundColor: 'rgba(16, 185, 129, 0.05)', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <h4 style={{ marginBottom: '1.5rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#10b981' }}>Export PDF</h4>
            <button className="btn-primary" onClick={() => downloadBlob(result, `${file.name.split('.')[0]}.pdf`, 'application/pdf')} style={{ width: '100%', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', backgroundColor: '#10b981' }}>
              <Download size={20} /> Download PDF
            </button>
            <button onClick={reset} className="btn-secondary" style={{ width: '100%', marginTop: '1rem' }}>Convert Another</button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default OfficeToPdf;
