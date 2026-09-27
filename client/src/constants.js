// Shared constants for themes, flowers, and customization

export const FLOWERS = {
  rose:      { name: 'Rose', color: '#e11d48' },
  tulip:     { name: 'Tulip', color: '#ec4899' },
  daisy:     { name: 'Daisy', color: '#facc15' },
  sunflower: { name: 'Sunflower', color: '#eab308' },
  lily:      { name: 'Lily', color: '#f8fafc' },
};

export const WRAPPING = {
  kraft:    { name: 'Kraft', color: '#c8ad7f' },
  emerald:  { name: 'Emerald', color: '#0f6139' },
  velvet:   { name: 'Velvet', color: '#1d1b4c' },
  rosegold: { name: 'Rose Gold', color: '#d4908a' },
};

export const RIBBONS = {
  pink:    { name: 'Silk Pink', color: '#ff8fa3' },
  gold:    { name: 'Champagne Gold', color: '#d4af37' },
  crimson: { name: 'Crimson', color: '#bd081c' },
  navy:    { name: 'Deep Navy', color: '#0d47a1' },
};

export const THEMES = {
  rose: {
    name: 'Rose Glow',
    bg: 'linear-gradient(135deg, #180512 0%, #29081f 50%, #160410 100%)',
    accent: '#fb7185',
    glow: 'rgba(251,113,133,0.3)',
    card: 'rgba(251,113,133,0.06)',
    border: 'rgba(251,113,133,0.22)',
  },
  galaxy: {
    name: 'Midnight Galaxy',
    bg: 'linear-gradient(135deg, #050616 0%, #0d0e2e 50%, #040514 100%)',
    accent: '#a78bfa',
    glow: 'rgba(167,139,250,0.3)',
    card: 'rgba(167,139,250,0.06)',
    border: 'rgba(167,139,250,0.22)',
  },
  ocean: {
    name: 'Ocean Depths',
    bg: 'linear-gradient(135deg, #02141c 0%, #062836 50%, #021219 100%)',
    accent: '#38bdf8',
    glow: 'rgba(56,189,248,0.3)',
    card: 'rgba(56,189,248,0.06)',
    border: 'rgba(56,189,248,0.22)',
  },
  forest: {
    name: 'Emerald Forest',
    bg: 'linear-gradient(135deg, #04160d 0%, #082819 50%, #03140b 100%)',
    accent: '#4ade80',
    glow: 'rgba(74,222,128,0.3)',
    card: 'rgba(74,222,128,0.06)',
    border: 'rgba(74,222,128,0.22)',
  },
  gold: {
    name: 'Warm Gold',
    bg: 'linear-gradient(135deg, #161004 0%, #2a1e06 50%, #140d02 100%)',
    accent: '#fbbf24',
    glow: 'rgba(251,191,36,0.3)',
    card: 'rgba(251,191,36,0.06)',
    border: 'rgba(251,191,36,0.22)',
  },
};

export const MESSAGE_TEMPLATES = [
  "Wishing you a year filled with wonderful adventures, genuine joy, and every happiness you deserve.",
  "Happy Birthday! Thank you for bringing so much light, warmth, and laughter into everyone's life.",
  "May this year ahead be your brightest yet, full of memorable moments and dreams accomplished.",
  "To an extraordinary person on your special day: celebrating everything you are and all that you do.",
];

export const MAX_FLOWERS = 12;
