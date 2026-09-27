import { Router } from 'express';
import { nanoid } from 'nanoid';
import Wish from '../models/Wish.js';

const router = Router();

// In-memory cache for high-concurrency performance (100+ simultaneous viewers)
const wishCache = new Map();
const CACHE_TTL_MS = 60 * 1000; // 1 minute TTL

function setCache(slug, data) {
  if (wishCache.size > 1000) {
    const oldestKey = wishCache.keys().next().value;
    wishCache.delete(oldestKey);
  }
  wishCache.set(slug, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

function getCache(slug) {
  const item = wishCache.get(slug);
  if (!item) return null;
  if (Date.now() > item.expiresAt) {
    wishCache.delete(slug);
    return null;
  }
  return item.data;
}

// Security: Strip HTML tags and control characters to prevent stored XSS
function sanitizeText(input, maxLength = 100) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>/g, '') // remove HTML tags
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '') // remove control chars
    .trim()
    .slice(0, maxLength);
}

const ALLOWED_THEMES = new Set(['rose', 'galaxy', 'ocean', 'forest', 'gold']);
const SLUG_REGEX = /^[A-Za-z0-9_-]{4,32}$/;

// POST /api/wishes — create wish with strict input sanitization
router.post('/', async (req, res) => {
  try {
    const { recipientName, message, theme, bouquet, senderName } = req.body || {};

    const cleanRecipient = sanitizeText(recipientName, 60);
    const cleanSender = sanitizeText(senderName, 60) || 'Someone Special';
    const cleanMessage = sanitizeText(message, 1000);

    if (!cleanRecipient || !cleanMessage) {
      return res.status(400).json({ message: 'Recipient name and message are required' });
    }

    const cleanTheme = ALLOWED_THEMES.has(theme) ? theme : 'rose';

    // Safe bouquet structure validation
    const safeBouquet = {
      flowers: { rose: 3 },
      wrapping: 'kraft',
      ribbon: 'pink',
    };
    if (bouquet && typeof bouquet === 'object') {
      if (typeof bouquet.wrapping === 'string') safeBouquet.wrapping = sanitizeText(bouquet.wrapping, 20);
      if (typeof bouquet.ribbon === 'string') safeBouquet.ribbon = sanitizeText(bouquet.ribbon, 20);
      if (bouquet.flowers && typeof bouquet.flowers === 'object') {
        const cleanFlowers = {};
        let total = 0;
        for (const [flowerType, count] of Object.entries(bouquet.flowers)) {
          const num = Math.min(12, Math.max(0, parseInt(count, 10) || 0));
          if (num > 0 && total + num <= 12) {
            cleanFlowers[sanitizeText(flowerType, 20)] = num;
            total += num;
          }
        }
        if (total > 0) safeBouquet.flowers = cleanFlowers;
      }
    }

    const slug = nanoid(8);
    const wish = await Wish.create({
      slug,
      senderName: cleanSender,
      recipientName: cleanRecipient,
      message: cleanMessage,
      theme: cleanTheme,
      bouquet: safeBouquet,
    });

    const plainWish = wish.toObject();
    delete plainWish.sender;
    delete plainWish.__v;
    setCache(slug, plainWish);

    res.status(201).json(plainWish);
  } catch (err) {
    console.error('Wish create error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/wishes/:slug — sanitized slug lookup with NoSQL injection prevention & caching
router.get('/:slug', async (req, res) => {
  try {
    const rawSlug = req.params.slug;

    // Strict regex validation ensures no NoSQL injection payload can execute
    if (!rawSlug || typeof rawSlug !== 'string' || !SLUG_REGEX.test(rawSlug)) {
      return res.status(400).json({ message: 'Invalid wish identifier' });
    }

    const slug = rawSlug.trim();
    const cached = getCache(slug);
    if (cached) {
      Wish.updateOne({ slug }, { $inc: { views: 1 } }).exec().catch(() => {});
      return res.json(cached);
    }

    const bot = /bot|crawl|spider|slurp|facebook|whatsapp|telegram|preview|bing|google/i.test(req.get('user-agent') || '');
    const wish = bot
      ? await Wish.findOne({ slug }).select('-sender -__v').lean()
      : await Wish.findOneAndUpdate({ slug }, { $inc: { views: 1 } }, { new: true }).select('-sender -__v').lean();

    if (!wish) {
      return res.status(404).json({ message: 'Wish not found' });
    }

    setCache(slug, wish);
    res.json(wish);
  } catch (err) {
    console.error('Wish fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
