import htm from 'https://unpkg.com/htm?module';
const React = window.React;
const html = htm.bind(React.createElement);
const { Target, MessageSquare, AlertTriangle, ScrollText, Coins, HeartHandshake } = window.LucideReact;

export default function HomeView({ html: _, gameState, currentGuildPower, currentYear, currentSeason, getReputationText, getFinancialReport, hireReceptionist, setSelectedCandidate, selectedCandidate, openSpecialRequestModal, declineSpecialRequest }) {
    return html`
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            ${gameState.specialRequest && html`
                <div className="bg-indigo-900 border border-indigo-700 p-5 rounded-sm shadow-md text-indigo-50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4"><${Target} className="w-48 h-48 text-indigo-400" /></div>
                    <h4 className="font-bold text-xl mb-2 flex items-center gap-2 text-indigo-200 relative z-10"><${Target} className="w-6 h-6" /> 指名依頼：${gameState.specialRequest.name}</h4>
                    <p className="text-sm text-indigo-100 mb-4 relative z-10 leading-relaxed">${gameState.specialRequest.desc}</p>
                    <div className="flex gap-4 text-sm font-bold mb-4 bg-indigo-950/50 p-3 rounded relative z-10">
                        <span>推奨戦力: <span className="text-rose-400">${gameState.specialRequest.powerReq}</span></span>
                        <span>報酬: <span className="text-amber-400">${gameState.specialRequest.reward}G</span></span>
                    </div>
                    <div className="flex gap-3 relative z-10">
                        <button onClick=${openSpecialRequestModal} className="bg-rose-700 hover:bg-rose-600 text-white px-4 py-2 rounded-sm font-bold shadow-sm active:scale-95 transition-all">特別部隊を編成する</button>
                        <button onClick=${declineSpecialRequest} className="bg-indigo-800 hover:bg-indigo-700 text-indigo-200 px-4 py-2 rounded-sm font-bold shadow-sm active:scale-95 transition-all">丁重に断る</button>
                    </div>
                </div>
            `}

            <div className="bg-[#F2E8C6] border border-[#D4C3A3] p-4 rounded-sm shadow-sm relative">
                <${MessageSquare} className="absolute top-4 left-4 w-6 h-6 text-amber-700/30" />
                <p className="text-stone-700 italic pl-8 font-medium leading-relaxed">
                    ${gameState.currentRumor}
                </p>
            </div>

            ${gameState.currentEvent && html`
                <div className="bg-amber-100 border-l-4 border-amber-500 p-4 rounded-sm shadow-sm flex items-start gap-3">
                    <${AlertTriangle} className="w-6 h-6 text-amber-600 shrink-0" />
                    <div>
                        <h4 className="font-bold text-amber-800">【世界情勢】${gameState.currentEvent.name}</h4>
                        <p className="text-sm text-amber-700">${gameState.currentEvent.desc}</p>
                    </div>
                </div>
            `}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <div className="bg-white p-5 border border-[#E8E0D5] rounded-sm shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold text-stone-800 mb-3 flex items-center gap-2 border-b border-[#E8E0D5] pb-2">
                        <${ScrollText} className="w-5 h-5 text-indigo-700" /> 街での評判と現状
                    </h3>
                    <p className="text-stone-700 leading-relaxed font-medium mb-4 flex-1">
                        マスター、第 ${currentYear} 暦 【${currentSeason}】 の報告です。<br /><br />
                        現在の金庫には <span className="font-bold text-amber-600">${gameState.budget.toLocaleString()} G</span> の資金があります。
                        人員は ${gameState.adventurers.length} 名が所属しており、今季の主力部隊の戦力は ${currentGuildPower} と評価されています。<br />
                        <br />
                        世間の評価についてですが、我がギルドは現在、<strong>${getReputationText()}</strong>
                    </p>
                </div>

                <div className="bg-stone-50 p-5 border border-[#D4C3A3] rounded-sm shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold text-stone-800 mb-3 flex items-center gap-2 border-b border-[#D4C3A3] pb-2">
                        <${Coins} className="w-5 h-5 text-amber-600" /> 次季の収支見込み
                    </h3>
                    ${(() => {
                        const report = getFinancialReport();
                        return html`
                            <div className="space-y-3 flex-1">
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs font-bold text-emerald-700">
                                        <span>商業・雑用収入 (見込)</span>
                                        <span>+${report.totalIncome} G</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] text-stone-500 pl-2">
                                        <span>- 酒場/宿屋収益</span>
                                        <span>+${report.commerceIncome} G</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] text-stone-500 pl-2">
                                        <span>- 待機メンバー雑用</span>
                                        <span>+${report.choresIncome} G</span>
                                    </div>
                                </div>
                                <div className="space-y-1 pt-1 border-t border-stone-200">
                                    <div className="flex justify-between text-xs font-bold text-rose-700">
                                        <span>維持費・給与 (確定)</span>
                                        <span>-${report.totalExpense} G</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] text-stone-500 pl-2">
                                        <span>- 冒険者/受付給与</span>
                                        <span>-${report.salaries} G</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] text-stone-500 pl-2">
                                        <span>- 施設維持費</span>
                                        <span>-${report.maintenance} G</span>
                                    </div>
                                </div>
                                <div className="pt-2 border-t-2 border-stone-300 flex justify-between items-center">
                                    <span className="text-sm font-bold text-stone-700">次季の純収支</span>
                                    <span className=${`text-lg font-bold ${report.balance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        ${report.balance >= 0 ? '+' : ''}${report.balance} G
                                    </span>
                                </div>
                                <p className="text-[10px] text-stone-400 italic">※クエスト報酬や突発イベントは含まれません。</p>
                            </div>
                        `;
                    })()}
                </div>

                <div className="bg-stone-50 p-5 border border-[#D4C3A3] rounded-sm shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold text-stone-800 mb-3 flex items-center gap-2 border-b border-[#D4C3A3] pb-2">
                        <${HeartHandshake} className="w-5 h-5 text-rose-700" /> ギルド受付窓口
                    </h3>
                    <div className="flex-1">
                        <div className="mb-4">
                            <div className="text-sm font-bold text-stone-600 mb-1">現在の受付担当</div>
                            <div className="text-lg font-bold text-indigo-800 mb-1">${gameState.receptionist.name}</div>
                            <p className="text-xs text-stone-600 leading-relaxed bg-white p-2 rounded border border-stone-200">${gameState.receptionist.desc} <span className="font-bold">(維持費: ${gameState.receptionist.salary}G)</span></p>
                        </div>
                        <div>
                            <div className="text-xs font-bold text-stone-500 mb-2">求人応募者</div>
                            <div className="grid grid-cols-1 gap-2 mb-3">
                                ${gameState.availableReceptionists.map(rep => html`
                                    <button
                                        key=${rep.id}
                                        onClick=${() => setSelectedCandidate(rep.id === selectedCandidate?.id ? null : rep)}
                                        className=${`text-left p-2 border rounded text-xs transition-colors flex justify-between items-center ${selectedCandidate?.id === rep.id ? 'bg-indigo-50 border-indigo-300 font-bold text-indigo-800 shadow-sm' : 'bg-white hover:bg-stone-100 text-stone-700'}`}
                                    >
                                        <span>${rep.name}</span>
                                    </button>
                                `)}
                            </div>
                            ${selectedCandidate && html`
                                <div className="bg-white p-3 rounded border border-indigo-200 shadow-sm animate-in fade-in zoom-in-95 duration-200">
                                    <div className="font-bold text-indigo-800 text-sm mb-1">${selectedCandidate.name}</div>
                                    <p className="text-xs text-stone-600 mb-2">${selectedCandidate.desc}</p>
                                    <div className="flex justify-between items-center text-xs mb-3">
                                        <span>採用金: <span className="font-bold text-amber-600">${selectedCandidate.hireCost}G</span></span>
                                        <span>維持費: <span className="font-bold text-stone-800">${selectedCandidate.salary}G/季</span></span>
                                    </div>
                                    <button
                                        onClick=${() => {
                                            hireReceptionist(selectedCandidate);
                                            setSelectedCandidate(null);
                                        }}
                                        className="w-full bg-indigo-700 hover:bg-indigo-600 text-white py-2 rounded-sm font-bold transition-colors shadow-sm active:scale-95"
                                    >
                                        採用する
                                    </button>
                                </div>
                            `}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
