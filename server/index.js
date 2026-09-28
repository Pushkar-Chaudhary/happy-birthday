import 'dotenv/config';
import app, { connectDatabase } from './app.js';

const port = Number(process.env.PORT || 5000);

// Render runs this long-lived listener. Vercel imports app.js directly through
// api/[...path].mjs and handles requests as serverless function invocations.
app.listen(port, '0.0.0.0', () => console.log(`Wishly server listening on port ${port}`));

async function connectWithRetry() {
  try {
    await connectDatabase();
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed; retrying in 5 seconds:', error.message);
    const retry = setTimeout(connectWithRetry, 5000);
    retry.unref();
  }
}

connectWithRetry();
