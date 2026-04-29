import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Type, 
  Pencil, 
  Download, 
  Loader2, 
  Trash2,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  MousePointer2,
  Eraser
} from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as pdfjs from 'pdfjs-dist';
import Dropzone from '../UI/Dropzone';
import { downloadBlob } from '../../utils/pdfHelpers';

// Set worker source for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.6.205/build/pdf.worker.min.mjs`;

const EditPdf = () => {
  const [file, setFile] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.5);
  const [tool, setTool] = useState('select'); // select, text, draw, eraser
  const [status, setStatus] = useState('idle'); // idle, loading, editing, saving
  
  const [annotations, setAnnotations] = useState([]); // { type: 'text', x, y, content, page, id }
  const [drawings, setDrawings] = useState([]); // { type: 'draw', points: [], color, width, page, id }
  
  const canvasRef = useRef(null);
  const drawingCanvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState([]);
  const [draggedId, setDraggedId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

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

    drawings
      .filter(d => d.page === currentPage)
      .forEach(drawing => {
        ctx.beginPath();
        ctx.strokeStyle = drawing.color;
        ctx.lineWidth = drawing.width;
        drawing.points.forEach((p, i) => {
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();
      });

    if (currentPoints.length > 0) {
      ctx.beginPath();
      ctx.strokeStyle = '#4f46e5';
      ctx.lineWidth = 2;
      currentPoints.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();
    }
  }, [drawings, currentPage, currentPoints]);

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

    if (tool === 'draw') {
      setIsDrawing(true);
      setCurrentPoints([{ x, y }]);
    } else if (tool === 'eraser') {
      // Erase drawings that are close to the click
      setDrawings(prev => prev.filter(d => {
        if (d.page !== currentPage) return true;
        const isNear = d.points.some(p => Math.abs(p.x - x) < 10 && Math.abs(p.y - y) < 10);
        return !isNear;
      }));
    }
  };

  const handleMouseMove = (e) => {
    const rect = drawingCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDrawing) {
      setCurrentPoints(prev => [...prev, { x, y }]);
      redrawCanvas();
    } else if (draggedId) {
      setAnnotations(prev => prev.map(ann => 
        ann.id === draggedId ? { ...ann, x: x - dragOffset.x, y: y - dragOffset.y } : ann
      ));
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && currentPoints.length > 1) {
      setDrawings(prev => [...prev, {
        type: 'draw',
        points: currentPoints,
        color: '#4f46e5',
        width: 2,
        page: currentPage,
        id: Date.now()
      }]);
    }
    setIsDrawing(false);
    setCurrentPoints([]);
    setDraggedId(null);
  };

  const handleCanvasClick = (e) => {
    if (tool !== 'text') return;
    const rect = drawingCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const content = prompt('Enter text:');
    if (content) {
      setAnnotations(prev => [...prev, {
        type: 'text', x, y, content, page: currentPage, id: Date.now()
      }]);
    }
  };

  // Dragging Logic
  const startDrag = (e, ann) => {
    if (tool !== 'select') return;
    e.stopPropagation();
    const rect = drawingCanvasRef.current.getBoundingClientRect();
    setDraggedId(ann.id);
    setDragOffset({
      x: e.clientX - rect.left - ann.x,
      y: e.clientY - rect.top - ann.y
    });
  };

  const handleSave = async () => {
    setStatus('saving');
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      for (const ann of annotations) {
        const page = pages[ann.page - 1];
        const { width, height } = page.getSize();
        page.drawText(ann.content, {
          x: (ann.x / canvasRef.current.width) * width,
          y: height - (ann.y / canvasRef.current.height) * height - (10 * scale),
          size: 12,
          font: font,
          color: rgb(0, 0, 0),
        });
      }

      for (const draw of drawings) {
        const page = pages[draw.page - 1];
        const { width, height } = page.getSize();
        for (let i = 0; i < draw.points.length - 1; i++) {
          const p1 = draw.points[i];
          const p2 = draw.points[i+1];
          page.drawLine({
            start: { x: (p1.x / canvasRef.current.width) * width, y: height - (p1.y / canvasRef.current.height) * height },
            end: { x: (p2.x / canvasRef.current.width) * width, y: height - (p2.y / canvasRef.current.height) * height },
            thickness: draw.width,
            color: rgb(0.31, 0.27, 0.9),
          });
        }
      }

      const pdfBytes = await pdfDoc.save();
      downloadBlob(pdfBytes, `edited_${file.name}`, 'application/pdf');
      setStatus('editing');
    } catch (err) {
      console.error('Save failed:', err);
      setStatus('editing');
    }
  };

  return (
    <div className="editor-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1rem' }}>
      {status === 'idle' && (
        <div style={{ maxWidth: '600px', margin: '4rem auto', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Professional PDF Editor</h2>
            <p style={{ color: 'var(--text-muted)' }}>Annotate, sign, and modify your documents with ease.</p>
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
              <button className={`btn-icon ${tool === 'select' ? 'active' : ''}`} onClick={() => setTool('select')} title="Move Tool">
                <MousePointer2 size={20} color={tool === 'select' ? 'white' : 'currentColor'} />
              </button>
              <button className={`btn-icon ${tool === 'text' ? 'active' : ''}`} onClick={() => setTool('text')} title="Add Text">
                <Type size={20} color={tool === 'text' ? 'white' : 'currentColor'} />
              </button>
              <button className={`btn-icon ${tool === 'draw' ? 'active' : ''}`} onClick={() => setTool('draw')} title="Draw Tool">
                <Pencil size={20} color={tool === 'draw' ? 'white' : 'currentColor'} />
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

            <button className="btn-primary" onClick={handleSave} disabled={status === 'saving'} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {status === 'saving' ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
              Save Changes
            </button>
          </div>

          <div style={{ flex: 1, overflow: 'auto', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '16px', display: 'flex', justifyContent: 'center', padding: '2rem', position: 'relative' }}>
            <div style={{ position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
              <canvas ref={canvasRef} />
              <canvas 
                ref={drawingCanvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onClick={handleCanvasClick}
                style={{ position: 'absolute', top: 0, left: 0, cursor: tool === 'draw' ? 'crosshair' : (tool === 'text' ? 'text' : (tool === 'eraser' ? 'pointer' : 'default')), zIndex: 10 }}
              />
              {annotations.filter(a => a.page === currentPage).map(ann => (
                <div 
                  key={ann.id}
                  onMouseDown={(e) => startDrag(e, ann)}
                  style={{
                    position: 'absolute', top: ann.y, left: ann.x, color: 'black', padding: '2px 4px',
                    backgroundColor: 'rgba(255,255,0,0.2)',
                    border: tool === 'select' ? '1px dashed #4f46e5' : 'none',
                    fontSize: `${12 * scale}px`,
                    cursor: tool === 'select' ? 'move' : 'default',
                    zIndex: 15, display: 'flex', alignItems: 'center', gap: '4px',
                    pointerEvents: tool === 'select' || tool === 'eraser' ? 'auto' : 'none'
                  }}
                  onClick={(e) => {
                    if (tool === 'eraser') {
                      e.stopPropagation();
                      setAnnotations(prev => prev.filter(a => a.id !== ann.id));
                    }
                  }}
                >
                  {ann.content}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* SEO Content Section */}
      <div style={{ marginTop: '6rem', borderTop: '1px solid var(--border)', paddingTop: '4rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>How to Edit PDF Online for Free</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '4rem' }}>
            Annotate, sign, and modify your PDF documents directly in your web browser. Our professional-grade PDF editor provides a secure and private way to edit your files without any software installation.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', marginBottom: '5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Add Text & Annotations</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Easily add comments, fill out forms, or insert new text into any PDF. Our intuitive text tool allows you to place text exactly where you need it and drag it to reposition.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Draw & Sign</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Use the freehand drawing tool to sign documents, underline important sections, or add handwritten notes. All drawings are rendered with high fidelity in the final PDF.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>100% Private Editing</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Your documents never leave your computer. All editing and rendering happen locally in your browser, ensuring that your sensitive information remains completely confidential.</p>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '3rem', borderRadius: '32px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Frequently Asked Questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Can I edit existing text in the PDF?</h4>
                <p style={{ opacity: 0.7 }}>Currently, our editor allows you to add new text, drawings, and annotations over the existing content. We focus on providing the best experience for filling forms and signing documents.</p>
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Is my signature safe?</h4>
                <p style={{ opacity: 0.7 }}>Yes. Since you are signing the document locally in your browser, your signature is never transmitted to our servers or stored anywhere in the cloud.</p>
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Does it work on mobile devices?</h4>
                <p style={{ opacity: 0.7 }}>Yes, PDFMasterstool is fully responsive and works on smartphones and tablets, allowing you to sign and edit documents on the go.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPdf;

