import { useState } from "react";
import { 
  Hash, 
  Download, 
  Loader2, 
  CheckCircle2,
  Layout,
  Type,
  ShieldCheck
} from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import Dropzone from '../UI/Dropzone';
import { downloadBlob } from '../../utils/pdfHelpers';
import { motion } from 'framer-motion';

const PageNumbers = () => {
  const [file, setFile] = useState(null);
  const [position, setPosition] = useState('bottom-center'); // top-left, top-center, top-right, bottom-left, bottom-center, bottom-right
  const [fontSize, setFontSize] = useState(12);
  const [color, setColor] = useState('#000000');
  const [startNumber, setStartNumber] = useState(1);
  const [format, setFormat] = useState('{n}'); // {n}, Page {n}, {n}/{total}
  const [status, setStatus] = useState('idle'); // idle, processing, success
  const [result, setResult] = useState(null);

  const handleApply = async () => {
    if (!file) return;
    setStatus('processing');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const total = pages.length;

      const hexToRgb = (hex) => {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        return rgb(r, g, b);
      };

      pages.forEach((page, index) => {
        const { width, height } = page.getSize();
        const currentNum = index + startNumber;
        const text = format.replace('{n}', currentNum).replace('{total}', total);
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        
        let x = 0, y = 0;
        const margin = 30;

        // X Positioning
        if (position.includes('left')) x = margin;
        else if (position.includes('center')) x = (width / 2) - (textWidth / 2);
        else if (position.includes('right')) x = width - textWidth - margin;

        // Y Positioning
        if (position.includes('top')) y = height - margin;
        else if (position.includes('bottom')) y = margin;

        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font: font,
          color: hexToRgb(color),
        });
      });

      const pdfBytes = await pdfDoc.save();
      setResult(pdfBytes);
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('idle');
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setStatus('idle');
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {status === 'idle' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Add Page Numbers</h2>
            <p style={{ color: 'var(--text-muted)' }}>Automatically number your PDF pages with custom styles and positioning.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: file ? '1fr 1fr' : '1fr', gap: '2rem' }}>
            <Dropzone onFilesSelected={(f) => setFile(f[0])} accept=".pdf" multiple={false} />
            
            {file && (
              <div className="glass" style={{ padding: '2rem', borderRadius: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>Position</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                      {['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'].map(pos => (
                        <button 
                          key={pos}
                          onClick={() => setPosition(pos)}
                          style={{ 
                            padding: '8px', 
                            fontSize: '0.7rem', 
                            borderRadius: '8px', 
                            border: '1px solid var(--border)',
                            backgroundColor: position === pos ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                            color: position === pos ? 'white' : 'currentColor',
                            cursor: 'pointer'
                          }}
                        >
                          {pos.replace('-', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>Start From</label>
                      <input type="number" value={startNumber} onChange={(e) => setStartNumber(parseInt(e.target.value))} style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>Font Size</label>
                      <input type="number" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>Format</label>
                    <select value={format} onChange={(e) => setFormat(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}>
                      <option value="{n}">{`1`}</option>
                      <option value="Page {n}">{`Page 1`}</option>
                      <option value="{n}/{total}">{`1/10`}</option>
                      <option value="- {n} -">{`- 1 -`}</option>
                    </select>
                  </div>

                  <button className="btn-primary" onClick={handleApply}>
                    Add Numbers
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {status === 'processing' && (
        <div style={{ textAlign: 'center', padding: '10rem 0' }}>
          <Loader2 size={64} className="animate-spin" style={{ color: 'var(--primary)', margin: '0 auto' }} />
          <h3 style={{ marginTop: '2rem' }}>Numbering pages...</h3>
        </div>
      )}

      {status === 'success' && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', padding: '4rem' }}>
          <CheckCircle2 size={80} color="#10b981" style={{ margin: '0 auto 2rem' }} />
          <h2>Done!</h2>
          <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>Your PDF is numbered and ready.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn-primary" onClick={() => downloadBlob(result, `numbered_${file.name}`, 'application/pdf')}>
              <Download size={20} /> Download PDF
            </button>
            <button className="btn-secondary" onClick={reset}>Start Over</button>
          </div>
        </motion.div>
      )}

      {/* SEO Content Section */}
      <div style={{ marginTop: '6rem', borderTop: '1px solid var(--border)', paddingTop: '4rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>Professional PDF Page Numbering</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '4rem' }}>
            Organize your documents with ease. Our page numbering tool allows you to add custom headers and footers with sequential numbers, page counts, and flexible positioning.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', marginBottom: '5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Flexible Positioning</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Choose from six different positions for your page numbers, including top and bottom corners or centered at the margins. Perfect for complying with academic or professional formatting requirements.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Custom Formats</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Use simple numbers, add "Page" prefixes, or include the total page count (e.g., 1 of 50). You can also set a custom start number for multi-part documents.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>100% Secure & Private</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>All processing happens locally in your browser. Your files are never uploaded to any server, ensuring your data remains completely private and confidential.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageNumbers;
