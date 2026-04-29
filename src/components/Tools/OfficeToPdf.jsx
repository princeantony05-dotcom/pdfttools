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
      {status === 'idle' && (
        <>
          {!file ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: '800px', margin: '4rem auto' }}>
              <Dropzone 
                onFilesSelected={(f) => setFile(f[0])} 
                accept={accept} 
                multiple={false} 
              />
            </motion.div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Dropzone 
                  onFilesSelected={(f) => setFile(f[0])} 
                  accept={accept} 
                  multiple={false} 
                />
              </motion.div>

              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--border)', position: 'sticky', top: '1rem' }}>
                <h4 style={{ marginBottom: '1.5rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.6 }}>Conversion Options</h4>
                <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Icon size={24} color={color} />
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>Ready for PDF</div>
                  </div>
                </div>
                <button className="btn-primary" onClick={handleConvert} style={{ width: '100%', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                  Convert to PDF <ArrowRight size={20} />
                </button>
                <button onClick={reset} className="btn-secondary" style={{ width: '100%', marginTop: '1rem' }}>Clear All</button>
              </motion.div>
            </div>
          )}
        </>
      )}

      {status === 'processing' && (
        <div style={{ textAlign: 'center', padding: '6rem 0' }}>
          <Loader2 size={64} className="animate-spin" style={{ color: color, margin: '0 auto' }} />
          <h3 style={{ marginTop: '2rem' }}>Processing High-Fidelity PDF...</h3>
          <p style={{ color: 'var(--text-muted)' }}>Using LibreOffice Engine for perfect alignment.</p>
        </div>
      )}

      {status === 'success' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}>
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', borderColor: '#10b981' }}>
            <CheckCircle2 size={80} color="#10b981" style={{ margin: '0 auto 1.5rem' }} />
            <h3>{file.name.split('.')[0]}.pdf</h3>
            <p style={{ color: '#10b981', fontWeight: 600 }}>Ready for download</p>
          </div>

          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} style={{ backgroundColor: 'rgba(16, 185, 129, 0.05)', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.2)', position: 'sticky', top: '1rem' }}>
            <h4 style={{ marginBottom: '1.5rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#10b981' }}>Export PDF</h4>
            <button className="btn-primary" onClick={() => downloadBlob(result, `${file.name.split('.')[0]}.pdf`, 'application/pdf')} style={{ width: '100%', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', backgroundColor: '#10b981' }}>
              <Download size={20} /> Download PDF
            </button>
            <button onClick={reset} className="btn-secondary" style={{ width: '100%', marginTop: '1rem' }}>Convert Another</button>
          </motion.div>
        </div>
      )}

      {/* SEO Content Section */}
      <div style={{ marginTop: '6rem', borderTop: '1px solid var(--border)', paddingTop: '4rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>Professional Office to PDF Conversion</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '4rem' }}>
            Convert Word, Excel, and PowerPoint documents to professional-grade PDF files. We ensure perfect layout retention and high-fidelity reconstruction for all your business documents.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', marginBottom: '5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Perfect Layouts</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Our conversion engine uses industry-standard LibreOffice technology to ensure your fonts, tables, and images remain exactly where you put them. No more broken layouts or shifted text.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Multi-Format Support</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Whether you have a .docx Word file, a complex .xlsx spreadsheet, or a .pptx presentation, our tools handle them with ease, producing high-quality PDFs ready for sharing.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Privacy First</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>We understand the sensitivity of business documents. While conversion happens through our secure isolated engine, files are processed in-memory and never stored permanently on our servers.</p>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '3rem', borderRadius: '32px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Frequently Asked Questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Are my documents secure during conversion?</h4>
                <p style={{ opacity: 0.7 }}>Absolutely. We use a strictly isolated environment for every conversion. Your files are automatically deleted the moment the conversion is finished and the file is returned to you. We do not store, view, or share your data.</p>
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Will the PDF look the same as my Word file?</h4>
                <p style={{ opacity: 0.7 }}>Yes. We use the most accurate reconstruction engines available to ensure that what you see in your Office application is exactly what you get in the final PDF document.</p>
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Is there a file size limit?</h4>
                <p style={{ opacity: 0.7 }}>We support files up to 20MB for conversion. For larger files, we recommend compressing the images within your Office document before converting to PDF.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeToPdf;
