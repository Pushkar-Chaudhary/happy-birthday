import 'dotenv/config';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT || 5000);
const clientDist = path.resolve(__dirname, '../client/dist');
app.set('trust proxy', 1);

const wishSchema = new mongoose.Schema({
  slug: { type: String, unique: true, index: true },
  recipientName: { type: String, required: true, maxlength: 60, trim: true },
  senderName: { type: String, required: true, maxlength: 60, trim: true },
  message: { type: String, required: true, maxlength: 1000 },
  theme: { type: String, required: true, maxlength: 30 },
  bouquet: { type: mongoose.Schema.Types.Mixed, default: null },
  expiresAt: { type: Date, default: null },
}, { timestamps: true });
wishSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, partialFilterExpression: { expiresAt: { $type: 'date' } } });
const Wish = mongoose.model('Wish', wishSchema);
const allowedThemes = new Set(['rose', 'galaxy', 'ocean', 'forest', 'gold']);

app.disable('x-powered-by');
app.use(helmet({ contentSecurityPolicy: false }));
if (process.env.CLIENT_URL) app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json({ limit: '32kb' }));
app.use('/api', rateLimit({ windowMs: 60 * 1000, limit: 60, standardHeaders: 'draft-7', legacyHeaders: false }));

function clean(value, max) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

app.get('/api/health', (_req, res) => res.json({ ok: mongoose.connection.readyState === 1 }));

app.use((error, _req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && error.body) return res.status(400).json({ message: 'Invalid request data.' });
  next(error);
});

app.post('/api/wishes', async (req, res) => {
  const recipientName = clean(req.body.recipientName, 60);
  const senderName = clean(req.body.senderName, 60);
  const message = clean(req.body.message, 1000);
  const theme = clean(req.body.theme, 30);
  const bouquet = req.body.bouquet && typeof req.body.bouquet === 'object' ? req.body.bouquet : null;
  if (!recipientName || !senderName || !message || !theme || !allowedThemes.has(theme)) return res.status(400).json({ message: 'Please provide valid wish details.' });
  try {
    const wish = await Wish.create({ slug: crypto.randomBytes(8).toString('base64url'), recipientName, senderName, message, theme, bouquet });
    res.status(201).json(wish);
  } catch (error) {
    console.error('Create wish failed:', error.message);
    res.status(503).json({ message: 'Wishes are temporarily unavailable.' });
  }
});

app.get('/api/wishes/:slug', async (req, res) => {
  if (!/^[A-Za-z0-9_-]{8,32}$/.test(req.params.slug)) return res.status(404).json({ message: 'Wish not found.' });
  try {
    const wish = await Wish.findOne({ slug: req.params.slug }).lean();
    if (!wish) return res.status(404).json({ message: 'Wish not found.' });
    res.json(wish);
  } catch (error) {
    console.error('Load wish failed:', error.message);
    res.status(503).json({ message: 'Wishes are temporarily unavailable.' });
  }
});

app.use(express.static(clientDist, {
  immutable: true,
  maxAge: '1y',
  setHeaders(res, filePath) {
    // The HTML points to the current hashed assets, so browsers must revalidate it after deploys.
    if (path.basename(filePath) === 'index.html') res.setHeader('Cache-Control', 'no-cache');
  },
}));
app.get('*', (_req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.sendFile(path.join(clientDist, 'index.html'));
});

mongoose.connect(process.env.MONGODB_URI || '', { serverSelectionTimeoutMS: 10000 })
  .then(() => app.listen(port, () => console.log(`Wishly server listening on port ${port}`)))
  .catch((error) => { console.error('MONGODB_URI is required and must be reachable:', error.message); process.exit(1); });
