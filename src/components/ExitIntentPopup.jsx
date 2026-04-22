import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { track } from '../utils/tracking';

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const triggered = useRef(false);
  const navigate = useNavigate();
  const removeListenerRef = useRef(() => {});

  useEffect(() => {
    if (sessionStorage.getItem('exit_intent_shown')) return;

    const timer = setTimeout(() => {
      const handleMouseLeave = (e) => {
        if (e.clientY < 10 && !triggered.current) {
          triggered.current = true;
          setVisible(true);
          sessionStorage.setItem('exit_intent_shown', 'true');
          if (window.gtag) gtag('event', 'exit_intent_triggered', { event_category: 'engagement' });
        }
      };
      document.addEventListener('mouseleave', handleMouseLeave);
      removeListenerRef.current = () => document.removeEventListener('mouseleave', handleMouseLeave);
    }, 10000);

    return () => {
      clearTimeout(timer);
      removeListenerRef.current();
    };
  }, []);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)',
      zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: '#fff', borderRadius: '12px',
        padding: '40px', maxWidth: '440px', width: '90%',
        position: 'relative', textAlign: 'center'
      }}>
        <button onClick={() => setVisible(false)} style={{
          position: 'absolute', top: '16px', right: '20px',
          background: 'none', border: 'none', fontSize: '22px',
          cursor: 'pointer', color: '#666'
        }}>×</button>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', color: '#1a1612', marginBottom: '12px' }}>
          Get an instant estimate before you go
        </h2>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '28px' }}>
          Takes less than 2 minutes. No commitment required.
        </p>
        <button onClick={() => { track.quoteClick(); setVisible(false); navigate('/instant-quote'); }} style={{
          backgroundColor: '#c9a465', color: '#fff',
          border: 'none', padding: '14px 32px',
          borderRadius: '6px', cursor: 'pointer',
          fontSize: '15px', width: '100%', fontWeight: '600'
        }}>
          Get Instant Quote
        </button>
      </div>
    </div>
  );
}
