import { useState } from 'react';
import { 
  FileText, 
  FileSpreadsheet, 
  Presentation, 
  Image as ImageIcon, 
  ChevronDown,
  Combine,
  Scissors,
  RotateCw,
  Trash2,
  Edit3,
  Stamp,
  LogOut,
  User,
  Settings,
  Menu,
  X,
  ChevronRight,
  Globe
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const Navbar = ({ onSelectTool, isLoggedIn, userRole, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { lang, changeLanguage, t, languages } = useLanguage();
  const navigate = useNavigate();

  const categories = [
    {
      name: t('nav.cat_convertToPdf') !== 'nav.cat_convertToPdf' ? t('nav.cat_convertToPdf') : 'Convert to PDF',
      tools: [
        { id: 'word-pdf', path: '/word-pdf', name: t('toolList.word-pdf.name') !== 'toolList.word-pdf.name' ? t('toolList.word-pdf.name') : 'Word to PDF', icon: FileText, color: '#2563eb' },
        { id: 'excel-pdf', path: '/excel-pdf', name: t('toolList.excel-pdf.name') !== 'toolList.excel-pdf.name' ? t('toolList.excel-pdf.name') : 'Excel to PDF', icon: FileSpreadsheet, color: '#059669' },
        { id: 'ppt-pdf', path: '/ppt-pdf', name: t('toolList.ppt-pdf.name') !== 'toolList.ppt-pdf.name' ? t('toolList.ppt-pdf.name') : 'PPT to PDF', icon: Presentation, color: '#d97706' },
        { id: 'jpg-pdf', path: '/jpg-pdf', name: t('toolList.jpg-pdf.name') !== 'toolList.jpg-pdf.name' ? t('toolList.jpg-pdf.name') : 'JPG to PDF', icon: ImageIcon, color: '#0f172a' },
      ]
    },
    {
      name: t('nav.cat_convertFromPdf') !== 'nav.cat_convertFromPdf' ? t('nav.cat_convertFromPdf') : 'Convert from PDF',
      tools: [
        { id: 'pdf-word', path: '/pdf-word', name: t('toolList.pdf-word.name') !== 'toolList.pdf-word.name' ? t('toolList.pdf-word.name') : 'PDF to Word', icon: FileText, color: '#2563eb' },
        { id: 'pdf-excel', path: '/pdf-excel', name: t('toolList.pdf-excel.name') !== 'toolList.pdf-excel.name' ? t('toolList.pdf-excel.name') : 'PDF to Excel', icon: FileSpreadsheet, color: '#059669' },
        { id: 'pdf-ppt', path: '/pdf-ppt', name: t('toolList.pdf-ppt.name') !== 'toolList.pdf-ppt.name' ? t('toolList.pdf-ppt.name') : 'PDF to PPT', icon: Presentation, color: '#d97706' },
      ]
    },
    {
      name: t('nav.cat_editOrganize') !== 'nav.cat_editOrganize' ? t('nav.cat_editOrganize') : 'Edit & Organize',
      tools: [
        { id: 'merge', path: '/merge', name: t('toolList.merge.name') !== 'toolList.merge.name' ? t('toolList.merge.name') : 'Merge PDF', icon: Combine, color: '#1e293b' },
        { id: 'split', path: '/split', name: t('toolList.split.name') !== 'toolList.split.name' ? t('toolList.split.name') : 'Split PDF', icon: Scissors, color: '#334155' },
        { id: 'rotate', path: '/rotate', name: t('toolList.rotate.name') !== 'toolList.rotate.name' ? t('toolList.rotate.name') : 'Rotate PDF', icon: RotateCw, color: '#64748b' },
        { id: 'delete', path: '/delete', name: t('toolList.delete.name') !== 'toolList.delete.name' ? t('toolList.delete.name') : 'Delete Pages', icon: Trash2, color: '#ef4444' },
        { id: 'edit', path: '/edit', name: t('toolList.edit.name') !== 'toolList.edit.name' ? t('toolList.edit.name') : 'PDF Editor', icon: Edit3, color: '#2563eb' },
        { id: 'watermark', path: '/watermark', name: t('toolList.watermark.name') !== 'toolList.watermark.name' ? t('toolList.watermark.name') : 'Watermark', icon: Stamp, color: '#475569' },
      ]
    }
  ];

  const handleToolSelect = (toolId) => {
    onSelectTool(toolId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="glass animate-fade-in navbar-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none' }} onClick={() => setMobileMenuOpen(false)}>
          <div style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={20} color="white" />
          </div>
          <h2 className="logo-text">PDF<span style={{ color: 'var(--primary)' }}>Masterstool</span></h2>
        </Link>
      </div>
      
      {/* Desktop Navigation */}
      <nav className="nav-container desktop-only">
        {categories.map((cat) => (
          <div key={cat.name} className="nav-item">
            {cat.name} <ChevronDown size={14} />
            <div className="dropdown-menu">
              {cat.tools.map((tool) => (
                <Link 
                  to={tool.path}
                  key={tool.id} 
                  className="dropdown-item" 
                  style={{ textDecoration: 'none' }}
                >
                  <div className="dropdown-item-icon" style={{ backgroundColor: `${tool.color}15`, color: tool.color }}>
                    <tool.icon size={18} />
                  </div>
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {/* Language Selector Dropdown */}
        <div className="nav-item desktop-only" style={{ marginRight: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', padding: '8px 12px', borderRadius: '10px', background: 'rgba(0,0,0,0.03)' }}>
            <Globe size={16} /> <span>{languages[lang].name}</span> <ChevronDown size={14} />
          </div>
          <div className="dropdown-menu" style={{ width: '160px' }}>
            {Object.keys(languages).map(code => (
              <div 
                key={code} 
                className={`dropdown-item ${lang === code ? 'active' : ''}`}
                onClick={() => changeLanguage(code)}
                style={{ justifyContent: 'space-between' }}
              >
                <span>{languages[code].flag} {languages[code].name}</span>
                {lang === code && <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></div>}
              </div>
            ))}
          </div>
        </div>

        {isLoggedIn ? (
          <>
            {userRole === 'admin' && (
              <Link 
                to="/admin"
                className="btn-secondary desktop-only" 
                style={{ padding: '8px 16px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
              >
                <Settings size={16} /> Admin
              </Link>
            )}
            <Link 
              to="/user-dashboard"
              style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '4px 12px', background: 'rgba(0,0,0,0.03)', borderRadius: '12px', textDecoration: 'none' }}
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={18} />
              </div>
              <span className="desktop-only" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>{userRole === 'admin' ? 'Administrator' : t('nav.dashboard')}</span>
            </Link>
            <button 
              className="btn-secondary" 
              style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onClick={onLogout}
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </>
        ) : (
          <div className="desktop-only" style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/blog" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem', textDecoration: 'none' }}>{t('nav.blog')}</Link>
            <Link to="/pricing" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem', textDecoration: 'none' }}>{t('nav.pricing')}</Link>
            <Link to="/login" className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem', textDecoration: 'none' }}>{t('nav.login')}</Link>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-dropdown-overlay animate-fade-in">
          <div className="mobile-dropdown-content glass">
            {/* Mobile Language Selector */}
            <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
              {Object.keys(languages).map(code => (
                <button 
                  key={code} 
                  onClick={() => { changeLanguage(code); setMobileMenuOpen(false); }}
                  style={{ 
                    padding: '8px 12px', 
                    borderRadius: '8px', 
                    border: lang === code ? '2px solid var(--primary)' : '1px solid var(--border)',
                    background: lang === code ? 'rgba(37, 99, 235, 0.05)' : 'white',
                    fontSize: '0.8rem',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {languages[code].flag} {languages[code].name}
                </button>
              ))}
            </div>

            {categories.map((cat) => (
              <div key={cat.name} className="mobile-category">
                <div className="mobile-category-title">{cat.name}</div>
                <div className="mobile-tool-list">
                  {cat.tools.map((tool) => (
                    <Link 
                      to={tool.path}
                      key={tool.id} 
                      className="mobile-tool-item"
                      style={{ textDecoration: 'none' }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="mobile-tool-icon" style={{ backgroundColor: `${tool.color}15`, color: tool.color }}>
                        <tool.icon size={18} />
                      </div>
                      <span>{tool.name}</span>
                      <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            
            <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {!isLoggedIn && (
                <>
                  <Link to="/blog" className="btn-secondary" style={{ width: '100%', textAlign: 'center', textDecoration: 'none' }} onClick={() => setMobileMenuOpen(false)}>{t('nav.blog')}</Link>
                  <Link to="/pricing" className="btn-secondary" style={{ width: '100%', textAlign: 'center', textDecoration: 'none' }} onClick={() => setMobileMenuOpen(false)}>{t('nav.pricing')}</Link>
                  <Link to="/login" className="btn-primary" style={{ width: '100%', textAlign: 'center', textDecoration: 'none' }} onClick={() => setMobileMenuOpen(false)}>{t('nav.login')}</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
