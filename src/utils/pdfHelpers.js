import { PDFDocument, degrees } from 'pdf-lib';

export async function mergePdfs(files) {
  const mergedPdf = await PDFDocument.create();
  
  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }
  
  return await mergedPdf.save();
}

export async function splitPdf(file, ranges) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  const newPdf = await PDFDocument.create();
  
  // ranges is an array of page numbers or strings like "1-3"
  const pageIndices = [];
  ranges.forEach(range => {
    if (typeof range === 'number') {
      pageIndices.push(range - 1);
    } else if (range.includes('-')) {
      const [start, end] = range.split('-').map(Number);
      for (let i = start; i <= end; i++) {
        pageIndices.push(i - 1);
      }
    }
  });
  
  const copiedPages = await newPdf.copyPages(pdf, pageIndices);
  copiedPages.forEach(page => newPdf.addPage(page));
  
  return await newPdf.save();
}

export async function rotatePdf(file, degree) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  const pages = pdf.getPages();
  
  pages.forEach(page => {
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees(currentRotation + degree));
  });
  
  return await pdf.save();
}

export async function deletePages(file, indicesToDelete) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  
  // Important: delete from back to front to avoid index shifting issues
  const sortedIndices = [...indicesToDelete].sort((a, b) => b - a);
  sortedIndices.forEach(index => {
    pdf.removePage(index);
  });
  
  return await pdf.save();
}

export async function addPassword(file) {
  const arrayBuffer = await file.arrayBuffer();
  // pdf-lib currently doesn't support encryption natively in all versions easily
  // but there are ways or other libs. For now, let's assume we use a placeholder 
  // or a specific method if available. 
  // Actually, pdf-lib doesn't support ENCRYPTION yet. 
  // I might need to use another approach or library for this specific tool.
  return arrayBuffer; // Placeholder
}

export function downloadBlob(data, fileName, mimeType) {
  const blob = new Blob([data], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Delay revocation to ensure browser starts the download
  setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 100);
}
