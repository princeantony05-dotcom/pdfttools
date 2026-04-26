import { Info, Cpu, Zap, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const AboutUs = () => {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 0' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '4rem' }}
      >
        <div style={{ display: 'inline-flex', padding: '1rem', backgroundColor: 'rgba(15, 23, 42, 0.05)', borderRadius: '20px', color: 'var(--secondary)', marginBottom: '1.5rem' }}>
          <Info size={48} />
        </div>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>About PDFElite</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Empowering users with professional-grade, privacy-first PDF tools.</p>
      </motion.div>

      <section style={{ marginBottom: '4rem' }}>
        <h2>Our Mission</h2>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
          PDFElite was born out of a simple observation: most online PDF tools are a privacy nightmare. 
          To merge or convert a document, users are often forced to upload sensitive data to unknown servers. 
          We believe you shouldn't have to sacrifice your privacy for productivity. Our mission is to provide 
          high-performance document tools that run entirely on your own machine.
        </p>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '4rem' }}>
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ color: 'var(--primary)', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
            <Cpu size={32} />
          </div>
          <h4 style={{ marginBottom: '0.5rem' }}>Local WASM</h4>
          <p style={{ fontSize: '0.85rem' }}>Powered by LibreOffice compiled to WebAssembly for native-grade performance in the browser.</p>
        </div>
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ color: 'var(--primary)', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
            <Zap size={32} />
          </div>
          <h4 style={{ marginBottom: '0.5rem' }}>Instant Speed</h4>
          <p style={{ fontSize: '0.85rem' }}>No upload or download wait times. Processing happens at the speed of your processor.</p>
        </div>
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ color: 'var(--primary)', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
            <Shield size={32} />
          </div>
          <h4 style={{ marginBottom: '0.5rem' }}>100% Private</h4>
          <p style={{ fontSize: '0.85rem' }}>Your data never leaves your device. Perfect for enterprise and personal confidentiality.</p>
        </div>
      </div>

      <section>
        <h2>The Technology</h2>
        <p>
          We leverage the latest advancements in web technology, including <strong>React</strong>, <strong>WebAssembly</strong>, and 
          <strong>SharedArrayBuffer</strong> to bring desktop-class software to the browser. By porting industry-standard engines like 
          LibreOffice to WASM, we ensure that the quality of your conversions and edits matches the world's best office suites.
        </p>
      </section>
    </div>
  );
};

export default AboutUs;

