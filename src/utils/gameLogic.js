import { 
    NAME_POOL, CLASSES_DATA, TRAITS, PERSONALITIES, WEAPONS, BACKGROUNDS, RANKS,
    RIVAL_ADJS, RIVAL_NOUNS, QUEST_TYPES, REP_NAME_POOL, ARTIFACT_POOL
} from '../data/constants.js';

export const generateAdventurer = (fame, notoriety, usedNames, forcedRank = null, isRivalMember = false) => {
    let availableNames = NAME_POOL.filter(n => !usedNames.includes(n));
    if (availableNames.length === 0) availableNames = NAME_POOL;
    let name = availableNames[Math.floor(Math.random() * availableNames.length)];

    let rankIdx = 0;
    let roll = Math.random() * 100;
    let qualityBonus = (fame + notoriety) / 10;

    if (roll + qualityBonus > 95) rankIdx = 4; // A
    else if (roll + qualityBonus > 80) rankIdx = 3; // B
    else if (roll + qualityBonus > 60) rankIdx = 2; // C
    else if (roll + qualityBonus > 30) rankIdx = 1; // D
    if (fame > 200 && Math.random() < 0.05) rankIdx = 5; // S
    if (forcedRank) rankIdx = RANKS.indexOf(forcedRank);

    const rank = RANKS[rankIdx];
    
    const RANK_STATS = [
        { powerBase: 15, powerVar: 10, salary: 50 },     // E
        { powerBase: 40, powerVar: 20, salary: 120 },    // D
        { powerBase: 100, powerVar: 50, salary: 300 },   // C
        { powerBase: 300, powerVar: 150, salary: 800 },  // B
        { powerBase: 800, powerVar: 400, salary: 2000 }, // A
        { powerBase: 1500, powerVar: 1000, salary: 6000 }// S
    ];
    
    let basePower = RANK_STATS[rankIdx].powerBase + Math.floor(Math.random() * RANK_STATS[rankIdx].powerVar);
    let salary = RANK_STATS[rankIdx].salary;
    if (isRivalMember) salary = 0;

    const advClass = CLASSES_DATA[Math.floor(Math.random() * CLASSES_DATA.length)];

    let trait = TRAITS.find(t => t.id === 'normal');
    if (Math.random() < 0.5) {
        const specialTraits = TRAITS.filter(t => t.id !== 'normal');
        trait = specialTraits[Math.floor(Math.random() * specialTraits.length)];
    }

    const personality = PERSONALITIES[Math.floor(Math.random() * PERSONALITIES.length)];

    if (trait.id === 'greedy') { basePower = Math.floor(basePower * 1.3); salary = Math.floor(salary * 1.6); }
    if (trait.id === 'coward') { basePower = Math.floor(basePower * 0.7); }
    if (trait.id === 'heroic') { basePower = Math.floor(basePower * 1.1); }

    const equipment = WEAPONS[advClass.id][Math.floor(Math.random() * WEAPONS[advClass.id].length)];
    const flavor = BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)];
    const age = Math.floor(Math.random() * 6) + 16;

    return {
        id: Math.random().toString(36).substr(2, 9),
        name, rank, advClass, trait, personality, age,
        power: basePower,
        loyalty: 80 + Math.floor(Math.random() * 20),
        salary,
        equipment,
        equippedArtifactId: null,
        flavor,
        history: ['ギルドとの契約書に署名し、所属冒険者となった。']
    };
};

export const generateRival = (usedNames) => {
    const RIVAL_ARCHETYPES = [
        { id: 'giant', style: 'military', namePrefix: '黄金の', nameSuffix: '獅子団', relation: 30, rankPool: ['A', 'B', 'B', 'C', 'C'] },
        { id: 'cunning', style: 'commerce', namePrefix: '漆黒の', nameSuffix: '梟', relation: 40, rankPool: ['C', 'C', 'D', 'D', 'E'] },
        { id: 'local', style: 'safety', namePrefix: '暁の', nameSuffix: '盾', relation: 60, rankPool: ['D', 'E', 'E'] }
    ];

    const archetype = RIVAL_ARCHETYPES[Math.floor(Math.random() * RIVAL_ARCHETYPES.length)];
    const members = [];
    archetype.rankPool.forEach(forcedRank => {
        const adv = generateAdventurer(0, 0, usedNames, forcedRank, true);
        members.push(adv);
        usedNames.push(adv.name);
    });
    
    const basePower = members.reduce((sum, m) => sum + m.power, 0) + (archetype.id === 'giant' ? 1000 : 0);

    return {
        id: `rival_${Math.random().toString(36).substr(2, 9)}`,
        name: `${archetype.namePrefix}${archetype.nameSuffix}`,
        type: archetype.id,
        style: archetype.style,
        power: basePower,
        members,
        relation: archetype.relation,
        isRevealed: false
    };
};

export const generateRivals = (usedNames) => {
    const rivals = [];
    const RIVAL_ARCHETYPES = [
        { id: 'giant', style: 'military', namePrefix: '黄金の', nameSuffix: '獅子団', relation: 30, rankPool: ['A', 'B', 'B', 'C', 'C'] },
        { id: 'cunning', style: 'commerce', namePrefix: '漆黒の', nameSuffix: '梟', relation: 40, rankPool: ['C', 'C', 'D', 'D', 'E'] },
        { id: 'local', style: 'safety', namePrefix: '暁の', nameSuffix: '盾', relation: 60, rankPool: ['D', 'E', 'E'] }
    ];

    RIVAL_ARCHETYPES.forEach(archetype => {
        const members = [];
        archetype.rankPool.forEach(forcedRank => {
            const adv = generateAdventurer(0, 0, usedNames, forcedRank, true);
            members.push(adv);
            usedNames.push(adv.name);
        });
        const basePower = members.reduce((sum, m) => sum + m.power, 0) + (archetype.id === 'giant' ? 1000 : 0);

        rivals.push({
            id: `rival_${Math.random().toString(36).substr(2, 9)}`,
            name: `${archetype.namePrefix}${archetype.nameSuffix}`,
            type: archetype.id,
            style: archetype.style,
            power: basePower,
            members,
            relation: archetype.relation,
            isRevealed: false
        });
    });

    return rivals;
};

