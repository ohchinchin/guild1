import htm from 'https://unpkg.com/htm?module';
const React = window.React;
const html = htm.bind(React.createElement);
const { Shield, Map: MapIcon, Swords, Beer } = window.LucideReact;

export default function AlignmentView({ gameState, updateAlignment }) {
    return html`
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <p className="text-stone-600 mb-4">ギルドの方向性を決定します。この比率に応じて、自動編成される部隊が向かう任務の確率が変化します。</p>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="bg-white p-5 border border-[#E8E0D5] rounded-sm shadow-sm space-y-6">
                    ${[
                        { id: 'safety', label: '街の治安維持', icon: Shield, color: 'text-emerald-700' },
                        { id: 'adventure', label: '未開の地の探索', icon: MapIcon, color: 'text-indigo-700' },
                        { id: 'military', label: '他領への軍事侵攻', icon: Swords, color: 'text-rose-800' },
                        { id: 'commerce', label: '商業と内政', icon: Beer, color: 'text-amber-600' }
                    ].map(item => {
                        const ItemIcon = item.icon;
                        return html`
                            <div key=${item.id}>
                                <div className="flex justify-between text-sm mb-2 font-bold">
                                    <span className=${`flex items-center gap-2 ${item.color}`}><${ItemIcon} className="w-5 h-5" /> ${item.label}</span>
                                    <span className="text-stone-700 text-lg">${gameState.alignment[item.id]}%</span>
                                </div>
                                <input type="range" min="0" max="100" value=${gameState.alignment[item.id]} onChange=${(e) => updateAlignment(item.id, e.target.value)}
                                    className="w-full h-2 bg-[#E8E0D5] rounded-full appearance-none cursor-pointer accent-stone-700" />
                            </div>
                        `;
                    })}
                </div>
                <div className="space-y-3">
                    <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-sm hover:shadow-md transition-shadow">
                        <h4 className="font-bold text-emerald-800 text-sm mb-1">治安維持</h4>
                        <p className="text-xs text-emerald-700">報酬は少ないが名声が着実に上がり、死亡リスクが低い。僧侶がいるとさらに安全。</p>
                    </div>
                    <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-sm hover:shadow-md transition-shadow">
                        <h4 className="font-bold text-indigo-800 text-sm mb-1">探索・攻略</h4>
                        <p className="text-xs text-indigo-700">未知の領域の調査。盗賊がいると罠を回避し成功率が上がる。探索割合が高いと新たな【迷宮】を発見しやすい。</p>
                    </div>
                    <div className="bg-rose-50 border border-rose-200 p-3 rounded-sm hover:shadow-md transition-shadow">
                        <h4 className="font-bold text-rose-800 text-sm mb-1">軍事・侵攻</h4>
                        <p className="text-xs text-rose-700">破格の報酬を得るが悪名が高まり、死亡率も激増する。戦士がいると戦力ボーナス。</p>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 p-3 rounded-sm hover:shadow-md transition-shadow">
                        <h4 className="font-bold text-amber-800 text-sm mb-1">商業・内政</h4>
                        <p className="text-xs text-amber-700">主力部隊が遠征を行わず、安全に資金を蓄える。宿屋や酒場施設のレベルが高いほど効果絶大。</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}
