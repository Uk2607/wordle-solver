import { Wand2, Sparkles, Check, AlertCircle } from 'lucide-react';

export default function AIPanel({
    user,
    isLoggedIn,
    aiLoading,
    aiResponse,
    aiError,
    onGetAISuggestions,
    onApplyWord,
}) {
    // Not requested yet
    if (!aiResponse && !aiLoading && !aiError) {
        return (
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

                {isLoggedIn ? (
                    <div className="space-y-2.5">
                        <button
                            onClick={onGetAISuggestions}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 border border-purple-500 text-white rounded-xl hover:opacity-90 text-xs font-semibold transition-all shadow"
                        >
                            <Sparkles className="w-4 h-4 text-purple-200" />
                            Query AI Solver (-1 Credit)
                        </button>
                        <p className="text-[10px] text-amber-500 font-bold">
                            {"\u{1FA99}"} You have {user.credits} AI credits remaining in your {user.tier} account.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <p className="text-xs text-slate-400">Sign in with Google to access the AI solver</p>
                        <span className="block text-[10px] text-slate-500">New accounts get 30 complimentary credits!</span>
                    </div>
                )}
            </div>
        );
    }

    // Loader
    if (aiLoading) {
        return (
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
        );
    }

    // Error
    if (aiError) {
        return (
            <div className="bg-rose-950/20 border border-rose-900/30 p-5 rounded-xl text-center space-y-3 my-auto">
                <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
                <p className="text-xs text-rose-200 leading-relaxed max-w-md mx-auto">{aiError}</p>
                <button
                    onClick={onGetAISuggestions}
                    className="px-4 py-2 bg-rose-900/30 border border-rose-800 hover:bg-rose-900/50 text-rose-300 text-xs font-semibold rounded-lg transition-all"
                >
                    Try Again
                </button>
            </div>
        );
    }

    // AI Strategic Results
    return (
        <div className="space-y-5 animate-fade-in">
            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
                <h5 className="text-[11px] font-bold text-purple-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    Model Clue Analysis
                </h5>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                    "{aiResponse.analysis}"
                </p>
            </div>

            {aiResponse.exactWordMatched && aiResponse.exactWordMatched.length === 5 && (
                <div className="bg-emerald-950/15 border border-emerald-500/30 p-4 rounded-xl flex items-center justify-between">
                    <div>
                        <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-extrabold block">AI Target Word Found</span>
                        <span className="text-3xl font-black text-white tracking-widest">{aiResponse.exactWordMatched.toUpperCase()}</span>
                    </div>
                    <button
                        onClick={() => onApplyWord(aiResponse.exactWordMatched)}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-550 border border-emerald-500/30 text-xs font-bold transition-all"
                    >
                        Autofill Word
                    </button>
                </div>
            )}

            <div className="space-y-2.5">
                <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                    <span>AI Guess Recommendations (Click to Autofill)</span>
                    <span className="text-[10px] text-purple-400">{user?.credits ?? 0} credits left</span>
                </h5>
                <div className="space-y-2 max-h-[290px] overflow-y-auto pr-1">
                    {aiResponse.suggestions?.map((item, idx) => (
                        <button
                            key={item.word}
                            onClick={() => onApplyWord(item.word)}
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
    );
}
