import { useState } from "react";
import { 
  Type, 
  Image as ImageIcon, 
  Download, 
  Loader2, 
  CheckCircle2,
} from 'lucide-react';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import Dropzone from '../UI/Dropzone';
import { downloadBlob } from '../../utils/pdfHelpers';
import { motion } from 'framer-motion';

const WatermarkTool = () => {
  const [file, setFile] = useState(null);
  const [type, setType] = useState('text'); // text, image
  const [text, setText] = useState('DRAFT');
  const [image, setImage] = useState(null);
  const [opacity, setOpacity] = useState(0.3);
  const [rotation, setRotation] = useState(-45);
  const [fontSize, setFontSize] = useState(50);
  const [color, setColor] = useState('#6366f1');
  const [status, setStatus] = useState('idle'); // idle, processing, success
  const [result, setResult] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setImage(event.target.result);
      reader.readAsArrayBuffer(file);
    }
  };

  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return rgb(r, g, b);
  };

  const handleApply = async () => {
    if (!file) return;
    setStatus('processing');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      let embeddedImage = null;
      if (type === 'image' && image) {
        // Detect image type (simplified)
        embeddedImage = await pdfDoc.embedPng(image).catch(() => pdfDoc.embedJpg(image));
      }

      for (const page of pages) {
        const { width, height } = page.getSize();
        
        if (type === 'text') {
          page.drawText(text, {
            x: width / 2 - (text.length * fontSize * 0.3),
            y: height / 2,
            size: fontSize,
            font: font,
            color: hexToRgb(color),
            opacity: opacity,
            rotate: degrees(rotation),
          });
        } else if (embeddedImage) {
          const imgDims = embeddedImage.scale(0.5);
          page.drawImage(embeddedImage, {
            x: width / 2 - imgDims.width / 2,
            y: height / 2 - imgDims.height / 2,
            width: imgDims.width,
            height: imgDims.height,
            opacity: opacity,
            rotate: degrees(rotation),
          });
        }
      }

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
            <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Add Watermark</h2>
            <p style={{ color: 'var(--text-muted)' }}>Protect your documents with professional text or image watermarks.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: file ? '1fr 1fr' : '1fr', gap: '2rem' }}>
            <Dropzone onFilesSelected={(f) => setFile(f[0])} accept=".pdf" multiple={false} />
            
            {file && (
              <div className="glass" style={{ padding: '1.5rem', borderRadius: '20px' }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                  <button 
                    className={`btn-secondary ${type === 'text' ? 'active' : ''}`}
                    onClick={() => setType('text')}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    <Type size={18} /> Text
                  </button>
                  <button 
                    className={`btn-secondary ${type === 'image' ? 'active' : ''}`}
                    onClick={() => setType('image')}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    <ImageIcon size={18} /> Image
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {type === 'text' ? (
                    <div>
                      <label style={{ fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>Watermark Text</label>
                      <input 
                        type="text" 
                        value={text} 
                        onChange={(e) => setText(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}
                      />
                    </div>
                  ) : (
                    <div>
                      <label style={{ fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>Upload Watermark Image</label>
                      <input type="file" accept="image/*" onChange={handleImageUpload} style={{ fontSize: '0.85rem' }} />
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>Opacity ({Math.round(opacity * 100)}%)</label>
                      <input type="range" min="0" max="1" step="0.1" value={opacity} onChange={(e) => setOpacity(parseFloat(e.target.value))} style={{ width: '100%' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>Rotation ({rotation}°)</label>
                      <input type="range" min="-180" max="180" step="1" value={rotation} onChange={(e) => setRotation(parseInt(e.target.value))} style={{ width: '100%' }} />
                    </div>
                  </div>

                  {type === 'text' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>Font Size</label>
                        <input type="number" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>Color</label>
                        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ width: '100%', height: '38px', borderRadius: '8px', border: 'none', background: 'none' }} />
                      </div>
                    </div>
                  )}

                  <button className="btn-primary" onClick={handleApply} style={{ marginTop: '1rem' }}>
                    Apply Watermark
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
          <h3 style={{ marginTop: '2rem' }}>Applying watermark to all pages...</h3>
        </div>
      )}

      {status === 'success' && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', padding: '4rem' }}>
          <CheckCircle2 size={80} color="#10b981" style={{ margin: '0 auto 2rem' }} />
          <h2 style={{ marginBottom: '1rem' }}>Watermark Applied!</h2>
          <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>Your document is protected and ready for download.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn-primary" onClick={() => downloadBlob(result, `watermarked_${file.name}`, 'application/pdf')}>
              <Download size={20} style={{ marginRight: '0.5rem' }} /> Download PDF
            </button>
            <button className="btn-secondary" onClick={reset}>Add Another</button>
          </div>
        </motion.div>
      )}

      {/* SEO Content Section */}
      <div style={{ marginTop: '6rem', borderTop: '1px solid var(--border)', paddingTop: '4rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>How to Watermark PDF Online</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '4rem' }}>
            Protect your intellectual property and prevent unauthorized distribution of your PDF documents. Our professional watermark tool allows you to add text or image overlays with full control over opacity and positioning.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', marginBottom: '5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Text Watermarks</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Add custom text like "CONFIDENTIAL", "DRAFT", or your company name. Customize the font size, color, rotation, and opacity to ensure your message is clear without obscuring the document content.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Image & Logo Overlays</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Upload your company logo or a custom seal to use as a watermark. This is perfect for branding official documents or adding a professional touch to your PDF reports.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Secure & Private</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Watermarking happens entirely in your browser. Your sensitive files are never uploaded to our servers, ensuring your business data remains 100% private and secure.</p>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '3rem', borderRadius: '32px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Frequently Asked Questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Can watermarks be removed easily?</h4>
                <p style={{ opacity: 0.7 }}>Our tool embeds the watermark directly into the PDF content stream, making it difficult to remove with standard PDF viewers. For maximum security, we recommend using a lower opacity and placing the watermark over text.</p>
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Is there a fee for adding watermarks?</h4>
                <p style={{ opacity: 0.7 }}>No. PDFMasterstool provides professional watermarking for free. You can protect as many documents as you need without any subscription or watermarks from our site added to your file.</p>
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Will the watermark appear on every page?</h4>
                <p style={{ opacity: 0.7 }}>Yes. Our tool automatically applies your chosen text or image watermark to every single page of your PDF document in one go.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatermarkTool;

