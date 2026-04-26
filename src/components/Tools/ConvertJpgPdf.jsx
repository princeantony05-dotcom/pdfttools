import { useState } from "react";
import Dropzone from '../UI/Dropzone';
import { PDFDocument } from 'pdf-lib';
import { downloadBlob } from '../../utils/pdfHelpers';
import { Loader2, CheckCircle, Image as ImageIcon } from 'lucide-react';

const ConvertJpgPdf = () => {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleConvert = async () => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    try {
      const pdfDoc = await PDFDocument.create();
      
      for (const file of files) {
        const imageBytes = await file.arrayBuffer();
        let image;
        
        if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
          image = await pdfDoc.embedJp2(imageBytes); // pdf-lib uses embedJp2 for jpg sometimes or embedJpg
          // Actually embedJpg is usually available
        } else if (file.type === 'image/png') {
          image = await pdfDoc.embedPng(imageBytes);
        } else {
          // Attempt to embed as JPG if type is unknown but extension matches
          try {
            image = await pdfDoc.embedJpg(imageBytes);
          } catch {
            continue;
          }
        }

        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });
      }
      
      const pdfBytes = await pdfDoc.save();
      downloadBlob(pdfBytes, 'converted_images.pdf', 'application/pdf');
      setIsComplete(true);
    } catch (error) {
      console.error('Conversion failed:', error);
      alert('Failed to convert images to PDF. Ensure they are valid JPG/PNG files.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2>JPG ↔ PDF</h2>
        <p>Convert your images (JPG/PNG) to a single PDF document.</p>
      </div>

      {!isComplete ? (
        <>
          <Dropzone onFilesSelected={setFiles} accept="image/jpeg,image/png" multiple={true} />
          
          {files.length > 0 && (
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
              <button 
                className="btn-primary" 
                onClick={handleConvert}
                disabled={isProcessing}
                style={{ minWidth: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Converting...
                  </>
                ) : (
                  <>
                    <ImageIcon size={20} />
                    Convert to PDF
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
          <h3>Conversion Complete!</h3>
          <p>Your images have been converted to a PDF.</p>
          <button 
            className="btn-secondary" 
            style={{ marginTop: '2rem' }}
            onClick={() => {
              setIsComplete(false);
              setFiles([]);
            }}
          >
            Convert more images
          </button>
        </div>
      )}
    </div>
  );
};

export default ConvertJpgPdf;

