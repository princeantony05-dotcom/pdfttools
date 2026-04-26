import { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  CreditCard, 
  Tag, 
  FileEdit, 
  ShoppingBag, 
  RotateCcw, 
  Shield, 
  LayoutDashboard, 
  PlusCircle, 
  Search, 
  Lock, 
  UserCircle, 
  Wallet, 
  Banknote, 
  ArrowUpRight,
  Trash2,
  Download
} from 'lucide-react';
import { getPosts, savePost, deletePost } from '../../utils/blogStore';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const navItems = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard },
    { id: 'monetization', name: 'Monetization', icon: DollarSign },
    { id: 'billing', name: 'Pricing & Promos', icon: Tag },
    { id: 'balance', name: 'Balance Check', icon: Wallet },
    { id: 'content', name: 'Content/Blog', icon: FileEdit },
    { id: 'users', name: 'Sales & User Data', icon: ShoppingBag },
    { id: 'security', name: 'Admin Security', icon: Shield },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab />;
      case 'monetization': return <MonetizationTab />;
      case 'billing': return <BillingTab />;
      case 'balance': return <BalanceTab />;
      case 'content': return <ContentTab />;
      case 'users': return <UsersTab />;
      case 'security': return <SecurityTab />;
      default: return <OverviewTab />;
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1rem 0' }}>
      <div className="admin-layout">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div style={{ padding: '0 1.25rem 2rem', borderBottom: '1px solid var(--border)', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, color: 'var(--primary)', fontSize: '1.1rem' }}>Admin Panel</h3>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>PDFMasterstool Management</p>
          </div>
          {navItems.map((item) => (
            <div 
              key={item.id} 
              className={`admin-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon size={20} />
              {item.name}
            </div>
          ))}
        </aside>

        {/* Main Content Area */}
        <main className="admin-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

// --- Tab Components ---

const OverviewTab = () => {
  const stats = [
    { name: 'Total Revenue', value: '$0.00', change: '0%', icon: DollarSign, color: '#059669' },
    { name: 'Active Subscriptions', value: '0', change: '0%', icon: Users, color: '#2563eb' },
    { name: 'Conversion Rate', value: '0.0%', change: '0%', icon: TrendingUp, color: '#6366f1' },
    { name: 'Files Processed', value: '0', change: '0%', icon: FileText, color: '#ef4444' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>Overview Dashboard</h2>
        <p style={{ color: 'var(--text-muted)' }}>Key performance indicators for PDFMasterstool.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {stats.map((stat) => (
          <div key={stat.name} className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ backgroundColor: `${stat.color}15`, padding: '10px', borderRadius: '10px', color: stat.color }}>
                <stat.icon size={24} />
              </div>
              <span style={{ color: '#059669', fontSize: '0.8rem', fontWeight: 600 }}>{stat.change}</span>
            </div>
            <h5 style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{stat.name}</h5>
            <h3 style={{ margin: 0 }}>{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ padding: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>System Performance</h3>
        <div style={{ height: '200px', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
          [Real-time Analytics Graph Placeholder]
        </div>
      </div>
    </div>
  );
};

const MonetizationTab = () => {
  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>Monetization Settings</h2>
        <p style={{ color: 'var(--text-muted)' }}>Manage AdSense and Payment Gateways.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <DollarSign color="var(--primary)" />
            <h3 style={{ margin: 0 }}>Google AdSense</h3>
          </div>
          <div className="admin-form-group">
            <label>AdSense Status</label>
            <select className="admin-input">
              <option>Active</option>
              <option>Paused</option>
              <option>Sandbox Mode</option>
            </select>
          </div>
          <div className="admin-form-group">
            <label>Ad Unit Code Snippet</label>
            <textarea className="admin-input" rows="5" placeholder="Paste your AdSense script here..."></textarea>
          </div>
          <button className="btn-primary" style={{ width: '100%' }}>Update AdSense Configuration</button>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <CreditCard color="var(--primary)" />
            <h3 style={{ margin: 0 }}>Payment Gateways</h3>
          </div>
          <div className="admin-form-group">
            <label>Provider</label>
            <select className="admin-input">
              <option>Stripe</option>
              <option>PayPal</option>
              <option>Razorpay</option>
            </select>
          </div>
          <div className="admin-form-group">
            <label>Public Key</label>
            <input type="password" value="pk_test_********************" className="admin-input" readOnly />
          </div>
          <div className="admin-form-group">
            <label>Secret Key</label>
            <input type="password" value="sk_test_********************" className="admin-input" readOnly />
          </div>
          <button className="btn-secondary" style={{ width: '100%' }}>Test Connection</button>
        </div>
      </div>
    </div>
  );
};

const BillingTab = () => {
  const [plans, setPlans] = useState([
    { id: 1, name: 'Basic (Free)', monthly: '$0.00', yearly: '$0.00', features: '5 tools / day' },
    { id: 2, name: 'Pro Bundle', monthly: '$9.99', yearly: '$89.00', features: 'Unlimited / 2GB' },
    { id: 3, name: 'Enterprise', monthly: '$29.99', yearly: '$299.00', features: 'Team Access' }
  ]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleEdit = (plan) => {
    setEditingId(plan.id);
    setEditForm({ ...plan });
  };

  const handleSave = () => {
    setPlans(plans.map(p => p.id === editingId ? editForm : p));
    setEditingId(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h2 style={{ marginBottom: '0.5rem' }}>Pricing & Promotions</h2>
          <p style={{ color: 'var(--text-muted)' }}>Adjust plan costs and create discount coupons.</p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <PlusCircle size={18} /> New Coupon
        </button>
      </div>

      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h3>Active Pricing Plans</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Plan Name</th>
              <th>Monthly Price</th>
              <th>Yearly Price</th>
              <th>Features</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {plans.map(plan => (
              <tr key={plan.id}>
                {editingId === plan.id ? (
                  <>
                    <td><input type="text" className="admin-input" style={{padding: '4px 8px'}} value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} /></td>
                    <td><input type="text" className="admin-input" style={{padding: '4px 8px'}} value={editForm.monthly} onChange={e => setEditForm({...editForm, monthly: e.target.value})} /></td>
                    <td><input type="text" className="admin-input" style={{padding: '4px 8px'}} value={editForm.yearly} onChange={e => setEditForm({...editForm, yearly: e.target.value})} /></td>
                    <td><input type="text" className="admin-input" style={{padding: '4px 8px'}} value={editForm.features} onChange={e => setEditForm({...editForm, features: e.target.value})} /></td>
                    <td>
                      <div style={{display: 'flex', gap: '0.5rem'}}>
                        <button onClick={handleSave} style={{ color: '#059669', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Save</button>
                        <button onClick={() => setEditingId(null)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>Cancel</button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{plan.name}</td>
                    <td>{plan.monthly}</td>
                    <td>{plan.yearly}</td>
                    <td>{plan.features}</td>
                    <td><button onClick={() => handleEdit(plan)} style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}>Edit</button></td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="glass-card" style={{ padding: '2rem' }}>
        <h3>Coupon Codes</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          {['SAVE20', 'WELCOME50', 'PDFPRO', 'ELITEFALL'].map(code => (
            <div key={code} style={{ border: '2px dashed var(--border)', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--primary)' }}>{code}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Active - 15% Off</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ContentTab = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Updates');
  const [content, setContent] = useState('');
  const [keywords, setKeywords] = useState('');
  const [toolLink, setToolLink] = useState('merge');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?auto=format&fit=crop&q=80&w=800');

  useEffect(() => {
    setPosts(getPosts());
  }, []);

  const handlePublish = () => {
    if (!title || !content) return alert('Please fill in title and content');
    const newPost = { title, category, content, keywords, toolLink, image };
    const updated = savePost(newPost);
    setPosts(updated);
    setTitle('');
    setContent('');
    setKeywords('');
    alert('Post published successfully!');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      const updated = deletePost(id);
      setPosts(updated);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>Content Management</h2>
        <p style={{ color: 'var(--text-muted)' }}>Create blog posts and announcements for your users.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Create New Post</h3>
          <div className="admin-form-group">
            <label>Post Title</label>
            <input 
              type="text" 
              placeholder="Enter post title..." 
              className="admin-input" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="admin-form-group">
              <label>Category</label>
              <select className="admin-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option>Updates</option>
                <option>Tutorials</option>
                <option>Company News</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label>Target Tool Link</label>
              <select className="admin-input" value={toolLink} onChange={(e) => setToolLink(e.target.value)}>
                <option value="merge">Merge PDF</option>
                <option value="split">Split PDF</option>
                <option value="compress">Compress PDF</option>
                <option value="edit">Edit PDF</option>
                <option value="ocr">OCR Tool</option>
                <option value="word-pdf">Word to PDF</option>
              </select>
            </div>
          </div>
          <div className="admin-form-group">
            <label>SEO Keywords (comma separated)</label>
            <input 
              type="text" 
              placeholder="e.g. merge pdf, combine files..." 
              className="admin-input" 
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </div>
          <div className="admin-form-group">
            <label>Content (Markdown Supported)</label>
            <textarea 
              className="admin-input" 
              rows="10" 
              placeholder="Write your content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button className="btn-secondary" onClick={() => {setTitle(''); setContent('');}}>Clear</button>
            <button className="btn-primary" onClick={handlePublish}>Publish Post</button>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Recent Posts</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {posts.map(post => (
              <div key={post.id} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{post.title}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{post.date} • {post.category}</span>
                </div>
                <button 
                  onClick={() => handleDelete(post.id)}
                  style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const UsersTab = () => {
  const transactions = [];

  const handleDownloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(transactions);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    XLSX.writeFile(wb, "sales_data.xlsx");
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Sales & User Data", 14, 15);
    
    const tableColumn = ["Transaction ID", "User Email", "Plan", "Wallet", "Amount", "Date", "Status"];
    const tableRows = [];

    transactions.forEach(ticket => {
      const ticketData = [
        ticket.id,
        ticket.email,
        ticket.plan,
        ticket.wallet,
        ticket.amount,
        ticket.date,
        ticket.status
      ];
      tableRows.push(ticketData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save("sales_data.pdf");
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h2 style={{ marginBottom: '0.5rem' }}>Sales & User Data</h2>
          <p style={{ color: 'var(--text-muted)' }}>Track purchases and manage user subscriptions.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Search transactions..." className="admin-input" style={{ paddingLeft: '40px', width: '250px' }} />
          </div>
          <button className="btn-secondary" onClick={handleDownloadExcel} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '8px 16px' }}>
            <Download size={16} /> Excel
          </button>
          <button className="btn-secondary" onClick={handleDownloadPDF} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '8px 16px' }}>
            <Download size={16} /> PDF
          </button>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>User Email</th>
              <th>Plan</th>
              <th>Wallet</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(row => (
              <tr key={row.id}>
                <td style={{ fontWeight: 600 }}>{row.id}</td>
                <td>{row.email}</td>
                <td>{row.plan}</td>
                <td style={{ color: 'var(--primary)', fontWeight: 600 }}>{row.wallet}</td>
                <td>{row.amount}</td>
                <td>{row.date}</td>
                <td>
                  <span style={{ 
                    padding: '4px 10px', 
                    borderRadius: '20px', 
                    fontSize: '0.75rem', 
                    fontWeight: 600,
                    backgroundColor: row.status === 'Completed' ? '#05966915' : '#64748b15',
                    color: row.status === 'Completed' ? '#059669' : '#64748b'
                  }}>
                    {row.status}
                  </span>
                </td>
                <td>
                  {row.status !== 'Refunded' && (
                    <button style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>
                      <RotateCcw size={14} /> Refund
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <ShoppingBag size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
          <p>No transactions found</p>
        </div>
      </div>
    </div>
  );
};

const BalanceTab = () => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h2 style={{ marginBottom: '0.5rem' }}>Balance Check</h2>
          <p style={{ color: 'var(--text-muted)' }}>Monitor revenue and manage your payouts.</p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowUpRight size={18} /> Request Payout
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', color: 'var(--primary)' }}>
            <Wallet size={20} />
            <h4 style={{ margin: 0 }}>Available Balance</h4>
          </div>
          <h2 style={{ fontSize: '2.25rem', margin: 0 }}>$0.00</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>No balance available</p>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', color: '#d97706' }}>
            <Clock size={20} />
            <h4 style={{ margin: 0 }}>Pending Payouts</h4>
          </div>
          <h2 style={{ fontSize: '2.25rem', margin: 0 }}>$0.00</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>No pending payouts</p>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', color: '#6366f1' }}>
            <Banknote size={20} />
            <h4 style={{ margin: 0 }}>Lifetime Earnings</h4>
          </div>
          <h2 style={{ fontSize: '2.25rem', margin: 0 }}>$0.00</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>Since launch</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Earnings by Source</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[
              { name: 'Stripe (Subscriptions)', amount: '$0.00', color: '#6366f1' },
              { name: 'PayPal (One-time)', amount: '$0.00', color: '#2563eb' },
              { name: 'Google AdSense', amount: '$0.00', color: '#d97706' },
            ].map(source => (
              <div key={source.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: source.color }}></div>
                  <span style={{ fontSize: '0.95rem' }}>{source.name}</span>
                </div>
                <span style={{ fontWeight: 600 }}>{source.amount}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Withdrawal History</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="3" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No withdrawal history
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const SecurityTab = () => {
  return (
    <div style={{ maxWidth: '600px' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>Admin Security</h2>
        <p style={{ color: 'var(--text-muted)' }}>Manage your administrator credentials.</p>
      </div>

      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <UserCircle size={24} color="var(--primary)" />
          <h3 style={{ margin: 0 }}>Identity Settings</h3>
        </div>
        <div className="admin-form-group">
          <label>Administrator Username</label>
          <input type="text" defaultValue="AdminMaster" className="admin-input" />
        </div>
        <div className="admin-form-group">
          <label>Admin Email</label>
          <input type="email" defaultValue="admin@pdfmasterstool.online" className="admin-input" />
        </div>
        <button className="btn-secondary">Update Identity</button>
      </div>

      <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <Lock size={24} color="var(--primary)" />
          <h3 style={{ margin: 0 }}>Password Management</h3>
        </div>
        <div className="admin-form-group">
          <label>Current Password</label>
          <input type="password" placeholder="••••••••" className="admin-input" />
        </div>
        <div className="admin-form-group">
          <label>New Password</label>
          <input type="password" placeholder="••••••••" className="admin-input" />
        </div>
        <div className="admin-form-group">
          <label>Confirm New Password</label>
          <input type="password" placeholder="••••••••" className="admin-input" />
        </div>
        <button className="btn-primary">Update Secure Password</button>
      </div>
    </div>
  );
};

export default AdminDashboard;

