/**
 * Execute fetch with exponential backoff retry.
 */
export const fetchWithRetry = async (url, options, retries = 5, delay = 1000) => {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`API returned status ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        if (retries > 1) {
            await new Promise(resolve => setTimeout(resolve, delay));
            return fetchWithRetry(url, options, retries - 1, delay * 2);
        }
        throw error;
    }
};

/**
 * Auth API calls
 */
export const authApi = {
    async restoreSession() {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (!res.ok) return null;
        const data = await res.json();
        return data.user;
    },

    async googleSignIn(credential) {
        const res = await fetch('/api/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ credential }),
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Sign-in failed');
        }
        return res.json();
    },

    async logout() {
        await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
        });
    },
};

/**
 * Credits API calls
 */
export const creditsApi = {
    async useCredit() {
        const res = await fetch('/api/credits/use', {
            method: 'POST',
            credentials: 'include',
        });
        if (!res.ok) {
            const err = await res.json();
            throw Object.assign(new Error(err.error || 'Failed to deduct credit'), { status: res.status });
        }
        return res.json();
    },

    async purchase(creditAmount, tierName, simulatedCost) {
        const res = await fetch('/api/credits/purchase', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ creditAmount, tierName, simulatedCost }),
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error);
        }
        return res.json();
    },
};

/**
 * Words/Dictionary API calls
 */
export const wordsApi = {
    async fetchAll() {
        const res = await fetch('/api/words', { credentials: 'include' });
        if (!res.ok) return [];
        const data = await res.json();
        return data.words;
    },

    async add(word) {
        const res = await fetch('/api/words', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ word }),
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error);
        }
        return res.json();
    },

    async remove(word) {
        await fetch(`/api/words/${word}`, {
            method: 'DELETE',
            credentials: 'include',
        });
    },
};

/**
 * Dictionary API calls (global master dictionary + validation)
 */
export const dictionaryApi = {
    async validateWord(word) {
        try {
            const res = await fetch(`/api/dictionary/validate/${word.toUpperCase()}`, {
                credentials: 'include',
            });
            if (!res.ok) return { valid: true, source: 'fallback' }; // fail open
            return res.json();
        } catch {
            // Network error — fail open
            return { valid: true, source: 'fallback' };
        }
    },

    async fetchAll() {
        const res = await fetch('/api/dictionary');
        if (!res.ok) return [];
        const data = await res.json();
        return data.words;
    },
};
