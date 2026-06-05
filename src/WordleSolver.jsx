import React, { useState, useEffect, useRef } from 'react';
import {
    Wand2,
    Cpu,
    RotateCcw,
    HelpCircle,
    Plus,
    Search,
    Check,
    AlertCircle,
    BookOpen,
    Layers,
    Sparkles,
    CheckCircle2,
    Trash2,
    Lock,
    CornerDownLeft,
    Delete,
    Info,
    User,
    LogIn,
    LogOut,
    Coins,
    ShieldAlert,
    CreditCard,
    UserCheck,
    Zap
} from 'lucide-react';

// Highly curated base dictionary of popular 5-letter Wordle answers
const BASE_DICTIONARY = [
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
    "FIFTH", "FIFTY", "FIGHT", "FINAL", "FIRST", "FIVE", "FIXED", "FLAME", "FLESH", "FLOAT",
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
    "WRITE", "WRONG", "WROTE", "YIELD", "YOUNG", "YOUTH", "ZEBRA", "ZONES"
];

// Helper to execute API calls with exponential backoff
const fetchWithRetry = async (url, options, retries = 5, delay = 1000) => {
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

export default function App() {
    // Five rows strictly matching the user requirement
    const [rows, setRows] = useState([
        { word: "", colors: ["gray", "gray", "gray", "gray", "gray"] },
        { word: "", colors: ["gray", "gray", "gray", "gray", "gray"] },
        { word: "", colors: ["gray", "gray", "gray", "gray", "gray"] },
        { word: "", colors: ["gray", "gray", "gray", "gray", "gray"] },
        { word: "", colors: ["gray", "gray", "gray", "gray", "gray"] }
    ]);

    const [activeRowIndex, setActiveRowIndex] = useState(0);
    const [activeCellIndex, setActiveCellIndex] = useState(0);
    const [solverMode, setSolverMode] = useState("algo"); // "algo" | "ai"
    const [customDictionary, setCustomDictionary] = useState([]);
    const [newCustomWord, setNewCustomWord] = useState("");
    const [showHowToPlay, setShowHowToPlay] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [notification, setNotification] = useState(null);

    // User Account & AI Credits State (With mock default logged-in profile)
    const [user, setUser] = useState({
        isLoggedIn: true,
        name: "Alex Wordler",
        email: "alex.pro@solver.com",
        credits: 12,
        tier: "Gold Solver"
    });

    // User Authentication Modals and Form parameters
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState("signin"); // "signin" | "signup"
    const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
    const [showCreditsModal, setShowCreditsModal] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    // AI Solver specific state
    const [aiLoading, setAiLoading] = useState(false);
    const [aiResponse, setAiResponse] = useState(null);
    const [aiError, setAiError] = useState(null);

    // Focus reference for keyboard input
    const gridContainerRef = useRef(null);

    // Merge default dictionary and custom additions
    const fullDictionary = [...BASE_DICTIONARY, ...customDictionary];

    // Auto-focus active cell of active row when clicked
    // If the cell already contains a letter, cycle its color instantly for amazing UX
    const handleCellClick = (rowIndex, cellIndex) => {
        setActiveRowIndex(rowIndex);
        setActiveCellIndex(cellIndex);

        // Cycle the color instantly on clicking an existing letter cell
        if (rows[rowIndex].word[cellIndex]) {
            toggleColor(rowIndex, cellIndex);
        }
    };

    // Notification helper
    const triggerNotification = (text, type = "info") => {
        setNotification({ text, type });
        setTimeout(() => {
            setNotification(null);
        }, 4500);
    };

    // Toggle letter status color: gray -> yellow -> green -> gray
    const toggleColor = (rowIndex, cellIndex) => {
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

    // Type keys or enter word logic
    const handleTypeLetter = (letter) => {
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
    };

    // Delete key press logic
    const handleDeleteLetter = () => {
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
    };

    // Enter row submission logic
    const handleEnterRow = () => {
        if (rows[activeRowIndex].word.length === 5) {
            if (activeRowIndex < 4) {
                setActiveRowIndex(activeRowIndex + 1);
                setActiveCellIndex(0);
                triggerNotification(`Row ${activeRowIndex + 1} locked! Moving to Row ${activeRowIndex + 2}. Check recommendations!`, "success");
            } else {
                triggerNotification("All 5 Wordle rows have been configured!", "success");
            }
        } else {
            triggerNotification("Please fill in all 5 letters of the current row first.", "warning");
        }
    };

    // Keyboard input handler
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ignore keypresses inside inputs
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
    }, [activeRowIndex, activeCellIndex, rows]);

    // Mock sign-in / registration submission handler
    const handleMockAuthSubmit = (e) => {
        e.preventDefault();

        // Simulate database credentials check delay
        const targetEmail = authForm.email || "player@wordlesolver.com";
        const targetName = authForm.name || "Wordle Pro";

        setUser({
            isLoggedIn: true,
            name: targetName,
            email: targetEmail,
            credits: authMode === "signin" ? 15 : 30, // Register gives bonus credits
            tier: authMode === "signin" ? "Standard Solver" : "Premium Starter"
        });

        triggerNotification(
            authMode === "signin"
                ? `Welcome back, ${targetName}! Refilled with 15 standard credits.`
                : `Account created successfully! Enjoy your 30 registration bonus credits!`,
            "success"
        );

        // Reset forms and close modal
        setAuthForm({ name: "", email: "", password: "" });
        setShowAuthModal(false);
    };

    // Mock sign-out handler
    const handleMockSignOut = () => {
        setUser({
            isLoggedIn: false,
            name: "",
            email: "",
            credits: 0,
            tier: "Guest Tracker"
        });
        setAiResponse(null);
        triggerNotification("Logged out successfully. AI Solver requires an active account.", "info");
        setShowProfileMenu(false);
    };

    // Mock Buy/Refill Credits tier handler
    const handleSimulatePayment = (creditAmount, tierName, simulatedCost) => {
        // Simulate API credit database saves
        setUser(prev => ({
            ...prev,
            credits: prev.credits + creditAmount,
            tier: tierName
        }));
        triggerNotification(`Simulated payment of $${simulatedCost} processed successfully! Added ${creditAmount} credits to ${user.name || "your account"}.`, "success");
        setShowCreditsModal(false);
    };

    // Reset solver state
    const handleReset = () => {
        setRows([
            { word: "", colors: ["gray", "gray", "gray", "gray", "gray"] },
            { word: "", colors: ["gray", "gray", "gray", "gray", "gray"] },
            { word: "", colors: ["gray", "gray", "gray", "gray", "gray"] },
            { word: "", colors: ["gray", "gray", "gray", "gray", "gray"] },
            { word: "", colors: ["gray", "gray", "gray", "gray", "gray"] }
        ]);
        setActiveRowIndex(0);
        setActiveCellIndex(0);
        setAiResponse(null);
        setAiError(null);
        triggerNotification("Solver board reset. Ready for a new 5-row challenge!", "success");
    };

    // Add a custom word to user's local dictionary
    const handleAddCustomWord = () => {
        const cleaned = newCustomWord.trim().toUpperCase();
        if (cleaned.length !== 5) {
            triggerNotification("Word must be exactly 5 letters long.", "warning");
            return;
        }
        if (!/^[A-Z]+$/.test(cleaned)) {
            triggerNotification("Word must only contain alphabetical characters.", "warning");
            return;
        }
        if (fullDictionary.includes(cleaned)) {
            triggerNotification("This word already exists in the dictionary.", "warning");
            return;
        }
        setCustomDictionary(prev => [...prev, cleaned]);
        setNewCustomWord("");
        triggerNotification(`Added "${cleaned}" to the local dictionary!`, "success");
    };

    // Delete a word from the custom dictionary
    const handleRemoveCustomWord = (wordToRemove) => {
        setCustomDictionary(prev => prev.filter(w => w !== wordToRemove));
        triggerNotification(`Removed "${wordToRemove}" from the custom dictionary.`, "info");
    };

    // Fast Auto-Fill Recommendation Word into Active Row
    const handleApplyWord = (word) => {
        setRows(prev => prev.map((row, rIdx) => {
            if (rIdx === activeRowIndex) {
                return {
                    ...row,
                    word: word.toUpperCase()
                };
            }
            return row;
        }));
        setActiveCellIndex(4); // focus end
        triggerNotification(`Applied suggestion "${word.toUpperCase()}" into Row ${activeRowIndex + 1}!`, "success");
    };

    // Algorithmic filtering function based on board constraints
    const getFilteredWords = () => {
        // Gather all valid active completed guesses (must have 5 letters filled)
        const validGuesses = rows.filter(r => r.word.trim().length === 5);

        if (validGuesses.length === 0) {
            return fullDictionary;
        }

        return fullDictionary.filter(candidate => {
            const candidateUpper = candidate.toUpperCase();

            for (const guessObj of validGuesses) {
                const guess = guessObj.word.toUpperCase();
                const colors = guessObj.colors;

                // Perfect Wordle constraint emulation to correctly handle letters, duplicates, and exclusions
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

                // Validate the computed constraints match the exact markings assigned by the user
                for (let i = 0; i < 5; i++) {
                    if (computedColors[i] !== colors[i]) {
                        return false;
                    }
                }
            }

            return true;
        });
    };

    const filteredWords = getFilteredWords();

    // Scoring function: recommends words based on character frequency in remaining valid space
    const getScoredSuggestions = () => {
        if (filteredWords.length === 0) return [];

        // Count character frequencies of remaining word pool
        const charFreqs = {};
        filteredWords.forEach(word => {
            const uniqueLetters = [...new Set(word)];
            uniqueLetters.forEach(char => {
                charFreqs[char] = (charFreqs[char] || 0) + 1;
            });
        });

        // Score words based on letter frequencies to maximize information gain
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

        // Sort with highest scores first
        return scored.sort((a, b) => b.score - a.score);
    };

    const suggestions = getScoredSuggestions();

    // Build the dynamic virtual keyboard highlighting letter states
    const getKeyboardStates = () => {
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
    };

    const keyStates = getKeyboardStates();

    // Keyboard layout
    const keyboardRows = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
        ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"]
    ];

    // Gemini AI Wordle Solver call using Structured JSON schemas
    const getAISuggestions = async () => {
        // SECURITY GUARDRAIL 1: Verify signed-in status
        if (!user.isLoggedIn) {
            triggerNotification("Authentication Required! Please sign in or register to consult Gemini AI.", "warning");
            setShowAuthModal(true);
            return;
        }

        // SECURITY GUARDRAIL 2: Check active credit balance
        if (user.credits <= 0) {
            triggerNotification("Out of AI Credits! Please select a refill package to continue.", "warning");
            setShowCreditsModal(true);
            return;
        }

        const filledGuesses = rows.filter(r => r.word.trim().length === 5);
        if (filledGuesses.length === 0) {
            triggerNotification("Please enter at least one guessed word in the grid to get AI advice.", "warning");
            return;
        }

        setAiLoading(true);
        setAiError(null);
        setAiResponse(null);

        // Prepare guess log formatted for model consumption
        const guessHistory = filledGuesses.map((g, index) => {
            const clueDetails = g.colors.map((color, i) => `${g.word[i]} (${color.toUpperCase()})`).join(", ");
            return `Level Row ${index + 1}: Word "${g.word}" -> Feedback colors: [${clueDetails}]`;
        }).join("\n");

        const systemPrompt = `You are a Wordle World-Champion AI Solver Assistant. Your job is to analyze the user's historical Wordle feedback clues and recommend the best strategic next guesses.
- GREEN means the letter is in the correct slot.
- YELLOW means the letter is in the word but wrong slot.
- GRAY means the letter is absent (or extra duplicate letter).

Evaluate all possible remaining combinations carefully. State clearly if there is exactly 1 deterministic final word remaining. Otherwise, provide highly strategic, high-information suggestions to crack the word quickly. Always use correct English spelling and verify constraints.`;

        const userPrompt = `Here is the Wordle history of guesses made so far on our 5-row layout:
${guessHistory}

Please determine:
1. If there is an absolute deterministic matching word (e.g., only 1 valid possibility exists). Set exactWordMatched to that word in uppercase, otherwise leave it empty.
2. An elegant short analysis of which letters are secured or banned.
3. 5 creative next best words with detailed tactical reasoning for why they are great next guesses (e.g. testing new vowels, ruling out consonants) and confidence percentages.`;

        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

        const payload = {
            contents: [
                {
                    parts: [{ text: userPrompt }]
                }
            ],
            systemInstruction: {
                parts: [{ text: systemPrompt }]
            },
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        exactWordMatched: {
                            type: "STRING",
                            description: "The absolute correct 5-letter answer if 100% deterministicly proven, otherwise empty string"
                        },
                        analysis: {
                            type: "STRING",
                            description: "Short recap of what we know, which letters to avoid, and positioning analysis."
                        },
                        suggestions: {
                            type: "ARRAY",
                            description: "Strategic candidate guesses for the next level",
                            items: {
                                type: "OBJECT",
                                properties: {
                                    word: { type: "STRING", description: "5-letter word recommendation in UPPERCASE" },
                                    reasoning: { type: "STRING", description: "Explanation of why this guess is statistically or tactically brilliant" },
                                    confidence: { type: "INTEGER", description: "Confidence score out of 100" }
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
                const parsed = JSON.parse(text);
                setAiResponse(parsed);

                // Mock DB Save: Decrement active credit balance by 1 on successful query
                setUser(prev => ({
                    ...prev,
                    credits: Math.max(0, prev.credits - 1)
                }));

                triggerNotification("AI Solver successfully computed strategic solutions! -1 Credit Used.", "success");
            } else {
                throw new Error("No response parts received from model.");
            }
        } catch (err) {
            console.error(err);
            setAiError("Failed to reach the AI model or retrieve valid data. Please try again or use the Algorithmic mode.");
            triggerNotification("AI query failed. Using exponential fallback retry logic.", "error");
        } finally {
            setAiLoading(false);
        }
    };

    // Helper colors for the virtual keyboard
    const getKeyboardColorClass = (char) => {
        if (char === "ENTER" || char === "BACKSPACE") {
            return "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white px-2 text-[10px]";
        }
        const state = keyStates[char];
        if (state === "green") return "bg-emerald-600 text-white font-bold hover:bg-emerald-500 shadow-emerald-950/20";
        if (state === "yellow") return "bg-amber-500 text-white font-bold hover:bg-amber-400 shadow-amber-950/20";
        if (state === "gray") return "bg-slate-700/80 text-slate-400 line-through decoration-1 hover:bg-slate-600 shadow-slate-900/20";
        return "bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white";
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-900">

            {/* Dynamic Alerts and Toast Notifications */}
            {notification && (
                <div className="fixed top-5 right-5 z-50 animate-bounce max-w-sm flex items-center gap-3 p-4 rounded-xl border border-slate-800 bg-slate-900 shadow-2xl">
                    <div className={`p-2 rounded-lg ${notification.type === "success" ? "bg-emerald-500/15 text-emerald-400" :
                        notification.type === "warning" ? "bg-amber-500/15 text-amber-400" :
                            "bg-blue-500/15 text-blue-400"
                        }`}>
                        <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-200">{notification.text}</p>
                    </div>
                </div>
            )}

            {/* Top Professional Header */}
            <header className="border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">

                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-tr from-emerald-500 to-teal-400 p-2.5 rounded-xl shadow-lg shadow-emerald-950/30">
                            <Sparkles className="w-6 h-6 text-slate-950 font-black" />
                        </div>
                        <div>
                            <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-200 to-white bg-clip-text text-transparent">
                                Wordle Solver
                            </h1>
                            <p className="text-xs text-slate-400">Algorithmic & Generative AI 5-Row Solver</p>
                        </div>
                    </div>

                    {/* Interactive Toggle Controls */}
                    <div className="flex items-center gap-3 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
                        <button
                            onClick={() => setSolverMode("algo")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${solverMode === "algo"
                                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10"
                                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                                }`}
                        >
                            <Cpu className="w-3.5 h-3.5" />
                            Algorithmic
                        </button>
                        <button
                            onClick={() => setSolverMode("ai")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${solverMode === "ai"
                                ? "bg-purple-600 text-slate-100 shadow-md shadow-purple-600/10"
                                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                                }`}
                        >
                            <Wand2 className="w-3.5 h-3.5" />
                            Gemini AI
                        </button>
                    </div>

                    {/* Interactive Account Profile, Sign-In, and Credits Widgets */}
                    <div className="flex items-center gap-3">

                        {/* Credit Coin Counter (Always visible for logged-in users) */}
                        {user.isLoggedIn ? (
                            <button
                                onClick={() => setShowCreditsModal(true)}
                                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 rounded-xl hover:border-amber-400 transition-all text-amber-300"
                                title="Your Gemini AI Credits. Click to buy more."
                            >
                                <Coins className="w-4 h-4 text-amber-400 animate-spin-slow" />
                                <span className="text-xs font-black">{user.credits} AI Credits</span>
                                <Plus className="w-3.5 h-3.5 bg-amber-500 text-slate-950 rounded-full" />
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    setAuthMode("signin");
                                    setShowAuthModal(true);
                                }}
                                className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl transition-all font-semibold text-xs"
                            >
                                <LogIn className="w-4 h-4 text-emerald-400" />
                                Sign In
                            </button>
                        )}

                        {/* Profile Avatar Trigger dropdown menu */}
                        {user.isLoggedIn && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-black text-emerald-300 hover:border-emerald-500 transition-all uppercase"
                                >
                                    {user.name ? user.name.slice(0, 2) : "US"}
                                </button>

                                {showProfileMenu && (
                                    <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-4 space-y-3 z-40">
                                        <div className="border-b border-slate-800 pb-2">
                                            <p className="text-xs font-bold text-slate-200">{user.name}</p>
                                            <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                                            <span className="inline-block mt-1 px-2 py-0.5 rounded bg-purple-950/40 border border-purple-800/40 text-purple-400 text-[9px] font-bold">
                                                {user.tier}
                                            </span>
                                        </div>

                                        <div className="space-y-1">
                                            <button
                                                onClick={() => {
                                                    setShowCreditsModal(true);
                                                    setShowProfileMenu(false);
                                                }}
                                                className="w-full text-left text-xs text-slate-300 hover:text-white hover:bg-slate-800 p-2 rounded transition-all flex items-center gap-2"
                                            >
                                                <Coins className="w-3.5 h-3.5 text-amber-400" />
                                                Refill / Buy Credits
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setShowHowToPlay(true);
                                                    setShowProfileMenu(false);
                                                }}
                                                className="w-full text-left text-xs text-slate-300 hover:text-white hover:bg-slate-800 p-2 rounded transition-all flex items-center gap-2"
                                            >
                                                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                                                Help Guide
                                            </button>
                                            <button
                                                onClick={handleMockSignOut}
                                                className="w-full text-left text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/15 p-2 rounded transition-all flex items-center gap-2"
                                            >
                                                <LogOut className="w-3.5 h-3.5" />
                                                Logout Account
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <button
                            onClick={() => setShowHowToPlay(true)}
                            className="p-2.5 bg-slate-900 border border-slate-800 text-slate-300 rounded-xl hover:bg-slate-800 hover:text-white transition-all"
                            title="How to Use Solver"
                        >
                            <HelpCircle className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleReset}
                            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-900 hover:bg-rose-950/20 border border-slate-800 hover:border-rose-900/30 text-rose-400 hover:text-rose-300 rounded-xl transition-all font-semibold text-xs"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Reset Game
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Grid & Control Dashboard Layout */}
            <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

                {/* Left Hand: Wordle Grid & Virtual Board */}
                <section className="lg:col-span-5 flex flex-col justify-between gap-6 bg-slate-900/40 border border-slate-800/60 p-6 rounded-2xl">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold text-slate-400 tracking-wider uppercase flex items-center gap-2">
                                <Layers className="w-4 h-4 text-emerald-400" />
                                Active Solver Grid (5 Rows)
                            </h2>
                            <span className="text-xs font-semibold bg-slate-800 px-2.5 py-1 rounded-full text-slate-300">
                                Row {activeRowIndex + 1} Selected
                            </span>
                        </div>

                        {/* Simulated Wordle Game Grid (5 rows strictly) */}
                        <div ref={gridContainerRef} className="grid grid-rows-5 gap-2.5 max-w-[340px] mx-auto">
                            {rows.map((row, rIdx) => {
                                const isActiveRow = rIdx === activeRowIndex;
                                return (
                                    <div
                                        key={rIdx}
                                        className={`grid grid-cols-5 gap-2.5 p-1 rounded-xl transition-all ${isActiveRow
                                            ? "bg-slate-800/40 ring-1 ring-emerald-500/40"
                                            : "opacity-80 hover:opacity-100"
                                            }`}
                                    >
                                        {Array.from({ length: 5 }).map((_, cIdx) => {
                                            const letter = row.word[cIdx] || "";
                                            const color = row.colors[cIdx];
                                            const isSelectedCell = isActiveRow && cIdx === activeCellIndex;

                                            let cellColorClass = "bg-slate-950 border-slate-800 text-slate-100";
                                            if (color === "green") cellColorClass = "bg-emerald-600 border-emerald-500 text-white font-extrabold shadow-sm shadow-emerald-950/25";
                                            if (color === "yellow") cellColorClass = "bg-amber-600 border-amber-500 text-white font-extrabold shadow-sm shadow-amber-950/25";
                                            if (color === "gray" && letter) cellColorClass = "bg-slate-600 border-slate-500 text-white";

                                            return (
                                                <div key={cIdx} className="relative group">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCellClick(rIdx, cIdx)}
                                                        className={`w-full aspect-square text-2xl font-black rounded-lg border-2 flex items-center justify-center transition-all ${cellColorClass} ${isSelectedCell ? "ring-2 ring-emerald-400 scale-[1.04]" : ""
                                                            }`}
                                                    >
                                                        {letter}
                                                    </button>

                                                    {/* Floating status tag indicator */}
                                                    {letter && (
                                                        <button
                                                            onClick={() => toggleColor(rIdx, cIdx)}
                                                            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all text-[9px] font-bold text-slate-300 hover:text-white"
                                                            title="Toggle color constraint"
                                                        >
                                                            🎨
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Quick Auto-Fill Info Alert */}
                        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-850 text-xs flex gap-2 text-slate-400 items-start">
                            <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <p>
                                <strong>Pro-Tip:</strong> Click any recommended word in the right sidebar to instantly auto-fill it into the current row! Tap letters in the grid to cycle their color clues.
                            </p>
                        </div>
                    </div>

                    {/* Fully Functional Virtual Keyboard */}
                    <div className="space-y-1.5 pt-4 border-t border-slate-800/50">
                        {keyboardRows.map((kRow, keyIndex) => (
                            <div key={keyIndex} className="flex justify-center gap-1.5">
                                {kRow.map(char => {
                                    let onClickAction = () => handleTypeLetter(char);
                                    let displayValue = char;

                                    if (char === "ENTER") {
                                        onClickAction = handleEnterRow;
                                        displayValue = <CornerDownLeft className="w-4 h-4 mx-auto" />;
                                    } else if (char === "BACKSPACE") {
                                        onClickAction = handleDeleteLetter;
                                        displayValue = <Delete className="w-4 h-4 mx-auto" />;
                                    }

                                    return (
                                        <button
                                            key={char}
                                            onClick={onClickAction}
                                            className={`h-11 rounded-md font-bold text-xs flex-1 flex items-center justify-center shadow transition-all ${getKeyboardColorClass(char)}`}
                                            style={{ minWidth: char === "ENTER" || char === "BACKSPACE" ? "52px" : "28px" }}
                                        >
                                            {displayValue}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Right Hand: Recommendation Panel, Stats & Dictionary Workspace */}
                <section className="lg:col-span-7 flex flex-col gap-6">

                    {/* Top Solver Actions / Deterministic Display */}
                    <div className="bg-slate-900/30 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                            <h3 className="font-bold text-slate-100 text-lg flex items-center gap-2">
                                {solverMode === "algo" ? (
                                    <>
                                        <Cpu className="w-5 h-5 text-emerald-400 animate-pulse" />
                                        Algorithmic Recommendation
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="w-5 h-5 text-purple-400 animate-pulse" />
                                        AI Reasoning Engine
                                    </>
                                )}
                            </h3>
                            <p className="text-xs text-slate-400">
                                {solverMode === "algo"
                                    ? `${filteredWords.length} possible matching words inside the current dictionary pool.`
                                    : "Let the generative model analyze complex vowel frequencies and guess suggestions."
                                }
                            </p>
                        </div>

                        <div>
                            {solverMode === "ai" ? (
                                <button
                                    onClick={getAISuggestions}
                                    disabled={aiLoading}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed font-bold text-sm text-white rounded-xl transition-all shadow-lg shadow-indigo-950/20"
                                >
                                    {aiLoading ? (
                                        <div className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <Sparkles className="w-4 h-4" />
                                    )}
                                    {aiLoading ? "Consulting AI..." : `Request AI Analysis (-1 🪙)`}
                                </button>
                            ) : (
                                <div className="bg-slate-800/40 border border-slate-700/50 px-4 py-2 rounded-xl">
                                    <span className="text-xs text-slate-400 block font-semibold">Deterministic State</span>
                                    <span className="text-sm font-bold text-emerald-400">
                                        {filteredWords.length === 1 ? "🎯 Guaranteed 100%" : `${((1 / (filteredWords.length || 1)) * 100).toFixed(1)}% Chance`}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Dynamic Suggestions Block */}
                    {solverMode === "algo" ? (
                        <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-2xl flex-1 flex flex-col gap-5">

                            {/* If Wordle Solution Is Deterministic (Exactly 1 word remains) */}
                            {filteredWords.length === 1 ? (
                                <div className="bg-emerald-950/20 border-2 border-emerald-500/30 p-8 rounded-xl text-center space-y-4 animate-fade-in my-auto">
                                    <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
                                        <CheckCircle2 className="w-8 h-8" />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">100% Deterministic Answer Found</span>
                                        <h4 className="text-5xl font-black tracking-wider text-white">
                                            {filteredWords[0]}
                                        </h4>
                                    </div>
                                    <p className="text-slate-400 text-sm max-w-sm mx-auto">
                                        The constraints entered have resolved to exactly **one** single solution. Click below to immediately complete the grid with it!
                                    </p>
                                    <button
                                        onClick={() => handleApplyWord(filteredWords[0])}
                                        className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-emerald-500/10"
                                    >
                                        Apply Final Word to Current Row
                                    </button>
                                </div>
                            ) : filteredWords.length === 0 ? (
                                /* No matching words */
                                <div className="bg-slate-950/60 p-8 rounded-xl border border-slate-800 text-center space-y-4 my-auto">
                                    <div className="w-12 h-12 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto">
                                        <AlertCircle className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-slate-100">No Matching Words Left</h4>
                                        <p className="text-xs text-slate-400 max-w-sm mx-auto">
                                            Could not find any 5-letter words in our base dictionary matching your row colors. Try checking your colors, or add a custom word below to search!
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                /* Regular Filtered List View with Scoring */
                                <div className="space-y-4 flex-1 flex flex-col">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                            <BookOpen className="w-4 h-4 text-emerald-500" />
                                            Algorithmic Recommendations ({filteredWords.length} words found)
                                        </span>

                                        <div className="relative max-w-xs w-full">
                                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                                            <input
                                                type="text"
                                                placeholder="Filter candidates..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full bg-slate-950 border border-slate-800 pl-9 pr-4 py-1.5 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-300"
                                            />
                                        </div>
                                    </div>

                                    {/* Recommendation Grid scrollable list */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                                        {suggestions
                                            .filter(s => s.word.includes(searchQuery.toUpperCase()))
                                            .slice(0, 50)
                                            .map((item, index) => {
                                                const scorePercentage = Math.round((item.score / (suggestions[0]?.score || 1)) * 100);
                                                return (
                                                    <button
                                                        key={item.word}
                                                        onClick={() => handleApplyWord(item.word)}
                                                        className="bg-slate-950/60 hover:bg-slate-900 border border-slate-800/80 hover:border-emerald-550/50 p-3.5 rounded-xl flex items-center justify-between transition-all group text-left w-full"
                                                        title="Click to apply this word to the current row"
                                                    >
                                                        <div className="flex items-center gap-2.5">
                                                            <span className="text-xs text-slate-500 font-bold w-6">#{index + 1}</span>
                                                            <span className="text-lg font-extrabold tracking-wider text-slate-200 group-hover:text-emerald-400 transition-colors">
                                                                {item.word}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="text-right">
                                                                <span className="text-[10px] text-slate-400 block group-hover:text-emerald-300">Click to apply</span>
                                                                <span className="text-[10px] font-bold text-slate-400 block">Relative Score: {scorePercentage}%</span>
                                                            </div>
                                                            <div className="w-1.5 h-8 rounded bg-slate-800 overflow-hidden">
                                                                <div className="bg-emerald-500 w-full rounded" style={{ height: `${scorePercentage}%` }}></div>
                                                            </div>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                    </div>
                                    {suggestions.length > 50 && (
                                        <span className="text-center text-[10px] text-slate-500 block pt-1">
                                            Showing top 50 highest-information recommendations. Narrow down clues to filter more.
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        /* AI GENERATIVE PANEL VIEW */
                        <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-2xl flex-1 flex flex-col gap-4">

                            {/* Not requested yet */}
                            {!aiResponse && !aiLoading && !aiError && (
                                <div className="text-center py-10 my-auto max-w-md mx-auto space-y-4">
                                    <div className="w-14 h-14 bg-purple-950/35 border border-purple-800/30 rounded-2xl flex items-center justify-center mx-auto text-purple-400 shadow-lg">
                                        <Wand2 className="w-7 h-7" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-slate-100">Consult Gemini Pro Engine</h4>
                                        <p className="text-xs text-slate-400 leading-relaxed">
                                            Send your completed Wordle feedback lines directly to the AI model. The AI will evaluate unique vowels, strategic test words, and logical constraints to deliver bespoke advice.
                                        </p>
                                    </div>

                                    {user.isLoggedIn ? (
                                        <div className="space-y-2.5">
                                            <button
                                                onClick={getAISuggestions}
                                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 border border-purple-500 text-white rounded-xl hover:opacity-90 text-xs font-semibold transition-all shadow"
                                            >
                                                <Sparkles className="w-4 h-4 text-purple-200" />
                                                Query AI Solver (-1 Credit)
                                            </button>
                                            <p className="text-[10px] text-amber-500 font-bold">
                                                🪙 You have {user.credits} AI credits remaining in your {user.tier} account.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <button
                                                onClick={() => {
                                                    setAuthMode("signin");
                                                    setShowAuthModal(true);
                                                }}
                                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-555 text-xs font-semibold transition-all"
                                            >
                                                <LogIn className="w-4 h-4" />
                                                Sign In to Access Gemini AI
                                            </button>
                                            <span className="block text-[10px] text-slate-500">Sign in to get 15 complimentary tokens!</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Loader */}
                            {aiLoading && (
                                <div className="text-center py-12 my-auto space-y-4">
                                    <div className="relative w-16 h-16 mx-auto">
                                        <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
                                        <div className="absolute inset-0 rounded-full border-4 border-t-purple-500 animate-spin"></div>
                                    </div>
                                    <div className="space-y-1 animate-pulse">
                                        <p className="text-xs uppercase tracking-widest text-purple-400 font-bold">Connecting to Gemini AI</p>
                                        <p className="text-sm font-semibold text-slate-300">Evaluating constraint permutations...</p>
                                        <p className="text-[11px] text-slate-500 max-w-xs mx-auto">Refilling index tokens in the background...</p>
                                    </div>
                                </div>
                            )}

                            {/* Error */}
                            {aiError && (
                                <div className="bg-rose-950/20 border border-rose-900/30 p-5 rounded-xl text-center space-y-3 my-auto">
                                    <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
                                    <p className="text-xs text-rose-200 leading-relaxed max-w-md mx-auto">{aiError}</p>
                                    <button
                                        onClick={getAISuggestions}
                                        className="px-4 py-2 bg-rose-900/30 border border-rose-800 hover:bg-rose-900/50 text-rose-300 text-xs font-semibold rounded-lg transition-all"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            )}

                            {/* AI Strategic Results */}
                            {aiResponse && (
                                <div className="space-y-5 animate-fade-in">

                                    {/* Clue Analysis */}
                                    <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
                                        <h5 className="text-[11px] font-bold text-purple-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                            <Check className="w-3.5 h-3.5" />
                                            Model Clue Analysis
                                        </h5>
                                        <p className="text-xs text-slate-300 leading-relaxed italic">
                                            "{aiResponse.analysis}"
                                        </p>
                                    </div>

                                    {/* Deterministic found guess */}
                                    {aiResponse.exactWordMatched && aiResponse.exactWordMatched.length === 5 && (
                                        <div className="bg-emerald-950/15 border border-emerald-500/30 p-4 rounded-xl flex items-center justify-between">
                                            <div>
                                                <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-extrabold block">AI Target Word Found</span>
                                                <span className="text-3xl font-black text-white tracking-widest">{aiResponse.exactWordMatched.toUpperCase()}</span>
                                            </div>
                                            <button
                                                onClick={() => handleApplyWord(aiResponse.exactWordMatched)}
                                                className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-550 border border-emerald-500/30 text-xs font-bold transition-all"
                                            >
                                                Autofill Word
                                            </button>
                                        </div>
                                    )}

                                    {/* Recommendations */}
                                    <div className="space-y-2.5">
                                        <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                                            <span>AI Guess Recommendations (Click to Autofill)</span>
                                            <span className="text-[10px] text-purple-400">{user.credits} credits left</span>
                                        </h5>
                                        <div className="space-y-2 max-h-[290px] overflow-y-auto pr-1">
                                            {aiResponse.suggestions?.map((item, idx) => (
                                                <button
                                                    key={item.word}
                                                    onClick={() => handleApplyWord(item.word)}
                                                    className="bg-slate-950/40 border border-slate-800/80 hover:border-purple-500/40 p-3 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 transition-all text-left w-full group"
                                                >
                                                    <div className="flex items-start gap-3 flex-1">
                                                        <span className="text-xs text-purple-400 font-extrabold bg-purple-950/40 border border-purple-900/40 w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5">
                                                            {idx + 1}
                                                        </span>
                                                        <div className="space-y-0.5">
                                                            <span className="text-base font-black tracking-wider text-slate-100 uppercase group-hover:text-purple-400 transition-colors">
                                                                {item.word}
                                                            </span>
                                                            <p className="text-xs text-slate-400 leading-relaxed pr-2">
                                                                {item.reasoning}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="self-end md:self-center shrink-0 flex items-center gap-2">
                                                        <div className="text-right">
                                                            <span className="text-[8px] text-slate-500 block uppercase">Confidence</span>
                                                            <span className="text-xs font-bold text-purple-400">{item.confidence}%</span>
                                                        </div>
                                                        <div className="w-1.5 h-8 bg-slate-800 rounded overflow-hidden">
                                                            <div className="bg-purple-500 h-full rounded" style={{ height: `${item.confidence}%` }}></div>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Dictionary & Custom Words Section */}
                    <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-2xl">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-3">
                            <BookOpen className="w-4 h-4 text-slate-400" />
                            Solver Word Database Setup
                        </h4>

                        <div className="flex flex-col sm:flex-row items-stretch gap-3">
                            <div className="relative flex-1">
                                <Plus className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                <input
                                    type="text"
                                    maxLength={5}
                                    placeholder="Type new 5-letter word..."
                                    value={newCustomWord}
                                    onChange={(e) => setNewCustomWord(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-200"
                                />
                            </div>
                            <button
                                onClick={handleAddCustomWord}
                                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold tracking-wide transition-all border border-slate-700/50 shrink-0"
                            >
                                Add to Dictionary
                            </button>
                        </div>

                        {/* Custom word list bubbles if any */}
                        {customDictionary.length > 0 && (
                            <div className="pt-4 space-y-2">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">
                                    Custom Added Words ({customDictionary.length})
                                </span>
                                <div className="flex flex-wrap gap-2 max-h-[80px] overflow-y-auto pr-1">
                                    {customDictionary.map(word => (
                                        <div
                                            key={word}
                                            className="bg-slate-950 border border-slate-800/80 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 flex items-center gap-2 group hover:border-rose-900/50"
                                        >
                                            <span>{word}</span>
                                            <button
                                                onClick={() => handleRemoveCustomWord(word)}
                                                className="text-slate-500 hover:text-rose-400 transition-colors"
                                                title="Delete custom word"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* NEW: Sign In & Authentication Modal (With Simulated DB state) */}
            {showAuthModal && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-sm w-full shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                                <UserCheck className="w-5 h-5 text-emerald-400" />
                                {authMode === "signin" ? "Login to Wordle Solver" : "Create Free Account"}
                            </h3>
                            <button
                                onClick={() => setShowAuthModal(false)}
                                className="text-slate-500 hover:text-slate-300 font-bold text-sm"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleMockAuthSubmit} className="space-y-3">
                            {authMode === "signup" && (
                                <div>
                                    <label className="block text-[10px] uppercase text-slate-400 font-bold mb-1">Your Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Wordle Champ"
                                        value={authForm.name}
                                        onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-[10px] uppercase text-slate-400 font-bold mb-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="name@example.com"
                                    value={authForm.email}
                                    onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase text-slate-400 font-bold mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={authForm.password}
                                    onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-2.5 mt-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
                            >
                                {authMode === "signin" ? <LogIn className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                                {authMode === "signin" ? "Login (Mocked DB Call)" : "Register (Claim 30 Free Credits)"}
                            </button>
                        </form>

                        <div className="pt-2 text-center border-t border-slate-800">
                            <button
                                onClick={() => setAuthMode(authMode === "signin" ? "signup" : "signin")}
                                className="text-xs text-slate-400 hover:text-emerald-400 transition-colors"
                            >
                                {authMode === "signin"
                                    ? "Don't have an account? Sign Up free"
                                    : "Already registered? Log in here"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* NEW: Credit Refill / Buy Credits Modal (Payment Simulator) */}
            {showCreditsModal && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                                <Coins className="w-5 h-5 text-amber-400 animate-pulse" />
                                Refill AI Solver Credits
                            </h3>
                            <button
                                onClick={() => setShowCreditsModal(false)}
                                className="text-slate-500 hover:text-slate-300 font-bold text-sm"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
                            <Zap className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                            <p>
                                Each query to the generative Gemini solver analyzes vowel density, filters dictionary combinations, and costs exactly **1 credit**. Choose a mock pack below. No credit cards required!
                            </p>
                        </div>

                        <div className="space-y-3">
                            {/* Bronze Pack */}
                            <div className="border border-slate-800 hover:border-amber-500/40 p-4 rounded-xl flex items-center justify-between bg-slate-950/30 hover:bg-slate-950 transition-all">
                                <div>
                                    <h4 className="text-xs font-black text-slate-200">Bronze Starter Kit</h4>
                                    <p className="text-[10px] text-slate-400">Perfect for daily players</p>
                                    <span className="inline-block mt-1 text-sm font-bold text-amber-400">🪙 +15 Credits</span>
                                </div>
                                <button
                                    onClick={() => handleSimulatePayment(15, "Bronze Solver", "1.99")}
                                    className="px-3.5 py-2 bg-amber-500 text-slate-950 hover:bg-amber-400 rounded-lg text-xs font-extrabold flex items-center gap-1 transition-all"
                                >
                                    <CreditCard className="w-3.5 h-3.5" />
                                    $1.99
                                </button>
                            </div>

                            {/* Gold Solver Pack */}
                            <div className="border-2 border-emerald-500/20 hover:border-emerald-500 p-4 rounded-xl flex items-center justify-between bg-emerald-950/5 hover:bg-emerald-950/10 transition-all relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 text-[8px] font-extrabold px-2 py-0.5 rounded-bl uppercase tracking-widest">
                                    Best Value
                                </div>
                                <div>
                                    <h4 className="text-xs font-black text-slate-200">Gold Professional Master</h4>
                                    <p className="text-[10px] text-slate-400">Infinite strategic help</p>
                                    <span className="inline-block mt-1 text-sm font-bold text-emerald-400">🪙 +60 Credits</span>
                                </div>
                                <button
                                    onClick={() => handleSimulatePayment(60, "Gold Pro Solver", "4.99")}
                                    className="px-3.5 py-2 bg-emerald-500 text-slate-950 hover:bg-emerald-400 rounded-lg text-xs font-extrabold flex items-center gap-1 transition-all shadow-md shadow-emerald-500/10"
                                >
                                    <CreditCard className="w-3.5 h-3.5" />
                                    $4.99
                                </button>
                            </div>

                            {/* Platinum Pack */}
                            <div className="border border-slate-800 hover:border-purple-500/40 p-4 rounded-xl flex items-center justify-between bg-slate-950/30 hover:bg-slate-950 transition-all">
                                <div>
                                    <h4 className="text-xs font-black text-slate-200">Platinum Grandmaster</h4>
                                    <p className="text-[10px] text-slate-400">Unrestricted word supremacy</p>
                                    <span className="inline-block mt-1 text-sm font-bold text-purple-400">🪙 +200 Credits</span>
                                </div>
                                <button
                                    onClick={() => handleSimulatePayment(200, "Platinum Master", "9.99")}
                                    className="px-3.5 py-2 bg-purple-600 text-white hover:bg-purple-550 rounded-lg text-xs font-extrabold flex items-center gap-1 transition-all"
                                >
                                    <CreditCard className="w-3.5 h-3.5" />
                                    $9.99
                                </button>
                            </div>
                        </div>

                        <div className="pt-2 text-center">
                            <p className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
                                <Lock className="w-3.5 h-3.5 text-slate-600" />
                                This checkout runs securely on simulated API logic.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Elegant How-To Use Modal */}
            {showHowToPlay && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                                <HelpCircle className="w-5 h-5 text-emerald-400" />
                                How to Use the Wordle Solver
                            </h3>
                            <button
                                onClick={() => setShowHowToPlay(false)}
                                className="text-slate-500 hover:text-slate-300 font-bold text-sm"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
                            <p>
                                <strong>Step 1: Enter your guess words</strong><br />
                                Select any row in the **Active Wordle Grid** (strictly 5 rows) and type a word (either from your physical keyboard or using the on-screen virtual keyboard).
                            </p>
                            <p>
                                <strong>Step 2: Assign Clue Colors</strong><br />
                                Click directly on any typed letter in the grid to cycle through Wordle color responses:
                                <ul className="list-disc pl-5 space-y-1 pt-1.5 text-slate-400">
                                    <li><strong className="text-emerald-400">Green (Correct):</strong> Letter is in the exact spot.</li>
                                    <li><strong className="text-amber-400">Yellow (Present):</strong> Letter is in the word but wrong spot.</li>
                                    <li><strong className="text-slate-300">Gray (Absent):</strong> Letter is completely excluded.</li>
                                </ul>
                            </p>
                            <p>
                                <strong>Step 3: Autofill Solutions</strong><br />
                                Click on any recommended word in the right sidebar. The app will immediately inject that word into your active row!
                            </p>
                            <p>
                                <strong>Step 4: Credit & AI Analysis</strong><br />
                                Sign up for an account to earn bonus **AI Credits**. Use credits to summon the Gemini AI solver for deep mathematical reasoning, vowel mapping, and contextual scoring.
                            </p>
                        </div>

                        <div className="pt-2">
                            <button
                                onClick={() => setShowHowToPlay(false)}
                                className="w-full py-2.5 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-emerald-400 transition-all"
                            >
                                Understood, Let's Play!
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer information */}
            <footer className="border-t border-slate-900 bg-slate-950 py-4 px-6 text-center text-slate-600 text-[11px] mt-auto">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
                    <span>Wordle Solver Pro Dashboard © 2026. Custom Solver Algorithm & Gemini Flash Preview.</span>
                    <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Secure execution sandbox</span>
                </div>
            </footer>
        </div>
    );
}