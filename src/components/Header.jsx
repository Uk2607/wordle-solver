import {
    Sparkles, Cpu, Wand2, HelpCircle, RotateCcw,
    Coins, Plus, LogOut,
} from 'lucide-react';

export default function Header({
    solverMode,
    onSetSolverMode,
    user,
    isLoggedIn,
    authLoading,
    googleBtnRef,
    showProfileMenu,
    onToggleProfileMenu,
    onShowCreditsModal,
    onShowHowToPlay,
    onSignOut,
    onReset,
}) {
    return (
        <header className="border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">

                {/* Logo */}
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

                {/* Mode Toggle */}
                <div className="flex items-center gap-3 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
                    <button
                        onClick={() => onSetSolverMode("algo")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${solverMode === "algo"
                            ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10"
                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                            }`}
                    >
                        <Cpu className="w-3.5 h-3.5" />
                        Algorithmic
                    </button>
                    <button
                        onClick={() => onSetSolverMode("ai")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${solverMode === "ai"
                            ? "bg-purple-600 text-slate-100 shadow-md shadow-purple-600/10"
                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                            }`}
                    >
                        <Wand2 className="w-3.5 h-3.5" />
                        Gemini AI
                    </button>
                </div>

                {/* Account Controls */}
                <div className="flex items-center gap-3">
                    {isLoggedIn ? (
                        <button
                            onClick={onShowCreditsModal}
                            className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 rounded-xl hover:border-amber-400 transition-all text-amber-300"
                            title="Your Gemini AI Credits. Click to buy more."
                        >
                            <Coins className="w-4 h-4 text-amber-400 animate-spin-slow" />
                            <span className="text-xs font-black">{user.credits} AI Credits</span>
                            <Plus className="w-3.5 h-3.5 bg-amber-500 text-slate-950 rounded-full" />
                        </button>
                    ) : (
                        <div ref={googleBtnRef} id="google-signin-btn" className="min-w-[200px]">
                            {authLoading && (
                                <div className="flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 text-xs">
                                    <div className="w-3 h-3 border-2 border-slate-600 border-t-slate-300 rounded-full animate-spin"></div>
                                    Restoring session...
                                </div>
                            )}
                        </div>
                    )}

                    {/* Profile Avatar */}
                    {isLoggedIn && (
                        <div className="relative">
                            <button
                                onClick={onToggleProfileMenu}
                                className="w-10 h-10 rounded-xl border border-slate-700 flex items-center justify-center hover:border-emerald-500 transition-all overflow-hidden"
                            >
                                {user.avatarUrl ? (
                                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover rounded-xl" />
                                ) : (
                                    <span className="text-xs font-black text-emerald-300 uppercase bg-slate-800 w-full h-full flex items-center justify-center">
                                        {user.name ? user.name.slice(0, 2) : "US"}
                                    </span>
                                )}
                            </button>

                            {showProfileMenu && (
                                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-4 space-y-3 z-40">
                                    <div className="border-b border-slate-800 pb-2">
                                        <div className="flex items-center gap-2.5 mb-1">
                                            {user.avatarUrl && (
                                                <img src={user.avatarUrl} alt="" className="w-8 h-8 rounded-lg" />
                                            )}
                                            <div>
                                                <p className="text-xs font-bold text-slate-200">{user.name}</p>
                                                <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                                            </div>
                                        </div>
                                        <span className="inline-block mt-1 px-2 py-0.5 rounded bg-purple-950/40 border border-purple-800/40 text-purple-400 text-[9px] font-bold">
                                            {user.tier}
                                        </span>
                                    </div>

                                    <div className="space-y-1">
                                        <button
                                            onClick={() => { onShowCreditsModal(); onToggleProfileMenu(); }}
                                            className="w-full text-left text-xs text-slate-300 hover:text-white hover:bg-slate-800 p-2 rounded transition-all flex items-center gap-2"
                                        >
                                            <Coins className="w-3.5 h-3.5 text-amber-400" />
                                            Refill / Buy Credits
                                        </button>
                                        <button
                                            onClick={() => { onShowHowToPlay(); onToggleProfileMenu(); }}
                                            className="w-full text-left text-xs text-slate-300 hover:text-white hover:bg-slate-800 p-2 rounded transition-all flex items-center gap-2"
                                        >
                                            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                                            Help Guide
                                        </button>
                                        <button
                                            onClick={onSignOut}
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
                        onClick={onShowHowToPlay}
                        className="p-2.5 bg-slate-900 border border-slate-800 text-slate-300 rounded-xl hover:bg-slate-800 hover:text-white transition-all"
                        title="How to Use Solver"
                    >
                        <HelpCircle className="w-5 h-5" />
                    </button>
                    <button
                        onClick={onReset}
                        className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-900 hover:bg-rose-950/20 border border-slate-800 hover:border-rose-900/30 text-rose-400 hover:text-rose-300 rounded-xl transition-all font-semibold text-xs"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Reset Game
                    </button>
                </div>
            </div>
        </header>
    );
}
