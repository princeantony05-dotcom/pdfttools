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
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { format = '.pdf' } = req.body;
    const inputBuffer = req.file.buffer;

    console.log(`Converting ${req.file.originalname} to ${format}...`);

    const outputBuffer = await convertAsync(inputBuffer, format, undefined);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="converted.pdf"`,
      'Content-Length': outputBuffer.length
    });

    res.send(outputBuffer);
  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ error: 'Failed to convert document' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', engine: 'libreoffice' });
});

// Serve static files from the Vite build directory
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Handle SPA routing
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  fs.access(indexPath)
    .then(() => res.sendFile(indexPath))
    .catch(() => res.status(404).send('Application is still building or dist folder is missing. Please wait 1-2 minutes and refresh.'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
