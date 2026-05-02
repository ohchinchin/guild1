(() => {
    const { useState, useEffect, useRef } = React;
    const { 
        Shield, Map: MapIcon, Swords, Coins, Home, Beer, Dumbbell,
        Users, Crown, Skull, AlertTriangle, ArrowRight,
        Target, Activity, LogOut, CheckCircle2, RotateCcw,
        BookOpen, ChevronRight, Landmark, ScrollText,
        Wand2, Hammer, ShoppingBag, EyeOff, UserPlus, Search, X: XIcon,
        Trophy, Flame, HeartHandshake, Compass, MessageSquare,
        UserMinus, Zap, Star, Shuffle, Volume2, VolumeX, PieChart
    } = window.LucideReact;

    const Constants = window.G1.Constants;
    const Utils = window.G1.Utils;
    const Engine = window.G1.Engine;
    const { 
        ActionModal, QuarterResultModal, QuestView, RosterView, DispatchModal 
    } = window.G1.components;

    const App = () => {
        const [view, setView] = useState('title');
        const [tab, setTab] = useState('quest');
        const [gameState, setGameState] = useState(null);
        const [quarterResult, setQuarterResult] = useState(null);
        const [actionModal, setActionModal] = useState(null);
        const [dispatchTarget, setDispatchTarget] = useState(null);
        const [dispatchCandidates, setDispatchCandidates] = useState([]);
        const [selectedAdv, setSelectedAdv] = useState(null);

        const startGame = () => {
            const initialState = {
                turn: 1,
                budget: 5000,
                fame: 10,
                notoriety: 0,
                townFavor: 10,
                alignment: { safety: 25, adventure: 25, military: 25, commerce: 25 },
                facilities: { residence: 1, tavern: 1 },
                masterSkills: { charisma: 0, business: 0, leadership: 0 },
                adventurers: [],
                receptionist: Utils.generateReceptionist(10, 0, []),
                discoveredDungeons: [],
                dispatches: [],
                availableQuests: []
            };

            for (let i = 0; i < 4; i++) {
                initialState.adventurers.push(Utils.generateAdventurer(10, 0, initialState.adventurers.map(a => a.name)));
            }

            for (let i = 0; i < 5; i++) {
                initialState.availableQuests.push(Utils.generateQuest(1, 10, 0, 10));
            }

            setGameState(initialState);
            setView('game');
        };

        const nextTurn = () => {
            const nextState = Engine.processTurn(gameState);
            setGameState(nextState);
            setQuarterResult(nextState.quarterResult);
        };

        const handleDispatchConfirm = () => {
            const next = { ...gameState };
            const newDispatch = {
                quest: dispatchTarget.quest,
                partyIds: [...dispatchCandidates]
            };
            next.dispatches.push(newDispatch);
            next.adventurers.forEach(a => {
                if (dispatchCandidates.includes(a.id)) a.status = 'dispatched';
            });
            next.budget -= (dispatchTarget.quest.deposit || 0);
            setGameState(next);
            setDispatchTarget(null);
            setDispatchCandidates([]);
        };

        if (view === 'title') {
            return (
                <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-40">
                        <img src="assets/images/title_bg.png" className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="relative z-10 text-center space-y-8 title-fade-in max-w-2xl">
                        <h1 className="text-6xl md:text-8xl font-black text-[#F2E8C6] tracking-tighter title-text-glow italic">GUILD MASTER</h1>
                        <p className="text-[#E8E0D5] text-lg md:text-xl font-serif tracking-widest opacity-80">~ 改善版 ~</p>
                        <button onClick={startGame} className="w-64 bg-[#D9A94E] hover:bg-[#F2C94C] text-stone-900 py-4 px-8 rounded-sm font-black text-xl shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3">
                            ギルドを開設する <ArrowRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div className="min-h-screen bg-[#EBE7E0] flex flex-col font-serif relative overflow-hidden">
                <div className="game-bg-container">
                    <img src={`assets/images/bg_${tab === 'quest' ? 'market' : tab === 'roster' ? 'barracks' : 'shadow'}.png`} className="game-bg-img" style={{opacity: 0.15}} alt="" />
                    <div className="game-bg-overlay"></div>
                </div>

                <header className="bg-stone-900 text-[#E8E0D5] p-3 shadow-xl relative z-30 border-b border-stone-800">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <h1 className="text-xl font-black tracking-tighter italic text-[#D9A94E]">GUILD MASTER</h1>
                            <div className="flex flex-col ml-4">
                                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">現在の季節</span>
                                <span className="text-sm font-bold">第 {Math.floor((gameState.turn - 1) / 4) + 1} 暦 【{Constants.SEASONS[(gameState.turn - 1) % 4]}】</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">金庫預金</span>
                                <span className={`text-xl font-black ${gameState.budget < 1000 ? 'text-rose-500' : 'text-[#D9A94E]'}`}>{gameState.budget.toLocaleString()} G</span>
                            </div>
                            <button onClick={nextTurn} className="bg-[#D9A94E] hover:bg-[#F2C94C] text-stone-900 px-6 py-2 rounded-sm font-black transition-all shadow-lg active:scale-95 flex items-center gap-2 group">
                                季節を進める <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </header>

                <main className="flex-1 max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-4 p-4 relative z-10 overflow-hidden">
                    <aside className="w-full md:w-64 space-y-2 shrink-0">
                        {[
                            { id: 'quest', label: '掲示板', icon: ScrollText },
                            { id: 'roster', label: '冒険者名簿', icon: Users },
                            { id: 'dungeon', label: '未踏迷宮', icon: MapIcon },
                        ].map(item => (
                            <button
                                key={item.id}
                                onClick={() => setTab(item.id)}
                                className={`w-full flex items-center gap-3 p-3 rounded-sm font-bold transition-all text-sm ${tab === item.id ? 'bg-stone-800 text-[#F2E8C6] shadow-md' : 'bg-white/60 text-stone-600 hover:bg-white border border-stone-200 shadow-sm'}`}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.label}
                            </button>
                        ))}
                    </aside>

                    <section className="flex-1 glass-panel border border-[#D4C3A3] shadow-inner overflow-hidden flex flex-col p-4 md:p-6 rounded-sm relative">
                        {tab === 'quest' && <QuestView gameState={gameState} onDispatch={(q) => { setDispatchTarget({quest: q}); setDispatchCandidates([]); }} />}
                        {tab === 'roster' && <RosterView gameState={gameState} onSelectAdv={setSelectedAdv} onSearchAdv={() => {}} />}
                        {tab === 'dungeon' && (
                            <div className="space-y-4 overflow-y-auto">
                                <p className="text-sm font-bold text-stone-600 mb-3">発見された迷宮</p>
                                {gameState.discoveredDungeons.map(d => (
                                    <div key={d.id} className="bg-white border-2 border-[#D4C3A3] p-4 rounded-sm shadow-sm">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="font-bold text-stone-800">{d.name}</h3>
                                            <span className="text-xs font-bold text-stone-500">攻略度 {d.progress}%</span>
                                        </div>
                                        <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden border border-stone-200">
                                            <div className="bg-indigo-500 h-full transition-all duration-1000" style={{width: `${d.progress}%`}}></div>
                                        </div>
                                        <p className="text-xs text-stone-500 mt-2">{d.desc}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </main>

                <QuarterResultModal quarterResult={quarterResult} onConfirm={() => setQuarterResult(null)} />
                <ActionModal actionModal={actionModal} />
                <DispatchModal 
                    dispatchTarget={dispatchTarget} 
                    gameState={gameState} 
                    dispatchCandidates={dispatchCandidates}
                    onToggleCandidate={(id) => setDispatchCandidates(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
                    onConfirm={handleDispatchConfirm}
                    onCancel={() => setDispatchTarget(null)}
                />
            </div>
        );
    };

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
})();
