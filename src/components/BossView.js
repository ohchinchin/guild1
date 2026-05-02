window.G1 = window.G1 || {};
window.G1.components = window.G1.components || {};

window.G1.components.BossView = ({ gameState, onFightBoss }) => {
    const L = window.LucideReact;
    const SafeIcon = (name) => L[name] || L[name.replace('2', '')] || L.Swords;

    const Swords = SafeIcon('Swords');

    const boss = gameState.activeBoss;
    if (!boss) return null;

    const totalPower = gameState.adventurers.reduce((sum, a) => sum + a.power, 0);
    const winChance = Math.min(95, Math.max(5, (totalPower / boss.power) * 70));

    return (
        <div key="boss" className="space-y-6 animate-in zoom-in duration-500 flex-1 flex flex-col h-full overflow-hidden">
            <div className="bg-stone-900 border-4 border-rose-600 p-8 rounded-sm shadow-2xl relative overflow-hidden flex-1 flex flex-col justify-center items-center text-center">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <img src="assets/images/bg_shadow.png" className="w-full h-full object-cover animate-pulse" alt="" />
                </div>
                <div className="relative z-10 space-y-6 max-w-2xl">
                    <div className="inline-block px-4 py-1 bg-rose-600 text-white text-xs font-black uppercase tracking-widest mb-2 animate-bounce">Emergency</div>
                    <h2 className="text-5xl md:text-7xl font-black text-rose-500 tracking-tighter title-text-glow italic">{boss.name}</h2>
                    <p className="text-xl text-stone-300 font-serif leading-relaxed italic">「{boss.desc}」</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                        <div className="bg-stone-800/80 p-6 rounded-sm border border-stone-700 shadow-xl">
                            <div className="text-[10px] font-bold text-stone-500 uppercase mb-2">ボス戦力</div>
                            <div className="text-4xl font-black text-rose-500">{boss.power.toLocaleString()}</div>
                        </div>
                        <div className="bg-stone-800/80 p-6 rounded-sm border border-stone-700 shadow-xl">
                            <div className="text-[10px] font-bold text-stone-500 uppercase mb-2">ギルド総戦力</div>
                            <div className="text-4xl font-black text-indigo-400">{totalPower.toLocaleString()}</div>
                        </div>
                    </div>
                    <div className="pt-8 w-full">
                        <div className="mb-4">
                            <div className="text-sm font-bold text-stone-400 mb-2">予測勝算</div>
                            <div className="w-full h-3 bg-stone-700 rounded-full overflow-hidden border border-stone-600 shadow-inner">
                                <div className={`h-full transition-all duration-1000 ${winChance >= 70 ? 'bg-emerald-500' : winChance >= 40 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{width: `${winChance}%`}}></div>
                            </div>
                        </div>
                        <button 
                            onClick={onFightBoss}
                            className="w-full md:w-80 bg-rose-600 hover:bg-rose-500 text-white py-5 rounded-sm font-black text-2xl shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-4 group"
                        >
                            <Swords className="w-8 h-8 group-hover:rotate-12 transition-transform" />
                            全軍突撃を開始する
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
