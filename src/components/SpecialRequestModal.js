import htm from 'https://unpkg.com/htm?module';
const React = window.React;
const html = htm.bind(React.createElement);
const { Target, AlertTriangle, CheckCircle2 } = window.LucideReact;

export default function SpecialRequestModal({ reqModalOpen, setReqModalOpen, gameState, reqParty, handleToggleReqParty, executeSpecialRequest, calculatePartyPower }) {
    if (!reqModalOpen) return null;
    const { total: reqPower, warnings } = calculatePartyPower(reqParty, gameState);

    return html`
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 font-serif backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#FAF8F5] border-2 border-[#D4C3A3] rounded-sm max-w-2xl w-full shadow-2xl relative flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-[#D4C3A3] bg-[#E8E0D5]">
                    <h2 className="text-xl font-bold text-stone-800 flex items-center gap-2"><${Target} className="w-6 h-6 text-indigo-700" /> 特別指名依頼 部隊編成</h2>
                    <p className="text-sm text-stone-600 mt-1">ギルドマスターの権限で、今回出撃するメンバーを直接指示してください。（最大5名）</p>
                </div>

                <div className="p-4 bg-white border-b border-stone-200 flex justify-between items-center shrink-0">
                    <div>
                        <div className="text-xs text-stone-500 font-bold">目標: ${gameState.specialRequest.name}</div>
                        <div className="text-sm font-bold text-rose-600">推奨戦力: ${gameState.specialRequest.powerReq}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-stone-500 font-bold">現在の編成戦力</div>
                        <div className=${`text-2xl font-bold ${reqPower >= gameState.specialRequest.powerReq ? 'text-emerald-600' : 'text-amber-600'}`}>${reqPower}</div>
                    </div>
                </div>

                ${warnings.length > 0 && html`
                    <div className="px-4 py-2 bg-rose-50 border-b border-rose-200">
                        ${warnings.map((w, i) => html`<div key=${i} className="text-xs text-rose-700 font-bold flex items-center gap-1"><${AlertTriangle} className="w-3 h-3" /> ${w}</div>`)}
                    </div>
                `}

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    ${(gameState.adventurers || []).map(adv => {
                        const isSelected = reqParty.includes(adv.id);
                        const canSelect = adv.loyalty >= 30;
                        const AdvIcon = window.LucideReact[adv.advClass.icon];
                        return html`
                            <div key=${adv.id}
                                onClick=${() => canSelect && handleToggleReqParty(adv)}
                                className=${`p-3 border rounded flex justify-between items-center transition-all ${!canSelect ? 'bg-stone-100 border-stone-200 opacity-60 cursor-not-allowed' :
                                        isSelected ? 'bg-indigo-50 border-indigo-400 cursor-pointer shadow-sm' : 'bg-white border-stone-300 hover:border-indigo-300 cursor-pointer'
                                    }`}>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-stone-800 text-sm">${adv.name}</span>
                                        <span className=${`text-[10px] px-1.5 py-0.5 rounded-sm font-bold border ${adv.rank === 'S' ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-stone-100 text-stone-600 border-stone-300'}`}>${adv.rank} 級</span>
                                    </div>
                                    <div className="text-[11px] font-medium flex items-center gap-1 text-indigo-700 mt-1">
                                        <${AdvIcon} className="w-3 h-3" /> ${adv.advClass.name} <span className="text-stone-400">|</span> <span className="text-amber-700">${adv.personality.name}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-stone-800">戦力 ${adv.power}</div>
                                    <div className=${`text-[10px] font-bold mt-1 ${adv.loyalty < 30 ? 'text-rose-600' : 'text-stone-500'}`}>忠誠 ${adv.loyalty}% ${adv.loyalty < 30 ? '(命令拒否)' : ''}</div>
                                </div>
                                ${isSelected && html`<div className="absolute right-4 text-indigo-600"><${CheckCircle2} className="w-5 h-5" /></div>`}
                            </div>
                        `;
                    })}
                </div>

                <div className="p-4 bg-stone-100 border-t border-[#D4C3A3] flex gap-3 shrink-0">
                    <button onClick=${() => setReqModalOpen(false)} className="px-6 py-2 bg-stone-300 hover:bg-stone-400 text-stone-800 rounded font-bold transition-colors text-sm">キャンセル</button>
                    <button
                        onClick=${executeSpecialRequest}
                        disabled=${reqParty.length === 0}
                        className=${`flex-1 py-2 rounded font-bold text-sm shadow-sm transition-colors ${reqParty.length > 0 ? 'bg-rose-700 hover:bg-rose-600 text-white' : 'bg-stone-300 text-stone-500 cursor-not-allowed'}`}
                    >
                        この編成で出撃する (${reqParty.length}/5)
                    </button>
                </div>
            </div>
        </div>
    `;
}
