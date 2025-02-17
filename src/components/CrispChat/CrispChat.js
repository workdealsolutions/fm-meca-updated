import { useEffect } from 'react';

const CrispChat = () => {
  useEffect(() => {
    // Initialize Crisp
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = "YOUR_WEBSITE_ID"; // Replace with your Crisp Website ID
    
    // Load Crisp script
    (function() {
      const d = document;
      const s = d.createElement("script");
      s.src = "https://client.crisp.chat/l.js";
      s.async = 1;
      d.getElementsByTagName("head")[0].appendChild(s);
    })();
  }, []);

  return null;
};

export default CrispChat;
