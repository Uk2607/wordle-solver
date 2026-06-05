import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// All word routes require authentication
router.use(requireAuth);

/**
 * GET /api/words
 * Fetch all custom dictionary words for the authenticated user.
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await query(
      'SELECT word, created_at FROM user_words WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.json({
      words: result.rows.map(r => r.word),
    });
  } catch (err) {
    console.error('[Words] Fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch custom dictionary.' });
  }
});

/**
 * POST /api/words
 * Add a word to the user's custom dictionary.
 * Body: { word }
 */
router.post('/', async (req, res) => {
  try {
    const userId = req.user.userId;
    const word = req.body.word?.trim().toUpperCase();

    if (!word || word.length !== 5 || !/^[A-Z]+$/.test(word)) {
      return res.status(400).json({ error: 'Word must be exactly 5 alphabetical characters.' });
    }

    // Insert with conflict handling (ignore duplicate)
    await query(
      `INSERT INTO user_words (user_id, word) VALUES ($1, $2)
       ON CONFLICT (user_id, word) DO NOTHING`,
      [userId, word]
    );

    res.json({ message: `Added "${word}" to your dictionary.`, word });
  } catch (err) {
    console.error('[Words] Add error:', err);
    res.status(500).json({ error: 'Failed to add word to dictionary.' });
  }
});

/**
 * DELETE /api/words/:word
 * Remove a word from the user's custom dictionary.
 */
router.delete('/:word', async (req, res) => {
  try {
    const userId = req.user.userId;
    const word = req.params.word?.trim().toUpperCase();

    if (!word) {
      return res.status(400).json({ error: 'Word parameter is required.' });
    }

    const result = await query(
      'DELETE FROM user_words WHERE user_id = $1 AND word = $2',
      [userId, word]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Word not found in your dictionary.' });
    }

    res.json({ message: `Removed "${word}" from your dictionary.` });
  } catch (err) {
    console.error('[Words] Delete error:', err);
    res.status(500).json({ error: 'Failed to remove word from dictionary.' });
  }
});

export default router;
