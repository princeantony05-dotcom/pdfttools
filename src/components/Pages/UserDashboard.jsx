import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  CreditCard, 
  History, 
  LifeBuoy, 
  Settings, 
  LogOut, 
  ChevronRight, 
  ShieldCheck, 
  Calendar, 
  ExternalLink,
  MessageSquare,
  PlusCircle,
  AlertCircle,
  Lock,
  Key
} from 'lucide-react';
import { getUserData, updateProfile, addSupportTicket, changePassword } from '../../utils/userStore';

const UserDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    setUserData(getUserData());
  }, []);

  if (!userData) return null;

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return <ProfileTab userData={userData} setUserData={setUserData} />;
      case 'subscription': return <SubscriptionTab userData={userData} />;
      case 'purchases': return <PurchasesTab userData={userData} />;
      case 'security': return <SecurityTab userData={userData} />;
      case 'support': return <SupportTab userData={userData} setUserData={setUserData} />;
      default: return <ProfileTab userData={userData} />;
    }
  };

  const navItems = [
    { id: 'profile', name: 'My Profile', icon: User },
    { id: 'subscription', name: 'Subscription', icon: CreditCard },
    { id: 'purchases', name: 'Purchase History', icon: History },
    { id: 'security', name: 'Security', icon: Lock },
    { id: 'support', name: 'Customer Support', icon: LifeBuoy },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 0' }}>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {/* Sidebar Nav */}
        <aside style={{ width: '280px', flexShrink: 0 }}>
          <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
            <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 1rem' }}>
              <img src={userData.profile.avatar} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
              <div style={{ position: 'absolute', bottom: 0, right: 0, background: '#10b981', width: '16px', height: '16px', borderRadius: '50%', border: '2px solid white' }}></div>
            </div>
            <h3 style={{ margin: 0 }}>{userData.profile.name}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{userData.profile.email}</p>
          </div>

          <div className="glass-card" style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {navItems.map(item => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem', 
                  padding: '12px 16px', 
                  borderRadius: '12px', 
                  background: activeTab === item.id ? 'var(--primary)' : 'transparent',
                  color: activeTab === item.id ? 'white' : 'var(--text-main)',
                  width: '100%',
                  textAlign: 'left',
                  fontWeight: 500,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <item.icon size={20} />
                {item.name}
              </button>
            ))}
            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0.5rem 0' }} />
            <button 
              onClick={onLogout}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem', 
                padding: '12px 16px', 
                borderRadius: '12px', 
                color: '#ef4444',
                width: '100%',
                textAlign: 'left',
                fontWeight: 500,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main style={{ flex: 1, minWidth: '300px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
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

const ProfileTab = ({ userData, setUserData }) => {
  const [name, setName] = useState(userData.profile.name);
  const [email, setEmail] = useState(userData.profile.email);

  const handleUpdate = (e) => {
    e.preventDefault();
    const updated = updateProfile({ name, email });
    setUserData(updated);
    alert('Profile updated successfully!');
  };

  return (
    <div className="glass-card" style={{ padding: '2.5rem' }}>
      <h2 style={{ marginBottom: '2rem' }}>Account Settings</h2>
      
      <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '500px' }}>
        <div className="admin-form-group">
          <label>Full Name</label>
          <input 
            type="text" 
            className="admin-input" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
        </div>
        <div className="admin-form-group">
          <label>Email Address</label>
          <input 
            type="email" 
            className="admin-input" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button type="submit" className="btn-primary">Save Changes</button>
          <button type="button" className="btn-secondary" onClick={() => {setName(userData.profile.name); setEmail(userData.profile.email);}}>Reset</button>
        </div>
      </form>

      <div style={{ marginTop: '4rem', padding: '1.5rem', borderRadius: '16px', backgroundColor: 'rgba(37, 99, 235, 0.03)', border: '1px solid var(--border)' }}>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <ShieldCheck size={18} color="var(--primary)" /> Data Privacy
        </h4>
        <p style={{ fontSize: '0.85rem', margin: 0 }}>Your data is processed securely. We never share your personal information or files with third parties.</p>
      </div>
    </div>
  );
};

