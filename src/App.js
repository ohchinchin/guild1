import htm from 'https://unpkg.com/htm?module';
const React = window.React;
const html = htm.bind(React.createElement);

import { GeminiAudio } from './utils/audio.js';
import { 
    INITIAL_GAME_STATE, SAVE_KEY, MAX_TURNS, SEASONS, 
    RUMORS, BOSS_DATA, ALIGNMENTS, ARTIFACT_POOL, 
    MASTER_SKILLS, ACHIEVEMENTS, QUEST_TYPES, DUNGEON_POOL, 
    SPECIAL_REQUESTS 
} from './data/constants.js';
import { 
    generateAdventurer, generateRival, generateRivals, generateQuest, 
    calculatePartyPower, generateReceptionist 
} from './utils/gameLogic.js';

// --- Components ---

const TypewriterText = ({ text, speed = 50, onComplete, className }) => {
    const [displayedText, setDisplayedText] = React.useState("");
    const [index, setIndex] = React.useState(0);
    const [done, setDone] = React.useState(false);

    React.useEffect(() => {
        setDisplayedText("");
        setIndex(0);
        setDone(false);
    }, [text]);

    React.useEffect(() => {
        if (index < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(prev => prev + text[index]);
                setIndex(prev => prev + 1);
            }, speed);
            return () => clearTimeout(timeout);
        } else {
            setDone(true);
            if (onComplete) onComplete();
        }
    }, [index, text, speed, onComplete]);

    return html`
        <span className=${className}>
            ${displayedText}
            ${!done && html`<span className="typewriter-cursor"></span>`}
        </span>
    `;
};

const ConfettiEffect = ({ rank }) => {
    React.useEffect(() => {
        const colors = rank === 'S' ? ['#fbbf24', '#f59e0b', '#d97706', '#fff'] : ['#a855f7', '#7e22ce', '#9333ea', '#fff'];
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.inset = '0';
        container.style.pointerEvents = 'none';
        container.style.zIndex = '100';
        document.querySelector('.gacha-glow-' + rank.toLowerCase())?.appendChild(container);

        for (let i = 0; i < 50; i++) {
            const c = document.createElement('div');
            c.className = 'confetti';
            c.style.left = Math.random() * 100 + '%';
            c.style.top = Math.random() * 100 + '%';
            c.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            c.style.transform = `rotate(${Math.random() * 360}deg)`;
            container.appendChild(c);
            
            const animation = c.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translate(${(Math.random() - 0.5) * 200}px, ${Math.random() * 200 + 100}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: Math.random() * 1000 + 1000,
                easing: 'cubic-bezier(0, .9, .57, 1)'
            });
            animation.onfinish = () => c.remove();
        }
        return () => container.remove();
    }, [rank]);

    return null;
};

