window.G1 = window.G1 || {};
window.G1.Engine = (() => {
    const Constants = window.G1.Constants;
    const Utils = window.G1.Utils;

    return {
        processTurn: (state) => {
            let next = JSON.parse(JSON.stringify(state));
            next.turn++;
            next.quarterResult = {
                year: Math.floor((next.turn - 1) / 4) + 1,
                season: Constants.SEASONS[(next.turn - 1) % 4],
                items: [],
                budget: next.budget,
                fame: next.fame,
                notoriety: next.notoriety,
                isGameOver: false
            };

            const summaryItems = next.quarterResult.items;

            // 1. Finance
            const report = Utils.getFinancialReport(next);
            next.budget += report.net;
            summaryItems.push({ type: 'finance', text: `【会計報告】収支: ${report.net > 0 ? '+' : ''}${report.net}G` });

            // 2. Dispatches
            const activeDispatches = [...next.dispatches];
            next.dispatches = [];
            activeDispatches.forEach(dispatch => {
                const party = next.adventurers.filter(a => dispatch.partyIds.includes(a.id));
                const powerInfo = Utils.calculatePartyPower(dispatch.partyIds, next.adventurers, next.alignment, next.masterSkills);
                const successRate = Math.min(0.95, (powerInfo.total / dispatch.quest.powerReq) * 0.8);
                const isSuccess = Math.random() < successRate;

                if (isSuccess) {
                    next.budget += dispatch.quest.reward;
                    next.fame += Math.floor(dispatch.quest.level / 2) + 1;
                    next.townFavor = Math.min(100, next.townFavor + 2);
                    summaryItems.push({ type: 'success', text: `【任務成功】${dispatch.quest.name} を完遂。` });
                    
                    party.forEach(a => { 
                        a.power += Math.floor(Math.random() * 5) + 2; 
                        a.status = 'idle'; 
                        
                        // Dynamic Trait Event (Positive)
                        if (Math.random() < 0.05 && a.trait.id === 'normal') {
                            const newTrait = Constants.TRAITS.find(t => t.id === 'heroic');
                            a.trait = newTrait;
                            next.history.push({ turn: next.turn, type: 'hero', text: `${a.name} は任務を通じて「${newTrait.name}」の素質に目覚めた！` });
                        }

                        // Artifact Drop (High level quests)
                        if (dispatch.quest.level >= 10 && Math.random() < 0.1 && !a.equippedArtifactId) {
                            const unownedArts = Constants.ARTIFACT_POOL.filter(art => !next.artifacts.includes(art.id));
                            if (unownedArts.length > 0) {
                                const drop = unownedArts[Math.floor(Math.random() * unownedArts.length)];
                                next.artifacts.push(drop.id);
                                a.equippedArtifactId = drop.id;
                                summaryItems.push({ type: 'hero', text: `【秘宝発見】${a.name} がアーティファクト「${drop.name}」を発見し、装備しました！` });
                                next.history.push({ turn: next.turn, type: 'success', text: `${a.name} が「${drop.name}」を獲得。` });
                            }
                        }
                    });
                } else {
                    summaryItems.push({ type: 'fail', text: `【任務失敗】${dispatch.quest.name} は失敗。` });
                    party.forEach(a => { 
                        a.status = 'idle'; 
                        
                        // Dynamic Trait Event (Negative)
                        if (Math.random() < 0.1 && a.trait.id === 'normal') {
                            const newTrait = Constants.TRAITS.find(t => t.id === 'coward');
                            a.trait = newTrait;
                            next.history.push({ turn: next.turn, type: 'warning', text: `${a.name} は失敗のトラウマから「${newTrait.name}」になってしまった…` });
                        }
                    });
                }
            });

            // 3. Dungeon Competition
            if (Math.random() < (0.15 + next.alignment.adventure * 0.01)) {
                const undiscovered = Constants.DUNGEON_POOL.filter(d => !next.discoveredDungeons.some(dd => dd.id === d.id));
                if (undiscovered.length > 0) {
                    const newD = undiscovered[Math.floor(Math.random() * undiscovered.length)];
                    next.discoveredDungeons.push({ ...newD, progress: 0, rivals: [] });
                    summaryItems.push({ type: 'info', text: `【新発見】迷宮「${newD.name}」発見！` });
                }
            }

            next.discoveredDungeons.forEach(d => {
                if (d.progress < 100) {
                    d.progress = Math.min(100, d.progress + Math.floor(Math.random() * 10) + 2);
                    if (d.progress >= 100) summaryItems.push({ type: 'warning', text: `【先を越された】他ギルドが「${d.name}」を完全攻略。` });
                }
            });

            // 4. Boss Check
            if (next.activeBoss) {
                const boss = next.activeBoss;
                const totalPower = next.adventurers.reduce((sum, a) => sum + a.power, 0);
                const isVictory = totalPower >= boss.power;
                if (isVictory) {
                    next.budget += boss.reward;
                    next.fame += 50;
                    summaryItems.push({ type: 'hero', text: `【大勝利】${boss.name} を討伐！街の英雄として称えられました。報酬 ${boss.reward}G 獲得。` });
                } else {
                    next.budget = Math.floor(next.budget * 0.5);
                    next.fame = Math.max(0, next.fame - 100);
                    summaryItems.push({ type: 'fail', text: `【大敗北】${boss.name} の侵攻を止められず、街は大損害を受けました…` });
                }
                next.activeBoss = null; 
            }

            const nextBoss = Constants.BOSS_DATA[next.turn];
            if (nextBoss) {
                next.activeBoss = nextBoss;
                summaryItems.push({ type: 'warning', text: `【緊急事態】${nextBoss.name} が出現！ギルドの全戦力を結集して迎え撃て！` });
                next.history.push({ turn: next.turn, type: 'danger', text: `厄災「${nextBoss.name}」が街に接近中。` });
            }

            // 5. Rumors & Events Update
            if (next.turn % 2 === 0) {
                next.currentRumor = Constants.RUMORS[Math.floor(Math.random() * Constants.RUMORS.length)];
            }
            
            // Random events (Simplified)
            if (Math.random() < 0.15) {
                const events = [
                    { name: '大豊作', desc: '街が活気に満ち溢れています。商業収入が1.5倍になります。', effect: 'commerce_bonus' },
                    { name: '不穏な影', desc: '近隣で魔物の活動が活発化しています。クエストの危険度が増しています。', effect: 'risk_up' },
                    { name: '流浪の英雄', desc: '高名な冒険者が街を訪れています。人材捜索で高ランクが出やすくなります。', effect: 'recruit_bonus' }
                ];
                next.currentEvent = events[Math.floor(Math.random() * events.length)];
            } else {
                next.currentEvent = null;
            }

            // 6. Achievement Check
            Constants.ACHIEVEMENTS.forEach(ach => {
                if (next.achievements.includes(ach.id)) return;
                let unlocked = false;
                if (ach.id === 'rich' && next.budget >= 10000) unlocked = true;
                if (ach.id === 'famous' && next.fame >= 100) unlocked = true;
                if (ach.id === 'notorious' && next.notoriety >= 100) unlocked = true;
                if (unlocked) {
                    next.achievements.push(ach.id);
                    summaryItems.push({ type: 'hero', text: `【実績解除】「${ach.name}」の称号を得ました！` });
                    next.history.push({ turn: next.turn, type: 'success', text: `称号「${ach.name}」を獲得。` });
                }
            });

            // 7. Special Request Check
            if (!next.specialRequest && Math.random() < 0.25) {
                const reqs = [
                    { id: 'spec1', name: '王族の秘密護衛', powerReq: 1200, reward: 8000, desc: '王族が極秘に街を視察します。不測の事態に備え、精鋭の派遣を求められています。' },
                    { id: 'spec2', name: '古代遺跡の深層調査', powerReq: 3000, reward: 25000, desc: '突如発見された古代遺跡の最下層から、強力な魔力反応が検出されました。' },
                    { id: 'spec3', name: '隣国への親善使節', powerReq: 800, reward: 5000, desc: '隣国との関係改善のため、礼儀作法と武勇を兼ね備えた冒険者を派遣してください。' }
                ];
                next.specialRequest = reqs[Math.floor(Math.random() * reqs.length)];
                summaryItems.push({ type: 'event', text: `【重要】特殊指名依頼「${next.specialRequest.name}」が届きました！` });
            }

            // 8. Quests
            next.availableQuests = [];
            const questCount = 4 + Math.floor(next.townFavor / 25);
            for (let i = 0; i < questCount; i++) {
                next.availableQuests.push(Utils.generateQuest(next.turn, next.townFavor, 0, next.fame));
            }

            // 9. Ending Check (Turn 50)
            if (next.turn >= Constants.MAX_TURNS) {
                next.quarterResult.isGameOver = true;
                if (next.budget < 0) {
                    next.ending = 'bankrupt';
                } else if (next.fame >= 200 && next.budget >= 50000) {
                    next.ending = 'legend';
                } else if (next.notoriety >= 100) {
                    next.ending = 'shadow';
                } else if (next.budget >= 100000) {
                    next.ending = 'merchant';
                } else if (next.fame <= 20) {
                    next.ending = 'ruin';
                } else {
                    next.ending = 'normal';
                }
            }

            return next;
        }
    };
})();
