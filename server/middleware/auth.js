import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'wordle-solver-dev-secret-change-in-production';

/**
 * Middleware: Verify JWT session from HttpOnly cookie.
 * Attaches { userId, email, name } to req.user on success.
 */
export function requireAuth(req, res, next) {
  const token = req.cookies?.session;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. Please sign in.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      name: decoded.name,
    };
    next();
  } catch (err) {
    console.error('[Auth] Invalid or expired session token:', err.message);
    res.clearCookie('session');
    return res.status(401).json({ error: 'Session expired. Please sign in again.' });
  }
}

/**
 * Optional auth: Attaches user if cookie is present, but doesn't block if missing.
 */
export function optionalAuth(req, res, next) {
  const token = req.cookies?.session;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        name: decoded.name,
      };
    } catch {
      // Invalid token — continue without user
      res.clearCookie('session');
    }
  }

  next();
}

/**
 * Sign a new session JWT for a user.
 */
export function signSessionToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}
