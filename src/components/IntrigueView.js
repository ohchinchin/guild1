import htm from 'https://unpkg.com/htm?module';
const React = window.React;
const html = htm.bind(React.createElement);
export default function IntrigueView({ gameState, sabotageRival, headhuntRival, gatherIntelligence, getIntrigueChance, setSelectedAdv }) {
    const { Search, EyeOff } = window.LucideReact || window.lucide || {};
    return html`
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <p className="text-stone-600 mb-4">他ギルドへ工作を行い、競争を優位に進めます。ただし、失敗すると関係が悪化し、相手からの報復の確率が上がります。</p>
            <div className="grid grid-cols-1 gap-4">
                ${gameState.rivals.map(rival => html`
                    <div key=${rival.id} className="bg-white border border-[#E8E0D5] p-4 rounded-sm shadow-sm flex flex-col hover:border-[#D4C3A3] transition-colors relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-stone-200">
                            <div className=${`h-full transition-all ${rival.relation >= 80 ? 'bg-emerald-500' : rival.relation >= 40 ? 'bg-amber-500' : 'bg-rose-600'}`} style=${{ width: `${rival.relation}%` }}></div>
                        </div>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-stone-100 pb-4 mb-4 mt-2">
                            <div className="flex-1 w-full">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-stone-800 text-lg">${rival.name}</span>
                                    <span className="text-xs text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">
                                        ${rival.style === 'military' ? '武闘派' : rival.style === 'commerce' ? '商業派' : '治安派'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-sm font-bold text-indigo-700">推定戦力: ${rival.power}</div>
                                    <div className="text-xs font-bold text-stone-500">友好度: <span className=${rival.relation >= 80 ? 'text-emerald-600' : rival.relation >= 40 ? 'text-amber-600' : 'text-rose-600'}>${rival.relation}</span></div>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 w-full md:w-auto">
                                <button onClick=${() => sabotageRival(rival.id)} className="bg-stone-800 hover:bg-stone-700 text-white px-3 py-1.5 rounded-sm text-sm font-bold shadow-sm whitespace-nowrap active:scale-95 transition-transform flex items-center gap-1">
                                    噂を流布 <span className="text-stone-400 font-normal text-xs ml-1">(${getIntrigueChance(70)}%)</span>
                                </button>
                                <button
                                    onClick=${() => headhuntRival(rival.id)}
                                    disabled=${gameState.notoriety < 30}
                                    className=${`px-3 py-1.5 rounded-sm text-sm font-bold shadow-sm whitespace-nowrap active:scale-95 transition-all flex items-center gap-1 ${gameState.notoriety >= 30 ? 'bg-rose-800 hover:bg-rose-700 text-white' : 'bg-stone-200 text-stone-500 cursor-not-allowed'}`}
                                >
                                    主力引抜 <span className="text-stone-300 font-normal text-xs ml-1">(${getIntrigueChance(50)}%)</span>
                                </button>
                                ${!rival.isRevealed && html`
                                    <button onClick=${() => gatherIntelligence(rival.id)} className="bg-indigo-700 hover:bg-indigo-600 text-white px-3 py-1.5 rounded-sm text-sm font-bold shadow-sm whitespace-nowrap flex items-center gap-1 active:scale-95 transition-transform">
                                        <${Search} className="w-4 h-4" /> 情報収集 <span className="text-indigo-300 font-normal text-xs ml-1">(${getIntrigueChance(85)}%)</span>
                                    </button>
                                `}
                            </div>
                        </div>

                        ${rival.isRevealed ? html`
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                <h4 className="text-xs font-bold text-stone-500 mb-2 flex items-center gap-1"><${Search} className="w-3 h-3" /> 判明した構成メンバー</h4>
                                ${rival.members && rival.members.length > 0 ? html`
                                    <div className="flex flex-wrap gap-2">
                                        ${rival.members.map(m => html`
                                            <button
                                                key=${m.id}
                                                onClick=${() => setSelectedAdv(m)}
                                                className="bg-stone-50 border border-stone-200 hover:border-amber-400 hover:bg-amber-50 px-2 py-1 rounded-sm text-xs text-stone-700 font-bold flex items-center gap-1 transition-colors"
                                            >
                                                ${m.name} <span className="text-stone-400 font-normal">[${m.rank}]</span>
                                            </button>
                                        `)}
                                    </div>
                                ` : html`
                                    <div className="text-xs text-stone-400 italic">所属メンバーがいません。</div>
                                `}
                            </div>
                        ` : html`
                            <div className="text-xs text-stone-400 italic flex items-center gap-1">
                                <${EyeOff} className="w-3 h-3" /> 構成メンバーの詳細は不明です。
                            </div>
                        `}
                    </div>
                `)}
            </div>
        </div>
    `;
}
