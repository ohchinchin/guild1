import htm from 'https://unpkg.com/htm?module';
const React = window.React;
const html = htm.bind(React.createElement);
const { Swords, Shuffle, Search } = window.LucideReact;

export default function RosterView({ gameState, autoAssembleParty, searchAdventurer, setSelectedAdv }) {
    return html`
        <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="mb-6 shrink-0">
                <div className="flex items-center justify-between mb-3 border-b border-[#D4C3A3] pb-2">
                    <h3 className="font-bold flex items-center gap-2 text-stone-700">
                        <${Swords} className="w-5 h-5 text-indigo-600" /> 今季の主力部隊 (自動編成)
                    </h3>
                    <div className="flex gap-2">
                        <button
                            onClick=${autoAssembleParty}
                            className="text-xs font-bold bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 px-3 py-1.5 rounded-sm flex items-center gap-1 transition-colors shadow-sm active:scale-95"
                        >
                            <${Shuffle} className="w-3 h-3" /> おまかせ編成
                        </button>
                        <span className="text-xs font-bold bg-indigo-100 text-indigo-800 px-3 py-1.5 rounded-sm flex items-center">
                            編成: ${gameState.mainParty.length} / 5
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    ${Array.from({ length: 5 }).map((_, i) => {
                        const advId = gameState.mainParty[i];
                        const adv = gameState.adventurers.find(a => a.id === advId);
                        if (!adv) {
                            return html`
                                <button
                                    key=${i}
                                    className=${`p-3 rounded-sm border bg-stone-100/50 border-stone-200 border-dashed cursor-default flex flex-col items-center justify-center h-[110px] transition-all`}
                                >
                                    <span className="text-xs text-stone-400 font-bold">空き枠</span>
                                </button>
                            `;
                        }
                        const AdvIcon = window.LucideReact[adv.advClass.icon];
                        return html`
                            <button
                                key=${i}
                                onClick=${() => setSelectedAdv(adv)}
                                className=${`p-3 rounded-sm border bg-indigo-50 border-indigo-300 shadow-sm hover:border-indigo-500 hover:-translate-y-0.5 flex flex-col items-center justify-center h-[110px] transition-all`}
                            >
                                <${AdvIcon} className="w-6 h-6 text-indigo-500 mb-1" />
                                <span className="font-bold text-sm text-stone-800 text-center line-clamp-1 w-full">${adv.name}</span>
                                <span className="text-xs text-indigo-700 font-bold mt-1 bg-white px-2 py-0.5 rounded border border-indigo-100">戦力 ${adv.power}</span>
                            </button>
                        `;
                    })}
                </div>
            </div>

            <div className="flex-1 flex flex-col min-h-[300px]">
                <div className="flex justify-between items-center mb-3 shrink-0">
                    <p className="text-sm font-bold text-stone-600">所属冒険者一覧</p>
                    <div className="flex gap-2">
                        <button
                            onClick=${searchAdventurer}
                            className="text-xs font-bold bg-amber-700 hover:bg-amber-600 text-white px-3 py-1.5 rounded-sm flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                        >
                            <${Search} className="w-3.5 h-3.5" /> 人材を捜索 (500G)
                        </button>
                        <span className="text-xs font-bold text-stone-600 bg-[#E8E0D5] px-2 py-1 rounded-sm border border-[#D4C3A3] flex items-center">
                            所属: ${gameState.adventurers.length} / ${gameState.facilities.residence * 5} 名
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto pb-4 pr-1">
                    ${gameState.adventurers.map(adv => {
                        const isMain = gameState.mainParty.includes(adv.id);
                        const AdvIcon = window.LucideReact[adv.advClass.icon];
                        return html`
                            <button
                                key=${adv.id}
                                onClick=${() => setSelectedAdv(adv)}
                                className=${`p-3 bg-white border ${isMain ? 'border-indigo-300 ring-1 ring-indigo-100' : 'border-[#E8E0D5]'} rounded-sm shadow-sm flex justify-between items-center hover:border-amber-500 hover:shadow-md hover:-translate-y-0.5 transition-all group text-left relative`}
                            >
                                ${isMain && html`<div className="absolute -top-2 -right-2 bg-indigo-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">主力</div>`}
                                <div>
                                    <div className="text-sm font-bold text-stone-800 flex items-center gap-2 mb-1 group-hover:text-amber-700 transition-colors">
                                        <span className="truncate max-w-[90px]">${adv.name}</span>
                                        <span className=${`text-[10px] px-1.5 py-0.5 rounded-sm font-bold border shrink-0 ${adv.rank === 'S' ? 'bg-amber-100 text-amber-800 border-amber-300' : adv.rank === 'A' ? 'bg-purple-100 text-purple-800 border-purple-300' : 'bg-stone-100 text-stone-600 border-stone-300'}`}>${adv.rank} 級</span>
                                    </div>
                                    <div className="text-[11px] font-medium flex items-center gap-1 text-indigo-700">
                                        <${AdvIcon} className="w-3 h-3" /> ${adv.advClass.name} <span className="text-stone-400">|</span> <span className="text-amber-700">${adv.personality.name}</span>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <div className="text-sm font-bold text-stone-800">戦力 ${adv.power}</div>
                                    <div className=${`text-[10px] font-bold mt-1 ${adv.loyalty < 30 ? 'text-rose-600' : 'text-emerald-700'}`}>忠誠 ${adv.loyalty}%</div>
                                </div>
                            </button>
                        `;
                    })}
                    ${gameState.adventurers.length === 0 && html`
                        <div className="col-span-full text-center p-10 text-stone-400 font-medium border-2 border-dashed border-[#D4C3A3] rounded-sm bg-white/50">
                            現在、名簿には誰も名を連ねていません。
                        </div>
                    `}
                </div>
            </div>
        </div>
    `;
}
