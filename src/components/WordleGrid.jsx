import { Layers, Info } from 'lucide-react';

export default function WordleGrid({
    rows,
    activeRowIndex,
    activeCellIndex,
    onCellClick,
    onToggleColor,
    gridRef,
}) {
    return (
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

            <div ref={gridRef} className="grid grid-rows-5 gap-2.5 max-w-[340px] mx-auto">
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
                                            onClick={() => onCellClick(rIdx, cIdx)}
                                            className={`w-full aspect-square text-2xl font-black rounded-lg border-2 flex items-center justify-center transition-all ${cellColorClass} ${isSelectedCell ? "ring-2 ring-emerald-400 scale-[1.04]" : ""}`}
                                        >
                                            {letter}
                                        </button>
                                        {letter && (
                                            <button
                                                onClick={() => onToggleColor(rIdx, cIdx)}
                                                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all text-[9px] font-bold text-slate-300 hover:text-white"
                                                title="Toggle color constraint"
                                            >
                                                {"\u{1F3A8}"}
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>

            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-850 text-xs flex gap-2 text-slate-400 items-start">
                <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p>
                    <strong>Pro-Tip:</strong> Click any recommended word in the right sidebar to instantly auto-fill it into the current row! Tap letters in the grid to cycle their color clues.
                </p>
            </div>
        </div>
    );
}
