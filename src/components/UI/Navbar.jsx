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
  ChevronRight
} from 'lucide-react';

const Navbar = ({ onSelectTool, isLoggedIn, userRole, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = [
    {
      name: 'Convert to PDF',
      tools: [
        { id: 'word-pdf', name: 'Word to PDF', icon: FileText, color: '#2563eb' },
        { id: 'excel-pdf', name: 'Excel to PDF', icon: FileSpreadsheet, color: '#059669' },
        { id: 'ppt-pdf', name: 'PPT to PDF', icon: Presentation, color: '#d97706' },
        { id: 'jpg-pdf', name: 'JPG to PDF', icon: ImageIcon, color: '#0f172a' },
      ]
    },
    {
      name: 'Convert from PDF',
      tools: [
        { id: 'pdf-word', name: 'PDF to Word', icon: FileText, color: '#2563eb' },
        { id: 'pdf-excel', name: 'PDF to Excel', icon: FileSpreadsheet, color: '#059669' },
        { id: 'pdf-ppt', name: 'PDF to PPT', icon: Presentation, color: '#d97706' },
      ]
    },
    {
      name: 'Edit & Organize',
      tools: [
        { id: 'merge', name: 'Merge PDF', icon: Combine, color: '#1e293b' },
        { id: 'split', name: 'Split PDF', icon: Scissors, color: '#334155' },
        { id: 'rotate', name: 'Rotate PDF', icon: RotateCw, color: '#64748b' },
        { id: 'delete', name: 'Delete Pages', icon: Trash2, color: '#ef4444' },
        { id: 'edit', name: 'PDF Editor', icon: Edit3, color: '#2563eb' },
        { id: 'watermark', name: 'Watermark', icon: Stamp, color: '#475569' },
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }} onClick={() => handleToolSelect(null)}>
          <div style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={20} color="white" />
          </div>
          <h2 className="logo-text">PDF<span style={{ color: 'var(--primary)' }}>Masterstool</span></h2>
        </div>
      </div>
      
      {/* Desktop Navigation */}
      <nav className="nav-container desktop-only">
        {categories.map((cat) => (
          <div key={cat.name} className="nav-item">
            {cat.name} <ChevronDown size={14} />
            <div className="dropdown-menu">
              {cat.tools.map((tool) => (
                <div 
                   key={tool.id} 
                  className="dropdown-item" 
                  onClick={() => handleToolSelect(tool.id)}
                >
                  <div className="dropdown-item-icon" style={{ backgroundColor: `${tool.color}15`, color: tool.color }}>
                    <tool.icon size={18} />
                  </div>
                  {tool.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="mobile-dropdown-overlay animate-fade-in">
          <div className="mobile-dropdown-content glass">
            {categories.map((cat) => (
              <div key={cat.name} className="mobile-category">
                <div className="mobile-category-title">{cat.name}</div>
                <div className="mobile-tool-list">
                  {cat.tools.map((tool) => (
                    <div 
                      key={tool.id} 
                      className="mobile-tool-item"
                      onClick={() => handleToolSelect(tool.id)}
                    >
                      <div className="mobile-tool-icon" style={{ backgroundColor: `${tool.color}15`, color: tool.color }}>
                        <tool.icon size={18} />
                      </div>
                      <span>{tool.name}</span>
                      <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {!isLoggedIn && (
                <>
                  <button className="btn-secondary" style={{ width: '100%' }} onClick={() => handleToolSelect('blog')}>Blog</button>
                  <button className="btn-secondary" style={{ width: '100%' }} onClick={() => handleToolSelect('pricing')}>Pricing</button>
                  <button className="btn-primary" style={{ width: '100%' }} onClick={() => handleToolSelect('login')}>Sign In</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {isLoggedIn ? (
          <>
            {userRole === 'admin' && (
              <button 
                className="btn-secondary desktop-only" 
                style={{ padding: '8px 16px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                onClick={() => handleToolSelect('admin')}
              >
                <Settings size={16} /> Admin
              </button>
            )}
            <div 
              onClick={() => handleToolSelect('user-dashboard')}
              style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '4px 12px', background: 'rgba(0,0,0,0.03)', borderRadius: '12px', cursor: 'pointer' }}
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={18} />
              </div>
              <span className="desktop-only" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>{userRole === 'admin' ? 'Administrator' : 'My Account'}</span>
            </div>
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
          <div className="desktop-only" style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }} onClick={() => handleToolSelect('blog')}>Blog</button>
            <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }} onClick={() => handleToolSelect('pricing')}>Pricing</button>
            <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem' }} onClick={() => handleToolSelect('login')}>Sign In</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

