/**
 * seed-dictionary.js
 * 
 * Initializes the `dictionary` table with the curated base word list.
 * Safe to run multiple times — uses ON CONFLICT to skip duplicates.
 * 
 * Usage:
 *   node server/seed-dictionary.js                  # Seed with the built-in word list
 *   node server/seed-dictionary.js --file words.txt  # Seed from a file (one word per line)
 *   node server/seed-dictionary.js --clear           # Clear all words first, then re-seed
 * 
 * Requirements:
 *   - DATABASE_URL must be set in the root .env file
 */

import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// ─── Built-in base dictionary ────────────────────────────────────────────────
const BASE_WORDS = [
  "ABOUT", "ABOVE", "ABUSE", "ACTOR", "ACUTE", "ADMIT", "ADOPT", "ADULT", "AFTER", "AGAIN",
  "AGENT", "AGREE", "AHEAD", "ALARM", "ALBUM", "ALERT", "ALIKE", "ALIVE", "ALLOW", "ALONE",
  "ALONG", "ALTER", "AMONG", "ANGER", "ANGLE", "ANGRY", "APART", "APPLE", "APPLY", "ARENA",
  "ARGUE", "ARISE", "ARRAY", "ARROW", "ASSET", "AUDIO", "AUDIT", "AVOID", "AWARD", "AWARE",
  "AWFUL", "BADLY", "BAKER", "BASES", "BASIC", "BASIS", "BEACH", "BEGAN", "BEGIN", "BEGUN",
  "BEING", "BELOW", "BENCH", "BILLY", "BIRTH", "BLACK", "BLADE", "BLAME", "BLIND", "BLOCK",
  "BLOOD", "BOARD", "BOOST", "BOOTH", "BOUND", "BRAIN", "BRAND", "BREAD", "BREAK", "BREED",
  "BRICK", "BRIDE", "BRIEF", "BRING", "BROAD", "BROKE", "BROWN", "BRUSH", "BUILD", "BUILT",
  "BUYER", "CABLE", "CALIF", "CARRY", "CARVE", "CATCH", "CAUSE", "CHAIN", "CHAIR", "CHART",
  "CHASE", "CHEAP", "CHECK", "CHEST", "CHIEF", "CHILD", "CHINA", "CHOIR", "CHOSE", "CHUCK",
  "CIVIC", "CLAIM", "CLASS", "CLEAN", "CLEAR", "CLIMB", "CLOCK", "CLOSE", "COACH", "COAST",
  "COUNT", "COURT", "COVER", "CRAFT", "CRANE", "CRASH", "CREAM", "CRIME", "CROSS", "CROWD",
  "CROWN", "CRUDE", "CRUSH", "CYCLE", "DAILY", "DANCE", "DEATH", "DELAY", "DEPTH", "DIRTY",
  "DOING", "DOUBT", "DRAFT", "DRAMA", "DREAM", "DRESS", "DRINK", "DRIVE", "EARLY", "EARTH",
  "EIGHT", "ELITE", "EMPTY", "ENEMY", "ENJOY", "ENTER", "ENTRY", "EQUAL", "ERROR", "EVENT",
  "EVERY", "EXACT", "EXIST", "EXTRA", "FAITH", "FALSE", "FATAL", "FAVOR", "FIBER", "FIELD",
  "FIFTH", "FIFTY", "FIGHT", "FINAL", "FIRST", "FIVE",  "FIXED", "FLAME", "FLESH", "FLOAT",
  "FLOOD", "FLOOR", "FLUID", "FLYER", "FOCUS", "FORCE", "FORUM", "FOUND", "FRAME", "FRANK",
  "FRAUD", "FRESH", "FRONT", "FRUIT", "FULLY", "FUNNY", "GIANT", "GIVEN", "GLASS", "GLOBE",
  "GOING", "GRACE", "GRADE", "GRAND", "GRANT", "GRASS", "GRAVE", "GREAT", "GREEN", "GRIEF",
  "GROSS", "GROUP", "GROWN", "GUARD", "GUEST", "GUIDE", "HABIT", "HAPPY", "HARSH", "HEART",
  "HEAVY", "HELLO", "HENRY", "IDEAL", "IMAGE", "INDEX", "INNER", "INPUT", "IRONY", "ISSUE",
  "ITEMS", "JOINT", "JUDGE", "JUICE", "KEEPS", "KNIFE", "KNOWN", "LABEL", "LABOR", "LARGE",
  "LASER", "LATER", "LATIN", "LAUGH", "LEACH", "LEARN", "LEASE", "LEAST", "LEMON", "LEVEL",
  "LIGHT", "LIMIT", "LINKS", "LIVES", "LOCAL", "LOCUS", "LOGIC", "LOOSE", "LOWER", "LUCKY",
  "LUNCH", "LYING", "MAGIC", "MAJOR", "MAKER", "MARCH", "MATCH", "MAYBE", "MAYOR", "MEANT",
  "MEDIA", "METAL", "MIGHT", "MINOR", "MINUS", "MIXED", "MODEL", "MONEY", "MONTH", "MOTOR",
  "MOUNT", "MOUSE", "MOUTH", "MOVIE", "MUSIC", "MYTHS", "NAIVE", "NAKED", "NIGHT", "NOISE",
  "NORTH", "NOTED", "NOVEL", "NURSE", "OCCUR", "OCEAN", "OFFER", "OFTEN", "ORDER", "OTHER",
  "OUGHT", "OUTER", "OWNED", "OWNER", "PANEL", "PAPER", "PARTY", "PEACE", "PETER", "PHASE",
  "PHONE", "PHOTO", "PIECE", "PILOT", "PITCH", "PIXEL", "PLACE", "PLAIN", "PLANE", "PLANT",
  "PLATE", "POINT", "POUND", "POWER", "PRESS", "PRICE", "PRIDE", "PRIME", "PRINT", "PRIOR",
  "PRIZE", "PROUD", "PROVE", "QUEEN", "QUERY", "QUICK", "QUIET", "QUITE", "RADIO", "RAISE",
  "RANGE", "RATIO", "REACH", "REACT", "READY", "REFER", "REGAL", "REIGN", "RELAX", "REPLY",
  "ROUTE", "ROYAL", "RULER", "RURAL", "SADLY", "SAINT", "SALAD", "SALES", "SALLY", "SAUCE",
  "SCALE", "SCENE", "SCENT", "SCOPE", "SCORE", "SENSE", "SERVE", "SEVEN", "SHADE", "SHAFT",
  "SHAKE", "SHALL", "SHAME", "SHAPE", "SHARE", "SHARP", "SHEET", "SHELF", "SHIFT", "SHINE",
  "SHIRT", "SHOCK", "SHOOT", "SHORT", "SHOWN", "SHRUB", "SIGHT", "SINCE", "SITES", "SIXTH",
  "SIXTY", "SIZED", "SKILL", "SLEEP", "SLIDE", "SMALL", "SMART", "SMILE", "SMOKE", "SOLID",
  "SOLVE", "SOUND", "SOUTH", "SPACE", "SPARE", "SPEAK", "SPEED", "SPEND", "SPENT", "SPICY",
  "SPIKE", "SPLIT", "SPOKE", "SPORT", "SPRAY", "STAFF", "STAGE", "STAIR", "STAKE", "STAND",
  "STARE", "START", "STATE", "STEAM", "STEEL", "STEEP", "STEER", "STEMS", "STEPS", "STICK",
  "STILL", "STING", "STOCK", "STONE", "STOOD", "STOOL", "STORE", "STORM", "STORY", "STRIP",
  "STUCK", "STUDY", "STUFF", "STYLE", "SUGAR", "SUITE", "SUPER", "SWEET", "SWEPT", "SWIFT",
  "SWING", "TABLE", "TAKEN", "TALES", "TASTE", "TAXES", "TEACH", "TEETH", "TEXAS", "THANK",
  "THEFT", "THEIR", "THEME", "THERE", "THESE", "THICK", "THING", "THINK", "THIRD", "THOSE",
  "THREE", "THREW", "THROW", "TIGHT", "TIMES", "TIRED", "TITLE", "TODAY", "TOKEN", "TONIC",
  "TOPIC", "TOTAL", "TOUCH", "TOWER", "TRACK", "TRADE", "TRAIL", "TRAIN", "TREAD", "TREAT",
  "TREND", "TRIAL", "TRIBE", "TRICK", "TRIED", "TRIES", "TROOP", "TRUCK", "TRULY", "TRUST",
  "TRUTH", "TWICE", "TWIST", "TYPES", "UNDER", "UNION", "UNITE", "UNITS", "UNTIL", "UPPER",
  "UPSET", "URBAN", "USAGE", "USING", "USUAL", "VAGUE", "VALID", "VALUE", "VAPID", "VIRUS",
  "VITAL", "VOICE", "VOWEL", "WAGON", "WASTE", "WATCH", "WATER", "WEARY", "WEIGH", "WHEAT",
  "WHEEL", "WHERE", "WHICH", "WHILE", "WHITE", "WHOLE", "WHOSE", "WIDOW", "WIDTH", "WINDY",
  "WIVES", "WOMAN", "WOMEN", "WORLD", "WORRY", "WORSE", "WORST", "WORTH", "WOULD", "WOUND",
  "WRITE", "WRONG", "WROTE", "YIELD", "YOUNG", "YOUTH", "ZEBRA", "ZONES",
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Validate a single word: must be exactly 5 uppercase letters.
 */
function isValidWord(word) {
  return typeof word === 'string' && word.length === 5 && /^[A-Z]{5}$/.test(word);
}

/**
 * Load words from a text file (one word per line).
 */
function loadWordsFromFile(filePath) {
  const resolvedPath = path.resolve(filePath);
  if (!fs.existsSync(resolvedPath)) {
    console.error(`[Seed] File not found: ${resolvedPath}`);
    process.exit(1);
  }
  const content = fs.readFileSync(resolvedPath, 'utf-8');
  return content
    .split('\n')
    .map(line => line.trim().toUpperCase())
    .filter(line => line.length > 0);
}

// ─── Main seed logic ─────────────────────────────────────────────────────────

async function seed() {
  const args = process.argv.slice(2);
  const clearFlag = args.includes('--clear');
  const fileIndex = args.indexOf('--file');
  const filePath = fileIndex !== -1 ? args[fileIndex + 1] : null;

  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║       Wordle Solver — Dictionary Seed Script     ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log();

  // 1. Determine word source
  let rawWords;
  if (filePath) {
    console.log(`[Seed] Loading words from file: ${filePath}`);
    rawWords = loadWordsFromFile(filePath);
  } else {
    console.log('[Seed] Using built-in base dictionary');
    rawWords = [...BASE_WORDS];
  }

  // 2. Validate and deduplicate
  const seen = new Set();
  const validWords = [];
  const invalidWords = [];
  const duplicates = [];

  for (const word of rawWords) {
    if (!isValidWord(word)) {
      invalidWords.push(word);
      continue;
    }
    if (seen.has(word)) {
      duplicates.push(word);
      continue;
    }
    seen.add(word);
    validWords.push(word);
  }

  console.log(`[Seed] Input stats:`);
  console.log(`       Total raw words:    ${rawWords.length}`);
  console.log(`       Valid & unique:     ${validWords.length}`);
  console.log(`       Duplicates skipped: ${duplicates.length}`);
  console.log(`       Invalid skipped:    ${invalidWords.length}`);
  if (invalidWords.length > 0) {
    console.log(`       Invalid words:      ${invalidWords.slice(0, 10).join(', ')}${invalidWords.length > 10 ? '...' : ''}`);
  }
  console.log();

  // 3. Connect to database
  const client = await pool.connect();

  try {
    // Ensure the dictionary table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS dictionary (
        id         SERIAL PRIMARY KEY,
        word       VARCHAR(5) UNIQUE NOT NULL,
        is_active  BOOLEAN DEFAULT TRUE NOT NULL,
        added_by   VARCHAR(100) DEFAULT 'system' NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // 4. Optionally clear existing words
    if (clearFlag) {
      const deleteResult = await client.query('DELETE FROM dictionary');
      console.log(`[Seed] Cleared ${deleteResult.rowCount} existing words from dictionary.`);
    }

    // 5. Check how many words already exist
    const beforeResult = await client.query('SELECT COUNT(*) AS count FROM dictionary');
    const beforeCount = parseInt(beforeResult.rows[0].count, 10);
    console.log(`[Seed] Words currently in dictionary: ${beforeCount}`);

    // 6. Batch insert using a single query with UNNEST for efficiency
    //    ON CONFLICT DO NOTHING safely handles duplicates against what's already in DB
    const insertResult = await client.query(
      `INSERT INTO dictionary (word, added_by)
       SELECT unnest($1::varchar[]), 'seed-script'
       ON CONFLICT (word) DO NOTHING`,
      [validWords]
    );
    const inserted = insertResult.rowCount;

    // 7. Final count
    const afterResult = await client.query('SELECT COUNT(*) AS count FROM dictionary');
    const afterCount = parseInt(afterResult.rows[0].count, 10);

    console.log();
    console.log('┌──────────────────────────────────────┐');
    console.log('│           Seed Results               │');
    console.log('├──────────────────────────────────────┤');
    console.log(`│  New words inserted:   ${String(inserted).padStart(12)} │`);
    console.log(`│  Already existed:      ${String(validWords.length - inserted).padStart(12)} │`);
    console.log(`│  Total in dictionary:  ${String(afterCount).padStart(12)} │`);
    console.log('└──────────────────────────────────────┘');
    console.log();
    console.log('[Seed] Done! ✅');

  } catch (err) {
    console.error('[Seed] Error:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
