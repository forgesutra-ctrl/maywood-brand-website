import { useState, useEffect, useRef } from 'react';
import { track } from '../utils/tracking';

export default function WhatsAppAutoPrompt() {
  const [visible, setVisible] = useState(false);
  const hideTimerRef = useRef(null);

  useEffect(() => {
    if (sessionStorage.getItem('wa_prompt_shown')) return;
    const showTimer = setTimeout(() => {
      setVisible(true);
      sessionStorage.setItem('wa_prompt_shown', 'true');
      hideTimerRef.current = setTimeout(() => setVisible(false), 8000);
    }, 25000);
    return () => {
      clearTimeout(showTimer);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <a href="https://wa.me/919606977677" target="_blank" rel="noreferrer"
      onClick={() => { track.whatsappClick(); setVisible(false); }}
      style={{
        position: 'fixed', bottom: '90px', right: '20px',
        backgroundColor: '#1a1612', color: '#fff',
        padding: '10px 16px', borderRadius: '8px',
        fontSize: '13px', zIndex: 998, textDecoration: 'none',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        maxWidth: '220px', lineHeight: '1.4'
      }}>
      💬 Need help estimating your interiors?
      <div style={{
        position: 'absolute', bottom: '-8px', right: '20px',
        width: 0, height: 0,
        borderLeft: '8px solid transparent',
        borderRight: '8px solid transparent',
        borderTop: '8px solid #1a1612'
      }} />
    </a>
  );
}
