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
    </div>
  );
};

export default RotatePdf;

