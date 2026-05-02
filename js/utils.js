window.G1 = window.G1 || {};
window.G1.Utils = (() => {
    const Constants = window.G1.Constants;

    return {
        generateQuest: (turn, favor, guildPower = 0, guildFame = 0) => {
            const type = Constants.QUEST_TYPES[Math.floor(Math.random() * Constants.QUEST_TYPES.length)];
            const powerLevel = Math.floor(guildPower / 300); 
            const fameLevel = Math.floor(guildFame / 30);
            const baseLevel = Math.floor(turn / 6) + 1; 
            
            let level = Math.max(1, Math.floor((baseLevel + powerLevel + fameLevel) / 2) + Math.floor(Math.random() * 6) - 2);
            const favorBonus = 1 + (favor / 70);
            const reward = Math.floor(type.baseReward * level * favorBonus * (1 + Math.random() * 1.0));
            const deposit = Math.random() < 0.5 ? Math.floor(reward * 0.3) : 0; 
            const powerReq = Math.floor(type.baseReward * level / 2.5 * Math.pow(1.05, Math.floor(level/5))) + Math.floor(Math.random() * 300);
            const minMembers = Math.min(10, Math.max(2, Math.floor(level / 1.2) + Math.floor(Math.random() * 3)));

            const requirements = [];
            if (level > 15 && Math.random() < 0.4) {
                const reqClass = Constants.CLASSES[Math.floor(Math.random() * Constants.CLASSES.length)];
                requirements.push({ type: 'class', value: reqClass.id, name: reqClass.name });
            }
            if (level > 25 && Math.random() < 0.3) {
                requirements.push({ type: 'rank', value: 'B', name: 'Bランク以上' });
            }

            return {
                id: `quest_${Math.random().toString(36).substr(2, 9)}`,
                name: `${type.name} (Lv.${level})`,
                type: type.id,
                level, reward, deposit, powerReq, minMembers, requirements,
                desc: `${type.name}の依頼です。難易度は${level > 20 ? '極限' : level > 12 ? '非常に高い' : level > 6 ? '高い' : '普通'}です。`,
                turnLimit: Math.max(2, 5 - Math.floor(level / 15))
            };
        },

        checkQuestRequirements: (partyIds, adventurers, quest) => {
            const partyAdvs = adventurers.filter(a => partyIds.includes(a.id));
            const errors = [];
            if (partyAdvs.length < quest.minMembers) errors.push(`人員が足りません（最低${quest.minMembers}名必要）`);
            if (quest.requirements) {
                quest.requirements.forEach(req => {
                    if (req.type === 'class') {
                        if (!partyAdvs.some(a => a.advClass.id === req.value)) errors.push(`${req.name}が編成に含まれていません`);
                    }
                    if (req.type === 'rank') {
                        const minRankIdx = Constants.RANKS.indexOf(req.value);
                        if (!partyAdvs.some(a => Constants.RANKS.indexOf(a.rank) >= minRankIdx)) errors.push(`${req.name}の冒険者が含まれていません`);
                    }
                });
            }
            return errors;
        },

        generateReceptionist: (fame, notoriety, usedRepNames) => {
            let availableNames = Constants.REP_NAME_POOL.filter(n => !usedRepNames.includes(n));
            if (availableNames.length === 0) availableNames = Constants.REP_NAME_POOL;
            const baseName = availableNames[Math.floor(Math.random() * availableNames.length)];

            const REP_TYPES = [
                { type: 'normal', desc: '平凡な事務員。維持費が安く、堅実に仕事をこなす。', salaryBase: 100, hireBase: 100 },
                { type: 'recruiter', desc: '顔が広い元冒険者。有能な人材がギルドに加入しやすくなる。', salaryBase: 400, hireBase: 1000 },
                { type: 'intelligence', desc: '裏社会の顔役。他ギルドへの工作成功率と防諜能力が劇的に上がる。', salaryBase: 600, hireBase: 1500 },
                { type: 'diplomat', desc: '交渉上手な看板娘。毎季節、他ギルドとの関係性が少しずつ改善される。', salaryBase: 500, hireBase: 1200 },
                { type: 'merchant', desc: 'やり手の商人。ギルド施設の毎季節の維持費を15%削減する。', salaryBase: 400, hireBase: 1500 }
            ];

            let pool = REP_TYPES.filter(t => {
                if (t.type === 'intelligence' && notoriety < 20) return false;
                if (t.type === 'diplomat' && fame < 30) return false;
                if (t.type === 'recruiter' && fame < 20) return false;
                if (t.type === 'merchant' && fame < 10) return false;
                return true;
            });
            if (pool.length === 0) pool = [REP_TYPES[0]];
            const typeObj = pool[Math.floor(Math.random() * pool.length)];

            return {
                id: `rep_${Math.random().toString(36).substr(2, 9)}`,
                baseName: baseName,
                name: baseName,
                type: typeObj.type,
                desc: typeObj.desc,
                salary: Math.floor(typeObj.salaryBase * (0.8 + Math.random() * 0.4)),
                hireCost: Math.floor(typeObj.hireBase * (0.8 + Math.random() * 0.4))
            };
        },

        generateAdventurer: (fame, notoriety, usedNames, guildPower = 0) => {
            let availableNames = Constants.NAME_POOL.filter(n => !usedNames.includes(n));
            if (availableNames.length === 0) availableNames = Constants.NAME_POOL;
            const name = availableNames[Math.floor(Math.random() * availableNames.length)];

            const reputation = (fame || 0) + (notoriety || 0);
            const guildTier = Math.min(5, Math.floor(Math.max(guildPower / 1000, reputation / 50)));
            const tierShifts = [
                [60, 30, 9, 1, 0, 0], [30, 40, 20, 8, 2, 0], [10, 25, 40, 18, 6, 1],
                [5, 10, 30, 35, 15, 5], [1, 5, 15, 30, 35, 14], [0, 2, 8, 20, 35, 35]
            ];
            const weights = tierShifts[guildTier];
            const totalWeight = weights.reduce((s, w) => s + w, 0);
            let roll = Math.random() * totalWeight;
            let rankIdx = 0;
            for (let i = 0; i < weights.length; i++) {
                roll -= weights[i];
                if (roll <= 0) { rankIdx = i; break; }
            }

            const rank = Constants.RANKS[rankIdx];
            const RANK_STATS = [
                { powerBase: 20, powerVar: 15, salary: 60 }, { powerBase: 60, powerVar: 40, salary: 150 },
                { powerBase: 150, powerVar: 100, salary: 400 }, { powerBase: 500, powerVar: 300, salary: 1200 },
                { powerBase: 1200, powerVar: 800, salary: 3500 }, { powerBase: 3000, powerVar: 2000, salary: 10000 }
            ];
            
            let power = RANK_STATS[rankIdx].powerBase + Math.floor(Math.random() * RANK_STATS[rankIdx].powerVar);
            const advClass = Constants.CLASSES[Math.floor(Math.random() * Constants.CLASSES.length)];
            const trait = Constants.TRAITS[Math.floor(Math.random() * Constants.TRAITS.length)];
            const personality = Constants.PERSONALITIES[Math.floor(Math.random() * Constants.PERSONALITIES.length)];
            const age = Math.floor(Math.random() * 10) + 18;

            return {
                id: Math.random().toString(36).substr(2, 9),
                name, rank, advClass, trait, personality, age, power,
                loyalty: 70 + Math.floor(Math.random() * 30),
                salary: RANK_STATS[rankIdx].salary,
                status: 'idle',
                history: [`第 ${age} 歳の時、ギルドに加入した。`]
            };
        },

        calculatePartyPower: (partyIds, adventurers, alignment, masterSkills) => {
            if (partyIds.length === 0) return { total: 0, warnings: [] };
            const partyAdvs = adventurers.filter(a => partyIds.includes(a.id));
            let total = partyAdvs.reduce((sum, a) => sum + a.power, 0);
            return { total: Math.floor(total), warnings: [] };
        },

        getFinancialReport: (state) => {
            const salaries = state.adventurers.reduce((sum, a) => sum + a.salary, 0) + state.receptionist.salary;
            const fac = state.facilities;
            const maintenance = Math.floor((Math.pow(fac.residence, 1.5) * 150) + (Math.pow(fac.tavern, 1.5) * 100));
            const income = state.adventurers.filter(a => a.status === 'idle').length * 40;
            return {
                expenditure: salaries + maintenance,
                income: income,
                net: income - (salaries + maintenance)
            };
        }
    };
})();
