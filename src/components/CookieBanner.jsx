import { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('cookie_consent')) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      backgroundColor: '#1a1612', color: '#fff',
      padding: '16px 24px', zIndex: 999,
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px'
    }}>
      <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
        We use cookies to improve your experience.
      </p>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={accept} style={{
          backgroundColor: '#c9a465', color: '#fff',
          border: 'none', padding: '8px 20px',
          borderRadius: '4px', cursor: 'pointer', fontSize: '13px'
        }}>Accept</button>
        <button onClick={() => setVisible(false)} style={{
          backgroundColor: 'transparent', color: '#c9a465',
          border: '1px solid #c9a465', padding: '8px 20px',
          borderRadius: '4px', cursor: 'pointer', fontSize: '13px'
        }}>Manage</button>
      </div>
    </div>
  );
}
