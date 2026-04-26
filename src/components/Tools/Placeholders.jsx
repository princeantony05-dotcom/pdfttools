import { Settings } from 'lucide-react';

const ToolPlaceholder = ({ name }) => (
  <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
    <div style={{ color: 'var(--primary)', marginBottom: '1.5rem', opacity: 0.5 }}>
      <Settings size={64} style={{ margin: '0 auto' }} className="animate-spin-slow" />
    </div>
    <h2>{name} is coming soon!</h2>
    <p>We're working hard to bring this professional tool to the browser. Stay tuned!</p>
  </div>
);

export const CompressPdf = () => <ToolPlaceholder name="Compress PDF" />;
export const OfficeToPdf = () => <ToolPlaceholder name="Office to PDF" />;
export const PdfToOffice = () => <ToolPlaceholder name="PDF to Office" />;
export const PasswordTool = () => <ToolPlaceholder name="Password Protect/Remove" />;

