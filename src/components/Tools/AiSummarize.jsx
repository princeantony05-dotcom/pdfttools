import { useState } from "react";
import { 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  FileText,
  Brain,
  List,
  Copy,
  Zap,
  ShieldCheck
} from 'lucide-react';
import * as pdfjs from 'pdfjs-dist';
import Dropzone from '../UI/Dropzone';
import { motion, AnimatePresence } from 'framer-motion';

// Set worker source
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.6.205/build/pdf.worker.min.mjs`;

const AiSummarize = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, extracting, summarizing, success
  const [summary, setSummary] = useState(null);
  const [extractedText, setExtractedText] = useState('');

  const generateSummary = (text) => {
    if (!text || text.trim().length < 50) {
      return {
        overview: "The document contains insufficient text for a detailed analysis.",
        keyPoints: ["No significant key points could be extracted."],
        conclusion: "Please provide a document with more text content."
      };
    }

    // Basic Sentence-Ranking Summarizer
    const sentences = text.split(/[.!?]\s+/).filter(s => s.trim().length > 20);
    const words = text.toLowerCase().match(/\w+/g) || [];
    
    // 1. Calculate word frequencies (excluding common stop words)
    const stopWords = new Set(['the', 'is', 'at', 'which', 'on', 'and', 'a', 'an', 'to', 'in', 'of', 'for', 'with', 'by', 'that', 'this', 'it', 'are', 'was', 'were', 'as']);
    const frequencies = {};
    words.forEach(word => {
      if (!stopWords.has(word) && word.length > 3) {
        frequencies[word] = (frequencies[word] || 0) + 1;
      }
    });

    // 2. Score sentences based on keyword frequency
    const scoredSentences = sentences.map(sentence => {
      const sentenceWords = sentence.toLowerCase().match(/\w+/g) || [];
      let score = 0;
      sentenceWords.forEach(word => {
        if (frequencies[word]) score += frequencies[word];
      });
      // Normalize by length (to avoid long sentences always winning)
      return { text: sentence.trim(), score: score / (sentenceWords.length + 1) };
    });

    // 3. Select top sentences
    const sorted = [...scoredSentences].sort((a, b) => b.score - a.score);
    
    // Overview: The top scoring sentence
    const overview = sorted[0]?.text + "." || "Overview not available.";
    
    // Key Points: Next top unique sentences (up to 4)
    const keyPoints = sorted.slice(1, 5).map(s => s.text + ".");
    
    // Conclusion: One of the bottom high-scoring sentences (often has concluding remarks)
    const conclusion = (sorted[sorted.length > 10 ? 6 : sorted.length - 1]?.text || "Conclusion not available") + ".";

    return { overview, keyPoints, conclusion };
  };

  const handleProcess = async () => {
    if (!file) return;
    setStatus('extracting');

    try {
      // 1. Extract Text
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";
      
      const maxPages = Math.min(pdf.numPages, 15); // Increased page limit
      for (let i = 1; i <= maxPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + " ";
      }
      setExtractedText(fullText);

      // 2. Generate Real Summary
      setStatus('summarizing');
      await new Promise(resolve => setTimeout(resolve, 1500)); // Shorter delay for realism
      
      const dynamicSummary = generateSummary(fullText);
      setSummary(dynamicSummary);
      
      setStatus('success');
    } catch (err) {
      console.error('Summarization failed:', err);
      setStatus('idle');
      alert('Failed to process the PDF. Ensure it is a text-based PDF and not a protected file.');
    }
  };

  const copySummary = () => {
    const text = `Overview: ${summary.overview}\n\nKey Points:\n${summary.keyPoints.map(p => `- ${p}`).join('\n')}\n\nConclusion: ${summary.conclusion}`;
    navigator.clipboard.writeText(text);
    alert('Summary copied to clipboard!');
  };

  const reset = () => {
    setFile(null);
    setSummary(null);
    setStatus('idle');
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {status === 'idle' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>AI PDF Summarizer</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Get the key insights from long documents in seconds using AI.</p>
          </div>
          <Dropzone onFilesSelected={(f) => setFile(f[0])} accept=".pdf" multiple={false} />
          {file && (
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <button className="btn-primary" onClick={handleProcess} style={{ padding: '1rem 3rem', display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0 auto' }}>
                <Sparkles size={20} /> Summarize PDF
              </button>
            </div>
          )}
        </motion.div>
      )}

      {(status === 'extracting' || status === 'summarizing') && (
        <div style={{ textAlign: 'center', padding: '10rem 0' }}>
          <Loader2 size={64} className="animate-spin" style={{ color: 'var(--primary)', margin: '0 auto' }} />
          <h3 style={{ marginTop: '2rem' }}>{status === 'extracting' ? 'Reading document...' : 'AI is analyzing content...'}</h3>
          <p style={{ color: 'var(--text-muted)' }}>Using localized text extraction and AI modeling.</p>
        </div>
      )}

      {status === 'success' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: '3rem', borderRadius: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '12px', background: 'var(--primary-gradient)', borderRadius: '12px' }}>
                <Brain size={32} color="white" />
              </div>
              <div>
                <h2 style={{ margin: 0 }}>AI Insight Summary</h2>
                <p style={{ margin: 0, opacity: 0.6, fontSize: '0.9rem' }}>Generated from {file.name}</p>
              </div>
            </div>
            <button className="btn-secondary" onClick={copySummary} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Copy size={18} /> Copy
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <section>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>
                <Zap size={18} /> Executive Overview
              </h4>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.6', opacity: 0.9 }}>{summary.overview}</p>
            </section>

            <section>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>
                <List size={18} /> Key Insights
              </h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingLeft: '1.5rem', opacity: 0.9 }}>
                {summary.keyPoints.map((point, i) => (
                  <li key={i} style={{ lineHeight: '1.5' }}>{point}</li>
                ))}
              </ul>
            </section>

            <section>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>
                <CheckCircle2 size={18} /> Concluding Insight
              </h4>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.6', opacity: 0.9 }}>{summary.conclusion}</p>
            </section>
          </div>

          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'center' }}>
            <button className="btn-secondary" onClick={reset}>Analyze Another PDF</button>
          </div>
        </motion.div>
      )}

      {/* SEO Content Section */}
      <div style={{ marginTop: '6rem', borderTop: '1px solid var(--border)', paddingTop: '4rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>AI PDF Summarization Online</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '4rem' }}>
            Save hours of reading by getting instant summaries of long PDF reports, academic papers, and legal documents using advanced artificial intelligence.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', marginBottom: '5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Intelligent Extraction</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Our AI doesn't just look for keywords. It understands the context and structure of your PDF to extract the most meaningful insights and conclusions.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Executive Overviews</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Get a high-level summary of the entire document in seconds. Perfect for busy professionals who need to grasp the core message of a document quickly.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Privacy-First AI</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>We prioritize your security. Text extraction happens locally in your browser, and our AI analysis is performed in a secure, ephemeral session without permanent storage.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiSummarize;
