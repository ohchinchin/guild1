import type { Adventurer, Quest, Rank, ClassName } from '../types';
import { QUEST_CHAINS } from '../data/questChains';

const MALE_FIRST_NAMES = [
  'アルス', 'レオン', 'クロウ', 'ガレス', 'ゼクス', 'ヴォルク', 'カイン', 'シオン',
  'ジル', 'バルト', 'エリック', 'カイル', 'ディック', 'ハンス', 'ユーリ', 'ルーク',
  'ガイ', 'ロルフ', 'ロイ', 'セシル', 'ラウル', 'ヴァン', 'ジーク', 'フォルク'
];
const FEMALE_FIRST_NAMES = [
  'シリカ', 'マリア', 'リナ', 'エレナ', 'セーラ', 'ミーア', 'ルナ', 'アイリス',
  'ノア', 'ティア', 'フィオ', 'リーザ', 'ミル', 'サラ', 'アンナ', 'クロエ',
  'ユナ', 'メイ', 'リル', 'ラナ', 'シエル', 'ミラ', 'ベル', 'ステラ'
];
const LAST_NAMES = [
  '・レッド', '・スターク', '・ウィンター', '・ブラック', '・ライト', '・アッシュ', '・ヴェイル',
  '・グラント', '・フォース', '・ブライト', '・シャドウ', '・ストーム', '・フレイム', '・フロスト'
];
const CLASSES: ClassName[] = ['戦士', '魔術師', '盗賊', '僧侶'];
const RANKS: Rank[] = ['E', 'D', 'C', 'B', 'A', 'S'];

const generateId = () => Math.random().toString(36).substring(2, 9);

const BACKGROUNDS = [
  '没落した貴族の末裔。家名の再興を誓い、剣を取った。',
  '辺境の村の出身。飢饉で村を失い、生き残るために冒険者になった。',
  '元は王宮の衛兵。ある事件の責任を問われ、野に下った。',
  '物心ついた時から裏路地で育った孤児。生き抜く知恵だけが武器。',
  '由緒正しい修道院の出身。神の啓示を受け、人助けの旅に出た。',
  '魔法塔の落ちこぼれ。独自の理論を証明するため、実戦経験を積んでいる。',
  '異国の地から流れ着いた異邦人。故郷に帰るための路銀を稼いでいる。',
  '森に住む狩人の家系。外界の広さを知るために森を出た。'
];

const PERSONALITIES = [
  { type: '冷静', desc: '冷静沈着で、常に最善の選択を模索する。' },
  { type: '豪放', desc: '豪放磊落。細かいことは気にせず、力押しで解決するのを好む。' },
  { type: '慎重', desc: '慎重派。石橋を叩いて渡る性格で、生存率を最優先する。' },
  { type: '熱血', desc: '情熱的。困っている人を見捨てられない正義感の持ち主。' },
  { type: '打算', desc: '打算的。報酬に見合わない仕事は受けたがらない。' },
  { type: '冷静', desc: '皮肉屋だが、根は仲間思い。' },
  { type: '慎重', desc: '寡黙で、必要なこと以外は口にしない。' },
  { type: '豪放', desc: '自信家。自らの力を誇示することに喜びを感じる。' },
  { type: '献身', desc: '自己犠牲を厭わず、仲間のために尽力する。' },
  { type: '熱血', desc: '猪突猛進。一度決めたら曲げない頑固さを持つ。' }
];

