/**
 * Guild Master - Static Constants & Data
 */

export const MAX_TURNS = 120; // 30年 × 4四半期
export const ALIGNMENTS = ['safety', 'adventure', 'military', 'commerce'];
export const SEASONS = ['春季', '夏季', '秋季', '冬季'];

export const NAME_POOL = [
    "アッシュ", "バーツ", "セリス", "ダンテ", "エララ", "ファリス", "ガー", "ヒルダ",
    "アーヴァイン", "ジン", "カイン", "ロック", "マヤ", "ネロ", "オリオン", "パック",
    "キスティス", "リディア", "マッシュ", "ティナ", "ウーマロ", "ヴァン", "ウェッジ",
    "ゼル", "ユフィ", "ゼイン", "アルス", "バルフレア", "クロード", "ディリータ",
    "エドガー", "フリオニール", "ギルガメッシュ", "ホープ", "イグニス", "ジェクト",
    "クルル", "ライトニング", "ミンウ", "ノクティス", "オニオン", "プロンプト", "クイナ",
    "ラムザ", "スコール", "ティーダ", "ヴィンセント", "ワッカ", "ジタン", "エアリス"
];

export const REP_NAME_POOL = [
    "マリー", "ガルド", "カトレア", "ルナ", "トーマス", "エルザ",
    "シド", "ニーナ", "レイヴン", "サラ", "クロエ", "ダグラス",
    "エマ", "レオン", "ソフィア", "ノア", "オリビア", "ルーク"
];

export const RANKS = ['E', 'D', 'C', 'B', 'A', 'S'];

export const CLASSES_DATA = [
    { id: 'warrior', name: '戦士', desc: '軍事時に戦力にボーナス', icon: 'Swords' },
    { id: 'mage', name: '魔術師', desc: '探索と軍事の成功率を底上げ', icon: 'Wand2' },
    { id: 'thief', name: '盗賊', desc: '探索時の罠を回避し成功率上昇/防諜力UP', icon: 'EyeOff' },
    { id: 'cleric', name: '僧侶', desc: '治安維持で活躍し、死亡率を下げる', icon: 'Shield' }
];

export const TRAITS = [
    { id: 'loyal', name: '忠義者', desc: '忠誠度が非常に下がりにくい。' },
    { id: 'greedy', name: '強欲', desc: '実力は高いが、法外な給与を要求する。' },
    { id: 'coward', name: '臆病', desc: '戦力は低いが、危険を察知し生き残りやすい。' },
    { id: 'heroic', name: '英雄肌', desc: 'すべての任務の成功確率を僅かに引き上げる。' },
    { id: 'normal', name: '平凡', desc: '特筆すべき特徴を持たない。' }
];

export const PERSONALITIES = [
    { id: 'hot', name: '熱血', desc: '直情的。冷静な者と同じ部隊だと反発し戦力が下がる。' },
    { id: 'cool', name: '冷静', desc: '合理的。熱血な者と同じ部隊だと反発し戦力が下がる。' },
    { id: 'ambitious', name: '野心家', desc: '自己主張が強い。同類が複数いると主導権争いで全体の足を引っ張る。' },
    { id: 'gentle', name: '温和', desc: '協調性が高く、誰とでも問題なく組める。' }
];

export const WEAPONS = {
    warrior: ['使い込まれた鉄の剣', '鋼のハルバード', '血濡れのブロードアクス', '近衛騎士の長剣', '傭兵の大剣'],
    mage: ['節だらけの樫の杖', '魔導師のロッド', '古びた魔導書', '精霊が宿る水晶のオーブ', '黒檀の杖'],
    thief: ['仕込みダガー', '暗殺者の短剣', '軽量ショートボウ', '毒塗りの投げナイフ', '影走りの双剣'],
    cleric: ['司祭のメイス', '祈りのロッド', '白銀の聖印', '退魔のメイス', '癒し手の小杖']
};

export const BACKGROUNDS = [
    '故郷の村を魔物に焼かれ、復讐のためだけに生きている。',
    '一攫千金を夢見て田舎から上京してきた野心家。',
    'かつて名門騎士団に所属していたが、上官の不正を告発し追放された。',
    '古代文明の失われた秘宝を探し求めるロマンチスト。',
    'ただひたすらに己の武の頂を求める流浪の求道者。',
    '実家の莫大な借金を返すため、危険な仕事に手を出している。',
    '由緒正しい魔法一族の生まれだが、才能がなく家を出奔した落ちこぼれ。',
    '戦場を渡り歩いてきた歴戦の傭兵。金にがめつい。',
    '記憶を失っており、己のルーツを探るために旅をしている。',
    '高名な冒険者だった親の背中を追い、同じ道を志した若者。'
];

