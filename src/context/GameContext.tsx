import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { GameLog, Dungeon, TurnReport, HallOfFame, MasterSkill, DarkMarketItem, Rank, Artifact, GameState, Policy, Season } from '../types';
import { generateAdventurer, generateQuest, generateAssistant } from '../logic/generators';
import { getRandomFlavor } from '../data/flavorText';
import { getRandomEvent } from '../logic/eventEngine';
import { getDungeonMaterials, SYNTHESIS_RECIPES } from '../logic/workshop';

type GameContextType = {
  state: GameState;
  nextTurn: () => void;
  closeSummary: () => void;
  updateFlavor: (category: any, subId?: string) => void;
  dispatchQuest: (questId: string, adventurerIds: string[]) => void;
  autoAssignQuest: (questId: string) => void;
  dispatchDungeon: (dungeonId: string, adventurerIds: string[]) => void;
  dispatchAllToDungeon: (dungeonId: string) => void;
  recallDungeon: (dungeonId: string) => void;
  upgradeFacility: (id: keyof GameState['facilities'], cost: number) => void;
  upgradeShop: (id: keyof GameState['shops'], cost: number) => void;
  executeIntrigue: (cost: number, notoriety: number, message: string, effect?: () => void) => void;
  unlockSkill: (id: string) => void;
  buyDarkMarketItem: (id: string) => void;
  retireAdventurer: (id: string, successorId?: string) => void;
  setPolicy: (policy: Policy) => void;
  hireAssistant: (id: string) => void;
  dismissAssistant: (id: string) => void;
  addLog: (message: string, type: GameLog['type']) => void;
  startGame: (loadSave: boolean) => void;
  resetGame: () => void;
  fightBoss: () => void;
  handleEventChoice: (choiceIndex: number) => void;
  synthesizeItem: (recipeId: string) => void;
};

const initialSkills: MasterSkill[] = [
  { id: 's1', name: 'カリスマ指揮', desc: '全冒険者の成長率が1.2倍になる', cost: 1000, unlocked: false, effect: 'growth_up' },
  { id: 's2', name: '経済的直感', desc: '依頼の報酬金が10%増加する', cost: 1500, unlocked: false, effect: 'money_up' },
  { id: 's3', name: '安全第一の陣', desc: '探索での負傷率を低減する', cost: 2000, unlocked: false, effect: 'safety_up' },
  { id: 's4', name: '裏社会のコネ', desc: '工作のコストが20%軽減される', cost: 1200, unlocked: false, effect: 'intrigue_down' },
  { id: 's5', name: '洞察の眼', desc: '冒険者の秘められたスキルを見抜く', cost: 500, unlocked: false, effect: 'reveal_skills' },
  { id: 's6', name: '情報網の構築', desc: '冒険者の詳細な素性や性格を把握する', cost: 800, unlocked: false, effect: 'reveal_details' },
];

const initialDarkMarketItems: DarkMarketItem[] = [
  { id: 'dm1', name: '禁断の強化薬', desc: '全冒険者の戦力が即座に+50される', cost: 3000, requiredNotoriety: 20, effect: 'all_power_up', purchased: false, imageUrl: `${import.meta.env.BASE_URL}images/dm1.webp` },
  { id: 'dm2', name: '偽造勲章', desc: '名声が+50されるが、悪名も+10される', cost: 2000, requiredNotoriety: 30, effect: 'fame_boost', purchased: false, imageUrl: `${import.meta.env.BASE_URL}images/dm2.webp` },
  { id: 'dm3', name: '暗殺教本', desc: '工作の効果が劇的に向上する', cost: 5000, requiredNotoriety: 50, effect: 'intrigue_boost', purchased: false, imageUrl: `${import.meta.env.BASE_URL}images/dm3.webp` },
];

const initialDungeons: Dungeon[] = [
  { id: 'd1', name: 'ゴブリンの洞窟', rank: 'E', difficulty: 100, progress: 0, maxProgress: 100, isDiscovered: true, assignedAdventurers: [], clearedCount: 0, baseReward: 2000, imageUrl: `${import.meta.env.BASE_URL}images/dungeon_d1.webp` },
  { id: 'd2', name: '霧の森', rank: 'E', difficulty: 150, progress: 0, maxProgress: 150, isDiscovered: false, assignedAdventurers: [], clearedCount: 0, baseReward: 3000, imageUrl: `${import.meta.env.BASE_URL}images/dungeon_d2.webp` },
  { id: 'd3', name: '忘れられた地下遺跡', rank: 'D', difficulty: 300, progress: 0, maxProgress: 200, isDiscovered: false, assignedAdventurers: [], clearedCount: 0, baseReward: 5000, imageUrl: `${import.meta.env.BASE_URL}images/dungeon_d3.webp` },
  { id: 'd4', name: '嘆きの墓所', rank: 'D', difficulty: 450, progress: 0, maxProgress: 300, isDiscovered: false, assignedAdventurers: [], clearedCount: 0, baseReward: 8000, imageUrl: `${import.meta.env.BASE_URL}images/dungeon_d4.webp` },
  { id: 'd5', name: '灼熱の火山洞', rank: 'C', difficulty: 800, progress: 0, maxProgress: 500, isDiscovered: false, assignedAdventurers: [], clearedCount: 0, baseReward: 15000, imageUrl: `${import.meta.env.BASE_URL}images/dungeon_d5.webp` },
  { id: 'd6', name: '水晶の回廊', rank: 'C', difficulty: 1200, progress: 0, maxProgress: 800, isDiscovered: false, assignedAdventurers: [], clearedCount: 0, baseReward: 25000, imageUrl: `${import.meta.env.BASE_URL}images/dungeon_d6.webp` },
  { id: 'd7', name: '天空の回廊', rank: 'B', difficulty: 2500, progress: 0, maxProgress: 1500, isDiscovered: false, assignedAdventurers: [], clearedCount: 0, baseReward: 50000, imageUrl: `${import.meta.env.BASE_URL}images/dungeon_d7.webp` },
  { id: 'd8', name: '深淵の裂け目', rank: 'B', difficulty: 4500, progress: 0, maxProgress: 2500, isDiscovered: false, assignedAdventurers: [], clearedCount: 0, baseReward: 80000, imageUrl: `${import.meta.env.BASE_URL}images/dungeon_d8.webp` },
  { id: 'd9', name: '魔竜の巣', rank: 'A', difficulty: 10000, progress: 0, maxProgress: 5000, isDiscovered: false, assignedAdventurers: [], clearedCount: 0, baseReward: 150000, imageUrl: `${import.meta.env.BASE_URL}images/dungeon_d9.webp` },
  { id: 'd10', name: '神々の黄昏', rank: 'S', difficulty: 25000, progress: 0, maxProgress: 10000, isDiscovered: false, assignedAdventurers: [], clearedCount: 0, baseReward: 500000, imageUrl: `${import.meta.env.BASE_URL}images/dungeon_d10.webp` },
];

