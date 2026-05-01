import htm from 'https://unpkg.com/htm?module';
const React = window.React;
const html = htm.bind(React.createElement);
const { Crown } = window.LucideReact;
import TypewriterText from './TypewriterText.js';

export default function EndingView({ gameState, quarterResult, resetGame }) {
    if (!gameState.gameOver || quarterResult) return null;

    let title = "", desc = "", colorClass = "text-amber-500", bgClass = "bg-[#2A241F]", borderClass = "border-[#D4C3A3]";

    if (gameState.endType === "SELL") {
        title = "伝説の商人";
        desc = `あなたは権利書を ${gameState.endData.toLocaleString()} G で巨大商会に売却しました。血みどろの戦場から身を退き、莫大な富と共に優雅な余生を送ります。見事な手腕でした。`;
    } else if (gameState.endType === "TIME_UP") {
        title = "三十年の叙事詩";
        desc = `30年の勅許期間が終了しました。最終金庫: ${gameState.budget.toLocaleString()}G | 名声: ${gameState.fame} | 悪名: ${gameState.notoriety}。あなたの築き上げたギルドは、吟遊詩人によって長く語り継がれるでしょう。`;
    } else if (gameState.endType === "BANKRUPT") {
        title = "巨額の負債"; colorClass = "text-rose-600";
        desc = `取り立て屋がギルドを包囲しました。全資産は差し押さえられ、あなたは窓一つない債務者監獄の冷たい石床の上で余生を過ごすことになります。`;
    } else if (gameState.endType === "RUIN") {
        title = "静寂の広間"; colorClass = "text-stone-400";
        desc = `冒険者の姿はなく、金庫の底も見えました。ギルドの扉には板が打ち付けられ、あなたは失敗した設立者として歴史の闇へと消えていきます。`;
    } else if (gameState.endType === "USURP_WIN") {
        title = "玉座の簒奪者"; colorClass = "text-purple-500";
        desc = `あなたの部隊は王都を蹂躙し、玉座を血で染め上げました。ギルドが法となり、あなたが絶対的な覇王となる、新たなる暗黒時代の幕開けです。`;
    } else if (gameState.endType === "USURP_LOSE") {
        title = "反逆者の末路"; colorClass = "text-rose-600";
        desc = `王国の精鋭騎士団の前に、部隊は無残に散りました。ギルドマスターであるあなたと同胞たちは、中央広場で群衆の嘲笑を浴びながら断頭台の露と消えました。`;
    }

    return html`
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 font-serif">
            <div className=${`${bgClass} border-4 ${borderClass} rounded-sm p-10 max-w-2xl w-full text-center shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-500`}>
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#D4C3A3]"></div>
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#D4C3A3]"></div>
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#D4C3A3]"></div>
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#D4C3A3]"></div>
                ${(() => {
                    const endImages = {
                        SELL: 'assets/images/end_sell.png',
                        TIME_UP: 'assets/images/end_timeup.png',
                        BANKRUPT: 'assets/images/end_bankrupt.png',
                        RUIN: 'assets/images/end_ruin.png',
                        USURP_WIN: 'assets/images/end_usurp_win.png',
                        USURP_LOSE: 'assets/images/end_usurp_lose.png'
                    };
                    const imgSrc = endImages[gameState.endType];
                    return imgSrc ? html`<img src=${imgSrc} className="ending-image mb-6" alt=${title} />` : html`<${Crown} className=${`w-24 h-24 mx-auto mb-6 ${colorClass}`} strokeWidth=${1.5} />`;
                })()}
                <h1 className=${`text-4xl md:text-5xl font-bold mb-8 ${colorClass} tracking-widest text-readable-dark`}>${title}</h1>
                <p className="text-[#E8E0D5] text-lg leading-relaxed mb-10 text-justify">
                    <${TypewriterText} text=${desc} speed=${30} onComplete=${() => {
                        setTimeout(() => {
                            const btn = document.getElementById('ending-restart-btn');
                            if (btn) btn.style.opacity = '1';
                        }, 300);
                    }} />
                </p>
                <button id="ending-restart-btn" onClick=${resetGame} style=${{ opacity: 0, transition: 'opacity 1s ease-in' }} className="bg-[#D4C3A3] hover:bg-[#E8E0D5] text-stone-900 px-8 py-3 font-bold text-lg transition-colors border border-stone-600 shadow-[inset_0_0_10px_rgba(0,0,0,0.2)] uppercase tracking-wider">
                    新たな歴史を紡ぐ
                </button>
            </div>
        </div>
    `;
}
