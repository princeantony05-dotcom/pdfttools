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

// Helper to find soffice binary dynamically
async function findSoffice() {
  console.log(">>> [System] Starting engine search...");
  
  const checkCmd = (cmd) => new Promise(resolve => {
    exec(`which ${cmd}`, (err, stdout) => {
      if (!err && stdout.trim()) resolve(stdout.trim());
      else resolve(null);
    });
  });

  // Try common binary names
  const binary = await checkCmd('soffice') || await checkCmd('libreoffice');
  
  if (binary) {
    console.log(`>>> [System] Dynamic Search SUCCESS: Found engine at ${binary}`);
    return binary;
  }

  // Final fallback to hardcoded common paths
  const paths = [
    '/usr/bin/soffice',
    '/usr/bin/libreoffice',
    '/nix/var/nix/profiles/default/bin/soffice',
    '/app/.nix-profile/bin/soffice'
  ];
  
  for (const p of paths) {
    try {
      await fs.access(p);
      console.log(`>>> [System] Manual Search SUCCESS: Found engine at ${p}`);
      return p;
    } catch (e) {}
  }

  console.warn(">>> [System] Engine search FAILED. Will try generic 'soffice' in shell.");
  return 'soffice'; 
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
    
    // Create a truly isolated workspace for this specific conversion
    const timestamp = Date.now();
    const workDir = path.join('/tmp', `conv_${timestamp}`);
    await fs.mkdir(workDir, { recursive: true });

    const inputExt = path.extname(req.file.originalname) || '.pdf';
    tempInputPath = path.join(workDir, `source${inputExt}`);
    tempOutputPath = path.join(workDir, `output.${cleanFormat}`);
    const userProfilePath = path.join(workDir, `profile`);

    await fs.writeFile(tempInputPath, inputBuffer);
    console.log(`>>> [API] Workspace created: ${workDir}`);

    // Determine if we should use the specialized pdf2docx engine (only for PDF to Word)
    const isPdfToWord = inputExt.toLowerCase() === '.pdf' && cleanFormat === 'docx';
    
    let cmd;
    if (isPdfToWord) {
      console.log(`>>> [API] Using high-end pdf2docx engine for reconstruction...`);
      // Use python3 -c to run pdf2docx directly
      cmd = `python3 -c "from pdf2docx import Converter; cv = Converter('${tempInputPath}'); cv.convert('${tempOutputPath}'); cv.close()"`;
    } else {
      // Select the best filter for the output format
      let filter = cleanFormat;
      let inFilter = '';
      if (inputExt.toLowerCase() === '.pdf') {
        inFilter = '--infilter="writer_pdf_import"';
      }
      cmd = `${sofficePath} --headless --nologo --nofirststartwizard "-env:UserInstallation=file://${userProfilePath}" ${inFilter} --convert-to ${filter} --outdir ${workDir} ${tempInputPath}`;
    }
    
    console.log(`>>> [Exec] ${cmd}`);

    await new Promise((resolve, reject) => {
      exec(cmd, { timeout: 120000 }, (error, stdout, stderr) => {
        if (stdout) console.log(`>>> [Stdout] ${stdout}`);
        if (stderr) console.warn(`>>> [Stderr] ${stderr}`);
        
        if (error) {
          console.error(`>>> [Engine Exec Error]:`, error);
          return reject(new Error(stderr || 'Conversion engine failed to respond'));
        }
        resolve();
      });
    });

    // Dynamically find the output file (don't guess the name)
    const files = await fs.readdir(workDir);
    console.log(`>>> [System] Files in workspace: ${files.join(', ')}`);
    
    const outputFileName = files.find(f => f.endsWith(`.${cleanFormat}`));
    
    if (!outputFileName) {
      throw new Error(`Engine finished but no .${cleanFormat} file was generated. Found: ${files.join(', ')}`);
    }

    tempOutputPath = path.join(workDir, outputFileName);
    const outputBuffer = await fs.readFile(tempOutputPath);
    console.log(`>>> [API] Success! Converted file: ${outputFileName}`);

    // Determine Content-Type
    let contentType = 'application/octet-stream';
    if (cleanFormat === 'pdf') contentType = 'application/pdf';
    else if (cleanFormat === 'docx') contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    else if (cleanFormat === 'xlsx') contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    else if (cleanFormat === 'pptx') contentType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';

    res.set({
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="converted.${cleanFormat}"`,
      'Content-Length': outputBuffer.length
    });

    res.send(outputBuffer);

    // Deep Cleanup
    await fs.rm(workDir, { recursive: true, force: true }).catch(() => {});

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
