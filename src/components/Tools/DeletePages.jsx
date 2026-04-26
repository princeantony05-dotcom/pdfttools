import { useState } from "react";
import Dropzone from '../UI/Dropzone';
import { deletePages, downloadBlob } from '../../utils/pdfHelpers';
import { Loader2, CheckCircle, Trash2 } from 'lucide-react';

const DeletePages = () => {
  const [files, setFiles] = useState([]);
  const [pagesInput, setPagesInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleDelete = async () => {
    if (files.length === 0 || !pagesInput) return;
    
    setIsProcessing(true);
    try {
      const file = files[0];
      // Convert "1, 2, 5" to [0, 1, 4]
      const indices = pagesInput.split(',').map(p => parseInt(p.trim()) - 1).filter(p => !isNaN(p));
      const resultPdfBytes = await deletePages(file, indices);
      downloadBlob(resultPdfBytes, `edited_${file.name}`, 'application/pdf');
      setIsComplete(true);
    } catch (error) {
      console.error('Deletion failed:', error);
      alert('Failed to delete pages. Check your page numbers.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2>Delete Pages</h2>
        <p>Remove specific pages from your PDF document.</p>
      </div>

      {!isComplete ? (
        <>
          <Dropzone onFilesSelected={setFiles} multiple={false} />
          
          {files.length > 0 && (
            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Enter page numbers to delete (comma separated, e.g. 1, 3, 5):</label>
                <input 
                  type="text" 
                  value={pagesInput}
                  onChange={(e) => setPagesInput(e.target.value)}
                  placeholder="e.g. 1, 2, 5"
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
                onClick={handleDelete}
                disabled={isProcessing || !pagesInput}
                style={{ alignSelf: 'center', minWidth: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Processing...
                  </>
                ) : (
                  <>
                    <Trash2 size={20} />
                    Delete Pages
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
          <h3>Pages Deleted!</h3>
          <p>Your updated PDF has been downloaded.</p>
          <button 
            className="btn-secondary" 
            style={{ marginTop: '2rem' }}
            onClick={() => {
              setIsComplete(false);
              setFiles([]);
              setPagesInput('');
            }}
          >
            Delete more pages
          </button>
        </div>
      )}
    </div>
  );
};

export default DeletePages;

