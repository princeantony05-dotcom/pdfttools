import { useState } from "react";
import { motion } from 'framer-motion';
import { Check, Zap, Shield, Crown, Star } from 'lucide-react';

const Pricing = ({ onSelectPlan }) => {
  const [isYearly, setIsYearly] = useState(true);

  const plans = [
    {
      name: 'Basic',
      price: '0',
      description: 'Perfect for quick, one-off PDF tasks.',
      icon: Zap,
      features: [
        '5 tools processing / day',
        'Max file size 50MB',
        'Standard processing speed',
        'Community support',
        '100% Private local processing'
      ],
      buttonText: 'Get Started',
      popular: false
    },
    {
      name: 'Pro',
      price: isYearly ? '99' : '9',
      description: 'The ultimate toolset for professionals.',
      icon: Crown,
      features: [
        'Unlimited tool usage',
        'Max file size 2GB',
        'Priority local processing',
        'Advanced OCR access',
        'Early access to new tools',
        '24/7 Priority support'
      ],
      buttonText: 'Upgrade to Pro',
      popular: true
    }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>Simple, Transparent <span style={{ color: 'var(--primary)' }}>Pricing</span></h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Choose the plan that fits your workflow. Save 20% with yearly billing.</p>
        
        {/* Toggle */}
        <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(0,0,0,0.05)', padding: '6px', borderRadius: '50px', gap: '4px' }}>
          <button 
            onClick={() => setIsYearly(false)}
            style={{ 
              padding: '10px 24px', 
              borderRadius: '50px', 
              border: 'none', 
              background: !isYearly ? 'white' : 'transparent', 
              color: !isYearly ? 'var(--text-main)' : 'var(--text-muted)',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: !isYearly ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            Monthly
          </button>
          <button 
            onClick={() => setIsYearly(true)}
            style={{ 
              padding: '10px 24px', 
              borderRadius: '50px', 
              border: 'none', 
              background: isYearly ? 'white' : 'transparent', 
              color: isYearly ? 'var(--text-main)' : 'var(--text-muted)',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: isYearly ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            Yearly <span style={{ fontSize: '0.7rem', backgroundColor: 'var(--primary)', color: 'white', padding: '2px 8px', borderRadius: '20px', marginLeft: '4px' }}>-20%</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {plans.map((plan, idx) => (
          <motion.div 
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card"
            style={{ 
              padding: '3rem 2.5rem', 
              position: 'relative',
              border: plan.popular ? '2px solid var(--primary)' : '1px solid var(--border)',
              transform: plan.popular ? 'scale(1.05)' : 'scale(1)',
              zIndex: plan.popular ? 1 : 0
            }}
          >
            {plan.popular && (
              <div style={{ 
                position: 'absolute', 
                top: '-15px', 
                left: '50%', 
                transform: 'translateX(-50%)', 
                backgroundColor: 'var(--primary)', 
                color: 'white', 
                padding: '6px 16px', 
                borderRadius: '50px', 
                fontSize: '0.8rem', 
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Star size={14} fill="currentColor" /> MOST POPULAR
              </div>
            )}

            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ color: plan.popular ? 'var(--primary)' : 'var(--text-muted)', marginBottom: '1.5rem' }}>
                <plan.icon size={40} />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{plan.name}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', minHeight: '40px' }}>{plan.description}</p>
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>${plan.price}</span>
                <span style={{ color: 'var(--text-muted)' }}>{plan.name === 'Basic' ? '' : isYearly ? '/yr' : '/mo'}</span>
              </div>
              {plan.name !== 'Basic' && isYearly && (
                <p style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600, marginTop: '4px' }}>Billed annually at ${plan.price}</p>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
              {plan.features.map(feature => (
                <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
                  <Check size={18} color="#059669" /> {feature}
                </div>
              ))}
            </div>

            <button 
              onClick={() => onSelectPlan(plan.name)}
              className={plan.popular ? 'btn-primary' : 'btn-secondary'}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', fontWeight: 700 }}
            >
              {plan.buttonText}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Comparison Text */}
      <div style={{ marginTop: '6rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>All plans include our 100% privacy guarantee. No data ever leaves your device.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginTop: '2rem' }}>
          <img src="https://img.shields.io/badge/SSL-Secure-059669" alt="Secure" />
          <img src="https://img.shields.io/badge/GDPR-Compliant-2563eb" alt="GDPR" />
          <img src="https://img.shields.io/badge/WASM-Powered-6366f1" alt="WASM" />
        </div>
      </div>
    </div>
  );
};

export default Pricing;

