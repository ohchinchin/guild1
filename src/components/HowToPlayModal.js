window.G1 = window.G1 || {};
window.G1.components = window.G1.components || {};

window.G1.components.HowToPlayModal = ({ isOpen, onClose }) => {
    const L = window.LucideReact;
    const SafeIcon = (name) => L[name] || L[name.replace('2', '')] || L.BookOpen;

    const X = SafeIcon('X');
    const BookOpen = SafeIcon('BookOpen');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 font-serif backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#FAF8F5] border-2 border-[#D4C3A3] rounded-sm max-w-2xl w-full shadow-2xl relative flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-[#D4C3A3] bg-[#E8E0D5] flex justify-between items-center shrink-0">
                    <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-indigo-700" /> 遊び方と進め方のコツ
                    </h2>
                    <button onClick={onClose} className="text-stone-500 hover:text-stone-800 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto space-y-6 text-stone-700 leading-relaxed text-sm">
                    <section>
                        <h3 className="font-black text-indigo-800 text-base mb-2 border-b border-indigo-100 pb-1">1. 50ターンでの攻略</h3>
                        <p>ギルドマスターとして50ターンの間に最強のギルドを築いてください。結果により結末が変化します。</p>
                    </section>
                    <section>
                        <h3 className="font-black text-indigo-800 text-base mb-2 border-b border-indigo-100 pb-1">2. 一括派遣と自動編成</h3>
                        <p>掲示板の「一括派遣」を使えば、待機中のメンバーを最適な依頼へ自動で割り振ります。個別に編成する場合も「自動選出」が便利です。</p>
                    </section>
                </div>
                <div className="p-4 bg-stone-50 border-t border-[#D4C3A3] text-center">
                    <button onClick={onClose} className="bg-stone-800 hover:bg-stone-700 text-[#F2E8C6] px-8 py-3 rounded-sm font-bold active:scale-95">理解した</button>
                </div>
            </div>
        </div>
    );
};
