import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export const signAccessToken = (payload) =>
  jwt.sign(payload, config.jwtAccessSecret, { expiresIn: config.jwtAccessExpiresIn });

export const signRefreshToken = (payload) =>
  jwt.sign(payload, config.jwtRefreshSecret, { expiresIn: config.jwtRefreshExpiresIn });

export const verifyAccessToken = (token) => jwt.verify(token, config.jwtAccessSecret);

export const verifyRefreshToken = (token) => jwt.verify(token, config.jwtRefreshSecret);

export const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');
