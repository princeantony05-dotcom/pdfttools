import { useState } from "react";
import Dropzone from '../UI/Dropzone';
import { mergePdfs, downloadBlob } from '../../utils/pdfHelpers';
import { Loader2, CheckCircle } from 'lucide-react';

const MergePdf = () => {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleMerge = async () => {
    if (files.length < 2) return;
    
    setIsProcessing(true);
    try {
      const mergedPdfBytes = await mergePdfs(files);
      downloadBlob(mergedPdfBytes, 'merged_document.pdf', 'application/pdf');
      setIsComplete(true);
    } catch (error) {
      console.error('Merge failed:', error);
      alert('Failed to merge PDFs. Please ensure the files are valid.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2>Merge PDF</h2>
        <p>Select two or more PDF files to combine them into a single document.</p>
      </div>

      {!isComplete ? (
        <>
          <Dropzone onFilesSelected={setFiles} />
          
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
            <button 
              className="btn-primary" 
              onClick={handleMerge}
              disabled={files.length < 2 || isProcessing}
              style={{ minWidth: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Merging...
                </>
              ) : (
                'Merge Files'
              )}
            </button>
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ color: '#10b981', marginBottom: '1.5rem' }}>
            <CheckCircle size={64} style={{ margin: '0 auto' }} />
          </div>
          <h3>Merging Complete!</h3>
          <p>Your merged PDF has been downloaded.</p>
          <button 
            className="btn-secondary" 
            style={{ marginTop: '2rem' }}
            onClick={() => {
              setIsComplete(false);
              setFiles([]);
            }}
          >
            Merge more files
          </button>
        </div>
      )}
    </div>
  );
};

export default MergePdf;