function HomeView({ gameState, currentGuildPower, currentYear, currentSeason, getReputationText, getFinancialReport, hireReceptionist, setSelectedCandidate, selectedCandidate, openSpecialRequestModal, declineSpecialRequest }) {
    const { Target, MessageSquare, AlertTriangle, ScrollText, Coins, HeartHandshake } = window.LucideReact || window.lucide || {};
    if (!Target) return null;

    return html`
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            ${gameState.specialRequest && html`
                <div className="bg-indigo-900 border border-indigo-700 p-5 rounded-sm shadow-md text-indigo-50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4"><${Target} className="w-48 h-48 text-indigo-400" /></div>
                    <h4 className="font-bold text-xl mb-2 flex items-center gap-2 text-indigo-200 relative z-10"><${Target} className="w-6 h-6" /> 指名依頼：${gameState.specialRequest.name}</h4>
                    <p className="text-sm text-indigo-100 mb-4 relative z-10 leading-relaxed">${gameState.specialRequest.desc}</p>
                    <div className="flex gap-4 text-sm font-bold mb-4 bg-indigo-950/50 p-3 rounded relative z-10">
                        <span>推奨戦力: <span className="text-rose-400">${gameState.specialRequest.powerReq}</span></span>
                        <span>報酬: <span className="text-amber-400">${gameState.specialRequest.reward}G</span></span>
                    </div>
                    <div className="flex gap-3 relative z-10">
                        <button onClick=${openSpecialRequestModal} className="bg-rose-700 hover:bg-rose-600 text-white px-4 py-2 rounded-sm font-bold shadow-sm active:scale-95 transition-all">特別部隊を編成する</button>
                        <button onClick=${declineSpecialRequest} className="bg-indigo-800 hover:bg-indigo-700 text-indigo-200 px-4 py-2 rounded-sm font-bold shadow-sm active:scale-95 transition-all">丁重に断る</button>
                    </div>
                </div>
            `}

            <div className="bg-[#F2E8C6] border border-[#D4C3A3] p-4 rounded-sm shadow-sm relative">
                <${MessageSquare} className="absolute top-4 left-4 w-6 h-6 text-amber-700/30" />
                <p className="text-stone-700 italic pl-8 font-medium leading-relaxed">
                    ${gameState.currentRumor}
                </p>
            </div>

            ${gameState.currentEvent && html`
                <div className="bg-amber-100 border-l-4 border-amber-500 p-4 rounded-sm shadow-sm flex items-start gap-3">
                    <${AlertTriangle} className="w-6 h-6 text-amber-600 shrink-0" />
                    <div>
                        <h4 className="font-bold text-amber-800">【世界情勢】${gameState.currentEvent.name}</h4>
                        <p className="text-sm text-amber-700">${gameState.currentEvent.desc}</p>
                    </div>
                </div>
            `}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <div className="bg-white p-5 border border-[#E8E0D5] rounded-sm shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold text-stone-800 mb-3 flex items-center gap-2 border-b border-[#E8E0D5] pb-2">
                        <${ScrollText} className="w-5 h-5 text-indigo-700" /> 街での評判と現状
                    </h3>
                    <p className="text-stone-700 leading-relaxed font-medium mb-4 flex-1">
                        マスター、第 ${currentYear} 暦 【${currentSeason}】 の報告です。<br /><br />
                        現在の金庫には <span className="font-bold text-amber-600">${gameState.budget.toLocaleString()} G</span> の資金があります。
                        人員は ${gameState.adventurers.length} 名が所属しており、今季の主力部隊の戦力は ${currentGuildPower} と評価されています。<br />
                        <br />
                        世間の評価についてですが、我がギルドは現在、<strong>${getReputationText()}</strong>
                    </p>
                </div>

                <div className="bg-stone-50 p-5 border border-[#D4C3A3] rounded-sm shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold text-stone-800 mb-3 flex items-center gap-2 border-b border-[#D4C3A3] pb-2">
                        <${Coins} className="w-5 h-5 text-amber-600" /> 次季の収支見込み
                    </h3>
                    ${(() => {
                        const report = getFinancialReport(gameState);
                        return html`
                            <div className="space-y-3 flex-1">
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs font-bold text-emerald-700">
                                        <span>商業・雑用収入 (見込)</span>
                                        <span>+${report.totalIncome} G</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] text-stone-500 pl-2">
                                        <span>- 酒場/宿屋収益</span>
                                        <span>+${report.commerceIncome} G</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] text-stone-500 pl-2">
                                        <span>- 待機メンバー雑用</span>
                                        <span>+${report.choresIncome} G</span>
                                    </div>
                                </div>
                                <div className="space-y-1 pt-1 border-t border-stone-200">
                                    <div className="flex justify-between text-xs font-bold text-rose-700">
                                        <span>維持費・給与 (確定)</span>
                                        <span>-${report.totalExpense} G</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] text-stone-500 pl-2">
                                        <span>- 冒険者/受付給与</span>
                                        <span>-${report.salaries} G</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] text-stone-500 pl-2">
                                        <span>- 施設維持費</span>
                                        <span>-${report.maintenance} G</span>
                                    </div>
                                </div>
                                <div className="pt-2 border-t-2 border-stone-300 flex justify-between items-center">
                                    <span className="text-sm font-bold text-stone-700">次季の純収支</span>
                                    <span className=${`text-lg font-bold ${report.balance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        ${report.balance >= 0 ? '+' : ''}${report.balance} G
                                    </span>
                                </div>
                                <p className="text-[10px] text-stone-400 italic">※クエスト報酬や突発イベントは含まれません。</p>
                            </div>
                        `;
                    })()}
                </div>

                <div className="bg-stone-50 p-5 border border-[#D4C3A3] rounded-sm shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold text-stone-800 mb-3 flex items-center gap-2 border-b border-[#D4C3A3] pb-2">
                        <${HeartHandshake} className="w-5 h-5 text-rose-700" /> ギルド受付窓口
                    </h3>
                    <div className="flex-1">
                        <div className="mb-4">
                            <div className="text-sm font-bold text-stone-600 mb-1">現在の受付担当</div>
                            <div className="text-lg font-bold text-indigo-800 mb-1">${gameState.receptionist.name}</div>
                            <p className="text-xs text-stone-600 leading-relaxed bg-white p-2 rounded border border-stone-200">${gameState.receptionist.desc} <span className="font-bold">(維持費: ${gameState.receptionist.salary}G)</span></p>
                        </div>
                        <div>
                            <div className="text-xs font-bold text-stone-500 mb-2">求人応募者</div>
                            <div className="grid grid-cols-1 gap-2 mb-3">
                                ${gameState.availableReceptionists.map(rep => html`
                                    <button
                                        key=${rep.id}
                                        onClick=${() => setSelectedCandidate(rep.id === selectedCandidate?.id ? null : rep)}
                                        className=${`text-left p-2 border rounded text-xs transition-colors flex justify-between items-center ${selectedCandidate?.id === rep.id ? 'bg-indigo-50 border-indigo-300 font-bold text-indigo-800 shadow-sm' : 'bg-white hover:bg-stone-100 text-stone-700'}`}
                                    >
                                        <span>${rep.name}</span>
                                    </button>
                                `)}
                            </div>
                            ${selectedCandidate && html`
                                <div className="bg-white p-3 rounded border border-indigo-200 shadow-sm animate-in fade-in zoom-in-95 duration-200">
                                    <div className="font-bold text-indigo-800 text-sm mb-1">${selectedCandidate.name}</div>
                                    <p className="text-xs text-stone-600 mb-2">${selectedCandidate.desc}</p>
                                    <div className="flex justify-between items-center text-xs mb-3">
                                        <span>採用金: <span className="font-bold text-amber-600">${selectedCandidate.hireCost}G</span></span>
                                        <span>維持費: <span className="font-bold text-stone-800">${selectedCandidate.salary}G/季</span></span>
                                    </div>
                                    <button
                                        onClick=${() => {
                                            hireReceptionist(selectedCandidate);
                                            setSelectedCandidate(null);
                                        }}
                                        className="w-full bg-indigo-700 hover:bg-indigo-600 text-white py-2 rounded-sm font-bold transition-colors shadow-sm active:scale-95"
                                    >
                                        採用する
                                    </button>
                                </div>
                            `}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function QuestBoard({ gameState, acceptQuest }) {
    const { ScrollText, CheckCircle2 } = window.LucideReact || window.lucide || {};
    return html`
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div>
                <h3 className="font-bold text-stone-800 mb-3 flex items-center gap-2">
                    <${ScrollText} className="w-5 h-5 text-amber-600" /> 受注可能な依頼
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${gameState.availableQuests.map(q => {
                        const type = QUEST_TYPES.find(t => t.id === q.type);
                        const Icon = window.LucideReact[type.icon] || window.lucide[type.icon];
                        return html`
                            <div key=${q.id} className="bg-white border border-[#E8E0D5] p-4 rounded-sm shadow-sm flex flex-col hover:border-amber-400 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-stone-800 flex items-center gap-2"><${Icon} className="w-5 h-5 text-indigo-600" /> ${q.name}</h4>
                                    <span className="text-[10px] font-bold bg-stone-100 text-stone-500 px-2 py-1 rounded">期限: ${q.turnLimit}季</span>
                                </div>
                                <p className="text-xs text-stone-600 mb-4 flex-1">${q.desc}</p>
                                <div className="grid grid-cols-2 gap-2 text-[11px] font-bold mb-4 bg-stone-50 p-2 rounded">
                                    <div className="text-rose-700">必要戦力: ${q.powerReq}</div>
                                    <div className="text-amber-600">報酬: ${q.reward}G</div>
                                    ${q.deposit > 0 && html`<div className="text-emerald-600 col-span-2">前金受領可: ${q.deposit}G</div>`}
                                </div>
                                <button 
                                    onClick=${() => acceptQuest(q)}
                                    className="w-full bg-stone-800 hover:bg-stone-700 text-[#F2E8C6] py-2 rounded-sm font-bold text-xs shadow-sm transition-colors active:scale-95"
                                >
                                    この依頼を引き受ける
                                </button>
                            </div>
                        `;
                    })}
                    ${gameState.availableQuests.length === 0 && html`
                        <div className="col-span-full text-center p-8 text-stone-400 border border-dashed border-[#D4C3A3]">現在、新しい依頼はありません。</div>
                    `}
                </div>
            </div>
            ${gameState.activeQuests.length > 0 && html`
                <div className="mt-8">
                    <h3 className="font-bold text-stone-800 mb-3 flex items-center gap-2">
                        <${CheckCircle2} className="w-5 h-5 text-emerald-600" /> 遂行中の依頼
                    </h3>
                    <div className="space-y-2">
                        ${gameState.activeQuests.map(q => html`
                            <div key=${q.id} className="flex justify-between items-center p-3 bg-emerald-50 border border-emerald-200 rounded-sm">
                                <div className="text-sm font-bold text-emerald-900">${q.name}</div>
                                <div className="text-[10px] font-bold text-emerald-700">残り期限: ${q.turnLimit}季</div>
                            </div>
                        `)}
                    </div>
                </div>
            `}
        </div>
    `;
}

