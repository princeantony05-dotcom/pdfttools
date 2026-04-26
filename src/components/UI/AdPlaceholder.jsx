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
      className="adsbygoogle-container"
      style={{ 
        width, 
        height, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        margin: '1.5rem auto',
        overflow: 'hidden',
        position: 'relative',
        ...style 
      }}
    >
      {/* 
        This is a container for Google AdSense. 
        It is intentionally left blank so that it is invisible until an ad is injected.
      */}
      <ins 
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', height: '100%' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Should be updated by admin
        data-ad-slot="XXXXXXXXXX"        // Should be updated by admin
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default AdPlaceholder;

