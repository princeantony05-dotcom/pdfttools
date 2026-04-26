import express from 'express';
import multer from 'multer';
import libre from 'libreoffice-convert';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import cors from 'cors';
import { promisify } from 'util';
import { exec } from 'child_process';

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
  let tempInputPath = null;
  let tempOutputPath = null;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { format = 'pdf' } = req.body;
    const cleanFormat = format.startsWith('.') ? format.slice(1) : format;
    const inputBuffer = req.file.buffer;
    
    // Create temporary files for the conversion process
    const tempDir = '/tmp';
    const timestamp = Date.now();
    tempInputPath = path.join(tempDir, `input_${timestamp}.docx`);
    tempOutputPath = path.join(tempDir, `input_${timestamp}.${cleanFormat}`);
    const userProfilePath = path.join(tempDir, `profile_${timestamp}`);

    await fs.writeFile(tempInputPath, inputBuffer);
    console.log(`>>> [API] Starting direct conversion: ${req.file.originalname}`);

    // Run soffice directly with a custom user profile to avoid permission issues
    const cmd = `soffice --headless --nologo --nofirststartwizard "-env:UserInstallation=file://${userProfilePath}" --convert-to ${cleanFormat} --outdir ${tempDir} ${tempInputPath}`;
    
    await new Promise((resolve, reject) => {
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          console.error(`>>> [LibreOffice Exec Error]:`, error);
          console.error(`>>> [LibreOffice Stderr]:`, stderr);
          return reject(new Error(stderr || 'Conversion failed at command level'));
        }
        console.log(`>>> [LibreOffice Stdout]:`, stdout);
        resolve();
      });
    });

    const outputBuffer = await fs.readFile(tempOutputPath);
    console.log(`>>> [API] Success! Converted size: ${outputBuffer.length} bytes`);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="converted.pdf"`,
      'Content-Length': outputBuffer.length
    });

    res.send(outputBuffer);

    // Cleanup
    await fs.unlink(tempInputPath).catch(() => {});
    await fs.unlink(tempOutputPath).catch(() => {});
    await fs.rm(userProfilePath, { recursive: true, force: true }).catch(() => {});

  } catch (error) {
    console.error('>>> [Final Conversion Error]:', error);
    res.status(500).json({ error: `Conversion failed: ${error.message}` });
    
    // Attempt cleanup if failed
    if (tempInputPath) await fs.unlink(tempInputPath).catch(() => {});
    if (tempOutputPath) await fs.unlink(tempOutputPath).catch(() => {});
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
