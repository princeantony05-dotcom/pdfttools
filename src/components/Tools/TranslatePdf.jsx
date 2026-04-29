import { useState } from "react";
import { 
  Languages, 
  Loader2, 
  CheckCircle2, 
  Download,
  Globe,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import Dropzone from '../UI/Dropzone';
import { motion } from 'framer-motion';

const TranslatePdf = () => {
  const [file, setFile] = useState(null);
  const [targetLang, setTargetLang] = useState('es');
  const [status, setStatus] = useState('idle'); // idle, processing, success
  const [result, setResult] = useState(null);

  const languages = [
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ru', name: 'Russian' }
  ];

  const handleTranslate = async () => {
    if (!file) return;
    setStatus('processing');

    try {
      // Simulate translation process
      await new Promise(resolve => setTimeout(resolve, 4000));
      setResult(true);
      setStatus('success');
    } catch (err) {
      console.error('Translation failed:', err);
      setStatus('idle');
      alert('Translation process failed.');
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setStatus('idle');
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {status === 'idle' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Translate PDF Online</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Translate entire PDF documents while preserving the original layout and formatting.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: file ? '1fr 1fr' : '1fr', gap: '2rem' }}>
            <Dropzone onFilesSelected={(f) => setFile(f[0])} accept=".pdf" multiple={false} />
            
            {file && (
              <div className="glass" style={{ padding: '2rem', borderRadius: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>Select Target Language</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                      {languages.map(lang => (
                        <button 
                          key={lang.code}
                          onClick={() => setTargetLang(lang.code)}
                          style={{ 
                            padding: '10px', 
                            fontSize: '0.8rem', 
                            borderRadius: '8px', 
                            border: '1px solid var(--border)',
                            backgroundColor: targetLang === lang.code ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                            color: targetLang === lang.code ? 'white' : 'currentColor',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          <Globe size={14} /> {lang.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ padding: '1rem', backgroundColor: 'rgba(37, 99, 235, 0.05)', borderRadius: '12px', fontSize: '0.8rem', display: 'flex', gap: '0.5rem' }}>
                    <ShieldCheck size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                    <p style={{ margin: 0 }}>Your document structure will be analyzed and text will be translated while keeping images and tables in place.</p>
                  </div>

                  <button className="btn-primary" onClick={handleTranslate} style={{ width: '100%', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                    Translate PDF <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {status === 'processing' && (
        <div style={{ textAlign: 'center', padding: '10rem 0' }}>
          <Loader2 size={64} className="animate-spin" style={{ color: 'var(--primary)', margin: '0 auto' }} />
          <h3 style={{ marginTop: '2rem' }}>Translating document...</h3>
          <p style={{ color: 'var(--text-muted)' }}>Analyzing layout and processing text in {languages.find(l => l.code === targetLang)?.name}...</p>
        </div>
      )}

      {status === 'success' && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', padding: '4rem' }}>
          <CheckCircle2 size={80} color="#10b981" style={{ margin: '0 auto 2rem' }} />
          <h2>Translation Complete!</h2>
          <p style={{ marginBottom: '2.5rem', color: 'var(--text-muted)' }}>Your document has been successfully translated to {languages.find(l => l.code === targetLang)?.name}.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn-primary" onClick={() => alert('Download simulated. In a real app, the translated PDF blob would be served here.')}>
              <Download size={20} /> Download Translated PDF
            </button>
            <button className="btn-secondary" onClick={reset}>Translate Another</button>
          </div>
        </motion.div>
      )}

      {/* SEO Content Section */}
      <div style={{ marginTop: '6rem', borderTop: '1px solid var(--border)', paddingTop: '4rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>Professional PDF Translation Services</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '4rem' }}>
            Break the language barrier. Our PDF translator preserves the original layout of your document while providing high-accuracy translations in over 100 languages.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', marginBottom: '5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Layout Preservation</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>We use advanced layout analysis to ensure that your images, tables, and charts stay exactly where they are. The translated text replaces the original text within the same boundaries.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Global Language Support</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Translate your PDFs into Spanish, French, Chinese, Arabic, and dozens of other global languages. Our AI engines provide natural-sounding translations tailored to the context.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Secure & Confidential</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Your documents are processed in secure, ephemeral sessions. We never store your files or use your sensitive data for training purposes, ensuring 100% data privacy.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranslatePdf;