const SecurityTab = ({ userData }) => {
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState('');

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setError('');

    if (newPass !== confirmPass) {
      setError('New passwords do not match');
      return;
    }

    if (newPass.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    const result = changePassword(userData.profile.email, newPass);
    if (result.success) {
      alert('Password updated successfully!');
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="glass-card" style={{ padding: '2.5rem' }}>
      <h2 style={{ marginBottom: '2rem' }}>Security & Privacy</h2>
      
      <div style={{ maxWidth: '500px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Key size={18} color="var(--primary)" /> Change Password
        </h3>

        {error && (
          <div style={{ backgroundColor: '#ef444415', color: '#ef4444', padding: '1rem', borderRadius: '12px', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="admin-form-group">
            <label>Current Password</label>
            <input 
              type="password" 
              className="admin-input" 
              value={currentPass} 
              onChange={(e) => setCurrentPass(e.target.value)} 
              required
            />
          </div>
          <div className="admin-form-group">
            <label>New Password</label>
            <input 
              type="password" 
              className="admin-input" 
              value={newPass} 
              onChange={(e) => setNewPass(e.target.value)} 
              required
            />
          </div>
          <div className="admin-form-group">
            <label>Confirm New Password</label>
            <input 
              type="password" 
              className="admin-input" 
              value={confirmPass} 
              onChange={(e) => setConfirmPass(e.target.value)} 
              required
            />
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>Update Password</button>
        </form>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '3rem 0' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ margin: 0 }}>Two-Factor Authentication</h4>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Add an extra layer of security to your account.</p>
          </div>
          <button className="btn-secondary" style={{ fontSize: '0.85rem' }}>Enable</button>
        </div>
      </div>
    </div>
  );
};

const SubscriptionTab = ({ userData }) => {
  const sub = userData.subscription;
  const isExpired = new Date(sub.expiryDate) < new Date();

  return (
    <div>
      <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <span style={{ 
              padding: '4px 12px', 
              borderRadius: '20px', 
              fontSize: '0.75rem', 
              fontWeight: 700, 
              backgroundColor: isExpired ? '#ef444415' : '#10b98115', 
              color: isExpired ? '#ef4444' : '#10b981',
              marginBottom: '1rem',
              display: 'inline-block'
            }}>
              {isExpired ? 'EXPIRED' : sub.status.toUpperCase()}
            </span>
            <h2 style={{ margin: 0 }}>{sub.plan}</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Billed annually at {sub.price}</p>
          </div>
          <CreditCard size={48} color="var(--primary)" style={{ opacity: 0.2 }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', padding: '10px', borderRadius: '10px' }}>
              <Calendar size={20} color="var(--primary)" />
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', margin: 0, fontWeight: 600 }}>NEXT RENEWAL</p>
              <h4 style={{ margin: 0 }}>{sub.expiryDate}</h4>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', padding: '10px', borderRadius: '10px' }}>
              <ShieldCheck size={20} color="var(--primary)" />
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', margin: 0, fontWeight: 600 }}>AUTO RENEW</p>
              <h4 style={{ margin: 0 }}>{sub.autoRenew ? 'Enabled' : 'Disabled'}</h4>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Renew Subscription <ChevronRight size={18} />
          </button>
          <button className="btn-secondary">Cancel Plan</button>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '2rem' }}>
        <h3>Need to change your plan?</h3>
        <p style={{ fontSize: '0.95rem' }}>Switching plans is easy and your balance will be automatically adjusted.</p>
        <button style={{ color: 'var(--primary)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
          View all plans <ExternalLink size={16} />
        </button>
      </div>
    </div>
  );
};

const PurchasesTab = ({ userData }) => {
  return (
    <div className="glass-card" style={{ padding: '2.5rem' }}>
      <h2 style={{ marginBottom: '2rem' }}>Purchase History</h2>
      
      <div style={{ overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Item</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Invoice</th>
            </tr>
          </thead>
          <tbody>
            {userData.purchases && userData.purchases.length > 0 ? userData.purchases.map(pur => (
              <tr key={pur.id}>
                <td style={{ fontWeight: 600 }}>{pur.id}</td>
                <td>{pur.item}</td>
                <td>{pur.date}</td>
                <td>{pur.amount}</td>
                <td>
                  <span style={{ 
                    padding: '4px 10px', 
                    borderRadius: '20px', 
                    fontSize: '0.75rem', 
                    fontWeight: 600,
                    backgroundColor: '#10b98115',
                    color: '#10b981'
                  }}>
                    {pur.status}
                  </span>
                </td>
                <td>
                  <button style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <History size={14} /> Download
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No purchases found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SupportTab = ({ userData, setUserData }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject || !message) return;
    const updated = addSupportTicket({ subject, message });
    setUserData(updated);
    setSubject('');
    setMessage('');
    alert('Support ticket created! We will get back to you soon.');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
      <div className="glass-card" style={{ padding: '2.5rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Open a Ticket</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="admin-form-group">
            <label>Subject</label>
            <input 
              type="text" 
              className="admin-input" 
              placeholder="How can we help?"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="admin-form-group">
            <label>Message</label>
            <textarea 
              className="admin-input" 
              rows="6" 
              placeholder="Describe your issue in detail..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>
          <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <PlusCircle size={20} /> Submit Ticket
          </button>
        </form>
      </div>

      <div>
        <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Recent Tickets</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {userData.supportTickets && userData.supportTickets.length > 0 ? userData.supportTickets.map(tkt => (
              <div key={tkt.id} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{tkt.id}</span>
                  <span style={{ 
                    fontSize: '0.7rem', 
                    padding: '2px 8px', 
                    borderRadius: '10px',
                    backgroundColor: tkt.status === 'Open' ? '#2563eb15' : '#64748b15',
                    color: tkt.status === 'Open' ? 'var(--primary)' : 'var(--text-muted)'
                  }}>{tkt.status}</span>
                </div>
                <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.95rem' }}>{tkt.subject}</h4>
                <p style={{ margin: 0, fontSize: '0.75rem' }}>{tkt.date}</p>
              </div>
            )) : (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>No recent tickets</p>
            )}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '2rem', backgroundColor: 'var(--secondary)', color: 'white' }}>
          <h3 style={{ color: 'white', marginBottom: '1rem' }}>Quick Assistance</h3>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Average response time: 2-4 hours.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
              <MessageSquare size={18} /> Live Chat (Pro Only)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
              <AlertCircle size={18} /> Help Center & FAQs
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
