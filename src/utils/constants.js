import wordleListRaw from '../../valid-wordle-list.txt?raw';

// Full list of valid Wordle words
export const BASE_DICTIONARY = wordleListRaw
    .split('\n')
    .map(word => word.trim().toUpperCase())
    .filter(word => word.length === 5);

export const KEYBOARD_LAYOUT = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"]
];

export const EMPTY_ROW = { word: "", colors: ["gray", "gray", "gray", "gray", "gray"] };

export const createEmptyRows = () => Array(5).fill(null).map(() => ({ ...EMPTY_ROW, colors: [...EMPTY_ROW.colors] }));

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
