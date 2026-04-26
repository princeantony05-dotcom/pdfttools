import express from 'express';
import multer from 'multer';
import libre from 'libreoffice-convert';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import cors from 'cors';
import { promisify } from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// Promisify libreoffice-convert
const convertAsync = promisify(libre.convert);

// Helper to find soffice binary
async function findSoffice() {
  const paths = [
    '/usr/bin/soffice',
    '/usr/bin/libreoffice',
    '/usr/local/bin/soffice',
    '/app/.nix-profile/bin/soffice', // Possible Nixpacks path
    'soffice'
  ];
  
  for (const p of paths) {
    try {
      await fs.access(p);
      console.log(`>>> [System] Found LibreOffice at: ${p}`);
      return p;
    } catch (e) {}
  }
  return 'soffice'; // Default to PATH
}

const sofficePath = await findSoffice();

app.use(cors());
app.use(express.json());

// Set up multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit
});

// Conversion endpoint
app.post('/api/convert', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      console.error('>>> [API] No file received');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { format = 'pdf' } = req.body;
    const cleanFormat = format.startsWith('.') ? format.slice(1) : format;
    const inputBuffer = req.file.buffer;

    console.log(`>>> [API] Converting ${req.file.originalname} to ${cleanFormat}...`);

    // Attempt conversion with explicit options if needed
    try {
      // Some versions of libreoffice-convert take 4 arguments, others take 3.
      // We'll use the callback version wrapped in a promise for max control.
      const outputBuffer = await new Promise((resolve, reject) => {
        libre.convert(inputBuffer, `.${cleanFormat}`, undefined, (err, data) => {
          if (err) return reject(err);
          resolve(data);
        });
      });

      console.log(`>>> [API] Success! Converted size: ${outputBuffer.length} bytes`);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="converted.pdf"`,
        'Content-Length': outputBuffer.length
      });

      res.send(outputBuffer);
    } catch (libErr) {
      console.error('>>> [LibreOffice Error]:', libErr);
      // Check if it's a "not found" error
      if (libErr.message && libErr.message.includes('ENOENT')) {
        res.status(500).json({ error: 'LibreOffice engine not found on server. Check build logs.' });
      } else {
        res.status(500).json({ error: 'LibreOffice failed to process this specific file format.' });
      }
    }
  } catch (error) {
    console.error('>>> [Server Error]:', error);
    res.status(500).json({ error: 'Internal server error during conversion.' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', engine: 'libreoffice' });
});

// Serve static files from the Vite build directory
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Handle SPA routing - Catch-all middleware
app.use((req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      if (!res.headersSent) {
        res.status(404).send('Application is still building or dist folder is missing. Please wait 1-2 minutes and refresh.');
      }
    }
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`>>> PDFMasterstool Server is LIVE on port ${port}`);
  console.log(`>>> Serving static files from: ${distPath}`);
  console.log(`>>> Health check available at /health`);
});
