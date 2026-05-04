export interface ChainStep {
  title: string;
  description: string;
  requiredPower: number;
  rewardBudget: number;
  rewardFame: number;
  rewardNotoriety: number;
  rewardTownFavor: number;
  duration: number;
}

export interface QuestChain {
  id: string;
  steps: ChainStep[];
}

export const QUEST_CHAINS: QuestChain[] = [
  {
    id: 'goblin_threat',
    steps: [
      { title: 'ゴブリンの偵察', description: '村の近くで目撃されたゴブリンを調査します。', requiredPower: 50, rewardBudget: 500, rewardFame: 5, rewardNotoriety: 0, rewardTownFavor: 5, duration: 1 },
      { title: 'ゴブリンの拠点強襲', description: '判明したゴブリンの洞窟を叩きます。', requiredPower: 150, rewardBudget: 1500, rewardFame: 15, rewardNotoriety: 0, rewardTownFavor: 10, duration: 1 },
      { title: 'ゴブリンキングの討伐', description: '群れを率いるキングを討ち、地域の安全を確保します。', requiredPower: 500, rewardBudget: 5000, rewardFame: 50, rewardNotoriety: 0, rewardTownFavor: 20, duration: 2 },
    ]
  },
  {
    id: 'merchant_conspiracy',
    steps: [
      { title: '不審な荷物の追跡', description: '闇市場に流れる禁制品の出処を追います。', requiredPower: 100, rewardBudget: 800, rewardFame: 2, rewardNotoriety: 5, rewardTownFavor: -2, duration: 1 },
      { title: '悪徳商人の摘発', description: '証拠を固め、商人の邸宅を強制捜査します。', requiredPower: 300, rewardBudget: 2500, rewardFame: 20, rewardNotoriety: 10, rewardTownFavor: 15, duration: 1 },
      { title: '巨大組織との決別', description: '背後にいた黒幕とのコネクションを断ち切ります。', requiredPower: 800, rewardBudget: 10000, rewardFame: 50, rewardNotoriety: 30, rewardTownFavor: 10, duration: 2 },
    ]
  },
  {
    id: 'lost_civilization',
    steps: [
      { title: '古文書の解読', description: '古代文明の場所を示す古文書を解読します。', requiredPower: 80, rewardBudget: 400, rewardFame: 10, rewardNotoriety: 0, rewardTownFavor: 2, duration: 1 },
      { title: '遺跡の封印解除', description: '遺跡の入り口を守る魔法の封印を解きます。', requiredPower: 250, rewardBudget: 2000, rewardFame: 25, rewardNotoriety: 0, rewardTownFavor: 5, duration: 1 },
      { title: '最深部の守護者', description: '遺跡の心臓部を守るゴーレムを沈めます。', requiredPower: 1200, rewardBudget: 15000, rewardFame: 100, rewardNotoriety: 0, rewardTownFavor: 10, duration: 2 },
    ]
  }
];
