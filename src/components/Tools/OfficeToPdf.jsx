import { useState, useRef } from "react";
import { 
  FileText, 
  FileSpreadsheet, 
  Presentation,
  Download, 
  Loader2, 
  CheckCircle2, 
  Zap,
  Layout
} from 'lucide-react';
import Dropzone from '../UI/Dropzone';
import { downloadBlob } from '../../utils/pdfHelpers';
import { libreOfficeApi } from '../../utils/libreOfficeApi';
import { motion } from 'framer-motion';
import mammoth from 'mammoth';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const OfficeToPdf = ({ type = 'word' }) => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, processing, success
  const [result, setResult] = useState(null);

  const getToolInfo = () => {
    switch (type) {
      case 'word': return { name: 'Word to PDF', icon: FileText, accept: '.docx,.doc', color: '#2563eb' };
      case 'excel': return { name: 'Excel to PDF', icon: FileSpreadsheet, accept: '.xlsx,.xls', color: '#059669' };
      case 'ppt': return { name: 'PPT to PDF', icon: Presentation, accept: '.pptx,.ppt', color: '#d97706' };
      default: return { name: 'Office to PDF', icon: FileText, accept: '.docx,.doc', color: '#2563eb' };
    }
  };

  const { name, icon: Icon, accept, color } = getToolInfo();

  const hiddenContainerRef = useRef(null);
  const [conversionLog, setConversionLog] = useState("");

  const handleConvert = async () => {
    if (!file) return;
    setStatus('processing');
    setConversionLog("Reading document...");

    try {
      const currentExt = file.name.split('.').pop().toLowerCase();
      
      if (currentExt === 'docx' || currentExt === 'doc') {
        setConversionLog("Parsing layout and images...");
        const arrayBuffer = await file.arrayBuffer();
        
        // Convert to HTML
        const { value: html } = await mammoth.convertToHtml({ arrayBuffer });
        
        setConversionLog("Rendering professional layout...");
        // Create hidden element with A4 styling
        const container = document.createElement('div');
        container.style.width = '794px'; // ~210mm at 96dpi
        container.style.padding = '50px 70px'; // Standard margins
        container.style.backgroundColor = 'white';
        container.style.position = 'fixed';
        container.style.left = '-9999px';
        container.style.top = '0';
        container.style.fontFamily = "'Times New Roman', serif";
        container.style.lineHeight = '1.6';
        container.style.color = '#000';
        
        // Add styling for images to prevent them from breaking the layout
        const style = document.createElement('style');
        style.innerHTML = `
          img { max-width: 100%; height: auto; display: block; margin: 10px 0; }
          p { margin-bottom: 1em; text-align: justify; }
          h1, h2, h3 { margin-top: 1.5em; margin-bottom: 0.5em; color: #000; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 1em; }
          td, th { border: 1px solid #ccc; padding: 8px; }
        `;
        container.appendChild(style);

        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = html;
        container.appendChild(contentDiv);
        document.body.appendChild(container);

        setConversionLog("Capturing high-quality pages...");
        const canvas = await html2canvas(container, {
          useCORS: true,
          scale: 2,
          logging: false,
          backgroundColor: '#ffffff'
        });

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        
        // Calculate how many A4 pages we need
        const pageHeightInPx = (imgWidth * pdfHeight) / pdfWidth;
        let heightLeft = imgHeight;
        let position = 0;
        let pageCount = 0;

        while (heightLeft > 0) {
          if (pageCount > 0) {
            pdf.addPage();
          }
          
          const canvasPage = document.createElement('canvas');
          canvasPage.width = imgWidth;
          canvasPage.height = Math.min(pageHeightInPx, heightLeft);
          
          const ctx = canvasPage.getContext('2d');
          ctx.drawImage(canvas, 0, position, imgWidth, canvasPage.height, 0, 0, imgWidth, canvasPage.height);
          
          const pageData = canvasPage.toDataURL('image/jpeg', 0.95);
          pdf.addImage(pageData, 'JPEG', 0, 0, pdfWidth, (canvasPage.height * pdfWidth) / imgWidth);
          
          position += pageHeightInPx;
          heightLeft -= pageHeightInPx;
          pageCount++;
        }
        
        const pdfBlob = pdf.output('blob');
        setResult(pdfBlob);
        document.body.removeChild(container);
        setStatus('success');
      } else {
        // Fallback to worker for other formats
        const resultBuffer = await libreOfficeApi.officeToPdf(file);
        setResult(resultBuffer);
        setStatus('success');
      }
    } catch (err) {
      console.error('Conversion failed:', err);
      setStatus('idle');
      alert('High-fidelity conversion failed. Ensure your file is a valid .docx document.');
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setStatus('idle');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {status === 'idle' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ 
              backgroundColor: `${color}15`, 
              width: '80px', 
              height: '80px', 
              borderRadius: '24px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              color: color
            }}>
              <Icon size={40} />
            </div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{name}</h2>
            <p style={{ color: 'var(--text-muted)' }}>High-fidelity conversion powered by LibreOffice WASM. 100% private.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
            <Dropzone 
              onFilesSelected={(f) => setFile(f[0])} 
              accept={accept} 
              multiple={false} 
              label={`Drag & Drop your ${type.toUpperCase()} file here`}
            />
            
            {file && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: '400px' }}>
                <button className="btn-primary" onClick={handleConvert} style={{ width: '100%', padding: '1.25rem' }}>
                  Convert to PDF
                </button>
              </motion.div>
            )}
          </div>

          <div style={{ marginTop: '4rem', display: 'flex', justifyContent: 'center', gap: '3rem', opacity: 0.6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <Zap size={16} /> Fast Local Processing
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <CheckCircle2 size={16} /> Original Formatting Kept
            </div>
          </div>
        </motion.div>
      )}

      {status === 'processing' && (
        <div style={{ textAlign: 'center', padding: '10rem 0' }}>
          <Loader2 size={64} className="animate-spin" style={{ color: color, margin: '0 auto' }} />
          <h3 style={{ marginTop: '2rem' }}>{conversionLog}</h3>
          <p style={{ color: 'var(--text-muted)' }}>Using High-Fidelity Rendering in your browser.</p>
        </div>
      )}

      {status === 'success' && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', padding: '4rem' }}>
          <CheckCircle2 size={80} color="#10b981" style={{ margin: '0 auto 2rem' }} />
          <h2 style={{ marginBottom: '1rem' }}>Conversion Complete!</h2>
          <p style={{ marginBottom: '2.5rem', color: 'var(--text-muted)' }}>Your document has been professionally converted to PDF.</p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn-primary" onClick={() => downloadBlob(result, `${file.name.split('.')[0]}.pdf`, 'application/pdf')}>
              <Download size={20} style={{ marginRight: '0.5rem' }} /> Download PDF
            </button>
            <button className="btn-secondary" onClick={reset}>Convert Another</button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default OfficeToPdf;
