# Wishly

React frontend, Node/Express API, MongoDB for users and wishes.

## Run locally

1. Start MongoDB locally or connect to MongoDB Atlas.
2. Use the real environment file already present in the project:
   ```bash
   copy .env .env.local
   ```
   or just update the existing `.env` values for your local or production deployment.
3. Install dependencies:
   ```bash
   npm run install:all
   ```
5. Terminal A: `npm run dev:server`
6. Terminal B: `npm run dev:client`

App: http://localhost:5173 · API: http://localhost:5000

`/sitemap.xml` and `/robots.txt` are served by the API and also shipped in the client `public` folder for static SEO hosting.

## Production

```bash
npm run build
# set BASE_URL, CLIENT_URL, JWT_SECRET, MONGODB_URI and NODE_ENV=production
npm start
```

Express serves `client/dist`, injects Open Graph tags for birthday pages, and exposes a sitemap and robots file for search engines.

This stack is suitable for roughly 100–1000 visitors in a simple deployment: rate limiting, Helmet hardening, Mongo indexes on `slug` and `sender`, and static front-end build output. For larger traffic, place Nginx or Cloudflare in front and use MongoDB Atlas or a managed Mongo instance.
