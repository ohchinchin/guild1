import htm from 'https://unpkg.com/htm?module';
const React = window.React;
const html = htm.bind(React.createElement);
const { Landmark, Crown, AlertTriangle } = window.LucideReact;

export default function DecisionView({ canUsurp, sellGuild, usurpThrone, resetGame, currentGuildPower }) {
    return html`
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl">
            <p className="text-stone-600 mb-4">ギルドマスターとしての最終的な決断を下します。これらの操作はゲームの終了やリセットを伴います。</p>

            <div className="bg-white p-5 border border-[#E8E0D5] rounded-sm shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="bg-amber-100 p-3 rounded-sm text-amber-700"><${Landmark} className="w-8 h-8" /></div>
                <div className="flex-1">
                    <h4 className="font-bold text-stone-800 text-lg mb-1">権利書を商会に売り渡す</h4>
                    <p className="text-sm text-stone-600 mb-3 leading-relaxed">ギルドの全資産と名声を現金化し、冒険の第一線から引退します。商人としての勝利エンドとなります。</p>
                    <button onClick=${sellGuild} className="bg-stone-800 hover:bg-stone-700 text-[#F2E8C6] px-4 py-2 rounded-sm font-bold text-sm transition-colors shadow-sm active:scale-95">
                        売却して引退する
                    </button>
                </div>
            </div>

            <div className=${`p-5 border rounded-sm shadow-sm flex items-start gap-4 transition-all ${canUsurp ? 'bg-rose-50 border-rose-200 hover:shadow-md' : 'bg-stone-50 border-stone-200 opacity-70'}`}>
                <div className=${`p-3 rounded-sm ${canUsurp ? 'bg-rose-200 text-rose-800' : 'bg-stone-200 text-stone-500'}`}><${Crown} className="w-8 h-8" /></div>
                <div className="flex-1">
                    <h4 className=${`font-bold text-lg mb-1 ${canUsurp ? 'text-rose-900' : 'text-stone-700'}`}>王都へ進軍し、国家を転覆させる</h4>
                    <p className="text-sm text-stone-600 mb-3 leading-relaxed">
                        圧倒的な武力と悪名をもって、現体制を打倒します。失敗すれば死罪です。<br />
                        <span className="text-xs font-bold mt-1 inline-block">【条件】軍事方針80%以上 / 悪名50以上 / 推定戦力1000以上</span>
                    </p>
                    <button
                        onClick=${usurpThrone}
                        disabled=${!canUsurp}
                        className=${`px-4 py-2 rounded-sm font-bold text-sm transition-all shadow-sm ${canUsurp ? 'bg-rose-700 hover:bg-rose-600 text-white animate-pulse active:scale-95' : 'bg-stone-300 text-stone-500 cursor-not-allowed'}`}
                    >
                        ${canUsurp ? `進軍を開始する (勝算: ${Math.min(95, Math.floor((currentGuildPower / 2000) * 100))}%)` : '条件を満たしていません'}
                    </button>
                </div>
            </div>

            <div className="bg-white p-5 border border-red-200 rounded-sm shadow-sm flex items-start gap-4 mt-8 hover:shadow-md transition-shadow">
                <div className="bg-red-100 p-3 rounded-sm text-red-600"><${AlertTriangle} className="w-8 h-8" /></div>
                <div className="flex-1">
                    <h4 className="font-bold text-stone-800 text-lg mb-1">セーブデータを消去する</h4>
                    <p className="text-sm text-stone-600 mb-3 leading-relaxed">これまでの歴史（セーブデータ）を完全に削除し、YEAR 1から初めからやり直します。元には戻せません。</p>
                    <button onClick=${resetGame} className="bg-white border-2 border-red-200 hover:bg-red-50 text-red-600 px-4 py-2 rounded-sm font-bold text-sm transition-colors active:scale-95">
                        初期化を実行する
                    </button>
                </div>
            </div>
        </div>
    `;
}