function RosterView({ gameState, autoAssembleParty, searchAdventurer, setSelectedAdv }) {
    const { Swords, Shuffle, Search } = window.LucideReact || window.lucide || {};
    return html`
        <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="mb-6 shrink-0">
                <div className="flex items-center justify-between mb-3 border-b border-[#D4C3A3] pb-2">
                    <h3 className="font-bold flex items-center gap-2 text-stone-700">
                        <${Swords} className="w-5 h-5 text-indigo-600" /> 今季の主力部隊 (自動編成)
                    </h3>
                    <div className="flex gap-2">
                        <button
                            onClick=${autoAssembleParty}
                            className="text-xs font-bold bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 px-3 py-1.5 rounded-sm flex items-center gap-1 transition-colors shadow-sm active:scale-95"
                        >
                            <${Shuffle} className="w-3 h-3" /> おまかせ編成
                        </button>
                        <span className="text-xs font-bold bg-indigo-100 text-indigo-800 px-3 py-1.5 rounded-sm flex items-center">
                            編成: ${gameState.mainParty.length} / 5
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    ${Array.from({ length: 5 }).map((_, i) => {
                        const advId = gameState.mainParty[i];
                        const adv = gameState.adventurers.find(a => a.id === advId);
                        if (!adv) {
                            return html`
                                <button key=${i} className="p-3 rounded-sm border bg-stone-100/50 border-stone-200 border-dashed cursor-default flex flex-col items-center justify-center h-[110px]">
                                    <span className="text-xs text-stone-400 font-bold">空き枠</span>
                                </button>
                            `;
                        }
                        const AdvIcon = window.LucideReact[adv.advClass.icon] || window.lucide[adv.advClass.icon];
                        return html`
                            <button key=${i} onClick=${() => setSelectedAdv(adv)} className="p-3 rounded-sm border bg-indigo-50 border-indigo-300 shadow-sm hover:border-indigo-500 hover:-translate-y-0.5 flex flex-col items-center justify-center h-[110px] transition-all">
                                <${AdvIcon} className="w-6 h-6 text-indigo-500 mb-1" />
                                <span className="font-bold text-sm text-stone-800 text-center line-clamp-1 w-full">${adv.name}</span>
                                <span className="text-xs text-indigo-700 font-bold mt-1 bg-white px-2 py-0.5 rounded border border-indigo-100">戦力 ${adv.power}</span>
                            </button>
                        `;
                    })}
                </div>
            </div>
            <div className="flex-1 flex flex-col min-h-[300px]">
                <div className="flex justify-between items-center mb-3 shrink-0">
                    <p className="text-sm font-bold text-stone-600">所属冒険者一覧</p>
                    <div className="flex gap-2">
                        <button onClick=${searchAdventurer} className="text-xs font-bold bg-amber-700 hover:bg-amber-600 text-white px-3 py-1.5 rounded-sm flex items-center gap-1.5 transition-all shadow-sm active:scale-95">
                            <${Search} className="w-3.5 h-3.5" /> 人材を捜索 (500G)
                        </button>
                        <span className="text-xs font-bold text-stone-600 bg-[#E8E0D5] px-2 py-1 rounded-sm border border-[#D4C3A3] flex items-center">
                            所属: ${gameState.adventurers.length} / ${gameState.facilities.residence * 5} 名
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto pb-4 pr-1">
                    ${gameState.adventurers.map(adv => {
                        const isMain = gameState.mainParty.includes(adv.id);
                        const AdvIcon = window.LucideReact[adv.advClass.icon] || window.lucide[adv.advClass.icon];
                        return html`
                            <button key=${adv.id} onClick=${() => setSelectedAdv(adv)} className=${`p-3 bg-white border ${isMain ? 'border-indigo-300 ring-1 ring-indigo-100' : 'border-[#E8E0D5]'} rounded-sm shadow-sm flex justify-between items-center hover:border-amber-500 hover:shadow-md hover:-translate-y-0.5 transition-all group text-left relative`}>
                                ${isMain && html`<div className="absolute -top-2 -right-2 bg-indigo-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">主力</div>`}
                                <div>
                                    <div className="text-sm font-bold text-stone-800 flex items-center gap-2 mb-1 group-hover:text-amber-700 transition-colors">
                                        <span className="truncate max-w-[90px]">${adv.name}</span>
                                        <span className=${`text-[10px] px-1.5 py-0.5 rounded-sm font-bold border shrink-0 ${adv.rank === 'S' ? 'bg-amber-100 text-amber-800 border-amber-300' : adv.rank === 'A' ? 'bg-purple-100 text-purple-800 border-purple-300' : 'bg-stone-100 text-stone-600 border-stone-300'}`}>${adv.rank} 級</span>
                                    </div>
                                    <div className="text-[11px] font-medium flex items-center gap-1 text-indigo-700">
                                        <${AdvIcon} className="w-3 h-3" /> ${adv.advClass.name} <span className="text-stone-400">|</span> <span className="text-amber-700">${adv.personality.name}</span>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <div className="text-sm font-bold text-stone-800">戦力 ${adv.power}</div>
                                    <div className=${`text-[10px] font-bold mt-1 ${adv.loyalty < 30 ? 'text-rose-600' : 'text-emerald-700'}`}>忠誠 ${adv.loyalty}%</div>
                                </div>
                            </button>
                        `;
                    })}
                </div>
            </div>
        </div>
    `;
}

