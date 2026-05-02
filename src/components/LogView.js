window.G1 = window.G1 || {};
window.G1.components = window.G1.components || {};

window.G1.components.LogView = ({ gameState }) => {
    const L = window.LucideReact;
    const SafeIcon = (name) => L[name] || L[name.replace('2', '')] || L.BookOpen;

    const BookOpen = SafeIcon('BookOpen');
    const ArrowRight = SafeIcon('ArrowRight');
    const Activity = SafeIcon('Activity');
    const Skull = SafeIcon('Skull');
    const Coins = SafeIcon('Coins');
    const CheckCircle = SafeIcon('CheckCircle');

    const getLogIcon = (type) => {
        switch (type) {
            case 'danger': return <Skull className="w-4 h-4 text-rose-600" />;
            case 'success': return <CheckCircle className="w-4 h-4 text-emerald-600" />;
            case 'warning': return <Activity className="w-4 h-4 text-amber-500" />;
            case 'finance': return <Coins className="w-4 h-4 text-stone-500" />;
            default: return <ArrowRight className="w-4 h-4 text-stone-300" />;
        }
    };

    return (
        <div key="logs" className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500 h-full flex flex-col">
            <p className="text-sm font-bold text-stone-600 mb-2">これまでの活動記録</p>
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 pb-4">
                {(gameState.history || []).slice().reverse().map((log, i) => (
                    <div key={i} className="bg-white border border-stone-200 p-3 rounded-sm shadow-sm flex items-start gap-3">
                        <div className="shrink-0 mt-0.5">{getLogIcon(log.type)}</div>
                        <div className="flex-1">
                            <div className="text-[10px] font-bold text-stone-400 mb-0.5">{log.turn ? `ターン ${log.turn}` : ''}</div>
                            <div className="text-xs text-stone-700 font-medium leading-relaxed">{log.text}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
