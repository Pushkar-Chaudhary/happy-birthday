# Wishly

Wishly is a birthday surprise app with a React frontend, a small Node/Express API, and MongoDB storage. Wishes receive short permanent links and are available from any device.

## Local development

1. Copy `server/.env.example` to `server/.env` and set a MongoDB connection string.
2. Install dependencies: `npm run install:all`
3. Start the API: `npm run dev:server`
4. In a second terminal, start Vite: `npm run dev`

The frontend uses `/api` in development. Set `VITE_API_URL` when the API is hosted on a separate origin.

## Production

Set `MONGODB_URI`, `CLIENT_URL`, and `PORT` in the server environment, then run `npm start`. The server builds and serves `client/dist` and handles the API. Deploy the Node process to Render, Railway, Fly.io, or a container platform, and use MongoDB Atlas for the database.

### Vercel

Import the repository with the project root set to the repository root. `vercel.json` installs both the client and server dependencies, builds the Vite frontend, and publishes `client/dist`; the `/api/*` routes are handled by the Vercel function in `api/`.

Add `MONGODB_URI` to the Vercel project's Environment Variables for Production and Preview deployments. `CLIENT_URL` is not needed when the frontend and API use the same Vercel domain. If MongoDB Atlas restricts network access, allow connections from the deployed function environment.

The API validates input, applies security headers, limits request rates, and uses indexed short IDs. Authentication, password-protected wishes, editing, deletion, moderation, analytics, expiration management, and media storage need additional product-specific endpoints and object storage; they cannot be secured in the browser alone.
