// Test comment

const AdPlaceholder = ({ type = 'leaderboard', style = {} }) => {
  const getDimensions = () => {
    switch (type) {
      case 'leaderboard': return { width: '100%', height: '120px' };
      case 'sidebar': return { width: '300px', height: '600px' };
      case 'square': return { width: '300px', height: '250px' };
      case 'banner': return { width: '100%', height: '90px' };
      default: return { width: '100%', height: '100px' };
    }
  };

  const { width, height } = getDimensions();

  return (
    <div 
      style={{ 
        width, 
        height, 
        backgroundColor: 'rgba(0, 0, 0, 0.02)', 
        border: '1px dashed var(--border)', 
        borderRadius: '16px', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        margin: '1.5rem auto',
        overflow: 'hidden',
        position: 'relative',
        ...style 
      }}
    >
      <span style={{ 
        position: 'absolute', 
        top: '8px', 
        left: '12px', 
        fontSize: '0.65rem', 
        color: 'var(--text-muted)', 
        textTransform: 'uppercase', 
        letterSpacing: '1px',
        fontWeight: 600
      }}>
        Advertisement
      </span>
      <div style={{ color: 'var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>
          {type.charAt(0).toUpperCase() + type.slice(1)} Ad Slot
        </div>
        <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>
          {width} x {height}
        </div>
      </div>
      
      {/* Decorative pulse for visualization */}
      <div style={{ 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        height: '2px', 
        background: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
        opacity: 0.3
      }}></div>
    </div>
  );
};

export default AdPlaceholder;

