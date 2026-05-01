import htm from 'https://unpkg.com/htm?module';
const React = window.React;
const html = htm.bind(React.createElement);
const { Compass, Coins } = window.LucideReact;
import { DUNGEON_POOL } from '../data/constants.js';

export default function DungeonView({ gameState, setGameState }) {
    return html`
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
            <p className="text-stone-600 mb-4">探索で発見した未踏の迷宮です。次季の目標に設定することで、自動編成された主力部隊が攻略に向かいます。</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${gameState.discoveredDungeons.map(d => html`
                    <div key=${d.id} className=${`p-4 border rounded-sm shadow-sm transition-all flex flex-col ${gameState.targetDungeon === d.id ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-200' : 'bg-white border-[#E8E0D5]'}`}>
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="font-bold text-lg text-stone-800 flex items-center gap-1.5"><${Compass} className="w-5 h-5 text-indigo-600" /> ${d.name}</h4>
                            ${gameState.targetDungeon === d.id ? html`
                                <span className="text-xs font-bold text-indigo-700 bg-indigo-200 px-2 py-1 rounded-sm">次季目標</span>
                            ` : html`
                                <button onClick=${() => setGameState(prev => ({ ...prev, targetDungeon: d.id }))} className="text-xs font-bold text-stone-600 bg-stone-100 hover:bg-indigo-600 hover:text-white px-3 py-1.5 rounded-sm border border-stone-300 transition-colors">
                                    目標に設定
                                </button>
                            `}
                        </div>
                        <p className="text-sm text-stone-600 mb-4 flex-1">${d.desc}</p>
                        <div className="flex justify-between text-sm font-bold bg-white p-2 rounded-sm border border-stone-100 mt-auto">
                            <span className="text-rose-700">推奨戦力: ${d.powerReq}</span>
                            <span className="text-amber-600 flex items-center gap-1"><${Coins} className="w-4 h-4" /> 攻略報酬: ${d.reward}G</span>
                        </div>
                    </div>
                `)}
                ${gameState.discoveredDungeons.length === 0 && html`
                    <div className="col-span-full text-center p-8 text-stone-400 border border-dashed border-[#D4C3A3]">現在、攻略可能な迷宮はありません。探索方針を高めると見つかるかもしれません。</div>
                `}
            </div>

            ${gameState.clearedDungeons.length > 0 && html`
                <div className="mt-8">
                    <h3 className="font-bold text-stone-500 text-sm border-b border-[#D4C3A3] pb-1 mb-3">攻略済みの迷宮</h3>
                    <div className="flex flex-wrap gap-2">
                        ${gameState.clearedDungeons.map(id => {
                            const d = DUNGEON_POOL.find(x => x.id === id);
                            return html`<span key=${id} className="text-xs text-stone-500 bg-stone-200 px-2 py-1 rounded-sm">${d.name}</span>`;
                        })}
                    </div>
                </div>
            `}
        </div>
    `;
}
