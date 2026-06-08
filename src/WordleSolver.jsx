import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNotification } from './hooks/useNotification.js';
import { useAuth } from './hooks/useAuth.js';
import { fetchWithRetry, creditsApi, wordsApi, dictionaryApi } from './utils/api.js';
import { BASE_DICTIONARY, createEmptyRows } from './utils/constants.js';
import { getFilteredWords, getScoredSuggestions, getKeyboardStates } from './utils/solver.js';

// Components
import Header from './components/Header.jsx';
import WordleGrid from './components/WordleGrid.jsx';
import VirtualKeyboard from './components/VirtualKeyboard.jsx';
import SolverHeader from './components/SolverHeader.jsx';
import AlgorithmicPanel from './components/AlgorithmicPanel.jsx';
import AIPanel from './components/AIPanel.jsx';
import DictionarySection from './components/DictionarySection.jsx';
import CreditsModal from './components/CreditsModal.jsx';
import HowToPlayModal from './components/HowToPlayModal.jsx';
import Notification from './components/Notification.jsx';

export default function App() {
    // Game State
    const [rows, setRows] = useState(createEmptyRows());
    const [activeRowIndex, setActiveRowIndex] = useState(0);
    const [activeCellIndex, setActiveCellIndex] = useState(0);
    const [solverMode, setSolverMode] = useState("algo"); // "algo" | "ai"

    // UI State
    const [newCustomWord, setNewCustomWord] = useState("");
    const [showHowToPlay, setShowHowToPlay] = useState(false);
    const [showCreditsModal, setShowCreditsModal] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    // AI Solver State
    const [aiLoading, setAiLoading] = useState(false);
    const [aiResponse, setAiResponse] = useState(null);
    const [aiError, setAiError] = useState(null);
    const [validating, setValidating] = useState(false);

    // Refs
    const gridContainerRef = useRef(null);

    // Custom Hooks
    const { notification, triggerNotification, clearNotification } = useNotification();
    const {
        user,
        isLoggedIn,
        authLoading,
        googleBtnRef,
        customDictionary,
        setCustomDictionary,
        handleSignOut: rawSignOut,
        updateUser
    } = useAuth(triggerNotification);

    // Wrap sign-out to also clear local UI state
    const handleSignOut = async () => {
        await rawSignOut();
        setAiResponse(null);
        setAiError(null);
        setShowProfileMenu(false);
    };

    const fullDictionary = [...BASE_DICTIONARY, ...customDictionary];

    // ─── Actions ──────────────────────────────────────────────────

    const handleReset = () => {
        setRows(createEmptyRows());
        setActiveRowIndex(0);
        setActiveCellIndex(0);
        setAiResponse(null);
        setAiError(null);
        triggerNotification("Solver board reset. Ready for a new challenge!", "success");
    };

    const handleCellClick = (rowIndex, cellIndex) => {
        setActiveRowIndex(rowIndex);
        setActiveCellIndex(cellIndex);
        if (rows[rowIndex].word[cellIndex]) {
            handleToggleColor(rowIndex, cellIndex);
        }
    };

    const handleToggleColor = (rowIndex, cellIndex) => {
        const nextColorMap = { gray: "yellow", yellow: "green", green: "gray" };
        setRows(prev => prev.map((row, rIdx) => {
            if (rIdx === rowIndex) {
                const nextColors = [...row.colors];
                nextColors[cellIndex] = nextColorMap[row.colors[cellIndex]];
                return { ...row, colors: nextColors };
            }
            return row;
        }));
    };

    const handleTypeLetter = useCallback((letter) => {
        setRows(prev => prev.map((row, rIdx) => {
            if (rIdx === activeRowIndex) {
                if (row.word.length < 5) {
                    const nextWord = row.word + letter;
                    if (activeCellIndex < 4) {
                        setActiveCellIndex(activeCellIndex + 1);
                    }
                    return { ...row, word: nextWord };
                }
            }
            return row;
        }));
    }, [activeRowIndex, activeCellIndex]);

    const handleDeleteLetter = useCallback(() => {
        setRows(prev => prev.map((row, rIdx) => {
            if (rIdx === activeRowIndex) {
                let nextWord = row.word;
                if (activeCellIndex === 4 && row.word.length === 5) {
                    nextWord = row.word.slice(0, 4);
                    return { ...row, word: nextWord };
                }
                const targetIdx = Math.max(0, row.word.length - 1);
                nextWord = row.word.slice(0, targetIdx);
                if (activeCellIndex > 0) {
                    setActiveCellIndex(activeCellIndex - 1);
                }
                return { ...row, word: nextWord };
            }
            return row;
        }));
    }, [activeRowIndex, activeCellIndex]);

    const handleEnterRow = useCallback(async () => {
        const currentWord = rows[activeRowIndex].word;
        if (currentWord.length !== 5) {
            return triggerNotification("Please fill in all 5 letters of the current row first.", "warning");
        }

        // Validate the word before locking the row
        setValidating(true);
        try {
            const result = await dictionaryApi.validateWord(currentWord);
            if (!result.valid) {
                setValidating(false);
                return triggerNotification(
                    `"${currentWord}" is not a recognized English word. Please enter a valid 5-letter word.`,
                    "error"
                );
            }
        } catch {
            // Validation service unavailable — fail open, let the word through
        }
        setValidating(false);

        if (activeRowIndex < 4) {
            setActiveRowIndex(activeRowIndex + 1);
            setActiveCellIndex(0);
            triggerNotification(`Row ${activeRowIndex + 1} locked! Moving to Row ${activeRowIndex + 2}. Check recommendations!`, "success");
        } else {
            triggerNotification("All 5 Wordle rows have been configured!", "success");
        }
    }, [activeRowIndex, rows, triggerNotification]);

    // Keyboard support
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (document.activeElement?.tagName === 'INPUT') return;
            const key = e.key.toUpperCase();
            if (key === "BACKSPACE") {
                handleDeleteLetter();
            } else if (key === "ENTER") {
                handleEnterRow();
            } else if (/^[A-Z]$/.test(key)) {
                handleTypeLetter(key);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleTypeLetter, handleDeleteLetter, handleEnterRow]);

    const handleApplyWord = (word) => {
        setRows(prev => prev.map((row, rIdx) => {
            if (rIdx === activeRowIndex) {
                return { ...row, word: word.toUpperCase() };
            }
            return row;
        }));
        setActiveCellIndex(4);
        triggerNotification(`Applied suggestion "${word.toUpperCase()}" into Row ${activeRowIndex + 1}!`, "success");
    };

    // Dictionary Actions
    const handleAddCustomWord = async () => {
        const cleaned = newCustomWord.trim().toUpperCase();
        if (cleaned.length !== 5) return triggerNotification("Word must be exactly 5 letters long.", "warning");
        if (!/^[A-Z]+$/.test(cleaned)) return triggerNotification("Word must only contain alphabetical characters.", "warning");
        if (fullDictionary.includes(cleaned)) return triggerNotification("This word already exists in the dictionary.", "warning");

        // Validate the word is a real English word before adding
        setValidating(true);
        try {
            const result = await dictionaryApi.validateWord(cleaned);
            if (!result.valid) {
                setValidating(false);
                return triggerNotification(
                    `"${cleaned}" is not a recognized English word. Cannot add to dictionary.`,
                    "error"
                );
            }
        } catch {
            // Fail open
        }
        setValidating(false);

        if (user) {
            try {
                await wordsApi.add(cleaned);
            } catch (err) {
                triggerNotification("Failed to save word to your account. Added locally.", "warning");
            }
        }
        setCustomDictionary(prev => [...prev, cleaned]);
        setNewCustomWord("");
        triggerNotification(`Added "${cleaned}" to the ${user ? 'synced' : 'local'} dictionary!`, "success");
    };

    const handleRemoveCustomWord = async (wordToRemove) => {
        if (user) {
            try {
                await wordsApi.remove(wordToRemove);
            } catch {
                // Continue local remove
            }
        }
        setCustomDictionary(prev => prev.filter(w => w !== wordToRemove));
        triggerNotification(`Removed "${wordToRemove}" from the custom dictionary.`, "info");
    };

    const handlePurchaseCredits = async (creditAmount, tierName, simulatedCost) => {
        if (!user) return triggerNotification("Please sign in first.", "warning");
        try {
            const data = await creditsApi.purchase(creditAmount, tierName, simulatedCost);
            updateUser({ credits: data.credits, tier: data.tier });
            triggerNotification(`Payment of $${simulatedCost} processed! Added ${creditAmount} credits.`, "success");
            setShowCreditsModal(false);
        } catch (err) {
            triggerNotification("Failed to process credit purchase. Please try again.", "error");
        }
    };

    const getAISuggestions = async () => {
        if (!user) return triggerNotification("Authentication Required! Please sign in to consult AI.", "warning");
        if (user.credits <= 0) {
            setShowCreditsModal(true);
            return triggerNotification("Out of AI Credits! Please select a refill package.", "warning");
        }

        const filledGuesses = rows.filter(r => r.word.trim().length === 5);
        if (filledGuesses.length === 0) return triggerNotification("Please enter at least one word to get AI advice.", "warning");

        setAiLoading(true);
        setAiError(null);
        setAiResponse(null);

        try {
            const creditData = await creditsApi.useCredit();
            updateUser({ credits: creditData.credits, tier: creditData.tier });
        } catch (err) {
            setAiLoading(false);
            if (err.status === 402) {
                setShowCreditsModal(true);
                return triggerNotification("Out of AI Credits! Please refill.", "warning");
            }
            return triggerNotification(err.message || "Failed to deduct credit.", "error");
        }

        const guessHistory = filledGuesses.map((g, index) => {
            const clueDetails = g.colors.map((color, i) => `${g.word[i]} (${color.toUpperCase()})`).join(", ");
            return `Level Row ${index + 1}: Word "${g.word}" -> Feedback colors: [${clueDetails}]`;
        }).join("\n");

        const systemPrompt = `You are a Wordle AI Solver Assistant. Analyze feedback clues and recommend the best strategic next guesses.
- GREEN means correct slot.
- YELLOW means in word but wrong slot.
- GRAY means absent.
Provide highly strategic suggestions to crack the word quickly. Verify constraints.`;

        const userPrompt = `History of guesses:\n${guessHistory}\nDetermine:
1. exactWordMatched: Deterministic matching word if 100% proven, else empty string.
2. analysis: Short recap.
3. suggestions: 5 creative next best words with detailed reasoning and confidence %.`;

        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

        const payload = {
            contents: [{ parts: [{ text: userPrompt }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        exactWordMatched: { type: "STRING" },
                        analysis: { type: "STRING" },
                        suggestions: {
                            type: "ARRAY",
                            items: {
                                type: "OBJECT",
                                properties: {
                                    word: { type: "STRING" },
                                    reasoning: { type: "STRING" },
                                    confidence: { type: "INTEGER" }
                                },
                                required: ["word", "reasoning", "confidence"]
                            }
                        }
                    },
                    required: ["exactWordMatched", "analysis", "suggestions"]
                }
            }
        };

        try {
            const data = await fetchWithRetry(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
                setAiResponse(JSON.parse(text));
                triggerNotification("AI Solver successfully computed strategic solutions! -1 Credit Used.", "success");
            } else {
                throw new Error("No response parts received from model.");
            }
        } catch (err) {
            setAiError("Failed to reach the AI model or retrieve valid data. Please try again or use the Algorithmic mode.");
            triggerNotification("AI query failed. Using exponential fallback retry logic.", "error");
        } finally {
            setAiLoading(false);
        }
    };

    // Derived values
    const filteredWords = getFilteredWords(rows, fullDictionary);
    const suggestions = solverMode === "algo" ? getScoredSuggestions(filteredWords) : [];
    const keyStates = getKeyboardStates(rows);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-900">
            <Notification notification={notification} />

            <Header
                solverMode={solverMode}
                onSetSolverMode={setSolverMode}
                user={user}
                isLoggedIn={isLoggedIn}
                authLoading={authLoading}
                googleBtnRef={googleBtnRef}
                showProfileMenu={showProfileMenu}
                onToggleProfileMenu={() => setShowProfileMenu(!showProfileMenu)}
                onShowCreditsModal={() => setShowCreditsModal(true)}
                onShowHowToPlay={() => setShowHowToPlay(true)}
                onSignOut={handleSignOut}
                onReset={handleReset}
            />

            <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                <section className="lg:col-span-5 flex flex-col justify-between gap-6 bg-slate-900/40 border border-slate-800/60 p-6 rounded-2xl">
                    <WordleGrid
                        rows={rows}
                        activeRowIndex={activeRowIndex}
                        activeCellIndex={activeCellIndex}
                        onCellClick={handleCellClick}
                        onToggleColor={handleToggleColor}
                        gridRef={gridContainerRef}
                    />
                    <VirtualKeyboard
                        keyStates={keyStates}
                        onTypeLetter={handleTypeLetter}
                        onEnterRow={handleEnterRow}
                        onDeleteLetter={handleDeleteLetter}
                    />
                </section>

                <section className="lg:col-span-7 flex flex-col gap-6">
                    <SolverHeader
                        solverMode={solverMode}
                        filteredWordsCount={filteredWords.length}
                        aiLoading={aiLoading}
                        onGetAISuggestions={getAISuggestions}
                    />

                    <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-2xl flex-1 flex flex-col gap-5">
                        {solverMode === "algo" ? (
                            <AlgorithmicPanel
                                filteredWords={filteredWords}
                                suggestions={suggestions}
                                onApplyWord={handleApplyWord}
                            />
                        ) : (
                            <AIPanel
                                user={user}
                                isLoggedIn={isLoggedIn}
                                aiLoading={aiLoading}
                                aiResponse={aiResponse}
                                aiError={aiError}
                                onGetAISuggestions={getAISuggestions}
                                onApplyWord={handleApplyWord}
                            />
                        )}
                    </div>

                    <DictionarySection
                        customDictionary={customDictionary}
                        newCustomWord={newCustomWord}
                        isLoggedIn={isLoggedIn}
                        onNewCustomWordChange={setNewCustomWord}
                        onAddCustomWord={handleAddCustomWord}
                        onRemoveCustomWord={handleRemoveCustomWord}
                    />
                </section>
            </main>

            {showCreditsModal && (
                <CreditsModal
                    onClose={() => setShowCreditsModal(false)}
                    onPurchase={handlePurchaseCredits}
                />
            )}

            {showHowToPlay && (
                <HowToPlayModal
                    onClose={() => setShowHowToPlay(false)}
                />
            )}

            <footer className="border-t border-slate-800/40 py-4 text-center">
                <p className="text-[10px] text-slate-600">
                    Wordle Solver • Algorithmic & Gemini AI Engine • {isLoggedIn ? `Signed in as ${user.name}` : "Guest Mode"}
                </p>
            </footer>
        </div>
    );
}