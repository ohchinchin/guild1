window.G1 = window.G1 || {};
window.G1.components = window.G1.components || {};

window.G1.components.ShopView = ({ gameState, onInvest }) => {
    const L = window.LucideReact;
    const SafeIcon = (name) => L[name] || L[name.replace('2', '')] || L.ShoppingBag;

    const Hammer = SafeIcon('Hammer');
    const Wand2 = SafeIcon('Wand2');
    const ShoppingBag = SafeIcon('ShoppingBag');

    const shops = [
        { id: 'weaponShop', label: '鍛冶屋', desc: '武器・防具の製造。投資すると冒険者の装備レベルが上がり、全体の戦力が底上げされます。', icon: Hammer, details: '装備強化 / 戦力ボーナス' },
        { id: 'magicShop', label: '魔導具店', desc: '魔法アイテム。投資すると魔法職の能力向上や、探索成功率が上がります。', icon: Wand2, details: '魔法職UP / 探索成功率向上' },
        { id: 'itemShop', label: '道具屋', desc: '日用雑貨。投資すると維持費が削減され、生存率が上がります。', icon: ShoppingBag, details: '維持費削減 / 事故率低下' }
    ];

    return (
        <div key="shops" className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
            <p className="text-sm font-bold text-stone-600 mb-3">提携店舗への投資</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {shops.map(shop => {
                    const ShopIcon = shop.icon;
                    const currentLevel = gameState.shops[shop.id] || 1;
                    const cost = 1000 + (currentLevel * 1000);
                    const isMax = currentLevel >= 5;

                    return (
                        <div key={shop.id} className="bg-white border-2 border-[#D4C3A3] p-4 rounded-sm shadow-sm flex flex-col hover:border-amber-400 transition-all group">
                            <div className="flex items-center gap-3 mb-3 border-b border-stone-100 pb-3">
                                <div className="bg-stone-100 p-2 rounded-sm text-stone-600 group-hover:bg-indigo-50 group-hover:text-indigo-700 transition-colors">
                                    <ShopIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="font-bold text-stone-800 text-lg">{shop.label}</div>
                                    <div className="text-sm font-bold text-amber-700">投資ランク: {currentLevel} / 5</div>
                                </div>
                            </div>
                            <p className="text-xs text-stone-500 mb-2 leading-relaxed h-8 overflow-hidden">{shop.desc}</p>
                            <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4">{shop.details}</div>
                            <button
                                onClick={() => onInvest(shop.id)}
                                disabled={isMax || gameState.budget < cost}
                                className={`w-full py-2.5 rounded-sm font-bold transition-all text-sm shadow-sm active:scale-95 ${isMax ? 'bg-stone-200 text-stone-500 cursor-not-allowed' : (gameState.budget < cost ? 'bg-stone-100 text-stone-400 cursor-not-allowed' : 'bg-amber-700 hover:bg-amber-600 text-white')}`}
                            >
                                {isMax ? '最大投資済み' : (gameState.budget < cost ? `${cost.toLocaleString()}G 必要` : `${cost.toLocaleString()}G で投資する`)}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
