window.G1 = window.G1 || {};
window.G1.components = window.G1.components || {};

const { Swords, Info, AlertTriangle, UserPlus, X, CheckCircle2 } = window.LucideReact;

window.G1.components.DispatchModal = ({ dispatchTarget, gameState, dispatchCandidates, onToggleCandidate, onConfirm, onCancel }) => {
    if (!dispatchTarget) return null;

    const Utils = window.G1.Utils;
    const powerInfo = Utils.calculatePartyPower(dispatchCandidates, gameState.adventurers, gameState.alignment, gameState.masterSkills);
    const errors = Utils.checkQuestRequirements(dispatchCandidates, gameState.adventurers, dispatchTarget.quest);
    
    // Add special limit error
    if (dispatchTarget.isSpecial && dispatchCandidates.length > 5) {
        errors.push('特殊指名依頼は最大5名までしか派遣できません');
    }

    const isReady = errors.length === 0;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[70] p-4 font-serif backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[#FAF8F5] border-2 border-[#D4C3A3] rounded-sm max-w-4xl w-full shadow-2xl relative flex flex-col max-h-[90vh]">
                <div className={`p-4 border-b border-[#D4C3A3] flex justify-between items-center shrink-0 ${dispatchTarget.isSpecial ? 'bg-indigo-900 text-white' : 'bg-[#E8E0D5] text-stone-800'}`}>
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        {dispatchTarget.isSpecial ? <Target className="w-5 h-5 text-indigo-300" /> : <UserPlus className="w-5 h-5" />} 
                        {dispatchTarget.isSpecial ? '特殊指名依頼・編成' : '任務部隊編成'}: {dispatchTarget.quest.name}
                    </h2>
                    <button onClick={onCancel} className="text-stone-500 hover:text-stone-800 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                    {/* Party Selection (Left) */}
                    <div className="flex-1 p-5 overflow-y-auto border-r border-[#D4C3A3]">
                        <p className="text-xs font-bold text-stone-500 mb-3 uppercase tracking-wider">派遣候補（待機中の冒険者）</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {gameState.adventurers.filter(a => a.status === 'idle').map(adv => {
                                const isSelected = dispatchCandidates.includes(adv.id);
                                const ClassData = window.G1.Constants.CLASSES.find(c => c.id === adv.advClass.id);
                                const AdvIcon = window.LucideReact[ClassData.icon];
                                return (
                                    <button
                                        key={adv.id}
                                        onClick={() => onToggleCandidate(adv.id)}
                                        className={`p-3 border rounded-sm flex justify-between items-center transition-all ${isSelected ? 'bg-amber-50 border-amber-500 ring-1 ring-amber-200 shadow-sm' : 'bg-white border-stone-200 hover:border-stone-400'}`}
                                    >
                                        <div className="text-left">
                                            <div className="text-sm font-bold text-stone-800">{adv.name} <span className="text-[10px] text-stone-400 ml-1">Lv.{adv.power}</span></div>
                                            <div className="text-[10px] font-medium text-indigo-600 flex items-center gap-1">
                                                <AdvIcon className="w-3 h-3" /> {adv.advClass.name}
                                            </div>
                                        </div>
                                        <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${isSelected ? 'bg-amber-500 border-amber-500' : 'border-stone-300'}`}>
                                            {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Summary (Right) */}
                    <div className="w-full md:w-80 bg-stone-50 p-5 flex flex-col shrink-0">
                        <div className="bg-white border border-[#D4C3A3] p-4 rounded-sm shadow-sm mb-4">
                            <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest mb-3 border-b border-stone-100 pb-1">部隊ステータス</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <span className="text-xs text-stone-500 font-bold">合計戦力</span>
                                    <span className={`text-xl font-black ${powerInfo.total >= dispatchTarget.quest.powerReq ? 'text-emerald-600' : 'text-stone-700'}`}>
                                        {powerInfo.total} <span className="text-xs text-stone-400">/ {dispatchTarget.quest.powerReq}</span>
                                    </span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-xs text-stone-500 font-bold">編成人数</span>
                                    <span className={`text-lg font-bold ${dispatchCandidates.length >= dispatchTarget.quest.minMembers ? 'text-stone-700' : 'text-rose-600'}`}>
                                        {dispatchCandidates.length} <span className="text-xs text-stone-400">/ 最低 {dispatchTarget.quest.minMembers}</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest mb-2">派遣前チェック</h3>
                            <div className="space-y-2">
                                {errors.length > 0 ? (
                                    errors.map((err, i) => (
                                        <div key={i} className="text-xs text-rose-600 font-bold flex items-start gap-2 bg-rose-50 p-2 border border-rose-100 rounded-sm">
                                            <AlertTriangle className="w-4 h-4 shrink-0" /> {err}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-xs text-emerald-600 font-bold flex items-start gap-2 bg-emerald-50 p-2 border border-emerald-100 rounded-sm">
                                        <CheckCircle2 className="w-4 h-4 shrink-0" /> 派遣準備完了
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            disabled={!isReady}
                            onClick={onConfirm}
                            className={`mt-4 w-full py-4 rounded-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 ${isReady ? 'bg-stone-800 hover:bg-stone-700 text-[#F2E8C6] active:scale-95' : 'bg-stone-200 text-stone-400 cursor-not-allowed'}`}
                        >
                            <Swords className="w-5 h-5" /> 任務を開始する
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
