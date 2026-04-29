import { useState } from "react";
import Dropzone from '../UI/Dropzone';
import { rotatePdf, downloadBlob } from '../../utils/pdfHelpers';
import { Loader2, CheckCircle, RotateCw } from 'lucide-react';

const RotatePdf = () => {
  const [files, setFiles] = useState([]);
  const [rotation, setRotation] = useState(90);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleRotate = async () => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    try {
      const file = files[0];
      const rotatedPdfBytes = await rotatePdf(file, rotation);
      downloadBlob(rotatedPdfBytes, `rotated_${file.name}`, 'application/pdf');
      setIsComplete(true);
    } catch (error) {
      console.error('Rotation failed:', error);
      alert('Failed to rotate PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2>Rotate PDF</h2>
        <p>Rotate all pages in your PDF document.</p>
      </div>

      {!isComplete ? (
        <>
          <Dropzone onFilesSelected={setFiles} multiple={false} />
          
          {files.length > 0 && (
            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {[90, 180, 270].map(deg => (
                  <button 
                    key={deg}
                    className={rotation === deg ? 'btn-primary' : 'btn-secondary'}
                    onClick={() => setRotation(deg)}
                    style={{ padding: '8px 16px' }}
                  >
                    {deg}°
                  </button>
                ))}
              </div>
              
              <button 
                className="btn-primary" 
                onClick={handleRotate}
                disabled={isProcessing}
                style={{ minWidth: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Rotating...
                  </>
                ) : (
                  <>
                    <RotateCw size={20} />
                    Rotate PDF
                  </>
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ color: '#10b981', marginBottom: '1.5rem' }}>
            <CheckCircle size={64} style={{ margin: '0 auto' }} />
          </div>
          <h3>Rotation Complete!</h3>
          <p>Your rotated PDF has been downloaded.</p>
          <button 
            className="btn-secondary" 
            style={{ marginTop: '2rem' }}
            onClick={() => {
              setIsComplete(false);
              setFiles([]);
            }}
          >
            Rotate another file
          </button>
        </div>
      )}

      {/* SEO Content Section */}
      <div style={{ marginTop: '6rem', borderTop: '1px solid var(--border)', paddingTop: '4rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>How to Rotate PDF Pages Online</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '4rem' }}>
            Fix upside-down or sideways PDF pages instantly. Rotate your entire document by 90, 180, or 270 degrees with our free, browser-based PDF rotation tool.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', marginBottom: '5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Permanent Rotation</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Unlike some viewers that only rotate the display, our tool permanently modifies the PDF metadata. This ensures your document remains in the correct orientation in every PDF reader and when printed.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Instant Browser Processing</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Experience lightning-fast performance. Since all processing happens locally in your web browser, there's no waiting for uploads or server processing. Your file is ready in milliseconds.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Privacy & Security</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Your documents never leave your computer. We value your privacy, which is why our Rotate PDF tool is designed to run entirely client-side, making it safe for sensitive business files.</p>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '3rem', borderRadius: '32px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Frequently Asked Questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Can I rotate individual pages instead of the whole file?</h4>
                <p style={{ opacity: 0.7 }}>Yes! If you need to rotate only specific pages, use our **'PDF Organizer'** tool. It provides a visual thumbnail view where you can rotate pages individually.</p>
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Is the PDF quality affected?</h4>
                <p style={{ opacity: 0.7 }}>No. Rotating a PDF is a metadata operation. We don't re-compress or change the actual content of your pages, so the visual quality remains exactly as the original.</p>
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>What if my PDF is locked?</h4>
                <p style={{ opacity: 0.7 }}>If your PDF is password-protected, you will first need to unlock it using our **'Protect/Remove'** tool before you can permanently rotate its pages.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RotatePdf;

