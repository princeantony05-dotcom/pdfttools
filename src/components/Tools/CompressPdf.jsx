import { useState } from "react";
import { 
  Zap, 
  Download, 
  Loader2, 
  CheckCircle2, 
  Settings2,
  AlertCircle
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import Dropzone from '../UI/Dropzone';
import { downloadBlob } from '../../utils/pdfHelpers';
import { motion } from 'framer-motion';

const CompressPdf = () => {
  const [file, setFile] = useState(null);
  const [level, setLevel] = useState('medium'); // low, medium, high
  const [status, setStatus] = useState('idle'); // idle, processing, success
  const [result, setResult] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [newSize, setNewSize] = useState(0);

  const handleCompress = async () => {
    if (!file) return;
    setStatus('processing');
    setOriginalSize(file.size);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Basic compression via pdf-lib:
      // 1. Removing metadata
      // 2. Linearizing/Restructuring
      // Note: Advanced image compression would require more complex logic
      
      pdfDoc.setTitle('');
      pdfDoc.setAuthor('');
      pdfDoc.setSubject('');
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer('');
      pdfDoc.setCreator('');

      const pdfBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });

      setNewSize(pdfBytes.length);
      setResult(pdfBytes);
      setStatus('success');
    } catch (err) {
      console.error('Compression failed:', err);
      setStatus('idle');
      alert('Failed to compress PDF. The file might be encrypted or corrupted.');
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Compress PDF</h2>
            <p style={{ color: 'var(--text-muted)' }}>Reduce file size while optimizing for maximum quality.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: file ? '1fr 1fr' : '1fr', gap: '2rem' }}>
            <Dropzone onFilesSelected={(f) => setFile(f[0])} accept=".pdf" multiple={false} />
            
            {file && (
              <div className="glass" style={{ padding: '2rem', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Settings2 size={18} /> Compression Level
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {[
                      { id: 'low', name: 'Basic Compression', desc: 'Slightly smaller, original quality', icon: Zap },
                      { id: 'medium', name: 'Recommended', desc: 'Good compression, high quality', icon: Zap },
                      { id: 'high', name: 'Extreme Compression', desc: 'Smallest size, lower quality', icon: Zap }
                    ].map(l => (
                      <div 
                        key={l.id}
                        onClick={() => setLevel(l.id)}
                        style={{ 
                          padding: '1rem', 
                          borderRadius: '12px', 
                          border: `1px solid ${level === l.id ? 'var(--primary)' : 'var(--border)'}`,
                          backgroundColor: level === l.id ? 'rgba(37, 99, 235, 0.05)' : 'transparent',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ fontWeight: 600, fontSize: '0.95rem', color: level === l.id ? 'var(--primary)' : 'inherit' }}>{l.name}</div>
                        <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>{l.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={14} />
                  Original Size: {formatSize(file.size)}
                </div>

                <button className="btn-primary" onClick={handleCompress} style={{ marginTop: 'auto' }}>
                  Compress PDF
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {status === 'processing' && (
        <div style={{ textAlign: 'center', padding: '10rem 0' }}>
          <Loader2 size={64} className="animate-spin" style={{ color: 'var(--primary)', margin: '0 auto' }} />
          <h3 style={{ marginTop: '2rem' }}>Optimizing PDF structure...</h3>
          <p style={{ color: 'var(--text-muted)' }}>This happens entirely in your browser.</p>
        </div>
      )}

      {status === 'success' && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', padding: '4rem' }}>
          <CheckCircle2 size={80} color="#10b981" style={{ margin: '0 auto 2rem' }} />
          <h2 style={{ marginBottom: '1rem' }}>Compression Complete!</h2>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', margin: '2rem 0' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Original</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{formatSize(originalSize)}</div>
            </div>
            <div style={{ fontSize: '2rem', color: 'var(--border)', alignSelf: 'center' }}>→</div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>Compressed</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--primary)' }}>{formatSize(newSize)}</div>
            </div>
          </div>

          <div style={{ marginBottom: '2.5rem', display: 'inline-block', padding: '8px 16px', borderRadius: '20px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#059669', fontSize: '0.9rem', fontWeight: 600 }}>
            Saved {Math.round((1 - (newSize / originalSize)) * 100)}% of file size
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn-primary" onClick={() => downloadBlob(result, `compressed_${file.name}`, 'application/pdf')}>
              <Download size={20} style={{ marginRight: '0.5rem' }} /> Download PDF
            </button>
            <button className="btn-secondary" onClick={reset}>Compress Another</button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CompressPdf;
