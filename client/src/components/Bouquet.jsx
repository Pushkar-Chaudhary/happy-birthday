const OFFSETS = [
  { x: 38, y: 18, r: -8, s: 0.95 },
  { x: 18, y: 38, r: -18, s: 1 },
  { x: 58, y: 36, r: 16, s: 1 },
  { x: 8, y: 58, r: -26, s: 0.88 },
  { x: 70, y: 56, r: 24, s: 0.88 },
  { x: 28, y: 62, r: -6, s: 0.96 },
  { x: 50, y: 64, r: 8, s: 0.96 },
  { x: 38, y: 78, r: 0, s: 0.9 },
  { x: 16, y: 78, r: -14, s: 0.85 },
  { x: 62, y: 78, r: 14, s: 0.85 },
  { x: 38, y: 4, r: 4, s: 0.86 },
  { x: 22, y: 16, r: -10, s: 0.9 },
];

function Rose() {
  return (
    <svg viewBox="0 0 100 100">
      <path d="M50 50 Q50 90 48 95" stroke="#2e7d32" strokeWidth="3.5" fill="none" />
      <path d="M50 70 Q30 65 35 70 Q45 80 50 78" fill="#1b5e20" />
      <circle cx="50" cy="40" r="22" fill="#c62828" />
      <path d="M38 35 C32 25, 48 18, 50 25 C52 18, 68 25, 62 35 C56 42, 44 42, 38 35 Z" fill="#b71c1c" />
      <circle cx="50" cy="30" r="5" fill="#880e4f" />
    </svg>
  );
}

function Tulip() {
  return (
    <svg viewBox="0 0 100 100">
      <path d="M50 50 Q50 90 52 95" stroke="#2e7d32" strokeWidth="3.5" fill="none" />
      <path d="M50 50 C30 50, 35 25, 50 15 C65 25, 70 50, 50 50 Z" fill="#ec407a" />
      <path d="M50 50 C40 50, 38 28, 48 18 C58 28, 60 50, 50 50 Z" fill="#f48fb1" />
    </svg>
  );
}

function Daisy() {
  return (
    <svg viewBox="0 0 100 100">
      <path d="M50 55 Q50 92 50 96" stroke="#2e7d32" strokeWidth="3" fill="none" />
      {Array.from({ length: 10 }).map((_, i) => (
        <ellipse key={i} cx="50" cy="22" rx="7" ry="18" fill="#fff8e7" stroke="#f5e6c8" transform={`rotate(${i * 36} 50 42)`} />
      ))}
      <circle cx="50" cy="42" r="12" fill="#f4c430" />
    </svg>
  );
}

function Sunflower() {
  return (
    <svg viewBox="0 0 100 100">
      <path d="M50 50 Q50 90 46 95" stroke="#2e7d32" strokeWidth="4" fill="none" />
      {Array.from({ length: 12 }).map((_, i) => (
        <ellipse key={i} cx="50" cy="22" rx="6" ry="18" fill="#ffeb3b" stroke="#fbc02d" transform={`rotate(${i * 30} 50 50)`} />
      ))}
      <circle cx="50" cy="50" r="16" fill="#4e342e" />
    </svg>
  );
}

function Lily() {
  return (
    <svg viewBox="0 0 100 100">
      <path d="M50 50 Q50 90 50 95" stroke="#2e7d32" strokeWidth="2.5" fill="none" />
      <path d="M50 45 C45 35, 30 20, 50 8 C70 20, 55 35, 50 45 Z" fill="#f5f5f5" />
      <path d="M50 45 C35 45, 18 32, 8 50 C22 66, 38 52, 50 45 Z" fill="#eee" />
      <path d="M50 45 C65 45, 82 32, 92 50 C78 66, 62 52, 50 45 Z" fill="#eee" />
      <circle cx="50" cy="45" r="3" fill="#ffb300" />
    </svg>
  );
}

const FLOWERS = { rose: Rose, tulip: Tulip, daisy: Daisy, sunflower: Sunflower, lily: Lily };

export function FlowerMark({ type, className = '' }) {
  const El = FLOWERS[type] || Rose;
  return (
    <span className={`flower-mark ${className}`}>
      <El />
    </span>
  );
}

export default function Bouquet({ bouquet, size = 220 }) {
  const wrap = bouquet?.wrapping;
  const ribbon = bouquet?.ribbon;
  const wraps = { kraft: '#c8ad7f', emerald: '#0f6139', velvet: '#1d1b4c', rosegold: '#d4908a' };
  const ribbons = { pink: '#ff8fa3', gold: '#d4af37', crimson: '#bd081c', navy: '#0d47a1' };
  const wrapColor = wraps[wrap] || wraps.kraft;
  const ribColor = ribbons[ribbon] || ribbons.pink;

  const items = Object.entries(bouquet?.flowers || {})
    .flatMap(([type, n]) => Array(Math.max(0, n)).fill(type))
    .slice(0, OFFSETS.length);

  return (
    <div className="bouquet" style={{ width: size, height: size * 1.22 }}>
      <svg className="bouquet-layer" viewBox="0 0 200 250">
        <path d="M100 250 L10 80 Q10 40 100 35 Q190 40 190 80 Z" fill={wrapColor} />
      </svg>
      <div className="bouquet-pile">
        {items.map((type, i) => {
          const o = OFFSETS[i];
          const El = FLOWERS[type] || Rose;
          return (
            <div
              key={`${type}-${i}`}
              className="bouquet-flower"
              style={{ left: `${o.x}%`, top: `${o.y}%`, transform: `rotate(${o.r}deg) scale(${o.s})`, animationDelay: `${i * 0.08}s` }}
            >
              <El />
            </div>
          );
        })}
      </div>
      <svg className="bouquet-layer" viewBox="0 0 200 250">
        <path d="M10 80 L100 250 L75 130 Z" fill={wrapColor} opacity="0.92" />
        <path d="M190 80 L100 250 L125 130 Z" fill={wrapColor} opacity="0.78" />
        <path d="M100 250 L10 80 Q30 75 100 120" fill="rgba(0,0,0,0.12)" />
        <path d="M100 250 L190 80 Q170 75 100 120" fill="rgba(0,0,0,0.16)" />
      </svg>
      <svg className="bouquet-layer" viewBox="0 0 200 250">
        <ellipse cx="100" cy="180" rx="10" ry="8" fill={ribColor} />
        <path d="M100 180 C80 160 50 165 65 185 C80 205 95 185 100 180 Z" fill={ribColor} />
        <path d="M100 180 C120 160 150 165 135 185 C120 205 105 185 100 180 Z" fill={ribColor} />
        <path d="M100 180 L75 220 L85 220 Z" fill={ribColor} />
        <path d="M100 180 L125 220 L115 220 Z" fill={ribColor} />
      </svg>
    </div>
  );
}
