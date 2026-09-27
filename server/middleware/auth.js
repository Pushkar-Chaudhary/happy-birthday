import jwt from 'jsonwebtoken';

export default function authMiddleware(req, res, next) {
  const headerToken = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.split(' ')[1]
    : null;

  const cookieToken = req.cookies?.wishly_token;
  const token = headerToken || cookieToken;

  if (!token) return res.status(401).json({ message: 'Authentication required' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'wishly-dev-secret');
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}
