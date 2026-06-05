import { useState } from 'react';
import { BookOpen, Search, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AlgorithmicPanel({ filteredWords, suggestions, onApplyWord }) {
    const [searchQuery, setSearchQuery] = useState("");

    if (filteredWords.length === 1) {
        return (
            <div className="bg-emerald-950/20 border-2 border-emerald-500/30 p-8 rounded-xl text-center space-y-4 animate-fade-in my-auto">
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                    <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">100% Deterministic Answer Found</span>
                    <h4 className="text-5xl font-black tracking-wider text-white">{filteredWords[0]}</h4>
                </div>
                <p className="text-slate-400 text-sm max-w-sm mx-auto">
                    The constraints entered have resolved to exactly **one** single solution. Click below to immediately complete the grid with it!
                </p>
                <button
                    onClick={() => onApplyWord(filteredWords[0])}
                    className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-emerald-500/10"
                >
                    Apply Final Word to Current Row
                </button>
            </div>
        );
    }

    if (filteredWords.length === 0) {
        return (
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
        );
    }

    return (
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {suggestions
                    .filter(s => s.word.includes(searchQuery.toUpperCase()))
                    .slice(0, 50)
                    .map((item, index) => {
                        const scorePercentage = Math.round((item.score / (suggestions[0]?.score || 1)) * 100);
                        return (
                            <button
                                key={item.word}
                                onClick={() => onApplyWord(item.word)}
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
    );
}
