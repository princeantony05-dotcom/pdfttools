import { useState, useEffect } from "react";
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
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';

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
import SEO from './components/UI/SEO';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

const TOOLS = [
  { id: 'merge', path: '/merge', name: 'Merge PDF', icon: Combine, description: 'Combine multiple PDFs into one document', color: '#1e293b' },
  { id: 'split', path: '/split', name: 'Split PDF', icon: Scissors, description: 'Extract pages or split into separate files', color: '#334155' },
  { id: 'compress', path: '/compress', name: 'Compress PDF', icon: Zap, description: 'Reduce file size without losing quality', color: '#2563eb' },
  { id: 'jpg-pdf', path: '/jpg-pdf', name: 'JPG ↔ PDF', icon: ImageIcon, description: 'Convert images to PDF and vice versa', color: '#0f172a' },
  { id: 'rotate', path: '/rotate', name: 'Rotate PDF', icon: RotateCw, description: 'Rotate pages to correct orientation', color: '#64748b' },
  { id: 'delete', path: '/delete', name: 'Delete Pages', icon: Trash2, description: 'Remove unwanted pages from your PDF', color: '#ef4444' },
  { id: 'edit', path: '/edit', name: 'PDF Editor', icon: Edit3, description: 'Annotate, sign, and add text to your PDF', color: '#2563eb' },
  { id: 'watermark', path: '/watermark', name: 'Watermark', icon: Stamp, description: 'Add text or image watermarks to your PDF', color: '#475569' },
  { id: 'ocr', path: '/ocr', name: 'OCR (Img → Text)', icon: Type, description: 'Extract text from scanned images/PDFs', color: '#1e293b' },
  { id: 'word-pdf', path: '/word-pdf', name: 'Word to PDF', icon: FileText, description: 'Convert .docx and .doc to PDF', color: '#2563eb' },
  { id: 'excel-pdf', path: '/excel-pdf', name: 'Excel to PDF', icon: FileSpreadsheet, description: 'Convert .xlsx and .xls to PDF', color: '#059669' },
  { id: 'ppt-pdf', path: '/ppt-pdf', name: 'PPT to PDF', icon: Presentation, description: 'Convert .pptx and .ppt to PDF', color: '#d97706' },
  { id: 'pdf-word', path: '/pdf-word', name: 'PDF to Word', icon: FileText, description: 'Convert PDF to editable Word', color: '#2563eb' },
  { id: 'pdf-excel', path: '/pdf-excel', name: 'PDF to Excel', icon: FileSpreadsheet, description: 'Convert PDF to Excel spreadsheets', color: '#059669' },
  { id: 'pdf-ppt', path: '/pdf-ppt', name: 'PDF to PPT', icon: Presentation, description: 'Convert PDF to PPT presentations', color: '#d97706' },
  { id: 'organizer', path: '/organizer', name: 'PDF Organizer', icon: LayoutDashboard, description: 'Reorder, rotate, and delete pages visually', color: '#6366f1' },
  { id: 'password', path: '/password', name: 'Protect/Remove', icon: Lock, description: 'Add or remove password protection', color: '#475569' },
];

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedBlogPostId, setSelectedBlogPostId] = useState(null);
  const [user, setUser] = useState(null); 
  const { t, lang } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleToolSelection = (toolId) => {
    if (!toolId) {
      navigate('/');
      return;
    }
    
    // Check if it's a tool or a page
    const tool = TOOLS.find(t => t.id === toolId);
    if (tool) {
      navigate(tool.path);
    } else {
      // Mapping for other pages
      const pagePaths = {
        'privacy': '/privacy',
        'about': '/about',
        'disclaimer': '/disclaimer',
        'contact': '/contact',
        'pricing': '/pricing',
        'login': '/login',
        'admin': '/admin',
        'blog': '/blog',
        'user-dashboard': '/user-dashboard',
        'support': '/support'
      };
      if (pagePaths[toolId]) {
        navigate(pagePaths[toolId]);
      }
    }
  };

  const handleLogin = (role) => {
    setUser({ role });
    navigate('/');
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  const renderToolWrapper = (toolId, Component, props = {}) => {
    const tool = TOOLS.find(t => t.id === toolId);
    const title = tool ? tool.name : toolId.charAt(0).toUpperCase() + toolId.slice(1);
    const description = tool ? tool.description : `Manage your PDFs with our ${title} tool. Fast, secure, and private.`;

    return (
      <motion.div 
        key={toolId}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        <SEO title={title} description={description} />
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={() => navigate('/')}
            className="btn-secondary"
            style={{ padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <ChevronLeft size={20} />
          </button>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, opacity: 0.8 }}>{title}</h3>
        </div>

        <div className="tool-layout-wrapper">
          <div className="tool-layout-grid">
            <aside className="sidebar-ad-container">
              <AdPlaceholder type="sidebar" id={`sidebar-left-${toolId}`} />
              <AdPlaceholder type="square" id={`sidebar-left-2-${toolId}`} />
            </aside>

            <div className="tool-workspace-container">
              <div className="glass" style={{ minHeight: '600px', padding: '2rem' }}>
                <Component onBack={() => navigate('/')} {...props} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderPageWrapper = (pageId, Component, title, props = {}) => {
    return (
      <motion.div 
        key={pageId}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <SEO title={title} description={`Learn more about PDFMasterstool ${title}.`} />
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={() => navigate('/')}
            className="btn-secondary"
            style={{ padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <ChevronLeft size={20} />
          </button>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, opacity: 0.8 }}>{title}</h3>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 200px)' }}>
          <div className="glass" style={{ width: '100%', maxWidth: pageId === 'blog' ? '1200px' : '500px', padding: '2rem' }}>
            <Component {...props} />
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="app-container" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="bg-gradient-mesh"></div>
      
      <Navbar 
        onSelectTool={handleToolSelection} 
        isLoggedIn={!!user} 
        userRole={user?.role} 
        onLogout={handleLogout}
      />

      <main style={{ flex: 1, padding: '2rem 5%', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <SEO title="Home" description="100% private, browser-side PDF tools. Merge, Split, Compress, Edit, and Convert PDF to Office locally." />
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                  <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{t('home.heroTitle')}</h1>
                  <p style={{ maxWidth: '600px', margin: '0 auto' }}>{t('home.heroSubtitle')}</p>
                </div>

                <AdPlaceholder type="leaderboard" />

                <div className="tool-grid">
                  {TOOLS.map((tool) => (
                    <div 
                      key={tool.id} 
                      className="glass-card" 
                      style={{ padding: '2rem', cursor: 'pointer' }}
                      onClick={() => navigate(tool.path)}
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
            } />

            {/* Tool Routes */}
            <Route path="/merge" element={renderToolWrapper('merge', MergePdf)} />
            <Route path="/split" element={renderToolWrapper('split', SplitPdf)} />
            <Route path="/rotate" element={renderToolWrapper('rotate', RotatePdf)} />
            <Route path="/delete" element={renderToolWrapper('delete', DeletePages)} />
            <Route path="/compress" element={renderToolWrapper('compress', CompressPdf)} />
            <Route path="/jpg-pdf" element={renderToolWrapper('jpg-pdf', ConvertJpgPdf)} />
            <Route path="/ocr" element={renderToolWrapper('ocr', OcrTool)} />
            <Route path="/edit" element={renderToolWrapper('edit', EditPdf)} />
            <Route path="/watermark" element={renderToolWrapper('watermark', WatermarkTool)} />
            <Route path="/word-pdf" element={renderToolWrapper('word-pdf', OfficeToPdf, { type: "word" })} />
            <Route path="/excel-pdf" element={renderToolWrapper('excel-pdf', OfficeToPdf, { type: "excel" })} />
            <Route path="/ppt-pdf" element={renderToolWrapper('ppt-pdf', OfficeToPdf, { type: "ppt" })} />
            <Route path="/pdf-word" element={renderToolWrapper('pdf-word', PdfToOffice, { type: "word" })} />
            <Route path="/pdf-excel" element={renderToolWrapper('pdf-excel', PdfToOffice, { type: "excel" })} />
            <Route path="/pdf-ppt" element={renderToolWrapper('pdf-ppt', PdfToOffice, { type: "ppt" })} />
            <Route path="/organizer" element={renderToolWrapper('organizer', PdfOrganizer)} />
            <Route path="/password" element={renderToolWrapper('password', PasswordTool)} />

            {/* Page Routes */}
            <Route path="/privacy" element={renderPageWrapper('privacy', PrivacyPolicy, 'Privacy Policy')} />
            <Route path="/about" element={renderPageWrapper('about', AboutUs, 'About Us')} />
            <Route path="/disclaimer" element={renderPageWrapper('disclaimer', Disclaimer, 'Disclaimer')} />
            <Route path="/contact" element={renderPageWrapper('contact', ContactUs, 'Contact Us')} />
            <Route path="/pricing" element={renderPageWrapper('pricing', Pricing, 'Pricing', { onSelectPlan: () => navigate('/login') })} />
            <Route path="/login" element={renderPageWrapper('login', Login, 'Login', { onLoginSuccess: handleLogin, onBack: () => navigate('/') })} />
            <Route path="/admin" element={user?.role === 'admin' ? renderPageWrapper('admin', AdminDashboard, 'Admin Dashboard') : <Navigate to="/login" />} />
            <Route path="/blog" element={renderPageWrapper('blog', Blog, 'Blog', { onSelectPost: (id) => { setSelectedBlogPostId(id); navigate(`/blog/${id}`); } })} />
            <Route path="/blog/:postId" element={renderPageWrapper('blog-post', BlogPost, 'Blog Post', { postId: selectedBlogPostId, onBack: () => navigate('/blog'), onSelectTool: (id) => navigate(TOOLS.find(t => t.id === id)?.path || '/') })} />
            <Route path="/user-dashboard" element={renderPageWrapper('user-dashboard', UserDashboard, 'Dashboard', { onLogout: handleLogout })} />
            <Route path="/support" element={renderPageWrapper('support', Support, 'Support')} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AnimatePresence>
      </main>

      <footer style={{ padding: '3rem 5%', borderTop: '1px solid var(--border)', marginTop: '4rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.9rem' }}>© 2026 PDFMasterstool. All processing happens in your browser. Your files never leave your device.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1rem' }}>
          <button onClick={() => navigate('/privacy')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer' }}>Privacy Policy</button>
          <button onClick={() => navigate('/about')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer' }}>About Us</button>
          <button onClick={() => navigate('/disclaimer')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer' }}>Disclaimer</button>
          <button onClick={() => navigate('/contact')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer' }}>Contact</button>
          <button onClick={() => navigate('/support')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer' }}>Support</button>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
