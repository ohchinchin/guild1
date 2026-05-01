import htm from 'https://unpkg.com/htm?module';
const React = window.React;
const html = htm.bind(React.createElement);
export default function ShopView({ gameState, investShop }) {
    const { Hammer, Wand2, ShoppingBag } = window.LucideReact || window.lucide || {};
    const shops = [
        { id: 'blacksmith', label: '鍛冶屋への融資', desc: '武器防具の優先供給', icon: Hammer, details: '軍事と探索における作戦の【成功率】がレベル毎に5%底上げされます。' },
        { id: 'magicShop', label: '魔法屋への融資', desc: '回復薬や護符の提供', icon: Wand2, details: 'クエスト失敗時の致命傷を防ぎ、【死亡リスク】をレベル毎に5%低下させます。' },
        { id: 'itemShop', label: '道具屋への融資', desc: '日用品の卸売り契約', icon: ShoppingBag, details: 'ギルド施設の【毎季節の維持費】がレベル毎に10%（最大50%）割引されます。' }
    ];

    return html`
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
            <p className="text-stone-600 mb-4">街の店舗に投資（各1000G）し、専属契約を結ぶことでギルド全体に強力な恩恵をもたらします。(最大Lv.5)</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                ${shops.map(shop => {
                    const ShopIcon = shop.icon;
                    return html`
                        <div key=${shop.id} className="bg-white border border-[#E8E0D5] p-4 rounded-sm shadow-sm flex flex-col hover:-translate-y-1 transition-transform">
                            <div className="flex items-center gap-3 mb-3 border-b border-stone-100 pb-3">
                                <div className="bg-stone-100 p-2 rounded-sm text-stone-600"><${ShopIcon} className="w-6 h-6" /></div>
                                <div>
                                    <div className="font-bold text-stone-800 text-lg">${shop.label}</div>
                                    <div className="text-sm font-bold text-amber-700">契約Lv. ${gameState.shops[shop.id]} / 5</div>
                                </div>
                            </div>
                            <p className="text-xs text-stone-600 mb-4 flex-1 leading-relaxed">${shop.details}</p>
                            <button
                                onClick=${() => investShop(shop.id)}
                                disabled=${gameState.shops[shop.id] >= 5}
                                className=${`w-full py-2 rounded-sm font-bold transition-colors text-sm shadow-sm active:scale-95 ${gameState.shops[shop.id] >= 5 ? 'bg-stone-300 text-stone-500 cursor-not-allowed' : 'bg-amber-700 hover:bg-amber-600 text-white'}`}
                            >
                                ${gameState.shops[shop.id] >= 5 ? '最大レベル到達' : '1000G で提携強化'}
                            </button>
                        </div>
                    `;
                })}
            </div>
        </div>
    `;
}
