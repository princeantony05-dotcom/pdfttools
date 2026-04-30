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
  LayoutDashboard,
  Box,
  LifeBuoy,
  ShieldAlert,
  Hash,
  Layout,
  PenTool,
  MessageSquare,
  Crop,
  Sparkles,
  Languages
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
import RepairPdf from './components/Tools/RepairPdf';
import WatermarkTool from './components/Tools/WatermarkTool';
import PdfOrganizer from './components/Tools/PdfOrganizer';
import PdfToDwg from './components/Tools/PdfToDwg';
import RedactPdf from './components/Tools/RedactPdf';
import PageNumbers from './components/Tools/PageNumbers';
import HeaderFooter from './components/Tools/HeaderFooter';
import EsignPdf from './components/Tools/EsignPdf';
import AnnotatePdf from './components/Tools/AnnotatePdf';
import CropPdf from './components/Tools/CropPdf';
import AiSummarize from './components/Tools/AiSummarize';
import TranslatePdf from './components/Tools/TranslatePdf';
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
  { id: 'merge', path: '/merge', name: 'Merge PDF Online', icon: Combine, description: 'Merge multiple PDF files into one professional document instantly. 100% private, browser-side processing with no file uploads.', color: '#1e293b' },
  { id: 'split', path: '/split', name: 'Split PDF Pages', icon: Scissors, description: 'Extract pages or split your PDF into separate files. Fast, secure, and entirely handled in your local browser.', color: '#334155' },
  { id: 'compress', path: '/compress', name: 'Compress PDF Size', icon: Zap, description: 'Reduce PDF file size without losing quality. Optimize your documents for email and web sharing locally.', color: '#2563eb' },
  { id: 'jpg-pdf', path: '/jpg-pdf', name: 'JPG to PDF Converter', icon: ImageIcon, description: 'Convert images (JPG, PNG) to PDF or extract images from your PDF documents securely.', color: '#0f172a' },
  { id: 'rotate', path: '/rotate', name: 'Rotate PDF Pages', icon: RotateCw, description: 'Rotate PDF pages to the correct orientation. Permanently fix upside-down or sideways pages in your browser.', color: '#64748b' },
  { id: 'delete', path: '/delete', name: 'Delete PDF Pages', icon: Trash2, description: 'Remove unwanted pages from your PDF documents. Clean up your files without uploading them to any server.', color: '#ef4444' },
  { id: 'edit', path: '/edit', name: 'PDF Editor & Annotator', icon: Edit3, description: 'Annotate, sign, and add text to your PDF. A complete, private PDF editor that runs entirely on your device.', color: '#2563eb' },
  { id: 'watermark', path: '/watermark', name: 'Watermark PDF', icon: Stamp, description: 'Add text or image watermarks to your PDF files. Protect your intellectual property with custom stamps.', color: '#475569' },
  { id: 'ocr', path: '/ocr', name: 'OCR Image to Text', icon: Type, description: 'Extract editable text from scanned images and PDFs using advanced browser-side OCR technology.', color: '#1e293b' },
  { id: 'word-pdf', path: '/word-pdf', name: 'Word to PDF Converter', icon: FileText, description: 'Convert Word documents (.docx, .doc) to professional PDF files with perfect formatting.', color: '#2563eb' },
  { id: 'excel-pdf', path: '/excel-pdf', name: 'Excel to PDF Converter', icon: FileSpreadsheet, description: 'Convert Excel spreadsheets (.xlsx, .xls) to PDF while preserving table layouts and data integrity.', color: '#059669' },
  { id: 'ppt-pdf', path: '/ppt-pdf', name: 'PowerPoint to PDF', icon: Presentation, description: 'Convert PPT and PPTX presentations to PDF. Ideal for sharing slides with guaranteed layout consistency.', color: '#d97706' },
  { id: 'pdf-word', path: '/pdf-word', name: 'PDF to Word (Editable)', icon: FileText, description: 'Convert PDF files back to editable Word documents using our high-fidelity reconstruction engine.', color: '#2563eb' },
  { id: 'pdf-excel', path: '/pdf-excel', name: 'PDF to Excel Converter', icon: FileSpreadsheet, description: 'Extract tables from PDF into editable Excel spreadsheets for data analysis and reporting.', color: '#059669' },
  { id: 'pdf-ppt', path: '/pdf-ppt', name: 'PDF to PowerPoint', icon: Presentation, description: 'Transform PDF pages back into editable PowerPoint slides for your next presentation.', color: '#d97706' },
  { id: 'organizer', path: '/organizer', name: 'Organize PDF Pages', icon: LayoutDashboard, description: 'Visual PDF organizer. Reorder, rotate, and delete pages with an intuitive drag-and-drop interface.', color: '#6366f1' },
  { id: 'password', path: '/password', name: 'Protect & Unlock PDF', icon: Lock, description: 'Add strong password protection to your PDF or remove existing restrictions securely.', color: '#475569' },
  { id: 'pdf-dwg', path: '/pdf-dwg', name: 'PDF to CAD (DWG/DXF)', icon: Box, description: 'Convert PDF drawings to editable DWG or DXF CAD files for engineering and architecture.', color: '#0f172a' },
  { id: 'repair', path: '/repair', name: 'Repair PDF Document', icon: LifeBuoy, description: 'Fix corrupted or broken PDF files. Recover content and rebuild document structures instantly.', color: '#10b981' },
  { id: 'redact', path: '/redact', name: 'Redact PDF Info', icon: ShieldAlert, description: 'Permanently blackout sensitive information from your PDF. Securely remove private data.', color: '#ef4444' },
  { id: 'page-numbers', path: '/page-numbers', name: 'Add Page Numbers', icon: Hash, description: 'Number your PDF pages automatically. Customize position, font, and style in your browser.', color: '#6366f1' },
  { id: 'header-footer', path: '/header-footer', name: 'Header and Footer', icon: Layout, description: 'Add custom headers and footers to your PDF documents. Perfect for branding and citations.', color: '#475569' },
  { id: 'esign', path: '/esign', name: 'Esign PDF Online', icon: PenTool, description: 'Electronically sign your PDF documents with ease. Safe, legal, and private browser-side signing.', color: '#2563eb' },
  { id: 'annotate', path: '/annotate', name: 'Annotate PDF', icon: MessageSquare, description: 'Add comments, shapes, and notes to your PDF files. Collaborate and review documents privately.', color: '#1e293b' },
  { id: 'crop', path: '/crop', name: 'Crop PDF Pages', icon: Crop, description: 'Trim PDF margins and crop pages to specific areas. Perfect for removing white space or focusing on content.', color: '#6366f1' },
  { id: 'ai-summarize', path: '/ai-summarize', name: 'AI PDF Summarizer', icon: Sparkles, description: 'Extract key insights and summaries from long PDF documents using advanced AI analysis.', color: '#6366f1' },
  { id: 'translate', path: '/translate', name: 'Translate PDF', icon: Languages, description: 'Translate your PDF documents into over 100 languages while preserving the original layout.', color: '#2563eb' },
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
            <Route path="/pdf-dwg" element={renderToolWrapper('pdf-dwg', PdfToDwg)} />
            <Route path="/repair" element={renderToolWrapper('repair', RepairPdf)} />
            <Route path="/redact" element={renderToolWrapper('redact', RedactPdf)} />
            <Route path="/page-numbers" element={renderToolWrapper('page-numbers', PageNumbers)} />
            <Route path="/header-footer" element={renderToolWrapper('header-footer', HeaderFooter)} />
            <Route path="/esign" element={renderToolWrapper('esign', EsignPdf)} />
            <Route path="/annotate" element={renderToolWrapper('annotate', AnnotatePdf)} />
            <Route path="/crop" element={renderToolWrapper('crop', CropPdf)} />
            <Route path="/ai-summarize" element={renderToolWrapper('ai-summarize', AiSummarize)} />
            <Route path="/translate" element={renderToolWrapper('translate', TranslatePdf)} />

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
