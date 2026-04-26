import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  MessageSquare, 
  HelpCircle, 
  Send, 
  Phone, 
  Globe, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const Support = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>How can we help?</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Get in touch with our expert support team or explore our resources.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
        {/* Contact Form */}
        <div className="glass-card" style={{ padding: '3rem' }}>
          {submitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: 'center', padding: '2rem 0' }}
            >
              <div style={{ backgroundColor: '#10b98115', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#10b981' }}>
                <CheckCircle2 size={32} />
              </div>
              <h3>Message Sent!</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>We've received your request and will get back to you within 24 hours.</p>
              <button 
                onClick={() => setSubmitted(false)}
                className="btn-secondary" 
                style={{ marginTop: '2rem' }}
              >
                Send Another Message
              </button>
            </motion.div>
          ) : (
            <>
              <h3 style={{ marginBottom: '2rem' }}>Send us a message</h3>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="admin-form-group">
                  <label>Your Name</label>
                  <input type="text" placeholder="John Doe" className="admin-input" required />
                </div>
                <div className="admin-form-group">
                  <label>Email Address</label>
                  <input type="email" placeholder="john@example.com" className="admin-input" required />
                </div>
                <div className="admin-form-group">
                  <label>Topic</label>
                  <select className="admin-input">
                    <option>General Inquiry</option>
                    <option>Technical Issue</option>
                    <option>Billing & Payment</option>
                    <option>Feature Request</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Message</label>
                  <textarea placeholder="Tell us more about how we can help..." className="admin-input" rows="5" required></textarea>
                </div>
                <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <Send size={18} /> Send Message
                </button>
              </form>
            </>
          )}
        </div>

        {/* Info & FAQs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Support Channels</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1.25rem' }}>
                <div style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', padding: '10px', borderRadius: '12px', color: 'var(--primary)', height: 'fit-content' }}>
                  <Mail size={24} />
                </div>
                <div>
                  <h4 style={{ margin: 0 }}>Email Support</h4>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem' }}>support@pdfelite.app</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1.25rem' }}>
                <div style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', padding: '10px', borderRadius: '12px', color: 'var(--primary)', height: 'fit-content' }}>
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h4 style={{ margin: 0 }}>Live Chat</h4>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem' }}>Available Mon-Fri, 9am - 6pm EST</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1.25rem' }}>
                <div style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', padding: '10px', borderRadius: '12px', color: 'var(--primary)', height: 'fit-content' }}>
                  <Phone size={24} />
                </div>
                <div>
                  <h4 style={{ margin: 0 }}>Phone Support</h4>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem' }}>+1 (800) PDF-ELITE (Pro Only)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '2rem', background: 'var(--secondary)', color: 'white' }}>
            <h3 style={{ color: 'white', marginBottom: '1rem' }}>Frequently Asked Questions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                "Is my data safe during processing?",
                "How do I cancel my subscription?",
                "Can I use PDFElite offline?",
                "What file formats are supported?"
              ].map((q, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', cursor: 'pointer', opacity: 0.8 }}>
                  <HelpCircle size={16} /> {q}
                </div>
              ))}
            </div>
            <button style={{ width: '100%', marginTop: '1.5rem', background: 'rgba(255,255,255,0.1)', color: 'white', padding: '10px', borderRadius: '10px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              Browse Help Center <Globe size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