const artifactPool: Record<Rank, { id: string, name: string, desc: string }[]> = {
  'E': [
    { id: 'e1', name: '古びた銀貨', desc: 'かつて使われていた通貨。歴史的価値がある。' },
    { id: 'e2', name: '薬草の束', desc: '質の良い薬草。煎じて飲むと疲れが取れる。' },
    { id: 'e3', name: '錆びた鍵', desc: 'どこのものか分からない古い鍵。' },
    { id: 'e4', name: '冒険者の日記', desc: 'かつての冒険者が遺した手記。' }
  ],
  'D': [
    { id: 'd1', name: '鈍色の小瓶', desc: '中身は空だが、微かな魔力が残っている。' },
    { id: 'd2', name: '錆びた宝剣', desc: '手入れすればまだ使えそうな装飾剣。' },
    { id: 'd3', name: '幸運の守り石', desc: '身につけていると良いことがありそうな小石。' },
    { id: 'd4', name: '壊れたコンパス', desc: '針が狂っているが、稀に真実を指すという。' }
  ],
  'C': [
    { id: 'c1', name: '輝く魔石', desc: '純度の高い魔力を含んだ石。' },
    { id: 'c2', name: '守護の指輪', desc: '身を守る加護が宿った指輪。' },
    { id: 'c3', name: '属性の指輪', desc: '特定の属性耐性を高める指輪。' },
    { id: 'c4', name: '魔力の中瓶', desc: '魔力を一時的に活性化させる液体が入った瓶。' }
  ],
  'B': [
    { id: 'b1', name: '古代の魔導書', desc: '失われた魔法の断片が記されている。' },
    { id: 'b2', name: '龍の鱗', desc: '鉄よりも硬く、魔力を通さない鱗。' },
    { id: 'b3', name: '暗黒の外套', desc: '影に溶け込むことができる不思議なマント。' },
    { id: 'b4', name: '古代の金貨', desc: '失われた帝国の通貨。純金製。' }
  ],
  'A': [
    { id: 'a1', name: '伝説の聖杯', desc: 'あらゆる病を癒やすという伝説の器。' },
    { id: 'a2', name: '神殺しの矢', desc: '神性を持つ存在に深手を負わせる矢。' },
    { id: 'a3', name: '賢者の石の欠片', desc: '不老不死の伝承を持つ石の破片。' },
    { id: 'a4', name: '流星の剣', desc: '星の欠片から鍛えられたと言われる剣。' }
  ],
  'S': [
    { id: 's1', name: '世界樹の種', desc: '万物の根源となる巨樹の種。' },
    { id: 's2', name: '時の歯車', desc: '世界の刻を刻み続けてきた謎の歯車。' },
    { id: 's3', name: '英雄の魂', desc: 'かつての英雄が遺した意志の結晶。' },
    { id: 's4', name: '運命の糸', desc: '因果の流れを操ることができるという糸。' }
  ]
};

