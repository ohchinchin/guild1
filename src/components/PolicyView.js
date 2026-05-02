window.G1 = window.G1 || {};
window.G1.components = window.G1.components || {};

window.G1.components.PolicyView = ({ gameState, onUpdateAlignment }) => {
    const L = window.LucideReact;
    const SafeIcon = (name) => L[name] || L[name.replace('2', '')] || L.Shield;

    const Shield = SafeIcon('Shield');
    const MapIcon = SafeIcon('Map');
    const Swords = SafeIcon('Swords');
    const Coins = SafeIcon('Coins');
    const Info = SafeIcon('Info');

    const policies = [
        { id: 'safety', label: '安全重視', icon: Shield, desc: '冒険者の安全を第一に。死亡率が低下しますが、戦力の成長は緩やかになります。', color: 'text-emerald-600' },
        { id: 'adventure', label: '冒険重視', icon: MapIcon, desc: '未知の探索を。新しいダンジョンの発見率と探索成功率が上がります。', color: 'text-indigo-600' },
        { id: 'military', label: '武力重視', icon: Swords, desc: '戦闘能力の向上。戦士系の能力が大幅に上がりますが、維持費が増加します。', color: 'text-rose-600' },
        { id: 'commerce', label: '商業重視', icon: Coins, desc: 'ギルドの収益を最優先。酒場などの収入が増えますが、忠誠度が下がりやすくなります。', color: 'text-amber-600' }
    ];

    const total = Object.values(gameState.alignment).reduce((a, b) => a + b, 0);

    const handleSliderChange = (id, value) => {
        const newVal = parseInt(value);
        const diff = newVal - gameState.alignment[id];
        const otherIds = policies.filter(p => p.id !== id).map(p => p.id);
        let nextAlignment = { ...gameState.alignment, [id]: newVal };
        const share = diff / otherIds.length;
        otherIds.forEach(oid => { nextAlignment[oid] = Math.max(0, Math.min(100, nextAlignment[oid] - share)); });
        const currentTotal = Object.values(nextAlignment).reduce((a, b) => a + b, 0);
        if (currentTotal !== 100) nextAlignment[otherIds[0]] += (100 - currentTotal);
        onUpdateAlignment(nextAlignment);
    };

    return (
        <div key="policies" className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex justify-between items-center">
                <p className="text-sm font-bold text-stone-600">ギルド運営方針の調整</p>
                <div className="flex items-center gap-2 bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
                    <Info className="w-3.5 h-3.5 text-stone-400" />
                    <span className="text-[10px] font-bold text-stone-500">合計配分: {Math.round(total)}%</span>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {policies.map(policy => (
                    <div key={policy.id} className="bg-white border border-stone-200 p-5 rounded-sm shadow-sm relative overflow-hidden">
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`p-2 rounded-sm bg-stone-50 ${policy.color}`}><policy.icon className="w-5 h-5" /></div>
                            <h3 className="font-bold text-stone-800">{policy.label}</h3>
                            <span className="ml-auto font-black text-xl text-stone-700">{Math.round(gameState.alignment[policy.id])}%</span>
                        </div>
                        <p className="text-xs text-stone-500 mb-6 leading-relaxed">{policy.desc}</p>
                        <input
                            type="range" min="0" max="100" step="1"
                            value={gameState.alignment[policy.id]}
                            onChange={(e) => handleSliderChange(policy.id, e.target.value)}
                            className="w-full h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-stone-800"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
