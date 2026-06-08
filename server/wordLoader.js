/**
 * wordLoader.js
 * 
 * Loads the base dictionary from valid-wordle-list.txt into memory.
 * This is a read-only Set used for fast lookups — never written to the DB.
 * 
 * The solver word pool = baseWords (this file) + dictionary table + user_words
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WORD_FILE_PATH = path.join(__dirname, '..', 'valid-wordle-list.txt');

/** @type {Set<string>} Uppercase 5-letter words from the txt file */
let baseWords = new Set();

/**
 * Load the txt file into memory. Called once on server startup.
 */
export function loadBaseWords() {
  try {
    const content = fs.readFileSync(WORD_FILE_PATH, 'utf-8');
    const words = content
      .split('\n')
      .map(w => w.trim().toUpperCase())
      .filter(w => w.length === 5 && /^[A-Z]{5}$/.test(w));

    baseWords = new Set(words);
    console.log(`[WordLoader] Loaded ${baseWords.size} base words from valid-wordle-list.txt`);
  } catch (err) {
    console.error('[WordLoader] Failed to load word file:', err.message);
    console.error('[WordLoader] Solver will operate with an empty base dictionary.');
  }
}

/**
 * Check if a word exists in the base dictionary (the txt file).
 * @param {string} word - Uppercase 5-letter word
 * @returns {boolean}
 */
export function isInBaseDictionary(word) {
  return baseWords.has(word.toUpperCase());
}

/**
 * Get all base words as an array.
 * @returns {string[]}
 */
export function getBaseWords() {
  return [...baseWords];
}

/**
 * Get the count of base words.
 * @returns {number}
 */
export function getBaseWordCount() {
  return baseWords.size;
}
