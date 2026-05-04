import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Adventurer, Quest, GameLog, Assistant, Dungeon, Rival, TurnReport, HallOfFame, MasterSkill, DarkMarketItem } from '../types';
import { generateAdventurer, generateQuest } from '../logic/generators';
import { getRandomFlavor } from '../data/flavorText';

type Policy = 'balanced' | 'aggressive' | 'economic' | 'diplomatic';
type Season = 'Summer' | 'Winter';

type GameState = {
  turn: number;
  season: Season;
  budget: number;
  fame: number;
  notoriety: number;
  guildName: string;
  townFavor: number; // 0-100
  policy: Policy;
  adventurers: Adventurer[];
  hallOfFame: HallOfFame[];
  quests: Quest[];
  dungeons: Dungeon[];
  artifacts: Artifact[];
  rivals: Rival[];
  assistants: Assistant[];
  masterSkills: MasterSkill[];
  darkMarketItems: DarkMarketItem[];
  logs: GameLog[];
  facilities: { dorm: number; tavern: number; training: number; };
  shops: { smith: number; magic: number; item: number; };
  gameStatus: 'start' | 'playing' | 'ended' | 'boss_battle' | 'summary';
  lastReport: TurnReport | null;
  currentFlavor: string;
  ending: string | null;
  bossHealth?: number;
};

type GameContextType = {
  state: GameState;
  nextTurn: () => void;
  closeSummary: () => void;
  updateFlavor: (category: any, subId?: string) => void;
  dispatchQuest: (questId: string, adventurerIds: string[]) => void;
  autoAssignQuest: (questId: string) => void;
  dispatchDungeon: (dungeonId: string, adventurerIds: string[]) => void;
  recallDungeon: (dungeonId: string) => void;
  upgradeFacility: (id: keyof GameState['facilities'], cost: number) => void;
  upgradeShop: (id: keyof GameState['shops'], cost: number) => void;
  executeIntrigue: (cost: number, notoriety: number, message: string, effect?: () => void) => void;
  unlockSkill: (id: string) => void;
  buyDarkMarketItem: (id: string) => void;
  retireAdventurer: (id: string) => void;
  setPolicy: (policy: Policy) => void;
  hireAssistant: (id: string) => void;
  addLog: (message: string, type: GameLog['type']) => void;
  startGame: (loadSave: boolean) => void;
  resetGame: () => void;
  fightBoss: () => void;
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
  { id: 'dm1', name: '禁断の強化薬', desc: '全冒険者の戦力が即座に+50される', cost: 3000, requiredNotoriety: 20, effect: 'all_power_up', purchased: false },
  { id: 'dm2', name: '偽造勲章', desc: '名声が+50されるが、悪名も+10される', cost: 2000, requiredNotoriety: 30, effect: 'fame_boost', purchased: false },
  { id: 'dm3', name: '暗殺教本', desc: '工作の効果が劇的に向上する', cost: 5000, requiredNotoriety: 50, effect: 'intrigue_boost', purchased: false },
];

