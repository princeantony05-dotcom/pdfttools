import { useState, useEffect, useRef } from 'react';
import { 
  Loader2, 
  RotateCw, 
  Trash2, 
  Download, 
  Plus,
  LayoutDashboard,
  GripHorizontal
} from 'lucide-react';
import { motion, Reorder } from 'framer-motion';
import { PDFDocument } from 'pdf-lib';
import * as pdfjs from 'pdfjs-dist';
import Dropzone from '../UI/Dropzone';
import { downloadBlob } from '../../utils/pdfHelpers';

// Set worker source for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.6.205/build/pdf.worker.min.mjs`;

const PdfOrganizer = () => {
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState([]); // { id, canvasUrl, rotation, originalIndex }
  const [status, setStatus] = useState('idle'); // idle, loading, processing, saving
  const [progress, setProgress] = useState(0);

  const loadPdf = async (selectedFile) => {
    setFile(selectedFile);
    setStatus('loading');
    setPages([]);
    
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;
      
      const loadedPages = [];
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.3 }); // Thumbnail scale
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await page.render({ canvasContext: context, viewport }).promise;
        
        loadedPages.push({
          id: `page-${i}-${Date.now()}`,
          canvasUrl: canvas.toDataURL(),
          rotation: 0,
          originalIndex: i - 1
        });
        
        setProgress(Math.round((i / numPages) * 100));
      }
      
      setPages(loadedPages);
      setStatus('processing');
    } catch (err) {
      console.error('Error loading PDF:', err);
      alert('Failed to load PDF. Please ensure it is a valid file.');
      setStatus('idle');
    }
  };

  const rotatePage = (id) => {
    setPages(prev => prev.map(p => 
      p.id === id ? { ...p, rotation: (p.rotation + 90) % 360 } : p
    ));
  };

  const removePage = (id) => {
    setPages(prev => prev.filter(p => p.id !== id));
  };

  const handleSave = async () => {
    if (pages.length === 0) return;
    setStatus('saving');
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(arrayBuffer);
      const outDoc = await PDFDocument.create();
      
      for (const pageInfo of pages) {
        const [copiedPage] = await outDoc.copyPages(srcDoc, [pageInfo.originalIndex]);
        
        // Add rotation to current page rotation
        const currentRotation = copiedPage.getRotation().angle;
        copiedPage.setRotation({ angle: (currentRotation + pageInfo.rotation) % 360 });
        
        outDoc.addPage(copiedPage);
      }
      
      const pdfBytes = await outDoc.save();
      downloadBlob(pdfBytes, `organized_${file.name}`, 'application/pdf');
      setStatus('processing');
    } catch (err) {
      console.error('Error saving PDF:', err);
      alert('Failed to save organized PDF.');
      setStatus('processing');
    }
  };

  return (
    <div className="organizer-container" style={{ width: '100%', minHeight: '400px' }}>
      {status === 'idle' && (
        <div style={{ maxWidth: '600px', margin: '4rem auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Visual PDF Organizer</h2>
            <p style={{ color: 'var(--text-muted)' }}>Drag to reorder, click to rotate, or remove pages visually.</p>
          </div>
          <Dropzone onFilesSelected={(f) => loadPdf(f[0])} accept=".pdf" multiple={false} />
        </div>
      )}

      {status === 'loading' && (
        <div style={{ textAlign: 'center', padding: '6rem 0' }}>
          <Loader2 size={48} className="animate-spin" style={{ color: 'var(--primary)', margin: '0 auto' }} />
          <h3 style={{ marginTop: '1.5rem' }}>Reading Pages ({progress}%)</h3>
          <div style={{ width: '200px', height: '4px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '1rem auto', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', backgroundColor: 'var(--primary)', transition: 'width 0.3s' }}></div>
          </div>
        </div>
      )}

      {(status === 'processing' || status === 'saving') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', borderRadius: '16px', position: 'sticky', top: '1rem', zIndex: 100 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <LayoutDashboard size={24} color="var(--primary)" />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Organizing: {file.name}</h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{pages.length} Pages remaining</p>
              </div>
            </div>
            
            <button 
              className="btn-primary" 
              onClick={handleSave} 
              disabled={status === 'saving' || pages.length === 0}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              {status === 'saving' ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
              Download Organized PDF
            </button>
          </div>

          <Reorder.Group 
            axis="y" 
            values={pages} 
            onReorder={setPages}
            style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: '1rem',
              padding: '1rem',
              maxWidth: '800px',
              margin: '0 auto'
            }}
          >
            {pages.map((page) => (
              <Reorder.Item 
                key={page.id} 
                value={page}
                className="glass-card"
                style={{ 
                  padding: '1rem', 
                  cursor: 'grab',
                  position: 'relative',
                  display: 'grid',
                  gridTemplateColumns: '100px 1fr auto',
                  alignItems: 'center',
                  gap: '1.5rem',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '16px'
                }}
                whileDrag={{ scale: 1.02, boxShadow: '0 20px 40px rgba(0,0,0,0.4)', zIndex: 1000 }}
              >
                {/* Page Preview */}
                <div style={{ 
                  width: '100px', 
                  height: '140px', 
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                  <img 
                    src={page.canvasUrl} 
                    alt={`Page`} 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '100%',
                      transform: `rotate(${page.rotation}deg)`,
                      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }} 
                  />
                </div>

                {/* Page Info */}
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>Page {pages.indexOf(page) + 1}</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Original Position: {page.originalIndex + 1}
                  </p>
                  {page.rotation !== 0 && (
                    <span style={{ fontSize: '0.75rem', background: 'rgba(var(--primary-rgb), 0.1)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '4px', marginTop: '0.5rem', display: 'inline-block' }}>
                      Rotated {page.rotation}°
                    </span>
                  )}
                </div>

                {/* Controls */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '4px', marginRight: '1rem' }}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); rotatePage(page.id); }}
                      className="btn-icon"
                      style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}
                      title="Rotate 90°"
                    >
                      <RotateCw size={18} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); removePage(page.id); }}
                      className="btn-icon"
                      style={{ width: '40px', height: '40px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '10px', color: '#ef4444' }}
                      title="Delete Page"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <GripHorizontal size={24} style={{ opacity: 0.2 }} />
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>

          {pages.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem', opacity: 0.5 }}>
              <p>No pages left. Please upload a new PDF.</p>
              <button className="btn-secondary" onClick={() => setStatus('idle')}>Upload Again</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PdfOrganizer;
