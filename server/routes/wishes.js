import { Router } from 'express';
import { nanoid } from 'nanoid';
import Wish from '../models/Wish.js';
import auth from '../middleware/auth.js';

const router = Router();

// POST /api/wishes — create (auth required)
router.post('/', auth, async (req, res) => {
  try {
    const { recipientName, message, theme, bouquet, senderName, senderAvatar } = req.body;
    if (!recipientName?.trim() || !message?.trim())
      return res.status(400).json({ message: 'Recipient name and message are required' });

    const slug = nanoid(8);
    const wish = await Wish.create({
      slug,
      sender:        req.user.id,
      senderName:    (senderName || 'Someone Special').trim(),
      senderAvatar:  senderAvatar || '🎁',
      recipientName: recipientName.trim(),
      message:       message.trim(),
      theme:         theme || 'rose',
      bouquet:       bouquet || { flowers: { rose: 3 }, wrapping: 'kraft', ribbon: 'pink' },
    });

    res.status(201).json(wish);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/wishes/mine — user's own wishes (auth required)
router.get('/mine', auth, async (req, res) => {
  try {
    const wishes = await Wish.find({ sender: req.user.id })
      .select('-sender')
      .sort({ createdAt: -1 })
      .lean();
    res.json(wishes);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/wishes/:slug — public wish (bots do not inflate views)
router.get('/:slug', async (req, res) => {
  try {
    const bot = /bot|crawl|spider|slurp|facebook|whatsapp|telegram|preview|bing|google/i.test(req.get('user-agent') || '');
    const wish = bot
      ? await Wish.findOne({ slug: req.params.slug }).select('-sender').lean()
      : await Wish.findOneAndUpdate({ slug: req.params.slug }, { $inc: { views: 1 } }, { new: true }).select('-sender').lean();
    if (!wish) return res.status(404).json({ message: 'Wish not found' });
    res.json(wish);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/wishes/:id — delete own wish
router.delete('/:id', auth, async (req, res) => {
  try {
    const wish = await Wish.findOneAndDelete({ _id: req.params.id, sender: req.user.id });
    if (!wish) return res.status(404).json({ message: 'Wish not found' });
    res.json({ message: 'Wish deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
