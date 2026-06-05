import { HelpCircle } from 'lucide-react';

export default function HowToPlayModal({ onClose }) {
    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-emerald-400" />
                        How to Use Wordle Solver
                    </h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-300 font-bold text-sm">
                        ✕
                    </button>
                </div>

                <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                    <div className="space-y-1">
                        <h4 className="font-bold text-slate-100 flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded bg-emerald-500 text-slate-950 font-extrabold text-[10px] flex items-center justify-center">1</span>
                            Enter Your Wordle Guesses
                        </h4>
                        <p className="pl-7">Type 5-letter words into each row using the virtual keyboard or your physical keyboard. Letters fill into the currently active cell.</p>
                    </div>

                    <div className="space-y-1">
                        <h4 className="font-bold text-slate-100 flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded bg-amber-500 text-slate-950 font-extrabold text-[10px] flex items-center justify-center">2</span>
                            Set Letter Color Clues
                        </h4>
                        <p className="pl-7">Click a letter cell or the 🎨 icon to cycle between Gray (absent), Yellow (wrong position), and Green (correct position) to match Wordle's feedback.</p>
                    </div>

                    <div className="space-y-1">
                        <h4 className="font-bold text-slate-100 flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded bg-purple-500 text-white font-extrabold text-[10px] flex items-center justify-center">3</span>
                            Get Intelligent Recommendations
                        </h4>
                        <p className="pl-7">Use Algorithmic mode for instant filtered suggestions, or switch to Gemini AI mode for deep strategic analysis powered by generative intelligence.</p>
                    </div>

                    <div className="space-y-1">
                        <h4 className="font-bold text-slate-100 flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded bg-slate-700 text-white font-extrabold text-[10px] flex items-center justify-center">4</span>
                            One-Click Auto-Fill
                        </h4>
                        <p className="pl-7">Click any recommended word to instantly fill it into the current active row. Press Enter to lock the row and move to the next one.</p>
                    </div>

                    <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/50 mt-2">
                        <p className="text-[10px] text-slate-400">
                            <strong className="text-emerald-400">Authentication:</strong> Sign in with Google to unlock the Gemini AI solver and get 30 free credits. Your custom dictionary syncs across devices!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
