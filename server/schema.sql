-- Wordle Solver Database Schema
-- Target: Neon Postgres

-- Users table: stores Google OAuth profile + credit balance
CREATE TABLE IF NOT EXISTS users (
    id              SERIAL PRIMARY KEY,
    google_id       VARCHAR(255) UNIQUE NOT NULL,
    email           VARCHAR(255) UNIQUE NOT NULL,
    name            VARCHAR(255) NOT NULL,
    avatar_url      TEXT,
    credits         INTEGER DEFAULT 30 NOT NULL,
    tier            VARCHAR(50) DEFAULT 'Free Solver' NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Custom words per user (persistent dictionary across sessions)
CREATE TABLE IF NOT EXISTS user_words (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
    word            VARCHAR(5) NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, word)
);

-- Transaction log for credit purchases, usage, and bonuses
CREATE TABLE IF NOT EXISTS transactions (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type            VARCHAR(20) NOT NULL CHECK (type IN ('purchase', 'usage', 'bonus', 'signup')),
    amount          INTEGER NOT NULL,
    description     TEXT,
    payment_ref     VARCHAR(255),
    tier_after      VARCHAR(50),
    credits_after   INTEGER NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Global dictionary: community-validated words added by users via Dictionary API.
-- The base word list (14,855 words) lives in valid-wordle-list.txt on disk.
-- This table ONLY stores new words contributed by users and validated externally.
CREATE TABLE IF NOT EXISTS dictionary (
    id              SERIAL PRIMARY KEY,
    word            VARCHAR(5) UNIQUE NOT NULL,
    is_active       BOOLEAN DEFAULT TRUE NOT NULL,
    added_by        VARCHAR(100) DEFAULT 'system' NOT NULL,
    added_by_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_words_user_id ON user_words(user_id);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_dictionary_word ON dictionary(word);
CREATE INDEX IF NOT EXISTS idx_dictionary_active ON dictionary(is_active) WHERE is_active = TRUE;