function AlignmentView({ gameState, updateAlignment }) {
    const { Shield, Map: MapIcon, Swords, Beer } = window.LucideReact || window.lucide || {};
    if (!Shield) return null;
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
                    ].map(item => html`
                        <div key=${item.id}>
                            <div className="flex justify-between text-sm mb-2 font-bold">
                                <span className=${`flex items-center gap-2 ${item.color}`}><${item.icon} className="w-5 h-5" /> ${item.label}</span>
                                <span className="text-stone-700 text-lg">${gameState.alignment[item.id]}%</span>
                            </div>
                            <input type="range" min="0" max="100" value=${gameState.alignment[item.id]} onChange=${(e) => updateAlignment(item.id, e.target.value)} className="w-full h-2 bg-[#E8E0D5] rounded-full appearance-none cursor-pointer accent-stone-700" />
                        </div>
                    `)}
                </div>
                <div className="space-y-3">
                    <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-sm">
                        <h4 className="font-bold text-emerald-800 text-sm mb-1">治安維持</h4>
                        <p className="text-xs text-emerald-700">報酬は少ないが名声が着実に上がり、死亡リスクが低い。</p>
                    </div>
                    <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-sm">
                        <h4 className="font-bold text-indigo-800 text-sm mb-1">探索・攻略</h4>
                        <p className="text-xs text-indigo-700">未知の領域の調査。探索割合が高いと新たな【迷宮】を発見しやすい。</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function DungeonView({ gameState, setGameState }) {
    const { Compass, Coins } = window.LucideReact || window.lucide || {};
    return html`
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
            <p className="text-stone-600 mb-4">探索で発見した未踏の迷宮です。</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${gameState.discoveredDungeons.map(d => html`
                    <div key=${d.id} className=${`p-4 border rounded-sm shadow-sm transition-all flex flex-col ${gameState.targetDungeon === d.id ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-200' : 'bg-white border-[#E8E0D5]'}`}>
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="font-bold text-lg text-stone-800 flex items-center gap-1.5"><${Compass} className="w-5 h-5 text-indigo-600" /> ${d.name}</h4>
                            <button onClick=${() => setGameState(prev => ({ ...prev, targetDungeon: d.id }))} className=${`text-xs font-bold px-3 py-1.5 rounded-sm border transition-colors ${gameState.targetDungeon === d.id ? 'bg-indigo-200 text-indigo-700' : 'bg-stone-100 text-stone-600 border-stone-300'}`}>
                                ${gameState.targetDungeon === d.id ? '目標に設定中' : '目標に設定'}
                            </button>
                        </div>
                        <p className="text-sm text-stone-600 mb-4 flex-1">${d.desc}</p>
                        <div className="flex justify-between text-sm font-bold bg-white p-2 rounded-sm border border-stone-100 mt-auto">
                            <span className="text-rose-700">推奨戦力: ${d.powerReq}</span>
                            <span className="text-amber-600 flex items-center gap-1"><${Coins} className="w-4 h-4" /> 報酬: ${d.reward}G</span>
                        </div>
                    </div>
                `)}
            </div>
        </div>
    `;
}

function FacilityView({ gameState, investFacility }) {
    const { Users, Coins, Dumbbell } = window.LucideReact || window.lucide || {};
    const facilities = [
        { id: 'residence', label: '居住区', icon: Users, details: '最大収容人数が増加します。' },
        { id: 'tavern', label: '酒場と宿屋', icon: Coins, details: '毎季節の固定収入が増加します。' },
        { id: 'training', label: '訓練場', icon: Dumbbell, details: '経験値の底上げ。' }
    ];
    return html`
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            ${facilities.map(fac => html`
                <div key=${fac.id} className="bg-white border border-[#E8E0D5] p-4 rounded-sm shadow-sm flex flex-col">
                    <div className="flex items-center gap-3 mb-3 border-b border-stone-100 pb-3">
                        <div className="bg-stone-100 p-2 rounded-sm"><${fac.icon} className="w-6 h-6" /></div>
                        <div>
                            <div className="font-bold text-stone-800 text-lg">${fac.label}</div>
                            <div className="text-sm font-bold text-indigo-700">Lv. ${gameState.facilities[fac.id]}</div>
                        </div>
                    </div>
                    <p className="text-xs text-stone-600 mb-4 flex-1">${fac.details}</p>
                    <button onClick=${() => investFacility(fac.id)} className="w-full bg-stone-800 hover:bg-stone-700 text-white py-2 rounded-sm font-bold text-sm shadow-sm active:scale-95">
                        投資して拡張
                    </button>
                </div>
            `)}
        </div>
    `;
}

function ShopView({ gameState, investShop }) {
    const { Hammer, Wand2, ShoppingBag } = window.LucideReact || window.lucide || {};
    const shops = [
        { id: 'blacksmith', label: '鍛冶屋', icon: Hammer, details: '成功率向上。' },
        { id: 'magicShop', label: '魔法屋', icon: Wand2, details: '死亡リスク低下。' },
        { id: 'itemShop', label: '道具屋', icon: ShoppingBag, details: '維持費割引。' }
    ];
    return html`
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            ${shops.map(shop => html`
                <div key=${shop.id} className="bg-white border border-[#E8E0D5] p-4 rounded-sm shadow-sm flex flex-col">
                    <div className="flex items-center gap-3 mb-3 border-b border-stone-100 pb-3">
                        <div className="bg-stone-100 p-2 rounded-sm"><${shop.icon} className="w-6 h-6" /></div>
                        <div>
                            <div className="font-bold text-stone-800 text-lg">${shop.label}</div>
                            <div className="text-sm font-bold text-amber-700">契約Lv. ${gameState.shops[shop.id]}</div>
                        </div>
                    </div>
                    <p className="text-xs text-stone-600 mb-4 flex-1">${shop.details}</p>
                    <button onClick=${() => investShop(shop.id)} className="w-full bg-amber-700 hover:bg-amber-600 text-white py-2 rounded-sm font-bold text-sm active:scale-95">
                        提携を強化 (1000G)
                    </button>
                </div>
            `)}
        </div>
    `;
}

