import { hasPermission } from '../permissions.js';
import { verifyAccessToken } from '../utils/tokens.js';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.slice(7);

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.sub,
      role: payload.role,
      email: payload.email
    };
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden: role not allowed' });
  }
  return next();
};

export const authorizePermissions = (...permissions) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const denied = permissions.some((permission) => !hasPermission(req.user.role, permission));
  if (denied) {
    return res.status(403).json({ message: 'Forbidden: missing permission' });
  }

  return next();
};
