import { useState } from "react";
import { 
  Combine, 
  Scissors, 
  Zap, 
  Image as ImageIcon, 
  RotateCw, 
  Trash2, 
  Type, 
  FileText, 
  FileSpreadsheet, 
  Lock, 
  ChevronLeft,
  Edit3,
  Stamp,
  Presentation,
  LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Tool Components
import MergePdf from './components/Tools/MergePdf';
import SplitPdf from './components/Tools/SplitPdf';
import RotatePdf from './components/Tools/RotatePdf';
import DeletePages from './components/Tools/DeletePages';
import CompressPdf from './components/Tools/CompressPdf';
import ConvertJpgPdf from './components/Tools/ConvertJpgPdf';
import OcrTool from './components/Tools/OcrTool';
import OfficeToPdf from './components/Tools/OfficeToPdf';
import PdfToOffice from './components/Tools/PdfToOffice';
import PasswordTool from './components/Tools/PasswordTool';
import EditPdf from './components/Tools/EditPdf';
import WatermarkTool from './components/Tools/WatermarkTool';
import PdfOrganizer from './components/Tools/PdfOrganizer';
import Navbar from './components/UI/Navbar';
import { getUserData } from './utils/userStore';

// Page Components
import PrivacyPolicy from './components/Pages/PrivacyPolicy';
import AboutUs from './components/Pages/AboutUs';
import Disclaimer from './components/Pages/Disclaimer';
import ContactUs from './components/Pages/ContactUs';
import Pricing from './components/Pages/Pricing';
import Login from './components/Pages/Login';
import AdminDashboard from './components/Pages/AdminDashboard';
import HomeContent from './components/UI/HomeContent';
import AdPlaceholder from './components/UI/AdPlaceholder';
import Blog from './components/Pages/Blog';
import BlogPost from './components/Pages/BlogPost';
import UserDashboard from './components/Pages/UserDashboard';
import Support from './components/Pages/Support';

const TOOLS = [
  { id: 'merge', name: 'Merge PDF', icon: Combine, description: 'Combine multiple PDFs into one document', color: '#1e293b' },
  { id: 'split', name: 'Split PDF', icon: Scissors, description: 'Extract pages or split into separate files', color: '#334155' },
  { id: 'compress', name: 'Compress PDF', icon: Zap, description: 'Reduce file size without losing quality', color: '#2563eb' },
  { id: 'jpg-pdf', name: 'JPG ↔ PDF', icon: ImageIcon, description: 'Convert images to PDF and vice versa', color: '#0f172a' },
  { id: 'rotate', name: 'Rotate PDF', icon: RotateCw, description: 'Rotate pages to correct orientation', color: '#64748b' },
  { id: 'delete', name: 'Delete Pages', icon: Trash2, description: 'Remove unwanted pages from your PDF', color: '#ef4444' },
  { id: 'edit', name: 'PDF Editor', icon: Edit3, description: 'Annotate, sign, and add text to your PDF', color: '#2563eb' },
  { id: 'watermark', name: 'Watermark', icon: Stamp, description: 'Add text or image watermarks to your PDF', color: '#475569' },
  { id: 'ocr', name: 'OCR (Img → Text)', icon: Type, description: 'Extract text from scanned images/PDFs', color: '#1e293b' },
  { id: 'word-pdf', name: 'Word to PDF', icon: FileText, description: 'Convert .docx and .doc to PDF', color: '#2563eb' },
  { id: 'excel-pdf', name: 'Excel to PDF', icon: FileSpreadsheet, description: 'Convert .xlsx and .xls to PDF', color: '#059669' },
  { id: 'ppt-pdf', name: 'PPT to PDF', icon: Presentation, description: 'Convert .pptx and .ppt to PDF', color: '#d97706' },
  { id: 'pdf-word', name: 'PDF to Word', icon: FileText, description: 'Convert PDF to editable Word', color: '#2563eb' },
  { id: 'pdf-excel', name: 'PDF to Excel', icon: FileSpreadsheet, description: 'Convert PDF to Excel spreadsheets', color: '#059669' },
  { id: 'pdf-ppt', name: 'PDF to PPT', icon: Presentation, description: 'Convert PDF to PPT presentations', color: '#d97706' },
  { id: 'organizer', name: 'PDF Organizer', icon: LayoutDashboard, description: 'Reorder, rotate, and delete pages visually', color: '#6366f1' },
  { id: 'password', name: 'Protect/Remove', icon: Lock, description: 'Add or remove password protection', color: '#475569' },
];

function App() {
  const [activeTool, setActiveTool] = useState(null);
  const [selectedBlogPostId, setSelectedBlogPostId] = useState(null);
  const [user, setUser] = useState(null); // { role: 'admin' | 'user' }

  const handleToolSelection = (toolId) => {
    if (toolId && TOOLS.some(t => t.id === toolId)) {
      const currentUserData = getUserData();
      const isPro = user?.role === 'admin' || (currentUserData && (currentUserData.subscription?.plan?.includes('Pro') || currentUserData.subscription?.plan?.includes('Enterprise')));
      
      /* Temporarily disabled usage limit
      if (!isPro) {
        const usage = parseInt(localStorage.getItem('pdf_masters_tool_usage_count') || '0');
        if (usage >= 6) {
          alert("You have reached your free limit of 6 tool uses. Please purchase a Pro plan to continue.");
          setActiveTool('pricing');
          return;
        }
        localStorage.setItem('pdf_masters_tool_usage_count', (usage + 1).toString());
      }
      */
    }
    setActiveTool(toolId);
  };

  const handleLogin = (role) => {
    setUser({ role });
    handleToolSelection(null);
  };

  const handleLogout = () => {
    setUser(null);
    handleToolSelection(null);
  };

  const currentTool = TOOLS.find(t => t.id === activeTool);

  const renderTool = () => {
    switch (activeTool) {
      case 'merge': return <MergePdf onBack={() => handleToolSelection(null)} />;
      case 'split': return <SplitPdf onBack={() => handleToolSelection(null)} />;
      case 'rotate': return <RotatePdf onBack={() => handleToolSelection(null)} />;
      case 'delete': return <DeletePages onBack={() => handleToolSelection(null)} />;
      case 'compress': return <CompressPdf onBack={() => handleToolSelection(null)} />;
      case 'jpg-pdf': return <ConvertJpgPdf onBack={() => handleToolSelection(null)} />;
      case 'ocr': return <OcrTool onBack={() => handleToolSelection(null)} />;
      case 'edit': return <EditPdf onBack={() => handleToolSelection(null)} />;
      case 'watermark': return <WatermarkTool onBack={() => handleToolSelection(null)} />;
      case 'word-pdf': return <OfficeToPdf type="word" onBack={() => handleToolSelection(null)} />;
      case 'excel-pdf': return <OfficeToPdf type="excel" onBack={() => handleToolSelection(null)} />;
      case 'ppt-pdf': return <OfficeToPdf type="ppt" onBack={() => handleToolSelection(null)} />;
      case 'pdf-word': return <PdfToOffice type="word" onBack={() => handleToolSelection(null)} />;
      case 'pdf-excel': return <PdfToOffice type="excel" onBack={() => handleToolSelection(null)} />;
      case 'pdf-ppt': return <PdfToOffice type="ppt" onBack={() => handleToolSelection(null)} />;
      case 'organizer': return <PdfOrganizer onBack={() => handleToolSelection(null)} />;
      case 'password': return <PasswordTool onBack={() => handleToolSelection(null)} />;
      case 'privacy': return <PrivacyPolicy />;
      case 'about': return <AboutUs />;
      case 'disclaimer': return <Disclaimer />;
      case 'contact': return <ContactUs />;
      case 'pricing': return <Pricing onSelectPlan={() => handleToolSelection('login')} />;
      case 'login': return <Login onLoginSuccess={handleLogin} onBack={() => handleToolSelection(null)} />;
      case 'admin': return user?.role === 'admin' ? <AdminDashboard /> : <Login onLoginSuccess={handleLogin} />;
      case 'blog': return <Blog onSelectPost={(id) => { setSelectedBlogPostId(id); handleToolSelection('blog-post'); }} />;
      case 'blog-post': return <BlogPost postId={selectedBlogPostId} onBack={() => handleToolSelection('blog')} onSelectTool={(toolId) => handleToolSelection(toolId)} />;
      case 'user-dashboard': return <UserDashboard onLogout={handleLogout} />;
      case 'support': return <Support />;
      default: return null;
    }
  };

  return (
    <div className="app-container">
      <div className="bg-gradient-mesh"></div>
      
      <Navbar 
        onSelectTool={handleToolSelection} 
        isLoggedIn={!!user} 
        userRole={user?.role} 
        onLogout={handleLogout}
      />

      <main style={{ flex: 1, padding: '2rem 5%', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        <AnimatePresence mode="wait">
          {!activeTool ? (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>PDFMasterstool: Professional PDF Tools <br/><span style={{ color: 'var(--primary)' }}>Made Simple & Private</span></h1>
                <p style={{ maxWidth: '600px', margin: '0 auto' }}>Every tool you need to work with PDFs in one place. 100% private, browser-side processing.</p>
              </div>

              <AdPlaceholder type="leaderboard" />

              <div className="tool-grid">
                {TOOLS.map((tool) => (
                  <div 
                    key={tool.id} 
                    className="glass-card" 
                    style={{ padding: '2rem', cursor: 'pointer' }}
                    onClick={() => handleToolSelection(tool.id)}
                  >
                    <div style={{ 
                      backgroundColor: `${tool.color}15`, 
                      width: '60px', 
                      height: '60px', 
                      borderRadius: '16px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      marginBottom: '1.5rem',
                      color: tool.color
                    }}>
                      <tool.icon size={32} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{tool.name}</h3>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>{tool.description}</p>
                  </div>
                ))}
              </div>

              <HomeContent />

              <AdPlaceholder type="banner" style={{ marginTop: '4rem' }} />
            </motion.div>
          ) : (
            <motion.div 
              key="tool-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >


              <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button 
                  onClick={() => handleToolSelection(null)}
                  className="btn-secondary"
                  style={{ padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <ChevronLeft size={20} />
                </button>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, opacity: 0.8 }}>{currentTool?.name}</h3>
              </div>

              {/* Fixed Layout for Tools, Regular for others */}
              {activeTool !== null && !['login', 'admin', 'user', 'pricing', 'blog', 'privacy', 'about', 'disclaimer', 'contact', 'support'].includes(activeTool) ? (
                <div className="tool-layout-wrapper">
                  <div className="tool-layout-grid">
                    {/* Left Sidebar Ad Zone - Elastic */}
                    <aside className="sidebar-ad-container">
                      <AdPlaceholder type="sidebar" id="sidebar-left-1" />
                      <AdPlaceholder type="square" id="sidebar-left-2" />
                    </aside>

                    <div className="tool-workspace-container">
                      <div className="glass" style={{ minHeight: '600px', padding: '2rem' }}>
                        {renderTool()}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="glass" style={{ minHeight: '500px', padding: '2rem' }}>
                  {renderTool()}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer - Only hide on tool pages to maintain "App" feel */}
      {(activeTool === null || ['login', 'admin', 'user', 'pricing', 'blog', 'privacy', 'about', 'disclaimer', 'contact', 'support'].includes(activeTool)) && (
        <footer style={{ padding: '3rem 5%', borderTop: '1px solid var(--border)', marginTop: '4rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.9rem' }}>© 2026 PDFMasterstool. All processing happens in your browser. Your files never leave your device.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1rem' }}>
            <button onClick={() => handleToolSelection('privacy')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer' }}>Privacy Policy</button>
            <button onClick={() => handleToolSelection('about')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer' }}>About Us</button>
            <button onClick={() => handleToolSelection('disclaimer')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer' }}>Disclaimer</button>
            <button onClick={() => handleToolSelection('contact')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer' }}>Contact</button>
            <button onClick={() => handleToolSelection('support')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer' }}>Support</button>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;

