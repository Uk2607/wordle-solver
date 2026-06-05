import { BookOpen, Plus, Trash2 } from 'lucide-react';

export default function DictionarySection({
    customDictionary,
    newCustomWord,
    isLoggedIn,
    onNewCustomWordChange,
    onAddCustomWord,
    onRemoveCustomWord,
}) {
    return (
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
                        onChange={(e) => onNewCustomWordChange(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-200"
                    />
                </div>
                <button
                    onClick={onAddCustomWord}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold tracking-wide transition-all border border-slate-700/50 shrink-0"
                >
                    Add to Dictionary
                </button>
            </div>

            {customDictionary.length > 0 && (
                <div className="pt-4 space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">
                        {isLoggedIn ? 'Synced' : 'Local'} Custom Words ({customDictionary.length})
                    </span>
                    <div className="flex flex-wrap gap-2 max-h-[80px] overflow-y-auto pr-1">
                        {customDictionary.map(word => (
                            <div
                                key={word}
                                className="bg-slate-950 border border-slate-800/80 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 flex items-center gap-2 group hover:border-rose-900/50"
                            >
                                <span>{word}</span>
                                <button
                                    onClick={() => onRemoveCustomWord(word)}
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
    );
}
