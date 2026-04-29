import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  ShieldAlert, 
  Download, 
  Loader2, 
  Trash2,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  MousePointer2,
  Eraser,
  Square
} from 'lucide-react';
import { PDFDocument, rgb } from 'pdf-lib';
import * as pdfjs from 'pdfjs-dist';
import Dropzone from '../UI/Dropzone';
import { downloadBlob } from '../../utils/pdfHelpers';

// Set worker source for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.6.205/build/pdf.worker.min.mjs`;

const RedactPdf = () => {
  const [file, setFile] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.5);
  const [tool, setTool] = useState('redact'); // select, redact, eraser
  const [status, setStatus] = useState('idle'); // idle, loading, editing, saving
  
  const [redactions, setRedactions] = useState([]); // { x, y, width, height, page, id }
  
  const canvasRef = useRef(null);
  const drawingCanvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [currentRect, setCurrentRect] = useState(null);

  // Load PDF
  useEffect(() => {
    if (!file) return;

    const loadPdf = async () => {
      setStatus('loading');
      try {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        setStatus('editing');
      } catch (err) {
        console.error('Error loading PDF:', err);
        setStatus('idle');
      }
    };

    loadPdf();
  }, [file]);

  // Drawing & Rendering Logic
  const redrawCanvas = useCallback(() => {
    const canvas = drawingCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    redactions
      .filter(r => r.page === currentPage)
      .forEach(redaction => {
        ctx.fillStyle = '#000000';
        ctx.fillRect(redaction.x, redaction.y, redaction.width, redaction.height);
      });

    if (currentRect) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(currentRect.x, currentRect.y, currentRect.width, currentRect.height);
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      ctx.strokeRect(currentRect.x, currentRect.y, currentRect.width, currentRect.height);
    }
  }, [redactions, currentPage, currentRect]);

  const renderPage = useCallback(async () => {
    if (!pdfDoc || !canvasRef.current) return;
    const page = await pdfDoc.getPage(currentPage);
    const viewport = page.getViewport({ scale });
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    await page.render({ canvasContext: context, viewport }).promise;

    if (drawingCanvasRef.current) {
      drawingCanvasRef.current.width = viewport.width;
      drawingCanvasRef.current.height = viewport.height;
      redrawCanvas();
    }
  }, [pdfDoc, currentPage, scale, redrawCanvas]);

  useEffect(() => { renderPage(); }, [renderPage]);

  // Interaction Handlers
  const handleMouseDown = (e) => {
    const rect = drawingCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === 'redact') {
      setIsDrawing(true);
      setStartPoint({ x, y });
    } else if (tool === 'eraser') {
      setRedactions(prev => prev.filter(r => {
        if (r.page !== currentPage) return true;
        const isHit = x >= r.x && x <= r.x + r.width && y >= r.y && y <= r.y + r.height;
        return !isHit;
      }));
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || !startPoint) return;
    const rect = drawingCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrentRect({
      x: Math.min(x, startPoint.x),
      y: Math.min(y, startPoint.y),
      width: Math.abs(x - startPoint.x),
      height: Math.abs(y - startPoint.y)
    });
    redrawCanvas();
  };

  const handleMouseUp = () => {
    if (isDrawing && currentRect && currentRect.width > 5 && currentRect.height > 5) {
      setRedactions(prev => [...prev, {
        ...currentRect,
        page: currentPage,
        id: Date.now()
      }]);
    }
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentRect(null);
  };

  const handleSave = async () => {
    setStatus('saving');
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      for (const red of redactions) {
        const page = pages[red.page - 1];
        const { width, height } = page.getSize();
        
        // pdf-lib drawRectangle
        page.drawRectangle({
          x: (red.x / canvasRef.current.width) * width,
          y: height - ((red.y + red.height) / canvasRef.current.height) * height,
          width: (red.width / canvasRef.current.width) * width,
          height: (red.height / canvasRef.current.height) * height,
          color: rgb(0, 0, 0),
        });
      }

      const pdfBytes = await pdfDoc.save();
      downloadBlob(pdfBytes, `redacted_${file.name}`, 'application/pdf');
      setStatus('editing');
    } catch (err) {
      console.error('Save failed:', err);
      setStatus('editing');
    }
  };

  return (
    <div className="editor-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1rem' }}>
      {status === 'idle' && (
        <div style={{ maxWidth: '800px', margin: '4rem auto', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Redact PDF Information</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Permanently blackout sensitive text and images securely.</p>
          </div>
          <Dropzone onFilesSelected={(f) => setFile(f[0])} accept=".pdf" multiple={false} />
        </div>
      )}

      {status === 'loading' && (
        <div style={{ textAlign: 'center', padding: '10rem 0' }}>
          <Loader2 size={64} className="animate-spin" style={{ color: 'var(--primary)', margin: '0 auto' }} />
          <h3 style={{ marginTop: '2rem' }}>Loading PDF...</h3>
        </div>
      )}

      {(status === 'editing' || status === 'saving') && (
        <>
          <div className="glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', borderRadius: '16px' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className={`btn-icon ${tool === 'redact' ? 'active' : ''}`} onClick={() => setTool('redact')} title="Redact Tool">
                <Square size={20} color={tool === 'redact' ? 'white' : 'currentColor'} />
              </button>
              <button className={`btn-icon ${tool === 'eraser' ? 'active' : ''}`} onClick={() => setTool('eraser')} title="Eraser Tool">
                <Eraser size={20} color={tool === 'eraser' ? 'white' : 'currentColor'} />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: '20px' }}>
                <button onClick={() => setScale(Math.max(0.5, scale - 0.2))} style={{ background: 'none' }}><ZoomOut size={16} /></button>
                <span style={{ fontSize: '0.85rem', minWidth: '40px', textAlign: 'center' }}>{Math.round(scale * 100)}%</span>
                <button onClick={() => setScale(Math.min(3, scale + 0.2))} style={{ background: 'none' }}><ZoomIn size={16} /></button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)} style={{ background: 'none', opacity: currentPage <= 1 ? 0.3 : 1 }}><ChevronLeft size={24} /></button>
                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Page {currentPage} of {numPages}</span>
                <button disabled={currentPage >= numPages} onClick={() => setCurrentPage(p => p + 1)} style={{ background: 'none', opacity: currentPage >= numPages ? 0.3 : 1 }}><ChevronRight size={24} /></button>
              </div>
            </div>

            <button className="btn-primary" onClick={handleSave} disabled={status === 'saving'} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#ef4444' }}>
              {status === 'saving' ? <Loader2 size={18} className="animate-spin" /> : <ShieldAlert size={18} />}
              Apply Redactions
            </button>
          </div>

          <div style={{ flex: 1, overflow: 'auto', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '16px', display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <div style={{ position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
              <canvas ref={canvasRef} />
              <canvas 
                ref={drawingCanvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{ position: 'absolute', top: 0, left: 0, cursor: 'crosshair', zIndex: 10 }}
              />
            </div>
          </div>

          {/* SEO Content Section */}
          <div style={{ marginTop: '4rem', borderTop: '1px solid var(--border)', paddingTop: '4rem' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>How to Redact PDF Information Securely</h2>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '4rem' }}>
                Protect sensitive data by permanently blacking out confidential information. Our redaction tool ensures that private details are removed from the PDF structure, not just hidden.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', marginBottom: '5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Permanent Removal</h3>
                  <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Unlike simply covering text with a black box, our tool draws directly into the PDF content layer, making it virtually impossible for standard readers to recover the underlying data.</p>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Easy Selection</h3>
                  <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Simply click and drag to draw redaction boxes over any part of your document. You can redact text, images, or entire sections in seconds.</p>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Local & Private</h3>
                  <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Redaction happens entirely in your browser. Your sensitive files are never uploaded to our servers, ensuring that your private information stays private.</p>
                </div>
              </div>

              <div className="glass-card" style={{ padding: '3rem', borderRadius: '32px' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Frequently Asked Questions</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Is redaction permanent?</h4>
                    <p style={{ opacity: 0.7 }}>Yes. Once you apply redactions and download the new file, the information under the black boxes is effectively removed from the document's visible layer.</p>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Can I redact images?</h4>
                    <p style={{ opacity: 0.7 }}>Yes, you can draw redaction boxes over any part of the page, including photographs, logos, and charts.</p>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Is this tool free?</h4>
                    <p style={{ opacity: 0.7 }}>Yes, PDFMasterstool offers professional redaction features for free to help you maintain your privacy and security.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RedactPdf;
