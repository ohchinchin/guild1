import htm from 'https://unpkg.com/htm?module';
const React = window.React;
const html = htm.bind(React.createElement);
const { BookOpen, X: XIcon } = window.LucideReact;

export default function HowToPlayModal({ showHowToPlay, setShowHowToPlay }) {
    if (!showHowToPlay) return null;
    return html`
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-[#FAF8F5] rounded-sm shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col border-2 border-[#D4C3A3] overflow-hidden">
                <div className="p-4 bg-stone-900 text-[#E8E0D5] flex justify-between items-center shrink-0">
                    <h3 className="text-xl font-bold flex items-center gap-2"><${BookOpen} className="w-6 h-6 text-amber-400" /> 遊び方・指南書</h3>
                    <button onClick=${() => setShowHowToPlay(false)} className="text-stone-400 hover:text-white transition-colors">
                        <${XIcon} className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto flex-1 text-stone-800 space-y-6 text-sm leading-relaxed">
                    <section>
                        <h4 className="text-lg font-bold text-amber-700 border-b border-amber-200 pb-1 mb-2">1. ゲームの目的</h4>
                        <p>あなたは辺境の街の「ギルドマスター」となり、冒険者を雇い、育て、街を発展させながら、いずれ訪れる【厄災】に立ち向かいます。資金が底をついたり（-5000G）、誰もいなくなるとゲームオーバーです。</p>
                    </section>
                    <section>
                        <h4 className="text-lg font-bold text-indigo-700 border-b border-indigo-200 pb-1 mb-2">2. 基本サイクル</h4>
                        <p>左下の「季節を進める」ボタンを押すと1ターン（1季節）進みます。ターン経過時に、現在選択されている【運営方針】と【主力部隊】の能力に応じて自動的にクエストが進行し、資金や名声が変動します。</p>
                    </section>
                    <section>
                        <h4 className="text-lg font-bold text-rose-700 border-b border-rose-200 pb-1 mb-2">3. 冒険者の雇用と管理</h4>
                        <p>名声が高いほど、優秀な冒険者が集まります。冒険者には「給与」が発生するため、雇いすぎによる破産に注意してください。施設の「居住区」を拡張することで最大雇用人数を増やせます。</p>
                    </section>
                    <section>
                        <h4 className="text-lg font-bold text-stone-700 border-b border-stone-200 pb-1 mb-2">4. 未踏の迷宮</h4>
                        <p>「未踏の迷宮」が見つかった場合、ターゲットに設定することで、次の季節のクエストが迷宮探索に固定されます。成功すれば莫大な富と「古代の遺物」を得られるかもしれません。</p>
                    </section>
                    <section>
                        <h4 className="text-lg font-bold text-stone-700 border-b border-stone-200 pb-1 mb-2">5. ライバルギルドと裏社会</h4>
                        <p>街には他のギルドも存在し、名声や利益を奪い合います。「諜報・裏工作」で相手を妨害したり、優秀な人材を引き抜くことができますが、悪名が上がり報復されるリスクもあります。同盟を結んで厄災に共に立ち向かうことも可能です。</p>
                    </section>
                </div>
                <div className="p-4 bg-[#E8E0D5] border-t border-[#D4C3A3] shrink-0 text-center">
                    <button onClick=${() => setShowHowToPlay(false)} className="bg-stone-800 hover:bg-stone-700 text-white px-8 py-2 rounded font-bold transition-colors">
                        閉じる
                    </button>
                </div>
            </div>
        </div>
    `;
}
