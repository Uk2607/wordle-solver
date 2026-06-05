import { Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { query } from '../db.js';
import { signSessionToken, requireAuth } from '../middleware/auth.js';

const router = Router();

const GOOGLE_CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID;
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

const INITIAL_FREE_CREDITS = 30;

/**
 * POST /api/auth/google
 * Verify Google ID token, upsert user, issue session cookie.
 */
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ error: 'Missing Google credential token.' });
    }

    // Verify the ID token with Google
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({ error: 'Google account does not have an email.' });
    }

    // Check if user already exists
    const existingUser = await query(
      'SELECT * FROM users WHERE google_id = $1',
      [googleId]
    );

    let user;
    let isNewUser = false;

    if (existingUser.rows.length > 0) {
      // Existing user — update profile info (name/avatar may change)
      const updateResult = await query(
        `UPDATE users SET name = $1, avatar_url = $2, email = $3, updated_at = NOW()
         WHERE google_id = $4
         RETURNING *`,
        [name, picture, email, googleId]
      );
      user = updateResult.rows[0];
    } else {
      // New user — insert with free credits
      const insertResult = await query(
        `INSERT INTO users (google_id, email, name, avatar_url, credits, tier)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [googleId, email, name, picture, INITIAL_FREE_CREDITS, 'Free Solver']
      );
      user = insertResult.rows[0];
      isNewUser = true;

      // Log the signup bonus transaction
      await query(
        `INSERT INTO transactions (user_id, type, amount, description, tier_after, credits_after)
         VALUES ($1, 'signup', $2, $3, $4, $5)`,
        [user.id, INITIAL_FREE_CREDITS, 'Welcome bonus credits on first Google sign-in', user.tier, user.credits]
      );
    }

    // Sign session JWT and set HttpOnly cookie
    const sessionToken = signSessionToken(user);

    res.cookie('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatar_url,
        credits: user.credits,
        tier: user.tier,
      },
      isNewUser,
    });
  } catch (err) {
    console.error('[Auth] Google sign-in error:', err);
    res.status(500).json({ error: 'Authentication failed. Please try again.' });
  }
});

/**
 * GET /api/auth/me
 * Restore session from cookie — returns current user data.
 */
router.get('/me', requireAuth, async (req, res) => {
  try {
    const result = await query(
      'SELECT id, name, email, avatar_url, credits, tier FROM users WHERE id = $1',
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      res.clearCookie('session');
      return res.status(404).json({ error: 'User not found.' });
    }

    const user = result.rows[0];
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatar_url,
        credits: user.credits,
        tier: user.tier,
      },
    });
  } catch (err) {
    console.error('[Auth] Session restore error:', err);
    res.status(500).json({ error: 'Failed to restore session.' });
  }
});

/**
 * POST /api/auth/logout
 * Clear session cookie.
 */
router.post('/logout', (req, res) => {
  res.clearCookie('session', { path: '/' });
  res.json({ message: 'Logged out successfully.' });
});

export default router;
