import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = Router();

const sign = (user) =>
  jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'wishly-dev-secret', { expiresIn: '7d' });

const safeUser = (u) => ({ id: u._id, name: u.name, email: u.email, avatar: u.avatar });

const setAuthCookie = (res, token) => {
  const secure = process.env.NODE_ENV === 'production';

  res.cookie('wishly_token', token, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;
    const cleanName = String(name || '').trim();
    const cleanEmail = String(email || '').trim().toLowerCase();

    if (!cleanName || !cleanEmail || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    if (await User.exists({ email: cleanEmail })) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hash = await bcrypt.hash(String(password), 10);
    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      password: hash,
      avatar: avatar || '🎁',
    });

    const token = sign(user);
    setAuthCookie(res, token);

    res.status(201).json({ user: safeUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = String(email || '').trim().toLowerCase();
    if (!cleanEmail || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email: cleanEmail });
    if (!user || !(await bcrypt.compare(String(password), user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = sign(user);
    setAuthCookie(res, token);

    res.json({ user: safeUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/logout
router.post('/logout', (_, res) => {
  res.clearCookie('wishly_token', { path: '/' });
  res.json({ ok: true });
});

export default router;
