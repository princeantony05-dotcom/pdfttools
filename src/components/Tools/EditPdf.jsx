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
  MousePointer2
} from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as pdfjs from 'pdfjs-dist';
import Dropzone from '../UI/Dropzone';
import { downloadBlob } from '../../utils/pdfHelpers';

// Set worker source for PDF.js (Matched to version 5.6.205)
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.6.205/build/pdf.worker.min.mjs`;

const EditPdf = () => {
  const [file, setFile] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.5);
  const [tool, setTool] = useState('select'); // select, text, draw
  const [status, setStatus] = useState('idle'); // idle, loading, editing, saving
  
  const [annotations, setAnnotations] = useState([]); // { type: 'text', x, y, content, page }
  const [drawings, setDrawings] = useState([]); // { type: 'draw', points: [], color, width, page }
  
  const canvasRef = useRef(null);
  const drawingCanvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState([]);

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

  // Drawing Logic
  const redrawCanvas = useCallback(() => {
    const canvas = drawingCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw existing drawings for current page
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

    // Draw current points
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

  // Render Page
  const renderPage = useCallback(async () => {
    if (!pdfDoc || !canvasRef.current) return;

    const page = await pdfDoc.getPage(currentPage);
    const viewport = page.getViewport({ scale });
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport
    };
    
    await page.render(renderContext).promise;

    // Sync drawing canvas size
    if (drawingCanvasRef.current) {
      drawingCanvasRef.current.width = viewport.width;
      drawingCanvasRef.current.height = viewport.height;
      redrawCanvas();
    }
  }, [pdfDoc, currentPage, scale, redrawCanvas]);

  useEffect(() => {
    renderPage();
  }, [renderPage]);

  const startDrawing = (e) => {
    if (tool !== 'draw') return;
    setIsDrawing(true);
    const rect = drawingCanvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left);
    const y = (e.clientY - rect.top);
    setCurrentPoints([{ x, y }]);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const rect = drawingCanvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left);
    const y = (e.clientY - rect.top);
    setCurrentPoints(prev => [...prev, { x, y }]);
    redrawCanvas();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (currentPoints.length > 1) {
      setDrawings(prev => [...prev, {
        type: 'draw',
        points: currentPoints,
        color: '#4f46e5',
        width: 2,
        page: currentPage
      }]);
    }
    setCurrentPoints([]);
  };

  // Text Annotation Logic
  const handleCanvasClick = (e) => {
    if (tool !== 'text') return;
    const rect = drawingCanvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left);
    const y = (e.clientY - rect.top);

    const content = prompt('Enter text:');
    if (content) {
      setAnnotations(prev => [...prev, {
        type: 'text',
        x,
        y,
        content,
        page: currentPage,
        id: Date.now()
      }]);
    }
  };

  const removeAnnotation = (id) => {
    setAnnotations(prev => prev.filter(a => a.id !== id));
  };

  // Save/Export
  const handleSave = async () => {
    setStatus('saving');
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      // Add Text Annotations
      for (const ann of annotations) {
        const page = pages[ann.page - 1];
        const { width, height } = page.getSize();
        
        // Convert canvas coordinates to PDF coordinates
        // Canvas (0,0) is top-left. PDF (0,0) is bottom-left.


        page.drawText(ann.content, {
          x: (ann.x / canvasRef.current.width) * width,
          y: height - (ann.y / canvasRef.current.height) * height - 12, // adjust for font baseline
          size: 12 / scale * (width / (canvasRef.current.width / scale)), 
          font: font,
          color: rgb(0, 0, 0),
        });
      }

      // Add Drawings (Simplified as lines)
      for (const draw of drawings) {
        const page = pages[draw.page - 1];
        const { width, height } = page.getSize();
        
        for (let i = 0; i < draw.points.length - 1; i++) {
          const p1 = draw.points[i];
          const p2 = draw.points[i+1];
          
          page.drawLine({
            start: { 
              x: (p1.x / canvasRef.current.width) * width, 
              y: height - (p1.y / canvasRef.current.height) * height 
            },
            end: { 
              x: (p2.x / canvasRef.current.width) * width, 
              y: height - (p2.y / canvasRef.current.height) * height 
            },
            thickness: draw.width,
            color: rgb(0.31, 0.27, 0.9), // #4f46e5
          });
        }
      }

      const pdfBytes = await pdfDoc.save();
      downloadBlob(pdfBytes, `edited_${file.name}`, 'application/pdf');
      setStatus('editing');
    } catch (err) {
      console.error('Error saving PDF:', err);
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

      {status === 'editing' || status === 'saving' ? (
        <>
          {/* Toolbar */}
          <div className="glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', borderRadius: '16px' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                className={`btn-icon ${tool === 'select' ? 'active' : ''}`}
                onClick={() => setTool('select')}
                title="Select"
                style={{ backgroundColor: tool === 'select' ? 'var(--primary)' : 'transparent', color: tool === 'select' ? 'white' : 'inherit' }}
              >
                <MousePointer2 size={20} />
              </button>
              <button 
                className={`btn-icon ${tool === 'text' ? 'active' : ''}`}
                onClick={() => setTool('text')}
                title="Add Text"
                style={{ backgroundColor: tool === 'text' ? 'var(--primary)' : 'transparent', color: tool === 'text' ? 'white' : 'inherit' }}
              >
                <Type size={20} />
              </button>
              <button 
                className={`btn-icon ${tool === 'draw' ? 'active' : ''}`}
                onClick={() => setTool('draw')}
                title="Draw/Sign"
                style={{ backgroundColor: tool === 'draw' ? 'var(--primary)' : 'transparent', color: tool === 'draw' ? 'white' : 'inherit' }}
              >
                <Pencil size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: '20px' }}>
                <button onClick={() => setScale(Math.max(0.5, scale - 0.2))} style={{ background: 'none' }}><ZoomOut size={16} /></button>
                <span style={{ fontSize: '0.85rem', minWidth: '40px', textAlign: 'center' }}>{Math.round(scale * 100)}%</span>
                <button onClick={() => setScale(Math.min(3, scale + 0.2))} style={{ background: 'none' }}><ZoomIn size={16} /></button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button 
                  disabled={currentPage <= 1} 
                  onClick={() => setCurrentPage(p => p - 1)}
                  style={{ background: 'none', opacity: currentPage <= 1 ? 0.3 : 1 }}
                >
                  <ChevronLeft size={24} />
                </button>
                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Page {currentPage} of {numPages}</span>
                <button 
                  disabled={currentPage >= numPages} 
                  onClick={() => setCurrentPage(p => p + 1)}
                  style={{ background: 'none', opacity: currentPage >= numPages ? 0.3 : 1 }}
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>

            <button 
              className="btn-primary" 
              onClick={handleSave} 
              disabled={status === 'saving'}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              {status === 'saving' ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
              Save Changes
            </button>
          </div>

          {/* Editor Area */}
          <div 
            ref={containerRef}
            style={{ 
              flex: 1, 
              overflow: 'auto', 
              backgroundColor: 'rgba(0,0,0,0.2)', 
              borderRadius: '16px', 
              display: 'flex', 
              justifyContent: 'center', 
              padding: '2rem',
              position: 'relative'
            }}
          >
            <div style={{ position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
              <canvas ref={canvasRef} />
              <canvas 
                ref={drawingCanvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onClick={handleCanvasClick}
                style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  cursor: tool === 'draw' ? 'crosshair' : (tool === 'text' ? 'text' : 'default'),
                  zIndex: 10
                }}
              />
              
              {/* Text Annotations Layer */}
              {annotations
                .filter(a => a.page === currentPage)
                .map(ann => (
                  <div 
                    key={ann.id}
                    style={{
                      position: 'absolute',
                      top: ann.y,
                      left: ann.x,
                      color: 'black',
                      padding: '2px 4px',
                      backgroundColor: 'rgba(255,255,0,0.2)',
                      border: tool === 'select' ? '1px dashed #666' : 'none',
                      fontSize: `${12 * scale}px`,
                      pointerEvents: tool === 'select' ? 'auto' : 'none',
                      zIndex: 15,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {ann.content}
                    {tool === 'select' && (
                      <button 
                        onClick={() => removeAnnotation(ann.id)}
                        style={{ padding: 0, background: 'none', color: '#f43f5e' }}
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                ))
              }
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default EditPdf;

