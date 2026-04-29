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

      {/* SEO Content Section */}
      <div style={{ marginTop: '6rem', borderTop: '1px solid var(--border)', paddingTop: '4rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>How to Remove Pages from PDF Online</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '4rem' }}>
            Quickly delete unwanted pages from your PDF documents. Whether it's a blank page or a sensitive section, our tool removes it permanently and securely in your browser.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', marginBottom: '5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Easy Page Selection</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Just enter the page numbers you want to remove, separated by commas. Our tool handles the rest, ensuring the remaining pages are correctly re-sequenced in the final PDF.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Instant Browser-Side Processing</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>No more waiting for slow uploads. Our Delete PDF Pages tool runs entirely on your device, providing an instant result while keeping your data 100% private.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>100% Secure & Private</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Your files never leave your computer. We believe your documents should remain your business, which is why all processing happens locally in your web browser.</p>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '3rem', borderRadius: '32px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Frequently Asked Questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Can I undo a page deletion?</h4>
                <p style={{ opacity: 0.7 }}>Since the deletion is permanent in the new file, we recommend keeping your original PDF until you are sure the new version is correct. You can always re-upload the original if you make a mistake.</p>
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>How do I know the page numbers?</h4>
                <p style={{ opacity: 0.7 }}>You can view your PDF in any standard viewer to identify the pages you want to remove. For a more visual experience, try our **'PDF Organizer'** tool which shows thumbnails for every page.</p>
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Is there a limit to how many pages I can delete?</h4>
                <p style={{ opacity: 0.7 }}>No. You can delete one page or dozens at once. The only requirement is that at least one page must remain in the final PDF document.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeletePages;

