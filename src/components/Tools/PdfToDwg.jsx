import { useState } from "react";
import { 
  Box, 
  Download, 
  Loader2, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import Dropzone from '../UI/Dropzone';
import { downloadBlob } from '../../utils/pdfHelpers';
import { motion } from 'framer-motion';

const PdfToDwg = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, processing, success
  const [result, setResult] = useState(null);

  const handleConvert = async () => {
    if (!file) return;
    setStatus('processing');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('format', 'dwg'); // The server will try to handle this

      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'CAD conversion failed');
      }

      const blob = await response.blob();
      setResult(blob);
      setStatus('success');
    } catch (err) {
      console.error('CAD conversion failed:', err);
      setStatus('idle');
      alert(`Conversion failed: ${err.message}. Note: Complex PDF to DWG conversion requires specialized server-side engines.`);
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
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>PDF to DWG Converter</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Transform your PDF drawings into editable CAD files.</p>
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
                <h4 style={{ marginBottom: '1.5rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.6 }}>CAD Options</h4>
                <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Box size={24} color="#0f172a" />
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>Ready for DWG</div>
                  </div>
                </div>
                
                <div style={{ marginBottom: '1.5rem', padding: '0.75rem', backgroundColor: 'rgba(37, 99, 235, 0.05)', borderRadius: '10px', fontSize: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                  <ShieldCheck size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                  <p style={{ margin: 0 }}>All vectors and layers will be reconstructed into the DWG file.</p>
                </div>

                <button className="btn-primary" onClick={handleConvert} style={{ width: '100%', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                  Convert to DWG <ArrowRight size={20} />
                </button>
                <button onClick={reset} className="btn-secondary" style={{ width: '100%', marginTop: '1rem' }}>Clear All</button>
              </motion.div>
            </div>
          )}
        </>
      )}

      {status === 'processing' && (
        <div style={{ textAlign: 'center', padding: '6rem 0' }}>
          <Loader2 size={64} className="animate-spin" style={{ color: '#0f172a', margin: '0 auto' }} />
          <h3 style={{ marginTop: '2rem' }}>Extracting CAD Geometry...</h3>
          <p style={{ color: 'var(--text-muted)' }}>Converting PDF vectors to DWG primitives.</p>
        </div>
      )}

      {status === 'success' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}>
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', borderColor: '#10b981' }}>
            <CheckCircle2 size={80} color="#10b981" style={{ margin: '0 auto 1.5rem' }} />
            <h3>{file.name.split('.')[0]}.dwg</h3>
            <p style={{ color: '#10b981', fontWeight: 600 }}>Ready for AutoCAD</p>
          </div>

          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} style={{ backgroundColor: 'rgba(16, 185, 129, 0.05)', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.2)', position: 'sticky', top: '1rem' }}>
            <h4 style={{ marginBottom: '1.5rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#10b981' }}>Export CAD</h4>
            <button className="btn-primary" onClick={() => downloadBlob(result, `${file.name.split('.')[0]}.dwg`, 'application/octet-stream')} style={{ width: '100%', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', backgroundColor: '#10b981' }}>
              <Download size={20} /> Download DWG
            </button>
            <button onClick={reset} className="btn-secondary" style={{ width: '100%', marginTop: '1rem' }}>Convert Another</button>
          </motion.div>
        </div>
      )}

      {/* SEO Content Section */}
      <div style={{ marginTop: '6rem', borderTop: '1px solid var(--border)', paddingTop: '4rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>Professional PDF to DWG Conversion</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '4rem' }}>
            Convert your PDF technical drawings into editable DWG or DXF CAD files. Perfect for architects, engineers, and designers who need to recover CAD geometry from PDF documents.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', marginBottom: '5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Vector Reconstruction</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Our converter doesn't just treat the PDF as an image. It identifies vector lines, arcs, and text, converting them back into editable CAD primitives that you can use in AutoCAD, SolidWorks, or Rhino.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Layer Preservation</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Whenever possible, our engine attempts to preserve the original layer structure of the PDF, making it much easier to organize and edit the resulting DWG file.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>High-Accuracy Scaling</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Maintain the correct scale of your technical drawings. Our engine analyzes the document dimensions to ensure that 1:1 scaling is preserved during the conversion process.</p>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '3rem', borderRadius: '32px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Frequently Asked Questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>What is the difference between DWG and DXF?</h4>
                <p style={{ opacity: 0.7 }}>DWG is the native format for AutoCAD, while DXF is an open exchange format. Our tool produces high-quality DWG files that are compatible with most modern CAD software.</p>
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Can I convert scanned PDFs to DWG?</h4>
                <p style={{ opacity: 0.7 }}>Scanned PDFs are essentially large images. For these, we use basic OCR and edge detection to reconstruct lines, but for best results, we recommend using vector-based PDFs (saved directly from CAD software).</p>
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Is my data secure?</h4>
                <p style={{ opacity: 0.7 }}>Yes. While CAD conversion requires server-side processing due to its complexity, your files are processed in an isolated environment and deleted immediately after the conversion is complete.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfToDwg;
