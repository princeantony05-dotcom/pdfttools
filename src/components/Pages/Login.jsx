import { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, UserPlus, Mail, Lock, AlertCircle, ShieldCheck, User } from 'lucide-react';
import { authenticateUser, registerUser, checkEmailExists } from "../../utils/userStore";

const Login = ({ onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (isSignUp) {
        // Sign Up Logic
        if (checkEmailExists(email)) {
          setError('This email is already registered. Please sign in or use a different email.');
          setLoading(false);
          return;
        }
        
        const result = registerUser(name, email, password);
        if (result.success) {
          onLoginSuccess('user');
        } else {
          setError(result.message);
        }
      } else {
        // Login Logic
        const result = authenticateUser(email, password);
        if (result.success) {
          onLoginSuccess(result.user.role);
        } else {
          setError(result.message + '. Hint: admin@pdfelite.app / admin123');
        }
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div style={{ maxWidth: '450px', margin: '4rem auto', padding: '0 1rem' }}>
      <motion.div 
        className="glass-card" 
        style={{ padding: '3rem' }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isSignUp ? 'signup-header' : 'login-header'}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{ textAlign: 'center', marginBottom: '2rem' }}
          >
            <div style={{ 
              backgroundColor: 'rgba(37, 99, 235, 0.1)', 
              width: '64px', 
              height: '64px', 
              borderRadius: '16px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 1rem',
              color: 'var(--primary)'
            }}>
              {isSignUp ? <UserPlus size={32} /> : <LogIn size={32} />}
            </div>
            <h2 style={{ marginBottom: '0.5rem' }}>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {isSignUp ? 'Join PDFElite to manage your documents' : 'Log in to access your dashboard'}
            </p>
          </motion.div>
        </AnimatePresence>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ 
              backgroundColor: 'rgba(239, 68, 68, 0.1)', 
              color: '#ef4444', 
              padding: '1rem', 
              borderRadius: '12px', 
              fontSize: '0.85rem', 
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
          >
            <AlertCircle size={18} /> {error}
          </motion.div>
        )}

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <AnimatePresence mode="popLayout">
            {isSignUp && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ position: 'relative' }}
              >
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={isSignUp}
                    style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '10px', border: '1px solid var(--border)', background: '#f8fafc', fontSize: '0.95rem' }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ position: 'relative' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '10px', border: '1px solid var(--border)', background: '#f8fafc', fontSize: '0.95rem' }}
              />
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '10px', border: '1px solid var(--border)', background: '#f8fafc', fontSize: '0.95rem' }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading}
            style={{ width: '100%', height: '48px', marginTop: '1rem' }}
          >
            {loading ? (isSignUp ? 'Creating Account...' : 'Authenticating...') : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"} 
            <span 
              onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
              style={{ color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', marginLeft: '0.5rem' }}
            >
              {isSignUp ? 'Sign In' : 'Sign up'}
            </span>
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            <ShieldCheck size={14} /> Secured by PDFElite Auth
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