const CLASS_SKILLS: Record<ClassName, { name: string, desc: string }[]> = {
  '戦士': [
    { name: '剛腕', desc: '圧倒的な筋力で敵の装甲を粉砕する。' },
    { name: '不屈の闘志', desc: '深手を負っても戦い続ける精神力。' },
    { name: '盾の壁', desc: '仲間を守るために身を挺して盾となる。' },
    { name: '重戦車', desc: '突進によって敵の陣形を崩す。' }
  ],
  '魔術師': [
    { name: '魔力増幅', desc: '一時的に魔力を高め、魔法の威力を倍増させる。' },
    { name: '賢者の知恵', desc: '敵の弱点を瞬時に見抜き、適切な魔法を選択する。' },
    { name: '障壁展開', desc: '魔法の障壁を作り、物理攻撃を防ぐ。' },
    { name: '魔力循環', desc: '周囲の魔素を吸収し、自身の魔力を回復させる。' }
  ],
  '盗賊': [
    { name: '疾風怒濤', desc: '目にも止まらぬ速さで急所を突く。' },
    { name: '隠密行動', desc: '音もなく敵の背後に忍び寄る。' },
    { name: '罠解除', desc: '複雑な仕掛けの罠を安全に無効化する。' },
    { name: '鋭い嗅覚', desc: '隠された宝物や危険を察知する。' }
  ],
  '僧侶': [
    { name: '聖なる癒やし', desc: '神の慈愛によって深い傷を癒やす。' },
    { name: '浄化の光', desc: '邪悪な呪いや毒を清める。' },
    { name: '守護の祈り', desc: '祈りによって仲間の防御力を高める。' },
    { name: '奇跡の盾', desc: '致命的な一撃を無効化する神の加護。' }
  ]
};

export const generateAdventurer = (forcedRank?: Rank, existingNames: string[] = [], fame: number = 0, townFavor: number = 50): Adventurer => {
  const isMale = Math.random() > 0.5;
  const firstNames = isMale ? MALE_FIRST_NAMES : FEMALE_FIRST_NAMES;
  
  let name = '';
  let attempts = 0;
  do {
    name = firstNames[Math.floor(Math.random() * firstNames.length)] + LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    attempts++;
  } while (existingNames.includes(name) && attempts < 50);

  const cls = CLASSES[Math.floor(Math.random() * CLASSES.length)];
  
  // Rank Generation: influenced by Town Favor (Development level)
  // Higher Town Favor increases the chance of finding higher rank adventurers
  const developmentBonus = Math.floor(townFavor / 20); // 0 to 5 bonus
  const rankRoll = Math.floor(Math.random() * 4) + Math.floor(Math.random() * 4) + developmentBonus;
  const rank = forcedRank || RANKS[Math.min(5, rankRoll)];
  
  // Power Scaling: influenced by Guild Fame (Attraction power)
  // Higher Fame attracts more experienced individuals of that rank
  const fameBonus = 1 + (fame / 1000); // Up to +50% at 500 fame, etc.
  const basePower = { 'E': 10, 'D': 30, 'C': 80, 'B': 200, 'A': 500, 'S': 1200 }[rank];
  const power = Math.floor((basePower + Math.floor(Math.random() * (basePower * 0.2))) * fameBonus);

  // Placeholder image path based on class, gender and rank
  const classKey = cls === '戦士' ? 'warrior' : cls === '魔術師' ? 'mage' : cls === '盗賊' ? 'thief' : 'cleric';
  const genderKey = isMale ? 'm' : 'f';
  const variant = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3


  const imageUrl = `${import.meta.env.BASE_URL}images/adv_${classKey}_${genderKey}_${variant}.webp`;

  // Generate flavor text and skills
  const background = BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)];
  const pObj = PERSONALITIES[Math.floor(Math.random() * PERSONALITIES.length)];
  const personality = pObj.desc;
  const personalityType = pObj.type;
  
  // Select 1-3 random skills from the class pool
  const classPool = CLASS_SKILLS[cls];
  const skillCount = Math.floor(Math.random() * 2) + 1; // 1 or 2 skills for most
  const shuffledSkills = [...classPool].sort(() => 0.5 - Math.random());
  const selectedSkills = shuffledSkills.slice(0, skillCount).map(s => ({
    ...s,
    revealed: false // Initially hidden, to be revealed by master skills or experience
  }));

  return {
    id: generateId(),
    name,
    rank,
    cls,
    power,
    status: '待機中',
    imageUrl,
    background,
    personality,
    personalityType,
    skills: selectedSkills,
    bonds: {}
  };
};

