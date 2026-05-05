import type { Objective } from '../types';

export const GUILD_OBJECTIVES: Objective[] = [
  {
    id: 'rank_e_to_d',
    rank: 'E',
    title: '新米ギルドの証明',
    description: 'まずはギルドとしての体裁を整えましょう。名声を高め、基本的な素材を確保してください。',
    requiredFame: 30,
    requiredBudget: 3000,
    requiredMaterials: [{ materialId: 'm2', count: 5 }], // 鉄の原石
    rewardText: 'ランクD昇格：新たな施設拡張と中級依頼が解禁されます。',
    storySnippet: '「深淵なる鴉」……かつて大陸に名を轟かせた伝説のギルド。今やその看板は朽ち果て、見る影もありません。あなたは、この荒れ果てたギルドの再興を託されました。'
  },
  {
    id: 'rank_d_to_c',
    rank: 'D',
    title: '失われた遺物の断片',
    description: '伝説の遺物「鴉の瞳」が霧の森の最深部にあるという噂です。実力を示し、これを入手してください。',
    requiredFame: 80,
    requiredBudget: 10000,
    requiredMaterials: [{ materialId: 'm4', count: 3 }], // 銀の蔦
    requiredArtifacts: ['e1'], // 古びた銀貨
    rewardText: 'ランクC昇格：外交・諜報機能の本格運用が可能になります。',
    storySnippet: 'かつてのギルドマスターが遺した手記には、四つの聖遺物を集めた時、真の力が目覚めると記されています。あなたは一つ目の断片を求めて動き出します。'
  },
  {
    id: 'rank_c_to_b',
    rank: 'C',
    title: '街の守護者への道',
    description: 'ギルドの影響力を拡大し、王国の信頼を得る必要があります。より高度な技術と名声を示してください。',
    requiredFame: 150,
    requiredBudget: 30000,
    requiredMaterials: [{ materialId: 'm6', count: 5 }], // 古の歯車
    rewardText: 'ランクB昇格：最高ランクの冒険者が訪れるようになります。',
    storySnippet: '街の人々はあなたを認め始めました。しかし、それは同時にライバルたちの嫉妬を買うことにもなります。陰謀が渦巻く中、あなたは更なる高みを目指します。'
  },
  {
    id: 'rank_b_to_a',
    rank: 'B',
    title: '伝説の再構築',
    description: '三つの聖遺物を集め、ギルドを大陸最強の組織へと押し上げてください。',
    requiredFame: 300,
    requiredBudget: 80000,
    requiredMaterials: [{ materialId: 'm8', count: 1 }], // オリハルコン
    rewardText: 'ランクA昇格：全ての制限が解除され、神話への道が開かれます。',
    storySnippet: '聖遺物が集まるにつれ、ギルドホールの空気が変わっていくのを感じます。伝説の鴉が、再び羽ばたこうとしています。'
  }
];

export const STORY_CHAPTERS = [
  {
    turn: 1,
    title: '灰の中から',
    text: '大陸の片隅に佇む、かつての名門ギルド。あなたは新任マスターとして、この物語の最初の一ページを綴ることになります。',
    imageUrl: 'A desolate abandoned medieval guild hall, dusty interior, cobwebs, a single candle burning on a desk, cinematic lighting, 8k'
  },
  {
    turn: 11,
    title: '胎動する影',
    text: '最初の試練を乗り越えたあなたの前に、かつての栄光を妬む者たちが現れ始めます。世界はもはや、あなたを放ってはおきません。',
    imageUrl: 'A dark misty street in a medieval city, shadowed figures watching from alleys, purple magical glimmer, mysterious atmosphere'
  },
  {
    turn: 31,
    title: '決戦の予感',
    text: '聖遺物は揃いつつあります。しかし、世界に漂う魔圧もまた高まっています。終焉の足音が、すぐそこまで聞こえてきました。',
    imageUrl: 'An ominous red moon over a medieval castle, storm clouds, lightning, dark fantasy, epic scale'
  }
];
