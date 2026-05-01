import htm from 'https://unpkg.com/htm?module';
const React = window.React;
const html = htm.bind(React.createElement);
import { MASTER_SKILLS } from '../data/constants.js';

export default function SkillView({ gameState, upgradeSkill }) {
    const { Crown } = window.LucideReact || window.lucide || {};
    return html`
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <p className="text-stone-600 mb-4">ギルドマスターであるあなた自身の能力を鍛え上げ、運営を有利に進めます。(最大Lv.3)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${Object.entries(MASTER_SKILLS).map(([key, skill]) => {
                    let currentLevel = gameState.masterSkills[key];
                    let isMax = currentLevel >= 3;
                    let costs = [0, 3000, 8000, 15000];
                    let nextCost = costs[currentLevel + 1];

                    return html`
                        <div key=${key} className="bg-white p-5 border border-[#E8E0D5] rounded-sm shadow-sm flex flex-col hover:-translate-y-1 transition-transform">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-lg text-stone-800 flex items-center gap-2"><${Crown} className="w-5 h-5 text-amber-500" /> ${skill.name}</h4>
                                <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded">Lv. ${currentLevel}</span>
                            </div>
                            <p className="text-sm text-stone-600 mb-4 flex-1">${skill.desc}</p>

                            <button
                                onClick=${() => upgradeSkill(key, nextCost)}
                                disabled=${isMax}
                                className=${`w-full py-2 rounded-sm font-bold text-sm transition-colors shadow-sm ${isMax ? 'bg-stone-300 text-stone-500 cursor-not-allowed' : 'bg-stone-800 hover:bg-stone-700 text-[#F2E8C6] active:scale-95'}`}
                            >
                                ${isMax ? '最大レベル到達' : `${nextCost.toLocaleString()}G で才能を開花させる`}
                            </button>
                        </div>
                    `;
                })}
            </div>
        </div>
    `;
}
