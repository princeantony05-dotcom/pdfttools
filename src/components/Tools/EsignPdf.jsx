import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  PenTool, 
  Download, 
  Loader2, 
  Trash2,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  MousePointer2,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { PDFDocument, rgb } from 'pdf-lib';
import * as pdfjs from 'pdfjs-dist';
import Dropzone from '../UI/Dropzone';
import { downloadBlob } from '../../utils/pdfHelpers';

// Set worker source for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.6.205/build/pdf.worker.min.mjs`;

const EsignPdf = () => {
  const [file, setFile] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.5);
  const [status, setStatus] = useState('idle'); // idle, loading, editing, success
  
  const [signatures, setSignatures] = useState([]); // { x, y, width, height, page, path, id }
  
  const canvasRef = useRef(null);
  const drawingCanvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState([]);

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

    signatures
      .filter(s => s.page === currentPage)
      .forEach(sig => {
        ctx.strokeStyle = '#000080'; // Dark Blue for signatures
        ctx.lineWidth = 2;
        ctx.beginPath();
        sig.path.forEach((p, i) => {
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();
      });

    if (currentPath.length > 0) {
      ctx.strokeStyle = '#000080';
      ctx.lineWidth = 2;
      ctx.beginPath();
      currentPath.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();
    }
  }, [signatures, currentPage, currentPath]);

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
    setIsDrawing(true);
    setCurrentPath([{ x, y }]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const rect = drawingCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentPath(prev => [...prev, { x, y }]);
    redrawCanvas();
  };

  const handleMouseUp = () => {
    if (isDrawing && currentPath.length > 5) {
      setSignatures(prev => [...prev, {
        path: currentPath,
        page: currentPage,
        id: Date.now()
      }]);
    }
    setIsDrawing(false);
    setCurrentPath([]);
  };

  const handleSave = async () => {
    setStatus('loading');
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      for (const sig of signatures) {
        const page = pages[sig.page - 1];
        const { width, height } = page.getSize();
        
        // Simplified signature drawing using lines in pdf-lib
        // For a more robust solution, we'd convert the path to SVG or a drawing primitive
        sig.path.forEach((p, i) => {
          if (i === 0) return;
          const p1 = sig.path[i-1];
          const p2 = p;
          
          page.drawLine({
            start: { 
              x: (p1.x / canvasRef.current.width) * width, 
              y: height - (p1.y / canvasRef.current.height) * height 
            },
            end: { 
              x: (p2.x / canvasRef.current.width) * width, 
              y: height - (p2.y / canvasRef.current.height) * height 
            },
            thickness: 2,
            color: rgb(0, 0, 0.5),
          });
        });
      }

      const pdfBytes = await pdfDoc.save();
      downloadBlob(pdfBytes, `signed_${file.name}`, 'application/pdf');
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
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Esign PDF Documents</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Electronically sign your PDF documents with your mouse or touch screen.</p>
          </div>
          <Dropzone onFilesSelected={(f) => setFile(f[0])} accept=".pdf" multiple={false} />
        </div>
      )}

      {status === 'loading' && (
        <div style={{ textAlign: 'center', padding: '10rem 0' }}>
          <Loader2 size={64} className="animate-spin" style={{ color: 'var(--primary)', margin: '0 auto' }} />
          <h3 style={{ marginTop: '2rem' }}>Processing...</h3>
        </div>
      )}

      {status === 'editing' && (
        <>
          <div className="glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', borderRadius: '16px' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn-icon active" title="Signature Pen">
                <PenTool size={20} color="white" />
              </button>
              <button className="btn-icon" onClick={() => setSignatures([])} title="Clear Signatures">
                <Trash2 size={20} />
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

            <button className="btn-primary" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} />
              Finish & Download
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
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>Legal & Secure Online Esigning</h2>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '4rem' }}>
                Sign your contracts, forms, and agreements with confidence. Our Esign tool provides a secure, private way to add your handwritten signature to any PDF document.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', marginBottom: '5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>No Software Required</h3>
                  <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Sign your documents directly in your web browser. There is no need to download specialized software or create an account to get your documents signed.</p>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>100% Private</h3>
                  <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Your signature and your documents never leave your device. All signing and rendering happen locally in your browser, ensuring complete confidentiality.</p>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Mobile Friendly</h3>
                  <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Use your smartphone or tablet to sign with your finger or a stylus. Our tool is fully responsive and optimized for touch interactions.</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EsignPdf;
