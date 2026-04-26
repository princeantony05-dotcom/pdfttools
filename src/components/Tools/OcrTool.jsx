import { useState } from "react";
import Dropzone from '../UI/Dropzone';
import Tesseract from 'tesseract.js';
import { Loader2, Type, Copy } from 'lucide-react';

const OcrTool = () => {
  const [files, setFiles] = useState([]);
  const [ocrText, setOcrText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleOcr = async () => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    setOcrText('');
    try {
      const file = files[0];
      const result = await Tesseract.recognize(
        file,
        'eng',
        { 
          logger: m => {
            if (m.status === 'recognizing text') {
              setProgress(Math.round(m.progress * 100));
            }
          }
        }
      );
      setOcrText(result.data.text);
    } catch (error) {
      console.error('OCR failed:', error);
      alert('Failed to extract text from image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(ocrText);
    alert('Text copied to clipboard!');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2>OCR (Image to Text)</h2>
        <p>Extract text from images using high-performance optical character recognition.</p>
      </div>

      {!ocrText ? (
        <>
          <Dropzone onFilesSelected={setFiles} accept="image/*" multiple={false} />
          
          {files.length > 0 && (
            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              {isProcessing && (
                <div style={{ width: '100%', maxWidth: '400px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
                    <span>Processing...</span>
                    <span>{progress}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${progress}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.3s ease' }}></div>
                  </div>
                </div>
              )}
              
              <button 
                className="btn-primary" 
                onClick={handleOcr}
                disabled={isProcessing}
                style={{ minWidth: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Extracting...
                  </>
                ) : (
                  <>
                    <Type size={20} />
                    Extract Text
                  </>
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>Extracted Text</h3>
            <button className="btn-secondary" onClick={copyToClipboard} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '8px 16px' }}>
              <Copy size={16} />
              Copy
            </button>
          </div>
          <textarea 
            readOnly 
            value={ocrText} 
            style={{ 
              width: '100%', 
              height: '300px', 
              padding: '1.5rem', 
              borderRadius: '16px', 
              background: 'rgba(0,0,0,0.2)', 
              color: 'var(--text-main)', 
              border: '1px solid var(--border)',
              fontFamily: 'monospace',
              fontSize: '1rem',
              lineHeight: '1.6'
            }}
          />
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button className="btn-secondary" onClick={() => { setOcrText(''); setFiles([]); }}>
              Clear and try another image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OcrTool;

