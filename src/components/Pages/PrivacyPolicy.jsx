import { ShieldCheck, Lock, EyeOff, ServerOff } from 'lucide-react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 0' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '4rem' }}
      >
        <div style={{ display: 'inline-flex', padding: '1rem', backgroundColor: 'rgba(37, 99, 235, 0.1)', borderRadius: '20px', color: 'var(--primary)', marginBottom: '1.5rem' }}>
          <ShieldCheck size={48} />
        </div>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Privacy Policy</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Your privacy is our priority. At PDFElite, your files never leave your device.</p>
      </motion.div>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <ServerOff size={24} color="var(--primary)" /> 1. No File Uploads
        </h2>
        <p>Unlike traditional PDF tools that require you to upload your sensitive documents to a server, PDFElite uses cutting-edge WebAssembly (WASM) technology to process everything locally in your browser. When you "upload" a file to our tools, it is loaded into your computer's memory, not our servers.</p>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
            <Lock size={32} />
          </div>
          <h3>Secure by Design</h3>
          <p style={{ fontSize: '0.95rem' }}>Since no data is transmitted to a server, there is no risk of interception or server-side data breaches. Your documents remain under your control at all times.</p>
        </div>
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
            <EyeOff size={32} />
          </div>
          <h3>Zero Tracking</h3>
          <p style={{ fontSize: '0.95rem' }}>We do not track the content of your files, your personal information, or your usage patterns. We believe in providing tools that respect your anonymity.</p>
        </div>
      </div>

      <section style={{ marginBottom: '3rem' }}>
        <h2>2. Information We Collect</h2>
        <p>We do not collect personal information or file data. We may collect anonymous, aggregated usage statistics (such as which tools are most popular) to improve our service, but this data is never linked to your identity or your documents.</p>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2>3. Third-Party Libraries</h2>
        <p>We use open-source libraries like LibreOffice WASM, PDF-Lib, and Tesseract.js to perform document operations. These libraries run entirely within your browser environment and do not communicate with external servers during the processing of your files.</p>
      </section>

      <section style={{ padding: '2rem', backgroundColor: 'rgba(37, 99, 235, 0.05)', borderRadius: '20px', border: '1px solid rgba(37, 99, 235, 0.1)' }}>
        <h3 style={{ marginBottom: '1rem' }}>Contact Us</h3>
        <p>If you have any questions about our privacy-first approach, please reach out to us at privacy@pdfelite.app.</p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;

