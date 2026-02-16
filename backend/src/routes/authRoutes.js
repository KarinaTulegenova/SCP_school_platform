import express from 'express';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { hashToken, signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/tokens.js';

const router = express.Router();

const issueTokens = async (user) => {
  const payload = { sub: user.id, role: user.role, email: user.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  user.refreshTokenHashes.push(hashToken(refreshToken));
  await user.save();

  return { accessToken, refreshToken };
};

const authResponse = (user, tokens) => ({
  accessToken: tokens.accessToken,
  refreshToken: tokens.refreshToken,
  user: {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role
  }
});

router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password || password.length < 8) {
      return res.status(400).json({ message: 'fullName, email and password (min 8 chars) are required' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const passwordHash = await hashPassword(password);
    const user = await User.create({ fullName, email: email.toLowerCase(), passwordHash, role: 'STUDENT' });
    const tokens = await issueTokens(user);

    return res.status(201).json(authResponse(user, tokens));
  } catch {
    return res.status(500).json({ message: 'Failed to register user' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const tokens = await issueTokens(user);
    return res.json(authResponse(user, tokens));
  } catch {
    return res.status(500).json({ message: 'Failed to login' });
  }
});

router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'refreshToken is required' });
    }

    const payload = verifyRefreshToken(refreshToken);
    const user = await User.findById(payload.sub);
    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const refreshHash = hashToken(refreshToken);
    const hasStoredToken = user.refreshTokenHashes.includes(refreshHash);
    if (!hasStoredToken) {
      return res.status(401).json({ message: 'Refresh token revoked' });
    }

    user.refreshTokenHashes = user.refreshTokenHashes.filter((item) => item !== refreshHash);
    const tokens = await issueTokens(user);

    return res.json(authResponse(user, tokens));
  } catch {
    return res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
});

router.post('/logout', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(204).send();
    }

    const payload = verifyRefreshToken(refreshToken);
    const user = await User.findById(payload.sub);
    if (!user) {
      return res.status(204).send();
    }

    const refreshHash = hashToken(refreshToken);
    user.refreshTokenHashes = user.refreshTokenHashes.filter((item) => item !== refreshHash);
    await user.save();
    return res.status(204).send();
  } catch {
    return res.status(204).send();
  }
});

router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash -refreshTokenHashes').lean();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      role: user.role
    });
  } catch {
    return res.status(500).json({ message: 'Failed to fetch user profile' });
  }
});

export default router;
