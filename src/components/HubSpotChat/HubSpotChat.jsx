import { useEffect } from 'react';

const HubSpotChat = () => {
  useEffect(() => {
    // Create and load HubSpot script
    const script = document.createElement('script');
    script.src = '//js-na1.hs-scripts.com/49336664.js';
    script.async = true;
    script.defer = true;
    script.type = 'text/javascript';
    script.id = 'hs-script-loader';
    
    // Add script to document
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      const existingScript = document.getElementById('hs-script-loader');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return null;
};

export default HubSpotChat;
