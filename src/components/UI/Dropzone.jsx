import { useState, useCallback, useEffect } from "react";
import { Upload, FileText, FileSpreadsheet, Presentation, Image as ImageIcon, File, X, Plus } from 'lucide-react';

const Dropzone = ({ onFilesSelected, accept = ".pdf", multiple = true }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState({}); // { index: dataUrl }

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  }, []);

  const generatePreview = (file, index) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews(prev => ({ ...prev, [index]: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      const updatedFiles = multiple ? [...files, ...newFiles] : [newFiles[0]];
      setFiles(updatedFiles);
      onFilesSelected(updatedFiles);
      newFiles.forEach((file, i) => generatePreview(file, files.length + i));
    }
  }, [files, multiple, onFilesSelected]);

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const updatedFiles = multiple ? [...files, ...newFiles] : [newFiles[0]];
      setFiles(updatedFiles);
      onFilesSelected(updatedFiles);
      newFiles.forEach((file, i) => generatePreview(file, files.length + i));
    }
  };

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesSelected(updatedFiles);
    // Cleanup previews
    const newPreviews = { ...previews };
    delete newPreviews[index];
    setPreviews(newPreviews);
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    if (['doc', 'docx'].includes(ext)) return { icon: FileText, color: '#2563eb' };
    if (['xls', 'xlsx'].includes(ext)) return { icon: FileSpreadsheet, color: '#059669' };
    if (['ppt', 'pptx'].includes(ext)) return { icon: Presentation, color: '#d97706' };
    if (['jpg', 'jpeg', 'png', 'svg'].includes(ext)) return { icon: ImageIcon, color: '#ec4899' };
    return { icon: File, color: 'var(--text-muted)' };
  };

  return (
    <div style={{ width: '100%' }}>
      {files.length === 0 ? (
        <div 
          className={`dropzone ${isDragActive ? 'active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById('fileInput').click()}
          style={{ padding: '4rem 2rem' }}
        >
          <input id="fileInput" type="file" multiple={multiple} accept={accept} onChange={handleFileInput} style={{ display: 'none' }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ backgroundColor: 'var(--primary)', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <Upload size={24} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>Click to upload or drag and drop</h3>
              <p style={{ fontSize: '0.85rem' }}>Select your documents to begin</p>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', 
          gap: '1rem',
          width: '100%',
          padding: '1rem',
          backgroundColor: 'rgba(0,0,0,0.02)',
          borderRadius: '20px',
          border: '1px solid var(--border)'
        }}>
          {files.map((file, index) => {
            const { icon: Icon, color } = getFileIcon(file.name);
            return (
              <motion.div 
                key={index} 
                initial={{ scale: 0.9, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }}
                className="glass" 
                style={{ 
                  padding: '1rem', 
                  position: 'relative', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: '0.75rem',
                  textAlign: 'center',
                  minHeight: '160px',
                  justifyContent: 'center'
                }}
              >
                <button 
                  onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                  style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(0,0,0,0.05)', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}
                >
                  <X size={14} />
                </button>
                
                <div style={{ width: '60px', height: '60px', borderRadius: '12px', backgroundColor: `${color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {previews[index] ? (
                    <img src={previews[index]} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Icon size={32} color={color} />
                  )}
                </div>
                
                <div style={{ width: '100%' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</div>
                  <div style={{ fontSize: '0.65rem', opacity: 0.5 }}>{(file.size / 1024).toFixed(0)} KB</div>
                </div>
              </motion.div>
            );
          })}

          {multiple && (
            <div 
              onClick={() => document.getElementById('fileInputPlus').click()}
              className="glass" 
              style={{ 
                border: '2px dashed var(--border)', 
                borderRadius: '16px', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                cursor: 'pointer',
                minHeight: '160px',
                gap: '0.5rem',
                backgroundColor: 'transparent'
              }}
            >
              <input id="fileInputPlus" type="file" multiple={multiple} accept={accept} onChange={handleFileInput} style={{ display: 'none' }} />
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)' }}>
                <Plus size={20} />
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 500, opacity: 0.6 }}>Add More</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dropzone;

