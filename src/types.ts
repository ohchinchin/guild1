export type Rank = 'S' | 'A' | 'B' | 'C' | 'D' | 'E';
export type ClassName = '戦士' | '魔術師' | '盗賊' | '僧侶';

export interface AdventurerSkill {
  name: string;
  desc: string;
  revealed: boolean;
}

export interface Adventurer {
  id: string;
  name: string;
  rank: Rank;
  cls: ClassName;
  power: number;
  status: '待機中' | '任務中' | '負傷';
  imageUrl?: string;
  background?: string;
  personality?: string;
  personalityType?: string;
  skills: AdventurerSkill[];
  bonds?: Record<string, number>; // adventurerId -> level (0-100)
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  requiredPower: number;
  rewardBudget: number;
  rewardFame: number;
  rewardNotoriety: number;
  rewardTownFavor: number;
  duration: number; // turns
  status: '未受注' | '進行中' | '完了' | '失敗';
  assignedAdventurers: string[];
  chainId?: string;
  chainStep?: number;
}

export interface GameLog {
  id: string;
  turn: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'danger';
}

export interface Assistant {
  id: string;
  name: string;
  role: string;
  desc: string;
  cost: number;
  buff: string;
  isHired: boolean;
}

export interface Dungeon {
  id: string;
  name: string;
  rank: Rank;
  difficulty: number;
  progress: number;
  maxProgress: number;
  isDiscovered: boolean;
  assignedAdventurers: string[];
  clearedCount: number;
  lastClearedTurn?: number;
  baseReward: number;
  imageUrl?: string;
}

export interface Artifact {
  id: string;
  name: string;
  desc: string;
  rank: Rank;
  effect: string;
  imageUrl?: string;
}

export interface Rival {
  id: string;
  name: string;
  power: number;
  relation: number; // 0 to 100
}

export interface TurnReport {
  turn: number;
  income: number;
  fameGained: number;
  notorietyGained: number;
  completedQuests: { title: string, reward: number }[];
  failedQuests: { title: string }[];
  dungeonProgress: { name: string, progress: number }[];
  events: string[];
}

export interface HallOfFame {
  id: string;
  name: string;
  rank: Rank;
  cls: ClassName;
  finalPower: number;
  retiredTurn: number;
  imageUrl?: string;
}

export interface MasterSkill {
  id: string;
  name: string;
  desc: string;
  cost: number;
  unlocked: boolean;
  effect: string;
}

export interface DarkMarketItem {
  id: string;
  name: string;
  desc: string;
  cost: number;
  requiredNotoriety: number;
  effect: string;
  purchased: boolean;
  imageUrl?: string;
}