const initialDungeons: Dungeon[] = [
  { id: 'd1', name: 'ゴブリンの洞窟', rank: 'E', difficulty: 100, progress: 0, maxProgress: 100, isDiscovered: true, assignedAdventurers: [], clearedCount: 0, baseReward: 2000 },
  { id: 'd2', name: '霧の森', rank: 'E', difficulty: 150, progress: 0, maxProgress: 150, isDiscovered: false, assignedAdventurers: [], clearedCount: 0, baseReward: 3000 },
  { id: 'd3', name: '忘れられた地下遺跡', rank: 'D', difficulty: 300, progress: 0, maxProgress: 200, isDiscovered: false, assignedAdventurers: [], clearedCount: 0, baseReward: 5000 },
  { id: 'd4', name: '嘆きの墓所', rank: 'D', difficulty: 450, progress: 0, maxProgress: 300, isDiscovered: false, assignedAdventurers: [], clearedCount: 0, baseReward: 8000 },
  { id: 'd5', name: '灼熱の火山洞', rank: 'C', difficulty: 800, progress: 0, maxProgress: 500, isDiscovered: false, assignedAdventurers: [], clearedCount: 0, baseReward: 15000 },
  { id: 'd6', name: '水晶の回廊', rank: 'C', difficulty: 1200, progress: 0, maxProgress: 800, isDiscovered: false, assignedAdventurers: [], clearedCount: 0, baseReward: 25000 },
  { id: 'd7', name: '天空の回廊', rank: 'B', difficulty: 2500, progress: 0, maxProgress: 1500, isDiscovered: false, assignedAdventurers: [], clearedCount: 0, baseReward: 50000 },
  { id: 'd8', name: '深淵の裂け目', rank: 'B', difficulty: 4500, progress: 0, maxProgress: 2500, isDiscovered: false, assignedAdventurers: [], clearedCount: 0, baseReward: 80000 },
  { id: 'd9', name: '魔竜の巣', rank: 'A', difficulty: 10000, progress: 0, maxProgress: 5000, isDiscovered: false, assignedAdventurers: [], clearedCount: 0, baseReward: 150000 },
  { id: 'd10', name: '神々の黄昏', rank: 'S', difficulty: 25000, progress: 0, maxProgress: 10000, isDiscovered: false, assignedAdventurers: [], clearedCount: 0, baseReward: 500000 },
];

