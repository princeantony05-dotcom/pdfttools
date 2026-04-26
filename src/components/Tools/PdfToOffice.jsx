import { useState } from "react";
import { 
  FileText, 
  FileSpreadsheet, 
  Presentation,
  Download, 
  Loader2, 
  CheckCircle2, 
  ChevronRight
} from 'lucide-react';
import Dropzone from '../UI/Dropzone';
import { downloadBlob } from '../../utils/pdfHelpers';
import { libreOfficeApi } from '../../utils/libreOfficeApi';
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

  const { name, icon: Icon, format, color } = getToolInfo();

  const handleConvert = async () => {
    if (!file) return;
    setStatus('processing');

    try {
      const resultBuffer = await libreOfficeApi.pdfToOffice(file, format);
      setResult(resultBuffer);
      setStatus('success');
    } catch (err) {
      console.error('Conversion failed:', err);
      setStatus('idle');
      alert('Failed to convert PDF. The file may be restricted or complex.');
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setStatus('idle');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {status === 'idle' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
               <div style={{ backgroundColor: 'rgba(0,0,0,0.05)', width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <FileText size={30} />
               </div>
               <ChevronRight size={24} style={{ color: 'var(--border)' }} />
               <div style={{ backgroundColor: `${color}15`, width: '80px', height: '80px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
                 <Icon size={40} />
               </div>
            </div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{name}</h2>
            <p style={{ color: 'var(--text-muted)' }}>Transform your static PDF into an editable {format.toUpperCase()} document.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
            <Dropzone 
              onFilesSelected={(f) => setFile(f[0])} 
              accept=".pdf" 
              multiple={false} 
              label="Select the PDF you want to convert"
            />
            
            {file && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: '400px' }}>
                <button className="btn-primary" onClick={handleConvert} style={{ width: '100%', padding: '1.25rem' }}>
                  Convert to {format.toUpperCase()}
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {status === 'processing' && (
        <div style={{ textAlign: 'center', padding: '10rem 0' }}>
          <Loader2 size={64} className="animate-spin" style={{ color: color, margin: '0 auto' }} />
          <h3 style={{ marginTop: '2rem' }}>Reconstructing document...</h3>
          <p style={{ color: 'var(--text-muted)' }}>This may take a few moments for complex layouts.</p>
        </div>
      )}

      {status === 'success' && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', padding: '4rem' }}>
          <CheckCircle2 size={80} color="#10b981" style={{ margin: '0 auto 2rem' }} />
          <h2 style={{ marginBottom: '1rem' }}>Success!</h2>
          <p style={{ marginBottom: '2.5rem', color: 'var(--text-muted)' }}>Your editable {format.toUpperCase()} is ready.</p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn-primary" onClick={() => downloadBlob(result, `${file.name.split('.')[0]}.${format}`, 'application/octet-stream')}>
              <Download size={20} style={{ marginRight: '0.5rem' }} /> Download {format.toUpperCase()}
            </button>
            <button className="btn-secondary" onClick={reset}>Convert Another</button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PdfToOffice;
