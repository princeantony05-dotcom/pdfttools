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
          image = await pdfDoc.embedJpg(imageBytes);
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

      {/* SEO Content Section */}
      <div style={{ marginTop: '6rem', borderTop: '1px solid var(--border)', paddingTop: '4rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>How to Convert JPG to PDF Online</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '4rem' }}>
            Turn your images into professional PDF documents in seconds. Whether it's a single photo or a batch of scans, our tool merges them into one high-quality PDF file.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', marginBottom: '5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Support for Multiple Formats</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Easily convert JPG, JPEG, and PNG images. Our tool automatically embeds your images into PDF pages, preserving their original resolution and color profile.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Batch Conversion</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Upload multiple images at once to create a single multi-page PDF. This is perfect for digitizing physical documents, receipts, or creating a photo portfolio.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Secure Browser Processing</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Your images never leave your device. All conversion happens locally in your browser, providing a level of privacy that traditional online converters can't match.</p>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '3rem', borderRadius: '32px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Frequently Asked Questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Will my images lose quality?</h4>
                <p style={{ opacity: 0.7 }}>No. We embed the original image bytes directly into the PDF structure, ensuring that the visual quality remains identical to your source files.</p>
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>What image formats are supported?</h4>
                <p style={{ opacity: 0.7 }}>Currently, we support JPG (JPEG) and PNG files. These are the most common formats for photos and scanned documents.</p>
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Is there a limit on the number of images?</h4>
                <p style={{ opacity: 0.7 }}>There is no hard limit, though your browser's performance may vary depending on your computer's RAM if you upload hundreds of high-resolution photos at once.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConvertJpgPdf;

