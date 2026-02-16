import express from 'express';
import User from '../models/User.js';
import { authenticate, authorizePermissions } from '../middleware/auth.js';
import { hashPassword } from '../utils/password.js';

const router = express.Router();

router.get('/', authenticate, authorizePermissions('progress:read:class'), async (req, res) => {
  try {
    const filter = req.user.role === 'TEACHER' ? { role: 'STUDENT' } : {};
    const users = await User.find(filter).select('-passwordHash -refreshTokenHashes').sort({ createdAt: -1 }).lean();

    return res.json(
      users.map((user) => ({
        id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }))
    );
  } catch {
    return res.status(500).json({ message: 'Failed to load users' });
  }
});

router.post('/', authenticate, authorizePermissions('user:manage'), async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ message: 'fullName, email, password and role are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    if (req.user.role === 'TEACHER' && role !== 'STUDENT') {
      return res.status(403).json({ message: 'Teachers can create only students' });
    }

    const normalizedEmail = email.toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const passwordHash = await hashPassword(password);
    const user = await User.create({ fullName, email: normalizedEmail, passwordHash, role });

    return res.status(201).json({
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    });
  } catch {
    return res.status(500).json({ message: 'Failed to create user' });
  }
});

router.patch('/:id/role', authenticate, authorizePermissions('user:manage'), async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ message: 'role is required' });
    }

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.user.role === 'TEACHER') {
      return res.status(403).json({ message: 'Teachers cannot change user roles' });
    }

    targetUser.role = role;
    await targetUser.save();

    return res.json({
      id: targetUser._id.toString(),
      fullName: targetUser.fullName,
      email: targetUser.email,
      role: targetUser.role,
      createdAt: targetUser.createdAt
    });
  } catch {
    return res.status(500).json({ message: 'Failed to update role' });
  }
});

router.delete('/:id', authenticate, authorizePermissions('user:manage'), async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only admins can delete users' });
    }

    const { id } = req.params;
    if (id === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete yourself' });
    }

    const result = await User.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(204).send();
  } catch {
    return res.status(500).json({ message: 'Failed to delete user' });
  }
});

export default router;