export const generateQuest = (turn, favor) => {
    const type = QUEST_TYPES[Math.floor(Math.random() * QUEST_TYPES.length)];
    const level = Math.max(1, Math.floor(turn / 10) + 1);
    const favorBonus = 1 + (favor / 200);
    const reward = Math.floor(type.baseReward * level * favorBonus);
    const deposit = Math.random() < 0.4 ? Math.floor(reward * 0.2) : 0;
    const powerReq = Math.floor(type.baseReward * level / 5) + (Math.floor(Math.random() * 50));

    return {
        id: `quest_${Math.random().toString(36).substr(2, 9)}`,
        name: `${type.name} (Lv.${level})`,
        type: type.id,
        reward,
        deposit,
        powerReq: Math.floor(powerReq),
        desc: `${type.name}の依頼です。成功すれば街からの信頼も厚くなるでしょう。`,
        turnLimit: 4
    };
};

export const generateReceptionist = (fame, notoriety, usedRepNames) => {
    let availableNames = REP_NAME_POOL.filter(n => !usedRepNames.includes(n));
    if (availableNames.length === 0) availableNames = REP_NAME_POOL;
    const baseName = availableNames[Math.floor(Math.random() * availableNames.length)];

    const REP_TYPES = [
        { type: 'normal', desc: '平凡な事務員。維持費が安く、堅実に仕事をこなす。', salaryBase: 100, hireBase: 100 },
        { type: 'recruiter', desc: '顔が広い元冒険者。有能な人材がギルドに加入しやすくなる。', salaryBase: 350, hireBase: 800 },
        { type: 'intelligence', desc: '裏社会の顔役。他ギルドへの工作成功率と防諜能力が劇的に上がる。', salaryBase: 500, hireBase: 1200 },
        { type: 'diplomat', desc: '交渉上手な看板娘。毎季節、他ギルドとの関係性が少しずつ改善される。', salaryBase: 400, hireBase: 1000 },
        { type: 'merchant', desc: 'やり手の商人。ギルド施設の毎季節の維持費を10%削減する。', salaryBase: 300, hireBase: 1000 }
    ];

    let roll = Math.random() * 100;
    const isMiracle = roll < 5;

    let pool = REP_TYPES.filter(t => {
        if (t.type === 'intelligence' && notoriety < 20) return false;
        if (t.type === 'diplomat' && fame < 30) return false;
        if (t.type === 'recruiter' && fame < 20) return false;
        if (t.type === 'merchant' && fame < 10) return false;
        return true;
    });
    if (pool.length === 0) pool = [REP_TYPES[0]];
    const typeObj = pool[Math.floor(Math.random() * pool.length)];

    let salary = Math.floor(typeObj.salaryBase * (0.8 + Math.random() * 0.4));
    let hireCost = Math.floor(typeObj.hireBase * (0.8 + Math.random() * 0.4));
    if (isMiracle) {
        salary = Math.floor(salary * 0.3);
        hireCost = Math.floor(hireCost * 0.5);
    }

    const prefix = isMiracle ? "訳ありの" : typeObj.type === 'normal' ? "新米の" : typeObj.type === 'intelligence' ? "影のある" : typeObj.type === 'merchant' ? "強欲な" : "熟練の";

    return {
        id: `rep_${Math.random().toString(36).substr(2, 9)}`,
        baseName: baseName,
        name: `${prefix}${baseName}`,
        type: typeObj.type,
        desc: typeObj.desc + (isMiracle ? " (訳あって格安で雇えるようだ)" : ""),
        salary,
        hireCost
    };
};

export const calculatePartyPower = (partyIds, state) => {
    if (partyIds.length === 0) return { total: 0, warnings: [] };

    const partyAdvs = state.adventurers.filter(a => partyIds.includes(a.id));
    let pCount = { hot: 0, cool: 0, ambitious: 0, gentle: 0 };
    partyAdvs.forEach(a => { if (pCount[a.personality.id] !== undefined) pCount[a.personality.id]++; });

    let conflictHotCool = (pCount.hot > 0 && pCount.cool > 0);
    let conflictAmbitious = (pCount.ambitious > 1);
    let warnings = [];

    if (conflictHotCool) warnings.push("熱血と冷静の対立 (戦力低下)");
    if (conflictAmbitious) warnings.push("野心家の主導権争い (全体戦力低下)");

    let total = partyAdvs.reduce((sum, a) => {
        let p = a.power;
        if (state.alignment.military > 40 && a.advClass.id === 'warrior') p *= 1.2;
        if (a.equippedArtifactId) {
            const art = ARTIFACT_POOL.find(art => art.id === a.equippedArtifactId);
            if (art) p += art.powerBonus;
        }
        if (conflictHotCool && (a.personality.id === 'hot' || a.personality.id === 'cool')) {
            p *= 0.8;
        }
        return sum + p;
    }, 0);

    if (conflictAmbitious) {
        total *= 0.9;
    }

    if (state.masterSkills.leadership > 0) {
        const bonusRates = [0, 0.1, 0.25, 0.5];
        total = Math.floor(total * (1 + bonusRates[state.masterSkills.leadership]));
    }

    return { total: Math.floor(total), warnings };
};
