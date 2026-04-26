import { useState } from "react";
import Dropzone from '../UI/Dropzone';
import { mergePdfs, downloadBlob } from '../../utils/pdfHelpers';
import { Loader2, CheckCircle, Combine, ArrowRight, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const MergePdf = () => {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [result, setResult] = useState(null);

  const handleMerge = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);
    try {
      const mergedPdfBytes = await mergePdfs(files);
      setResult(mergedPdfBytes);
      downloadBlob(mergedPdfBytes, 'merged_document.pdf', 'application/pdf');
      setIsComplete(true);
    } catch (error) {
      console.error('Merge failed:', error);
      alert('Failed to merge PDFs.');
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setFiles([]);
    setIsComplete(false);
    setResult(null);
  };

  return (
    <div style={{ width: '100%' }}>
      {!isComplete && !isProcessing && (
        <>
          {files.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: '800px', margin: '4rem auto' }}>
              <Dropzone onFilesSelected={setFiles} />
            </motion.div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Dropzone onFilesSelected={setFiles} />
              </motion.div>

              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--border)', position: 'sticky', top: '1rem' }}>
                <h4 style={{ marginBottom: '1.5rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.6 }}>Merge Options</h4>
                <div style={{ marginBottom: '1.5rem', maxHeight: '200px', overflowY: 'auto', padding: '0.5rem' }}>
                  {files.map((f, i) => (
                    <div key={i} style={{ fontSize: '0.75rem', padding: '0.5rem', backgroundColor: 'white', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {f.name}
                    </div>
                  ))}
                </div>
                <button className="btn-primary" onClick={handleMerge} disabled={files.length < 2} style={{ width: '100%', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                  Merge Files <ArrowRight size={20} />
                </button>
                <button onClick={reset} className="btn-secondary" style={{ width: '100%', marginTop: '1rem' }}>Clear All</button>
              </motion.div>
            </div>
          )}
        </>
      )}

      {isProcessing && (
        <div style={{ textAlign: 'center', padding: '6rem 0' }}>
          <Loader2 size={64} className="animate-spin" style={{ color: 'var(--primary)', margin: '0 auto' }} />
          <h3 style={{ marginTop: '2rem' }}>Merging Documents...</h3>
        </div>
      )}

      {isComplete && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}>
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', borderColor: '#10b981' }}>
            <CheckCircle size={80} color="#10b981" style={{ margin: '0 auto 1.5rem' }} />
            <h3>Merged Document Ready</h3>
            <p style={{ fontSize: '0.9rem', opacity: 0.6 }}>{files.length} files combined successfully</p>
          </div>

          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} style={{ backgroundColor: 'rgba(16, 185, 129, 0.05)', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.2)', position: 'sticky', top: '1rem' }}>
            <h4 style={{ marginBottom: '1.5rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#10b981' }}>Export PDF</h4>
            <button className="btn-primary" onClick={() => downloadBlob(result, 'merged_document.pdf', 'application/pdf')} style={{ width: '100%', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', backgroundColor: '#10b981' }}>
              <Download size={20} /> Download PDF
            </button>
            <button onClick={reset} className="btn-secondary" style={{ width: '100%', marginTop: '1rem' }}>Merge More</button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MergePdf;


