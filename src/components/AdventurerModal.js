import htm from 'https://unpkg.com/htm?module';
const React = window.React;
const html = htm.bind(React.createElement);
const { X: XIcon, Swords, Star } = window.LucideReact;
import { ARTIFACT_POOL } from '../data/constants.js';

export default function AdventurerModal({ selectedAdv, setSelectedAdv, gameState, fireAdventurer, toggleMainParty, handleEquipArtifact }) {
    if (!selectedAdv) return null;

    const isOurs = (gameState.adventurers || []).some(a => a.id === selectedAdv.id);
    const isMain = (gameState.mainParty || []).includes(selectedAdv.id);
    const AdvIcon = window.LucideReact[selectedAdv.advClass.icon];

    return html`
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[70] p-4 font-serif backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#FAF8F5] border-2 border-[#D4C3A3] rounded-sm max-w-md w-full shadow-2xl relative flex flex-col max-h-[90vh]">
                <button onClick=${() => setSelectedAdv(null)} className="absolute top-3 right-3 text-stone-500 hover:text-stone-800 transition-colors bg-white/50 rounded-full p-1"><${XIcon} className="w-5 h-5" /></button>
                
                <div className="p-5 border-b border-[#D4C3A3] bg-[#E8E0D5] shrink-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h2 className="text-xl font-bold text-stone-800">${selectedAdv.name}</h2>
                                <span className=${`text-xs px-2 py-0.5 rounded-sm font-bold border ${selectedAdv.rank === 'S' ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-stone-100 text-stone-600 border-stone-300'}`}>ランク ${selectedAdv.rank}</span>
                            </div>
                            <div className="text-sm font-medium flex items-center gap-1.5 text-indigo-700">
                                <${AdvIcon} className="w-4 h-4" /> ${selectedAdv.advClass.name} <span className="text-stone-400">|</span> 
                                <span className="text-amber-700">${selectedAdv.personality.name}</span> <span className="text-stone-400">|</span> 
                                <span className="text-stone-600">${Math.floor(selectedAdv.age)}歳</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-stone-500 font-bold mb-0.5">総合戦力</div>
                            <div className="text-3xl font-bold text-stone-800 leading-none">${selectedAdv.power}</div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent to-stone-100/50">
                    <div>
                        <div className="text-xs font-bold text-stone-500 mb-2 border-b border-stone-200 pb-1">人物背景</div>
                        <p className="text-sm text-stone-700 leading-relaxed bg-white p-3 rounded-sm border border-[#E8E0D5] italic shadow-sm">${selectedAdv.flavor}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white p-3 rounded-sm border border-[#E8E0D5] shadow-sm">
                            <div className="text-[10px] font-bold text-stone-500 mb-1">給与 (毎季)</div>
                            <div className="text-sm font-bold text-stone-800">${selectedAdv.salary} G</div>
                        </div>
                        <div className="bg-white p-3 rounded-sm border border-[#E8E0D5] shadow-sm">
                            <div className="text-[10px] font-bold text-stone-500 mb-1">忠誠度</div>
                            <div className=${`text-sm font-bold ${selectedAdv.loyalty < 30 ? 'text-rose-600' : 'text-emerald-700'}`}>${selectedAdv.loyalty} / 100</div>
                        </div>
                        <div className="bg-white p-3 rounded-sm border border-[#E8E0D5] shadow-sm">
                            <div className="text-[10px] font-bold text-stone-500 mb-1">特徴: ${selectedAdv.trait.name}</div>
                            <div className="text-xs text-stone-600">${selectedAdv.trait.desc}</div>
                        </div>
                        <div className="bg-white p-3 rounded-sm border border-[#E8E0D5] shadow-sm">
                            <div className="text-[10px] font-bold text-stone-500 mb-1">性格: ${selectedAdv.personality.name}</div>
                            <div className="text-xs text-stone-600">${selectedAdv.personality.desc}</div>
                        </div>
                    </div>

                    <div className="bg-white p-3 rounded-sm border border-[#E8E0D5] shadow-sm">
                        <div className="text-xs font-bold text-stone-500 mb-2 border-b border-stone-100 pb-1 flex justify-between">
                            <span>装備・遺物</span>
                        </div>
                        <div className="text-sm font-bold text-stone-800 flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 bg-stone-100 rounded flex items-center justify-center shrink-0"><${Swords} className="w-3 h-3 text-stone-500"/></div>
                            ${selectedAdv.equipment}
                        </div>
                        
                        ${selectedAdv.equippedArtifactId ? (() => {
                            const art = ARTIFACT_POOL.find(a => a.id === selectedAdv.equippedArtifactId);
                            return art ? html`
                                <div className="text-sm font-bold text-amber-700 flex items-center gap-2 mt-2 pt-2 border-t border-stone-100">
                                    <div className="w-6 h-6 bg-amber-100 rounded flex items-center justify-center shrink-0"><${Star} className="w-3 h-3 text-amber-600"/></div>
                                    <div>
                                        <div>${art.name} <span className="text-xs text-amber-600/70 ml-1">(戦力+${art.powerBonus})</span></div>
                                        <div className="text-[10px] text-amber-600/80 font-normal mt-0.5">${art.desc}</div>
                                    </div>
                                </div>
                            ` : null;
                        })() : html`
                            <div className="text-xs text-stone-400 italic mt-2 pt-2 border-t border-stone-100 flex items-center gap-2">
                                <div className="w-6 h-6 bg-stone-50 border border-stone-100 rounded flex items-center justify-center shrink-0"><${Star} className="w-3 h-3 text-stone-300"/></div>
                                遺物は装備していません
                            </div>
                        `}

                        ${isOurs && html`
                            <div className="mt-3 pt-3 border-t border-stone-100">
                                <div className="text-[10px] font-bold text-stone-500 mb-1.5">遺物の授与・回収</div>
                                <div className="flex gap-2 overflow-x-auto pb-1">
                                    <button 
                                        onClick=${() => handleEquipArtifact(selectedAdv.id, null)}
                                        disabled=${!selectedAdv.equippedArtifactId}
                                        className=${`text-xs px-2 py-1 rounded border whitespace-nowrap transition-colors ${selectedAdv.equippedArtifactId ? 'bg-stone-100 text-stone-700 border-stone-300 hover:bg-stone-200' : 'bg-stone-50 text-stone-300 border-stone-200 cursor-not-allowed'}`}
                                    >
                                        回収する
                                    </button>
                                    ${(gameState.ownedArtifacts || []).map(artId => {
                                        const art = ARTIFACT_POOL.find(a => a.id === artId);
                                        return art ? html`
                                            <button 
                                                key=${artId}
                                                onClick=${() => handleEquipArtifact(selectedAdv.id, artId)}
                                                className="text-xs px-2 py-1 rounded border bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100 whitespace-nowrap transition-colors"
                                            >
                                                ${art.name}を授与
                                            </button>
                                        ` : null;
                                    })}
                                    ${(gameState.ownedArtifacts || []).length === 0 && !selectedAdv.equippedArtifactId && html`
                                        <span className="text-xs text-stone-400 italic py-1">金庫に遺物はありません</span>
                                    `}
                                </div>
                            </div>
                        `}
                    </div>

                    <div>
                        <div className="text-xs font-bold text-stone-500 mb-2 border-b border-stone-200 pb-1">経歴</div>
                        <div className="bg-white rounded-sm border border-[#E8E0D5] shadow-sm max-h-32 overflow-y-auto">
                            ${(selectedAdv.history || []).map((h, i) => html`
                                <div key=${i} className=${`p-2 text-xs text-stone-700 ${i !== selectedAdv.history.length - 1 ? 'border-b border-stone-100' : ''}`}>
                                    ${h}
                                </div>
                            `)}
                        </div>
                    </div>
                </div>
                
                ${isOurs && html`
                    <div className="p-4 bg-stone-100 border-t border-[#D4C3A3] flex gap-3 shrink-0">
                        <button 
                            onClick=${fireAdventurer}
                            className="px-4 py-2 bg-white hover:bg-rose-50 text-rose-600 border border-stone-300 rounded font-bold transition-colors text-sm"
                        >
                            解雇する
                        </button>
                        <button 
                            onClick=${toggleMainParty}
                            className=${`flex-1 py-2 rounded font-bold text-sm shadow-sm transition-colors ${isMain ? 'bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-300' : 'bg-indigo-700 hover:bg-indigo-600 text-white'}`}
                        >
                            ${isMain ? '主力部隊から外す' : '主力部隊に編成する'}
                        </button>
                    </div>
                `}
            </div>
        </div>
    `;
}
