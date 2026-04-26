import { useState } from "react";
import Dropzone from '../UI/Dropzone';
import { splitPdf, downloadBlob } from '../../utils/pdfHelpers';
import { Loader2, CheckCircle, Scissors } from 'lucide-react';

const SplitPdf = () => {
  const [files, setFiles] = useState([]);
  const [rangeInput, setRangeInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleSplit = async () => {
    if (files.length === 0 || !rangeInput) return;
    
    setIsProcessing(true);
    try {
      const file = files[0];
      // Convert "1-3, 5" to ["1-3", 5]
      const ranges = rangeInput.split(',').map(r => r.trim());
      const resultPdfBytes = await splitPdf(file, ranges);
      downloadBlob(resultPdfBytes, `split_${file.name}`, 'application/pdf');
      setIsComplete(true);
    } catch (error) {
      console.error('Split failed:', error);
      alert('Failed to split PDF. Check your page ranges (e.g., 1-3, 5).');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2>Split PDF</h2>
        <p>Extract specific pages or ranges from your PDF document.</p>
      </div>

      {!isComplete ? (
        <>
          <Dropzone onFilesSelected={setFiles} multiple={false} />
          
          {files.length > 0 && (
            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Enter page ranges to extract (e.g. 1-3, 5, 8-10):</label>
                <input 
                  type="text" 
                  value={rangeInput}
                  onChange={(e) => setRangeInput(e.target.value)}
                  placeholder="e.g. 1-3, 5"
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    borderRadius: '10px', 
                    border: '1px solid var(--border)', 
                    background: 'var(--glass-bg)', 
                    color: 'white' 
                  }}
                />
              </div>
              
              <button 
                className="btn-primary" 
                onClick={handleSplit}
                disabled={isProcessing || !rangeInput}
                style={{ alignSelf: 'center', minWidth: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Extracting...
                  </>
                ) : (
                  <>
                    <Scissors size={20} />
                    Split PDF
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
          <h3>Split Complete!</h3>
          <p>Your extracted pages have been downloaded as a new PDF.</p>
          <button 
            className="btn-secondary" 
            style={{ marginTop: '2rem' }}
            onClick={() => {
              setIsComplete(false);
              setFiles([]);
              setRangeInput('');
            }}
          >
            Split another file
          </button>
        </div>
      )}
    </div>
  );
};

export default SplitPdf;

