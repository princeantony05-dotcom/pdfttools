import { useState } from "react";
import Dropzone from '../UI/Dropzone';
import { mergePdfs, downloadBlob } from '../../utils/pdfHelpers';
import { Loader2, CheckCircle, Combine, ArrowRight, Download, GripVertical, Trash2 } from 'lucide-react';
import { motion, Reorder } from 'framer-motion';

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

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Dropzone onFilesSelected={(newFiles) => setFiles(prev => [...prev, ...newFiles])} />
              </motion.div>

              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="glass-card" style={{ padding: '1.5rem', borderRadius: '24px', position: 'sticky', top: '1rem' }}>
                <h4 style={{ marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.6 }}>Files to Merge</h4>
                
                <Reorder.Group 
                  axis="y" 
                  values={files} 
                  onReorder={setFiles}
                  style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '400px', overflowY: 'auto', padding: '0.5rem' }}
                >
                  {files.map((file, index) => (
                    <Reorder.Item 
                      key={`${file.name}-${index}`} 
                      value={file}
                      style={{ 
                        listStyle: 'none',
                        cursor: 'grab'
                      }}
                    >
                      <div className="glass" style={{ 
                        padding: '1rem', 
                        borderRadius: '12px', 
                        border: '1px solid var(--border)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.75rem',
                        background: 'rgba(255,255,255,0.03)'
                      }}>
                        <GripVertical size={16} style={{ opacity: 0.3 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {file.name}
                          </div>
                          <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>
                            {(file.size / 1024).toFixed(1)} KB
                          </div>
                        </div>
                        <button 
                          onClick={() => removeFile(index)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px', opacity: 0.6 }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button className="btn-primary" onClick={handleMerge} disabled={files.length < 2} style={{ width: '100%', padding: '1.1rem', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                    Merge Documents <ArrowRight size={20} />
                  </button>
                  <button onClick={reset} className="btn-secondary" style={{ width: '100%', padding: '0.9rem', borderRadius: '14px' }}>Clear All</button>
                </div>
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


