import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// All credit routes require authentication
router.use(requireAuth);

/**
 * POST /api/credits/use
 * Deduct 1 credit for an AI solver query.
 */
router.post('/use', async (req, res) => {
  try {
    const userId = req.user.userId;

    // Atomically check and deduct credit
    const result = await query(
      `UPDATE users SET credits = credits - 1, updated_at = NOW()
       WHERE id = $1 AND credits > 0
       RETURNING credits, tier`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(402).json({
        error: 'Insufficient credits. Please purchase more to continue using the AI solver.',
        credits: 0,
      });
    }

    const { credits, tier } = result.rows[0];

    // Log the usage transaction
    await query(
      `INSERT INTO transactions (user_id, type, amount, description, tier_after, credits_after)
       VALUES ($1, 'usage', -1, 'AI Solver query — Gemini analysis', $2, $3)`,
      [userId, tier, credits]
    );

    res.json({ credits, tier });
  } catch (err) {
    console.error('[Credits] Usage deduction error:', err);
    res.status(500).json({ error: 'Failed to process credit usage.' });
  }
});

/**
 * POST /api/credits/purchase
 * Add credits to user account (simulated payment — will integrate real payments later).
 * Body: { creditAmount, tierName, simulatedCost }
 */
router.post('/purchase', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { creditAmount, tierName, simulatedCost } = req.body;

    if (!creditAmount || creditAmount <= 0) {
      return res.status(400).json({ error: 'Invalid credit amount.' });
    }

    // Add credits and update tier
    const result = await query(
      `UPDATE users SET credits = credits + $1, tier = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING credits, tier`,
      [creditAmount, tierName, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const { credits, tier } = result.rows[0];

    // Log the purchase transaction
    await query(
      `INSERT INTO transactions (user_id, type, amount, description, payment_ref, tier_after, credits_after)
       VALUES ($1, 'purchase', $2, $3, $4, $5, $6)`,
      [
        userId,
        creditAmount,
        `Purchased ${creditAmount} credits — ${tierName} pack`,
        `simulated_${Date.now()}`, // Future: Stripe payment ID
        tier,
        credits,
      ]
    );

    res.json({
      credits,
      tier,
      message: `Successfully added ${creditAmount} credits!`,
    });
  } catch (err) {
    console.error('[Credits] Purchase error:', err);
    res.status(500).json({ error: 'Failed to process credit purchase.' });
  }
});

/**
 * GET /api/credits/history
 * Fetch transaction history for the authenticated user.
 * Query params: ?limit=20&offset=0
 */
router.get('/history', async (req, res) => {
  try {
    const userId = req.user.userId;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const offset = parseInt(req.query.offset) || 0;

    const result = await query(
      `SELECT id, type, amount, description, payment_ref, tier_after, credits_after, created_at
       FROM transactions
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    const countResult = await query(
      'SELECT COUNT(*) FROM transactions WHERE user_id = $1',
      [userId]
    );

    res.json({
      transactions: result.rows,
      total: parseInt(countResult.rows[0].count),
      limit,
      offset,
    });
  } catch (err) {
    console.error('[Credits] History fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch transaction history.' });
  }
});

export default router;
