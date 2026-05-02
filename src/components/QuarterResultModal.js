window.G1 = window.G1 || {};
window.G1.components = window.G1.components || {};

window.G1.components.QuarterResultModal = ({ quarterResult, onConfirm }) => {
    const L = window.LucideReact;
    const SafeIcon = (name) => L[name] || L[name.replace('2', '')] || L.ScrollText;

    const ScrollText = SafeIcon('ScrollText');
    const AlertTriangle = SafeIcon('AlertTriangle');
    const Coins = SafeIcon('Coins');
    const Skull = SafeIcon('Skull');
    const Activity = SafeIcon('Activity');
    const CheckCircle = SafeIcon('CheckCircle');
    const Crown = SafeIcon('Crown');
    const LogOut = SafeIcon('LogOut');
    const UserPlus = SafeIcon('UserPlus');
    const ArrowRight = SafeIcon('ArrowRight');

    const getSummaryIcon = (type) => {
        switch (type) {
            case 'event': return <AlertTriangle className="w-5 h-5 text-amber-600" />;
            case 'finance': return <Coins className="w-5 h-5 text-stone-500" />;
            case 'danger': return <Skull className="w-5 h-5 text-rose-700" />;
            case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
            case 'info': return <Activity className="w-5 h-5 text-indigo-500" />;
            case 'success': return <CheckCircle className="w-5 h-5 text-emerald-600" />;
            case 'hero': return <Crown className="w-5 h-5 text-amber-500" />;
            case 'fail': return <Skull className="w-5 h-5 text-rose-800" />;
            case 'death': return <Skull className="w-5 h-5 text-rose-900" />;
            case 'injury': return <Activity className="w-5 h-5 text-rose-500" />;
            case 'leave': return <LogOut className="w-5 h-5 text-rose-600" />;
            case 'join': return <UserPlus className="w-5 h-5 text-indigo-600" />;
            default: return <ArrowRight className="w-5 h-5 text-stone-400" />;
        }
    };

    if (!quarterResult) return null;
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4 font-serif backdrop-blur-sm">
            <div className="bg-[#FAF8F5] border-2 border-[#D4C3A3] rounded-sm max-w-lg w-full shadow-2xl relative flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-300">
                <div className="p-5 border-b border-[#D4C3A3] bg-[#E8E0D5] text-center shrink-0">
                    <h2 className="text-xl font-bold text-stone-800 tracking-widest flex items-center justify-center gap-2">
                        <ScrollText className="w-6 h-6" /> 第 {quarterResult.year} 暦 【{quarterResult.season}】 決算報告
                    </h2>
                </div>
                <div className="p-6 overflow-y-auto space-y-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent to-stone-100/50">
                    {quarterResult.items.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3 bg-white p-3 border border-[#E8E0D5] rounded-sm shadow-sm animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${idx * 150}ms`, animationFillMode: 'both' }}>
                            <div className="shrink-0 mt-0.5">{getSummaryIcon(item.type)}</div>
                            <div className="text-sm text-stone-700 leading-relaxed font-medium whitespace-pre-wrap">{item.text}</div>
                        </div>
                    ))}
                </div>
                <div className="p-4 bg-stone-100 border-t border-[#D4C3A3] flex justify-between items-center text-sm shrink-0">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-stone-500 font-bold">現在の金庫</span>
                        <span className={`font-bold ${quarterResult.budget < 0 ? 'text-rose-600' : 'text-amber-600'}`}>{quarterResult.budget.toLocaleString()} G</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-stone-500 font-bold">名声</span>
                        <span className="font-bold text-indigo-700">{quarterResult.fame}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-stone-500 font-bold">悪名</span>
                        <span className="font-bold text-rose-800">{quarterResult.notoriety}</span>
                    </div>
                </div>
                <div className="p-4 bg-white border-t border-[#E8E0D5] shrink-0">
                    <button
                        onClick={onConfirm}
                        className="w-full bg-stone-800 hover:bg-stone-700 text-[#F2E8C6] py-3 rounded-sm font-bold transition-colors text-sm shadow-sm flex items-center justify-center gap-2"
                    >
                        {quarterResult.isGameOver ? '報告を確認し、結果を受け入れる' : '報告を確認し、次の操作へ'} <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};