export const RIVAL_ADJS = ["赤き", "白銀の", "黄金の", "漆黒の", "蒼き", "暁の", "幻影の", "不屈の", "血塗られた", "静寂の", "鋼の", "無名の"];
export const RIVAL_NOUNS = ["獅子団", "盾", "天秤商会", "狼", "鷹の爪", "竜騎士団", "剣", "梟", "鉄床", "黒百合", "牙", "鴉"];

export const RUMORS = [
    "「マスター、あの新人の装備、ちょっと頼りないんじゃないですか？」",
    "「隣街のギルド、またでかい依頼を片付けたらしいぜ。」",
    "「美味いエールと温かいベッド。任務の後はこれが一番だ。」",
    "「最近、北の森で怪しい影を見たって奴がいてな…迷宮があるかもしれない。」",
    "「ギルドの金庫、最近潤ってるらしいじゃないか。おこぼれに預かりたいね。」",
    "「誰が作戦部隊に選ばれるのか、いつも発表前は胃が痛くなるよ。」",
    "「あいつとあいつ、この前酒場で大喧嘩してたぜ。同じ部隊になったら最悪だな。」",
    "「次の季節はどこに遠征するんだろうな。命あっての物種だぜ。」"
];

export const ACHIEVEMENTS = [
    { id: 'rich', name: '黄金の亡者', desc: '金庫の資金が 10,000 G を突破した。', icon: 'Coins' },
    { id: 'famous', name: '生ける伝説', desc: 'ギルドの名声が 100 を超えた。', icon: 'Crown' },
    { id: 'notorious', name: '暗黒街の支配者', desc: 'ギルドの悪名が 100 を超えた。', icon: 'Skull' },
    { id: 'army', name: '無敵の軍団', desc: '主力部隊の戦力が 1,000 を超えた。', icon: 'Shield' },
    { id: 'boss_1', name: '岩竜殺し', desc: '第一の厄災「目覚めし岩竜」を討伐した。', icon: 'Target' },
    { id: 'boss_2', name: '魔将討ち', desc: '第二の厄災「深淵の魔将」を討伐した。', icon: 'Target' },
    { id: 'boss_3', name: '神話の終焉', desc: '最終の厄災「終焉を呼ぶ巨神」を討伐した。', icon: 'Crown' },
    { id: 'coop', name: '呉越同舟', desc: 'ライバルギルドと手を取り合い、共に厄災に立ち向かった。', icon: 'HeartHandshake' }
];

export const BOSS_DATA = {
    39: { id: 'boss_1', name: '目覚めし岩竜', power: 1500, reward: 8000, desc: '近隣の山脈で冬眠していた岩竜が目覚め、街へ向かってきている！このままでは街が壊滅する。' },
    79: { id: 'boss_2', name: '深淵の魔将', power: 3500, reward: 20000, desc: '次元の裂け目から、いにしえの魔将が軍勢を引き連れて侵攻してきた！全軍を挙げて迎撃せよ。' },
    115: { id: 'boss_3', name: '終焉を呼ぶ巨神', power: 8000, reward: 50000, desc: '世界を滅ぼすと言われる伝説の巨神が顕現した。世界の危機だ！持てるすべての力を結集せよ。' }
};

export const DUNGEON_POOL = [
    { id: 'd1', name: '薄暗い小鬼の洞穴', powerReq: 150, reward: 1500, desc: '近隣の森にある小さな洞穴。小鬼の住処になっている。' },
    { id: 'd2', name: '盗賊団の隠れ家', powerReq: 350, reward: 4000, desc: '街道を荒らす盗賊たちの拠点。奪われた品々が眠る。' },
    { id: 'd3', name: '狂信者の地下墓地', powerReq: 700, reward: 8000, desc: '邪教徒がアンデッドを生み出している不気味な墓所。' },
    { id: 'd4', name: '水竜の棲む地底湖', powerReq: 1200, reward: 15000, desc: '美しいが極めて危険な地底湖。水竜の宝が眠る。' },
    { id: 'd5', name: '忘却の魔導塔', powerReq: 2000, reward: 25000, desc: '古代の魔術師が残した危険な罠が張り巡らされた塔。' },
    { id: 'd6', name: '幻影の蜃気楼', powerReq: 3500, reward: 40000, desc: '砂漠に現れる幻の塔。最強クラスの魔物が巣食う。' },
];

