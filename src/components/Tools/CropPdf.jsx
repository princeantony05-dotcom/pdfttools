import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Crop, 
  Download, 
  Loader2, 
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  MousePointer2,
  CheckCircle2,
  Layout
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import * as pdfjs from 'pdfjs-dist';
import Dropzone from '../UI/Dropzone';
import { downloadBlob } from '../../utils/pdfHelpers';

// Set worker source for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.6.205/build/pdf.worker.min.mjs`;

const CropPdf = () => {
  const [file, setFile] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [status, setStatus] = useState('idle'); // idle, loading, editing, saving
  
  const [cropBox, setCropBox] = useState(null); // { x, y, width, height } in canvas pixels
  const [isAllPages, setIsAllPages] = useState(true);

  const canvasRef = useRef(null);
  const cropCanvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPoint, setStartPoint] = useState(null);

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

  // Rendering Logic
  const redrawCropCanvas = useCallback(() => {
    const canvas = cropCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (cropBox) {
      // Dim the outside
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(0, 0, canvas.width, cropBox.y);
      ctx.fillRect(0, cropBox.y + cropBox.height, canvas.width, canvas.height - (cropBox.y + cropBox.height));
      ctx.fillRect(0, cropBox.y, cropBox.x, cropBox.height);
      ctx.fillRect(cropBox.x + cropBox.width, cropBox.y, canvas.width - (cropBox.x + cropBox.width), cropBox.height);

      // Draw the box
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(cropBox.x, cropBox.y, cropBox.width, cropBox.height);
      ctx.setLineDash([]);
      
      // Draw handles
      ctx.fillStyle = '#2563eb';
      const handleSize = 8;
      ctx.fillRect(cropBox.x - 4, cropBox.y - 4, handleSize, handleSize);
      ctx.fillRect(cropBox.x + cropBox.width - 4, cropBox.y - 4, handleSize, handleSize);
      ctx.fillRect(cropBox.x - 4, cropBox.y + cropBox.height - 4, handleSize, handleSize);
      ctx.fillRect(cropBox.x + cropBox.width - 4, cropBox.y + cropBox.height - 4, handleSize, handleSize);
    }
  }, [cropBox]);

  const renderPage = useCallback(async () => {
    if (!pdfDoc || !canvasRef.current) return;
    const page = await pdfDoc.getPage(currentPage);
    const viewport = page.getViewport({ scale });
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    await page.render({ canvasContext: context, viewport }).promise;

    if (cropCanvasRef.current) {
      cropCanvasRef.current.width = viewport.width;
      cropCanvasRef.current.height = viewport.height;
      redrawCropCanvas();
    }
  }, [pdfDoc, currentPage, scale, redrawCropCanvas]);

  useEffect(() => { renderPage(); }, [renderPage]);

  // Interaction Handlers
  const handleMouseDown = (e) => {
    const rect = cropCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setIsDragging(true);
    setStartPoint({ x, y });
    setCropBox({ x, y, width: 0, height: 0 });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !startPoint) return;
    const rect = cropCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCropBox({
      x: Math.min(x, startPoint.x),
      y: Math.min(y, startPoint.y),
      width: Math.abs(x - startPoint.x),
      height: Math.abs(y - startPoint.y)
    });
    redrawCropCanvas();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setStartPoint(null);
  };

  const handleSave = async () => {
    if (!cropBox) return;
    setStatus('saving');
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      const canvasWidth = canvasRef.current.width;
      const canvasHeight = canvasRef.current.height;

      const applyCrop = (pageIndex) => {
        const page = pages[pageIndex];
        const { width, height } = page.getSize();
        
        // Translate crop box from canvas pixels to PDF points
        const pdfX = (cropBox.x / canvasWidth) * width;
        const pdfY = height - ((cropBox.y + cropBox.height) / canvasHeight) * height;
        const pdfWidth = (cropBox.width / canvasWidth) * width;
        const pdfHeight = (cropBox.height / canvasHeight) * height;

        page.setCropBox(pdfX, pdfY, pdfWidth, pdfHeight);
        page.setMediaBox(pdfX, pdfY, pdfWidth, pdfHeight);
      };

      if (isAllPages) {
        for (let i = 0; i < pages.length; i++) applyCrop(i);
      } else {
        applyCrop(currentPage - 1);
      }

      const pdfBytes = await pdfDoc.save();
      downloadBlob(pdfBytes, `cropped_${file.name}`, 'application/pdf');
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
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Crop PDF Pages</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Visually trim margins and crop your PDF documents securely.</p>
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
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn-icon active" title="Select Crop Area">
                  <Crop size={20} color="white" />
                </button>
              </div>
              <div style={{ borderLeft: '1px solid var(--border)', height: '24px' }}></div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={isAllPages} 
                  onChange={(e) => setIsAllPages(e.target.checked)}
                  style={{ width: '16px', height: '16px' }}
                />
                Apply to all pages
              </label>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: '20px' }}>
                <button onClick={() => setScale(Math.max(0.2, scale - 0.1))} style={{ background: 'none' }}><ZoomOut size={16} /></button>
                <span style={{ fontSize: '0.85rem', minWidth: '40px', textAlign: 'center' }}>{Math.round(scale * 100)}%</span>
                <button onClick={() => setScale(Math.min(3, scale + 0.1))} style={{ background: 'none' }}><ZoomIn size={16} /></button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)} style={{ background: 'none', opacity: currentPage <= 1 ? 0.3 : 1 }}><ChevronLeft size={24} /></button>
                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Page {currentPage} of {numPages}</span>
                <button disabled={currentPage >= numPages} onClick={() => setCurrentPage(p => p + 1)} style={{ background: 'none', opacity: currentPage >= numPages ? 0.3 : 1 }}><ChevronRight size={24} /></button>
              </div>
            </div>

            <button className="btn-primary" onClick={handleSave} disabled={status === 'saving' || !cropBox} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {status === 'saving' ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
              Crop PDF
            </button>
          </div>

          <div style={{ flex: 1, overflow: 'auto', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '16px', display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <div style={{ position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
              <canvas ref={canvasRef} />
              <canvas 
                ref={cropCanvasRef}
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
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>How to Crop PDF Pages Online</h2>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '4rem' }}>
                Visually trim margins and remove unwanted space from your PDF documents. Our professional cropping tool gives you precise control over your document's dimensions.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', marginBottom: '5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Visual Selection</h3>
                  <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Simply click and drag to select the exact area you want to keep. Our interface shows you a live preview of the crop area, ensuring you don't cut off important content.</p>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Batch Cropping</h3>
                  <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Need to crop every page in a document? Our tool allows you to apply your crop selection to all pages at once, perfect for trimming margins from scanned books or reports.</p>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>100% Private</h3>
                  <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Your documents never leave your device. All rendering and cropping happen locally in your web browser, keeping your sensitive data completely secure.</p>
                </div>
              </div>

              <div className="glass-card" style={{ padding: '3rem', borderRadius: '32px' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Frequently Asked Questions</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Does cropping reduce file size?</h4>
                    <p style={{ opacity: 0.7 }}>While cropping hides the area outside the crop box in most readers, it doesn't always delete the data. To effectively reduce file size, we recommend using our "Compress PDF" tool after cropping.</p>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Can I undo a crop?</h4>
                    <p style={{ opacity: 0.7 }}>Once you download the cropped PDF, the new dimensions are set. We recommend keeping a backup of your original file if you think you might need to change the crop later.</p>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Is this tool free?</h4>
                    <p style={{ opacity: 0.7 }}>Yes, PDFMasterstool provides high-quality PDF cropping for free as part of our professional browser-based toolkit.</p>
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

export default CropPdf;
