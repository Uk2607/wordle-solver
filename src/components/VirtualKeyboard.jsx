import { CornerDownLeft, Delete } from 'lucide-react';
import { KEYBOARD_LAYOUT } from '../utils/constants.js';
import { getKeyboardColorClass } from '../utils/solver.js';

export default function VirtualKeyboard({
    keyStates,
    onTypeLetter,
    onEnterRow,
    onDeleteLetter,
}) {
    return (
        <div className="space-y-1.5 pt-4 border-t border-slate-800/50">
            {KEYBOARD_LAYOUT.map((kRow, keyIndex) => (
                <div key={keyIndex} className="flex justify-center gap-1.5">
                    {kRow.map(char => {
                        let onClickAction = () => onTypeLetter(char);
                        let displayValue = char;

                        if (char === "ENTER") {
                            onClickAction = onEnterRow;
                            displayValue = <CornerDownLeft className="w-4 h-4 mx-auto" />;
                        } else if (char === "BACKSPACE") {
                            onClickAction = onDeleteLetter;
                            displayValue = <Delete className="w-4 h-4 mx-auto" />;
                        }

                        return (
                            <button
                                key={char}
                                onClick={onClickAction}
                                className={`h-11 rounded-md font-bold text-xs flex-1 flex items-center justify-center shadow transition-all ${getKeyboardColorClass(char, keyStates)}`}
                                style={{ minWidth: char === "ENTER" || char === "BACKSPACE" ? "52px" : "28px" }}
                            >
                                {displayValue}
                            </button>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}
