import { useState } from "react";
import { 
  FileText, 
  FileSpreadsheet, 
  Presentation,
  Download, 
  Loader2, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';
import Dropzone from '../UI/Dropzone';
import { downloadBlob } from '../../utils/pdfHelpers';
import { motion } from 'framer-motion';

const PdfToOffice = ({ type = 'word' }) => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, processing, success
  const [result, setResult] = useState(null);

  const getToolInfo = () => {
    switch (type) {
      case 'word': return { name: 'PDF to Word', icon: FileText, format: 'docx', color: '#2563eb' };
      case 'excel': return { name: 'PDF to Excel', icon: FileSpreadsheet, format: 'xlsx', color: '#059669' };
      case 'ppt': return { name: 'PDF to PPT', icon: Presentation, format: 'pptx', color: '#d97706' };
      default: return { name: 'PDF to Office', icon: FileText, format: 'docx', color: '#2563eb' };
    }
  };

  const { icon: Icon, format, color } = getToolInfo();

  const handleConvert = async () => {
    if (!file) return;
    setStatus('processing');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('format', format);

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
      console.error('Conversion failed:', err);
      setStatus('idle');
      alert(`Failed to convert PDF: ${err.message}`);
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
            accept=".pdf" 
            multiple={false} 
            label="Select the PDF you want to convert"
          />
        </motion.div>
      )}

      {file && status === 'idle' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'center' }}>
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ color: color, marginBottom: '1rem' }}><Icon size={64} style={{ margin: '0 auto' }} /></div>
            <h3 style={{ marginBottom: '0.5rem' }}>{file.name}</h3>
            <p style={{ fontSize: '0.9rem', opacity: 0.6 }}>PDF Document</p>
          </div>

          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <button className="btn-primary" onClick={handleConvert} style={{ width: '100%', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
              Convert to {format.toUpperCase()} <ArrowRight size={20} />
            </button>
            <button onClick={reset} className="btn-secondary" style={{ width: '100%', marginTop: '1rem' }}>Change File</button>
          </motion.div>
        </div>
      )}

      {status === 'processing' && (
        <div style={{ textAlign: 'center', padding: '6rem 0' }}>
          <Loader2 size={64} className="animate-spin" style={{ color: color, margin: '0 auto' }} />
          <h3 style={{ marginTop: '2rem' }}>Reconstructing Document...</h3>
          <p style={{ color: 'var(--text-muted)' }}>Using High-Fidelity Python Engine for perfect formatting.</p>
        </div>
      )}

      {status === 'success' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'center' }}>
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', borderColor: '#10b981' }}>
            <CheckCircle2 size={80} color="#10b981" style={{ margin: '0 auto 1.5rem' }} />
            <h3>{file.name.split('.')[0]}.{format}</h3>
            <p style={{ color: '#10b981', fontWeight: 600 }}>Ready for download</p>
          </div>

          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <button className="btn-primary" onClick={() => downloadBlob(result, `${file.name.split('.')[0]}.${format}`, 'application/octet-stream')} style={{ width: '100%', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
              <Download size={20} /> Download {format.toUpperCase()}
            </button>
            <button onClick={reset} className="btn-secondary" style={{ width: '100%', marginTop: '1rem' }}>Convert Another</button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PdfToOffice;
