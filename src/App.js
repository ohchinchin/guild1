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

import HomeView from './components/HomeView.js';
import QuestBoard from './components/QuestBoard.js';
import RosterView from './components/RosterView.js';
import AlignmentView from './components/AlignmentView.js';
import DungeonView from './components/DungeonView.js';
import FacilityView from './components/FacilityView.js';
import ShopView from './components/ShopView.js';
import IntrigueView from './components/IntrigueView.js';
import SkillView from './components/SkillView.js';
import AchievementView from './components/AchievementView.js';
import BossView from './components/BossView.js';
import LogView from './components/LogView.js';
import DecisionView from './components/DecisionView.js';

import AdventurerModal from './components/AdventurerModal.js';
import ActionModal from './components/ActionModal.js';
import QuarterResultModal from './components/QuarterResultModal.js';
import SpecialRequestModal from './components/SpecialRequestModal.js';
import HowToPlayModal from './components/HowToPlayModal.js';
import EndingView from './components/EndingView.js';

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
                const loadedState = { ...INITIAL_GAME_STATE, ...parsed.gameState };
                setGameState(loadedState);
                setLogs(parsed.logs || []);
            } catch (e) {
                console.error("Failed to load save data", e);
            }
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded && currentView !== 'title') {
            localStorage.setItem(SAVE_KEY, JSON.stringify({ gameState, logs }));
        }
    }, [gameState, logs, isLoaded, currentView]);

    useEffect(() => {
        if (currentView === 'logs') logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs, currentView]);

    const toggleMute = () => {
        const nextMute = !isMuted;
        setIsMuted(nextMute);
        GeminiAudio.setMute(nextMute);
        if (!nextMute && !GeminiAudio.isInitialized) {
            GeminiAudio.init();
            GeminiAudio.playBGM(gameState.activeBoss ? 'boss' : 'home');
        }
    };

    const addLog = (msg, type = "normal") => {
        setLogs(prev => [...prev, { id: Date.now() + Math.random(), msg, type }].slice(-100));
    };

    const startNewGame = () => {
        let freshState = { ...INITIAL_GAME_STATE };
        freshState.usedNames = [];
        freshState.usedRepNames = [];

        const initialAdv = generateAdventurer(freshState.fame, freshState.notoriety, freshState.usedNames, 'D', false);
        freshState.adventurers = [initialAdv];
        freshState.mainParty = [initialAdv.id];
        freshState.usedNames.push(initialAdv.name);
        freshState.rivals = generateRivals(freshState.usedNames);
        freshState.currentRumor = RUMORS[Math.floor(Math.random() * RUMORS.length)];

        const rep1 = generateReceptionist(0, 0, freshState.usedRepNames);
        freshState.usedRepNames.push(rep1.baseName);
        const rep2 = generateReceptionist(0, 0, freshState.usedRepNames);
        freshState.usedRepNames.push(rep2.baseName);
        const rep3 = generateReceptionist(0, 0, freshState.usedRepNames);
        freshState.usedRepNames.push(rep3.baseName);
        freshState.availableReceptionists = [rep1, rep2, rep3];

        setGameState(freshState);
        setLogs([{ id: Date.now(), msg: "ギルドの扉が開かれました。30年間（120四半期）の歴史が今、始まります。", type: "info" }]);
        setCurrentView('home');
        setQuarterResult(null);
        setSelectedCandidate(null);
        
        GeminiAudio.init();
        GeminiAudio.playBGM('home');
    };

    const resetGame = () => {
        if (window.confirm("本当にギルドを解散し、新たな歴史を始めますか？（データは全て失われます）")) {
            localStorage.removeItem(SAVE_KEY);
            startNewGame();
        }
    };

    const autoAssembleParty = () => {
        setGameState(prev => {
            let available = [...prev.adventurers];
            available.sort((a, b) => b.power - a.power);
            let nextParty = [];

            const classes = ['warrior', 'cleric', 'mage', 'thief'];
            classes.forEach(cls => {
                const idx = available.findIndex(a => a.advClass.id === cls);
                if (idx !== -1) {
                    nextParty.push(available[idx].id);
                    available.splice(idx, 1);
                }
            });

            while (nextParty.length < 5 && available.length > 0) {
                nextParty.push(available[0].id);
                available.splice(0, 1);
            }

            addLog(`[人事] 冒険者の能力とクラス相性を考慮し、主力部隊を自動編成しました。`, "success");
            return { ...prev, mainParty: nextParty };
        });
    };

    const toggleMainParty = () => {
        if (!selectedAdv) return;
        setGameState(prev => {
            const isMain = prev.mainParty.includes(selectedAdv.id);
            let nextParty = [...prev.mainParty];
            if (isMain) {
                nextParty = nextParty.filter(id => id !== selectedAdv.id);
            } else {
                if (nextParty.length >= 5) {
                    addLog("主力部隊は既に5名編成されています。", "warning");
                    return prev;
                }
                nextParty.push(selectedAdv.id);
            }
            return { ...prev, mainParty: nextParty };
        });
    };

    const fireAdventurer = () => {
        if (!selectedAdv) return;
        if (window.confirm(`${selectedAdv.name} をギルドから解雇しますか？\n少額の退職金(100G)を支払い、他メンバーの忠誠度が少し下がります。`)) {
            setGameState(prev => {
                let next = { ...prev };
                if (next.budget < 100) {
                    addLog(`[警告] 退職金（100G）が払えないため解雇できません。`, "danger");
                    return prev;
                }
                next.budget -= 100;
                next.adventurers = next.adventurers.filter(a => a.id !== selectedAdv.id);
                next.mainParty = next.mainParty.filter(id => id !== selectedAdv.id);
                if (selectedAdv.equippedArtifactId) {
                    next.ownedArtifacts.push(selectedAdv.equippedArtifactId);
                }
                next.adventurers.forEach(a => {
                    a.loyalty = Math.max(0, a.loyalty - 5);
                });
                addLog(`[人事] ${selectedAdv.name} を解雇しました。ギルド内に動揺が広がっています。`, "warning");
                return next;
            });
            setSelectedAdv(null);
        }
    };

    const searchAdventurer = () => {
        const cost = 500;
        if (gameState.budget < cost) return addLog(`[警告] 捜索資金が不足しています。（必要: ${cost}G）`, "warning");
        if (gameState.adventurers.length >= gameState.facilities.residence * 5) return addLog("[警告] 居住区が満員です。これ以上人員を雇えません。", "warning");

        setActionModal({ type: 'recruit_search', phase: 'searching', message: '街の酒場で情報を集めている...' });

        setTimeout(() => {
            setGameState(prev => {
                const next = { ...prev, budget: prev.budget - cost };
                const skillLv = prev.masterSkills.recruitment || 0;
                const successChance = 30 + (skillLv * 20);
                
                if (Math.random() * 100 < successChance) {
                    let forcedRank = 'E';
                    const r = Math.random() * 100;
                    if (skillLv >= 3) {
                        if (r < 15) forcedRank = 'S';
                        else if (r < 50) forcedRank = 'A';
                        else forcedRank = 'B';
                    } else if (skillLv === 2) {
                        if (r < 30) forcedRank = 'B';
                        else forcedRank = 'C';
                    } else if (skillLv === 1) {
                        if (r < 40) forcedRank = 'C';
                        else forcedRank = 'D';
                    } else {
                        if (r < 20) forcedRank = 'D';
                        else forcedRank = 'E';
                    }

                    const newAdv = generateAdventurer(prev.fame, prev.notoriety, prev.usedNames, forcedRank, false);
                    next.adventurers.push(newAdv);
                    next.usedNames.push(newAdv.name);
                    addLog(`[人材捜索] 街の噂や裏ルートを辿り、${newAdv.name} (ランク${newAdv.rank}) を見つけ出し、勧誘に成功しました！`, "success");
                    
                    setTimeout(() => {
                        if (newAdv.rank === 'S' || newAdv.rank === 'A') GeminiAudio.playSE('gacha_s');
                        else GeminiAudio.playSE('success');

                        setActionModal({ 
                            type: 'recruit_found', phase: 'result', 
                            message: `新たな冒険者を発見した！\n\n名前: ${newAdv.name}\nランク: ${newAdv.rank}\nクラス: ${newAdv.advClass.name}`,
                            foundRank: newAdv.rank
                        });
                        const dismissTime = (newAdv.rank === 'S' || newAdv.rank === 'A') ? 5000 : 3500;
                        setTimeout(() => setActionModal(null), dismissTime);
                    }, 0);
                } else {
                    addLog(`[人材捜索] 懸命に捜索しましたが、今回は有能な人材を見つけることができませんでした...`, "warning");
                    setTimeout(() => {
                        GeminiAudio.playSE('danger');
                        setActionModal({ type: 'recruit_failed', phase: 'result', message: '懸命に捜索したが、\n有望な人材は見つからなかった...' });
                        setTimeout(() => setActionModal(null), 3500);
                    }, 0);
                }
                return next;
            });
        }, 2000);
    };

    const hireReceptionist = (rep) => {
        if (gameState.budget >= rep.hireCost) {
            setActionModal({ type: 'hire_receptionist', phase: 'searching', message: '雇用条件を提示し、\n面接を行っている...' });
            
            setTimeout(() => {
                setGameState(prev => {
                    addLog(`[人事] 新たな受付担当として ${rep.name} を雇用しました！`, "success");
                    setTimeout(() => {
                        setActionModal({ type: 'hire_receptionist', phase: 'result', message: `雇用完了！\n\n新受付担当：${rep.name}\nがギルドに加わった！` });
                        setTimeout(() => setActionModal(null), 3000);
                    }, 0);
                    return {
                        ...prev,
                        budget: prev.budget - rep.hireCost,
                        receptionist: rep,
                        availableReceptionists: prev.availableReceptionists.filter(r => r.id !== rep.id)
                    };
                });
            }, 1500);
        } else {
            addLog(`[警告] 雇用一時金が不足しています。（必要: ${rep.hireCost}G）`, "warning");
        }
    };

    const upgradeSkill = (skillId, cost) => {
        if (gameState.budget >= cost) {
            setActionModal({ type: 'skill_upgrade', phase: 'searching', message: '精神を集中し、新たな才能を開花させている...' });

            setTimeout(() => {
                setGameState(prev => {
                    addLog(`[才能開花] 資金を投じてマスターの才能『${MASTER_SKILLS[skillId].name}』を強化しました！`, "success");
                    setTimeout(() => {
                        setActionModal({ type: 'skill_upgrade', phase: 'result', message: `才能開花！\n\n『${MASTER_SKILLS[skillId].name}』のレベルが上がった！` });
                        setTimeout(() => setActionModal(null), 3500);
                    }, 0);
                    return {
                        ...prev, budget: prev.budget - cost,
                        masterSkills: { ...prev.masterSkills, [skillId]: prev.masterSkills[skillId] + 1 }
                    };
                });
            }, 1500);
        } else {
            addLog(`[警告] スキル解放の資金が不足しています。（必要: ${cost}G）`, "warning");
        }
    };

    const investFacility = (facility) => {
        const cost = 1000 + (gameState.facilities[facility] * 500);
        if (gameState.budget >= cost) {
            setActionModal({ type: 'invest_facility', phase: 'searching', message: '資材を集め、職人を雇い\n改築工事を進めている...' });
            
            setTimeout(() => {
                setGameState(prev => {
                    const facName = facility === 'residence' ? '居住区' : facility === 'tavern' ? '酒場' : '訓練場';
                    addLog(`[増築] 資金を投じ、${facName}を拡張しました。（Lv${prev.facilities[facility] + 1}）`, "success");
                    setTimeout(() => {
                        setActionModal({ type: 'invest_facility', phase: 'result', message: `工事完了！\n\n${facName} のレベルが上がった！` });
                        setTimeout(() => setActionModal(null), 2500);
                    }, 0);
                    return {
                        ...prev, budget: prev.budget - cost,
                        facilities: { ...prev.facilities, [facility]: prev.facilities[facility] + 1 }
                    };
                });
            }, 2000);
        } else addLog(`[警告] 金庫の資金が不足しています。（必要: ${cost}G）`, "warning");
    };

    const investShop = (shop) => {
        const cost = 1000;
        if (gameState.budget >= cost) {
            setActionModal({ type: 'invest_shop', phase: 'searching', message: '資金を提示し、\n店主と交渉を行っている...' });
            
            setTimeout(() => {
                setGameState(prev => {
                    const shopName = shop === 'blacksmith' ? '鍛冶屋' : shop === 'magicShop' ? '魔法屋' : '道具屋';
                    addLog(`[提携] 資金を融資し、街の${shopName}とのパイプを強化しました。`, "success");
                    setTimeout(() => {
                        setActionModal({ type: 'invest_shop', phase: 'result', message: `交渉成立！\n\n${shopName} との提携レベルが上がった！` });
                        setTimeout(() => setActionModal(null), 2500);
                    }, 0);
                    return {
                        ...prev, budget: prev.budget - cost,
                        shops: { ...prev.shops, [shop]: prev.shops[shop] + 1 }
                    };
                });
            }, 1500);
        } else addLog(`[警告] 資金が不足しています。（必要: ${cost}G）`, "warning");
    };

    const updateAlignment = (changedId, newValueStr) => {
        const newValue = parseInt(newValueStr, 10);
        setGameState(prev => {
            let newAlign = { ...prev.alignment };
            if (newAlign[changedId] === newValue) return prev;
            const others = ALIGNMENTS.filter(a => a !== changedId);
            const remaining = 100 - newValue;
            let otherSum = others.reduce((sum, a) => sum + newAlign[a], 0);

            let tempAlign = { [changedId]: newValue };
            if (otherSum === 0) others.forEach(a => tempAlign[a] = remaining / 3);
            else others.forEach(a => tempAlign[a] = (newAlign[a] / otherSum) * remaining);

            let finalAlign = { [changedId]: newValue };
            let currentTotal = newValue;
            let remainders = [];

            others.forEach(a => {
                const intVal = Math.floor(tempAlign[a]);
                finalAlign[a] = intVal;
                currentTotal += intVal;
                remainders.push({ id: a, rem: tempAlign[a] - intVal });
            });

            let diffTo100 = 100 - currentTotal;
            remainders.sort((a, b) => b.rem - a.rem);
            for (let i = 0; i < diffTo100; i++) finalAlign[remainders[i].id] += 1;

            return { ...prev, alignment: finalAlign };
        });
    };

    const getIntrigueChance = (baseRate) => {
        let rate = baseRate;
        if (gameState.receptionist.type === 'intelligence') rate += 20;
        if (gameState.masterSkills.underworld > 0) rate += (gameState.masterSkills.underworld * 10);
        return Math.min(95, rate);
    };

    const getDefenseIntelligence = (state) => {
        let defInt = 10;
        state.adventurers.forEach(a => { if (a.advClass.id === 'thief') defInt += 2; });
        if (state.masterSkills.underworld > 0) defInt += state.masterSkills.underworld * 10;
        if (state.receptionist.type === 'intelligence') defInt += 20;
        return Math.min(80, defInt);
    };

    const sabotageRival = (rivalId) => {
        const cost = 500;
        if (gameState.budget >= cost) {
            const targetName = gameState.rivals.find(r => r.id === rivalId)?.name;
            setActionModal({ type: 'action_sabotage', phase: 'searching', message: `工作員を放ち、\n『${targetName}』の拠点に潜入中...` });

            setTimeout(() => {
                setGameState(prev => {
                    const next = { ...prev, budget: prev.budget - cost, notoriety: prev.notoriety + 3 };
                    const targetRival = prev.rivals.find(r => r.id === rivalId);
                    const chance = getIntrigueChance(70);
                    const enemyDef = Math.min(50, Math.floor(targetRival.power / 100) + Math.floor(targetRival.relation / 4));
                    const finalChance = Math.max(10, chance - enemyDef);

                    let isSuccess = Math.random() * 100 < finalChance;

                    next.rivals = next.rivals.map(r => {
                        if (r.id === rivalId) {
                            if (isSuccess) {
                                const dmg = Math.floor(Math.random() * 50) + 50;
                                addLog(`[工作成功] 『${r.name}』の物資破壊に成功！戦力を ${dmg} 削ぎ落としました。`, "info");
                                setTimeout(() => {
                                    setActionModal({ type: 'action_sabotage', phase: 'result', message: `工作成功！\n\n『${r.name}』の物資に火を放ち、\n戦力を ${dmg} 削ぎ落とした！` });
                                    setTimeout(() => setActionModal(null), 3500);
                                }, 0);
                                return { ...r, power: Math.max(0, r.power - dmg), relation: Math.max(0, r.relation - 5) };
                            } else {
                                addLog(`[工作失敗] 工作員が捕縛され、『${r.name}』への妨害が露見！関係が極度に悪化しました。`, "danger");
                                setTimeout(() => {
                                    setActionModal({ type: 'action_sabotage', phase: 'result', message: `工作失敗...\n\n工作員が捕縛され、\n『${r.name}』との関係が極度に悪化した！` });
                                    setTimeout(() => setActionModal(null), 3500);
                                }, 0);
                                return { ...r, relation: Math.max(0, r.relation - 25) };
                            }
                        }
                        return r;
                    });
                    return next;
                });
            }, 2000);
        } else addLog(`[警告] 裏工作の資金が足りません。（必要: ${cost}G）`, "warning");
    };

    const gatherIntelligence = (rivalId) => {
        const cost = 300;
        if (gameState.budget >= cost) {
            const targetName = gameState.rivals.find(r => r.id === rivalId)?.name;
            setActionModal({ type: 'action_intelligence', phase: 'searching', message: `密偵を放ち、\n『${targetName}』の内情を探っている...` });

            setTimeout(() => {
                setGameState(prev => {
                    const next = { ...prev, budget: prev.budget - cost };
                    const targetRival = prev.rivals.find(r => r.id === rivalId);
                    const chance = getIntrigueChance(85);
                    const enemyDef = Math.min(60, Math.floor(targetRival.power / 80) + Math.floor(targetRival.relation / 5));
                    const finalChance = Math.max(20, chance - enemyDef);

                    let isSuccess = Math.random() * 100 < finalChance;

                    next.rivals = next.rivals.map(r => {
                        if (r.id === rivalId) {
                            if (isSuccess) {
                                addLog(`[諜報成功] 密偵を放ち、『${r.name}』の所属メンバーを洗い出しました。`, "info");
                                setTimeout(() => {
                                    setActionModal({ type: 'action_intelligence', phase: 'result', message: `諜報成功！\n\n『${r.name}』の所属メンバーの\n情報を手に入れた！` });
                                    setTimeout(() => setActionModal(null), 3500);
                                }, 0);
                                return { ...r, isRevealed: true };
                            } else {
                                addLog(`[諜報失敗] 密偵が相手の罠にかかり情報収集に失敗！相手を警戒させてしまいました。`, "danger");
                                setTimeout(() => {
                                    setActionModal({ type: 'action_intelligence', phase: 'result', message: `諜報失敗...\n\n密偵が相手の罠にかかり、\n警戒されてしまった！` });
                                    setTimeout(() => setActionModal(null), 3500);
                                }, 0);
                                return { ...r, relation: Math.max(0, r.relation - 15) };
                            }
                        }
                        return r;
                    });
                    return next;
                });
            }, 1500);
        } else addLog(`[警告] 諜報資金が足りません。（必要: ${cost}G）`, "warning");
    };

    const headhuntRival = (rivalId) => {
        const cost = 2000;
        if (gameState.notoriety < 30) return addLog("[警告] 悪名が足りず、裏社会のブローカーが動いてくれません。（悪名30以上必要）", "danger");
        if (gameState.budget < cost) return addLog(`[警告] 引き抜き資金が足りません。（必要: ${cost}G）`, "warning");
        if (gameState.adventurers.length >= gameState.facilities.residence * 5) return addLog("[警告] 居住区が満員で、これ以上人員を雇えません。", "warning");

        const targetName = gameState.rivals.find(r => r.id === rivalId)?.name;
        setActionModal({ type: 'action_headhunt', phase: 'searching', message: `大金と裏社会のパイプを使い、\n『${targetName}』のメンバーに接触中...` });

        setTimeout(() => {
            setGameState(prev => {
                const targetRival = prev.rivals.find(r => r.id === rivalId);
                if (!targetRival || targetRival.members.length === 0) {
                    addLog(`[警告] 『${targetRival.name}』には引き抜ける対象がいません。`, "warning");
                    setTimeout(() => setActionModal(null), 0);
                    return prev;
                }

                const next = { ...prev, budget: prev.budget - cost, notoriety: prev.notoriety + 8 };
                const chance = getIntrigueChance(50);
                const enemyDef = Math.min(40, Math.floor(targetRival.power / 100));
                const finalChance = Math.max(5, chance - enemyDef);

                if (Math.random() * 100 < finalChance) {
                    const stolenIdx = Math.floor(Math.random() * targetRival.members.length);
                    const stolenAdv = { ...targetRival.members[stolenIdx] };

                    next.rivals = next.rivals.map(r => {
                        if (r.id === rivalId) {
                            const newMembers = [...r.members];
                            newMembers.splice(stolenIdx, 1);
                            return { ...r, power: Math.max(0, r.power - stolenAdv.power), members: newMembers, relation: Math.max(0, r.relation - 20) };
                        }
                        return r;
                    });

                    stolenAdv.loyalty = 50;
                    stolenAdv.history = [`第 ${Math.floor(prev.turn / 4) + 1} 暦: 大金で引き抜かれ、『${targetRival.name}』から当ギルドへ移籍した。`, ...(stolenAdv.history || [])];
                    next.adventurers.push(stolenAdv);

                    addLog(`[引抜成功] 莫大な裏金を積み、『${targetRival.name}』から ${stolenAdv.name} (ランク${stolenAdv.rank}) を寝返らせることに成功しました！`, "success");
                    setTimeout(() => {
                        setActionModal({ type: 'action_headhunt', phase: 'result', message: `引き抜き成功！\n\n大金に目が眩んだ ${stolenAdv.name} が\n当ギルドに寝返った！`, foundRank: stolenAdv.rank });
                        const dismissTime = (stolenAdv.rank === 'S' || stolenAdv.rank === 'A') ? 5000 : 3500;
                        setTimeout(() => setActionModal(null), dismissTime);
                    }, 0);
                } else {
                    addLog(`[引抜失敗] 買収を持ちかけましたが拒絶されました！激怒した相手との関係が決定的に悪化しました。`, "danger");
                    next.rivals = next.rivals.map(r => r.id === rivalId ? { ...r, relation: Math.max(0, r.relation - 40) } : r);
                    setTimeout(() => {
                        setActionModal({ type: 'action_headhunt', phase: 'result', message: `引き抜き失敗...\n\n買収は拒絶され、\n相手との関係が決定的に悪化した！` });
                        setTimeout(() => setActionModal(null), 3500);
                    }, 0);
                }
                return next;
            });
        }, 2000);
    };

    const handleEquipArtifact = (advId, artifactId) => {
        setGameState(prev => {
            let next = { ...prev };
            let adv = next.adventurers.find(a => a.id === advId);

            if (adv.equippedArtifactId) {
                next.ownedArtifacts.push(adv.equippedArtifactId);
            }

            if (artifactId) {
                adv.equippedArtifactId = artifactId;
                next.ownedArtifacts = next.ownedArtifacts.filter(id => id !== artifactId);
                const art = ARTIFACT_POOL.find(a => a.id === artifactId);
                addLog(`[授与] ${adv.name} に遺物『${art.name}』を授与しました。`, "info");
            } else {
                adv.equippedArtifactId = null;
                addLog(`[回収] ${adv.name} から遺物を回収しました。`, "info");
            }
            return next;
        });
    };

    const acceptQuest = (quest) => {
        if (gameState.activeQuests.some(q => q.id === quest.id)) return;
        setGameState(prev => {
            addLog(`[受注] クエスト『${quest.name}』を受注しました。${quest.deposit > 0 ? `前金 ${quest.deposit}G を受領しました。` : ''}`, "info");
            return {
                ...prev,
                budget: prev.budget + quest.deposit,
                activeQuests: [...prev.activeQuests, quest],
                availableQuests: prev.availableQuests.filter(q => q.id !== quest.id)
            };
        });
    };

    const openSpecialRequestModal = () => {
        setReqParty([]);
        setReqModalOpen(true);
    };

    const handleToggleReqParty = (adv) => {
        if (adv.loyalty < 30) {
            addLog(`[警告] ${adv.name}は忠誠度が低いため、指名依頼への参加を拒否しました！`, "warning");
            return;
        }
        setReqParty(prev => {
            const isSelected = prev.includes(adv.id);
            if (isSelected) return prev.filter(id => id !== adv.id);
            if (prev.length >= 5) return prev;
            return [...prev, adv.id];
        });
    };

    const executeSpecialRequest = () => {
        if (reqParty.length === 0) return;

        const req = gameState.specialRequest;
        setReqModalOpen(false);
        setActionModal({ type: 'action_quest', phase: 'searching', message: `精鋭部隊を編成し、\n『${req.name}』の任務へ出撃している...` });

        setTimeout(() => {
            setGameState(prev => {
                const { total: power } = calculatePartyPower(reqParty, prev);
                const winRate = Math.min(95, Math.floor((power / req.powerReq) * 80));
                const isSuccess = Math.random() * 100 < winRate;
                
                let next = { ...prev };
                if (isSuccess) {
                    next.budget += req.reward;
                    if (req.fameBonus) next.fame += req.fameBonus;
                    if (req.notorietyBonus) next.notoriety += req.notorietyBonus;
                    addLog(`[指名依頼] 『${req.name}』の任務に見事成功！報酬 ${req.reward}Gを獲得！`, "success");
                    setTimeout(() => {
                        setActionModal({ type: 'action_quest', phase: 'result', message: `任務成功！\n\n見事な戦いぶりで依頼を完遂し、\n報酬 ${req.reward}G を獲得した！` });
                        setTimeout(() => setActionModal(null), 3500);
                    }, 0);
                } else {
                    if (req.fameBonus) next.fame = Math.max(0, next.fame - req.fameBonus);
                    addLog(`[指名依頼] 『${req.name}』の任務は失敗に終わりました...名声が低下しました。`, "danger");
                    
                    let victimMsg = "";
                    if (reqParty.length > 0) {
                        let victimId = reqParty[Math.floor(Math.random() * reqParty.length)];
                        let victim = next.adventurers.find(a => a.id === victimId);
                        victim.power = Math.max(1, Math.floor(victim.power * 0.8));
                        victim.loyalty -= 15;
                        addLog(`[負傷] ${victim.name} が特別任務中に深手を負いました。`, "warning");
                        victimMsg = `\n\n激しい戦闘の末、\n${victim.name} が深手を負ってしまった...`;
                    }
                    
                    setTimeout(() => {
                        setActionModal({ type: 'action_quest', phase: 'result', message: `任務失敗...\n\n依頼は達成できず、\nギルドの名声に傷がついた。${victimMsg}` });
                        setTimeout(() => setActionModal(null), 4000);
                    }, 0);
                }
                next.specialRequest = null;
                return next;
            });
        }, 2000);
    };

    const declineSpecialRequest = () => {
        setGameState(prev => {
            addLog(`[指名依頼] 『${prev.specialRequest.name}』の依頼を丁重に断りました。`, "normal");
            return { ...prev, specialRequest: null };
        });
    };

    const requestAlliance = (rivalId) => {
        const cost = 1000;
        if (gameState.budget < cost) return addLog(`[警告] 交渉資金が不足しています。（必要: ${cost}G）`, "warning");

        const targetName = gameState.rivals.find(r => r.id === rivalId)?.name;
        setActionModal({ type: 'action_alliance', phase: 'searching', message: `使者を送り、\n『${targetName}』に共闘の盟約を申し入れている...` });

        setTimeout(() => {
            setGameState(prev => {
                const next = { ...prev, budget: prev.budget - cost };
                const rival = next.rivals.find(r => r.id === rivalId);

                const successProb = 0.2 + (next.fame / 300) + (rival.relation / 150);
                const isSuccess = Math.random() < successProb;

                if (isSuccess) {
                    next.allianceRequests = { ...next.allianceRequests, [rivalId]: 'accepted' };
                    next.rivals = next.rivals.map(r => r.id === rivalId ? { ...r, relation: Math.min(100, r.relation + 20) } : r);
                    addLog(`[同盟成立] ${rival.name} が共闘の要請に応じました！彼らの戦力が加算されます。`, "success");
                    setTimeout(() => {
                        setActionModal({ type: 'action_alliance', phase: 'result', message: `同盟成立！\n\n『${rival.name}』が共闘の要請に応じ、\n彼らの戦力が加算される！` });
                        setTimeout(() => setActionModal(null), 3500);
                    }, 0);
                } else {
                    next.allianceRequests = { ...next.allianceRequests, [rivalId]: 'rejected' };
                    next.rivals = next.rivals.map(r => r.id === rivalId ? { ...r, relation: Math.max(0, r.relation - 10) } : r);
                    addLog(`[同盟拒否] ${rival.name} に要請をすげなく断られました。交渉決裂で関係が少し悪化しました...`, "danger");
                    setTimeout(() => {
                        setActionModal({ type: 'action_alliance', phase: 'result', message: `同盟拒否...\n\n要請はすげなく断られ、\n交渉は決裂した。` });
                        setTimeout(() => setActionModal(null), 3500);
                    }, 0);
                }
                return next;
            });
        }, 2000);
    };

    const fightBoss = () => {
        let nextState = { ...gameState, turn: gameState.turn + 1, adventurers: [...gameState.adventurers.map(a => ({ ...a, history: [...(a.history || [])] }))] };
        let summaryItems = [];
        let year = Math.floor(gameState.turn / 4) + 1;
        let season = SEASONS[gameState.turn % 4];

        addLog(`--- 🚨 厄災討伐戦 【${nextState.activeBoss.name}】 ---`, "danger");

        let finalPowerBase = nextState.adventurers.reduce((sum, a) => {
            let p = a.power;
            if (a.equippedArtifactId) {
                const art = ARTIFACT_POOL.find(art => art.id === a.equippedArtifactId);
                if (art) p += art.powerBonus;
            }
            return sum + p;
        }, 0);

        let allyPower = 0;
        Object.keys(nextState.allianceRequests).forEach(rId => {
            if (nextState.allianceRequests[rId] === 'accepted') {
                const rival = nextState.rivals.find(r => r.id === rId);
                if (rival) allyPower += rival.power;
            }
        });

        let finalPower = finalPowerBase + allyPower;
        let winRate = Math.min(95, Math.floor((finalPower / nextState.activeBoss.power) * 100));
        let isSuccess = (Math.random() * 100) <= winRate;

        if (isSuccess) {
            addLog(`[討伐成功] ${nextState.activeBoss.name}の討伐に成功しました！`, "success");
            summaryItems.push({ type: 'hero', text: `【厄災討伐成功】\n凄絶な戦いの末、${nextState.activeBoss.name}を討ち果たしました！` });

            let myReward = nextState.activeBoss.reward;
            let allyCount = Object.values(nextState.allianceRequests).filter(v => v === 'accepted').length;
            if (allyCount > 0) {
                myReward = Math.floor(myReward / (allyCount + 1));
                summaryItems.push({ type: 'info', text: `共闘した他ギルドと報酬を分配し、${myReward}G を獲得しました。` });
                if (!nextState.unlockedAchievements.includes('coop')) {
                    nextState.unlockedAchievements.push('coop');
                    summaryItems.push({ type: 'event', text: `🏆 実績解除: 呉越同舟` });
                }
                nextState.rivals = nextState.rivals.map(r =>
                    nextState.allianceRequests[r.id] === 'accepted' ? { ...r, relation: Math.min(100, r.relation + 30) } : r
                );
            } else {
                summaryItems.push({ type: 'finance', text: `報酬 ${myReward}G を独占しました！` });
            }
            nextState.budget += myReward;
            nextState.fame += 50;

            const availableArtifacts = ARTIFACT_POOL.filter(art =>
                !nextState.ownedArtifacts.includes(art.id) &&
                !nextState.adventurers.some(a => a.equippedArtifactId === art.id)
            );
            if (availableArtifacts.length > 0) {
                let drop = availableArtifacts[Math.floor(Math.random() * availableArtifacts.length)];
                nextState.ownedArtifacts.push(drop.id);
                addLog(`[発掘] 厄災の残骸から古代の遺物『${drop.name}』を発見しました！`, "info");
                summaryItems.push({ type: 'hero', text: `【遺物発見】\n厄災の残骸から古代の遺物『${drop.name}』を発見しました！` });
            }

            if (!nextState.unlockedAchievements.includes(nextState.activeBoss.id)) {
                nextState.unlockedAchievements.push(nextState.activeBoss.id);
                summaryItems.push({ type: 'event', text: `🏆 実績解除: ${ACHIEVEMENTS.find(a => a.id === nextState.activeBoss.id)?.name}` });
            }
        } else {
            addLog(`[討伐失敗] ${nextState.activeBoss.name}の前に敗北しました...甚大な被害が出ています。`, "danger");
            summaryItems.push({ type: 'fail', text: `【厄災討伐失敗】\n我々の力は及びませんでした。街は破壊され、ギルドにも甚大な被害が出ています。` });

            nextState.fame = Math.max(0, nextState.fame - 50);
            nextState.budget -= Math.floor(nextState.budget * 0.5);

            const survivors = [];
            nextState.adventurers.forEach(adv => {
                if (Math.random() < 0.4) {
                    summaryItems.push({ type: 'death', text: `${adv.name} が厄災との戦いで散りました...` });
                    nextState.mainParty = nextState.mainParty.filter(id => id !== adv.id);
                    if (adv.equippedArtifactId) nextState.ownedArtifacts.push(adv.equippedArtifactId);
                } else {
                    adv.power = Math.max(1, Math.floor(adv.power * 0.7));
                    adv.loyalty -= 30;
                    adv.history.unshift(`第 ${year} 暦 【${season}】: 厄災との戦いで重傷を負う。生き延びただけ幸運だった。`);
                    survivors.push(adv);
                }
            });
            nextState.adventurers = survivors;
        }

        nextState.rivals = nextState.rivals.map(r => ({ ...r, power: r.power + Math.floor(Math.random() * 40) + 10 }));
        nextState.activeBoss = null;
        nextState.allianceRequests = {};

        checkAchievements(nextState, summaryItems);

        if (nextState.turn >= MAX_TURNS) {
            nextState.gameOver = true; nextState.endType = "TIME_UP";
        } else if (nextState.budget < -5000) {
            nextState.gameOver = true; nextState.endType = "BANKRUPT";
        } else if (nextState.adventurers.length === 0 && nextState.budget < 1000) {
            nextState.gameOver = true; nextState.endType = "RUIN";
        }

        setQuarterResult({
            year, season, items: summaryItems,
            budget: nextState.budget, fame: nextState.fame, notoriety: nextState.notoriety,
            isGameOver: nextState.gameOver
        });
        setGameState(nextState);
        setCurrentView('home');
        GeminiAudio.playBGM('home');
    };

    const processTurn = () => {
        if (gameState.gameOver) return;
        GeminiAudio.playSE('click');

        setGameState(prev => {
            try {
                let next = { 
                    ...prev, 
                    turn: prev.turn + 1,
                    adventurers: prev.adventurers.map(a => ({ ...a, history: [...(a.history || [])] })),
                    rivals: prev.rivals.map(r => ({ ...r, members: (r.members || []).map(m => ({...m, history: [...(m.history || [])]})) })),
                    activeQuests: prev.activeQuests.map(q => ({ ...q })),
                    availableQuests: prev.availableQuests.map(q => ({ ...q })),
                    discoveredDungeons: prev.discoveredDungeons.map(d => ({ ...d })),
                    clearedDungeons: [...prev.clearedDungeons],
                    ownedArtifacts: [...prev.ownedArtifacts],
                    allianceRequests: { ...prev.allianceRequests }
                };

                let year = Math.floor(prev.turn / 4) + 1;
                let season = SEASONS[prev.turn % 4];
                let summaryItems = [];

                addLog(`--- 📜 第 ${year} 暦 【${season}】 報告 ---`, "info");
                next.currentRumor = RUMORS[Math.floor(Math.random() * RUMORS.length)];

                if (next.receptionist.type === 'diplomat') {
                    next.rivals = next.rivals.map(r => ({ ...r, relation: Math.min(100, r.relation + 3) }));
                    next.fame += 1;
                }

                const active = [...next.activeQuests];
                next.activeQuests = [];
                active.forEach(q => {
                    const { total: partyPower } = calculatePartyPower(next.mainParty, next);
                    let pSuccess = Math.floor((partyPower / q.powerReq) * 80);
                    pSuccess = Math.min(95, Math.max(5, pSuccess));
                    
                    if (Math.random() * 100 < pSuccess) {
                        const guildCut = Math.floor(q.reward * 0.4);
                        next.budget += guildCut;
                        next.townFavor = Math.min(100, next.townFavor + 5);
                        next.fame += 2;
                        addLog(`[クエスト達成] 『${q.name}』を完遂。利益 ${guildCut}G を獲得しました。`, "success");
                        summaryItems.push({ type: 'success', text: `【クエスト達成】\n『${q.name}』を達成しました！\nギルド利益: ${guildCut}G / 街の友好度が上昇しました。` });
                        
                        next.adventurers.filter(a => next.mainParty.includes(a.id)).forEach(a => {
                            a.power += 2;
                            a.loyalty = Math.min(100, a.loyalty + 5);
                            a.history.unshift(`第 ${year} 暦 【${season}】: 依頼『${q.name}』を達成。`);
                        });
                    } else {
                        if (q.turnLimit > 1) {
                            next.activeQuests.push({ ...q, turnLimit: q.turnLimit - 1 });
                        } else {
                            addLog(`[不履行] 『${q.name}』は失敗。街の信頼を失いました。`, "danger");
                            next.townFavor = Math.max(0, next.townFavor - 15);
                            summaryItems.push({ type: 'fail', text: `【クエスト失敗】\n『${q.name}』を達成できず、期限が切れました。` });
                        }
                    }
                });

                let activeEvent = null;
                if (Math.random() < 0.25) {
                    const r = Math.random();
                    if (r < 0.25) activeEvent = { type: 'MONSTER_STAMPEDE', name: '魔物スタンピード', desc: '治安維持報酬倍増。' };
                    else if (r < 0.5) activeEvent = { type: 'WAR', name: '隣国との戦端', desc: '軍事介入報酬絶大。死亡率上昇。' };
                    else if (r < 0.75) activeEvent = { type: 'RECESSION', name: '大不況', desc: '商業収入半減。' };
                    else activeEvent = { type: 'BOOM', name: '空前の好景気', desc: '商業収入倍増。' };
                    summaryItems.push({ type: 'event', text: `【世界情勢】${activeEvent.name}\n${activeEvent.desc}` });
                }
                next.currentEvent = activeEvent;

                let newQuests = [];
                const questCount = 3 + Math.floor(next.townFavor / 30);
                for (let i = 0; i < questCount; i++) {
                    newQuests.push(generateQuest(next.turn, next.townFavor));
                }
                next.availableQuests = newQuests;

                if (!next.specialRequest && Math.random() < 0.15) {
                    const req = SPECIAL_REQUESTS[Math.floor(Math.random() * SPECIAL_REQUESTS.length)];
                    next.specialRequest = req;
                    summaryItems.push({ type: 'accent', text: `【指名依頼】『${req.name}』が届きました。` });
                }

                const report = getFinancialReport(prev);
                let finalCommerce = report.commerceIncome;
                if (activeEvent?.type === 'BOOM') finalCommerce *= 2;
                if (activeEvent?.type === 'RECESSION') finalCommerce = Math.floor(finalCommerce / 2);

                next.budget -= report.totalExpense;
                next.budget += (report.choresIncome + finalCommerce);

                summaryItems.push({ 
                    type: 'finance', 
                    text: `【収支報告】\n支出: -${report.totalExpense}G / 収入: +${report.choresIncome + finalCommerce}G\n今季純収支: ${report.choresIncome + finalCommerce - report.totalExpense}G` 
                });

                if (next.budget < 0) {
                    next.adventurers.forEach(a => a.loyalty -= (a.trait.id === 'loyal' ? 5 : 20));
                    summaryItems.push({ type: 'danger', text: `金庫が空です！給与未払いで不満が高まっています。` });
                }

                const myDefInt = getDefenseIntelligence(next);
                next.rivals = next.rivals.map(rival => {
                    let r = { ...rival };
                    if (Math.random() < 0.15 && r.relation < 80) {
                        if (Math.random() * 100 > myDefInt) {
                            if (r.style === 'military') {
                                let vIdx = Math.floor(Math.random() * next.adventurers.length);
                                if (next.adventurers[vIdx]) {
                                    next.adventurers[vIdx].power = Math.max(1, Math.floor(next.adventurers[vIdx].power * 0.8));
                                    summaryItems.push({ type: 'danger', text: `【敵襲】『${r.name}』の襲撃で ${next.adventurers[vIdx].name} が負傷。` });
                                }
                            } else if (r.style === 'commerce') {
                                let loss = Math.floor(Math.random() * 400) + 100;
                                next.budget -= loss;
                                summaryItems.push({ type: 'warning', text: `【妨害】『${r.name}』との競争で ${loss}G 損失。` });
                            }
                        }
                    }
                    r.power += Math.floor(25 + next.turn * 1.2);
                    return r;
                });

                next.adventurers.forEach(a => a.age += 0.25);
                const retirees = next.adventurers.filter(a => a.age >= 40 && Math.random() < (a.age - 39) * 0.1);
                retirees.forEach(a => {
                    summaryItems.push({ type: 'info', text: `【引退】${a.name} が勇退。` });
                    if (a.equippedArtifactId) next.ownedArtifacts.push(a.equippedArtifactId);
                });
                next.adventurers = next.adventurers.filter(a => !retirees.some(r => r.id === a.id));
                next.mainParty = next.mainParty.filter(id => !retirees.some(r => r.id === id));

                if (next.adventurers.length < next.facilities.residence * 5) {
                    if (Math.random() * 100 < (next.fame / 5 + 20)) {
                        let newAdv = generateAdventurer(next.fame, next.notoriety, next.usedNames, null, false);
                        next.adventurers.push(newAdv);
                        next.usedNames.push(newAdv.name);
                        summaryItems.push({ type: 'join', text: `新冒険者 ${newAdv.name} が加入。` });
                    }
                }

                if (next.mainParty.length > 0 && !next.targetDungeon) {
                    let roll = Math.random() * 100;
                    let cumulative = 0;
                    let qType = 'safety';
                    for (let a of ALIGNMENTS) {
                        cumulative += next.alignment[a];
                        if (roll <= cumulative) { qType = a; break; }
                    }
                    if (qType !== 'commerce') {
                        const { total: pPower } = calculatePartyPower(next.mainParty, next);
                        let pSucc = Math.min(95, Math.max(5, Math.floor((pPower / (30 + next.turn * 4)) * 100)));
                        if (Math.random() * 100 < pSucc) {
                            let rew = Math.floor(300 + next.turn * 20);
                            next.budget += rew;
                            summaryItems.push({ type: 'success', text: `遠征任務成功: +${rew}G` });
                            next.adventurers.filter(a => next.mainParty.includes(a.id)).forEach(a => a.power += next.facilities.training);
                        }
                    }
                }

                if (next.targetDungeon) {
                    const dungeon = DUNGEON_POOL.find(d => d.id === next.targetDungeon);
                    const { total: pPower } = calculatePartyPower(next.mainParty, next);
                    let pSucc = Math.min(95, Math.max(5, Math.floor((pPower / dungeon.powerReq) * 80)));
                    if (Math.random() * 100 < pSucc) {
                        next.budget += dungeon.reward;
                        next.clearedDungeons.push(dungeon.id);
                        next.discoveredDungeons = next.discoveredDungeons.filter(d => d.id !== dungeon.id);
                        summaryItems.push({ type: 'hero', text: `【迷宮攻略成功】\n『${dungeon.name}』を制覇！報酬 ${dungeon.reward}G を獲得！` });
                        if (Math.random() < 0.4) {
                            const availableArtifacts = ARTIFACT_POOL.filter(art => 
                                !next.ownedArtifacts.includes(art.id) && 
                                !next.adventurers.some(a => a.equippedArtifactId === art.id)
                            );
                            if (availableArtifacts.length > 0) {
                                let drop = availableArtifacts[Math.floor(Math.random() * availableArtifacts.length)];
                                next.ownedArtifacts.push(drop.id);
                                summaryItems.push({ type: 'hero', text: `【遺物発見】奥地で『${drop.name}』を発見しました！` });
                            }
                        }
                    } else {
                        summaryItems.push({ type: 'fail', text: `【迷宮攻略失敗】『${dungeon.name}』の最奥には届きませんでした...` });
                    }
                    next.targetDungeon = null;
                }

                if (next.turn >= MAX_TURNS) { next.gameOver = true; next.endType = "TIME_UP"; }
                if (next.budget < -5000) { next.gameOver = true; next.endType = "BANKRUPT"; }
                if (BOSS_DATA[next.turn]) {
                    next.activeBoss = { ...BOSS_DATA[next.turn] };
                    summaryItems.push({ type: 'danger', text: `【警告】厄災『${next.activeBoss.name}』接近中！` });
                    GeminiAudio.playBGM('boss');
                }

                checkAchievements(next, summaryItems);

                setQuarterResult({ year, season, items: summaryItems, budget: next.budget, fame: next.fame, notoriety: next.notoriety, isGameOver: next.gameOver });
                setSelectedCandidate(null);
                return next;
            } catch (err) {
                console.error("Turn processing error:", err);
                return prev;
            }
        });
    };

    const checkAchievements = (state, summaryItems) => {
        const unlocks = [...state.unlockedAchievements];
        const check = (id, condition) => {
            if (!unlocks.includes(id) && condition) {
                unlocks.push(id);
                const ach = ACHIEVEMENTS.find(a => a.id === id);
                if (ach) {
                    summaryItems.push({ type: 'event', text: `🏆 実績解除: ${ach.name}` });
                    addLog(`🏆 実績解除: ${ach.name}`, "success");
                }
            }
        };

        check('rich', state.budget >= 10000);
        check('famous', state.fame >= 100);
        check('notorious', state.notoriety >= 100);
        const { total: mainPower } = calculatePartyPower(state.mainParty, state);
        check('army', mainPower >= 1000);

        state.unlockedAchievements = unlocks;
    };

    const getFinancialReport = (state = gameState) => {
        const salaries = (state.adventurers || []).reduce((sum, a) => sum + (a.salary || 0), 0) + (state.receptionist?.salary || 0);
        const baseMaintenance = (state.facilities?.residence || 1) * 100 + (state.facilities?.tavern || 1) * 50 + (state.facilities?.training || 1) * 50;
        
        let discount = Math.min(0.5, (state.shops?.itemShop || 0) * 0.1);
        if (state.receptionist?.type === 'merchant') discount = Math.min(0.5, discount + 0.1);
        if (state.masterSkills?.business > 0) discount = Math.min(0.8, discount + (state.masterSkills.business * 0.1));
        const maintenance = Math.floor(baseMaintenance * (1 - discount));

        let reserveBase = 20;
        if (state.masterSkills?.business > 0) reserveBase += (state.masterSkills.business * 10);
        const choresIncome = ((state.adventurers?.length || 0) - (state.mainParty?.length || 0)) * reserveBase;
        
        let commerceIncome = Math.floor((state.facilities?.tavern || 1) * 300 * ((state.alignment?.commerce || 25) / 25));
        if (state.masterSkills?.business > 0) commerceIncome = Math.floor(commerceIncome * (1 + state.masterSkills.business * 0.2));
        
        const totalIncome = choresIncome + commerceIncome;
        const totalExpense = salaries + maintenance;
        
        return { salaries, maintenance, choresIncome, commerceIncome, totalIncome, totalExpense, balance: totalIncome - totalExpense };
    };

    const getReputationText = () => {
        if (gameState.fame > 100 && gameState.notoriety < 20) return "街の住人から絶大な信頼を寄せられる、誇り高き英雄の集団として讃えられています。";
        if (gameState.notoriety > 100 && gameState.fame < 50) return "裏社会を牛耳る悪名高い暗黒組織として、人々から恐れられています。";
        if (gameState.fame > 100 && gameState.notoriety > 100) return "清濁併せ呑む強大な派閥として、権力者すら畏怖する存在です。";
        return "数あるギルドの一つとして、日々堅実に依頼をこなし街に溶け込んでいます。";
    };

    const sellGuild = () => {
        if (window.confirm("ギルドの権利書を商会に売り渡し、冒険の第一線から退きますか？（ゲーム終了）")) {
            let facilityValue = gameState.facilities.residence * 1000 + gameState.facilities.tavern * 1500 + gameState.facilities.training * 2000;
            let multiplier = Math.max(0.1, 1 + (gameState.fame - gameState.notoriety) / 100);
            let saleValue = Math.floor((Math.max(0, gameState.budget) + facilityValue) * multiplier);
            setGameState(prev => ({ ...prev, gameOver: true, endType: "SELL", endData: saleValue }));
        }
    };

    const usurpThrone = () => {
        const { total: currentPartyPower } = calculatePartyPower(gameState.mainParty, gameState);
        if (currentPartyPower < 1000) return addLog("[無謀] 王城を落とすには現在の主力部隊の戦力がまるで足りません！（推定戦力1000以上必要）", "danger");

        let successRate = Math.min(95, (currentPartyPower / 2000) * 100);
        if (Math.random() * 100 < successRate) setGameState(prev => ({ ...prev, gameOver: true, endType: "USURP_WIN" }));
        else setGameState(prev => ({ ...prev, gameOver: true, endType: "USURP_LOSE" }));
    };

    const getSummaryIcon = (type) => {
        const { AlertTriangle, Coins, Skull, Activity, CheckCircle2, Crown, LogOut, UserPlus, Star, ArrowRight } = window.LucideReact;
        switch (type) {
            case 'event': return html`<${AlertTriangle} className="w-5 h-5 text-amber-600" />`;
            case 'finance': return html`<${Coins} className="w-5 h-5 text-stone-500" />`;
            case 'danger': return html`<${Skull} className="w-5 h-5 text-rose-700" />`;
            case 'warning': return html`<${AlertTriangle} className="w-5 h-5 text-amber-500" />`;
            case 'info': return html`<${Activity} className="w-5 h-5 text-indigo-500" />`;
            case 'success': return html`<${CheckCircle2} className="w-5 h-5 text-emerald-600" />`;
            case 'hero': return html`<${Crown} className="w-5 h-5 text-amber-500" />`;
            case 'fail': return html`<${Skull} className="w-5 h-5 text-rose-800" />`;
            case 'death': return html`<${Skull} className="w-5 h-5 text-rose-900" />`;
            case 'injury': return html`<${Activity} className="w-5 h-5 text-rose-500" />`;
            case 'leave': return html`<${LogOut} className="w-5 h-5 text-rose-600" />`;
            case 'join': return html`<${UserPlus} className="w-5 h-5 text-indigo-600" />`;
            case 'accent': return html`<${Star} className="w-5 h-5 text-amber-500" />`;
            default: return html`<${ArrowRight} className="w-5 h-5 text-stone-400" />`;
        }
    };

    if (!isLoaded) return html`<div className="min-h-screen bg-stone-900 flex items-center justify-center text-white">Loading...</div>`;

    const { total: currentGuildPower } = calculatePartyPower(gameState.mainParty, gameState);
    const { Home, ScrollText, Users, Activity: ActivityIcon, Compass, Dumbbell, ShoppingBag, EyeOff, Crown: CrownIcon, Trophy, BookOpen, Flame, Volume2, VolumeX, ArrowRight: ArrowRightIcon, Target: TargetIcon, RotateCcw, Coins: CoinsIcon, ChevronRight, Skull: SkullIcon, Swords } = window.LucideReact;

    const NavButton = ({ id, label, icon: Icon, alert }) => {
        const isActive = currentView === id;
        return html`
            <button
                onClick=${() => { setCurrentView(id); GeminiAudio.playSE('click'); }}
                className=${`w-full flex items-center gap-3 px-4 py-3 text-left font-bold transition-all border-l-4 ${isActive ? 'bg-[#E8E0D5] border-amber-600 text-amber-800 shadow-inner' : 'bg-transparent border-transparent text-stone-600 hover:bg-[#F2E8C6] hover:text-stone-800'}`}
            >
                <${Icon} className=${`w-5 h-5 ${isActive ? 'text-amber-600' : alert ? 'text-rose-500 animate-pulse' : 'text-stone-400'}`} />
                ${label}
                ${alert && html`<span className="w-2 h-2 bg-rose-500 rounded-full animate-ping ml-1" />`}
                <${ChevronRight} className=${`w-4 h-4 ml-auto transition-transform ${isActive ? 'opacity-100 translate-x-1 text-amber-600' : 'opacity-0'}`} />
            </button>
        `;
    };

    const renderView = () => {
        const props = { html, gameState, setGameState, addLog, currentGuildPower, currentYear, currentSeason, getReputationText, getFinancialReport, hireReceptionist, setSelectedCandidate, selectedCandidate, openSpecialRequestModal, declineSpecialRequest, acceptQuest, autoAssembleParty, searchAdventurer, setSelectedAdv, updateAlignment, investFacility, investShop, sabotageRival, headhuntRival, gatherIntelligence, getIntrigueChance, upgradeSkill, requestAlliance, fightBoss, canUsurp, sellGuild, usurpThrone, resetGame, logs, logsEndRef, calculatePartyPower };
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

    const bgMap = {
        home: 'assets/images/title_bg.png',
        roster: 'assets/images/bg_barracks.png',
        alignment: 'assets/images/bg_barracks.png',
        dungeons: 'assets/images/bg_dungeon.png',
        facilities: 'assets/images/bg_market.png',
        shops: 'assets/images/bg_market.png',
        intrigue: 'assets/images/bg_shadow.png',
        skills: 'assets/images/bg_throne.png',
        decision: 'assets/images/bg_throne.png',
        achievements: 'assets/images/title_bg.png',
        logs: 'assets/images/title_bg.png',
        boss: 'assets/images/bg_dungeon.png'
    };
    const currentBg = bgMap[currentView] || 'assets/images/title_bg.png';

    return html`
        <div className="min-h-screen text-stone-800 font-serif flex flex-col selection:bg-amber-200 overflow-hidden">
            ${currentView !== 'title' && html`
                <>
                    <div className="game-bg-container">
                        <img src=${currentBg} className="game-bg-img" alt="" />
                    </div>
                    <div className="game-bg-overlay"></div>
                </>
            `}

            ${currentView === 'title' ? html`
                <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden bg-stone-900">
                    <img src="assets/images/title_bg.png" className="absolute inset-0 w-full h-full object-cover opacity-80" alt="" />
                    <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[2px]"></div>
                    <div className="relative z-10 flex flex-col items-center text-center p-10 bg-stone-900/60 backdrop-blur-sm border-2 border-[#D4C3A3] rounded-sm shadow-2xl max-w-xl w-full title-fade-in">
                        <${CrownIcon} className="w-16 h-16 text-amber-400 mb-4 drop-shadow-lg" />
                        <h1 className="text-5xl md:text-6xl font-bold tracking-[0.2em] text-[#F2E8C6] mb-3 title-text-glow">GUILD MASTER</h1>
                        <p className="text-amber-100/80 font-medium mb-10 tracking-widest">英雄の叙事詩は、ここから始まる</p>
                        <div className="w-full space-y-4">
                            ${hasSaveData && html`
                                <button onClick=${() => { setCurrentView('home'); GeminiAudio.init(); GeminiAudio.playBGM(gameState.activeBoss ? 'boss' : 'home'); }} className="w-full bg-indigo-700 hover:bg-indigo-600 text-white py-4 rounded-sm font-bold text-xl shadow-lg border border-indigo-900 transition-all hover:scale-[1.02] active:scale-95 flex justify-center items-center gap-2">
                                    <${RotateCcw} className="w-5 h-5" /> 続きから始める
                                </button>
                            `}
                            <button onClick=${startNewGame} className="w-full bg-amber-700 hover:bg-amber-600 text-white py-4 rounded-sm font-bold text-xl shadow-lg border border-amber-900 transition-all hover:scale-[1.02] active:scale-95 flex justify-center items-center gap-2">
                                <${Swords} className="w-5 h-5" /> 新たな歴史を紡ぐ
                            </button>
                            <button onClick=${() => setShowHowToPlay(true)} className="w-full bg-stone-700 hover:bg-stone-600 text-white py-4 rounded-sm font-bold text-xl shadow-lg border border-stone-900 transition-all hover:scale-[1.02] active:scale-95 flex justify-center items-center gap-2">
                                <${BookOpen} className="w-5 h-5" /> 遊び方
                            </button>
                        </div>
                    </div>
                </div>
            ` : html`
                <>
                    <header className="bg-stone-900 text-[#E8E0D5] border-b-4 border-[#3A322C] px-6 py-4 flex items-center justify-between shrink-0 shadow-md relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="bg-amber-600 p-2 rounded shadow-inner border border-amber-500">
                                <${TargetIcon} className="w-6 h-6 text-amber-50" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-widest text-[#F2E8C6] drop-shadow-sm">GUILD MASTER</h1>
                                <p className="text-sm text-stone-400 font-medium tracking-wider">
                                    第 ${currentYear} 暦 【${currentSeason}】 / 残り ${MAX_TURNS - gameState.turn} 刻
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick=${toggleMute}
                            className=${`p-3 rounded-full transition-all active:scale-95 ${isMuted ? 'bg-stone-700 text-stone-400' : 'bg-amber-700 text-amber-50 shadow-[0_0_15px_rgba(180,130,0,0.4)]'}`}
                            title=${isMuted ? "音声を有効にする" : "ミュートにする"}
                        >
                            ${isMuted ? html`<${VolumeX} className="w-6 h-6" />` : html`<${Volume2} className="w-6 h-6" />`}
                        </button>
                    </header>

                    <main className="flex-1 overflow-hidden flex flex-col md:flex-row p-4 gap-6 max-w-7xl mx-auto w-full relative z-10">
                        <div className="w-full md:w-72 flex flex-col shrink-0 gap-4 overflow-y-auto pr-1">
                            <div className="bg-stone-800 glass-panel-dark rounded-sm shadow-md border-2 border-[#D4C3A3] p-5 text-[#E8E0D5]">
                                <h2 className="text-xs font-bold text-stone-400 tracking-widest mb-4 flex items-center gap-2 border-b border-stone-700 pb-2">
                                    <${TargetIcon} className="w-4 h-4" /> ギルドの威信
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-stone-300 font-bold text-sm flex items-center gap-1.5"><${CoinsIcon} className="w-4 h-4 text-amber-400" /> 金庫</span>
                                        <span className=${`font-bold text-lg ${gameState.budget < 0 ? 'text-rose-500' : 'text-amber-400 drop-shadow-sm'}`}>${gameState.budget.toLocaleString()} G</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-stone-300 font-bold text-sm">名声</span>
                                        <span className="font-bold text-lg text-indigo-300">${gameState.fame}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-stone-300 font-bold text-sm">悪名</span>
                                        <span className="font-bold text-lg text-rose-400">${gameState.notoriety}</span>
                                    </div>
                                    <div className="pt-3 border-t border-stone-700 flex justify-between items-center">
                                        <span className="text-stone-100 font-bold text-sm">現在推定戦力</span>
                                        <span className="font-bold text-2xl text-amber-500 drop-shadow-md">${currentGuildPower}</span>
                                    </div>
                                </div>
                            </div>

                            <nav className="bg-[#FAF8F5] glass-panel rounded-sm shadow-md border border-[#D4C3A3] overflow-hidden flex flex-col">
                                <${NavButton} id="home" label="ギルド本部" icon=${Home} alert=${!!gameState.specialRequest} />
                                <${NavButton} id="quests" label="依頼掲示板" icon=${ScrollText} alert=${gameState.availableQuests.length > 0} />
                                <${NavButton} id="roster" label="所属冒険者名簿" icon=${Users} />
                                <${NavButton} id="alignment" label="運営方針" icon=${ActivityIcon} />
                                <${NavButton} id="dungeons" label="未踏の迷宮" icon=${Compass} alert=${gameState.discoveredDungeons.length > 0 && !gameState.targetDungeon} />
                                <${NavButton} id="facilities" label="施設拡張" icon=${Dumbbell} />
                                <${NavButton} id="shops" label="外部提携" icon=${ShoppingBag} />
                                <${NavButton} id="intrigue" label="諜報・裏工作" icon=${EyeOff} />
                                <${NavButton} id="skills" label="マスターの才能" icon=${CrownIcon} />
                                <${NavButton} id="achievements" label="実績一覧" icon=${Trophy} />
                                <${NavButton} id="logs" label="活動日誌" icon=${BookOpen} />
                                <div className="border-t border-[#D4C3A3]">
                                    <${NavButton} id="decision" label="大いなる決断" icon=${CrownIcon} />
                                </div>
                            </nav>

                            ${gameState.activeBoss ? html`
                                <button onClick=${() => setCurrentView('boss')} className="w-full bg-rose-900 hover:bg-rose-800 text-rose-50 px-6 py-4 rounded-sm font-bold text-lg transition-colors shadow-lg border border-rose-950 flex justify-center items-center gap-2 animate-pulse active:scale-95">
                                    <${Flame} className="w-5 h-5" /> 厄災迎撃戦へ
                                </button>
                            ` : html`
                                <button onClick=${processTurn} className="w-full bg-indigo-900 hover:bg-indigo-800 text-indigo-50 px-6 py-4 rounded-sm font-bold text-lg transition-colors shadow-lg border border-indigo-950 flex justify-center items-center gap-2 active:scale-95">
                                    季節を進める <${ArrowRightIcon} className="w-5 h-5" />
                                </button>
                            `}
                        </div>

                        <div className="flex-1 flex flex-col bg-[#FAF8F5] glass-panel rounded-sm shadow-md border border-[#D4C3A3] overflow-hidden min-h-[500px]">
                            <div className="bg-[#E8E0D5] border-b border-[#D4C3A3] px-6 py-4 flex items-center gap-3 shrink-0">
                                <h2 className="text-lg font-bold text-stone-800 tracking-widest">${currentView.toUpperCase()}</h2>
                            </div>
                            <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
                                ${renderView()}
                            </div>
                        </div>
                    </main>
                </>
            `}

            <${ActionModal} actionModal=${actionModal} />
            <${QuarterResultModal} quarterResult=${quarterResult} getSummaryIcon=${getSummaryIcon} setQuarterResult=${setQuarterResult} setCurrentView=${setCurrentView} activeBoss=${gameState.activeBoss} />
            <${AdventurerModal} selectedAdv=${selectedAdv} setSelectedAdv=${setSelectedAdv} gameState=${gameState} fireAdventurer=${fireAdventurer} toggleMainParty=${toggleMainParty} handleEquipArtifact=${handleEquipArtifact} />
            <${SpecialRequestModal} reqModalOpen=${reqModalOpen} setReqModalOpen=${setReqModalOpen} gameState=${gameState} reqParty=${reqParty} handleToggleReqParty=${handleToggleReqParty} executeSpecialRequest=${executeSpecialRequest} calculatePartyPower=${calculatePartyPower} />
            <${HowToPlayModal} showHowToPlay=${showHowToPlay} setShowHowToPlay=${setShowHowToPlay} />
            <${EndingView} gameState=${gameState} quarterResult=${quarterResult} resetGame=${resetGame} />
        </div>
    `;
}
