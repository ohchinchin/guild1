window.G1 = window.G1 || {};
window.G1.components = window.G1.components || {};

window.G1.components.QuestView = ({ gameState, onDispatch }) => {
    const L = window.LucideReact;
    const SafeIcon = (name) => L[name] || L[name.replace('2', '')] || L.Swords;

    const Swords = SafeIcon('Swords');
    const UserPlus = SafeIcon('UserPlus');
    const Info = SafeIcon('Info');
    const Zap = SafeIcon('Zap');
    const Activity = SafeIcon('Activity');

    return (
        <div key="quests" className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-500 overflow-hidden">
            <div className="flex justify-between items-center mb-3 shrink-0">
                <p className="text-sm font-bold text-stone-600">ギルド掲示板（受注可能な依頼）</p>
                <button
                    onClick={window.G1.appHandlers.onMassDispatch}
                    className="text-xs font-bold bg-indigo-700 hover:bg-indigo-600 text-white px-4 py-2 rounded-sm flex items-center gap-2 transition-all shadow-sm active:scale-95"
                >
                    <Zap className="w-4 h-4" /> 最適な部隊を一括で派遣する
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 pb-4 pr-1">
                {/* Active Dispatches Summary */}
                {gameState.dispatches && gameState.dispatches.length > 0 && (
                    <div className="bg-indigo-900 border-2 border-indigo-700 p-4 rounded-sm shadow-md mb-6">
                        <h4 className="text-xs font-black text-indigo-300 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Activity className="w-4 h-4" /> 現在進行中の任務 ({gameState.dispatches.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {gameState.dispatches.map((d, i) => (
                                <div key={i} className="bg-indigo-950/50 border border-indigo-600 px-3 py-1.5 rounded-sm text-[10px] text-indigo-100 font-bold">
                                    {d.quest.name} <span className="text-indigo-400 ml-1">({d.partyIds.length}名)</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {gameState.availableQuests.map(quest => (
                    <div key={quest.id} className="bg-white border-2 border-[#D4C3A3] rounded-sm p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-1 bg-[#E8E0D5] border-l border-b border-[#D4C3A3] text-[10px] font-bold text-stone-600">
                            期限: {quest.turnLimit} 季節
                        </div>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-stone-800 flex items-center gap-2 group-hover:text-amber-800 transition-colors">
                                    <Swords className="w-5 h-5" /> {quest.name}
                                </h3>
                                <p className="text-xs text-stone-500 font-medium mt-1">{quest.desc}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-xl font-bold text-amber-700">{quest.reward.toLocaleString()} G</div>
                                {quest.deposit > 0 && <div className="text-[10px] font-bold text-stone-400">供託金: {quest.deposit} G</div>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                            <div className="bg-stone-50 p-2 border border-stone-100 rounded-sm">
                                <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-1">推奨戦力</div>
                                <div className="text-sm font-bold text-stone-700">{quest.powerReq} 以上</div>
                            </div>
                            <div className="bg-stone-50 p-2 border border-stone-100 rounded-sm">
                                <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-1">最低人数</div>
                                <div className="text-sm font-bold text-stone-700">{quest.minMembers} 名</div>
                            </div>
                            {quest.requirements.length > 0 && (
                                <div className="bg-stone-50 p-2 border border-stone-100 rounded-sm col-span-1 sm:col-span-1">
                                    <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-1">特殊条件</div>
                                    <div className="text-[11px] font-bold text-rose-700">{quest.requirements.map(r => r.name).join(', ')}</div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => onDispatch(quest)}
                            className="w-full bg-stone-800 hover:bg-stone-700 text-[#F2E8C6] py-3 rounded-sm font-bold transition-all flex items-center justify-center gap-2 group-hover:scale-[1.01] active:scale-95 shadow-sm"
                        >
                            <UserPlus className="w-4 h-4" /> 部隊を編成・派遣する
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
