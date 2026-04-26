/**
 * LibreOffice Worker - Runs the LibreOffice WASM engine.
 */

// This is where the LibreOffice WASM loader would be imported
// importScripts('/libreoffice/libreoffice.js'); 

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
    // Return a minimal valid PDF structure so it at least opens in a viewer
    const minimalPdf = `%PDF-1.4
1 0 obj < /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj < /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj < /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << >> >> endobj
4 0 obj < /Length 51 >> stream
BT /F1 24 Tf 100 700 Td (Placeholder: Real WASM Conversion Needed) Tj ET
endstream endobj
xref
0 5
0000000000 65535 f
0000000009 00000 n
0000000056 00000 n
0000000111 00000 n
0000000212 00000 n
trailer < /Size 5 /Root 1 0 R >>
startxref
311
%%EOF`;
    const encoder = new TextEncoder();
    return encoder.encode(minimalPdf).buffer;
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
