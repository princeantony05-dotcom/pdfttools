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

  // Create a very simple text-based placeholder for now
  // In a production app, this would be replaced by the actual WASM conversion output
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
