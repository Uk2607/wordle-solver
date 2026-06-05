/**
 * Filter words from dictionary based on Wordle board constraints.
 */
export function getFilteredWords(rows, fullDictionary) {
    const validGuesses = rows.filter(r => r.word.trim().length === 5);

    if (validGuesses.length === 0) {
        return fullDictionary;
    }

    return fullDictionary.filter(candidate => {
        const candidateUpper = candidate.toUpperCase();

        for (const guessObj of validGuesses) {
            const guess = guessObj.word.toUpperCase();
            const colors = guessObj.colors;

            const computedColors = Array(5).fill("gray");
            const candidateMatched = Array(5).fill(false);
            const guessMatched = Array(5).fill(false);

            // 1st pass: Correct letter green matches
            for (let i = 0; i < 5; i++) {
                if (guess[i] === candidateUpper[i]) {
                    computedColors[i] = "green";
                    candidateMatched[i] = true;
                    guessMatched[i] = true;
                }
            }

            // 2nd pass: Present letter yellow matches
            for (let i = 0; i < 5; i++) {
                if (guessMatched[i]) continue;
                for (let j = 0; j < 5; j++) {
                    if (!candidateMatched[j] && guess[i] === candidateUpper[j]) {
                        computedColors[i] = "yellow";
                        candidateMatched[j] = true;
                        break;
                    }
                }
            }

            for (let i = 0; i < 5; i++) {
                if (computedColors[i] !== colors[i]) {
                    return false;
                }
            }
        }

        return true;
    });
}

/**
 * Score and rank words based on character frequency in remaining pool.
 */
export function getScoredSuggestions(filteredWords) {
    if (filteredWords.length === 0) return [];

    const charFreqs = {};
    filteredWords.forEach(word => {
        const uniqueLetters = [...new Set(word)];
        uniqueLetters.forEach(char => {
            charFreqs[char] = (charFreqs[char] || 0) + 1;
        });
    });

    const scored = filteredWords.map(word => {
        let score = 0;
        const seenLetters = new Set();
        for (let i = 0; i < word.length; i++) {
            const letter = word[i];
            if (!seenLetters.has(letter)) {
                score += charFreqs[letter] || 0;
                seenLetters.add(letter);
            }
        }
        return { word, score };
    });

    return scored.sort((a, b) => b.score - a.score);
}

/**
 * Build keyboard letter states from grid rows.
 */
export function getKeyboardStates(rows) {
    const states = {};
    rows.forEach(row => {
        if (row.word.length === 5) {
            for (let i = 0; i < 5; i++) {
                const char = row.word[i];
                const color = row.colors[i];
                if (color === "green") {
                    states[char] = "green";
                } else if (color === "yellow" && states[char] !== "green") {
                    states[char] = "yellow";
                } else if (color === "gray" && states[char] !== "green" && states[char] !== "yellow") {
                    states[char] = "gray";
                }
            }
        }
    });
    return states;
}

/**
 * Get CSS class for a keyboard key based on its state.
 */
export function getKeyboardColorClass(char, keyStates) {
    if (char === "ENTER" || char === "BACKSPACE") {
        return "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white px-2 text-[10px]";
    }
    const state = keyStates[char];
    if (state === "green") return "bg-emerald-600 text-white font-bold hover:bg-emerald-500 shadow-emerald-950/20";
    if (state === "yellow") return "bg-amber-500 text-white font-bold hover:bg-amber-400 shadow-amber-950/20";
    if (state === "gray") return "bg-slate-700/80 text-slate-400 line-through decoration-1 hover:bg-slate-600 shadow-slate-900/20";
    return "bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white";
}
