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
                    party.forEach(a => { a.power += Math.floor(Math.random() * 5) + 2; a.status = 'idle'; });
                } else {
                    summaryItems.push({ type: 'fail', text: `【任務失敗】${dispatch.quest.name} は失敗。` });
                    party.forEach(a => { a.status = 'idle'; });
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
            const boss = Constants.BOSS_DATA[next.turn];
            if (boss) {
                summaryItems.push({ type: 'warning', text: `【緊急事態】${boss.name} が出現！ギルドの全戦力を結集して迎え撃て！` });
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
            }
            const questCount = 4 + Math.floor(next.townFavor / 25);
            for (let i = 0; i < questCount; i++) {
                next.availableQuests.push(Utils.generateQuest(next.turn, next.townFavor, 0, next.fame));
            }

            return next;
        }
    };
})();
