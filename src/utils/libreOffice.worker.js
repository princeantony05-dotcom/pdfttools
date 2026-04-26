/**
 * LibreOffice Worker - Runs the LibreOffice WASM engine.
 */

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// let loModule = null; // Currently unused in mock implementation

/**
 * Initialize the LibreOffice Module
 */
async function initLibreOffice() {
  try {
    // Mock initialization for now. 
    // In a real implementation, you would load the WASM binary:
    // loModule = await createLibreOfficeModule({
    //   locateFile: (path) => `/libreoffice/${path}`
    // });
    
    console.log('LibreOffice Worker: Initializing WASM...');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate load time
    
    return true;
  } catch (error) {
    console.error('LibreOffice Worker Init Error:', error);
    throw error;
  }
}

/**
 * Perform conversion
 */
async function performConversion(payload) {
  const { name, buffer, format } = payload;
  
  console.log(`LibreOffice Worker: Converting ${name} to ${format}...`);
  
  // Simulated delay for "processing"
  await new Promise(resolve => setTimeout(resolve, 1500)); 

  // If the target format is PDF, we could potentially use pdf-lib to create a dummy PDF
  // But for now, we will return the original buffer ONLY if the extension matches,
  // otherwise we return a small placeholder buffer to avoid "unreadable" errors
  // where the browser/OS tries to parse a PDF as a Word doc or vice versa.
  
  const currentExt = name.split('.').pop().toLowerCase();
  if (currentExt === format.toLowerCase()) {
    return buffer;
  }

  if (format.toLowerCase() === 'pdf') {
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 400]);
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      page.drawText('PDFMasterstool Conversion Placeholder', {
        x: 50,
        y: 350,
        size: 24,
        font: font,
        color: rgb(0.1, 0.4, 0.9),
      });
      
      page.drawText('Full LibreOffice WASM engine required for real conversion.', {
        x: 50,
        y: 300,
        size: 14,
        font: font,
        color: rgb(0.4, 0.4, 0.4),
      });

      page.drawText(`Input File: ${name}`, {
        x: 50,
        y: 250,
        size: 12,
        font: font,
      });

      const pdfBytes = await pdfDoc.save();
      return pdfBytes.buffer;
    } catch (err) {
      console.error('Failed to generate placeholder PDF:', err);
      // Fallback to text if pdf-lib fails in worker
      const encoder = new TextEncoder();
      return encoder.encode("%PDF-1.4\n%Fallback").buffer;
    }
  }

  // For other formats (Docx, etc.), return a text-based placeholder
  const placeholderText = `Placeholder for converted ${name} to ${format}. Real WASM engine integration required for full conversion.`;
  const encoder = new TextEncoder();
  return encoder.encode(placeholderText).buffer;
}

self.onmessage = async (event) => {
  const { id, type, payload } = event.data;

  try {
    if (type === 'INIT') {
      await initLibreOffice();
      self.postMessage({ type: 'INIT_SUCCESS' });
    } else if (type === 'CONVERT') {
      const resultBuffer = await performConversion(payload);
      self.postMessage({
        id,
        type: 'CONVERT_SUCCESS',
        payload: resultBuffer
      }, [resultBuffer]); // Transfer back
    }
  } catch (error) {
    self.postMessage({
      id,
      type: 'ERROR',
      error: error.message
    });
  }
};
