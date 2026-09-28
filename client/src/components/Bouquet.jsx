const OFFSETS = [
  { x: 27, y: 0, r: -8, s: 0.88 },
  { x: 8, y: 14, r: -18, s: 0.92 },
  { x: 47, y: 13, r: 16, s: 0.94 },
  { x: 29, y: 19, r: 4, s: 1 },
  { x: 0, y: 30, r: -26, s: 0.88 },
  { x: 19, y: 27, r: -6, s: 0.95 },
  { x: 39, y: 30, r: 14, s: 1 },
  { x: 55, y: 37, r: 24, s: 0.86 },
  { x: 9, y: 47, r: -14, s: 0.84 },
  { x: 29, y: 45, r: -3, s: 0.92 },
  { x: 48, y: 49, r: 13, s: 0.9 },
  { x: 4, y: 40, r: -21, s: 0.82 },
];

function Rose() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M50 54 C49 68 53 84 49 101" stroke="#3f7542" strokeWidth="3.2" fill="none" />
      <path d="M50 76 C39 67 28 69 25 73 C34 84 43 84 50 79Z" fill="#4d8547" />
      <path d="M49 82 Q38 76 30 73" stroke="#9fba70" strokeWidth="1.2" fill="none" />
      <path d="M51 86 C59 73 69 74 73 77 C68 88 59 91 51 89Z" fill="#3d713c" />
      <path d="M53 86 Q62 80 69 77" stroke="#9fba70" strokeWidth="1.1" fill="none" />
      <path d="M50 62 C24 64 16 50 22 38 C15 23 33 12 47 20 C58 9 78 17 77 34 C88 47 73 63 50 62Z" fill="#9b2632" />
      <path d="M24 42 C27 28 39 23 50 29 C62 21 75 29 74 41 C80 52 66 60 51 57 C39 64 24 56 24 42Z" fill="#c43c49" />
      <path d="M31 37 C34 28 44 29 49 35 C55 26 67 31 67 40 C73 48 62 55 53 49 C44 58 32 50 37 43Z" fill="#dc5961" />
      <path d="M42 38 C42 31 52 29 56 35 C63 37 59 47 53 47 C48 52 39 46 42 41 C46 38 51 39 52 43" fill="none" stroke="#96303b" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M29 32 Q35 23 43 25 M63 24 Q71 29 70 36" fill="none" stroke="#ef8990" strokeWidth="1.8" strokeLinecap="round" opacity=".8" />
    </svg>
  );
}

function Tulip() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M50 49 C49 68 54 84 50 101" stroke="#3f7542" strokeWidth="3.2" fill="none" />
      <path d="M51 79 C41 69 32 70 29 74 C37 85 45 86 51 82Z" fill="#4d8547" />
      <path d="M51 82 Q41 76 34 74" stroke="#a2bd73" strokeWidth="1.2" fill="none" />
      <path d="M52 89 C59 78 69 77 73 81 C67 91 59 94 52 92Z" fill="#3d713c" />
      <path d="M53 89 Q63 83 69 81" stroke="#a2bd73" strokeWidth="1.1" fill="none" />
      <path d="M22 48 C18 36 21 22 32 13 C39 22 43 31 47 43 C45 27 49 14 56 9 C65 18 67 32 59 48 C67 34 75 27 82 28 C87 42 77 55 61 59 C50 63 35 59 22 48Z" fill="#bd3e64" />
      <path d="M25 43 C24 32 28 22 33 17 C39 26 43 35 47 48 C46 31 50 17 55 13 C61 24 62 37 57 52 C68 38 76 32 80 31 C82 43 74 53 60 57 C47 61 35 55 25 43Z" fill="#e56583" />
      <path d="M47 48 C44 34 48 20 55 13 C62 24 62 39 57 53" fill="#f18ba0" />
      <path d="M31 30 Q38 37 44 48 M72 38 Q66 45 60 53" fill="none" stroke="#f3a6b3" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function Daisy() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M50 52 C48 68 53 84 50 101" stroke="#477b43" strokeWidth="3" fill="none" />
      <path d="M50 80 C39 71 31 72 28 76 C37 87 45 87 50 83Z" fill="#548747" />
      <path d="M50 84 Q40 78 34 76" stroke="#adc378" strokeWidth="1.2" fill="none" />
      {Array.from({ length: 18 }).map((_, i) => (
        <g key={i} transform={`rotate(${i * 20} 50 42)`}>
          <ellipse cx="50" cy="22" rx="5.8" ry="18" fill={i % 2 ? '#fffdf5' : '#f6eedc'} stroke="#e6dcc8" strokeWidth=".8" />
          <path d="M50 28 L50 14" stroke="#fff" strokeWidth=".8" opacity=".9" />
        </g>
      ))}
      <circle cx="50" cy="42" r="13" fill="#d79e27" />
      <circle cx="50" cy="40" r="10.5" fill="#f3c94f" />
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (Math.PI * 2 * i) / 12;
        return <circle key={i} cx={50 + Math.cos(angle) * 6.5} cy={40 + Math.sin(angle) * 6.5} r=".8" fill="#9c6b1c" />;
      })}
    </svg>
  );
}

