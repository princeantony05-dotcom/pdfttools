import { CheckCircle, HelpCircle, ShieldCheck, Zap } from 'lucide-react';
import AdPlaceholder from './AdPlaceholder';
import { useLanguage } from '../../context/LanguageContext';

const HomeContent = () => {
  const { t } = useLanguage();
  return (
    <div style={{ marginTop: '6rem', borderTop: '1px solid var(--border)', paddingTop: '4rem' }}>
      {/* Why Section */}
      <section style={{ marginBottom: '5rem' }}>
        <h2 style={{ fontSize: '2.25rem', textAlign: 'center', marginBottom: '3rem' }}>{t('homeContent.whyTitle')} <span style={{ color: 'var(--primary)' }}>{t('homeContent.whyTitleHighlight')}</span>?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <ShieldCheck color="var(--primary)" /> {t('homeContent.whyPrivateTitle')}
            </h3>
            <p>{t('homeContent.whyPrivateDesc')}</p>
          </div>
          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <Zap color="var(--primary)" size={20} /> {t('homeContent.whyFastTitle')}
            </h3>
            <p>{t('homeContent.whyFastDesc')}</p>
          </div>
          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <CheckCircle color="var(--primary)" /> {t('homeContent.whyQualityTitle')}
            </h3>
            <p>{t('homeContent.whyQualityDesc')}</p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section style={{ marginBottom: '5rem', backgroundColor: 'rgba(37, 99, 235, 0.02)', padding: '4rem', borderRadius: '32px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>{t('homeContent.howTitle')}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 'bold' }}>1</div>
            <div>
              <h4>{t('homeContent.how1Title')}</h4>
              <p>{t('homeContent.how1Desc')}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 'bold' }}>2</div>
            <div>
              <h4>{t('homeContent.how2Title')}</h4>
              <p>{t('homeContent.how2Desc')}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 'bold' }}>3</div>
            <div>
              <h4>{t('homeContent.how3Title')}</h4>
              <p>{t('homeContent.how3Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      <AdPlaceholder type="banner" />

      {/* FAQ Section */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <HelpCircle color="var(--primary)" /> {t('homeContent.faqTitle')}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h4 style={{ marginBottom: '0.75rem' }}>{t('homeContent.faq1Title')}</h4>
            <p style={{ fontSize: '0.95rem' }}>{t('homeContent.faq1Desc')}</p>
          </div>
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h4 style={{ marginBottom: '0.75rem' }}>{t('homeContent.faq2Title')}</h4>
            <p style={{ fontSize: '0.95rem' }}>{t('homeContent.faq2Desc')}</p>
          </div>
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h4 style={{ marginBottom: '0.75rem' }}>{t('homeContent.faq3Title')}</h4>
            <p style={{ fontSize: '0.95rem' }}>{t('homeContent.faq3Desc')}</p>
          </div>
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h4 style={{ marginBottom: '0.75rem' }}>{t('homeContent.faq4Title')}</h4>
            <p style={{ fontSize: '0.95rem' }}>{t('homeContent.faq4Desc')}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeContent;

