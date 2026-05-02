(() => {
    const { useState, useEffect, useRef } = React;

    const App = () => {
        const [isReady, setIsReady] = useState(false);
        const [view, setView] = useState('title');
        const [tab, setTab] = useState('home');
        const [gameState, setGameState] = useState(null);
        const [quarterResult, setQuarterResult] = useState(null);
        const [actionModal, setActionModal] = useState(null);
        const [dispatchTarget, setDispatchTarget] = useState(null);
        const [dispatchCandidates, setDispatchCandidates] = useState([]);
        const [selectedAdv, setSelectedAdv] = useState(null);
        const [showHowToPlay, setShowHowToPlay] = useState(false);

        // --- Component Registry Sync Check ---
        useEffect(() => {
            const required = [
                'ActionModal', 'QuarterResultModal', 'QuestView', 'RosterView', 'DispatchModal',
                'FacilityView', 'ShopView', 'PolicyView', 'AdventurerModal', 'HomeView',
                'IntrigueView', 'MasterSkillView', 'AchievementView', 'LogView', 'BossView',
                'EndingView', 'HowToPlayModal', 'ConfettiEffect'
            ];
            const check = () => {
                const loaded = window.G1 && window.G1.components;
                if (!loaded) return false;
                const missing = required.filter(k => !window.G1.components[k]);
                if (missing.length === 0) {
                    setIsReady(true);
                    console.log("Guild Master System: [OK] All components registered.");
                    return true;
                }
                console.log("Guild Master System: [WAIT] Missing components:", missing.join(', '));
                return false;
            };
            if (!check()) {
                const itv = setInterval(() => { if (check()) clearInterval(itv); }, 200);
                return () => clearInterval(itv);
            }
        }, []);

        // --- Auto-Save ---
        useEffect(() => {
            if (gameState && view !== 'title') {
                try {
                    localStorage.setItem(window.G1.Constants.SAVE_KEY, JSON.stringify({ ...gameState, view, tab }));
                } catch(e) { console.error("Save failed", e); }
            }
        }, [gameState, view, tab]);

        if (!isReady) {
            return (
                <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center">
                    <div className="text-amber-500 font-black text-2xl animate-pulse italic">INITIALIZING GUILD ENGINE...</div>
                </div>
            );
        }

        // Safe Icon Helper
        const L = window.LucideReact;
        const SafeIcon = (name) => {
            if (!L) return () => <div className="w-4 h-4 bg-stone-500" />;
            const Icon = L[name] || L[name.replace('2', '')] || L.Activity || L.HelpCircle;
            return Icon;
        };

        const { 
            ActionModal, QuarterResultModal, QuestView, RosterView, DispatchModal,
            FacilityView, ShopView, PolicyView, AdventurerModal, HomeView,
            IntrigueView, MasterSkillView, AchievementView, LogView, BossView,
            EndingView, HowToPlayModal
        } = window.G1.components;

        const Constants = window.G1.Constants;
        const Utils = window.G1.Utils;
        const Engine = window.G1.Engine;

        // --- Game Logic Handlers ---
        const startGame = () => {
            console.log("Executing startGame...");
            try {
                const initialState = {
                    turn: 1, budget: 5000, fame: 10, notoriety: 0, townFavor: 10,
                    alignment: { safety: 25, adventure: 25, military: 25, commerce: 25 },
                    facilities: { residence: 1, tavern: 1, training: 1 },
                    shops: { itemShop: 1, weaponShop: 1, magicShop: 1 },
                    masterSkills: { charisma: 0, underworld: 0, business: 0, leadership: 0, recruitment: 0 },
                    adventurers: [], receptionist: Utils.generateReceptionist(10, 0, []),
                    discoveredDungeons: [], dispatches: [], availableQuests: [], rivals: [],
                    history: [{ turn: 0, type: 'info', text: 'ギルドを開設しました。' }],
                    achievements: [], artifacts: [], currentRumor: '「まずは冒険者を雇おうぜ。」',
                    currentEvent: null, activeBoss: null, specialRequest: null, ending: null
                };
                
                const rivalStyles = ['military', 'commerce', 'safety'];
                for (let i = 0; i < 3; i++) {
                    const adj = Constants.RIVAL_ADJS[Math.floor(Math.random() * Constants.RIVAL_ADJS.length)];
                    const noun = Constants.RIVAL_NOUNS[Math.floor(Math.random() * Constants.RIVAL_NOUNS.length)];
                    initialState.rivals.push({ id: `rival_${i}`, name: `${adj}${noun}`, style: rivalStyles[i], power: 300 + (i * 200), relation: 50 });
                }
                for (let i = 0; i < 2; i++) {
                    const d = Constants.DUNGEON_POOL[i];
                    if (d) initialState.discoveredDungeons.push({ ...d, progress: 0, rivals: [] });
                }
                for (let i = 0; i < 4; i++) initialState.adventurers.push(Utils.generateAdventurer(10, 0, initialState.adventurers.map(a => a.name)));
                for (let i = 0; i < 5; i++) initialState.availableQuests.push(Utils.generateQuest(1, 10, 0, 10));
                
                setGameState(initialState);
                setView('game');
                setTab('home');
                console.log("Game started successfully.");
            } catch (err) {
                console.error("CRITICAL ERROR in startGame:", err);
            }
        };

        const loadGame = () => {
            try {
                const saved = localStorage.getItem(Constants.SAVE_KEY);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    setGameState(parsed);
                    setView(parsed.view || 'game');
                    setTab(parsed.tab || 'home');
                    console.log("Save data loaded.");
                }
            } catch (err) { console.error("Load failed", err); }
        };

        const nextTurn = () => {
            if (!gameState) return;
            try {
                setGameState(prev => {
                    const nextState = Engine.processTurn(prev);
                    setQuarterResult(nextState.quarterResult);
                    if (nextState.activeBoss) setTab('boss');
                    return nextState;
                });
            } catch (err) { console.error("Turn process failed", err); }
        };

        const handleDispatchConfirm = () => {
            if (!dispatchTarget) return;
            setGameState(prev => {
                try {
                    const next = JSON.parse(JSON.stringify(prev));
                    const newDispatch = { quest: dispatchTarget.quest, partyIds: [...dispatchCandidates], isSpecial: !!dispatchTarget.isSpecial };
                    next.dispatches.push(newDispatch);
                    next.adventurers.forEach(a => { if (dispatchCandidates.includes(a.id)) a.status = 'dispatched'; });
                    next.budget -= (dispatchTarget.quest.deposit || 0);
                    next.history.push({ turn: next.turn, type: 'info', text: `任務「${dispatchTarget.quest.name}」へ部隊を派遣。` });
                    if (dispatchTarget.isSpecial) next.specialRequest = null;
                    else next.availableQuests = next.availableQuests.filter(q => q.id !== dispatchTarget.quest.id);
                    return next;
                } catch(e) { console.error(e); return prev; }
            });
            setDispatchTarget(null); setDispatchCandidates([]);
        };

        const handleAutoAssign = () => {
            if (!dispatchTarget) return;
            const quest = dispatchTarget.quest;
            const maxMembers = dispatchTarget.isSpecial ? 5 : 10;
            const idles = gameState.adventurers.filter(a => a.status === 'idle');
            let selected = [];
            const reqs = quest.requirements || [];
            reqs.filter(r => r.type === 'class').forEach(r => {
                const m = idles.find(a => a.advClass.id === r.value && !selected.includes(a.id));
                if (m) selected.push(m.id);
            });
            reqs.filter(r => r.type === 'rank').forEach(r => {
                const idx = Constants.RANKS.indexOf(r.value);
                const m = idles.find(a => Constants.RANKS.indexOf(a.rank) >= idx && !selected.includes(a.id));
                if (m) selected.push(m.id);
            });
            const rem = idles.filter(a => !selected.includes(a.id)).sort((a, b) => b.power - a.power);
            for (const a of rem) {
                if (selected.length >= maxMembers) break;
                selected.push(a.id);
                const info = Utils.calculatePartyPower(selected, gameState.adventurers, gameState.alignment, gameState.masterSkills);
                if (info.total >= quest.powerReq && selected.length >= quest.minMembers) break;
            }
            if (selected.length < quest.minMembers) {
                for (const a of rem) {
                    if (!selected.includes(a.id)) { selected.push(a.id); if (selected.length >= quest.minMembers) break; }
                }
            }
            setDispatchCandidates(selected);
        };

        const handleMassDispatch = () => {
            setGameState(prev => {
                const next = JSON.parse(JSON.stringify(prev));
                let idleAdvs = next.adventurers.filter(a => a.status === 'idle').sort((a, b) => b.power - a.power);
                let count = 0; let deposit = 0;
                const sortedQuests = [...next.availableQuests].sort((a, b) => b.reward - a.reward);
                for (const q of sortedQuests) {
                    if (idleAdvs.length < q.minMembers || next.budget < deposit + (q.deposit || 0)) continue;
                    let selected = [];
                    const rem = [...idleAdvs];
                    for (const a of rem) {
                        if (selected.length >= 10) break;
                        selected.push(a);
                        const info = Utils.calculatePartyPower(selected.map(x=>x.id), next.adventurers, next.alignment, next.masterSkills);
                        if (info.total >= q.powerReq && selected.length >= q.minMembers) break;
                    }
                    if (selected.length >= q.minMembers) {
                        next.dispatches.push({ quest: q, partyIds: selected.map(x=>x.id) });
                        selected.forEach(a => a.status = 'dispatched');
                        idleAdvs = idleAdvs.filter(a => !selected.includes(a));
                        deposit += (q.deposit || 0); count++;
                        next.availableQuests = next.availableQuests.filter(x => x.id !== q.id);
                    }
                }
                if (count > 0) {
                    next.budget -= deposit;
                    next.history.push({ turn: next.turn, type: 'info', text: `一括派遣 (${count}部隊)` });
                    return next;
                }
                return prev;
            });
        };

        const handleSabotage = (rivalId) => {
            const cost = 500; if (gameState.budget < cost) return;
            setActionModal({ type: 'action_sabotage', phase: 'searching', message: '工作員を派遣中...' });
            setTimeout(() => {
                setGameState(prev => {
                    const next = JSON.parse(JSON.stringify(prev));
                    next.budget -= cost;
                    const rival = next.rivals.find(r => r.id === rivalId);
                    if (Math.random() < 0.7) {
                        rival.power = Math.max(0, rival.power - 100); rival.relation = Math.max(0, rival.relation - 20);
                        next.history.push({ turn: next.turn, type: 'warning', text: `${rival.name}への工作に成功。` });
                        setActionModal({ type: 'action_quest', phase: 'result', message: '工作成功！敵の戦力を削ぎ落としました。' });
                    } else {
                        rival.relation = Math.max(0, rival.relation - 30); next.notoriety += 10;
                        next.history.push({ turn: next.turn, type: 'danger', text: `${rival.name}への工作が露見。` });
                        setActionModal({ type: 'recruit_failed', phase: 'result', message: '工作失敗…悪名が高まりました。' });
                    }
                    return next;
                });
                setTimeout(() => setActionModal(null), 2000);
            }, 1000);
        };

        window.G1.appHandlers = { onAutoAssign: handleAutoAssign, onMassDispatch: handleMassDispatch };

        // --- Render Helpers ---
        const HomeIcon = SafeIcon('Home');
        const ArrowRightIcon = SafeIcon('ArrowRight');
        const RotateCcwIcon = SafeIcon('RotateCcw');
        const ChevronRightIcon = SafeIcon('ChevronRight');
        const MapIcon = SafeIcon('Map');

        if (view === 'title') {
            const hasSave = !!localStorage.getItem(Constants.SAVE_KEY);
            return (
                <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4 relative overflow-hidden text-stone-200">
                    <div className="absolute inset-0 opacity-40"><img src="assets/images/title_bg.png" className="w-full h-full object-cover" /></div>
                    <div className="relative z-10 text-center space-y-8 title-fade-in max-w-2xl">
                        <h1 className="text-6xl md:text-8xl font-black text-[#F2E8C6] tracking-tighter title-text-glow italic uppercase leading-none">GUILD MASTER</h1>
                        <p className="text-[#E8E0D5] text-lg md:text-xl font-serif tracking-[0.3em] opacity-80 mt-4">~ 辺境ギルド運営日録 ~</p>
                        <div className="flex flex-col gap-4 items-center mt-12">
                            <button onClick={startGame} className="w-72 bg-[#D9A94E] hover:bg-[#F2C94C] text-stone-900 py-5 px-8 rounded-sm font-black text-xl shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3">ギルドを新規開設 <ArrowRightIcon className="w-6 h-6" /></button>
                            {hasSave && <button onClick={loadGame} className="w-72 bg-stone-700 hover:bg-stone-600 text-[#F2E8C6] py-5 px-8 rounded-sm font-black text-xl shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 border border-stone-500">記録から再開 <RotateCcwIcon className="w-6 h-6" /></button>}
                            <button onClick={() => setShowHowToPlay(true)} className="text-[#E8E0D5] hover:text-[#F2E8C6] font-bold underline underline-offset-8 decoration-stone-600 transition-colors mt-6 text-sm tracking-widest uppercase">Check Guide</button>
                        </div>
                    </div>
                    <HowToPlayModal isOpen={showHowToPlay} onClose={() => setShowHowToPlay(false)} />
                </div>
            );
        }

        if (!gameState) return null;

        return (
            <div className="min-h-screen bg-[#EBE7E0] flex flex-col font-serif relative overflow-hidden">
                <div className="game-bg-container">
                    <img src={`assets/images/bg_${tab === 'home' || tab === 'facility' ? 'throne' : tab === 'quest' ? 'market' : tab === 'roster' ? 'barracks' : tab === 'dungeon' ? 'dungeon' : 'shadow'}.png`} className="game-bg-img" style={{opacity: 0.15}} />
                    <div className="game-bg-overlay"></div>
                </div>
                <header className="bg-stone-900 text-[#E8E0D5] p-3 shadow-xl relative z-30 border-b border-stone-800 shrink-0">
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
                                <span className={`text-xl font-black tracking-tight ${gameState.budget < 1000 ? 'text-rose-500' : 'text-[#D9A94E]'}`}>{gameState.budget.toLocaleString()} G</span>
                            </div>
                            <button onClick={nextTurn} className="bg-[#D9A94E] hover:bg-[#F2C94C] text-stone-900 px-6 py-2 rounded-sm font-black shadow-lg active:scale-95 flex items-center gap-2 group">季節を進める <ChevronRightIcon className="w-5 h-5 group-hover:translate-x-1" /></button>
                        </div>
                    </div>
                </header>
                <main className="flex-1 max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-4 p-4 relative z-10 overflow-hidden">
                    <aside className="w-full md:w-64 space-y-1 shrink-0 overflow-y-auto pr-1">
                        {[
                            { id: 'home', label: 'ダッシュボード', icon: 'Home' }, { id: 'quest', label: '掲示板', icon: 'ScrollText' }, { id: 'roster', label: '冒険者名簿', icon: 'Users' }, { id: 'dungeon', label: '未踏迷宮', icon: 'Map' }, { id: 'facility', label: 'ギルド本部', icon: 'Landmark' }, { id: 'shop', label: '提携店舗', icon: 'ShoppingBag' }, { id: 'intrigue', label: '工作・諜報', icon: 'EyeOff' }, { id: 'policy', label: '運営方針', icon: 'Compass' }, { id: 'skill', label: 'マスタースキル', icon: 'Zap' }, { id: 'achievement', label: '称号・実績', icon: 'Trophy' }, { id: 'log', label: '活動記録', icon: 'BookOpen' },
                        ].map(item => {
                            const Icon = SafeIcon(item.icon);
                            return <button key={item.id} onClick={() => setTab(item.id)} className={`w-full flex items-center gap-3 p-3 rounded-sm font-bold transition-all text-xs ${tab === item.id ? 'bg-stone-800 text-[#F2E8C6] shadow-md translate-x-1' : 'bg-white/60 text-stone-600 hover:bg-white border border-stone-200 shadow-sm'}`}><Icon className={`w-4 h-4 ${tab === item.id ? 'text-[#D9A94E]' : 'text-stone-400'}`} /> {item.label}</button>
                        })}
                    </aside>
                    <section className="flex-1 glass-panel border border-[#D4C3A3] shadow-inner overflow-hidden flex flex-col p-4 md:p-6 rounded-sm relative">
                        {tab === 'home' && <HomeView gameState={gameState} onOpenSpecial={()=>{setDispatchTarget({quest:gameState.specialRequest,isSpecial:true});setDispatchCandidates([]);}} onDeclineSpecial={()=>{setGameState(p=>{const n=JSON.parse(JSON.stringify(p));n.specialRequest=null;return n;});}} onHireReceptionist={(c)=>{setGameState(p=>{const n=JSON.parse(JSON.stringify(p));n.budget-=c.hireCost;n.receptionist=c;return n;});}} onSelectAdv={setSelectedAdv} />}
                        {tab === 'quest' && <QuestView gameState={gameState} onDispatch={(q) => { setDispatchTarget({quest: q}); setDispatchCandidates([]); }} />}
                        {tab === 'roster' && <RosterView gameState={gameState} onSelectAdv={setSelectedAdv} onSearchAdv={handleSearchAdv} />}
                        {tab === 'dungeon' && (
                            <div className="space-y-4 overflow-y-auto animate-in fade-in slide-in-from-right-4 duration-500 h-full">
                                <p className="text-sm font-bold text-stone-600 mb-3 shrink-0">発見された迷宮</p>
                                {gameState.discoveredDungeons.map(d => (
                                    <div key={d.id} className="bg-white border-2 border-[#D4C3A3] p-5 rounded-sm shadow-sm hover:border-indigo-400 transition-colors group shrink-0">
                                        <div className="flex justify-between items-center mb-3">
                                            <h3 className="font-bold text-stone-800 text-lg flex items-center gap-2"><MapIcon className="w-5 h-5 text-stone-400 group-hover:text-indigo-500" /> {d.name}</h3>
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${d.progress >= 100 ? 'bg-rose-100 text-rose-700' : 'bg-indigo-50 text-indigo-700'}`}>{d.progress >= 100 ? '攻略済み' : `攻略度 ${d.progress}%`}</span>
                                        </div>
                                        <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden border border-stone-200 shadow-inner"><div className={`h-full transition-all duration-1000 ${d.progress >= 100 ? 'bg-rose-500' : 'bg-indigo-500'}`} style={{width: `${d.progress}%`}}></div></div>
                                        <p className="text-xs text-stone-500 mt-3 leading-relaxed">{d.desc}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        {tab === 'facility' && <FacilityView gameState={gameState} onInvest={(id)=>{const c=1000+(gameState.facilities[id]*500); if(gameState.budget>=c){setGameState(p=>{const n=JSON.parse(JSON.stringify(p));n.budget-=c;n.facilities[id]++;return n;});setActionModal({type:'invest_facility',phase:'result',message:'施設拡張完了'});setTimeout(()=>setActionModal(null),1500);}}} />}
                        {tab === 'shop' && <ShopView gameState={gameState} onInvest={(id)=>{const c=1000+(gameState.shops[id]*1000); if(gameState.budget>=c){setGameState(p=>{const n=JSON.parse(JSON.stringify(p));n.budget-=c;n.shops[id]++;return n;});setActionModal({type:'invest_shop',phase:'result',message:'店舗投資完了'});setTimeout(()=>setActionModal(null),1500);}}} />}
                        {tab === 'intrigue' && <IntrigueView gameState={gameState} onSabotage={handleSabotage} onHeadhunt={handleHeadhunt} onIntelligence={handleIntelligence} />}
                        {tab === 'policy' && <PolicyView gameState={gameState} onUpdateAlignment={(a)=>setGameState(p=>({...p,alignment:a}))} />}
                        {tab === 'skill' && <MasterSkillView gameState={gameState} onUpgrade={(id)=>{const c=2000*(gameState.masterSkills[id]+1); if(gameState.budget>=c){setGameState(p=>{const n=JSON.parse(JSON.stringify(p));n.budget-=c;n.masterSkills[id]++;return n;});setActionModal({type:'skill_upgrade',phase:'result',message:'スキル修得完了'});setTimeout(()=>setActionModal(null),1500);}}} />}
                        {tab === 'achievement' && <AchievementView gameState={gameState} />}
                        {tab === 'log' && <LogView gameState={gameState} />}
                        {tab === 'boss' && <BossView gameState={gameState} onFightBoss={nextTurn} />}
                    </section>
                </main>
                <QuarterResultModal quarterResult={quarterResult} onConfirm={() => setQuarterResult(null)} />
                <ActionModal actionModal={actionModal} />
                <DispatchModal dispatchTarget={dispatchTarget} gameState={gameState} dispatchCandidates={dispatchCandidates} onToggleCandidate={(id) => setDispatchCandidates(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])} onConfirm={handleDispatchConfirm} onCancel={() => setDispatchTarget(null)} />
                <AdventurerModal adventurer={selectedAdv} onClose={() => setSelectedAdv(null)} onFire={handleFireAdventurer} />
                {gameState.ending && <EndingView gameState={gameState} />}
            </div>
        );
    };
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
})();
