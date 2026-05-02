window.G1 = window.G1 || {};
window.G1.components = window.G1.components || {};

const { RotateCcw, ScrollText } = window.LucideReact;

window.G1.components.EndingView = ({ gameState }) => {
    if (!gameState.ending) return null;

    const endingData = window.G1.Constants.ENDINGS[gameState.ending];
    if (!endingData) return null;

    const handleRestart = () => {
        window.location.reload();
    };

    return (
        <div key="ending" className="fixed inset-0 bg-black z-[100] flex flex-col animate-in fade-in duration-1000">
            <div className="absolute inset-0 opacity-40">
                <img src={endingData.img} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/80 to-transparent"></div>
            </div>
            
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8 text-center max-w-4xl mx-auto w-full">
                <div className="space-y-8 animate-in slide-in-from-bottom-10 duration-1000 delay-500 fill-mode-both">
                    <h2 className={`text-6xl md:text-8xl font-black ${endingData.color} tracking-tighter title-text-glow italic`}>
                        {endingData.title}
                    </h2>
                    
                    <div className="w-24 h-1 bg-stone-700 mx-auto my-8"></div>
                    
                    <p className="text-xl md:text-2xl text-stone-300 font-serif leading-loose italic whitespace-pre-wrap">
                        {endingData.desc}
                    </p>

                    <div className="mt-16 flex flex-col items-center gap-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full text-stone-400 mb-8">
                            <div className="bg-stone-800/50 p-4 rounded-sm border border-stone-700">
                                <div className="text-xs font-bold mb-1">最終資金</div>
                                <div className="text-xl font-black text-amber-500">{gameState.budget.toLocaleString()} G</div>
                            </div>
                            <div className="bg-stone-800/50 p-4 rounded-sm border border-stone-700">
                                <div className="text-xs font-bold mb-1">最終名声</div>
                                <div className="text-xl font-black text-indigo-400">{gameState.fame}</div>
                            </div>
                            <div className="bg-stone-800/50 p-4 rounded-sm border border-stone-700">
                                <div className="text-xs font-bold mb-1">悪名</div>
                                <div className="text-xl font-black text-rose-500">{gameState.notoriety}</div>
                            </div>
                            <div className="bg-stone-800/50 p-4 rounded-sm border border-stone-700">
                                <div className="text-xs font-bold mb-1">解除実績数</div>
                                <div className="text-xl font-black text-emerald-400">{gameState.achievements.length} 個</div>
                            </div>
                        </div>

                        <button 
                            onClick={handleRestart}
                            className="bg-stone-800 hover:bg-stone-700 text-[#F2E8C6] px-8 py-4 rounded-sm font-black text-xl shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 border border-stone-600"
                        >
                            <RotateCcw className="w-6 h-6" /> 新たな歴史を刻む
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
