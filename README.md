# Wishly

Wishly creates shareable birthday surprise pages with a React frontend, an Express API, and MongoDB storage. When the API is configured, wishes are stored centrally. If the API is unavailable, the app can create a self-contained link that works without central storage.

## Local development

1. Set `MONGODB_URI` in `server/.env` (the local environment file).
2. Install dependencies with `npm run install:all`.
3. Start the API with `npm run dev:server`.
4. In another terminal, start the frontend with `npm run dev`.

Vite proxies `/api` requests to `http://localhost:5000`. To use an API hosted on another origin, set `VITE_API_URL` to its `/api` URL when building the frontend, and set `CLIENT_URL` on the API to the frontend's origin.

## Deploy with Render

The repository includes a Render Blueprint in `render.yaml`. Create a MongoDB database (for example, in MongoDB Atlas), then create a new Blueprint Instance from this repository and set `MONGODB_URI` when prompted. Render builds the frontend and serves it and the API from the same Node service, so `CLIENT_URL` is not needed for this setup. The health check uses `/api/health` and reports unavailable until MongoDB is connected.

## Deploy with Vercel

Import the repository with the project root set to the repository root. The included `vercel.json` builds the Vite app into `client/dist`; the function in `api/` handles `/api/*` requests.

Set `MONGODB_URI` in the Vercel project's Environment Variables for every environment you plan to use, including Preview if desired. `CLIENT_URL` is unnecessary when the frontend and API share a Vercel domain. Ensure your MongoDB provider permits connections from the deployed function. Redeploy after changing environment variables.

## Deploy the static frontend with Netlify

The included `netlify.toml` builds and publishes the frontend. For durable, cross-device wishes, also deploy the API and set `VITE_API_URL` to the API's full `/api` URL in Netlify's build environment. Set `CLIENT_URL` on that API to the Netlify site origin, then rebuild the frontend. Without a configured API and MongoDB, wishes use self-contained links rather than centralized storage.

The API validates input, applies security headers and request rate limits, and uses indexed short IDs. Authentication, password-protected wishes, editing, deletion, moderation, analytics, expiration management, and media storage need additional product-specific endpoints and object storage; they cannot be secured in the browser alone.
