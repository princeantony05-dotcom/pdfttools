/**
 * LibreOfficeAPI - A singleton wrapper for LibreOffice WASM operations.
 * Handles communication with a Web Worker to keep the UI responsive.
 */
class LibreOfficeAPI {
  constructor() {
    this.worker = null;
    this.initialized = false;
    this.initializing = false;
    this.queue = new Map();
    this.idCounter = 0;
  }

  async init() {
    if (this.initialized) return;
    if (this.initializing) return this.initPromise;

    this.initializing = true;
    this.initPromise = new Promise((resolve, reject) => {
      try {
        // Vite handles the worker import with the ?worker suffix or new URL
        this.worker = new Worker(new URL('./libreOffice.worker.js', import.meta.url), {
          type: 'module'
        });

        this.worker.onmessage = (event) => {
          const { id, type, payload, error } = event.data;

          if (type === 'INIT_SUCCESS') {
            this.initialized = true;
            this.initializing = false;
            resolve();
          } else if (type === 'INIT_ERROR') {
            this.initializing = false;
            reject(new Error(error || 'Failed to initialize LibreOffice WASM'));
          } else if (this.queue.has(id)) {
            const { resolve: taskResolve, reject: taskReject } = this.queue.get(id);
            if (error) {
              taskReject(new Error(error));
            } else {
              taskResolve(payload);
            }
            this.queue.delete(id);
          }
        };

        this.worker.onerror = (err) => {
          console.error('LibreOffice Worker Error:', err);
          if (this.initializing) {
            this.initializing = false;
            reject(err);
          }
        };

        this.worker.postMessage({ type: 'INIT' });
      } catch (err) {
        this.initializing = false;
        reject(err);
      }
    });

    return this.initPromise;
  }

  /**
   * Converts a file using LibreOffice
   * @param {File} file - The input file (Docx, Xlsx, etc.)
   * @param {string} targetFormat - Target extension (e.g., 'pdf', 'docx')
   * @returns {Promise<Uint8Array>} - The converted file data
   */
  async convert(file, targetFormat = 'pdf') {
    await this.init();

    const id = this.idCounter++;
    const arrayBuffer = await file.arrayBuffer();

    return new Promise((resolve, reject) => {
      this.queue.set(id, { resolve, reject });
      
      this.worker.postMessage({
        id,
        type: 'CONVERT',
        payload: {
          name: file.name,
          buffer: arrayBuffer,
          format: targetFormat
        }
      }, [arrayBuffer]); // Transfer buffer for performance
    });
  }

  /**
   * Helper for Office to PDF
   */
  async officeToPdf(file) {
    return this.convert(file, 'pdf');
  }

  /**
   * Helper for PDF to Office
   */
  async pdfToOffice(file, format = 'docx') {
    return this.convert(file, format);
  }
}

export const libreOfficeApi = new LibreOfficeAPI();
