import { Coins, Zap, CreditCard, Lock } from 'lucide-react';

const CREDIT_PACKS = [
    {
        name: "Bronze Starter Kit",
        description: "Perfect for daily players",
        credits: 15,
        tier: "Bronze Solver",
        price: "1.99",
        colorClass: "border-slate-800 hover:border-amber-500/40 bg-slate-950/30 hover:bg-slate-950",
        btnClass: "bg-amber-500 text-slate-950 hover:bg-amber-400",
        creditColor: "text-amber-400",
        badge: null,
    },
    {
        name: "Gold Professional Master",
        description: "Infinite strategic help",
        credits: 60,
        tier: "Gold Pro Solver",
        price: "4.99",
        colorClass: "border-2 border-emerald-500/20 hover:border-emerald-500 bg-emerald-950/5 hover:bg-emerald-950/10",
        btnClass: "bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-md shadow-emerald-500/10",
        creditColor: "text-emerald-400",
        badge: "Best Value",
    },
    {
        name: "Platinum Grandmaster",
        description: "Unrestricted word supremacy",
        credits: 200,
        tier: "Platinum Master",
        price: "9.99",
        colorClass: "border-slate-800 hover:border-purple-500/40 bg-slate-950/30 hover:bg-slate-950",
        btnClass: "bg-purple-600 text-white hover:bg-purple-550",
        creditColor: "text-purple-400",
        badge: null,
    },
];

export default function CreditsModal({ onClose, onPurchase }) {
    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Coins className="w-5 h-5 text-amber-400 animate-pulse" />
                        Refill AI Solver Credits
                    </h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-300 font-bold text-sm">
                        {"\u2715"}
                    </button>
                </div>

                <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
                    <Zap className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <p>
                        Each query to the generative Gemini solver analyzes vowel density, filters dictionary combinations, and costs exactly **1 credit**. Choose a pack below.
                    </p>
                </div>

                <div className="space-y-3">
                    {CREDIT_PACKS.map(pack => (
                        <div key={pack.tier} className={`${pack.colorClass} p-4 rounded-xl flex items-center justify-between transition-all relative overflow-hidden`}>
                            {pack.badge && (
                                <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 text-[8px] font-extrabold px-2 py-0.5 rounded-bl uppercase tracking-widest">
                                    {pack.badge}
                                </div>
                            )}
                            <div>
                                <h4 className="text-xs font-black text-slate-200">{pack.name}</h4>
                                <p className="text-[10px] text-slate-400">{pack.description}</p>
                                <span className={`inline-block mt-1 text-sm font-bold ${pack.creditColor}`}>{"\u{1FA99}"} +{pack.credits} Credits</span>
                            </div>
                            <button
                                onClick={() => onPurchase(pack.credits, pack.tier, pack.price)}
                                className={`px-3.5 py-2 ${pack.btnClass} rounded-lg text-xs font-extrabold flex items-center gap-1 transition-all`}
                            >
                                <CreditCard className="w-3.5 h-3.5" />
                                ${pack.price}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="pt-2 text-center">
                    <p className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
                        <Lock className="w-3.5 h-3.5 text-slate-600" />
                        Payments will be processed securely via integrated payment gateway.
                    </p>
                </div>
            </div>
        </div>
    );
}
