window.G1 = window.G1 || {};
window.G1.components = window.G1.components || {};

window.G1.components.FacilityView = ({ gameState, onInvest }) => {
    const L = window.LucideReact;
    const SafeIcon = (name) => L[name] || L.HelpCircle || L.Activity;

    const facilities = [
        { 
            id: 'residence', 
            label: '宿舎', 
            desc: '冒険者の居住スペース。レベルを上げると雇用可能な人数が増えます。', 
            icon: 'Users', 
            details: `収容人数: ${gameState.facilities.residence * 5}名` 
        },
        { 
            id: 'tavern', 
            label: '酒場', 
            desc: 'ギルド併設の酒場。レベルを上げると定期的な商業収入が増加します。', 
            icon: 'Coins', 
            details: '商業収入増加 / 情報収集効率UP' 
        },
        { 
            id: 'training', 
            label: '訓練場', 
            desc: '冒険者の鍛錬の場。レベルを上げると訓練によるステータス上昇効率が上がります。', 
            icon: 'Dumbbell', 
            details: '訓練効率UP / 戦力底上げ' 
        }
    ];

    return (
        <div key="facilities" className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
            <p className="text-sm font-bold text-stone-600 mb-3">ギルド施設の管理・拡張</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {facilities.map(fac => {
                    const FacIcon = SafeIcon(fac.icon);
                    const currentLevel = gameState.facilities[fac.id] || 1;
                    const cost = 1000 + (currentLevel * 500);
                    const isMax = currentLevel >= 5;

                    return (
                        <div key={fac.id} className="bg-white border-2 border-[#D4C3A3] p-4 rounded-sm shadow-sm flex flex-col hover:border-amber-400 transition-all group">
                            <div className="flex items-center gap-3 mb-3 border-b border-stone-100 pb-3">
                                <div className="bg-stone-100 p-2 rounded-sm text-stone-600 group-hover:bg-amber-50 group-hover:text-amber-700 transition-colors">
                                    <FacIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="font-bold text-stone-800 text-lg">{fac.label}</div>
                                    <div className="text-sm font-bold text-indigo-700">Lv. {currentLevel} / 5</div>
                                </div>
                            </div>
                            <p className="text-xs text-stone-500 mb-2 leading-relaxed h-8 overflow-hidden">{fac.desc}</p>
                            <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4">{fac.details}</div>
                            
                            <button
                                onClick={() => onInvest(fac.id)}
                                disabled={isMax || gameState.budget < cost}
                                className={`w-full py-2.5 rounded-sm font-bold transition-all text-sm shadow-sm active:scale-95 ${isMax ? 'bg-stone-200 text-stone-400 cursor-not-allowed' : (gameState.budget < cost ? 'bg-stone-100 text-stone-400 cursor-not-allowed' : 'bg-stone-800 hover:bg-stone-700 text-[#F2E8C6]')}`}
                            >
                                {isMax ? '最大レベルに達しています' : (gameState.budget < cost ? `${cost.toLocaleString()}G 必要` : `${cost.toLocaleString()}G で拡張する`)}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
