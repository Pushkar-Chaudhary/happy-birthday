# Wishly

Wishly is a frontend-only React birthday surprise app. It creates interactive birthday pages in the current browser and stores them in `localStorage`.

## Run locally

```bash
npm install
npm run dev
```

Build for static hosting with `npm run build`. Deploy the generated `client/dist` directory to any static hosting provider.

## Data and sharing limitation

Wish data is encoded into the generated link, so it works on another device without a server. The browser also caches created wishes locally. Because the link contains the message and names, anyone who receives the link can read that data; do not put secrets or sensitive information in a wish. The app has no authentication, server-side privacy, expiry, moderation, or shared database.
