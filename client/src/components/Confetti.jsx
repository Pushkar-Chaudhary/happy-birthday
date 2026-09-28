import { useEffect, useRef } from 'react';

const COLORS = ['#ff6b9d', '#a78bfa', '#fbbf24', '#34d399', '#60a5fa', '#f87171', '#fb923c', '#e879f9'];
const SHAPES = ['circle', 'rect', 'star'];

export default function Confetti({ active }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!active || !ref.current) return;
    const container = ref.current;
    container.innerHTML = '';
    const pieces = document.createDocumentFragment();

    for (let i = 0; i < 90; i++) {
      const el = document.createElement('div');
      const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      const size = Math.random() * 10 + 6;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const delay = Math.random() * 2.5;
      const duration = Math.random() * 1.8 + 1.8;
      const left = Math.random() * 100;

      el.style.cssText = `
        position: fixed;
        left: ${left}vw;
        top: -20px;
        width: ${shape === 'circle' ? size : size * 0.8}px;
        height: ${shape === 'circle' ? size : size * 1.4}px;
        background: ${color};
        border-radius: ${shape === 'circle' ? '50%' : shape === 'rect' ? '2px' : '0'};
        z-index: 9999;
        pointer-events: none;
        animation: confetti-fall ${duration}s ${delay}s ease-in forwards;
        transform: rotate(${Math.random() * 360}deg);
        opacity: 0.9;
        clip-path: ${shape === 'star' ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' : 'none'};
      `;
      pieces.appendChild(el);
    }
    container.appendChild(pieces);

    const timer = setTimeout(() => { container.innerHTML = ''; }, 5000);
    return () => { clearTimeout(timer); container.innerHTML = ''; };
  }, [active]);

  return <div ref={ref} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }} />;
}
