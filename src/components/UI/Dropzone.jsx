import { useState, useCallback } from "react";
import { Upload, File, X } from 'lucide-react';

const Dropzone = ({ onFilesSelected, accept = ".pdf", multiple = true }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [files, setFiles] = useState([]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      const updatedFiles = multiple ? [...files, ...newFiles] : [newFiles[0]];
      setFiles(updatedFiles);
      onFilesSelected(updatedFiles);
    }
  }, [files, multiple, onFilesSelected]);

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const updatedFiles = multiple ? [...files, ...newFiles] : [newFiles[0]];
      setFiles(updatedFiles);
      onFilesSelected(updatedFiles);
    }
  };

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesSelected(updatedFiles);
  };

  return (
    <div style={{ width: '100%' }}>
      <div 
        className={`dropzone ${isDragActive ? 'active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById('fileInput').click()}
      >
        <input 
          id="fileInput"
          type="file" 
          multiple={multiple} 
          accept={accept} 
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: 'var(--primary)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <Upload size={30} />
          </div>
          <div>
            <h3>Click to upload or drag and drop</h3>
            <p>Supported formats: {accept}</p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {files.map((file, index) => (
            <div key={index} className="glass" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <File size={20} color="var(--primary)" />
                <div>
                  <div style={{ fontWeight: 500 }}>{file.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                style={{ background: 'none', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropzone;