function IntrigueView({ gameState, sabotageRival, headhuntRival, gatherIntelligence, getIntrigueChance, setSelectedAdv }) {
    const { Search, EyeOff } = window.LucideReact || window.lucide || {};
    return html`
        <div className="space-y-4">
            ${gameState.rivals.map(rival => html`
                <div key=${rival.id} className="bg-white border border-[#E8E0D5] p-4 rounded-sm shadow-sm flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-stone-200">
                        <div className=${`h-full transition-all ${rival.relation >= 80 ? 'bg-emerald-500' : rival.relation >= 40 ? 'bg-amber-500' : 'bg-rose-600'}`} style=${{ width: `${rival.relation}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <span className="font-bold text-lg text-stone-800">${rival.name}</span>
                        <div className="flex gap-2">
                            <button onClick=${() => sabotageRival(rival.id)} className="bg-stone-800 text-white px-3 py-1 rounded-sm text-xs font-bold active:scale-95">工作</button>
                            <button onClick=${() => gatherIntelligence(rival.id)} className="bg-indigo-700 text-white px-3 py-1 rounded-sm text-xs font-bold active:scale-95">諜報</button>
                        </div>
                    </div>
                    <div className="text-xs text-stone-500 mt-2">友好度: ${rival.relation} | 推定戦力: ${rival.power}</div>
                </div>
            `)}
        </div>
    `;
}

function SkillView({ gameState, upgradeSkill }) {
    const { Crown } = window.LucideReact || window.lucide || {};
    return html`
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${Object.entries(MASTER_SKILLS).map(([key, skill]) => html`
                <div key=${key} className="bg-white p-5 border border-[#E8E0D5] rounded-sm shadow-sm flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-lg text-stone-800 flex items-center gap-2"><${Crown} className="w-5 h-5 text-amber-500" /> ${skill.name}</h4>
                        <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded">Lv. ${gameState.masterSkills[key]}</span>
                    </div>
                    <p className="text-sm text-stone-600 mb-4 flex-1">${skill.desc}</p>
                    <button onClick=${() => upgradeSkill(key, 3000)} className="w-full bg-stone-800 text-white py-2 rounded-sm font-bold text-sm active:scale-95">才能を開花させる</button>
                </div>
            `)}
        </div>
    `;
}

function AchievementView({ gameState }) {
    const { Trophy } = window.LucideReact || window.lucide || {};
    return html`
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${ACHIEVEMENTS.map(ach => {
                const isUnlocked = gameState.unlockedAchievements.includes(ach.id);
                const AchIcon = window.LucideReact[ach.icon] || window.lucide[ach.icon];
                return html`
                    <div key=${ach.id} className=${`p-4 rounded-sm border flex items-center gap-4 ${isUnlocked ? 'bg-white border-[#D4C3A3]' : 'bg-stone-100 border-stone-200 opacity-60 grayscale'}`}>
                        <div className=${`p-3 rounded-full ${isUnlocked ? 'bg-amber-100 text-amber-600' : 'bg-stone-200'}`}><${AchIcon} className="w-6 h-6" /></div>
                        <div>
                            <div className="font-bold text-stone-800">${isUnlocked ? ach.name : '？？？'}</div>
                            <div className="text-xs text-stone-500">${isUnlocked ? ach.desc : '未達成'}</div>
                        </div>
                    </div>
                `;
            })}
        </div>
    `;
}

function LogView({ logs, logsEndRef }) {
    const { Activity } = window.LucideReact || window.lucide || {};
    return html`
        <div className="flex flex-col h-[500px] bg-white p-4 border border-[#E8E0D5] rounded-sm shadow-inner overflow-y-auto space-y-2">
            ${logs.map(log => html`
                <div key=${log.id} className="p-2 border-b border-stone-100 text-xs flex gap-2">
                    <${Activity} className="w-3 h-3 text-stone-400 mt-0.5" />
                    <span>${log.msg}</span>
                </div>
            `)}
            <div ref=${logsEndRef} />
        </div>
    `;
}

function DecisionView({ canUsurp, sellGuild, usurpThrone, resetGame, currentGuildPower }) {
    const { Landmark, Crown, AlertTriangle } = window.LucideReact || window.lucide || {};
    return html`
        <div className="space-y-6 max-w-xl">
            <div className="bg-white p-5 border border-[#E8E0D5] rounded-sm shadow-sm flex items-start gap-4">
                <div className="bg-amber-100 p-3 rounded-sm text-amber-700"><${Landmark} className="w-8 h-8" /></div>
                <div className="flex-1">
                    <h4 className="font-bold text-stone-800 text-lg mb-1">ギルドを売却して引退</h4>
                    <button onClick=${sellGuild} className="bg-stone-800 text-white px-4 py-2 rounded-sm font-bold text-sm active:scale-95">売却を実行</button>
                </div>
            </div>
            <div className=${`p-5 border rounded-sm shadow-sm flex items-start gap-4 ${canUsurp ? 'bg-rose-50 border-rose-200' : 'bg-stone-50 opacity-60'}`}>
                <div className=${`p-3 rounded-sm ${canUsurp ? 'bg-rose-200 text-rose-800' : 'bg-stone-200'}`}><${Crown} className="w-8 h-8" /></div>
                <div className="flex-1">
                    <h4 className="font-bold text-lg text-stone-800 mb-1">国家転覆（王都進軍）</h4>
                    <button onClick=${usurpThrone} disabled=${!canUsurp} className=${`px-4 py-2 rounded-sm font-bold text-sm ${canUsurp ? 'bg-rose-700 text-white' : 'bg-stone-300 text-stone-500'}`}>進軍を開始</button>
                </div>
            </div>
            <button onClick=${resetGame} className="text-rose-600 text-sm font-bold underline">セーブデータを消去して初めから</button>
        </div>
    `;
}

function BossView({ gameState, currentGuildPower, requestAlliance, fightBoss }) {
    const { Skull, HeartHandshake, CheckCircle2, X: XIcon } = window.LucideReact || window.lucide || {};
    if (!gameState.activeBoss) return null;
    return html`
        <div className="space-y-6">
            <div className="bg-rose-950 p-6 rounded-sm text-rose-50 text-center">
                <h3 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2"><${Skull} className="w-8 h-8" /> 厄災襲来: ${gameState.activeBoss.name}</h3>
                <p className="mb-6"><${TypewriterText} text=${gameState.activeBoss.desc} /></p>
                <button onClick=${fightBoss} className="w-full bg-rose-700 hover:bg-rose-600 text-white py-4 rounded-sm font-bold text-xl active:scale-95">決戦開始</button>
            </div>
        </div>
    `;
}

function AdventurerModal({ selectedAdv, setSelectedAdv, gameState, fireAdventurer, toggleMainParty, handleEquipArtifact }) {
    const { X: XIcon, Swords, Star } = window.LucideReact || window.lucide || {};
    if (!selectedAdv) return null;
    const isMain = gameState.mainParty.includes(selectedAdv.id);
    const AdvIcon = window.LucideReact[selectedAdv.advClass.icon] || window.lucide[selectedAdv.advClass.icon];
    return html`
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[70] p-4 backdrop-blur-sm">
            <div className="bg-[#FAF8F5] border-2 border-[#D4C3A3] rounded-sm max-w-md w-full shadow-2xl p-6 relative flex flex-col">
                <button onClick=${() => setSelectedAdv(null)} className="absolute top-4 right-4"><${XIcon} className="w-6 h-6 text-stone-400" /></button>
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-indigo-100 p-2 rounded-sm"><${AdvIcon} className="w-8 h-8 text-indigo-700" /></div>
                    <h2 className="text-2xl font-bold text-stone-800">${selectedAdv.name}</h2>
                </div>
                <div className="space-y-4">
                    <p className="text-stone-700 italic border-l-4 border-stone-200 pl-4">${selectedAdv.flavor}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-white p-2 border">戦力: ${selectedAdv.power}</div>
                        <div className="bg-white p-2 border">忠誠: ${selectedAdv.loyalty}%</div>
                    </div>
                </div>
                <div className="mt-8 flex gap-2">
                    <button onClick=${toggleMainParty} className=${`flex-1 py-2 rounded-sm font-bold ${isMain ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-indigo-700 text-white'}`}>
                        ${isMain ? '主力から外す' : '主力に編成'}
                    </button>
                    <button onClick=${fireAdventurer} className="px-4 py-2 border border-rose-300 text-rose-600 rounded-sm font-bold">解雇</button>
                </div>
            </div>
        </div>
    `;
}

function ActionModal({ actionModal }) {
    if (!actionModal) return null;
    return html`
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[80] p-4 backdrop-blur-md">
            <div className="bg-stone-900 border-2 border-amber-500 rounded-sm shadow-2xl p-8 max-w-md w-full text-center">
                ${actionModal.foundRank && (actionModal.foundRank === 'S' || actionModal.foundRank === 'A') && html`<${ConfettiEffect} rank=${actionModal.foundRank} />`}
                <p className="text-xl font-bold text-amber-50 leading-relaxed">${actionModal.message}</p>
            </div>
        </div>
    `;
}

function QuarterResultModal({ quarterResult, getSummaryIcon, setQuarterResult, setCurrentView, activeBoss }) {
    if (!quarterResult) return null;
    const { ScrollText, ArrowRight } = window.LucideReact || window.lucide || {};
    return html`
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
            <div className="bg-[#FAF8F5] border-2 border-[#D4C3A3] rounded-sm max-w-lg w-full shadow-2xl flex flex-col">
                <div className="p-4 bg-[#E8E0D5] font-bold text-center border-b border-[#D4C3A3]">
                    <${ScrollText} className="w-5 h-5 inline mr-2 text-indigo-700" /> 第 ${quarterResult.year} 暦 【${quarterResult.season}】 報告
                </div>
                <div className="p-6 overflow-y-auto max-h-[60vh] space-y-3">
                    ${quarterResult.items.map((item, i) => html`
                        <div key=${i} className="flex gap-3 text-sm text-stone-700 bg-white p-2 border rounded-sm">
                            <div className="mt-0.5">${getSummaryIcon(item.type)}</div>
                            <div className="whitespace-pre-wrap">${item.text}</div>
                        </div>
                    `)}
                </div>
                <div className="p-4 bg-stone-100 flex justify-between font-bold text-xs">
                    <span>金庫: ${quarterResult.budget}G</span>
                    <span>名声: ${quarterResult.fame}</span>
                </div>
                <button onClick=${() => { setQuarterResult(null); if (activeBoss) setCurrentView('boss'); }} className="p-4 bg-stone-800 text-white font-bold active:scale-95">確認</button>
            </div>
        </div>
    `;
}

function SpecialRequestModal({ reqModalOpen, setReqModalOpen, gameState, reqParty, handleToggleReqParty, executeSpecialRequest, calculatePartyPower }) {
    if (!reqModalOpen) return null;
    const { Target, CheckCircle2 } = window.LucideReact || window.lucide || {};
    const { total: reqPower } = calculatePartyPower(reqParty, gameState);
    return html`
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-[#FAF8F5] border-2 border-[#D4C3A3] rounded-sm max-w-2xl w-full p-6 flex flex-col">
                <h2 className="text-xl font-bold text-indigo-800 mb-4 flex items-center gap-2"><${Target} className="w-6 h-6" /> 特別指名依頼 部隊編成</h2>
                <div className="bg-white p-4 border rounded-sm mb-4">
                    <div className="font-bold text-rose-600">目標: ${gameState.specialRequest.name} | 推奨戦力: ${gameState.specialRequest.powerReq}</div>
                    <div className="text-2xl font-bold mt-2">編成戦力: ${reqPower}</div>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                    ${gameState.adventurers.map(adv => {
                        const isSelected = reqParty.includes(adv.id);
                        return html`
                            <div key=${adv.id} onClick=${() => handleToggleReqParty(adv)} className=${`p-3 border rounded flex justify-between cursor-pointer ${isSelected ? 'bg-indigo-50 border-indigo-400' : 'bg-white'}`}>
                                <span className="font-bold">${adv.name}</span>
                                <span>戦力 ${adv.power}</span>
                            </div>
                        `;
                    })}
                </div>
                <div className="flex gap-2">
                    <button onClick=${() => setReqModalOpen(false)} className="px-4 py-2 border font-bold">戻る</button>
                    <button onClick=${executeSpecialRequest} disabled=${reqParty.length === 0} className="flex-1 py-2 bg-rose-700 text-white font-bold rounded-sm">出撃</button>
                </div>
            </div>
        </div>
    `;
}

function HowToPlayModal({ showHowToPlay, setShowHowToPlay }) {
    const { BookOpen, X: XIcon } = window.LucideReact || window.lucide || {};
    if (!showHowToPlay) return null;
    return html`
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
            <div className="bg-white border-2 border-stone-800 rounded-sm max-w-2xl w-full p-8 relative overflow-y-auto max-h-[80vh]">
                <button onClick=${() => setShowHowToPlay(false)} className="absolute top-4 right-4"><${XIcon} className="w-6 h-6" /></button>
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2"><${BookOpen} className="w-6 h-6 text-amber-500" /> 指南書</h3>
                <div className="space-y-6 text-stone-700">
                    <section><h4 className="font-bold border-b mb-2">基本</h4><p>季節を進め、ギルドを運営します。資金が底をつくと破産です。</p></section>
                </div>
                <button onClick=${() => setShowHowToPlay(false)} className="mt-8 w-full py-2 bg-stone-800 text-white font-bold">閉じる</button>
            </div>
        </div>
    `;
}

function EndingView({ gameState, quarterResult, resetGame }) {
    const { Crown } = window.LucideReact || window.lucide || {};
    if (!gameState.gameOver || quarterResult) return null;
    return html`
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[100] p-4 text-center">
            <div className="max-w-xl">
                <${Crown} className="w-24 h-24 text-amber-500 mx-auto mb-8" />
                <h1 className="text-5xl font-bold text-white mb-8">${gameState.endType === 'SELL' ? '伝説の商人' : '栄光の終焉'}</h1>
                <p className="text-stone-300 text-lg mb-12">${gameState.endType === 'SELL' ? 'ギルドを売却し、悠々自適の余生へ。' : '物語は幕を閉じました。'}</p>
                <button onClick=${resetGame} className="px-10 py-4 bg-amber-500 text-stone-900 font-bold text-xl rounded-sm">初めから</button>
            </div>
        </div>
    `;
}

// --- Main App ---

export default function App() {
    const { useState, useEffect, useRef } = React;
    const [gameState, setGameState] = useState(INITIAL_GAME_STATE);
    const [logs, setLogs] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [currentView, setCurrentView] = useState('title');
    const [selectedAdv, setSelectedAdv] = useState(null);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [quarterResult, setQuarterResult] = useState(null);
    const [reqModalOpen, setReqModalOpen] = useState(false);
    const [reqParty, setReqParty] = useState([]);
    const [showHowToPlay, setShowHowToPlay] = useState(false);
    const [actionModal, setActionModal] = useState(null);
    const [isMuted, setIsMuted] = useState(true);
    const logsEndRef = useRef(null);

    const hasSaveData = !!localStorage.getItem(SAVE_KEY);

    useEffect(() => {
        const savedData = localStorage.getItem(SAVE_KEY);
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                if (parsed.gameState) {
                    setGameState({ ...INITIAL_GAME_STATE, ...parsed.gameState });
                    setLogs(parsed.logs || []);
                }
            } catch (e) { console.error("Load failed", e); }
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded && currentView !== 'title') {
            localStorage.setItem(SAVE_KEY, JSON.stringify({ gameState, logs }));
        }
    }, [gameState, logs, isLoaded, currentView]);

    const addLog = (msg, type = "normal") => {
        setLogs(prev => [...prev, { id: Date.now() + Math.random(), msg, type }].slice(-100));
    };

    const startNewGame = () => {
        let freshState = { ...INITIAL_GAME_STATE };
        const initialAdv = generateAdventurer(0, 0, [], 'D');
        freshState.adventurers = [initialAdv];
        freshState.mainParty = [initialAdv.id];
        freshState.usedNames = [initialAdv.name];
        freshState.rivals = generateRivals([]);
        
        const rep1 = generateReceptionist(0, 0, []);
        freshState.availableReceptionists = [rep1];
        
        setGameState(freshState);
        setLogs([{ id: Date.now(), msg: "新たなギルドの歴史が始まりました。", type: "info" }]);
        setCurrentView('home');
        GeminiAudio.init();
        GeminiAudio.playBGM('home');
    };

    const resetGame = () => {
        if (window.confirm("初期化しますか？")) {
            localStorage.removeItem(SAVE_KEY);
            window.location.reload();
        }
    };

    const processTurn = () => {
        if (gameState.gameOver) return;
        GeminiAudio.playSE('click');
        setGameState(prev => {
            let next = { ...prev, turn: prev.turn + 1 };
            let year = Math.floor(prev.turn / 4) + 1;
            let season = SEASONS[prev.turn % 4];
            let items = [{ type: 'info', text: `第 ${year} 暦 【${season}】 が始まりました。` }];
            
            // Simplified financial for result modal
            const report = getFinancialReport(prev);
            next.budget -= report.totalExpense;
            next.budget += report.totalIncome;
            items.push({ type: 'finance', text: `今季収支: ${report.totalIncome - report.totalExpense}G` });

            setQuarterResult({ year, season, items, budget: next.budget, fame: next.fame, notoriety: next.notoriety, isGameOver: false });
            return next;
        });
    };

    const getFinancialReport = (state) => {
        const salaries = (state.adventurers || []).reduce((sum, a) => sum + (a.salary || 0), 0) + (state.receptionist?.salary || 0);
        const maintenance = (state.facilities?.residence || 1) * 100;
        const commerceIncome = (state.facilities?.tavern || 1) * 200;
        const totalIncome = commerceIncome;
        const totalExpense = salaries + maintenance;
        return { salaries, maintenance, totalIncome, totalExpense, balance: totalIncome - totalExpense, choresIncome: 0, commerceIncome };
    };

    const getReputationText = () => "街に馴染み始めた新進気鋭のギルドです。";

    const updateAlignment = (id, val) => {
        setGameState(prev => ({ ...prev, alignment: { ...prev.alignment, [id]: parseInt(val) } }));
    };

    const searchAdventurer = () => {
        if (gameState.budget < 500) return addLog("資金不足", "warning");
        setActionModal({ message: "人材を探しています..." });
        setTimeout(() => {
            const newAdv = generateAdventurer(gameState.fame, gameState.notoriety, gameState.usedNames);
            setGameState(prev => ({ ...prev, budget: prev.budget - 500, adventurers: [...prev.adventurers, newAdv], usedNames: [...prev.usedNames, newAdv.name] }));
            setActionModal({ message: `${newAdv.name} が加入しました！`, foundRank: newAdv.rank });
            setTimeout(() => setActionModal(null), 3000);
        }, 1500);
    };

    const fireAdventurer = () => {
        if (!selectedAdv) return;
        setGameState(prev => ({ ...prev, adventurers: prev.adventurers.filter(a => a.id !== selectedAdv.id), mainParty: prev.mainParty.filter(id => id !== selectedAdv.id) }));
        setSelectedAdv(null);
    };

    const toggleMainParty = () => {
        if (!selectedAdv) return;
        setGameState(prev => {
            const isMain = prev.mainParty.includes(selectedAdv.id);
            if (isMain) return { ...prev, mainParty: prev.mainParty.filter(id => id !== selectedAdv.id) };
            if (prev.mainParty.length >= 5) return prev;
            return { ...prev, mainParty: [...prev.mainParty, selectedAdv.id] };
        });
    };

    const investFacility = (id) => {
        if (gameState.budget < 1000) return addLog("資金不足", "warning");
        setGameState(prev => ({ ...prev, budget: prev.budget - 1000, facilities: { ...prev.facilities, [id]: prev.facilities[id] + 1 } }));
    };

    const investShop = (id) => {
        if (gameState.budget < 1000) return addLog("資金不足", "warning");
        setGameState(prev => ({ ...prev, budget: prev.budget - 1000, shops: { ...prev.shops, [id]: prev.shops[id] + 1 } }));
    };

    const upgradeSkill = (id, cost) => {
        if (gameState.budget < cost) return addLog("資金不足", "warning");
        setGameState(prev => ({ ...prev, budget: prev.budget - cost, masterSkills: { ...prev.masterSkills, [id]: prev.masterSkills[id] + 1 } }));
    };

    const acceptQuest = (q) => {
        setGameState(prev => ({ ...prev, activeQuests: [...prev.activeQuests, q], availableQuests: prev.availableQuests.filter(x => x.id !== q.id) }));
    };

    const handleToggleReqParty = (adv) => {
        setReqParty(prev => prev.includes(adv.id) ? prev.filter(id => id !== adv.id) : prev.length < 5 ? [...prev, adv.id] : prev);
    };

    const executeSpecialRequest = () => {
        setGameState(prev => ({ ...prev, specialRequest: null }));
        setReqModalOpen(false);
        addLog("特別任務に出撃しました。");
    };

    const getSummaryIcon = (type) => {
        const { Activity, Coins, Skull } = window.LucideReact || window.lucide || {};
        if (type === 'finance') return html`<${Coins} className="w-4 h-4 text-amber-500" />`;
        if (type === 'danger') return html`<${Skull} className="w-4 h-4 text-rose-500" />`;
        return html`<${Activity} className="w-4 h-4 text-indigo-500" />`;
    };

    if (!isLoaded) return html`<div className="min-h-screen bg-stone-900 flex items-center justify-center text-white">Loading...</div>`;

    const currentYear = Math.floor(gameState.turn / 4) + 1;
    const currentSeason = SEASONS[gameState.turn % 4];
    const { total: currentGuildPower } = calculatePartyPower(gameState.mainParty, gameState);
    const canUsurp = currentGuildPower >= 1000 && gameState.notoriety >= 50;

    const { Home, ScrollText, Users, Activity: ActivityIcon, Compass, Dumbbell, ShoppingBag, EyeOff, Crown: CrownIcon, Trophy, BookOpen, Flame, Volume2, VolumeX, ArrowRight: ArrowRightIcon, Target: TargetIcon, RotateCcw, Coins: CoinsIcon, ChevronRight, Skull: SkullIcon, Swords } = window.LucideReact || window.lucide || {};

    const renderView = () => {
        const props = { gameState, setGameState, currentGuildPower, currentYear, currentSeason, getReputationText, getFinancialReport, hireReceptionist: (r)=>hireReceptionist(r,setGameState,addLog), setSelectedCandidate, selectedCandidate, openSpecialRequestModal: ()=>setReqModalOpen(true), declineSpecialRequest: ()=>setGameState(p=>({...p,specialRequest:null})), acceptQuest, autoAssembleParty: ()=>addLog("自動編成実行"), searchAdventurer, setSelectedAdv, updateAlignment, investFacility, investShop, upgradeSkill, canUsurp, sellGuild: ()=>setGameState(p=>({...p,gameOver:true,endType:'SELL',endData:10000})), usurpThrone: ()=>setGameState(p=>({...p,gameOver:true,endType:'USURP_WIN'})), resetGame, logs, logsEndRef, calculatePartyPower, requestAlliance: ()=>addLog("同盟要請"), fightBoss: ()=>addLog("ボス戦開始") };
        switch (currentView) {
            case 'home': return html`<${HomeView} ...${props} />`;
            case 'quests': return html`<${QuestBoard} ...${props} />`;
            case 'roster': return html`<${RosterView} ...${props} />`;
            case 'alignment': return html`<${AlignmentView} ...${props} />`;
            case 'dungeons': return html`<${DungeonView} ...${props} />`;
            case 'facilities': return html`<${FacilityView} ...${props} />`;
            case 'shops': return html`<${ShopView} ...${props} />`;
            case 'intrigue': return html`<${IntrigueView} ...${props} />`;
            case 'skills': return html`<${SkillView} ...${props} />`;
            case 'achievements': return html`<${AchievementView} ...${props} />`;
            case 'boss': return html`<${BossView} ...${props} />`;
            case 'logs': return html`<${LogView} ...${props} />`;
            case 'decision': return html`<${DecisionView} ...${props} />`;
            default: return null;
        }
    };

    return html`
        <div className="min-h-screen text-stone-800 font-serif flex flex-col bg-[#FAF8F5]">
            ${currentView === 'title' ? html`
                <div className="min-h-screen flex items-center justify-center bg-stone-900 text-[#F2E8C6]">
                    <div className="text-center p-10 border-2 border-[#D4C3A3]">
                        <${CrownIcon} className="w-16 h-16 mx-auto mb-4 text-amber-400" />
                        <h1 className="text-5xl font-bold tracking-widest mb-10">GUILD MASTER</h1>
                        <button onClick=${startNewGame} className="w-full bg-amber-700 text-white py-4 font-bold rounded-sm mb-4">新たな歴史を紡ぐ</button>
                        ${hasSaveData && html`<button onClick=${() => setCurrentView('home')} className="w-full bg-indigo-700 text-white py-4 font-bold rounded-sm">続きから始める</button>`}
                    </div>
                </div>
            ` : html`
                <div className="flex flex-col h-screen">
                    <header className="bg-stone-900 text-white p-4 flex justify-between items-center shrink-0">
                        <div className="font-bold text-xl tracking-widest">GUILD MASTER</div>
                        <div className="text-xs text-stone-400">YEAR ${currentYear} ${currentSeason}</div>
                    </header>
                    <main className="flex-1 flex overflow-hidden">
                        <nav className="w-64 bg-stone-100 border-r overflow-y-auto p-2 space-y-1">
                            <button onClick=${() => setCurrentView('home')} className="w-full p-2 text-left hover:bg-stone-200 rounded">本部</button>
                            <button onClick=${() => setCurrentView('quests')} className="w-full p-2 text-left hover:bg-stone-200 rounded">依頼</button>
                            <button onClick=${() => setCurrentView('roster')} className="w-full p-2 text-left hover:bg-stone-200 rounded">名簿</button>
                            <button onClick=${() => setCurrentView('alignment')} className="w-full p-2 text-left hover:bg-stone-200 rounded">方針</button>
                            <div className="pt-4 mt-4 border-t">
                                <button onClick=${processTurn} className="w-full bg-indigo-900 text-white py-3 font-bold rounded-sm">季節を進める</button>
                            </div>
                        </nav>
                        <div className="flex-1 overflow-y-auto p-6">
                            ${renderView()}
                        </div>
                    </main>
                </div>
            `}
            <${ActionModal} actionModal=${actionModal} />
            <${QuarterResultModal} quarterResult=${quarterResult} getSummaryIcon=${getSummaryIcon} setQuarterResult=${setQuarterResult} setCurrentView=${setCurrentView} activeBoss=${gameState.activeBoss} />
            <${AdventurerModal} selectedAdv=${selectedAdv} setSelectedAdv=${setSelectedAdv} gameState=${gameState} fireAdventurer=${fireAdventurer} toggleMainParty=${toggleMainParty} handleEquipArtifact=${()=>addLog("遺物装備")} />
            <${SpecialRequestModal} reqModalOpen=${reqModalOpen} setReqModalOpen=${setReqModalOpen} gameState=${gameState} reqParty=${reqParty} handleToggleReqParty=${handleToggleReqParty} executeSpecialRequest=${executeSpecialRequest} calculatePartyPower=${calculatePartyPower} />
            <${HowToPlayModal} showHowToPlay=${showHowToPlay} setShowHowToPlay=${setShowHowToPlay} />
            <${EndingView} gameState=${gameState} quarterResult=${quarterResult} resetGame=${resetGame} />
        </div>
    `;
}
