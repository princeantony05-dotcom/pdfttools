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
      {!isComplete && !isProcessing && files.length === 0 && (
        <Dropzone onFilesSelected={setFiles} />
      )}

      {files.length > 0 && !isProcessing && !isComplete && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'center' }}>
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Selected Files ({files.length})</h3>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem' }}>
              {files.map((f, i) => <li key={i} style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>{f.name}</li>)}
            </ul>
          </div>

          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <button className="btn-primary" onClick={handleMerge} disabled={files.length < 2} style={{ width: '100%', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
              Merge Files <ArrowRight size={20} />
            </button>
            <button onClick={reset} className="btn-secondary" style={{ width: '100%', marginTop: '1rem' }}>Clear All</button>
          </motion.div>
        </div>
      )}

      {isProcessing && (
        <div style={{ textAlign: 'center', padding: '6rem 0' }}>
          <Loader2 size={64} className="animate-spin" style={{ color: 'var(--primary)', margin: '0 auto' }} />
          <h3 style={{ marginTop: '2rem' }}>Merging Documents...</h3>
        </div>
      )}

      {isComplete && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'center' }}>
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', borderColor: '#10b981' }}>
            <CheckCircle size={80} color="#10b981" style={{ margin: '0 auto 1.5rem' }} />
            <h3>Merged Document Ready</h3>
          </div>

          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <button className="btn-primary" onClick={() => downloadBlob(result, 'merged_document.pdf', 'application/pdf')} style={{ width: '100%', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
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


