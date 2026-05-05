import type { Material, SynthesisRecipe } from '../types';

export const MATERIALS: Material[] = [
  { id: 'm1', name: '虹色の粘土', desc: '七色に輝く不思議な粘土。高度な錬金術に不可欠。', rank: 'E' },
  { id: 'm2', name: '鉄の原石', desc: 'どこでも採れる鉄の原料。', rank: 'E' },
  { id: 'm3', name: '魔力の残滓', desc: '強力な魔法が放たれた後に残る輝く粉末。', rank: 'D' },
  { id: 'm4', name: '銀の蔦', desc: '月の光を浴びて成長する銀色の植物。', rank: 'D' },
  { id: 'm5', name: '深淵の雫', desc: '闇の底で凝縮された魔力の結晶。', rank: 'C' },
  { id: 'm6', name: '古の歯車', desc: '失われた文明の機械に使われていた精密な部品。', rank: 'C' },
  { id: 'm7', name: '鳳凰の羽', desc: '永遠の命を象徴する伝説の鳥の羽。', rank: 'B' },
  { id: 'm8', name: 'オリハルコン', desc: '神々が武器を鍛えるのに用いたとされる幻の金属。', rank: 'A' },
  { id: 'm9', name: '星の断片', desc: '空から降り注いだ星の欠片。無限のエネルギーを秘める。', rank: 'S' },
];

export const SYNTHESIS_RECIPES: SynthesisRecipe[] = [
  {
    id: 'r1',
    name: 'ギルドの秘宝：黄金の獅子像',
    desc: 'ギルドの威光を全土に示す巨大な像。名声が劇的に上昇する。',
    requiredMaterials: [{ materialId: 'm1', count: 5 }, { materialId: 'm2', count: 10 }],
    rewardArtifactId: 'art_golden_lion',
    requiredFame: 50
  },
  {
    id: 'r2',
    name: '賢者の杖',
    desc: '全ての魔術師の能力を底上げする伝説の杖。',
    requiredMaterials: [{ materialId: 'm3', count: 8 }, { materialId: 'm5', count: 3 }],
    rewardArtifactId: 'art_sage_staff',
    requiredFame: 100
  },
  {
    id: 'r3',
    name: '次元の門',
    desc: 'ギルドの施設を拡張し、より多くの冒険者を収容可能にする。',
    requiredMaterials: [{ materialId: 'm6', count: 5 }, { materialId: 'm9', count: 1 }],
    rewardArtifactId: 'art_dimension_gate',
    requiredFame: 250
  }
];

export const getDungeonMaterials = (rank: string): string[] => {
  switch (rank) {
    case 'E': return ['m1', 'm2'];
    case 'D': return ['m3', 'm4'];
    case 'C': return ['m5', 'm6'];
    case 'B': return ['m7'];
    case 'A': return ['m8'];
    case 'S': return ['m9'];
    default: return ['m2'];
  }
};
