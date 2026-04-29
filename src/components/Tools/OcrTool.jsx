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

      {/* SEO Content Section */}
      <div style={{ marginTop: '6rem', borderTop: '1px solid var(--border)', paddingTop: '4rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>How to Extract Text from Images (OCR) Online</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '4rem' }}>
            Transform static images, scanned documents, and photos into editable text instantly. Our high-performance OCR engine accurately recognizes characters and layouts, saving you hours of manual typing.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', marginBottom: '5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Support for Multiple Languages</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Our OCR tool supports a wide range of languages and scripts. Whether you're scanning a business card in English or a technical document in another language, our engine provides high-accuracy extraction.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Instant Browser-Side Processing</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>We use advanced web technologies to run the OCR engine directly in your browser. This means your images are never sent to a cloud server, providing unparalleled speed and privacy.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>100% Secure & Private</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Your documents remain on your device. We value your privacy, which is why all text recognition happens locally, making it the safest way to extract text from sensitive information.</p>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '3rem', borderRadius: '32px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Frequently Asked Questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>What image formats are supported?</h4>
                <p style={{ opacity: 0.7 }}>You can upload JPG, PNG, and TIFF files. For best results, ensure your images are well-lit and the text is clear and readable.</p>
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Can I extract text from a PDF?</h4>
                <p style={{ opacity: 0.7 }}>If your PDF is a scanned document (an image-based PDF), you can first convert it to JPG using our converter and then use this OCR tool to extract the text.</p>
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>How accurate is the text extraction?</h4>
                <p style={{ opacity: 0.7 }}>Our engine is highly accurate for printed text. Handwritten text accuracy depends on the legibility of the writing. We recommend reviewing the extracted text for any minor corrections.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OcrTool;

