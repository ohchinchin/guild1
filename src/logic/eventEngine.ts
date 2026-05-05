import type { DynamicEvent, GameState } from '../types';

const generateImageUrl = (prompt: string) => {
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + ', dramatic dark fantasy, cinematic lighting, 8k, highly detailed')}?model=flux&width=1024&height=512&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;
};

export const getRandomEvent = (state: GameState): DynamicEvent | null => {
  const { turn, notoriety, rivals } = state;

  // No events for the first 5 turns (Preparation Period)
  if (turn <= 5) return null;

  // Turn 6: Dramatic Introduction of Rivals
  if (turn === 6) {
    const mainRival = rivals[0];
    return {
      id: 'rival_introduction',
      title: '宣戦布告：ライバルギルドの台頭',
      description: `「${mainRival.name}」の長が直々にギルドを訪れた。\n「この街に実力あるギルドは二つもいらねぇ……精々、看板を汚さねぇよう気をつけるんだな」\n彼らは本格的にこちらの活動を妨害し始めるつもりのようだ。`,
      imageUrl: generateImageUrl(`An arrogant rival guild master in black armor laughing, dark guild hall background, menacing atmosphere, epic fantasy`),
      type: 'rival',
      choices: [
        {
          label: '「受けて立とう」と宣言する（名声+10）',
          effect: (s: any) => ({ ...s, fame: s.fame + 10 }),
          resultMessage: 'あなたの毅然とした態度に、ギルドの結束が強まった。'
        },
        {
          label: '沈黙を守る（名声-5、悪名-5）',
          effect: (s: any) => ({ ...s, fame: Math.max(0, s.fame - 5), notoriety: Math.max(0, s.notoriety - 5) }),
          resultMessage: 'あなたは相手を無視することを選んだ。周囲は嵐の前の静けさを感じている。'
        }
      ]
    };
  }

  const roll = Math.random();
  
  if (roll < 0.15) {
    // Rival Guild Event
    const rival = rivals[Math.floor(Math.random() * rivals.length)];
    return {
      id: 'rival_sabotage',
      title: `ライバルギルド「${rival.name}」の妨害`,
      description: `${rival.name}が我がギルドの冒険者に偽情報を流し、クエストの成功率を下げようとしている。`,
      imageUrl: generateImageUrl(`A rival guild master scheming in a dark office, plotting sabotage, medieval setting, fantasy`),
      type: 'rival',
      choices: [
        {
          label: '徹底抗戦する（資金消費、悪名上昇）',
          effect: (s: any) => ({ ...s, budget: s.budget - 500, notoriety: s.notoriety + 10, fame: s.fame + 20 }),
          resultMessage: '力で黙らせた。ギルドの威厳は守られたが、街の噂は芳しくない。'
        },
        {
          label: '話し合いを試みる（名声消費、好感度上昇）',
          effect: (s: any) => ({ ...s, fame: Math.max(0, s.fame - 15), townFavor: Math.min(100, s.townFavor + 10) }),
          resultMessage: '平和的に解決した。街の人々はあなたの度量を称賛している。'
        }
      ]
    };
  }

  if (roll < 0.25) {
    // National Decree
    return {
      id: 'national_decree',
      title: '王国からの緊急勅命',
      description: '隣国との緊張が高まっている。王国は全てのギルドに対し、軍事訓練への協力を要請した。',
      imageUrl: generateImageUrl(`A royal messenger presenting a golden scroll, medieval throne room background, epic fantasy`),
      type: 'national',
      choices: [
        {
          label: '要請を受け入れる（戦力アップ、資金減少）',
          effect: (s: any) => ({ ...s, adventurers: s.adventurers.map((a: any) => ({ ...a, power: a.power + 20 })), budget: s.budget - 1000, fame: s.fame + 30 }),
          resultMessage: '王国の信頼を勝ち得た。冒険者たちの練度も上がったようだ。'
        },
        {
          label: '要請を拒否する（悪名上昇、名声大幅減少）',
          effect: (s: any) => ({ ...s, notoriety: s.notoriety + 20, fame: Math.max(0, s.fame - 50) }),
          resultMessage: '王国の怒りを買った。ギルドの立場は危うくなっている。'
        }
      ]
    };
  }

  if (roll < 0.35 && notoriety > 50) {
    // Crisis Event (High Notoriety)
    return {
      id: 'crisis_revolt',
      title: '裏社会の反乱',
      description: '悪名が高まりすぎたようだ。あなたのやり方に反発した闇組織がギルドへの襲撃を予告した。',
      imageUrl: generateImageUrl(`A burning guild hall at night, assassin shadows, dark fantasy, intense atmosphere`),
      type: 'crisis',
      choices: [
        {
          label: '金を払って解決する',
          effect: (s: any) => ({ ...s, budget: Math.max(0, s.budget - 2000) }),
          resultMessage: '莫大な賄賂で難を逃れた。しかし、金庫は空に近い。'
        },
        {
          label: '全力で迎え撃つ（負傷者が出る可能性）',
          effect: (s: any) => ({ ...s, notoriety: s.notoriety + 20, fame: s.fame + 50 }),
          resultMessage: '凄惨な戦いの末、敵を撃退した。ギルドの名は恐怖と共に刻まれた。'
        }
      ]
    };
  }

  return null;
};
