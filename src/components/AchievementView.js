import htm from 'https://unpkg.com/htm?module';
const React = window.React;
const html = htm.bind(React.createElement);
import { ACHIEVEMENTS } from '../data/constants.js';
export default function AchievementView({ gameState }) {
    const { Trophy } = window.LucideReact || window.lucide || {};
    if (!Trophy) return null;

    return html`
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <p className="text-stone-600 mb-4">これまでにギルドが成し遂げた偉業の数々です。</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${ACHIEVEMENTS.map(ach => {
                    const isUnlocked = gameState.unlockedAchievements.includes(ach.id);
                    const icons = window.LucideReact || window.lucide || {};
                    const AchIcon = icons[ach.icon];
                    return html`
                        <div key=${ach.id} className=${`p-4 rounded-sm border shadow-sm flex items-start gap-4 transition-all ${isUnlocked ? 'bg-white border-[#D4C3A3]' : 'bg-stone-100 border-stone-200 opacity-60 grayscale'}`}>
                            <div className=${`p-3 rounded-full shrink-0 ${isUnlocked ? 'bg-amber-100 text-amber-600' : 'bg-stone-200 text-stone-400'}`}>
                                <${AchIcon} className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className=${`font-bold text-lg mb-1 ${isUnlocked ? 'text-stone-800' : 'text-stone-500'}`}>${isUnlocked ? ach.name : '？？？'}</h4>
                                <p className="text-xs text-stone-600 leading-relaxed">${isUnlocked ? ach.desc : '条件を満たしていません'}</p>
                            </div>
                        </div>
                    `;
                })}
            </div>
        </div>
    `;
}
