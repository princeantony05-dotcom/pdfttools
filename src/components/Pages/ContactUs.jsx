import { Mail, MessageSquare, Globe, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const ContactUs = () => {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 0' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '4rem' }}
      >
        <div style={{ display: 'inline-flex', padding: '1rem', backgroundColor: 'rgba(37, 99, 235, 0.1)', borderRadius: '20px', color: 'var(--primary)', marginBottom: '1.5rem' }}>
          <Mail size={48} />
        </div>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Contact Us</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Have a question or feedback? We'd love to hear from you.</p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
        <div>
          <h2 style={{ marginBottom: '1.5rem' }}>Get in Touch</h2>
          <p style={{ marginBottom: '2rem' }}>Whether you have a feature request, found a bug, or just want to say hi, our team is ready to help.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: '#f8fafc', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <Mail size={20} />
              </div>
              <div>
                <h5 style={{ margin: 0 }}>Email</h5>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>support@pdfelite.app</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: '#f8fafc', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <MessageSquare size={20} />
              </div>
              <div>
                <h5 style={{ margin: 0 }}>Social</h5>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>@PDFEliteTools on X</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: '#f8fafc', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <Globe size={20} />
              </div>
              <div>
                <h5 style={{ margin: 0 }}>Office</h5>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>Digital Nomad HQ, Web 3.0</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Send a Message</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Name</label>
              <input type="text" placeholder="Your Name" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: '#f8fafc' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Email</label>
              <input type="email" placeholder="your@email.com" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: '#f8fafc' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Message</label>
              <textarea placeholder="How can we help?" rows="4" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: '#f8fafc', resize: 'none' }}></textarea>
            </div>
            <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
              Send Message <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

