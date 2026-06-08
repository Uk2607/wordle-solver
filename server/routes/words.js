import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { isInBaseDictionary } from '../wordLoader.js';
import { validateWithExternalAPI } from './dictionary.js';

const router = Router();

// All word routes require authentication
router.use(requireAuth);

/**
 * GET /api/words
 * Fetch the user's personal (unverified) words from user_words.
 * These are words NOT in the base dictionary and NOT validated by the Dictionary API.
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
    res.status(500).json({ error: 'Failed to fetch personal dictionary.' });
  }
});

/**
 * POST /api/words
 * Smart word addition flow:
 * 
 *   1. Already in base dictionary (txt file)? → "Already exists"
 *   2. Already in community dictionary (DB)? → "Already exists"
 *   3. Already in user's personal words? → "Already added"
 *   4. Validate via external Dictionary API:
 *      a. Valid → Add to `dictionary` table (global, permanent, with user ID)
 *      b. Invalid → Add to `user_words` table (personal, deletable) + warning
 * 
 * Body: { word }
 */
router.post('/', async (req, res) => {
  try {
    const userId = req.user.userId;
    const word = req.body.word?.trim().toUpperCase();

    // Basic validation
    if (!word || word.length !== 5 || !/^[A-Z]+$/.test(word)) {
      return res.status(400).json({ error: 'Word must be exactly 5 alphabetical characters.' });
    }

    // 1. Check base dictionary (txt file)
    if (isInBaseDictionary(word)) {
      return res.status(409).json({
        error: `"${word}" already exists in the base dictionary.`,
        exists: true,
        source: 'base',
      });
    }

    // 2. Check community dictionary (DB)
    const dictResult = await query(
      'SELECT id FROM dictionary WHERE word = $1 LIMIT 1',
      [word]
    );
    if (dictResult.rows.length > 0) {
      return res.status(409).json({
        error: `"${word}" already exists in the community dictionary.`,
        exists: true,
        source: 'community',
      });
    }

    // 3. Check user's personal words
    const userWordResult = await query(
      'SELECT id FROM user_words WHERE user_id = $1 AND word = $2 LIMIT 1',
      [userId, word]
    );
    if (userWordResult.rows.length > 0) {
      return res.status(409).json({
        error: `"${word}" is already in your personal dictionary.`,
        exists: true,
        source: 'user_words',
      });
    }

    // 4. Validate via external Dictionary API
    let isValidEnglish = false;
    try {
      isValidEnglish = await validateWithExternalAPI(word);
    } catch {
      // API unreachable — treat as unverified
      isValidEnglish = false;
    }

    if (isValidEnglish) {
      // ✅ Valid English word → Add to global community dictionary
      // ON CONFLICT handles the rare case of two users adding the same word simultaneously
      await query(
        `INSERT INTO dictionary (word, added_by, added_by_user_id)
         VALUES ($1, 'user', $2)
         ON CONFLICT (word) DO NOTHING`,
        [word, userId]
      );

      // Fetch user name for response
      const userResult = await query('SELECT name FROM users WHERE id = $1', [userId]);
      const userName = userResult.rows[0]?.name || 'Unknown';

      return res.json({
        message: `"${word}" has been verified and added to the global dictionary! All users can now see it.`,
        word,
        target: 'dictionary',
        verified: true,
        addedBy: userName,
      });
    } else {
      // ❌ Not a valid English word → Add to personal dictionary only
      await query(
        `INSERT INTO user_words (user_id, word) VALUES ($1, $2)
         ON CONFLICT (user_id, word) DO NOTHING`,
        [userId, word]
      );

      return res.json({
        message: `"${word}" could not be verified as a valid English word. It has been added to your personal dictionary only. Note: using unverified words may impact solver accuracy. You can remove it anytime.`,
        word,
        target: 'user_words',
        verified: false,
      });
    }
  } catch (err) {
    console.error('[Words] Add error:', err);
    res.status(500).json({ error: 'Failed to add word to dictionary.' });
  }
});

/**
 * DELETE /api/words/:word
 * Remove a word from the user's personal dictionary (user_words ONLY).
 * Words in the global dictionary or base dictionary cannot be deleted by users.
 */
router.delete('/:word', async (req, res) => {
  try {
    const userId = req.user.userId;
    const word = req.params.word?.trim().toUpperCase();

    if (!word) {
      return res.status(400).json({ error: 'Word parameter is required.' });
    }

    // Only allow deleting from user_words (personal/unverified)
    const result = await query(
      'DELETE FROM user_words WHERE user_id = $1 AND word = $2',
      [userId, word]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: 'Word not found in your personal dictionary. Only unverified personal words can be deleted.',
      });
    }

    res.json({ message: `Removed "${word}" from your personal dictionary.` });
  } catch (err) {
    console.error('[Words] Delete error:', err);
    res.status(500).json({ error: 'Failed to remove word from dictionary.' });
  }
});

export default router;
