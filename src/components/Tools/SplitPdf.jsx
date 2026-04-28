import { useState, useEffect } from "react";
import Dropzone from '../UI/Dropzone';
import { splitPdf, extractAllPages, downloadBlob } from '../../utils/pdfHelpers';
import { Loader2, CheckCircle, Scissors, FileText, Layers, Download, AlertCircle } from 'lucide-react';
import * as pdfjs from 'pdfjs-dist';
import JSZip from 'jszip';

// Set worker source for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.6.205/build/pdf.worker.min.mjs`;

const SplitPdf = () => {
  const [files, setFiles] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [splitMode, setSplitMode] = useState('ranges'); // 'ranges' or 'all'
  const [rangeInput, setRangeInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (files.length > 0) {
      loadPageCount(files[0]);
      setError(null);
    } else {
      setPageCount(0);
    }
  }, [files]);

  const loadPageCount = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      setPageCount(pdf.numPages);
    } catch (err) {
      console.error("Error loading PDF:", err);
      setError("Could not read PDF page count.");
    }
  };

  const handleSplit = async () => {
    if (files.length === 0) return;
    if (splitMode === 'ranges' && !rangeInput) {
      setError("Please enter at least one page range.");
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    try {
      const file = files[0];
      
      if (splitMode === 'ranges') {
        const ranges = rangeInput.split(',').map(r => r.trim());
        const resultPdfBytes = await splitPdf(file, ranges);
        downloadBlob(resultPdfBytes, `split_${file.name}`, 'application/pdf');
      } else {
        // Extract all pages
        const pdfs = await extractAllPages(file);
        const zip = new JSZip();
        
        pdfs.forEach(pdf => {
          zip.file(pdf.name, pdf.bytes);
        });
        
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        downloadBlob(zipBlob, `split_all_${file.name.replace('.pdf', '')}.zip`, 'application/zip');
      }
      
      setIsComplete(true);
    } catch (err) {
      console.error('Split failed:', err);
      setError(err.message || 'Failed to split PDF. Please check your ranges.');
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setIsComplete(false);
    setFiles([]);
    setRangeInput('');
    setError(null);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Split PDF
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
          Extract specific ranges or split every page into separate files.
        </p>
      </div>

      {!isComplete ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <Dropzone onFilesSelected={setFiles} multiple={false} accept=".pdf" />
          
          {files.length > 0 && (
            <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', animation: 'fadeIn 0.5s ease' }}>
              {/* File Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ padding: '0.75rem', background: 'rgba(var(--primary-rgb), 0.1)', borderRadius: '10px', color: 'var(--primary)' }}>
                  <FileText size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '1rem' }}>{files[0].name}</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {pageCount > 0 ? `${pageCount} Pages` : 'Calculating pages...'}
                  </p>
                </div>
              </div>

              {/* Mode Selection */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button 
                  onClick={() => setSplitMode('ranges')}
                  style={{
                    padding: '1.25rem',
                    borderRadius: '16px',
                    border: `1px solid ${splitMode === 'ranges' ? 'var(--primary)' : 'rgba(255,255,255,0.05)'}`,
                    background: splitMode === 'ranges' ? 'rgba(var(--primary-rgb), 0.1)' : 'var(--glass-bg)',
                    color: splitMode === 'ranges' ? 'white' : 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Scissors size={20} />
                  <span style={{ fontWeight: 600 }}>Custom Ranges</span>
                </button>
                <button 
                  onClick={() => setSplitMode('all')}
                  style={{
                    padding: '1.25rem',
                    borderRadius: '16px',
                    border: `1px solid ${splitMode === 'all' ? 'var(--primary)' : 'rgba(255,255,255,0.05)'}`,
                    background: splitMode === 'all' ? 'rgba(var(--primary-rgb), 0.1)' : 'var(--glass-bg)',
                    color: splitMode === 'all' ? 'white' : 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Layers size={20} />
                  <span style={{ fontWeight: 600 }}>Extract All Pages</span>
                </button>
              </div>

              {/* Inputs based on mode */}
              <div style={{ minHeight: '100px' }}>
                {splitMode === 'ranges' ? (
                  <div style={{ animation: 'slideUp 0.3s ease' }}>
                    <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      Enter page ranges to extract (e.g. 1-3, 5, 8-10):
                    </label>
                    <input 
                      type="text" 
                      value={rangeInput}
                      onChange={(e) => setRangeInput(e.target.value)}
                      placeholder="e.g. 1-3, 5"
                      style={{ 
                        width: '100%', 
                        padding: '16px', 
                        borderRadius: '12px', 
                        border: '1px solid rgba(255,255,255,0.2)', 
                        background: 'rgba(255,255,255,0.9)', 
                        color: '#000',
                        fontSize: '1rem',
                        fontWeight: '500',
                        outline: 'none',
                        transition: 'border-color 0.3s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                    />
                  </div>
                ) : (
                  <div style={{ padding: '1.5rem', background: 'rgba(var(--primary-rgb), 0.05)', borderRadius: '12px', border: '1px dashed rgba(var(--primary-rgb), 0.2)', animation: 'slideUp 0.3s ease' }}>
                    <p style={{ margin: 0, fontSize: '0.95rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      Every page will be saved as a separate PDF. Results will be downloaded as a <strong>ZIP file</strong>.
                    </p>
                  </div>
                )}
              </div>

              {error && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}
              
              <button 
                className="btn-primary" 
                onClick={handleSplit}
                disabled={isProcessing || (splitMode === 'ranges' && !rangeInput)}
                style={{ 
                  height: '56px',
                  borderRadius: '14px',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '0.75rem',
                  boxShadow: '0 10px 20px -5px rgba(var(--primary-rgb), 0.3)'
                }}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin" size={22} />
                    Processing PDF...
                  </>
                ) : (
                  <>
                    {splitMode === 'ranges' ? <Scissors size={22} /> : <Download size={22} />}
                    {splitMode === 'ranges' ? 'Split PDF' : 'Extract & Download ZIP'}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem', borderRadius: '24px', animation: 'scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            background: 'rgba(16, 185, 129, 0.1)', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 2rem',
            color: '#10b981'
          }}>
            <CheckCircle size={48} />
          </div>
          <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Split Complete!</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '400px', margin: '0 auto 2.5rem' }}>
            {splitMode === 'ranges' 
              ? 'Your extracted pages have been saved to a new PDF file.' 
              : 'All pages have been extracted and bundled into a ZIP file.'}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button 
              className="btn-secondary" 
              onClick={reset}
              style={{ padding: '0.75rem 2rem', borderRadius: '12px' }}
            >
              Split Another
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
};

export default SplitPdf;
