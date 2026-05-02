(() => {
    const { useState, useEffect, useRef } = React;

    /**
     * App Main Component
     */
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

        // --- 1. Robust Component Loading Check ---
        useEffect(() => {
            const required = [
                'ActionModal', 'QuarterResultModal', 'QuestView', 'RosterView', 'DispatchModal',
                'FacilityView', 'ShopView', 'PolicyView', 'AdventurerModal', 'HomeView',
                'IntrigueView', 'MasterSkillView', 'AchievementView', 'LogView', 'BossView',
                'EndingView', 'HowToPlayModal'
            ];
            
            const checkInterval = setInterval(() => {
                const loaded = window.G1 && window.G1.components;
                if (loaded && required.every(key => !!window.G1.components[key])) {
                    setIsReady(true);
                    clearInterval(checkInterval);
                    console.log("Guild Master: All components loaded.");
                }
            }, 50);
            return () => clearInterval(checkInterval);
        }, []);

        // --- 2. Auto-Save Logic ---
        useEffect(() => {
            if (gameState && view !== 'title') {
                try {
                    const saveState = { ...gameState, view, tab };
                    localStorage.setItem(window.G1.Constants.SAVE_KEY, JSON.stringify(saveState));
                } catch (e) {
                    console.error("Save failed", e);
                }
            }
        }, [gameState, view, tab]);

        // Loading Screen
        if (!isReady) {
            return (
                <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center gap-4">
                    <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-[#D9A94E] font-black text-xl animate-pulse italic tracking-widest uppercase">
                        Loading Guild Archives...
                    </div>
                </div>
            );
        }

        // --- 3. Component & Dependency Setup ---
        const { 
            ActionModal, QuarterResultModal, QuestView, RosterView, DispatchModal,
            FacilityView, ShopView, PolicyView, AdventurerModal, HomeView,
            IntrigueView, MasterSkillView, AchievementView, LogView, BossView,
            EndingView, HowToPlayModal
        } = window.G1.components;

        const L = window.LucideReact;
        const getIcon = (name) => {
            // Safe icon lookup for old Lucide versions
            return L[name] || L[name.replace('2', '')] || L.HelpCircle || L.Activity;
        };

        const { 
            Shield, Map: MapIcon, Swords, Coins, Home, Beer, Dumbbell,
            Users, Crown, Skull, AlertTriangle, ArrowRight,
            Target, Activity, LogOut, RotateCcw,
            BookOpen, ChevronRight, Landmark, ScrollText,
            Wand2, Hammer, ShoppingBag, EyeOff, UserPlus, Search,
            Trophy, Flame, HeartHandshake, Compass, MessageSquare,
            UserMinus, Zap, Star, Shuffle, Volume2, VolumeX, PieChart
        } = L;

        const Constants = window.G1.Constants;
        const Utils = window.G1.Utils;
        const Engine = window.G1.Engine;

        // --- 4. Game Handlers ---
        const startGame = () => {
            console.log("Starting new game...");
            try {
                const initialState = {
                    turn: 1,
                    budget: 5000,
                    fame: 10,
                    notoriety: 0,
                    townFavor: 10,
                    alignment: { safety: 25, adventure: 25, military: 25, commerce: 25 },
                    facilities: { residence: 1, tavern: 1, training: 1 },
                    shops: { itemShop: 1, weaponShop: 1, magicShop: 1 },
                    masterSkills: { charisma: 0, underworld: 0, business: 0, leadership: 0, recruitment: 0 },
                    adventurers: [],
                    receptionist: Utils.generateReceptionist(10, 0, []),
                    discoveredDungeons: [],
                    dispatches: [],
                    availableQuests: [],
                    rivals: [],
                    history: [{ turn: 0, type: 'info', text: 'ギルド「当ギルド」を開設しました。' }],
                    achievements: [],
                    artifacts: [],
                    currentRumor: '「まずは冒険者を雇って、簡単な依頼から始めるといいぜ。」',
                    currentEvent: null,
                    activeBoss: null,
                    specialRequest: null,
                    ending: null
                };

                // Init Rivals
                const rivalStyles = ['military', 'commerce', 'safety'];
                for (let i = 0; i < 3; i++) {
                    const adj = Constants.RIVAL_ADJS[Math.floor(Math.random() * Constants.RIVAL_ADJS.length)];
                    const noun = Constants.RIVAL_NOUNS[Math.floor(Math.random() * Constants.RIVAL_NOUNS.length)];
                    initialState.rivals.push({
                        id: `rival_${i}`,
                        name: `${adj}${noun}`,
                        style: rivalStyles[i],
                        power: 300 + (i * 200),
                        relation: 50
                    });
                }

                // Init Dungeons
                for (let i = 0; i < 2; i++) {
                    const dungeon = Constants.DUNGEON_POOL[i];
                    initialState.discoveredDungeons.push({ ...dungeon, progress: 0, rivals: [] });
                }

                // Init Adventurers
                for (let i = 0; i < 4; i++) {
                    initialState.adventurers.push(Utils.generateAdventurer(10, 0, initialState.adventurers.map(a => a.name)));
                }

                // Init Quests
                for (let i = 0; i < 5; i++) {
                    initialState.availableQuests.push(Utils.generateQuest(1, 10, 0, 10));
                }

                setGameState(initialState);
                setView('game');
                setTab('home');
                console.log("Game state initialized.");
            } catch (err) {
                console.error("Critical error during startGame:", err);
                alert("ゲームの初期化に失敗しました。ページをリロードしてください。");
            }
        };

        const loadGame = () => {
            const saved = localStorage.getItem(Constants.SAVE_KEY);
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    setGameState(parsed);
                    setView(parsed.view || 'game');
                    setTab(parsed.tab || 'home');
                    console.log("Save data loaded.");
                } catch (e) {
                    console.error("Load failed", e);
                    alert("セーブデータの読み込みに失敗しました。");
                }
            }
        };

        const nextTurn = () => {
            if (!gameState) return;
            const nextState = Engine.processTurn(gameState);
            setGameState(nextState);
            setQuarterResult(nextState.quarterResult);
            if (nextState.activeBoss) setTab('boss');
        };

        const hireReceptionist = (candidate) => {
            if (gameState.budget >= candidate.hireCost) {
                const next = { ...gameState };
                next.budget -= candidate.hireCost;
                next.receptionist = candidate;
                next.history.push({ turn: next.turn, type: 'info', text: `新たな受付嬢 ${candidate.name} を採用しました。` });
                setGameState(next);
                setActionModal({ type: 'hire_receptionist', phase: 'result', message: `${candidate.name} を受付嬢として迎え入れました！` });
                setTimeout(() => setActionModal(null), 2000);
            }
        };

        const handleOpenSpecial = () => {
            setDispatchTarget({ quest: gameState.specialRequest, isSpecial: true });
            setDispatchCandidates([]);
        };

        const handleDeclineSpecial = () => {
            const next = { ...gameState };
            next.history.push({ turn: next.turn, type: 'info', text: `特殊依頼「${next.specialRequest.name}」を辞退しました。` });
            next.specialRequest = null;
            setGameState(next);
        };

        const handleAutoAssign = () => {
            if (!dispatchTarget) return;
            const quest = dispatchTarget.quest;
            const isSpecial = dispatchTarget.isSpecial;
            const maxMembers = isSpecial ? 5 : 10;
            const idles = gameState.adventurers.filter(a => a.status === 'idle');
            
            let selected = [];
            const reqs = quest.requirements || [];
            
            reqs.filter(r => r.type === 'class').forEach(r => {
                const match = idles.find(a => a.advClass.id === r.value && !selected.includes(a.id));
                if (match) selected.push(match.id);
            });

            reqs.filter(r => r.type === 'rank').forEach(r => {
                const minRankIdx = Constants.RANKS.indexOf(r.value);
                const match = idles.find(a => Constants.RANKS.indexOf(a.rank) >= minRankIdx && !selected.includes(a.id));
                if (match) selected.push(match.id);
            });

            const remainingIdles = idles.filter(a => !selected.includes(a.id)).sort((a, b) => b.power - a.power);
            for (const adv of remainingIdles) {
                if (selected.length >= maxMembers) break;
                const temp = [...selected, adv.id];
                const info = Utils.calculatePartyPower(temp, gameState.adventurers, gameState.alignment, gameState.masterSkills);
                selected.push(adv.id);
                if (info.total >= quest.powerReq && selected.length >= quest.minMembers) break;
            }

            if (selected.length < quest.minMembers) {
                for (const adv of remainingIdles) {
                    if (selected.includes(adv.id)) continue;
                    selected.push(adv.id);
                    if (selected.length >= quest.minMembers) break;
                }
            }
            setDispatchCandidates(selected);
        };

        const handleMassDispatch = () => {
            const next = { ...gameState };
            let idleAdvs = next.adventurers.filter(a => a.status === 'idle').sort((a, b) => b.power - a.power);
            let dispatchesCount = 0;
            let totalDeposit = 0;

            const sortedQuests = [...next.availableQuests].sort((a, b) => b.reward - a.reward);

            for (const quest of sortedQuests) {
                if (idleAdvs.length < quest.minMembers) break;
                if (next.budget < totalDeposit + (quest.deposit || 0)) continue;

                let selected = [];
                const reqs = quest.requirements || [];
                
                reqs.filter(r => r.type === 'class').forEach(r => {
                    const match = idleAdvs.find(a => a.advClass.id === r.value && !selected.includes(a));
                    if (match) selected.push(match);
                });

                reqs.filter(r => r.type === 'rank').forEach(r => {
                    const minRankIdx = Constants.RANKS.indexOf(r.value);
                    const match = idleAdvs.find(a => Constants.RANKS.indexOf(a.rank) >= minRankIdx && !selected.includes(a));
                    if (match) selected.push(match);
                });

                const remainingIdles = idleAdvs.filter(a => !selected.includes(a));
                for (const adv of remainingIdles) {
                    if (selected.length >= 10) break;
                    selected.push(adv);
                    const info = Utils.calculatePartyPower(selected.map(a=>a.id), next.adventurers, next.alignment, next.masterSkills);
                    if (info.total >= quest.powerReq && selected.length >= quest.minMembers) break;
                }

                if (selected.length >= quest.minMembers) {
                    const partyIds = selected.map(a => a.id);
                    next.dispatches.push({ quest, partyIds });
                    selected.forEach(a => a.status = 'dispatched');
                    idleAdvs = idleAdvs.filter(a => !selected.includes(a));
                    totalDeposit += (quest.deposit || 0);
                    dispatchesCount++;
                    next.availableQuests = next.availableQuests.filter(q => q.id !== quest.id);
                }
            }

            if (dispatchesCount > 0) {
                next.budget -= totalDeposit;
                next.history.push({ turn: next.turn, type: 'info', text: `一括派遣により ${dispatchesCount} 部隊を派遣しました。` });
                setGameState(next);
                alert(`${dispatchesCount} つの依頼に一括派遣しました。`);
            } else {
                alert('派遣可能な部隊を編成できませんでした。');
            }
        };

        const handleDispatchConfirm = () => {
            if (!dispatchTarget) return;
            setGameState(prev => {
                const next = JSON.parse(JSON.stringify(prev));
                const newDispatch = { 
                    quest: dispatchTarget.quest, 
                    partyIds: [...dispatchCandidates],
                    isSpecial: !!dispatchTarget.isSpecial 
                };
                next.dispatches.push(newDispatch);
                next.adventurers.forEach(a => {
                    if (dispatchCandidates.includes(a.id)) a.status = 'dispatched';
                });
                next.budget -= (dispatchTarget.quest.deposit || 0);
                next.history.push({ turn: next.turn, type: 'info', text: `任務「${dispatchTarget.quest.name}」へ部隊を派遣しました。` });
                if (dispatchTarget.isSpecial) next.specialRequest = null;
                else next.availableQuests = next.availableQuests.filter(q => q.id !== dispatchTarget.quest.id);
                return next;
            });
            setDispatchTarget(null);
            setDispatchCandidates([]);
        };

        const handleInvestFacility = (facId) => {
            const currentLevel = gameState.facilities[facId] || 1;
            const cost = 1000 + (currentLevel * 500);
            if (gameState.budget >= cost) {
                setGameState(prev => {
                    const next = JSON.parse(JSON.stringify(prev));
                    next.budget -= cost;
                    next.facilities[facId] = currentLevel + 1;
                    return next;
                });
                setActionModal({ type: 'invest_facility', phase: 'result', message: '施設の拡張が完了しました！' });
                setTimeout(() => setActionModal(null), 2000);
            }
        };

        const handleInvestShop = (shopId) => {
            const currentLevel = gameState.shops[shopId] || 1;
            const cost = 1000 + (currentLevel * 1000);
            if (gameState.budget >= cost) {
                setGameState(prev => {
                    const next = JSON.parse(JSON.stringify(prev));
                    next.budget -= cost;
                    next.shops[shopId] = currentLevel + 1;
                    return next;
                });
                setActionModal({ type: 'invest_shop', phase: 'result', message: '提携店舗への投資が完了しました！' });
                setTimeout(() => setActionModal(null), 2000);
            }
        };

        const handleUpgradeSkill = (skillId) => {
            const currentLevel = gameState.masterSkills[skillId] || 0;
            const cost = 2000 * (currentLevel + 1);
            if (gameState.budget >= cost) {
                setGameState(prev => {
                    const next = JSON.parse(JSON.stringify(prev));
                    next.budget -= cost;
                    next.masterSkills[skillId] = currentLevel + 1;
                    return next;
                });
                setActionModal({ type: 'skill_upgrade', phase: 'result', message: 'スキルの修得が完了しました！' });
                setTimeout(() => setActionModal(null), 2000);
            }
        };

        const handleSearchAdv = () => {
            const cost = 500;
            if (gameState.budget < cost) return;
            if (gameState.adventurers.length >= gameState.facilities.residence * 5) {
                alert('宿舎が満員です。'); return;
            }
            setActionModal({ type: 'recruit_search', phase: 'searching', message: '優秀な人材を捜索中...' });
            setTimeout(() => {
                setGameState(prev => {
                    const next = JSON.parse(JSON.stringify(prev));
                    next.budget -= cost;
                    const newAdv = Utils.generateAdventurer(next.fame, next.notoriety, next.adventurers.map(a => a.name));
                    next.adventurers.push(newAdv);
                    return next;
                });
                setActionModal({ type: 'recruit_found', phase: 'result', foundRank: 'C', // fallback
                    message: `新たな冒険者が加入しました！` });
                setTimeout(() => setActionModal(null), 2000);
            }, 1000);
        };

        const handleFireAdventurer = (advId) => {
            setGameState(prev => ({ ...prev, adventurers: prev.adventurers.filter(a => a.id !== advId) }));
            setSelectedAdv(null);
        };

        window.G1.appHandlers = {
            onAutoAssign: handleAutoAssign,
            onMassDispatch: handleMassDispatch
        };

        // --- 5. Title View ---
        if (view === 'title') {
            const hasSave = !!localStorage.getItem(Constants.SAVE_KEY);
            return (
                <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-40">
                        <img src="assets/images/title_bg.png" className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="relative z-10 text-center space-y-8 title-fade-in max-w-2xl">
                        <h1 className="text-6xl md:text-8xl font-black text-[#F2E8C6] tracking-tighter title-text-glow italic uppercase">GUILD MASTER</h1>
                        <p className="text-[#E8E0D5] text-lg md:text-xl font-serif tracking-[0.3em] opacity-80">~ 辺境ギルド運営日録 ~</p>
                        <div className="flex flex-col gap-4 items-center mt-8">
                            <button onClick={startGame} className="w-64 bg-[#D9A94E] hover:bg-[#F2C94C] text-stone-900 py-4 px-8 rounded-sm font-black text-xl shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3">
                                ギルドを新規開設 <ArrowRight className="w-6 h-6" />
                            </button>
                            {hasSave && (
                                <button onClick={loadGame} className="w-64 bg-stone-700 hover:bg-stone-600 text-[#F2E8C6] py-4 px-8 rounded-sm font-black text-xl shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 border border-stone-500">
                                    前回の記録から再開 <RotateCcw className="w-6 h-6" />
                                </button>
                            )}
                            <button onClick={() => setShowHowToPlay(true)} className="text-[#E8E0D5] hover:text-[#F2E8C6] font-bold underline underline-offset-8 decoration-stone-600 transition-colors mt-4">
                                遊び方を確認する
                            </button>
                        </div>
                    </div>
                    <HowToPlayModal isOpen={showHowToPlay} onClose={() => setShowHowToPlay(false)} />
                </div>
            );
        }

        // --- 6. Main Game View ---
        if (!gameState) return null;

        return (
            <div className="min-h-screen bg-[#EBE7E0] flex flex-col font-serif relative overflow-hidden">
                <div className="game-bg-container">
                    <img src={`assets/images/bg_${tab === 'home' || tab === 'facility' ? 'throne' : tab === 'quest' ? 'market' : tab === 'roster' ? 'barracks' : tab === 'dungeon' ? 'dungeon' : 'shadow'}.png`} className="game-bg-img" style={{opacity: 0.15}} alt="" />
                    <div className="game-bg-overlay"></div>
                </div>

                <header className="bg-stone-900 text-[#E8E0D5] p-3 shadow-xl relative z-30 border-b border-stone-800">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <h1 className="text-xl font-black tracking-tighter italic text-[#D9A94E]">GUILD MASTER</h1>
                            <div className="flex flex-col ml-4">
                                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">現在の季節</span>
                                <span className="text-sm font-bold tracking-widest">第 {Math.floor((gameState.turn - 1) / 4) + 1} 暦 【{Constants.SEASONS[(gameState.turn - 1) % 4]}】</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">金庫預金</span>
                                <span className={`text-xl font-black tracking-tight ${gameState.budget < 1000 ? 'text-rose-500' : 'text-[#D9A94E]'}`}>{gameState.budget.toLocaleString()} G</span>
                            </div>
                            <button onClick={nextTurn} className="bg-[#D9A94E] hover:bg-[#F2C94C] text-stone-900 px-6 py-2 rounded-sm font-black transition-all shadow-lg active:scale-95 flex items-center gap-2 group">
                                季節を進める <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </header>

                <main className="flex-1 max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-4 p-4 relative z-10 overflow-hidden">
                    <aside className="w-full md:w-64 space-y-1 shrink-0 overflow-y-auto pr-1">
                        {[
                            { id: 'home', label: 'ダッシュボード', icon: Home },
                            { id: 'quest', label: '掲示板', icon: ScrollText },
                            { id: 'roster', label: '冒険者名簿', icon: Users },
                            { id: 'dungeon', label: '未踏迷宮', icon: MapIcon },
                            { id: 'facility', label: 'ギルド本部', icon: Landmark },
                            { id: 'shop', label: '提携店舗', icon: ShoppingBag },
                            { id: 'intrigue', label: '工作・諜報', icon: EyeOff },
                            { id: 'policy', label: '運営方針', icon: Compass },
                            { id: 'skill', label: 'マスタースキル', icon: Zap },
                            { id: 'achievement', label: '称号・実績', icon: Trophy },
                            { id: 'log', label: '活動記録', icon: BookOpen },
                        ].map(item => (
                            <button
                                key={item.id}
                                onClick={() => setTab(item.id)}
                                className={`w-full flex items-center gap-3 p-3 rounded-sm font-bold transition-all text-xs ${tab === item.id ? 'bg-stone-800 text-[#F2E8C6] shadow-md translate-x-1' : 'bg-white/60 text-stone-600 hover:bg-white border border-stone-200 shadow-sm'}`}
                            >
                                <item.icon className={`w-4 h-4 ${tab === item.id ? 'text-[#D9A94E]' : 'text-stone-400'}`} />
                                {item.label}
                            </button>
                        ))}
                    </aside>

                    <section className="flex-1 glass-panel border border-[#D4C3A3] shadow-inner overflow-hidden flex flex-col p-4 md:p-6 rounded-sm relative">
                        {tab === 'home' && <HomeView gameState={gameState} onOpenSpecial={handleOpenSpecial} onDeclineSpecial={handleDeclineSpecial} onHireReceptionist={hireReceptionist} />}
                        {tab === 'quest' && <QuestView gameState={gameState} onDispatch={(q) => { setDispatchTarget({quest: q}); setDispatchCandidates([]); }} />}
                        {tab === 'roster' && <RosterView gameState={gameState} onSelectAdv={setSelectedAdv} onSearchAdv={handleSearchAdv} />}
                        {tab === 'dungeon' && (
                            <div className="space-y-4 overflow-y-auto animate-in fade-in slide-in-from-right-4 duration-500">
                                <p className="text-sm font-bold text-stone-600 mb-3">発見された迷宮</p>
                                {gameState.discoveredDungeons.map(d => (
                                    <div key={d.id} className="bg-white border-2 border-[#D4C3A3] p-5 rounded-sm shadow-sm hover:border-indigo-400 transition-colors group">
                                        <div className="flex justify-between items-center mb-3">
                                            <h3 className="font-bold text-stone-800 text-lg flex items-center gap-2">
                                                <MapIcon className="w-5 h-5 text-stone-400 group-hover:text-indigo-500" /> {d.name}
                                            </h3>
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${d.progress >= 100 ? 'bg-rose-100 text-rose-700' : 'bg-indigo-50 text-indigo-700'}`}>
                                                {d.progress >= 100 ? '攻略済み' : `攻略度 ${d.progress}%`}
                                            </span>
                                        </div>
                                        <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden border border-stone-200 shadow-inner">
                                            <div className={`h-full transition-all duration-1000 ${d.progress >= 100 ? 'bg-rose-500' : 'bg-indigo-500'}`} style={{width: `${d.progress}%`}}></div>
                                        </div>
                                        <p className="text-xs text-stone-500 mt-3 leading-relaxed">{d.desc}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        {tab === 'facility' && <FacilityView gameState={gameState} onInvest={handleInvestFacility} />}
                        {tab === 'shop' && <ShopView gameState={gameState} onInvest={handleInvestShop} />}
                        {tab === 'intrigue' && <IntrigueView gameState={gameState} onSabotage={handleSabotage} onHeadhunt={()=>{}} onIntelligence={()=>{}} />}
                        {tab === 'policy' && <PolicyView gameState={gameState} onUpdateAlignment={handleUpdateAlignment} />}
                        {tab === 'skill' && <MasterSkillView gameState={gameState} onUpgrade={handleUpgradeSkill} />}
                        {tab === 'achievement' && <AchievementView gameState={gameState} />}
                        {tab === 'log' && <LogView gameState={gameState} />}
                        {tab === 'boss' && <BossView gameState={gameState} onFightBoss={nextTurn} />}
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
                <AdventurerModal adventurer={selectedAdv} onClose={() => setSelectedAdv(null)} onFire={handleFireAdventurer} />
                {gameState.ending && <EndingView gameState={gameState} />}
            </div>
        );
    };

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
})();
