import { useEffect, useRef } from 'react';
import { track } from '../utils/tracking';

export default function ScrollTracker() {
  const fired50 = useRef(false);
  const fired75 = useRef(false);
  const fired30s = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!fired30s.current) {
        track.engaged30s();
        fired30s.current = true;
      }
    }, 30000);

    const handleScroll = () => {
      const scrolled = window.scrollY;
      const total = document.body.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      const pct = (scrolled / total) * 100;

      if (pct >= 50 && !fired50.current) {
        track.scroll50();
        fired50.current = true;
      }
      if (pct >= 75 && !fired75.current) {
        track.scroll75();
        fired75.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  return null;
}
