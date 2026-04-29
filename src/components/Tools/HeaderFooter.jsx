import { useState } from "react";
import { 
  Layout, 
  Download, 
  Loader2, 
  CheckCircle2,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import Dropzone from '../UI/Dropzone';
import { downloadBlob } from '../../utils/pdfHelpers';
import { motion } from 'framer-motion';

const HeaderFooter = () => {
  const [file, setFile] = useState(null);
  const [headerText, setHeaderText] = useState('');
  const [footerText, setFooterText] = useState('');
  const [fontSize, setFontSize] = useState(10);
  const [color, setColor] = useState('#666666');
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

      const hexToRgb = (hex) => {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        return rgb(r, g, b);
      };

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        const margin = 30;

        if (headerText) {
          const textWidth = font.widthOfTextAtSize(headerText, fontSize);
          page.drawText(headerText, {
            x: (width / 2) - (textWidth / 2),
            y: height - margin,
            size: fontSize,
            font,
            color: hexToRgb(color),
          });
        }

        if (footerText) {
          const textWidth = font.widthOfTextAtSize(footerText, fontSize);
          page.drawText(footerText, {
            x: (width / 2) - (textWidth / 2),
            y: margin,
            size: fontSize,
            font,
            color: hexToRgb(color),
          });
        }
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
    setHeaderText('');
    setFooterText('');
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {status === 'idle' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Add Header & Footer</h2>
            <p style={{ color: 'var(--text-muted)' }}>Apply custom text labels to the top and bottom of every page.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: file ? '1fr 1fr' : '1fr', gap: '2rem' }}>
            <Dropzone onFilesSelected={(f) => setFile(f[0])} accept=".pdf" multiple={false} />
            
            {file && (
              <div className="glass" style={{ padding: '2rem', borderRadius: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>Header Text (Top Center)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Confidential"
                      value={headerText} 
                      onChange={(e) => setHeaderText(e.target.value)} 
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }} 
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>Footer Text (Bottom Center)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. © 2026 My Company"
                      value={footerText} 
                      onChange={(e) => setFooterText(e.target.value)} 
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }} 
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>Font Size</label>
                      <input type="number" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>Color</label>
                      <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ width: '100%', height: '45px', background: 'none', border: 'none' }} />
                    </div>
                  </div>

                  <button className="btn-primary" onClick={handleApply}>
                    Apply Labels
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
          <h3 style={{ marginTop: '2rem' }}>Applying headers and footers...</h3>
        </div>
      )}

      {status === 'success' && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', padding: '4rem' }}>
          <CheckCircle2 size={80} color="#10b981" style={{ margin: '0 auto 2rem' }} />
          <h2>Successfully Applied!</h2>
          <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>Your document has been updated with your custom text.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn-primary" onClick={() => downloadBlob(result, `labeled_${file.name}`, 'application/pdf')}>
              <Download size={20} /> Download PDF
            </button>
            <button className="btn-secondary" onClick={reset}>Try Another</button>
          </div>
        </motion.div>
      )}

      {/* SEO Content Section */}
      <div style={{ marginTop: '6rem', borderTop: '1px solid var(--border)', paddingTop: '4rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>Custom PDF Headers and Footers</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '4rem' }}>
            Add professional branding, copyright notices, or confidentiality labels to every page of your PDF document instantly.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', marginBottom: '5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Professional Branding</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Easily add your company name or website URL to the bottom of every page. Perfect for marketing materials, white papers, and corporate reports.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Legal & Compliance</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Add mandatory legal disclaimers, confidentiality stamps (e.g., "Highly Confidential"), or version control information to the header or footer area.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Instant Browser Processing</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Your documents never leave your computer. Our tool uses client-side PDF manipulation to add text, ensuring your data remains 100% private and secure.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderFooter;
