import htm from 'https://unpkg.com/htm?module';
const React = window.React;
const html = htm.bind(React.createElement);
const { Users, Coins, Dumbbell } = window.LucideReact;

export default function FacilityView({ gameState, investFacility }) {
    const facilities = [
        { id: 'residence', label: '居住区', desc: '最大収容人数の増加', icon: Users, details: '所属できる冒険者の最大数が5名増加します。' },
        { id: 'tavern', label: '酒場と宿屋', desc: '毎季節の固定収入増加', icon: Coins, details: '商業方針と組み合わせることで莫大な利益を生み出します。' },
        { id: 'training', label: '訓練場', desc: '獲得経験値の底上げ', icon: Dumbbell, details: '任務成功時に得られる冒険者の戦力上昇量が増加します。' }
    ];

    return html`
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
            <p className="text-stone-600 mb-4">金庫の資金（各1000G）を使用して、ギルド内部の施設を拡張します。</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                ${facilities.map(fac => {
                    const FacIcon = fac.icon;
                    const cost = 1000 + (gameState.facilities[fac.id] * 500);
                    return html`
                        <div key=${fac.id} className="bg-white border border-[#E8E0D5] p-4 rounded-sm shadow-sm flex flex-col hover:-translate-y-1 transition-transform">
                            <div className="flex items-center gap-3 mb-3 border-b border-stone-100 pb-3">
                                <div className="bg-stone-100 p-2 rounded-sm text-stone-600"><${FacIcon} className="w-6 h-6" /></div>
                                <div>
                                    <div className="font-bold text-stone-800 text-lg">${fac.label}</div>
                                    <div className="text-sm font-bold text-indigo-700">Lv. ${gameState.facilities[fac.id]}</div>
                                </div>
                            </div>
                            <p className="text-xs text-stone-600 mb-4 flex-1 leading-relaxed">${fac.details}</p>
                            <button onClick=${() => investFacility(fac.id)} className="w-full bg-stone-800 hover:bg-stone-700 text-[#F2E8C6] py-2 rounded-sm font-bold transition-colors text-sm shadow-sm active:scale-95">
                                ${cost}G で増築する
                            </button>
                        </div>
                    `;
                })}
            </div>
        </div>
    `;
}