function Sunflower() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M50 58 C49 73 53 88 48 101" stroke="#477b43" strokeWidth="3.5" fill="none" />
      <path d="M50 82 C40 71 31 73 28 77 C36 89 45 90 50 85Z" fill="#548747" />
      <path d="M50 85 Q40 79 34 77" stroke="#adc378" strokeWidth="1.2" fill="none" />
      {Array.from({ length: 22 }).map((_, i) => (
        <g key={i} transform={`rotate(${i * (360 / 22)} 50 43)`}>
          <ellipse cx="50" cy="19" rx="4.5" ry="18" fill={i % 2 ? '#efad28' : '#f7c642'} stroke="#d6921d" strokeWidth=".8" />
          <path d="M50 28 L50 9" stroke="#ffdf79" strokeWidth="1" opacity=".75" />
        </g>
      ))}
      <circle cx="50" cy="43" r="16" fill="#4d3022" />
      <circle cx="50" cy="43" r="13.5" fill="#68422a" />
      {Array.from({ length: 36 }).map((_, i) => {
        const angle = i * 2.399;
        const radius = 2 + Math.sqrt(i) * 1.75;
        const x = 50 + Math.cos(angle) * radius;
        const y = 43 + Math.sin(angle) * radius;
        return <ellipse key={i} cx={x} cy={y} rx="1.05" ry="1.45" fill={i % 2 ? '#d5a044' : '#322419'} transform={`rotate(${(i * 37) % 180} ${x} ${y})`} />;
      })}
    </svg>
  );
}

function Lily() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M50 55 C51 70 47 86 50 101" stroke="#477b43" strokeWidth="3" fill="none" />
      <path d="M49 83 C39 72 30 73 27 77 C36 88 43 90 49 86Z" fill="#548747" />
      <path d="M48 85 Q39 79 33 77" stroke="#adc378" strokeWidth="1.1" fill="none" />
      {Array.from({ length: 6 }).map((_, i) => (
        <g key={i} transform={`rotate(${i * 60} 50 49)`}>
          <path d="M50 55 C43 48 31 31 39 14 C44 5 49 8 50 13 C53 7 59 8 62 16 C67 32 57 48 50 55Z" fill={i % 2 ? '#f6eee9' : '#fffaf5'} stroke="#d9c9c5" strokeWidth="1" />
          <path d="M50 51 C49 39 48 26 50 13 M49 40 Q44 33 42 25 M51 36 Q56 29 58 22" fill="none" stroke="#d9a7b1" strokeWidth="1.1" strokeLinecap="round" />
          <g fill="#b87a84" opacity=".8">
            <circle cx="42" cy="29" r="1" /><circle cx="45" cy="33" r=".8" /><circle cx="56" cy="28" r="1" />
          </g>
        </g>
      ))}
      <circle cx="50" cy="49" r="4" fill="#d4a53a" />
      <path d="M49 50 L34 34 M51 50 L66 34 M50 51 L50 30" stroke="#c28c30" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="34" cy="34" r="2.2" fill="#f0c84b" /><circle cx="66" cy="34" r="2.2" fill="#f0c84b" /><circle cx="50" cy="30" r="2.2" fill="#f0c84b" />
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
              style={{ left: `${o.x}%`, top: `${o.y}%`, '--flower-rotation': `${o.r}deg`, '--flower-scale': o.s }}
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