const QUEST_TYPES = [
  // Basic Quests (Always available)
  { id: 'slay', verb: '討伐', noun: 'ゴブリンの群れ', budget: 1, fame: 1, notoriety: 0, favor: 1, desc: '街道を脅かす魔物を退治します。', minFame: 0, minNotoriety: 0 },
  { id: 'survey', verb: '調査', noun: '古の遺跡', budget: 0.8, fame: 2, notoriety: 0, favor: 0.5, desc: '失われた歴史の断片を探索します。', minFame: 0, minNotoriety: 0 },
  { id: 'herb', verb: '採取', noun: '貴重な薬草', budget: 1.2, fame: 0.5, notoriety: 0, favor: 1.5, desc: '険しい山岳地帯で希少な薬草を採取します。', minFame: 0, minNotoriety: 0 },
  { id: 'mine', verb: '防衛', noun: '炭鉱の入り口', budget: 1.5, fame: 1, notoriety: 0, favor: 2, desc: '魔物の襲撃から炭鉱の労働者を守ります。', minFame: 10, minNotoriety: 0 },

  // High Fame / Favor Quests (Heroic/Official)
  { id: 'guard', verb: '護衛', noun: '王族の密使', budget: 2.2, fame: 3, notoriety: 0, favor: 2, desc: '重要人物の道中を安全に確保します。', minFame: 100, minNotoriety: 0 },
  { id: 'defend', verb: '防衛', noun: '国境の要塞', budget: 2.5, fame: 4, notoriety: 0, favor: 3, desc: '国家の盾となり、押し寄せる軍勢を退けます。', minFame: 200, minNotoriety: 0 },
  { id: 'exterminate', verb: '掃討', noun: '深淵の魔龍', budget: 4, fame: 10, notoriety: 0, favor: 5, desc: '伝説の魔龍を討ち、真の英雄の名を馳せます。', minFame: 300, minNotoriety: 0 },
  { id: 'holy', verb: '奪還', noun: '失われた聖遺物', budget: 3, fame: 8, notoriety: 0, favor: 4, desc: '異教徒に奪われた教会の至宝を取り戻します。', minFame: 250, minNotoriety: 0 },

  // High Notoriety Quests (Dark/Underground)
  { id: 'assassinate', verb: '暗殺', noun: '裏切り者の商人', budget: 3.5, fame: -5, notoriety: 8, favor: -2, desc: '闇の依頼です。表沙汰にはできません。', minFame: 0, minNotoriety: 20 },
  { id: 'heist', verb: '強奪', noun: '富豪の宝飾品', budget: 5, fame: -10, notoriety: 15, favor: -5, desc: '厳重な警備を突破し、至宝を奪い取ります。', minFame: 0, minNotoriety: 50 },
  { id: 'subjugate', verb: '制圧', noun: '敵対勢力の拠点', budget: 4.5, fame: -2, notoriety: 10, favor: -1, desc: '邪魔な勢力を武力で黙らせます。', minFame: 0, minNotoriety: 80 },
  { id: 'smuggle', verb: '密輸', noun: '禁制品の護衛', budget: 6, fame: -15, notoriety: 20, favor: -8, desc: '国境の検問を潜り抜け、ブツを運び込みます。', minFame: 0, minNotoriety: 100 },

  // Town Favor Related
  { id: 'reclaim', verb: '奪還', noun: '盗まれた密書', budget: 1.5, fame: 1, notoriety: 1, favor: 2, desc: '訳ありの物品を秘密裏に取り戻します。', minFame: 20, minNotoriety: 0 },
  { id: 'collect', verb: '徴収', noun: '滞納した税金', budget: 2.5, fame: -1, notoriety: 3, favor: -5, desc: '強引な手段も厭わず、資金を回収します。', minFame: 0, minNotoriety: 10 },
  { id: 'bridge', verb: '修繕', noun: '壊れた大橋', budget: 1.2, fame: 2, notoriety: 0, favor: 4, desc: '冒険者の腕力で橋の復旧作業を手伝います。', minFame: 50, minNotoriety: 0 },
];

