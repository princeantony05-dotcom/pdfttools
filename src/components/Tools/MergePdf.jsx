import { useState, useEffect } from "react";
import Dropzone from '../UI/Dropzone';
import { mergePdfs, downloadBlob } from '../../utils/pdfHelpers';
import { Loader2, CheckCircle, Combine, ArrowRight, Download, GripVertical, Trash2, FileText } from 'lucide-react';
import { motion, Reorder } from 'framer-motion';
import * as pdfjs from 'pdfjs-dist';

// Set worker source for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.6.205/build/pdf.worker.min.mjs`;

const MergePdf = () => {
  const [files, setFiles] = useState([]); // { file, thumbnail }
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [result, setResult] = useState(null);

  const generateThumbnail = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 0.2 });
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      await page.render({ canvasContext: context, viewport }).promise;
      return canvas.toDataURL();
    } catch (err) {
      console.error("Error generating thumbnail:", err);
      return null;
    }
  };

  const handleFilesSelected = async (newFiles) => {
    const updatedFiles = [...files];
    for (const file of newFiles) {
      const thumbnail = await generateThumbnail(file);
      updatedFiles.push({ file, thumbnail, id: `${file.name}-${Date.now()}-${Math.random()}` });
    }
    setFiles(updatedFiles);
  };

  const handleMerge = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);
    try {
      const fileObjects = files.map(f => f.file);
      const mergedPdfBytes = await mergePdfs(fileObjects);
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

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
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
              <Dropzone onFilesSelected={handleFilesSelected} />
            </motion.div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }}>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Dropzone onFilesSelected={handleFilesSelected} />
              </motion.div>

              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="glass-card" style={{ padding: '1.5rem', borderRadius: '24px', position: 'sticky', top: '1rem' }}>
                <h4 style={{ marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.6 }}>Files to Merge</h4>
                
                <Reorder.Group 
                  axis="y" 
                  values={files} 
                  onReorder={setFiles}
                  style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '500px', overflowY: 'auto', padding: '0.5rem' }}
                >
                  {files.map((fileObj) => (
                    <Reorder.Item 
                      key={fileObj.id} 
                      value={fileObj}
                      style={{ 
                        listStyle: 'none',
                        cursor: 'grab'
                      }}
                    >
                      <div className="glass" style={{ 
                        padding: '0.75rem', 
                        borderRadius: '14px', 
                        border: '1px solid var(--border)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '1rem',
                        background: 'rgba(255,255,255,0.03)'
                      }}>
                        <GripVertical size={16} style={{ opacity: 0.2 }} />
                        
                        {/* Thumbnail Preview */}
                        <div style={{ 
                          width: '50px', 
                          height: '65px', 
                          backgroundColor: '#fff', 
                          borderRadius: '6px', 
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                          {fileObj.thumbnail ? (
                            <img src={fileObj.thumbnail} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                          ) : (
                            <FileText size={24} color="#94a3b8" />
                          )}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {fileObj.file.name}
                          </div>
                          <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>
                            {(fileObj.file.size / 1024).toFixed(1)} KB
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => removeFile(fileObj.id)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '8px', opacity: 0.6 }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button className="btn-primary" onClick={handleMerge} disabled={files.length < 2} style={{ width: '100%', padding: '1.25rem', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontSize: '1rem', fontWeight: 600 }}>
                    Merge Documents <ArrowRight size={20} />
                  </button>
                  <button onClick={reset} className="btn-secondary" style={{ width: '100%', padding: '1rem', borderRadius: '16px' }}>Clear All</button>
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

      {/* SEO Content Section */}
      <div style={{ marginTop: '6rem', borderTop: '1px solid var(--border)', paddingTop: '4rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>How to Merge PDF Files Online for Free</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '4rem' }}>
            Combine multiple PDF documents into a single, professional file in seconds. PDFMasterstool offers a 100% private, browser-side solution—your files never leave your computer.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', marginBottom: '5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>1. Upload Your Files</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Drag and drop your PDF files into the box above. You can add as many files as you need, and they will be loaded instantly from your local storage.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>2. Reorder & Organize</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Drag the files to change their order in the final document. Use the preview thumbnails to ensure everything is in the right place before merging.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>3. Merge & Download</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Click 'Merge Documents' and our browser-side engine will combine them into one file. Download your result immediately without waiting for server uploads.</p>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '3rem', borderRadius: '32px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Frequently Asked Questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Is it safe to merge my PDFs here?</h4>
                <p style={{ opacity: 0.7 }}>Yes, absolutely. Unlike traditional online PDF tools, PDFMasterstool processes everything locally in your web browser. Your sensitive documents are never uploaded to any server, making it the most private way to merge PDFs.</p>
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Is there a limit on the number of files I can merge?</h4>
                <p style={{ opacity: 0.7 }}>There is no hard limit on the number of files, though very large documents (hundreds of MBs) may depend on your device's memory since all processing happens locally.</p>
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Do I need to install any software?</h4>
                <p style={{ opacity: 0.7 }}>No installation is required. Our tool works directly in any modern web browser like Chrome, Firefox, or Safari, leveraging the latest web technologies to provide professional-grade PDF processing.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MergePdf;


