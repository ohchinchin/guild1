import type { Adventurer, Quest, Rank, ClassName } from '../types';

const MALE_FIRST_NAMES = ['アルス', 'レオン', 'クロウ', 'ガレス', 'ゼクス', 'ヴォルク', 'カイン', 'シオン'];
const FEMALE_FIRST_NAMES = ['シリカ', 'マリア', 'リナ', 'エレナ', 'セーラ', 'ミーア', 'ルナ', 'アイリス'];
const LAST_NAMES = ['・レッド', '・スターク', '・ウィンター', '・ブラック', '・ライト', '・アッシュ', '・ヴェイル'];
const CLASSES: ClassName[] = ['戦士', '魔術師', '盗賊', '僧侶'];
const RANKS: Rank[] = ['E', 'D', 'C', 'B', 'A', 'S'];

const generateId = () => Math.random().toString(36).substring(2, 9);

export const generateAdventurer = (forcedRank?: Rank): Adventurer => {
  const isMale = Math.random() > 0.5;
  const firstNames = isMale ? MALE_FIRST_NAMES : FEMALE_FIRST_NAMES;
  const name = firstNames[Math.floor(Math.random() * firstNames.length)] + LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  const cls = CLASSES[Math.floor(Math.random() * CLASSES.length)];
  
  // Weights for rank generation (E is most common, S is rare)
  const rank = forcedRank || RANKS[Math.min(5, Math.floor(Math.random() * 3) + Math.floor(Math.random() * 4))];
  
  const basePower = { 'E': 10, 'D': 30, 'C': 80, 'B': 200, 'A': 500, 'S': 1200 }[rank];
  const power = basePower + Math.floor(Math.random() * (basePower * 0.2));

  // Placeholder image path based on class, gender and rank
  const classKey = cls === '戦士' ? 'warrior' : cls === '魔術師' ? 'mage' : cls === '盗賊' ? 'thief' : 'cleric';
  const genderKey = isMale ? 'm' : 'f';
  const variant = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3


  const imageUrl = `/images/adv_${classKey}_${genderKey}_${variant}.webp`;

  return {
    id: generateId(),
    name,
    rank,
    cls,
    power,
    status: '待機中',
    imageUrl
  };
};

const QUEST_TYPES = [
  // Basic Quests (Always available)
  { id: 'slay', verb: '討伐', noun: 'ゴブリンの群れ', budget: 1, fame: 1, notoriety: 0, favor: 1, desc: '街道を脅かす魔物を退治します。', minFame: 0, minNotoriety: 0 },
  { id: 'survey', verb: '調査', noun: '古の遺跡', budget: 0.8, fame: 2, notoriety: 0, favor: 0.5, desc: '失われた歴史の断片を探索します。', minFame: 0, minNotoriety: 0 },
  
  // High Fame / Favor Quests (Heroic/Official)
  { id: 'guard', verb: '護衛', noun: '王族の密使', budget: 2.2, fame: 3, notoriety: 0, favor: 2, desc: '重要人物の道中を安全に確保します。', minFame: 100, minNotoriety: 0 },
  { id: 'defend', verb: '防衛', noun: '国境の要塞', budget: 2.5, fame: 4, notoriety: 0, favor: 3, desc: '国家の盾となり、押し寄せる軍勢を退けます。', minFame: 200, minNotoriety: 0 },
  { id: 'exterminate', verb: '掃討', noun: '深淵の魔龍', budget: 4, fame: 10, notoriety: 0, favor: 5, desc: '伝説の魔龍を討ち、真の英雄の名を馳せます。', minFame: 300, minNotoriety: 0 },

  // High Notoriety Quests (Dark/Underground)
  { id: 'assassinate', verb: '暗殺', noun: '裏切り者の商人', budget: 3.5, fame: -5, notoriety: 8, favor: -2, desc: '闇の依頼です。表沙汰にはできません。', minFame: 0, minNotoriety: 20 },
  { id: 'heist', verb: '強奪', noun: '富豪の宝飾品', budget: 5, fame: -10, notoriety: 15, favor: -5, desc: '厳重な警備を突破し、至宝を奪い取ります。', minFame: 0, minNotoriety: 50 },
  { id: 'subjugate', verb: '制圧', noun: '敵対勢力の拠点', budget: 4.5, fame: -2, notoriety: 10, favor: -1, desc: '邪魔な勢力を武力で黙らせます。', minFame: 0, minNotoriety: 80 },

  // Town Favor Related
  { id: 'reclaim', verb: '奪還', noun: '盗まれた密書', budget: 1.5, fame: 1, notoriety: 1, favor: 2, desc: '訳ありの物品を秘密裏に取り戻します。', minFame: 20, minNotoriety: 0 },
  { id: 'collect', verb: '徴収', noun: '滞納した税金', budget: 2.5, fame: -1, notoriety: 3, favor: -5, desc: '強引な手段も厭わず、資金を回収します。', minFame: 0, minNotoriety: 10 },
];

export const generateQuest = (turn: number, fame: number, notoriety: number = 0, townFavor: number = 50, avgPower: number = 50): Quest => {
  // Filter quests based on guild's current standing
  const possibleTypes = QUEST_TYPES.filter(t => 
    fame >= t.minFame && notoriety >= t.minNotoriety
  );
  
  // If no specific quests match (safety fallback), use basic ones
  const finalPool = possibleTypes.length > 0 ? possibleTypes : QUEST_TYPES.slice(0, 2);
  const type = finalPool[Math.floor(Math.random() * finalPool.length)];
  
  const title = `${type.noun}の${type.verb}`;
  
  // Difficulty scales with turn and guild's power level
  const difficultyMultiplier = 1 + (turn * 0.04) + (avgPower * 0.005);
  
  // Budget is boosted by Town Favor and Guild Fame
  const favorBonus = 1 + (townFavor / 200); // Up to +50%
  const fameBonus = 1 + (fame / 500); // Up to +20% (long term)
  
  const requiredPower = Math.floor((40 + Math.random() * 60) * difficultyMultiplier);
  
  return {
    id: generateId(),
    title,
    description: type.desc,
    requiredPower,
    rewardBudget: Math.floor((120 + Math.random() * 180) * difficultyMultiplier * type.budget * favorBonus * fameBonus),
    rewardFame: Math.floor((2 + Math.random() * 4) * type.fame),
    rewardNotoriety: Math.max(0, Math.floor(Math.random() * 5 * type.notoriety)),
    rewardTownFavor: Math.floor((1 + Math.random() * 3) * type.favor),
    duration: 1 + Math.floor(Math.random() * 2), // 1-2 turns
    status: '未受注',
    assignedAdventurers: []
  };
};
