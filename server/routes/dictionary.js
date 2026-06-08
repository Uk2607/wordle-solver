import { Router } from 'express';
import { query } from '../db.js';
import { isInBaseDictionary, getBaseWords, getBaseWordCount } from '../wordLoader.js';

const router = Router();

/**
 * GET /api/dictionary
 * Returns the FULL solver word pool:
 *   baseWords (from txt file) + community words (from dictionary table)
 * 
 * Query params:
 *   ?source=base     — only base words (txt file)
 *   ?source=community — only community-contributed words (DB)
 *   (default)        — merged, deduplicated
 */
router.get('/', async (req, res) => {
  try {
    const source = req.query.source;

    if (source === 'base') {
      const words = getBaseWords();
      return res.json({ words, count: words.length, source: 'base' });
    }

    // Get community words from DB
    const dbResult = await query(
      'SELECT word FROM dictionary WHERE is_active = TRUE ORDER BY word',
      []
    );
    const communityWords = dbResult.rows.map(r => r.word);

    if (source === 'community') {
      return res.json({ words: communityWords, count: communityWords.length, source: 'community' });
    }

    // Default: merge and deduplicate
    const baseWords = getBaseWords();
    const merged = new Set([...baseWords, ...communityWords]);
    const allWords = [...merged].sort();

    return res.json({
      words: allWords,
      count: allWords.length,
      baseCount: baseWords.length,
      communityCount: communityWords.length,
    });
  } catch (err) {
    console.error('[Dictionary] Fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch dictionary.' });
  }
});

/**
 * GET /api/dictionary/validate/:word
 * Validate whether a word is recognized.
 * 
 * Priority:
 *   1. In base dictionary (txt file)? → valid
 *   2. In community dictionary (DB table)? → valid
 *   3. In user's personal words? → valid
 *   4. External Dictionary API → valid/invalid
 */
router.get('/validate/:word', async (req, res) => {
  try {
    const word = req.params.word?.trim().toUpperCase();

    if (!word || word.length !== 5 || !/^[A-Z]{5}$/.test(word)) {
      return res.json({ valid: false, source: null, reason: 'Must be exactly 5 alphabetical characters.' });
    }

    // 1. Check base dictionary (txt file — instant)
    if (isInBaseDictionary(word)) {
      return res.json({ valid: true, source: 'base' });
    }

    // 2. Check community dictionary (DB)
    const dictResult = await query(
      'SELECT id FROM dictionary WHERE word = $1 AND is_active = TRUE LIMIT 1',
      [word]
    );
    if (dictResult.rows.length > 0) {
      return res.json({ valid: true, source: 'community' });
    }

    // 3. Check user's personal words (optional auth)
    let userId = null;
    try {
      const cookieToken = req.cookies?.token;
      if (cookieToken) {
        const jwt = await import('jsonwebtoken');
        const decoded = jwt.default.verify(cookieToken, process.env.JWT_SECRET);
        userId = decoded.userId;
      }
    } catch {
      // No valid token
    }

    if (userId) {
      const userWordResult = await query(
        'SELECT id FROM user_words WHERE user_id = $1 AND word = $2 LIMIT 1',
        [userId, word]
      );
      if (userWordResult.rows.length > 0) {
        return res.json({ valid: true, source: 'user_words' });
      }
    }

    // 4. External Dictionary API
    const externalValid = await validateWithExternalAPI(word);
    if (externalValid) {
      return res.json({ valid: true, source: 'external_api' });
    }

    return res.json({ valid: false, source: null, reason: `"${word}" is not a recognized English word.` });

  } catch (err) {
    console.error('[Dictionary] Validation error:', err);
    res.json({ valid: true, source: 'fallback', reason: 'Validation service unavailable, word accepted.' });
  }
});

/**
 * GET /api/dictionary/stats
 * Quick stats about the dictionary.
 */
router.get('/stats', async (req, res) => {
  try {
    const dbResult = await query('SELECT COUNT(*) AS count FROM dictionary WHERE is_active = TRUE', []);
    res.json({
      baseWords: getBaseWordCount(),
      communityWords: parseInt(dbResult.rows[0].count, 10),
      total: getBaseWordCount() + parseInt(dbResult.rows[0].count, 10),
    });
  } catch (err) {
    console.error('[Dictionary] Stats error:', err);
    res.status(500).json({ error: 'Failed to fetch stats.' });
  }
});

/**
 * Check a word against the free Dictionary API.
 */
async function validateWithExternalAPI(word) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`,
      { signal: controller.signal }
    );

    clearTimeout(timeout);

    if (response.ok) return true;
    if (response.status === 404) return false;
    return true; // Unknown status — fail open
  } catch (err) {
    console.warn('[Dictionary] External API unreachable, failing open:', err.message);
    return true;
  }
}

export { validateWithExternalAPI };
export default router;
