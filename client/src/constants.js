// Shared constants used across both client pages and components

export const FLOWERS = {
  rose:      { emoji: '🌹', name: 'Rose' },
  tulip:     { emoji: '🌷', name: 'Tulip' },
  daisy:     { emoji: '🌼', name: 'Daisy' },
  sunflower: { emoji: '🌻', name: 'Sunflower' },
  lily:      { emoji: '🌸', name: 'Lily' },
};

export const WRAPPING = {
  kraft:    { name: 'Kraft Brown', color: '#c8ad7f' },
  emerald:  { name: 'Emerald',    color: '#0f6139' },
  velvet:   { name: 'Velvet',     color: '#1d1b4c' },
  rosegold: { name: 'Rose Gold',  color: '#d4908a' },
};

export const RIBBONS = {
  pink:    { name: 'Silk Pink',   color: '#ff8fa3' },
  gold:    { name: 'Royal Gold',  color: '#d4af37' },
  crimson: { name: 'Crimson',     color: '#bd081c' },
  navy:    { name: 'Deep Blue',   color: '#0d47a1' },
};

export const THEMES = {
  rose: {
    name: 'Rose',
    emoji: '🌹',
    bg: 'linear-gradient(135deg, #1a0011 0%, #2d0020 50%, #1a0011 100%)',
    accent: '#ff6b9d',
    glow: 'rgba(255,107,157,0.35)',
    card: 'rgba(255,107,157,0.08)',
    border: 'rgba(255,107,157,0.25)',
  },
  galaxy: {
    name: 'Galaxy',
    emoji: '🌌',
    bg: 'linear-gradient(135deg, #030318 0%, #0a0628 50%, #030318 100%)',
    accent: '#a78bfa',
    glow: 'rgba(167,139,250,0.35)',
    card: 'rgba(167,139,250,0.08)',
    border: 'rgba(167,139,250,0.25)',
  },
  ocean: {
    name: 'Ocean',
    emoji: '🌊',
    bg: 'linear-gradient(135deg, #001a1f 0%, #003344 50%, #001a1f 100%)',
    accent: '#22d3ee',
    glow: 'rgba(34,211,238,0.35)',
    card: 'rgba(34,211,238,0.08)',
    border: 'rgba(34,211,238,0.25)',
  },
  forest: {
    name: 'Forest',
    emoji: '🌿',
    bg: 'linear-gradient(135deg, #001a0a 0%, #003318 50%, #001a0a 100%)',
    accent: '#4ade80',
    glow: 'rgba(74,222,128,0.35)',
    card: 'rgba(74,222,128,0.08)',
    border: 'rgba(74,222,128,0.25)',
  },
  gold: {
    name: 'Gold',
    emoji: '✨',
    bg: 'linear-gradient(135deg, #1a1000 0%, #2d2000 50%, #1a1000 100%)',
    accent: '#fbbf24',
    glow: 'rgba(251,191,36,0.35)',
    card: 'rgba(251,191,36,0.08)',
    border: 'rgba(251,191,36,0.25)',
  },
};

export const AVATARS = ['🎁', '🎂', '🎊', '🎉', '💝', '🌟', '🦋', '🎀', '🌺', '🦄'];

export const MESSAGE_TEMPLATES = [
  "Wishing you a day as bright as your smile and as warm as my heart. Happy Birthday! 🎂",
  "On your special day, I hope you're surrounded by all the joy and love you deserve. Here's to you, superstar! ✨",
  "Another year wiser, and still as amazing as ever. May this birthday bring everything you've ever wished for. 🌸",
  "To someone who makes every day brighter just by being in it — here's to celebrating YOU today! 🎉",
];

export const MAX_FLOWERS = 12;