export const ARTIFACT_POOL = [
    { id: 'art1', name: '覇王の剛剣', powerBonus: 300, desc: 'かつて大陸を統一した覇王が振るった大剣。' },
    { id: 'art2', name: '星詠みの杖', powerBonus: 300, desc: '星々の輝きを魔力に変換する神秘の杖。' },
    { id: 'art3', name: '幻影の外套', powerBonus: 250, desc: '着用者の姿を風景に溶け込ませる魔法の外套。' },
    { id: 'art4', name: '聖女の涙', powerBonus: 250, desc: '奇跡的な治癒力を秘めた結晶。' },
    { id: 'art5', name: '竜騎士の槍', powerBonus: 400, desc: '天を貫く一撃を放つと言われる名槍。' },
    { id: 'art6', name: '冥王の指輪', powerBonus: 500, desc: '莫大な力と引き換えに魂を削る禁断の指輪。' },
];

export const SPECIAL_REQUESTS = [
    { id: 'req1', name: '王族のお忍び護衛', powerReq: 800, reward: 8000, fameBonus: 20, notorietyBonus: 0, desc: '王族が街を視察するための護衛任務。能力不足の部隊を送れば不敬罪になりかねない。' },
    { id: 'req2', name: '古代竜の撃退', powerReq: 2500, reward: 20000, fameBonus: 50, notorietyBonus: 0, desc: '街に接近する古代竜を追い払う。極めて危険な任務であり、精鋭を集める必要がある。' },
    { id: 'req3', name: '裏社会の粛清', powerReq: 1200, reward: 12000, fameBonus: 0, notorietyBonus: 30, desc: '対立するマフィア組織の拠点を壊滅させる闇の依頼。部隊の相性が悪いと全滅の危機。' },
    { id: 'req4', name: '貴族からの特命', powerReq: 500, reward: 5000, fameBonus: 10, notorietyBonus: 0, desc: 'ある貴族の個人的な探し物を極秘裏に行う。適当な人選では失敗する。' }
];

export const MASTER_SKILLS = {
    charisma: { name: 'カリスマ', desc: '冒険者の忠誠度が自然回復しやすくなる。' },
    underworld: { name: '裏社会の顔', desc: '諜報や裏工作の成功率、および防諜能力が上昇する。' },
    business: { name: '商才', desc: '酒場などの商業収入と内政収入が増加する。' },
    leadership: { name: '統率力', desc: '部隊の総合戦力に強力なリーダーシップボーナスを与える。' },
    recruitment: { name: 'スカウト術', desc: '能動的な「人材捜索」の成功率と、発見する冒険者の質が向上します。' }
};

export const QUEST_TYPES = [
    { id: 'subjugation', name: '魔物討伐', icon: 'Swords', baseReward: 300, risk: 'low', favorReq: 0 },
    { id: 'escort', name: '商隊護衛', icon: 'Shield', baseReward: 500, risk: 'medium', favorReq: 10 },
    { id: 'investigation', name: '遺跡調査', icon: 'Search', baseReward: 800, risk: 'medium', favorReq: 30 },
    { id: 'harvest', name: '素材採取', icon: 'ShoppingBag', baseReward: 200, risk: 'low', favorReq: 0 },
    { id: 'emergency', name: '緊急要請', icon: 'AlertTriangle', baseReward: 1200, risk: 'high', favorReq: 50 }
];

export const SAVE_KEY = 'guildMasterSaveData_final';

export const INITIAL_GAME_STATE = {
    turn: 0,
    budget: 2000,
    fame: 10,
    notoriety: 0,
    townFavor: 20, // 街との友好度 (0-100)
    alignment: { safety: 25, adventure: 25, military: 25, commerce: 25 },
    facilities: { residence: 1, tavern: 1, training: 1 },
    shops: { blacksmith: 0, magicShop: 0, itemShop: 0 },
    masterSkills: { charisma: 0, underworld: 0, business: 0, leadership: 0, recruitment: 0 },
    receptionist: { id: 'rookie', name: '新米のマリー', type: 'normal', desc: '一生懸命だが不器用。維持費が安く済む。', hireCost: 0, salary: 100 },
    availableReceptionists: [],
    usedRepNames: [],
    adventurers: [],
    mainParty: [],
    activeQuests: [], // 受注中のクエスト
    availableQuests: [], // 掲示板のクエスト
    discoveredDungeons: [DUNGEON_POOL[0]],
    clearedDungeons: [],
    targetDungeon: null,
    ownedArtifacts: [],
    specialRequest: null,
    usedNames: [],
    currentEvent: null,
    currentRumor: RUMORS[0],
    rivals: [],
    unlockedAchievements: [],
    activeBoss: null,
    allianceRequests: {},
    gameOver: false,
    endType: null,
    endData: null
};