export const generateQuest = (turn: number, fame: number, notoriety: number = 0, townFavor: number = 50, avgPower: number = 50): Quest => {
  // Filter quests based on guild's current standing
  const possibleTypes = QUEST_TYPES.filter(t => 
    fame >= (t.minFame || 0) && notoriety >= (t.minNotoriety || 0)
  );
  
  // If no specific quests match (safety fallback), use basic ones
  const finalPool = possibleTypes.length > 0 ? possibleTypes : QUEST_TYPES.slice(0, 2);
  const type = finalPool[Math.floor(Math.random() * finalPool.length)];
  
  const title = `${type.noun}の${type.verb}`;
  
  // Difficulty scales with turn and guild's power level
  const difficultyMultiplier = 1 + (turn * 0.05) + (avgPower * 0.006);
  
  // Budget is boosted by Town Favor and Guild Fame
  const favorBonus = 1 + (townFavor / 150); // Up to +50% more easily
  const fameBonus = 1 + (fame / 400); // Up to +30% (long term)
  
  // Rewards scale more aggressively in the late game
  const rewardMultiplier = 1 + (turn * 0.08); 
  
  const requiredPower = Math.floor((40 + Math.random() * 60) * difficultyMultiplier);
  
  return {
    id: generateId(),
    title,
    description: type.desc,
    requiredPower,
    rewardBudget: Math.floor((150 + Math.random() * 250) * rewardMultiplier * type.budget * favorBonus * fameBonus),
    rewardFame: Math.floor((3 + Math.random() * 5) * type.fame),
    rewardNotoriety: Math.max(0, Math.floor(Math.random() * 5 * type.notoriety)),
    rewardTownFavor: Math.floor((2 + Math.random() * 4) * type.favor),
    duration: 1 + Math.floor(Math.random() * 2), // 1-2 turns
    status: '未受注',
    assignedAdventurers: []
  };
};

const ASSISTANT_ROLES = [
  { role: '受付嬢', buff: 'town_favor_up', desc: '毎ターン、街の好感度を少し上昇させる。' },
  { role: '教官', buff: 'training_up', desc: '冒険者の任務成功時の成長率を1.5倍にする。' },
  { role: '裏の顔役', buff: 'notoriety_down', desc: '毎ターン、裏工作で上がった悪名をもみ消す。' },
  { role: '会計士', buff: 'upkeep_down', desc: '冒険者の維持費を20%削減する。' },
  { role: 'スカウト', buff: 'recruit_up', desc: '新たな冒険者の加入率が大幅に上昇する。' },
  { role: '商談人', buff: 'reward_up', desc: '全ての依頼の報酬金が15%上昇する。' },
  { role: '衛生兵', buff: 'injury_down', desc: '任務での負傷率を低減し、回復を早める。' },
  { role: '情報屋', buff: 'discovery_up', desc: '新たな迷宮の発見率が上昇する。' }
];

export const generateAssistant = (): any => {
  const isMale = Math.random() > 0.5;
  const firstName = isMale ? MALE_FIRST_NAMES[Math.floor(Math.random() * MALE_FIRST_NAMES.length)] : FEMALE_FIRST_NAMES[Math.floor(Math.random() * FEMALE_FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  const name = firstName + lastName;
  
  const roleInfo = ASSISTANT_ROLES[Math.floor(Math.random() * ASSISTANT_ROLES.length)];
  
  return {
    id: generateId(),
    name,
    role: roleInfo.role,
    buff: roleInfo.buff,
    desc: roleInfo.desc,
    cost: 100 + Math.floor(Math.random() * 300),
    isHired: false
  };
};

export const generateChainQuest = (chainId: string, step: number): Quest => {
  const chain = QUEST_CHAINS.find(c => c.id === chainId);
  if (!chain || !chain.steps[step]) {
    // Fallback to random quest if chain/step not found
    return generateQuest(1, 15);
  }
  
  const s = chain.steps[step];
  return {
    id: generateId(),
    title: s.title,
    description: s.description,
    requiredPower: s.requiredPower,
    rewardBudget: s.rewardBudget,
    rewardFame: s.rewardFame,
    rewardNotoriety: s.rewardNotoriety,
    rewardTownFavor: s.rewardTownFavor,
    duration: s.duration,
    status: '未受注',
    assignedAdventurers: [],
    chainId,
    chainStep: step
  };
};