const initialState: GameState = {
  turn: 1,
  season: 'Summer',
  budget: 2000,
  fame: 15,
  notoriety: 0,
  guildName: "深淵なる鴉",
  townFavor: 50,
  policy: 'balanced',
  adventurers: [],
  hallOfFame: [],
  quests: [],
  dungeons: initialDungeons,
  artifacts: [],
  materials: {},
  rivals: [
    { id: 'r1', name: '赤獅子団', power: 300, relation: 50 },
    { id: 'r2', name: '銀の天秤', power: 500, relation: 40 },
  ],
  assistants: [],
  hiredAssistants: [],
  masterSkills: initialSkills,
  darkMarketItems: initialDarkMarketItems,
  logs: [],
  facilities: { dorm: 1, tavern: 1, training: 1 },
  shops: { smith: 1, magic: 1, item: 1 },
  gameStatus: 'start',
  activeEvent: null,
  lastReport: null,
  currentFlavor: "ギルドマスターとしての新しい生活が始まる。",
  ending: null,
  endingAfterstory: null,
  endingImages: [],
  stats: {
    totalQuests: 0,
    totalDungeons: 0,
    totalGoldEarned: 0,
    maxAdventurerPower: 0,
    maxAdventurerName: '',
    artifactsFound: 0,
    bossDefeatedCount: 0
  }
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<GameState>(initialState);

  // Auto Save effect
  useEffect(() => {
    if (state.gameStatus === 'playing' || state.gameStatus === 'event' || state.gameStatus === 'summary') {
      localStorage.setItem('guildMasterSave', JSON.stringify(state));
    }
  }, [state]);

  const updateFlavor = useCallback((category: any, subId?: string) => {
    const flavor = getRandomFlavor(category, subId);
    if (flavor) {
      setState(prev => ({ ...prev, currentFlavor: flavor }));
    }
  }, []);

  const startGame = (loadSave: boolean) => {
    if (loadSave) {
      const saved = localStorage.getItem('guildMasterSave');
      if (saved) {
        setState(JSON.parse(saved));
        return;
      }
    }
    const adv1 = generateAdventurer('C');
    const adv2 = generateAdventurer('D', [adv1.name]);
    const adv3 = generateAdventurer('D', [adv1.name, adv2.name]);

    const initialCandidates = [generateAssistant(), generateAssistant(), generateAssistant()];

    setState(() => ({
      ...initialState,
      gameStatus: 'playing',
      adventurers: [adv1, adv2, adv3],
      assistants: initialCandidates,
      quests: [
        generateQuest(1, 15, 0, 50, 50), 
        generateQuest(1, 15, 0, 50, 50),
        generateQuest(1, 15, 0, 50, 50)
      ],
      logs: [{ id: 'init', turn: 1, message: 'ギルドマスターとして着任した。50ターンの試練が始まる。', type: 'info' }]
    }));
  };

  const addLog = (message: string, type: GameLog['type'] = 'info') => {
    setState(prev => ({
      ...prev,
      logs: [{ id: Math.random().toString(), turn: prev.turn, message, type }, ...prev.logs].slice(0, 50)
    }));
  };

  const resetGame = () => {
    localStorage.removeItem('guildMasterSave');
    setState({ ...initialState });
  };

  const setPolicy = (policy: Policy) => setState(prev => ({ ...prev, policy }));

  const hireAssistant = (id: string) => {
    setState(prev => {
      const assistant = prev.assistants.find(a => a.id === id);
      const maxAssistants = 1 + Math.floor(prev.fame / 200);
      if (!assistant || prev.hiredAssistants.length >= maxAssistants || prev.budget < assistant.cost) return prev;
      
      return {
        ...prev,
        budget: prev.budget - assistant.cost,
        assistants: prev.assistants.filter(a => a.id !== id),
        hiredAssistants: [...prev.hiredAssistants, { ...assistant, isHired: true }]
      };
    });
    addLog(`新たな補佐役を雇用した。`, 'success');
  };

  const dismissAssistant = (id: string) => {
    setState(prev => ({
      ...prev,
      hiredAssistants: prev.hiredAssistants.filter(a => a.id !== id)
    }));
    addLog(`補佐役との契約を終了した。`, 'warning');
  };

  const unlockSkill = (id: string) => {
    setState(prev => {
      const skill = prev.masterSkills.find(s => s.id === id);
      if (!skill || prev.fame < skill.cost) return prev;
      return {
        ...prev,
        fame: prev.fame - skill.cost,
        masterSkills: prev.masterSkills.map(s => s.id === id ? { ...s, unlocked: true } : s)
      };
    });
    addLog(`マスタースキルを習得した。`, 'success');
  };

  const buyDarkMarketItem = (id: string) => {
    setState(prev => {
      const item = prev.darkMarketItems.find(i => i.id === id);
      if (!item || item.purchased || prev.budget < item.cost || prev.notoriety < item.requiredNotoriety) return prev;

      let nextState = {
        ...prev,
        budget: prev.budget - item.cost,
        darkMarketItems: prev.darkMarketItems.map(i => i.id === id ? { ...i, purchased: true } : i)
      };

      // Apply effects
      if (item.effect === 'all_power_up') {
        nextState.adventurers = nextState.adventurers.map(a => ({ ...a, power: a.power + 50 }));
      } else if (item.effect === 'fame_boost') {
        nextState.fame += 50;
        nextState.notoriety += 10;
      } else if (item.effect === 'intrigue_boost') {
        // Handled in executeIntrigue
      }

      return nextState;
    });
    addLog(`闇市場で禁じられた品を手に入れた。`, 'warning');
  };

  const retireAdventurer = (id: string, successorId?: string) => {
    setState(prev => {
      const retired = prev.adventurers.find(a => a.id === id);
      if (!retired) return prev;
      
      let nextAdventurers = prev.adventurers.filter(a => a.id !== id);
      let legacyMessage = `伝説の冒険者 ${retired.name} が引退し、殿堂入りした。`;

      if (successorId) {
        const successorIndex = nextAdventurers.findIndex(a => a.id === successorId);
        if (successorIndex !== -1) {
          const successor = { ...nextAdventurers[successorIndex] };
          const powerBoost = Math.floor(retired.power * 0.2);
          successor.power += powerBoost;
          
          // Inherit a skill if retiree had any and successor has room (simplified)
          if (retired.skills.length > 0) {
            const inheritedSkill = { ...retired.skills[Math.floor(Math.random() * retired.skills.length)], revealed: true };
            successor.skills = [...successor.skills, inheritedSkill];
            legacyMessage = `${retired.name} の意志は ${successor.name} に引き継がれた！（戦力+${powerBoost}、スキル継承）`;
          } else {
            legacyMessage = `${retired.name} の経験は ${successor.name} に引き継がれた！（戦力+${powerBoost}）`;
          }
          nextAdventurers[successorIndex] = successor;
        }
      }

      const entry: HallOfFame = {
        id: retired.id,
        name: retired.name,
        rank: retired.rank,
        cls: retired.cls,
        finalPower: retired.power,
        retiredTurn: prev.turn,
        imageUrl: retired.imageUrl
      };

      addLog(legacyMessage, 'success');

      return {
        ...prev,
        adventurers: nextAdventurers,
        hallOfFame: [entry, ...prev.hallOfFame]
      };
    });
  };

  const upgradeFacility = (id: keyof GameState['facilities'], cost: number) => {
    setState(prev => ({
      ...prev,
      budget: prev.budget - cost,
      facilities: { ...prev.facilities, [id]: prev.facilities[id] + 1 }
    }));
    updateFlavor('facilities', id);
    addLog(`${id === 'dorm' ? '宿舎' : id === 'tavern' ? '酒場' : '訓練場'}をレベルアップした。`, 'success');
  };

  const upgradeShop = (id: keyof GameState['shops'], cost: number) => {
    setState(prev => ({
      ...prev,
      budget: prev.budget - cost,
      shops: { ...prev.shops, [id]: prev.shops[id] + 1 }
    }));
    addLog(`${id === 'smith' ? '鍛冶屋' : id === 'magic' ? '魔導具店' : '道具屋'}へ投資した。`, 'success');
  };

  const executeIntrigue = (cost: number, notoriety: number, message: string, effect?: () => void) => {
    setState(prev => {
      const isDiscounted = prev.masterSkills.find(s => s.id === 's4')?.unlocked;
      const isBoosted = prev.darkMarketItems.find(i => i.id === 'dm3')?.purchased;
      
      let actualCost = isDiscounted ? Math.floor(cost * 0.8) : cost;
      let actualNotoriety = isBoosted ? Math.floor(notoriety * 0.5) : notoriety;
      
      return {
        ...prev,
        budget: prev.budget - actualCost,
        notoriety: prev.notoriety + actualNotoriety
      };
    });
    updateFlavor('intrigue');
    addLog(message, 'warning');
    if (effect) effect();
  };

  const dispatchQuest = (questId: string, adventurerIds: string[]) => {
    setState(prev => {
      const newQuests = prev.quests.map(q => q.id === questId ? { ...q, status: '進行中' as const, assignedAdventurers: adventurerIds } : q);
      const newAdv = prev.adventurers.map(a => adventurerIds.includes(a.id) ? { ...a, status: '任務中' as const } : a);
      return { ...prev, quests: newQuests, adventurers: newAdv };
    });
    addLog(`依頼に${adventurerIds.length}名を派遣。`, 'info');
  };

  const autoAssignQuest = (questId: string) => {
    setState(prev => {
      const quest = prev.quests.find(q => q.id === questId);
      if (!quest) return prev;
      
      const standby = prev.adventurers.filter(a => a.status === '待機中').sort((a, b) => b.power - a.power);
      let selected: string[] = [];
      let totalPower = 0;

      for (const adv of standby) {
        selected.push(adv.id);
        totalPower += adv.power + (adv.cls === '戦士' ? prev.shops.smith * 5 : adv.cls === '魔術師' ? prev.shops.magic * 8 : 0);
        if (totalPower >= quest.requiredPower) break;
      }

      if (totalPower < quest.requiredPower) {
        addLog(`[自動編成] 推奨戦力に達する待機メンバーがいません。`, 'warning');
        return prev;
      }

      const newQuests = prev.quests.map(q => q.id === questId ? { ...q, status: '進行中' as const, assignedAdventurers: selected } : q);
      const newAdv = prev.adventurers.map(a => selected.includes(a.id) ? { ...a, status: '任務中' as const } : a);
      
      return { ...prev, quests: newQuests, adventurers: newAdv, logs: [{ id: Math.random().toString(), turn: prev.turn, message: `依頼「${quest.title}」に自動編成で派遣しました。`, type: 'info' as const }, ...prev.logs].slice(0, 50) };
    });
  };

  const dispatchDungeon = (dungeonId: string, adventurerIds: string[]) => {
    setState(prev => {
      const newDungeons = prev.dungeons.map(d => d.id === dungeonId ? { ...d, assignedAdventurers: adventurerIds } : d);
      const newAdv = prev.adventurers.map(a => adventurerIds.includes(a.id) ? { ...a, status: '任務中' as const } : a);
      return { ...prev, dungeons: newDungeons, adventurers: newAdv };
    });
    addLog(`迷宮探索に${adventurerIds.length}名を向かわせた。`, 'info');
  };

  const dispatchAllToDungeon = (dungeonId: string) => {
    setState(prev => {
      const standbyIds = prev.adventurers.filter(a => a.status === '待機中').map(a => a.id);
      if (standbyIds.length === 0) return prev;
      
      const newDungeons = prev.dungeons.map(d => d.id === dungeonId ? { ...d, assignedAdventurers: [...d.assignedAdventurers, ...standbyIds] } : d);
      const newAdv = prev.adventurers.map(a => standbyIds.includes(a.id) ? { ...a, status: '任務中' as const } : a);
      return { ...prev, dungeons: newDungeons, adventurers: newAdv };
    });
    addLog(`迷宮に待機中の全メンバーを派遣した。`, 'info');
  };

  const recallDungeon = (dungeonId: string) => {
    setState(prev => {
      const dungeon = prev.dungeons.find(d => d.id === dungeonId);
      if (!dungeon || dungeon.assignedAdventurers.length === 0) return prev;
      
      const newAdv = prev.adventurers.map(a => 
        dungeon.assignedAdventurers.includes(a.id) ? { ...a, status: '待機中' as const } : a
      );
      const newDungeons = prev.dungeons.map(d => 
        d.id === dungeonId ? { ...d, assignedAdventurers: [] } : d
      );
      
      return { ...prev, dungeons: newDungeons, adventurers: newAdv };
    });
    addLog(`迷宮から部隊を撤退させた。`, 'warning');
  };

  const fightBoss = () => {
    setState(prev => {
      let guildPower = prev.adventurers.reduce((sum, a) => sum + a.power, 0);
      const townHelp = prev.townFavor * 5;
      const rivalHelp = prev.rivals.reduce((sum, r) => sum + (r.relation > 50 ? r.power * 0.5 : 0), 0);
      const totalPower = guildPower + townHelp + rivalHelp;
      const bossPower = prev.turn === 10 ? 1000 : prev.turn === 30 ? 3000 : 8000;

      if (totalPower >= bossPower) {
        return {
          ...prev,
          gameStatus: 'playing',
          fame: prev.fame + 50,
          townFavor: Math.min(100, prev.townFavor + 20),
          stats: { ...prev.stats, bossDefeatedCount: prev.stats.bossDefeatedCount + 1 },
          logs: [{ id: Math.random().toString(), turn: prev.turn, message: `【ボス討伐成功】総力戦の末、厄災を退けた！`, type: 'success' }, ...prev.logs]
        };
      } else {
        return {
          ...prev,
          gameStatus: 'ended',
          ending: '街の崩壊（ボス戦敗北）',
          endingAfterstory: "強大な厄災の前に、ギルドの守りは脆くも崩れ去った。街は炎に包まれ、人々は散り散りになった。あなたの築いた夢は、灰の中に消えたのだ。",
          endingImages: [`https://image.pollinations.ai/prompt/${encodeURIComponent('A medieval city in ruins and flames, dark smoke rising, defeated warriors in the foreground, dark fantasy, cinematic, 8k')}?model=flux&width=1024&height=512&nologo=true`]
        };
      }
    });
  };

  const handleEventChoice = (choiceIndex: number) => {
    setState(prev => {
      if (!prev.activeEvent) return prev;
      const choice = prev.activeEvent.choices[choiceIndex];
      const nextState = choice.effect(prev);
      addLog(choice.resultMessage, prev.activeEvent.type === 'crisis' ? 'danger' : 'info');
      return { ...nextState, gameStatus: 'summary', activeEvent: null };
    });
  };

  const synthesizeItem = (recipeId: string) => {
    setState(prev => {
      const recipe = SYNTHESIS_RECIPES.find(r => r.id === recipeId);
      if (!recipe || prev.fame < recipe.requiredFame) return prev;
      
      const newMaterials = { ...prev.materials };
      for (const req of recipe.requiredMaterials) {
        if ((newMaterials[req.materialId] || 0) < req.count) return prev;
        newMaterials[req.materialId] -= req.count;
      }
      
      const newArtifact: Artifact = {
        id: recipe.rewardArtifactId,
        name: recipe.name,
        desc: recipe.desc,
        rank: 'S',
        effect: 'synthesis_reward',
        imageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(recipe.name + ', legendary artifact, glowing, high fantasy, 8k')}?model=flux&width=512&height=512&nologo=true`
      };

      addLog(`錬成成功: ${recipe.name} を手に入れた！`, 'success');
      return {
        ...prev,
        materials: newMaterials,
        artifacts: [...prev.artifacts, newArtifact],
        stats: { ...prev.stats, artifactsFound: prev.stats.artifactsFound + 1 }
      };
    });
  };

  const closeSummary = () => {
    setState(prev => ({ ...prev, gameStatus: 'playing' }));
  };

  const nextTurn = () => {
    setState(prev => {
      if (prev.gameStatus !== 'playing') return prev;

      let newBudget = prev.budget;
      let newFame = prev.fame;
      let newNotoriety = prev.notoriety;
      let newTownFavor = prev.townFavor;
      let newLogs = [...prev.logs];
      const newTurn = prev.turn + 1;
      const newSeason: Season = prev.season === 'Summer' ? 'Winter' : 'Summer';
      const newAdventurers = [...prev.adventurers];
      const newDungeons = [...prev.dungeons];
      const newMaterials = { ...prev.materials };
      let newStats = { ...prev.stats };
      
      const isMoneySkill = prev.masterSkills.find(s => s.id === 's2')?.unlocked;
      const isGrowthSkill = prev.masterSkills.find(s => s.id === 's1')?.unlocked;

      const report: TurnReport = {
        turn: prev.turn,
        income: 0,
        fameGained: 0,
        notorietyGained: 0,
        completedQuests: [],
        failedQuests: [],
        dungeonProgress: [],
        events: []
      };

      // Update max power stat
      newAdventurers.forEach(a => {
        if (a.power > newStats.maxAdventurerPower) {
          newStats.maxAdventurerPower = a.power;
          newStats.maxAdventurerName = a.name;
        }
      });

      // --- Policy Effects ---
      if (prev.policy === 'diplomatic') {
        newTownFavor = Math.min(100, newTownFavor + 2);
        report.events.push("外交政策により街の好感度が上昇した。");
      }
      if (prev.policy === 'aggressive') {
        newNotoriety += 1;
        report.notorietyGained += 1;
      }
      
      // --- Assistant Buffs ---
      const hiredBuffs = prev.hiredAssistants.map(a => a.buff);
      if (hiredBuffs.includes('town_favor_up')) newTownFavor = Math.min(100, newTownFavor + 3);
      if (hiredBuffs.includes('notoriety_down')) newNotoriety = Math.max(0, newNotoriety - 2);
      const hasBaldo = hiredBuffs.includes('training_up');
      const hasFameUp = hiredBuffs.includes('fame_up');
      const hasRewardUp = hiredBuffs.includes('reward_up');
      const hasUpkeepDown = hiredBuffs.includes('upkeep_down');
      const hasDiscoveryUp = hiredBuffs.includes('discovery_up');
      const hasRecruitUp = hiredBuffs.includes('recruit_up');

      // Assistant Rotation (Every 5 turns)
      let currentAssistants = [...prev.assistants];
      if (newTurn % 5 === 0) {
        currentAssistants = [generateAssistant(), generateAssistant(), generateAssistant()];
        report.events.push("【補佐NPC】新たな補佐候補がギルドを訪れた。");
      }
      
      // Process Quests
      const newQuests = prev.quests.map(q => {
        if (q.status === '進行中') {
          const remaining = q.duration - 1;
          if (remaining <= 0) {
            const assigned = newAdventurers.filter(a => q.assignedAdventurers.includes(a.id));
            
            // --- Bond Growth ---
            if (assigned.length > 1) {
              assigned.forEach(a1 => {
                const advIndex = newAdventurers.findIndex(na => na.id === a1.id);
                const currentBonds = { ...(newAdventurers[advIndex].bonds || {}) };
                
                assigned.forEach(a2 => {
                  if (a1.id === a2.id) return;
                  const currentLevel = currentBonds[a2.id] || 0;
                  
                  // Compatibility Bonus
                  let bonus = 5;
                  const p1 = a1.personalityType;
                  const p2 = a2.personalityType;
                  if ((p1 === '熱血' && p2 === '冷静') || (p1 === '冷静' && p2 === '熱血')) bonus += 2;
                  if ((p1 === '豪放' && p2 === '慎重') || (p1 === '慎重' && p2 === '豪放')) bonus += 2;
                  if ((p1 === '打算' && p2 === '献身') || (p1 === '献身' && p2 === '打算')) bonus += 2;

                  currentBonds[a2.id] = Math.min(100, currentLevel + bonus);
                });
                newAdventurers[advIndex].bonds = currentBonds;
              });
            }

            // Power calculation with bonds
            let totalPower = assigned.reduce((sum, a) => sum + a.power, 0);
            
            // Add Bond Bonus: (Bond Level / 100) * 10% of individual power
            assigned.forEach(a1 => {
              assigned.forEach(a2 => {
                if (a1.id === a2.id) return;
                const bondLevel = (a1.bonds || {})[a2.id] || 0;
                totalPower += Math.floor(a1.power * 0.1 * (bondLevel / 100));
              });
            });

            assigned.forEach(a => {
              if (a.cls === '戦士') totalPower += prev.shops.smith * 5;
              if (a.cls === '魔術師') totalPower += prev.shops.magic * 8;
            });
            const isSuccess = totalPower >= q.requiredPower;
            assigned.forEach(a => {
              const advIndex = newAdventurers.findIndex(na => na.id === a.id);
              newAdventurers[advIndex].status = '待機中';
              if (isSuccess) {
                const growthBonus = (isGrowthSkill ? 1.2 : 1) * (hasBaldo ? 1.5 : 1);
                // Increased base growth (from 2-6 to 5-10)
                const growth = (Math.floor(Math.random() * 6) + 5) * prev.facilities.training * growthBonus;
                newAdventurers[advIndex].power += Math.floor(growth);
              }
            });
            if (isSuccess) {
              let reward = q.rewardBudget * (prev.policy === 'economic' ? 1.2 : 1) * (hasRewardUp ? 1.15 : 1);
              if (isMoneySkill) reward = Math.floor(reward * 1.1);
              const fameGained = Math.floor(q.rewardFame * (hasFameUp ? 1.2 : 1));
              
              newBudget += reward;
              newFame = Math.max(0, newFame + fameGained);
              newNotoriety = Math.max(0, newNotoriety + q.rewardNotoriety);
              newTownFavor = Math.min(100, Math.max(0, newTownFavor + q.rewardTownFavor));
              
              report.income += reward;
              report.fameGained += fameGained;
              report.notorietyGained += q.rewardNotoriety;
              report.completedQuests.push({ title: q.title, reward });
              
              newStats.totalQuests += 1;
              newStats.totalGoldEarned += reward;

              newLogs.unshift({ id: Math.random().toString(), turn: prev.turn, message: `成功: ${q.title} (+${Math.floor(reward)}G)`, type: 'success' });
              return { ...q, status: '完了' as const };
            } else {
              newFame = Math.max(0, newFame - 5);
              newTownFavor = Math.max(0, newTownFavor - 2);
              report.failedQuests.push({ title: q.title });
              newLogs.unshift({ id: Math.random().toString(), turn: prev.turn, message: `失敗: ${q.title}`, type: 'danger' });
              return { ...q, status: '失敗' as const };
            }
          }
          return { ...q, duration: remaining };
        }
        return q;
      }).filter(q => q.status === '未受注' || q.status === '進行中');

      // Process Dungeons
      let newArtifacts = [...prev.artifacts];
      newDungeons.forEach(d => {
        if (d.assignedAdventurers.length > 0) {
          const assigned = newAdventurers.filter(a => d.assignedAdventurers.includes(a.id));
          
          // --- Bond Growth (Dungeons) ---
          if (assigned.length > 1) {
            assigned.forEach(a1 => {
              const advIndex = newAdventurers.findIndex(na => na.id === a1.id);
              const currentBonds = { ...(newAdventurers[advIndex].bonds || {}) };
              assigned.forEach(a2 => {
                if (a1.id === a2.id) return;
                const currentLevel = currentBonds[a2.id] || 0;
                let bonus = 2; // Dungeons give less per turn but are continuous
                const p1 = a1.personalityType;
                const p2 = a2.personalityType;
                if ((p1 === '熱血' && p2 === '冷静') || (p1 === '冷静' && p2 === '熱血')) bonus += 1;
                currentBonds[a2.id] = Math.min(100, currentLevel + bonus);
              });
              newAdventurers[advIndex].bonds = currentBonds;
            });
          }

          let totalPower = assigned.reduce((sum, a) => sum + a.power, 0);
          
          // Add Bond Bonus
          assigned.forEach(a1 => {
            assigned.forEach(a2 => {
              if (a1.id === a2.id) return;
              const bondLevel = (a1.bonds || {})[a2.id] || 0;
              totalPower += Math.floor(a1.power * 0.1 * (bondLevel / 100));
            });
          });
          
          if (totalPower >= d.difficulty) {
            const prog = Math.floor(totalPower / 10);
            d.progress += prog;
            report.dungeonProgress.push({ name: d.name, progress: prog });
            newLogs.unshift({ id: Math.random().toString(), turn: prev.turn, message: `迷宮「${d.name}」を探索中...`, type: 'info' });
            
            // --- Material Drop Chance per turn ---
            if (Math.random() > 0.7) {
              const mats = getDungeonMaterials(d.rank);
              const dropId = mats[Math.floor(Math.random() * mats.length)];
              const materialName = MATERIALS.find(m => m.id === dropId)?.name || dropId;
              newMaterials[dropId] = (newMaterials[dropId] || 0) + 1;
              newLogs.unshift({ id: Math.random().toString(), turn: prev.turn, message: `素材獲得: ${materialName} を発見した。`, type: 'success' });
            }
          } else {
            // Struggling Progress: even if power is low, you can make 20% progress (minimum 1)
            const prog = Math.max(1, Math.floor(totalPower / 50));
            d.progress += prog;
            report.dungeonProgress.push({ name: d.name, progress: prog });
            newLogs.unshift({ id: Math.random().toString(), turn: prev.turn, message: `迷宮「${d.name}」の探索は難航しているが、着実に前進している。`, type: 'warning' });
          }

          if (d.progress >= d.maxProgress) {
            d.progress = 0;
            d.clearedCount += 1;
            d.lastClearedTurn = prev.turn;

            const reward = Math.floor(d.baseReward * Math.pow(0.5, d.clearedCount - 1));
            const fameReward = Math.max(5, Math.floor(30 * Math.pow(0.7, d.clearedCount - 1)));
            
            newBudget += reward;
            newFame += fameReward;
            report.income += reward;
            report.fameGained += fameReward;
            
            newStats.totalDungeons += 1;
            newStats.totalGoldEarned += reward;

            const possibleItems = artifactPool[d.rank];
            const drop = possibleItems[Math.floor(Math.random() * possibleItems.length)];
            const newArt: Artifact = {
              id: Math.random().toString(36).substring(2, 9),
              name: drop.name,
              desc: drop.desc,
              rank: d.rank,
              effect: 'none',
              imageUrl: `${import.meta.env.BASE_URL}images/art_${drop.id}.webp`
            };
            newArtifacts.push(newArt);
            newStats.artifactsFound = newArtifacts.length;

            report.events.push(`【迷宮踏破】${d.name} を攻略！ 財宝${reward}Gと「${newArt.name}」を獲得した。`);
            newLogs.unshift({ id: Math.random().toString(), turn: prev.turn, message: `【迷宮踏破】${d.name} 攻略！ ${reward}Gと${newArt.name}獲得。`, type: 'success' });
            
            assigned.forEach(a => {
              const advIndex = newAdventurers.findIndex(na => na.id === a.id);
              newAdventurers[advIndex].status = '待機中';
              newAdventurers[advIndex].power += 20;
            });
            d.assignedAdventurers = [];
            
            if (d.clearedCount === 1 || (hasDiscoveryUp && Math.random() > 0.8)) {
              const nextHidden = newDungeons.find(nd => !nd.isDiscovered);
              if (nextHidden) nextHidden.isDiscovered = true;
            }
          }
        }
      });

      // Income & Upkeep
      const baseIncome = (50 * prev.facilities.tavern) + (prev.policy === 'economic' ? 100 : 0);
      newBudget += baseIncome;
      report.income += baseIncome;
      newStats.totalGoldEarned += baseIncome;

      const upkeepPerHead = Math.max(2, 12 - prev.shops.item);
      let upkeep = newAdventurers.length * upkeepPerHead;
      if (hasUpkeepDown) upkeep = Math.floor(upkeep * 0.8);
      prev.hiredAssistants.forEach(a => { upkeep += a.cost; });
      newBudget -= upkeep;
      report.income -= upkeep;

      // Random Recruitment
      const maxPop = prev.facilities.dorm * 5;
      if (newAdventurers.length < maxPop && Math.random() > (prev.policy === 'aggressive' ? 0.4 : (hasRecruitUp ? 0.3 : 0.6))) {
        const newAdv = generateAdventurer(undefined, newAdventurers.map(a => a.name), newTurn);
        newAdventurers.push(newAdv);
        report.events.push(`新たな冒険者 ${newAdv.name} が加入した。`);
        newLogs.unshift({ id: Math.random().toString(), turn: prev.turn, message: `新たな冒険者 ${newAdv.name} が加入した。`, type: 'info' });
      }

      while (newQuests.filter(q => q.status === '未受注').length < (prev.townFavor > 70 ? 4 : 3)) {
        // Average power for quest scaling
        const avgPower = newAdventurers.length > 0 
          ? newAdventurers.reduce((sum, a) => sum + a.power, 0) / newAdventurers.length 
          : 50;
        newQuests.push(generateQuest(newTurn, newFame, newNotoriety, newTownFavor, avgPower));
      }

      // Update Season Flavor
      const seasonKey = newSeason === 'Summer' ? 'summer' : 'winter';
      const seasonEvent = getRandomFlavor('seasons', seasonKey);
      
      // --- Weather / Global Event System ---
      const roll = Math.random();
      if (newSeason === 'Summer') {
        if (roll > 0.8) {
          report.events.push("【豊作祭】街がお祭りムードに包まれている！ 依頼の報酬金が1.5倍になった。");
          newBudget += 1000;
          newStats.totalGoldEarned += 1000;
        } else if (roll > 0.6) {
          report.events.push("【大干魃】厳しい暑さが続く。 冒険者の維持費が増加した。");
          newBudget -= 500;
        }
      } else {
        if (roll > 0.8) {
          report.events.push("【大寒波】猛吹雪により探索が困難に。 施設維持費が増加した。");
          newBudget -= 1000;
        } else if (roll > 0.6) {
          report.events.push("【聖夜の奇跡】冬の静かな夜、ギルドに幸運が舞い込む。 名声が上昇した。");
          newFame += 10;
        }
      }

      report.events.push(`${newSeason === 'Summer' ? '夏季' : '冬季'}が到来した。${seasonEvent}`);
      const flavor = getRandomFlavor('seasons', seasonKey);

      // --- Dynamic Event Engine Trigger ---
      const dynamicEvent = getRandomEvent(prev);

      // --- Immediate Bankruptcy Check ---
      if (newBudget < 0) {
        return { 
          ...prev, 
          turn: newTurn,
          budget: newBudget,
          gameStatus: 'ended', 
          ending: "ギルド破産（ゲームオーバー）", 
          endingAfterstory: "拡大しすぎた組織と放漫な経営が仇となり、ついに金庫は底をついた。借金取りに追われ、あなたは夜逃げ同員で街を去った。冒険者たちは散り散りになり、ギルドの看板は雨風にさらされている。",
          endingImages: [`https://image.pollinations.ai/prompt/${encodeURIComponent('A lonely abandoned guild hall, broken windows, spider webs, dust, rainy day, cinematic, dark fantasy, 8k')}?model=flux&width=1024&height=512&nologo=true`],
          logs: newLogs.slice(0, 50),
          stats: newStats,
          materials: newMaterials
        };
      }

      // Final Ending Check
      if (newTurn > 50) {
        let ending = "辺境の古参ギルド";
        let afterstory = "あなたのギルドは、歴史の荒波を乗り越え、一つの時代を築き上げた。大きな飛躍はなかったかもしれないが、着実に歩んだその足跡は、街の人々の記憶に刻まれている。";
        let images: string[] = [];

        if (newBudget < 0) {
          ending = "ギルド破産（ゲームオーバー）";
          afterstory = "拡大しすぎた組織と放漫な経営が仇となり、ついに金庫は底をついた。借金取りに追われ、あなたは夜逃げ同然で街を去った。冒険者たちは散り散りになり、ギルドの看板は雨風にさらされている。";
          images = [`https://image.pollinations.ai/prompt/${encodeURIComponent('A lonely abandoned guild hall, broken windows, spider webs, dust, rainy day, cinematic, dark fantasy, 8k')}?model=flux&width=1024&height=512&nologo=true`];
        } else if (newBudget >= 100000) {
          ending = "巨大複合商会（経済的勝利）";
          afterstory = "あなたのギルドはもはや単なる冒険者の集まりではない。大陸中の物流を支配する巨大な商会へと変貌を遂げた。黄金で装飾されたギルド本部は街の誇りとなり、あなたの名前は富の象徴として語り継がれるだろう。";
          images = [
            `https://image.pollinations.ai/prompt/${encodeURIComponent('A grand guild palace made of gold and white marble, bustling merchant market in front, wealth, sunshine, cinematic, 8k')}?model=flux&width=1024&height=512&nologo=true`,
            `https://image.pollinations.ai/prompt/${encodeURIComponent('A wealthy guild master sitting on a throne of coins and artifacts, luxury, high fantasy, 8k')}?model=flux&width=512&height=512&nologo=true`
          ];
        } else if (newFame >= 200) {
          ending = "伝説のギルド（大成功）";
          afterstory = "数々の偉業を成し遂げたあなたのギルドは、吟遊詩人によって語り継がれる伝説となった。最強の冒険者たちが集い、正義と勇気の象徴として大陸全土にその名を轟かせている。あなたの物語は、永遠に終わることはない。";
          images = [
            `https://image.pollinations.ai/prompt/${encodeURIComponent('A group of heroic adventurers standing on a mountain peak, sunset, epic scenery, high fantasy, cinematic, 8k')}?model=flux&width=1024&height=512&nologo=true`,
            `https://image.pollinations.ai/prompt/${encodeURIComponent('A grand hall filled with statues of legendary heroes, magical lights, epic atmosphere, 8k')}?model=flux&width=512&height=512&nologo=true`
          ];
        } else if (newNotoriety >= 100) {
          ending = "暗黒街の支配者（裏社会勝利）";
          afterstory = "表向きはギルドだが、その実態は大陸の影を支配する巨大な闇組織だ。政治家も王侯貴族も、あなたの意向を無視することはできない。闇市場、暗殺、裏工作……世界はあなたの手のひらの上で転がされている。";
          images = [
            `https://image.pollinations.ai/prompt/${encodeURIComponent('A dark secret chamber, hooded figures, shadows, mysterious glowing symbols, dark fantasy, cinematic, 8k')}?model=flux&width=1024&height=512&nologo=true`,
            `https://image.pollinations.ai/prompt/${encodeURIComponent('An intimidating figure in black armor looking over a dark city at night, red moon, 8k')}?model=flux&width=512&height=512&nologo=true`
          ];
        } else if (newStats.bossDefeatedCount >= 3) {
          ending = "英雄の守護者（英雄的勝利）";
          afterstory = "三度の大きな厄災から街を救ったあなたは、この国の守護聖人として崇められている。ギルドの冒険者たちは皆、人々を救う英雄として子供たちの憧れの的だ。平和な日々が続く中、あなたの功績は歴史書に黄金の文字で刻まれた。";
          images = [
            `https://image.pollinations.ai/prompt/${encodeURIComponent('A peaceful city festival, people cheering for heroes, blue sky, flower petals falling, cinematic, 8k')}?model=flux&width=1024&height=512&nologo=true`,
            `https://image.pollinations.ai/prompt/${encodeURIComponent('A heroic knight and a mage being awarded medals by the king, grand ceremony, 8k')}?model=flux&width=512&height=512&nologo=true`
          ];
        } else {
          images = [`https://image.pollinations.ai/prompt/${encodeURIComponent('A cozy guild tavern, adventurers drinking and laughing around a fireplace, evening, warm lighting, high fantasy, 8k')}?model=flux&width=1024&height=512&nologo=true`];
        }

        return { ...prev, turn: 50, gameStatus: 'ended', ending, endingAfterstory: afterstory, endingImages: images, logs: newLogs.slice(0, 50), lastReport: report, artifacts: newArtifacts, stats: newStats, materials: newMaterials };
      }

      // Boss Event Check
      if (newTurn === 10 || newTurn === 30 || newTurn === 48) {
        return {
          ...prev, turn: newTurn, season: newSeason, budget: newBudget, fame: newFame, notoriety: newNotoriety, townFavor: newTownFavor, quests: newQuests, adventurers: newAdventurers, dungeons: newDungeons, artifacts: newArtifacts, logs: newLogs.slice(0, 50),
          gameStatus: 'boss_battle', lastReport: report, currentFlavor: flavor, stats: newStats, materials: newMaterials
        };
      }

      if (dynamicEvent) {
        return {
          ...prev, turn: newTurn, season: newSeason, budget: newBudget, fame: newFame, notoriety: newNotoriety, townFavor: newTownFavor, quests: newQuests, adventurers: newAdventurers, dungeons: newDungeons, artifacts: newArtifacts, logs: newLogs.slice(0, 50),
          gameStatus: 'event', activeEvent: dynamicEvent, lastReport: report, currentFlavor: flavor, stats: newStats, materials: newMaterials
        };
      }

      return {
        ...prev, turn: newTurn, season: newSeason, budget: newBudget, fame: newFame, notoriety: newNotoriety, townFavor: newTownFavor, quests: newQuests, adventurers: newAdventurers, dungeons: newDungeons, artifacts: newArtifacts, logs: newLogs.slice(0, 50),
        gameStatus: 'summary', lastReport: report, currentFlavor: flavor, assistants: currentAssistants, stats: newStats, materials: newMaterials
      };
    });
  };

  return (
    <GameContext.Provider value={{ state, nextTurn, closeSummary, updateFlavor, dispatchQuest, autoAssignQuest, dispatchDungeon, dispatchAllToDungeon, recallDungeon, upgradeFacility, upgradeShop, executeIntrigue, unlockSkill, buyDarkMarketItem, retireAdventurer, setPolicy, hireAssistant, dismissAssistant, addLog, startGame, resetGame, fightBoss, handleEventChoice, synthesizeItem }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within a GameProvider");
  return context;
};
