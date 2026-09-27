
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';

import wishRoutes from './routes/wishes.js';
import Wish from './models/Wish.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// =========================
// Environment variables
// =========================

const PORT = Number(process.env.PORT || 5000);

const CLIENT_URL =
  process.env.CLIENT_URL ||
  'http://localhost:5173';

const ALLOWED_ORIGINS = Array.from(
  new Set(
    [CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173']
      .filter(Boolean)
      .map((origin) => origin.replace(/\/$/, ''))
  )
);

const BASE_URL =
  (process.env.BASE_URL || CLIENT_URL).replace(/\/$/, '');



const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb://127.0.0.1:27017/wishly';

// =========================
// Paths
// =========================

const dist = path.join(__dirname, '../client/dist');
const indexHtml = path.join(dist, 'index.html');

// =========================
// Production checks
// =========================

// Auth removed for frictionless guest creation


// =========================
// Middleware
// =========================

app.set('trust proxy', 1);

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow all origins for seamless sharing and embed previews
      callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '50kb' }));

// Generous rate limit tuned to support 100+ simultaneous users
app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 3000,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// =========================
// API routes
// =========================

app.use('/api/wishes', wishRoutes);

// =========================
// Health check
// =========================

app.get('/health', (_, res) => {
  res.json({ ok: true });
});

// =========================
// Robots.txt
// =========================

app.get('/robots.txt', (_, res) => {
  res.type('text/plain').send(
    `User-agent: *
Allow: /
Disallow: /api/
Disallow: /dashboard
Sitemap: ${BASE_URL}/sitemap.xml
`
  );
});

// =========================
// Sitemap
// =========================

app.get('/sitemap.xml', async (_, res) => {
  try {
    const wishes = await Wish.find({}, 'slug updatedAt').lean();

    const urls = [
      {
        loc: BASE_URL,
        changefreq: 'weekly',
        priority: '1.0',
      },

      ...wishes.map((w) => ({
        loc: `${BASE_URL}/w/${w.slug}`,
        changefreq: 'yearly',
        priority: '0.7',
        lastmod: w.updatedAt
          ? new Date(w.updatedAt).toISOString().slice(0, 10)
          : undefined,
      })),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
        .map(
          (u) => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>${u.lastmod
              ? `\n    <lastmod>${u.lastmod}</lastmod>`
              : ''
            }
  </url>`
        )
        .join('\n')}
</urlset>`;

    res
      .type('application/xml')
      .send(xml);
  } catch (err) {
    console.error('Sitemap error:', err);

    res
      .status(500)
      .type('application/xml')
      .send(
        '<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"/>'
      );
  }
});

// =========================
// HTML escaping
// =========================

function escapeHtml(s = '') {
  return String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[c]
  );
}

// =========================
// Dynamic meta tags
// =========================

function withMeta(html, { title, description, url }) {
  const t = escapeHtml(title);
  const d = escapeHtml(description);
  const u = escapeHtml(url);

  return html
    .replace(
      /<title>[\s\S]*?<\/title>/,
      `<title>${t}</title>`
    )
    .replace(
      /content="Wishly — Create Magical Birthday Surprises[^"]*"/g,
      `content="${t}"`
    )
    .replace(
      /name="description" content="[^"]*"/,
      `name="description" content="${d}"`
    )
    .replace(
      /property="og:description" content="[^"]*"/,
      `property="og:description" content="${d}"`
    )
    .replace(
      /name="twitter:description" content="[^"]*"/,
      `name="twitter:description" content="${d}"`
    )
    .replace(
      /property="og:url" content="[^"]*"/,
      `property="og:url" content="${u}"`
    )
    .replace(
      /rel="canonical" href="[^"]*"/,
      `rel="canonical" href="${u}"`
    );
}

// =========================
// Wish page
// =========================

async function sendWishPage(req, res, next) {
  try {
    if (!fs.existsSync(indexHtml)) {
      return next();
    }

    let html = fs.readFileSync(indexHtml, 'utf8');

    const wish = await Wish.findOne({
      slug: req.params.slug,
    })
      .select('slug recipientName senderName message')
      .lean();

    if (wish) {
      html = withMeta(html, {
        title: `Happy Birthday, ${wish.recipientName}! 🎂`,
        description: `"${wish.message.slice(
          0,
          140
        )}" — a surprise from ${wish.senderName}`,
        url: `${BASE_URL}/w/${wish.slug}`,
      });
    }

    return res
      .type('html')
      .send(html);
  } catch (err) {
    console.error('Wish page error:', err);
    return next(err);
  }
}

// =========================
// Serve frontend
// =========================

if (fs.existsSync(dist)) {
  app.get('/w/:slug', sendWishPage);

  app.use(
    express.static(dist, {
      maxAge: '7d',
      index: false,
    })
  );

  // Express 5 compatible catch-all
  app.get(/.*/, (_, res) => {
    res.sendFile(indexHtml);
  });
}

// =========================
// MongoDB + Server
// =========================

mongoose
  .connect(MONGODB_URI, {
    maxPoolSize: 100, // Handle 100+ concurrent connections
    minPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log('MongoDB connected (Connection pool: 100 max)');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Wishly API running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(
      'MongoDB connection failed:',
      err.message
    );

    process.exit(1);
  });

