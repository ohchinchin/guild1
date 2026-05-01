import htm from 'https://unpkg.com/htm?module';
const React = window.React;
const html = htm.bind(React.createElement);
import { QUEST_TYPES } from '../data/constants.js';

export default function QuestBoard({ gameState, acceptQuest }) {
    const { ScrollText, CheckCircle2 } = window.LucideReact || window.lucide || {};
    return html`
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div>
                <h3 className="font-bold text-stone-800 mb-3 flex items-center gap-2">
                    <${ScrollText} className="w-5 h-5 text-amber-600" /> 受注可能な依頼
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${gameState.availableQuests.map(q => {
                        const type = QUEST_TYPES.find(t => t.id === q.type);
                        const Icon = window.LucideReact[type.icon];
                        return html`
                            <div key=${q.id} className="bg-white border border-[#E8E0D5] p-4 rounded-sm shadow-sm flex flex-col hover:border-amber-400 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-stone-800 flex items-center gap-2"><${Icon} className="w-5 h-5 text-indigo-600" /> ${q.name}</h4>
                                    <span className="text-[10px] font-bold bg-stone-100 text-stone-500 px-2 py-1 rounded">期限: ${q.turnLimit}季</span>
                                </div>
                                <p className="text-xs text-stone-600 mb-4 flex-1">${q.desc}</p>
                                <div className="grid grid-cols-2 gap-2 text-[11px] font-bold mb-4 bg-stone-50 p-2 rounded">
                                    <div className="text-rose-700">必要戦力: ${q.powerReq}</div>
                                    <div className="text-amber-600">報酬: ${q.reward}G</div>
                                    ${q.deposit > 0 && html`<div className="text-emerald-600 col-span-2">前金受領可: ${q.deposit}G</div>`}
                                </div>
                                <button 
                                    onClick=${() => acceptQuest(q)}
                                    className="w-full bg-stone-800 hover:bg-stone-700 text-[#F2E8C6] py-2 rounded-sm font-bold text-xs shadow-sm transition-colors active:scale-95"
                                >
                                    この依頼を引き受ける
                                </button>
                            </div>
                        `;
                    })}
                    ${gameState.availableQuests.length === 0 && html`
                        <div className="col-span-full text-center p-8 text-stone-400 border border-dashed border-[#D4C3A3]">現在、新しい依頼はありません。</div>
                    `}
                </div>
            </div>

            ${gameState.activeQuests.length > 0 && html`
                <div className="mt-8">
                    <h3 className="font-bold text-stone-800 mb-3 flex items-center gap-2">
                        <${CheckCircle2} className="w-5 h-5 text-emerald-600" /> 遂行中の依頼
                    </h3>
                    <div className="space-y-2">
                        ${gameState.activeQuests.map(q => html`
                            <div key=${q.id} className="flex justify-between items-center p-3 bg-emerald-50 border border-emerald-200 rounded-sm">
                                <div className="text-sm font-bold text-emerald-900">${q.name}</div>
                                <div className="text-[10px] font-bold text-emerald-700">残り期限: ${q.turnLimit}季</div>
                            </div>
                        `)}
                    </div>
                </div>
            `}
        </div>
    `;
}
