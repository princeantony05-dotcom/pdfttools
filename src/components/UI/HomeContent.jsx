import { CheckCircle, HelpCircle, ShieldCheck, Zap } from 'lucide-react';
import AdPlaceholder from './AdPlaceholder';

const HomeContent = () => {
  return (
    <div style={{ marginTop: '6rem', borderTop: '1px solid var(--border)', paddingTop: '4rem' }}>
      {/* Why Section */}
      <section style={{ marginBottom: '5rem' }}>
        <h2 style={{ fontSize: '2.25rem', textAlign: 'center', marginBottom: '3rem' }}>Why Choose <span style={{ color: 'var(--primary)' }}>PDF Elite</span>?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <ShieldCheck color="var(--primary)" /> 100% Private & Secure
            </h3>
            <p>Unlike other PDF tools, PDF Elite processes your documents entirely in your web browser. Your sensitive files never leave your computer and are never uploaded to our servers, ensuring maximum privacy for your data.</p>
          </div>
          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <Zap color="var(--primary)" size={20} /> Lightning Fast Performance
            </h3>
            <p>By leveraging the power of your local hardware through WebAssembly (WASM), we eliminate the need for slow uploads and downloads. Large conversions happen in seconds, directly on your machine.</p>
          </div>
          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <CheckCircle color="var(--primary)" /> Professional Quality
            </h3>
            <p>We use industry-standard engines like LibreOffice to ensure that your Word, Excel, and PowerPoint conversions maintain their original formatting and layout perfectly every time.</p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section style={{ marginBottom: '5rem', backgroundColor: 'rgba(37, 99, 235, 0.02)', padding: '4rem', borderRadius: '32px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>How It Works</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 'bold' }}>1</div>
            <div>
              <h4>Select Your Tool</h4>
              <p>Choose from our comprehensive suite of PDF tools, including Merge, Split, Compress, or our specialized Office-to-PDF converters.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 'bold' }}>2</div>
            <div>
              <h4>Add Your Files</h4>
              <p>Drag and drop your documents into the processing area. Remember, these files are loaded locally and are never transmitted over the internet.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 'bold' }}>3</div>
            <div>
              <h4>Download Result</h4>
              <p>Once processing is complete, simply click the download button to save your new PDF or Office document to your local storage.</p>
            </div>
          </div>
        </div>
      </section>

      <AdPlaceholder type="banner" />

      {/* FAQ Section */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <HelpCircle color="var(--primary)" /> Frequently Asked Questions
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h4 style={{ marginBottom: '0.75rem' }}>Is PDF Elite free to use?</h4>
            <p style={{ fontSize: '0.95rem' }}>Yes, PDF Elite provides a robust set of free tools for all users. We believe everyone should have access to private, high-quality document processing software.</p>
          </div>
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h4 style={{ marginBottom: '0.75rem' }}>Do I need to create an account?</h4>
            <p style={{ fontSize: '0.95rem' }}>No registration is required. You can start using our Merge, Split, and Conversion tools immediately without providing an email address or personal details.</p>
          </div>
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h4 style={{ marginBottom: '0.75rem' }}>Which browsers are supported?</h4>
            <p style={{ fontSize: '0.95rem' }}>PDF Elite works best on modern browsers that support WebAssembly, including Google Chrome, Mozilla Firefox, Microsoft Edge, and Safari.</p>
          </div>
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h4 style={{ marginBottom: '0.75rem' }}>How secure are my files?</h4>
            <p style={{ fontSize: '0.95rem' }}>Your files are as secure as your own computer. Because we process data locally, there is no server-side storage or cloud risk involved.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeContent;

