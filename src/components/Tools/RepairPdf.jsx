import { useState } from "react";
import { 
  LifeBuoy, 
  Download, 
  Loader2, 
  CheckCircle2, 
  Wrench,
  AlertTriangle,
  ShieldCheck
} from 'lucide-react';
import Dropzone from '../UI/Dropzone';
import { downloadBlob } from '../../utils/pdfHelpers';
import { motion } from 'framer-motion';

const RepairPdf = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, processing, success
  const [result, setResult] = useState(null);

  const handleRepair = async () => {
    if (!file) return;
    setStatus('processing');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('format', 'repair'); // Special mode for server

      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Repair process failed');
      }

      const blob = await response.blob();
      setResult(blob);
      setStatus('success');
    } catch (err) {
      console.error('Repair failed:', err);
      setStatus('idle');
      alert(`Repair failed: ${err.message}. Some PDFs may be too corrupted for automatic recovery.`);
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
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Repair PDF Document</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Recover data and fix structural issues in corrupted PDF files.</p>
              </div>
              <Dropzone 
                onFilesSelected={(f) => setFile(f[0])} 
                accept=".pdf" 
                multiple={false} 
              />
            </motion.div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Dropzone 
                  onFilesSelected={(f) => setFile(f[0])} 
                  accept=".pdf" 
                  multiple={false} 
                />
              </motion.div>

              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--border)', position: 'sticky', top: '1rem' }}>
                <h4 style={{ marginBottom: '1.5rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.6 }}>Repair Options</h4>
                <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <LifeBuoy size={24} color="#10b981" />
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>Ready for analysis</div>
                  </div>
                </div>
                
                <div style={{ marginBottom: '1.5rem', padding: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.05)', borderRadius: '10px', fontSize: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                  <ShieldCheck size={16} style={{ color: '#10b981', flexShrink: 0 }} />
                  <p style={{ margin: 0 }}>We will attempt to rebuild the cross-reference table and recover as many pages as possible.</p>
                </div>

                <button className="btn-primary" onClick={handleRepair} style={{ width: '100%', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', backgroundColor: '#10b981' }}>
                  <Wrench size={20} /> Repair PDF
                </button>
                <button onClick={reset} className="btn-secondary" style={{ width: '100%', marginTop: '1rem' }}>Clear All</button>
              </motion.div>
            </div>
          )}
        </>
      )}

      {status === 'processing' && (
        <div style={{ textAlign: 'center', padding: '6rem 0' }}>
          <Loader2 size={64} className="animate-spin" style={{ color: '#10b981', margin: '0 auto' }} />
          <h3 style={{ marginTop: '2rem' }}>Rebuilding Document Structure...</h3>
          <p style={{ color: 'var(--text-muted)' }}>Using Ghostscript Engine for structural recovery.</p>
        </div>
      )}

      {status === 'success' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}>
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', borderColor: '#10b981' }}>
            <CheckCircle2 size={80} color="#10b981" style={{ margin: '0 auto 1.5rem' }} />
            <h3>repaired_{file.name}</h3>
            <p style={{ color: '#10b981', fontWeight: 600 }}>Structure Restored</p>
          </div>

          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} style={{ backgroundColor: 'rgba(16, 185, 129, 0.05)', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.2)', position: 'sticky', top: '1rem' }}>
            <h4 style={{ marginBottom: '1.5rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#10b981' }}>Download Results</h4>
            <button className="btn-primary" onClick={() => downloadBlob(result, `repaired_${file.name}`, 'application/pdf')} style={{ width: '100%', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', backgroundColor: '#10b981' }}>
              <Download size={20} /> Download Repaired PDF
            </button>
            <button onClick={reset} className="btn-secondary" style={{ width: '100%', marginTop: '1rem' }}>Try Another</button>
          </motion.div>
        </div>
      )}

      {/* SEO Content Section */}
      <div style={{ marginTop: '6rem', borderTop: '1px solid var(--border)', paddingTop: '4rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>How to Repair Corrupted PDF Files Online</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '4rem' }}>
            Recover content from damaged PDF documents that won't open or show errors. Our professional repair engine analyzes the file structure and attempts to rebuild it for standard PDF readers.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', marginBottom: '5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>XRef Table Recovery</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Many "corrupted" PDFs simply have a broken cross-reference table. Our tool identifies these gaps and reconstructs the table, making the document readable again in seconds.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Ghostscript Processing</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>We utilize the industry-standard Ghostscript engine to re-process damaged files. This often bypasses minor errors and produces a clean, standards-compliant PDF file.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Secure & Private</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Your documents are processed in a secure, isolated environment. We value your privacy, which is why all repaired files are automatically deleted after the process is finished.</p>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '3rem', borderRadius: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <AlertTriangle size={32} color="#f59e0b" />
              <h2 style={{ fontSize: '2rem', margin: 0 }}>Important Information</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Can every corrupted PDF be fixed?</h4>
                <p style={{ opacity: 0.7 }}>While our tool is highly effective for structural damage, it cannot recover data that has been physically deleted or overwritten. If the file is significantly truncated, some pages may be lost.</p>
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Does it work on password-protected files?</h4>
                <p style={{ opacity: 0.7 }}>If the file is both corrupted and password-protected, the repair process is significantly more complex. We recommend ensuring you have the password before attempting a repair.</p>
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Is the repair tool free?</h4>
                <p style={{ opacity: 0.7 }}>Yes, PDFMasterstool provides this professional repair service for free as part of our commitment to accessible document tools for everyone.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepairPdf;
