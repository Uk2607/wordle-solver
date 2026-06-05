import { Cpu, Wand2, Sparkles } from 'lucide-react';

export default function SolverHeader({ solverMode, filteredWordsCount, aiLoading, onGetAISuggestions }) {
    return (
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
                        ? `${filteredWordsCount} possible matching words inside the current dictionary pool.`
                        : "Let the generative model analyze complex vowel frequencies and guess suggestions."
                    }
                </p>
            </div>

            <div>
                {solverMode === "ai" ? (
                    <button
                        onClick={onGetAISuggestions}
                        disabled={aiLoading}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed font-bold text-sm text-white rounded-xl transition-all shadow-lg shadow-indigo-950/20"
                    >
                        {aiLoading ? (
                            <div className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <Sparkles className="w-4 h-4" />
                        )}
                        {aiLoading ? "Consulting AI..." : "Request AI Analysis (-1 🪙)"}
                    </button>
                ) : (
                    <div className="bg-slate-800/40 border border-slate-700/50 px-4 py-2 rounded-xl">
                        <span className="text-xs text-slate-400 block font-semibold">Deterministic State</span>
                        <span className="text-sm font-bold text-emerald-400">
                            {filteredWordsCount === 1 ? "🎯 Guaranteed 100%" : `${((1 / (filteredWordsCount || 1)) * 100).toFixed(1)}% Chance`}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
