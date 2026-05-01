import htm from 'https://unpkg.com/htm?module';
const React = window.React;
const html = htm.bind(React.createElement);
const { Skull, HeartHandshake, CheckCircle2, X: XIcon } = window.LucideReact;
import TypewriterText from './TypewriterText.js';

export default function BossView({ gameState, currentGuildPower, requestAlliance, fightBoss }) {
    if (!gameState.activeBoss) return null;
    
    let allyPower = 0;
    Object.keys(gameState.allianceRequests).forEach(rId => {
        if (gameState.allianceRequests[rId] === 'accepted') {
            const r = gameState.rivals.find(rv => rv.id === rId);
            if (r) allyPower += r.power;
        }
    });
    const winRate = Math.min(95, Math.floor(((currentGuildPower + allyPower) / gameState.activeBoss.power) * 100));

    return html`
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="bg-rose-950 rounded-sm shadow-lg border-2 border-rose-500 text-rose-50 relative overflow-hidden">
                <div className="relative">
                    ${(() => {
                        const bossImages = { boss_1: 'assets/images/boss_dragon.png', boss_2: 'assets/images/boss_demon.png', boss_3: 'assets/images/boss_titan.png' };
                        const img = bossImages[gameState.activeBoss.id];
                        return img ? html`<img src=${img} className="boss-image" alt=${gameState.activeBoss.name} />` : null;
                    })()}
                    <div className="absolute inset-0 bg-gradient-to-t from-rose-950 via-transparent to-transparent"></div>
                </div>
                <div className="p-6 relative z-10">
                    <h3 className="text-2xl font-bold mb-2 flex items-center gap-2 text-readable-dark"><${Skull} className="w-8 h-8 text-rose-400" /> 厄災襲来: ${gameState.activeBoss.name}</h3>
                    <p className="text-rose-200 mb-6 leading-relaxed text-readable-dark"><${TypewriterText} text=${gameState.activeBoss.desc} speed=${35} /></p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-rose-900/50 p-3 rounded border border-rose-800">
                            <div className="text-xs text-rose-300 mb-1">敵戦力 (脅威度)</div>
                            <div className="text-2xl font-bold text-rose-200">${gameState.activeBoss.power.toLocaleString()}</div>
                        </div>
                        <div className="bg-amber-900/50 p-3 rounded border border-amber-800">
                            <div className="text-xs text-amber-300 mb-1">討伐報酬</div>
                            <div className="text-2xl font-bold text-amber-200">${gameState.activeBoss.reward.toLocaleString()} G</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-5 border border-[#E8E0D5] rounded-sm shadow-sm">
                <h4 className="font-bold text-stone-800 mb-4 flex items-center gap-2"><${HeartHandshake} className="w-5 h-5 text-indigo-600" /> 他ギルドへの共闘要請 (交渉資金: 1000G)</h4>
                <p className="text-xs text-stone-600 mb-4">友好度（関係性）が高いギルドほど要請に応じやすくなります。</p>
                <div className="space-y-3">
                    ${gameState.rivals.map(rival => {
                        const status = gameState.allianceRequests[rival.id];
                        return html`
                            <div key=${rival.id} className="flex justify-between items-center p-3 border border-stone-200 rounded bg-stone-50 hover:border-[#D4C3A3] transition-colors">
                                <div>
                                    <div className="font-bold text-stone-700 flex items-center gap-2">
                                        ${rival.name}
                                        <span className="text-xs font-normal text-stone-500">(戦力: ${rival.power} / 友好度: <span className=${rival.relation >= 80 ? 'text-emerald-600 font-bold' : rival.relation >= 40 ? 'text-amber-600 font-bold' : 'text-rose-600 font-bold'}>${rival.relation}</span>)</span>
                                    </div>
                                </div>
                                <div>
                                    ${!status && html`
                                        <button onClick=${() => requestAlliance(rival.id)} className="bg-indigo-700 hover:bg-indigo-600 text-white px-4 py-2 rounded-sm text-sm font-bold transition-colors shadow-sm active:scale-95">
                                            使者を送る
                                        </button>
                                    `}
                                    ${status === 'accepted' && html`<span className="text-emerald-600 font-bold flex items-center gap-1"><${CheckCircle2} className="w-5 h-5" /> 参戦決定</span>`}
                                    ${status === 'rejected' && html`<span className="text-rose-600 font-bold flex items-center gap-1"><${XIcon} className="w-5 h-5" /> 拒絶</span>`}
                                </div>
                            </div>
                        `;
                    })}
                </div>
            </div>

            <div className="bg-stone-800 p-6 rounded-sm shadow-md border border-stone-900 text-center">
                <div className="text-stone-300 mb-2">現在の総合戦力 (自陣主力 + 盟友): <span className="text-3xl font-bold text-amber-400 ml-2 drop-shadow-md">${currentGuildPower + allyPower}</span></div>
                <div className="text-stone-400 text-sm mb-6">推定勝率: <span className=${`font-bold text-lg ml-1 ${winRate >= 80 ? 'text-emerald-400' : winRate >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>${winRate}%</span></div>
                <button onClick=${fightBoss} className="w-full bg-rose-700 hover:bg-rose-600 text-white py-4 rounded-sm font-bold text-xl shadow-lg border border-rose-900 animate-pulse active:scale-95 transition-all">
                    いざ、決戦へ！
                </button>
            </div>
        </div>
    `;
}
