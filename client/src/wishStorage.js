const STORAGE_KEY = 'wishly_wishes';

function readWishes() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  } catch { return {}; }
}

function encodeWish(wish) {
  const bytes = new TextEncoder().encode(JSON.stringify(wish));
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}

function decodeWish(slug) {
  try {
    const base64 = slug.replaceAll('-', '+').replaceAll('_', '/') + '='.repeat((4 - (slug.length % 4)) % 4);
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const wish = JSON.parse(new TextDecoder().decode(bytes));
    if (!wish || typeof wish !== 'object') return null;
    if (typeof wish.recipientName !== 'string' || wish.recipientName.length > 60) return null;
    if (typeof wish.senderName !== 'string' || wish.senderName.length > 60) return null;
    if (typeof wish.message !== 'string' || wish.message.length > 1000) return null;
    if (typeof wish.theme !== 'string' || wish.theme.length > 30) return null;
    return wish;
  } catch {
    return null;
  }
}

export function saveWish({ recipientName, senderName, message, theme, bouquet }) {
  const wish = { recipientName, senderName, message, theme, bouquet, createdAt: new Date().toISOString() };
  const slug = encodeWish(wish);
  wish.slug = slug;
  const wishes = readWishes();
  wishes[slug] = wish;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes)); }
  catch { throw new Error('Your browser could not save this surprise. Check available storage and try again.'); }
  return wish;
}

export function getWish(slug) {
  const cached = readWishes()[slug];
  return cached || decodeWish(slug);
}