const artifactPool: Record<Rank, { name: string, desc: string }[]> = {
  'E': [
    { name: '古びた銀貨', desc: 'かつて使われていた通貨。歴史的価値がある。' },
    { name: '薬草の束', desc: '質の良い薬草。煎じて飲むと疲れが取れる。' }
  ],
  'D': [
    { name: '鈍色の小瓶', desc: '中身は空だが、微かな魔力が残っている。' },
    { name: '錆びた宝剣', desc: '手入れすればまだ使えそうな装飾剣。' }
  ],
  'C': [
    { name: '輝く魔石', desc: '純度の高い魔力を含んだ石。' },
    { name: '守護の指輪', desc: '身を守る加護が宿った指輪。' }
  ],
  'B': [
    { name: '古代の魔導書', desc: '失われた魔法の断片が記されている。' },
    { name: '龍の鱗', desc: '鉄よりも硬く、魔力を通さない鱗。' }
  ],
  'A': [
    { name: '伝説の聖杯', desc: 'あらゆる病を癒やすという伝説の器。' },
    { name: '神殺しの矢', desc: '神性を持つ存在に深手を負わせる矢。' }
  ],
  'S': [
    { name: '世界樹の種', desc: '万物の根源となる巨樹の種。' },
    { name: '時の歯車', desc: '世界の刻を刻み続けてきた謎の歯車。' }
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
  rivals: [
    { id: 'r1', name: '赤獅子団', power: 300, relation: 50 },
    { id: 'r2', name: '銀の天秤', power: 500, relation: 40 },
  ],
  assistants: [
    { id: 'a1', name: 'エルザ', role: '受付嬢', cost: 100, buff: 'town_favor_up', isHired: false },
    { id: 'a2', name: 'バルド', role: '教官', cost: 200, buff: 'training_up', isHired: false },
    { id: 'a3', name: 'シオン', role: '裏の顔役', cost: 300, buff: 'notoriety_down', isHired: false }
  ],
  masterSkills: initialSkills,
  darkMarketItems: initialDarkMarketItems,
  logs: [],
  facilities: { dorm: 1, tavern: 1, training: 1 },
  shops: { smith: 1, magic: 1, item: 1 },
  gameStatus: 'start',
  lastReport: null,
  currentFlavor: "ギルドマスターとしての新しい生活が始まる。",
  ending: null
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<GameState>(initialState);

  // Auto Save effect
  useEffect(() => {
    if (state.gameStatus === 'playing') {
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

    setState(() => ({
      ...initialState,
      gameStatus: 'playing',
      adventurers: [adv1, adv2, adv3],
      quests: [
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
    setState(prev => ({
      ...prev,
      assistants: prev.assistants.map(a => a.id === id ? { ...a, isHired: true } : a)
    }));
    addLog(`新たな補佐役を雇用した。`, 'success');
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

  const retireAdventurer = (id: string) => {
    setState(prev => {
      const adv = prev.adventurers.find(a => a.id === id);
      if (!adv) return prev;
      const entry: HallOfFame = {
        id: adv.id,
        name: adv.name,
        rank: adv.rank,
        cls: adv.cls,
        finalPower: adv.power,
        retiredTurn: prev.turn
      };
      return {
        ...prev,
        adventurers: prev.adventurers.filter(a => a.id !== id),
        hallOfFame: [entry, ...prev.hallOfFame]
      };
    });
    addLog(`伝説の冒険者が引退し、殿堂入りした。`, 'info');
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
          logs: [{ id: Math.random().toString(), turn: prev.turn, message: `【ボス討伐成功】総力戦の末、厄災を退けた！`, type: 'success' }, ...prev.logs]
        };
      } else {
        return {
          ...prev,
          gameStatus: 'ended',
          ending: '街の崩壊（ボス戦敗北）'
        };
      }
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
      const hasElza = prev.assistants.find(a => a.id === 'a1')?.isHired;
      if (hasElza) newTownFavor = Math.min(100, newTownFavor + 3);
      const hasShion = prev.assistants.find(a => a.id === 'a3')?.isHired;
      if (hasShion) newNotoriety = Math.max(0, newNotoriety - 2);
      const hasBaldo = prev.assistants.find(a => a.id === 'a2')?.isHired;
      
      // Process Quests
      const newQuests = prev.quests.map(q => {
        if (q.status === '進行中') {
          const remaining = q.duration - 1;
          if (remaining <= 0) {
            const assigned = newAdventurers.filter(a => q.assignedAdventurers.includes(a.id));
            let totalPower = assigned.reduce((sum, a) => sum + a.power, 0);
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
                const growth = (Math.floor(Math.random() * 5) + 2) * prev.facilities.training * growthBonus;
                newAdventurers[advIndex].power += Math.floor(growth);
              }
            });
            if (isSuccess) {
              let reward = q.rewardBudget * (prev.policy === 'economic' ? 1.2 : 1);
              if (isMoneySkill) reward = Math.floor(reward * 1.1);
              newBudget += reward;
              newFame = Math.max(0, newFame + q.rewardFame);
              newNotoriety = Math.max(0, newNotoriety + q.rewardNotoriety);
              newTownFavor = Math.min(100, Math.max(0, newTownFavor + q.rewardTownFavor));
              
              report.income += reward;
              report.fameGained += q.rewardFame;
              report.notorietyGained += q.rewardNotoriety;
              report.completedQuests.push({ title: q.title, reward });
              
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
          let totalPower = assigned.reduce((sum, a) => sum + a.power, 0);
          
          if (totalPower >= d.difficulty) {
            const prog = Math.floor(totalPower / 10);
            d.progress += prog;
            report.dungeonProgress.push({ name: d.name, progress: prog });
            newLogs.unshift({ id: Math.random().toString(), turn: prev.turn, message: `迷宮「${d.name}」を探索中...`, type: 'info' });
          } else {
            newLogs.unshift({ id: Math.random().toString(), turn: prev.turn, message: `迷宮「${d.name}」の探索は難航している。`, type: 'warning' });
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

            const possibleItems = artifactPool[d.rank];
            const drop = possibleItems[Math.floor(Math.random() * possibleItems.length)];
            const newArt: Artifact = {
              id: Math.random().toString(36).substring(2, 9),
              name: drop.name,
              desc: drop.desc,
              rank: d.rank,
              effect: 'none'
            };
            newArtifacts.push(newArt);

            report.events.push(`【迷宮踏破】${d.name} を攻略！ 財宝${reward}Gと「${newArt.name}」を獲得した。`);
            newLogs.unshift({ id: Math.random().toString(), turn: prev.turn, message: `【迷宮踏破】${d.name} 攻略！ ${reward}Gと${newArt.name}獲得。`, type: 'success' });
            
            assigned.forEach(a => {
              const advIndex = newAdventurers.findIndex(na => na.id === a.id);
              newAdventurers[advIndex].status = '待機中';
              newAdventurers[advIndex].power += 20;
            });
            d.assignedAdventurers = [];
            
            if (d.clearedCount === 1) {
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
      const upkeepPerHead = Math.max(2, 12 - prev.shops.item);
      let upkeep = newAdventurers.length * upkeepPerHead;
      prev.assistants.forEach(a => { if (a.isHired) upkeep += a.cost; });
      newBudget -= upkeep;
      report.income -= upkeep;

      // Random Recruitment
      const maxPop = prev.facilities.dorm * 5;
      if (newAdventurers.length < maxPop && Math.random() > (prev.policy === 'aggressive' ? 0.4 : 0.6)) {
        const newAdv = generateAdventurer(undefined, newAdventurers.map(a => a.name));
        newAdventurers.push(newAdv);
        report.events.push(`新たな冒険者 ${newAdv.name} が加入した。`);
        newLogs.unshift({ id: Math.random().toString(), turn: prev.turn, message: `新たな冒険者 ${newAdv.name} が加入した。`, type: 'info' });
      }

      while (newQuests.filter(q => q.status === '未受注').length < (prev.townFavor > 70 ? 4 : 3)) {
        newQuests.push(generateQuest(newTurn, newFame));
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

      // Boss Event Check
      if (newTurn === 10 || newTurn === 30 || newTurn === 50) {
        return {
          ...prev, turn: newTurn, season: newSeason, budget: newBudget, fame: newFame, notoriety: newNotoriety, townFavor: newTownFavor, quests: newQuests, adventurers: newAdventurers, dungeons: newDungeons, artifacts: newArtifacts, logs: newLogs.slice(0, 50),
          gameStatus: 'boss_battle', lastReport: report, currentFlavor: flavor
        };
      }

      // Final Ending Check
      if (newTurn > 50) {
        let ending = "辺境の古参ギルド";
        if (newBudget < 0) ending = "ギルド破産（ゲームオーバー）";
        else if (newBudget >= 100000) ending = "巨大複合商会（経済的勝利）";
        else if (newFame >= 200) ending = "伝説のギルド（大成功）";
        else if (newNotoriety >= 100) ending = "暗黒街の支配者（裏社会勝利）";
        return { ...prev, turn: 50, gameStatus: 'ended', ending, logs: newLogs.slice(0, 50), lastReport: report, artifacts: newArtifacts };
      }

      return {
        ...prev, turn: newTurn, season: newSeason, budget: newBudget, fame: newFame, notoriety: newNotoriety, townFavor: newTownFavor, quests: newQuests, adventurers: newAdventurers, dungeons: newDungeons, artifacts: newArtifacts, logs: newLogs.slice(0, 50),
        gameStatus: 'summary', lastReport: report, currentFlavor: flavor
      };
    });
  };

  return (
    <GameContext.Provider value={{ state, nextTurn, closeSummary, updateFlavor, dispatchQuest, autoAssignQuest, dispatchDungeon, recallDungeon, upgradeFacility, upgradeShop, executeIntrigue, unlockSkill, buyDarkMarketItem, retireAdventurer, setPolicy, hireAssistant, addLog, startGame, resetGame, fightBoss }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within a GameProvider");
  return context;
};
