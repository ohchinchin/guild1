export const FLAVOR_TEXT = {
  seasons: {
    summer: {
      name: "夏季",
      description: "太陽が照りつけ、街道が賑わう季節。冒険者たちの活動も活発になるが、熱中症や魔物の活性化には注意が必要だ。",
      events: [
        "灼熱の太陽が冒険者たちの体力を奪う。",
        "豊作を祝う祭りの準備で、街は活気に満ちている。",
        "森の奥深くで、夏にしか現れない幻の蝶が目撃された。"
      ]
    },
    winter: {
      name: "冬季",
      description: "北風が吹き荒れ、雪が万物を覆う季節。過酷な寒さは任務の難易度を上げるが、冬にしか得られない希少な素材も存在する。",
      events: [
        "猛烈な吹雪により、一部の街道が封鎖された。",
        "凍てつく夜、酒場の暖炉の周りには冒険者たちが集まる。",
        "雪原に潜む白い魔獣たちが、飢えから村を狙っている。"
      ]
    }
  },
  facilities: {
    dorm: [
      "寝床を整えることは、冒険の基本だ。固いパンと清潔なシーツ、それだけで十分だ。",
      "冒険者たちの笑い声が絶えない宿舎。ここは彼らにとって唯一の安らぎの場だ。",
      "ランクの高い冒険者には個室を。それがギルドの威信を示すことになる。"
    ],
    tavern: [
      "酒場は情報の宝庫だ。酒の勢いで漏れる秘密こそが、次の富を生む。",
      "香ばしい肉の焼ける匂いと、エールの泡。これこそがギルドの生命線だ。",
      "今夜も誰かが自慢話を語り、誰かが静かに杯を干している。"
    ],
    training: [
      "汗と涙は裏切らない。木剣が折れるまで振るう者こそが、戦場を生き残る。",
      "古強者が若手に技を伝授する。こうしてギルドの伝統は受け継がれていく。",
      "魔力の奔流を制御する瞑想室。静寂の中にこそ、真の力が宿る。"
    ]
  },
  intrigue: [
    "「影の仕事には、相応の報酬が必要だ。お互いに詮索はなしで行こう」",
    "暗い路地裏で交わされる密談。真実は常に闇の中に隠されている。",
    "偽情報を流し、ライバルの足を引っ張る。汚い手だが、勝てば官軍だ。"
  ],
  darkmarket: [
    "「お目が高い。これは禁忌の森でしか採れない代物だ……」",
    "ここでは法など無意味だ。必要なのは金と、秘密を守れる口だけだ。",
    "呪われた武器、禁じられた薬。ここにあるのは、光の届かない世界の遺産だ。"
  ]
};

export const getRandomFlavor = (category: keyof typeof FLAVOR_TEXT, subId?: string): string => {
  const cat = FLAVOR_TEXT[category];
  
  if (subId && typeof cat === 'object' && !Array.isArray(cat)) {
    const subCat = (cat as any)[subId];
    if (subCat) {
      if (Array.isArray(subCat)) {
        return subCat[Math.floor(Math.random() * subCat.length)];
      }
      if (subCat.events && Array.isArray(subCat.events)) {
        return subCat.events[Math.floor(Math.random() * subCat.events.length)];
      }
    }
  }

  if (Array.isArray(cat)) {
    return cat[Math.floor(Math.random() * cat.length)];
  }

  return "穏やかな時間が流れている。";
};
