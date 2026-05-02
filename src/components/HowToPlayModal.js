window.G1 = window.G1 || {};
window.G1.components = window.G1.components || {};

const { X, BookOpen, ChevronRight } = window.LucideReact;

window.G1.components.HowToPlayModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 font-serif backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#FAF8F5] border-2 border-[#D4C3A3] rounded-sm max-w-2xl w-full shadow-2xl relative flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-[#D4C3A3] bg-[#E8E0D5] flex justify-between items-center shrink-0">
                    <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-indigo-700" /> 遊び方と進め方のコツ
                    </h2>
                    <button onClick={onClose} className="text-stone-500 hover:text-stone-800 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-6 text-stone-700 leading-relaxed text-sm">
                    <section>
                        <h3 className="font-black text-indigo-800 text-base mb-2 border-b border-indigo-100 pb-1">1. ゲームの目的（50ターン完結）</h3>
                        <p>あなたは辺境のギルドマスターです。全50ターン（約12年）の間に、冒険者を雇い、依頼をこなし、ギルドを大きくしてください。50ターン終了時の「所持金」「名声」「悪名」などによって、ギルドの最終的な結末（マルチエンディング）が変化します。</p>
                    </section>
                    
                    <section>
                        <h3 className="font-black text-indigo-800 text-base mb-2 border-b border-indigo-100 pb-1">2. 序盤の進め方</h3>
                        <ul className="space-y-2 list-disc list-inside ml-2">
                            <li><strong>人材確保:</strong> まずは「人材捜索」で冒険者を増やしましょう。人が多いほど、一度にこなせる依頼が増え、待機中の「パトロール報酬」も増加します。</li>
                            <li><strong>施設の拡張:</strong> 冒険者が増えすぎると宿舎が足りなくなります。「ギルド本部」で宿舎を拡張してください。資金に余裕ができたら酒場（収入増）にも投資しましょう。</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="font-black text-indigo-800 text-base mb-2 border-b border-indigo-100 pb-1">3. 任務と自動編成（一括派遣）</h3>
                        <p>掲示板には毎季節新しい依頼が貼り出されます。依頼には「推奨戦力」と「最低人数」があり、条件を満たさないと失敗・死亡のリスクが高まります。</p>
                        <p className="mt-2 text-rose-700 font-bold">★ ヒント: 「一括派遣」ボタンを使えば、受注可能な依頼に対して待機中の冒険者を自動で最適に割り振って一気に派遣できます。毎ターンの操作が非常に楽になります。</p>
                    </section>

                    <section>
                        <h3 className="font-black text-indigo-800 text-base mb-2 border-b border-indigo-100 pb-1">4. ダンジョンとアーティファクト</h3>
                        <p>「未踏迷宮」では他ギルドとの踏破競争が発生します。先を越されると初回報酬を失うため、優先的に部隊を派遣しましょう。ダンジョンや高難度クエストをクリアすると、冒険者が強力な「アーティファクト」を持ち帰ることがあります。</p>
                    </section>

                    <section>
                        <h3 className="font-black text-indigo-800 text-base mb-2 border-b border-indigo-100 pb-1">5. 厄災（ボス）の襲来</h3>
                        <p>ターンが進行すると（15, 30, 48ターン目安）、強力なボスが街を襲撃します。この時は通常の依頼は受けられず、ギルドの全戦力を結集して戦うことになります。敗北すると大きな痛手を負うため、日頃から戦力を鍛えておくことが重要です。</p>
                    </section>
                </div>

                <div className="p-4 bg-stone-50 border-t border-[#D4C3A3] text-center">
                    <button
                        onClick={onClose}
                        className="bg-stone-800 hover:bg-stone-700 text-[#F2E8C6] px-8 py-3 rounded-sm font-bold transition-all shadow-sm active:scale-95"
                    >
                        理解した
                    </button>
                </div>
            </div>
        </div>
    );
};
