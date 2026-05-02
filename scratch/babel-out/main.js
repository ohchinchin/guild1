'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

(function () {
    var _React = React;
    var useState = _React.useState;
    var useEffect = _React.useEffect;
    var useRef = _React.useRef;

    var App = function App() {
        var _useState = useState(false);

        var _useState2 = _slicedToArray(_useState, 2);

        var isReady = _useState2[0];
        var setIsReady = _useState2[1];

        var _useState3 = useState('title');

        var _useState32 = _slicedToArray(_useState3, 2);

        var view = _useState32[0];
        var setView = _useState32[1];

        var _useState4 = useState('home');

        var _useState42 = _slicedToArray(_useState4, 2);

        var tab = _useState42[0];
        var setTab = _useState42[1];

        var _useState5 = useState(null);

        var _useState52 = _slicedToArray(_useState5, 2);

        var gameState = _useState52[0];
        var setGameState = _useState52[1];

        var _useState6 = useState(null);

        var _useState62 = _slicedToArray(_useState6, 2);

        var quarterResult = _useState62[0];
        var setQuarterResult = _useState62[1];

        var _useState7 = useState(null);

        var _useState72 = _slicedToArray(_useState7, 2);

        var actionModal = _useState72[0];
        var setActionModal = _useState72[1];

        var _useState8 = useState(null);

        var _useState82 = _slicedToArray(_useState8, 2);

        var dispatchTarget = _useState82[0];
        var setDispatchTarget = _useState82[1];

        var _useState9 = useState([]);

        var _useState92 = _slicedToArray(_useState9, 2);

        var dispatchCandidates = _useState92[0];
        var setDispatchCandidates = _useState92[1];

        var _useState10 = useState(null);

        var _useState102 = _slicedToArray(_useState10, 2);

        var selectedAdv = _useState102[0];
        var setSelectedAdv = _useState102[1];

        var _useState11 = useState(false);

        var _useState112 = _slicedToArray(_useState11, 2);

        var showHowToPlay = _useState112[0];
        var setShowHowToPlay = _useState112[1];

        // --- Component Registry Sync Check ---
        useEffect(function () {
            var required = ['ActionModal', 'QuarterResultModal', 'QuestView', 'RosterView', 'DispatchModal', 'FacilityView', 'ShopView', 'PolicyView', 'AdventurerModal', 'HomeView', 'IntrigueView', 'MasterSkillView', 'AchievementView', 'LogView', 'BossView', 'EndingView', 'HowToPlayModal', 'ConfettiEffect'];
            var check = function check() {
                var loaded = window.G1 && window.G1.components;
                if (!loaded) return false;
                var missing = required.filter(function (k) {
                    return !window.G1.components[k];
                });
                if (missing.length === 0) {
                    setIsReady(true);
                    console.log("Guild Master System: [OK] All components registered.");
                    return true;
                }
                console.log("Guild Master System: [WAIT] Missing components:", missing.join(', '));
                return false;
            };
            if (!check()) {
                var _ret = (function () {
                    var itv = setInterval(function () {
                        if (check()) clearInterval(itv);
                    }, 200);
                    return {
                        v: function () {
                            return clearInterval(itv);
                        }
                    };
                })();

                if (typeof _ret === 'object') return _ret.v;
            }
        }, []);

        // --- Auto-Save ---
        useEffect(function () {
            if (gameState && view !== 'title') {
                try {
                    localStorage.setItem(window.G1.Constants.SAVE_KEY, JSON.stringify(_extends({}, gameState, { view: view, tab: tab })));
                } catch (e) {
                    console.error("Save failed", e);
                }
            }
        }, [gameState, view, tab]);

        if (!isReady) {
            return React.createElement(
                'div',
                { className: 'min-h-screen bg-stone-950 flex flex-col items-center justify-center' },
                React.createElement(
                    'div',
                    { className: 'text-amber-500 font-black text-2xl animate-pulse italic' },
                    'INITIALIZING GUILD ENGINE...'
                )
            );
        }

        // Safe Icon Helper
        var L = window.LucideReact;
        var SafeIcon = function SafeIcon(name) {
            if (!L) return function () {
                return React.createElement('div', { className: 'w-4 h-4 bg-stone-500' });
            };
            var Icon = L[name] || L[name.replace('2', '')] || L.Activity || L.HelpCircle;
            return Icon;
        };

        var _window$G1$components = window.G1.components;
        var ActionModal = _window$G1$components.ActionModal;
        var QuarterResultModal = _window$G1$components.QuarterResultModal;
        var QuestView = _window$G1$components.QuestView;
        var RosterView = _window$G1$components.RosterView;
        var DispatchModal = _window$G1$components.DispatchModal;
        var FacilityView = _window$G1$components.FacilityView;
        var ShopView = _window$G1$components.ShopView;
        var PolicyView = _window$G1$components.PolicyView;
        var AdventurerModal = _window$G1$components.AdventurerModal;
        var HomeView = _window$G1$components.HomeView;
        var IntrigueView = _window$G1$components.IntrigueView;
        var MasterSkillView = _window$G1$components.MasterSkillView;
        var AchievementView = _window$G1$components.AchievementView;
        var LogView = _window$G1$components.LogView;
        var BossView = _window$G1$components.BossView;
        var EndingView = _window$G1$components.EndingView;
        var HowToPlayModal = _window$G1$components.HowToPlayModal;

        var Constants = window.G1.Constants;
        var Utils = window.G1.Utils;
        var Engine = window.G1.Engine;

        // --- Game Logic Handlers ---
        var startGame = function startGame() {
            console.log("Executing startGame...");
            try {
                var initialState = {
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

                var rivalStyles = ['military', 'commerce', 'safety'];
                for (var i = 0; i < 3; i++) {
                    var adj = Constants.RIVAL_ADJS[Math.floor(Math.random() * Constants.RIVAL_ADJS.length)];
                    var noun = Constants.RIVAL_NOUNS[Math.floor(Math.random() * Constants.RIVAL_NOUNS.length)];
                    initialState.rivals.push({ id: 'rival_' + i, name: '' + adj + noun, style: rivalStyles[i], power: 300 + i * 200, relation: 50 });
                }
                for (var i = 0; i < 2; i++) {
                    var d = Constants.DUNGEON_POOL[i];
                    if (d) initialState.discoveredDungeons.push(_extends({}, d, { progress: 0, rivals: [] }));
                }
                for (var i = 0; i < 4; i++) {
                    initialState.adventurers.push(Utils.generateAdventurer(10, 0, initialState.adventurers.map(function (a) {
                        return a.name;
                    })));
                }for (var i = 0; i < 5; i++) {
                    initialState.availableQuests.push(Utils.generateQuest(1, 10, 0, 10));
                }setGameState(initialState);
                setView('game');
                setTab('home');
                console.log("Game started successfully.");
            } catch (err) {
                console.error("CRITICAL ERROR in startGame:", err);
            }
        };

        var loadGame = function loadGame() {
            try {
                var saved = localStorage.getItem(Constants.SAVE_KEY);
                if (saved) {
                    var parsed = JSON.parse(saved);
                    setGameState(parsed);
                    setView(parsed.view || 'game');
                    setTab(parsed.tab || 'home');
                    console.log("Save data loaded.");
                }
            } catch (err) {
                console.error("Load failed", err);
            }
        };

        var nextTurn = function nextTurn() {
            if (!gameState) return;
            try {
                setGameState(function (prev) {
                    var nextState = Engine.processTurn(prev);
                    setQuarterResult(nextState.quarterResult);
                    if (nextState.activeBoss) setTab('boss');
                    return nextState;
                });
            } catch (err) {
                console.error("Turn process failed", err);
            }
        };

        var handleDispatchConfirm = function handleDispatchConfirm() {
            if (!dispatchTarget) return;
            setGameState(function (prev) {
                try {
                    var next = JSON.parse(JSON.stringify(prev));
                    var newDispatch = { quest: dispatchTarget.quest, partyIds: [].concat(_toConsumableArray(dispatchCandidates)), isSpecial: !!dispatchTarget.isSpecial };
                    next.dispatches.push(newDispatch);
                    next.adventurers.forEach(function (a) {
                        if (dispatchCandidates.includes(a.id)) a.status = 'dispatched';
                    });
                    next.budget -= dispatchTarget.quest.deposit || 0;
                    next.history.push({ turn: next.turn, type: 'info', text: '任務「' + dispatchTarget.quest.name + '」へ部隊を派遣。' });
                    if (dispatchTarget.isSpecial) next.specialRequest = null;else next.availableQuests = next.availableQuests.filter(function (q) {
                        return q.id !== dispatchTarget.quest.id;
                    });
                    return next;
                } catch (e) {
                    console.error(e);return prev;
                }
            });
            setDispatchTarget(null);setDispatchCandidates([]);
        };

        var handleAutoAssign = function handleAutoAssign() {
            if (!dispatchTarget) return;
            var quest = dispatchTarget.quest;
            var maxMembers = dispatchTarget.isSpecial ? 5 : 10;
            var idles = gameState.adventurers.filter(function (a) {
                return a.status === 'idle';
            });
            var selected = [];
            var reqs = quest.requirements || [];
            reqs.filter(function (r) {
                return r.type === 'class';
            }).forEach(function (r) {
                var m = idles.find(function (a) {
                    return a.advClass.id === r.value && !selected.includes(a.id);
                });
                if (m) selected.push(m.id);
            });
            reqs.filter(function (r) {
                return r.type === 'rank';
            }).forEach(function (r) {
                var idx = Constants.RANKS.indexOf(r.value);
                var m = idles.find(function (a) {
                    return Constants.RANKS.indexOf(a.rank) >= idx && !selected.includes(a.id);
                });
                if (m) selected.push(m.id);
            });
            var rem = idles.filter(function (a) {
                return !selected.includes(a.id);
            }).sort(function (a, b) {
                return b.power - a.power;
            });
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = rem[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var a = _step.value;

                    if (selected.length >= maxMembers) break;
                    selected.push(a.id);
                    var info = Utils.calculatePartyPower(selected, gameState.adventurers, gameState.alignment, gameState.masterSkills);
                    if (info.total >= quest.powerReq && selected.length >= quest.minMembers) break;
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator['return']) {
                        _iterator['return']();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            if (selected.length < quest.minMembers) {
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = rem[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var a = _step2.value;

                        if (!selected.includes(a.id)) {
                            selected.push(a.id);if (selected.length >= quest.minMembers) break;
                        }
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                            _iterator2['return']();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }
            }
            setDispatchCandidates(selected);
        };

        var handleMassDispatch = function handleMassDispatch() {
            setGameState(function (prev) {
                var next = JSON.parse(JSON.stringify(prev));
                var idleAdvs = next.adventurers.filter(function (a) {
                    return a.status === 'idle';
                }).sort(function (a, b) {
                    return b.power - a.power;
                });
                var count = 0;var deposit = 0;
                var sortedQuests = [].concat(_toConsumableArray(next.availableQuests)).sort(function (a, b) {
                    return b.reward - a.reward;
                });
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    var _loop = function () {
                        var q = _step3.value;

                        if (idleAdvs.length < q.minMembers || next.budget < deposit + (q.deposit || 0)) return 'continue';
                        var selected = [];
                        var rem = [].concat(_toConsumableArray(idleAdvs));
                        _iteratorNormalCompletion4 = true;
                        _didIteratorError4 = false;
                        _iteratorError4 = undefined;

                        try {
                            for (_iterator4 = rem[Symbol.iterator](); !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                                var a = _step4.value;

                                if (selected.length >= 10) break;
                                selected.push(a);
                                var info = Utils.calculatePartyPower(selected.map(function (x) {
                                    return x.id;
                                }), next.adventurers, next.alignment, next.masterSkills);
                                if (info.total >= q.powerReq && selected.length >= q.minMembers) break;
                            }
                        } catch (err) {
                            _didIteratorError4 = true;
                            _iteratorError4 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion4 && _iterator4['return']) {
                                    _iterator4['return']();
                                }
                            } finally {
                                if (_didIteratorError4) {
                                    throw _iteratorError4;
                                }
                            }
                        }

                        if (selected.length >= q.minMembers) {
                            next.dispatches.push({ quest: q, partyIds: selected.map(function (x) {
                                    return x.id;
                                }) });
                            selected.forEach(function (a) {
                                return a.status = 'dispatched';
                            });
                            idleAdvs = idleAdvs.filter(function (a) {
                                return !selected.includes(a);
                            });
                            deposit += q.deposit || 0;count++;
                            next.availableQuests = next.availableQuests.filter(function (x) {
                                return x.id !== q.id;
                            });
                        }
                    };

                    for (var _iterator3 = sortedQuests[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var _iteratorNormalCompletion4;

                        var _didIteratorError4;

                        var _iteratorError4;

                        var _iterator4, _step4;

                        var _ret2 = _loop();

                        if (_ret2 === 'continue') continue;
                    }
                } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion3 && _iterator3['return']) {
                            _iterator3['return']();
                        }
                    } finally {
                        if (_didIteratorError3) {
                            throw _iteratorError3;
                        }
                    }
                }

                if (count > 0) {
                    next.budget -= deposit;
                    next.history.push({ turn: next.turn, type: 'info', text: '一括派遣 (' + count + '部隊)' });
                    return next;
                }
                return prev;
            });
        };

        var handleSabotage = function handleSabotage(rivalId) {
            var cost = 500;if (gameState.budget < cost) return;
            setActionModal({ type: 'action_sabotage', phase: 'searching', message: '工作員を派遣中...' });
            setTimeout(function () {
                setGameState(function (prev) {
                    var next = JSON.parse(JSON.stringify(prev));
                    next.budget -= cost;
                    var rival = next.rivals.find(function (r) {
                        return r.id === rivalId;
                    });
                    if (Math.random() < 0.7) {
                        rival.power = Math.max(0, rival.power - 100);rival.relation = Math.max(0, rival.relation - 20);
                        next.history.push({ turn: next.turn, type: 'warning', text: rival.name + 'への工作に成功。' });
                        setActionModal({ type: 'action_quest', phase: 'result', message: '工作成功！敵の戦力を削ぎ落としました。' });
                    } else {
                        rival.relation = Math.max(0, rival.relation - 30);next.notoriety += 10;
                        next.history.push({ turn: next.turn, type: 'danger', text: rival.name + 'への工作が露見。' });
                        setActionModal({ type: 'recruit_failed', phase: 'result', message: '工作失敗…悪名が高まりました。' });
                    }
                    return next;
                });
                setTimeout(function () {
                    return setActionModal(null);
                }, 2000);
            }, 1000);
        };

        window.G1.appHandlers = { onAutoAssign: handleAutoAssign, onMassDispatch: handleMassDispatch };

        // --- Render Helpers ---
        var HomeIcon = SafeIcon('Home');
        var ArrowRightIcon = SafeIcon('ArrowRight');
        var RotateCcwIcon = SafeIcon('RotateCcw');
        var ChevronRightIcon = SafeIcon('ChevronRight');
        var MapIcon = SafeIcon('Map');

        if (view === 'title') {
            var hasSave = !!localStorage.getItem(Constants.SAVE_KEY);
            return React.createElement(
                'div',
                { className: 'min-h-screen bg-stone-900 flex items-center justify-center p-4 relative overflow-hidden text-stone-200' },
                React.createElement(
                    'div',
                    { className: 'absolute inset-0 opacity-40' },
                    React.createElement('img', { src: 'assets/images/title_bg.png', className: 'w-full h-full object-cover' })
                ),
                React.createElement(
                    'div',
                    { className: 'relative z-10 text-center space-y-8 title-fade-in max-w-2xl' },
                    React.createElement(
                        'h1',
                        { className: 'text-6xl md:text-8xl font-black text-[#F2E8C6] tracking-tighter title-text-glow italic uppercase leading-none' },
                        'GUILD MASTER'
                    ),
                    React.createElement(
                        'p',
                        { className: 'text-[#E8E0D5] text-lg md:text-xl font-serif tracking-[0.3em] opacity-80 mt-4' },
                        '~ 辺境ギルド運営日録 ~'
                    ),
                    React.createElement(
                        'div',
                        { className: 'flex flex-col gap-4 items-center mt-12' },
                        React.createElement(
                            'button',
                            { onClick: startGame, className: 'w-72 bg-[#D9A94E] hover:bg-[#F2C94C] text-stone-900 py-5 px-8 rounded-sm font-black text-xl shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3' },
                            'ギルドを新規開設 ',
                            React.createElement(ArrowRightIcon, { className: 'w-6 h-6' })
                        ),
                        hasSave && React.createElement(
                            'button',
                            { onClick: loadGame, className: 'w-72 bg-stone-700 hover:bg-stone-600 text-[#F2E8C6] py-5 px-8 rounded-sm font-black text-xl shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 border border-stone-500' },
                            '記録から再開 ',
                            React.createElement(RotateCcwIcon, { className: 'w-6 h-6' })
                        ),
                        React.createElement(
                            'button',
                            { onClick: function () {
                                    return setShowHowToPlay(true);
                                }, className: 'text-[#E8E0D5] hover:text-[#F2E8C6] font-bold underline underline-offset-8 decoration-stone-600 transition-colors mt-6 text-sm tracking-widest uppercase' },
                            'Check Guide'
                        )
                    )
                ),
                React.createElement(HowToPlayModal, { isOpen: showHowToPlay, onClose: function () {
                        return setShowHowToPlay(false);
                    } })
            );
        }

        if (!gameState) return null;

        return React.createElement(
            'div',
            { className: 'min-h-screen bg-[#EBE7E0] flex flex-col font-serif relative overflow-hidden' },
            React.createElement(
                'div',
                { className: 'game-bg-container' },
                React.createElement('img', { src: 'assets/images/bg_' + (tab === 'home' || tab === 'facility' ? 'throne' : tab === 'quest' ? 'market' : tab === 'roster' ? 'barracks' : tab === 'dungeon' ? 'dungeon' : 'shadow') + '.png', className: 'game-bg-img', style: { opacity: 0.15 } }),
                React.createElement('div', { className: 'game-bg-overlay' })
            ),
            React.createElement(
                'header',
                { className: 'bg-stone-900 text-[#E8E0D5] p-3 shadow-xl relative z-30 border-b border-stone-800 shrink-0' },
                React.createElement(
                    'div',
                    { className: 'max-w-7xl mx-auto flex justify-between items-center' },
                    React.createElement(
                        'div',
                        { className: 'flex items-center gap-4' },
                        React.createElement(
                            'h1',
                            { className: 'text-xl font-black tracking-tighter italic text-[#D9A94E]' },
                            'GUILD MASTER'
                        ),
                        React.createElement(
                            'div',
                            { className: 'flex flex-col ml-4' },
                            React.createElement(
                                'span',
                                { className: 'text-[10px] font-bold text-stone-500 uppercase tracking-widest' },
                                '現在の季節'
                            ),
                            React.createElement(
                                'span',
                                { className: 'text-sm font-bold' },
                                '第 ',
                                Math.floor((gameState.turn - 1) / 4) + 1,
                                ' 暦 【',
                                Constants.SEASONS[(gameState.turn - 1) % 4],
                                '】'
                            )
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'flex items-center gap-6' },
                        React.createElement(
                            'div',
                            { className: 'flex flex-col items-end' },
                            React.createElement(
                                'span',
                                { className: 'text-[10px] font-bold text-stone-500 uppercase tracking-widest' },
                                '金庫預金'
                            ),
                            React.createElement(
                                'span',
                                { className: 'text-xl font-black tracking-tight ' + (gameState.budget < 1000 ? 'text-rose-500' : 'text-[#D9A94E]') },
                                gameState.budget.toLocaleString(),
                                ' G'
                            )
                        ),
                        React.createElement(
                            'button',
                            { onClick: nextTurn, className: 'bg-[#D9A94E] hover:bg-[#F2C94C] text-stone-900 px-6 py-2 rounded-sm font-black shadow-lg active:scale-95 flex items-center gap-2 group' },
                            '季節を進める ',
                            React.createElement(ChevronRightIcon, { className: 'w-5 h-5 group-hover:translate-x-1' })
                        )
                    )
                )
            ),
            React.createElement(
                'main',
                { className: 'flex-1 max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-4 p-4 relative z-10 overflow-hidden' },
                React.createElement(
                    'aside',
                    { className: 'w-full md:w-64 space-y-1 shrink-0 overflow-y-auto pr-1' },
                    [{ id: 'home', label: 'ダッシュボード', icon: 'Home' }, { id: 'quest', label: '掲示板', icon: 'ScrollText' }, { id: 'roster', label: '冒険者名簿', icon: 'Users' }, { id: 'dungeon', label: '未踏迷宮', icon: 'Map' }, { id: 'facility', label: 'ギルド本部', icon: 'Landmark' }, { id: 'shop', label: '提携店舗', icon: 'ShoppingBag' }, { id: 'intrigue', label: '工作・諜報', icon: 'EyeOff' }, { id: 'policy', label: '運営方針', icon: 'Compass' }, { id: 'skill', label: 'マスタースキル', icon: 'Zap' }, { id: 'achievement', label: '称号・実績', icon: 'Trophy' }, { id: 'log', label: '活動記録', icon: 'BookOpen' }].map(function (item) {
                        var Icon = SafeIcon(item.icon);
                        return React.createElement(
                            'button',
                            { key: item.id, onClick: function () {
                                    return setTab(item.id);
                                }, className: 'w-full flex items-center gap-3 p-3 rounded-sm font-bold transition-all text-xs ' + (tab === item.id ? 'bg-stone-800 text-[#F2E8C6] shadow-md translate-x-1' : 'bg-white/60 text-stone-600 hover:bg-white border border-stone-200 shadow-sm') },
                            React.createElement(Icon, { className: 'w-4 h-4 ' + (tab === item.id ? 'text-[#D9A94E]' : 'text-stone-400') }),
                            ' ',
                            item.label
                        );
                    })
                ),
                React.createElement(
                    'section',
                    { className: 'flex-1 glass-panel border border-[#D4C3A3] shadow-inner overflow-hidden flex flex-col p-4 md:p-6 rounded-sm relative' },
                    tab === 'home' && React.createElement(HomeView, { gameState: gameState, onOpenSpecial: function () {
                            setDispatchTarget({ quest: gameState.specialRequest, isSpecial: true });setDispatchCandidates([]);
                        }, onDeclineSpecial: function () {
                            setGameState(function (p) {
                                var n = JSON.parse(JSON.stringify(p));n.specialRequest = null;return n;
                            });
                        }, onHireReceptionist: function (c) {
                            setGameState(function (p) {
                                var n = JSON.parse(JSON.stringify(p));n.budget -= c.hireCost;n.receptionist = c;return n;
                            });
                        }, onSelectAdv: setSelectedAdv }),
                    tab === 'quest' && React.createElement(QuestView, { gameState: gameState, onDispatch: function (q) {
                            setDispatchTarget({ quest: q });setDispatchCandidates([]);
                        } }),
                    tab === 'roster' && React.createElement(RosterView, { gameState: gameState, onSelectAdv: setSelectedAdv, onSearchAdv: handleSearchAdv }),
                    tab === 'dungeon' && React.createElement(
                        'div',
                        { className: 'space-y-4 overflow-y-auto animate-in fade-in slide-in-from-right-4 duration-500 h-full' },
                        React.createElement(
                            'p',
                            { className: 'text-sm font-bold text-stone-600 mb-3 shrink-0' },
                            '発見された迷宮'
                        ),
                        gameState.discoveredDungeons.map(function (d) {
                            return React.createElement(
                                'div',
                                { key: d.id, className: 'bg-white border-2 border-[#D4C3A3] p-5 rounded-sm shadow-sm hover:border-indigo-400 transition-colors group shrink-0' },
                                React.createElement(
                                    'div',
                                    { className: 'flex justify-between items-center mb-3' },
                                    React.createElement(
                                        'h3',
                                        { className: 'font-bold text-stone-800 text-lg flex items-center gap-2' },
                                        React.createElement(MapIcon, { className: 'w-5 h-5 text-stone-400 group-hover:text-indigo-500' }),
                                        ' ',
                                        d.name
                                    ),
                                    React.createElement(
                                        'span',
                                        { className: 'text-xs font-bold px-2 py-1 rounded-full ' + (d.progress >= 100 ? 'bg-rose-100 text-rose-700' : 'bg-indigo-50 text-indigo-700') },
                                        d.progress >= 100 ? '攻略済み' : '攻略度 ' + d.progress + '%'
                                    )
                                ),
                                React.createElement(
                                    'div',
                                    { className: 'w-full bg-stone-100 h-2.5 rounded-full overflow-hidden border border-stone-200 shadow-inner' },
                                    React.createElement('div', { className: 'h-full transition-all duration-1000 ' + (d.progress >= 100 ? 'bg-rose-500' : 'bg-indigo-500'), style: { width: d.progress + '%' } })
                                ),
                                React.createElement(
                                    'p',
                                    { className: 'text-xs text-stone-500 mt-3 leading-relaxed' },
                                    d.desc
                                )
                            );
                        })
                    ),
                    tab === 'facility' && React.createElement(FacilityView, { gameState: gameState, onInvest: function (id) {
                            var c = 1000 + gameState.facilities[id] * 500;if (gameState.budget >= c) {
                                setGameState(function (p) {
                                    var n = JSON.parse(JSON.stringify(p));n.budget -= c;n.facilities[id]++;return n;
                                });setActionModal({ type: 'invest_facility', phase: 'result', message: '施設拡張完了' });setTimeout(function () {
                                    return setActionModal(null);
                                }, 1500);
                            }
                        } }),
                    tab === 'shop' && React.createElement(ShopView, { gameState: gameState, onInvest: function (id) {
                            var c = 1000 + gameState.shops[id] * 1000;if (gameState.budget >= c) {
                                setGameState(function (p) {
                                    var n = JSON.parse(JSON.stringify(p));n.budget -= c;n.shops[id]++;return n;
                                });setActionModal({ type: 'invest_shop', phase: 'result', message: '店舗投資完了' });setTimeout(function () {
                                    return setActionModal(null);
                                }, 1500);
                            }
                        } }),
                    tab === 'intrigue' && React.createElement(IntrigueView, { gameState: gameState, onSabotage: handleSabotage, onHeadhunt: handleHeadhunt, onIntelligence: handleIntelligence }),
                    tab === 'policy' && React.createElement(PolicyView, { gameState: gameState, onUpdateAlignment: function (a) {
                            return setGameState(function (p) {
                                return _extends({}, p, { alignment: a });
                            });
                        } }),
                    tab === 'skill' && React.createElement(MasterSkillView, { gameState: gameState, onUpgrade: function (id) {
                            var c = 2000 * (gameState.masterSkills[id] + 1);if (gameState.budget >= c) {
                                setGameState(function (p) {
                                    var n = JSON.parse(JSON.stringify(p));n.budget -= c;n.masterSkills[id]++;return n;
                                });setActionModal({ type: 'skill_upgrade', phase: 'result', message: 'スキル修得完了' });setTimeout(function () {
                                    return setActionModal(null);
                                }, 1500);
                            }
                        } }),
                    tab === 'achievement' && React.createElement(AchievementView, { gameState: gameState }),
                    tab === 'log' && React.createElement(LogView, { gameState: gameState }),
                    tab === 'boss' && React.createElement(BossView, { gameState: gameState, onFightBoss: nextTurn })
                )
            ),
            React.createElement(QuarterResultModal, { quarterResult: quarterResult, onConfirm: function () {
                    return setQuarterResult(null);
                } }),
            React.createElement(ActionModal, { actionModal: actionModal }),
            React.createElement(DispatchModal, { dispatchTarget: dispatchTarget, gameState: gameState, dispatchCandidates: dispatchCandidates, onToggleCandidate: function (id) {
                    return setDispatchCandidates(function (prev) {
                        return prev.includes(id) ? prev.filter(function (x) {
                            return x !== id;
                        }) : [].concat(_toConsumableArray(prev), [id]);
                    });
                }, onConfirm: handleDispatchConfirm, onCancel: function () {
                    return setDispatchTarget(null);
                } }),
            React.createElement(AdventurerModal, { adventurer: selectedAdv, onClose: function () {
                    return setSelectedAdv(null);
                }, onFire: handleFireAdventurer }),
            gameState.ending && React.createElement(EndingView, { gameState: gameState })
        );
    };
    var root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(App, null));
})();
