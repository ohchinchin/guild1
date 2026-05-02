window.G1 = window.G1 || {};
window.G1.components = window.G1.components || {};

window.G1.components.AchievementView = ({ gameState }) => {
    const L = window.LucideReact;
    const SafeIcon = (name) => L[name] || L[name.replace('2', '')] || L.Trophy;

    const Trophy = SafeIcon('Trophy');

    const achievements = window.G1.Constants.ACHIEVEMENTS || [];

    return (
        <div key="achievements" className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <p className="text-sm font-bold text-stone-600 mb-4">ギルドの偉大な足跡。特定の条件を満たすことで開放されます。</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map(ach => {
                    const isUnlocked = (gameState.achievements || []).includes(ach.id);
                    const Icon = SafeIcon(ach.icon);
                    return (
                        <div key={ach.id} className={`p-5 border-2 rounded-sm shadow-sm flex flex-col transition-all ${isUnlocked ? 'bg-white border-amber-400' : 'bg-stone-50 border-stone-200 opacity-60'}`}>
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`p-2 rounded-sm ${isUnlocked ? 'bg-amber-100 text-amber-700' : 'bg-stone-100 text-stone-300'}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div className="font-black text-stone-800">{ach.name}</div>
                            </div>
                            <p className="text-xs text-stone-500 leading-relaxed flex-1">{ach.desc}</p>
                            {!isUnlocked && <div className="mt-3 text-[10px] font-black text-stone-300 uppercase tracking-widest">Locked</div>}
                            {isUnlocked && <div className="mt-3 text-[10px] font-black text-amber-500 uppercase tracking-widest">Unlocked</div>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
