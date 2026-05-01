(function() {
    "use strict";

    // --- Global Access ---
    const React = window.React;
    const ReactDOM = window.ReactDOM;
    const LucideReact = window.LucideReact || window.lucide || {};
    const html = window.htm.bind(window.React.createElement);

    // --- Constants (from src/data/constants.js) ---
    const MAX_TURNS = 120;
    const ALIGNMENTS = ['safety', 'adventure', 'military', 'commerce'];
    const SEASONS = ['春季', '夏季', '秋季', '冬季'];

    const NAME_POOL = [
        "アッシュ", "バーツ", "セリス", "ダンテ", "エララ", "ファリス", "ガー", "ヒルダ",
        "アーヴァイン", "ジン", "カイン", "ロック", "マヤ", "ネロ", "オリオン", "パック",
        "キスティス", "リディア", "マッシュ", "ティナ", "ウーマロ", "ヴァン", "ウェッジ",
        "ゼル", "ユフィ", "ゼイン", "アルス", "バルフレア", "クロード", "ディリータ",
        "エドガー", "フリオニール", "ギルガメッシュ", "ホープ", "イグニス", "ジェクト",
        "クルル", "ライトニング", "ミンウ", "ノクティス", "オニオン", "プロンプト", "クイナ",
        "ラムザ", "スコール", "ティーダ", "ヴィンセント", "ワッカ", "ジタン", "エアリス"
    ];

    const REP_NAME_POOL = [
        "マリー", "ガルド", "カトレア", "ルナ", "トーマス", "エルザ",
        "シド", "ニーナ", "レイヴン", "サラ", "クロエ", "ダグラス",
        "エマ", "レオン", "ソフィア", "ノア", "オリビア", "ルーク"
    ];

    const RANKS = ['E', 'D', 'C', 'B', 'A', 'S'];

    const CLASSES_DATA = [
        { id: 'warrior', name: '戦士', desc: '軍事時に戦力にボーナス', icon: 'Swords' },
        { id: 'mage', name: '魔術師', desc: '探索と軍事の成功率を底上げ', icon: 'Wand2' },
        { id: 'thief', name: '盗賊', desc: '探索時の罠を回避し成功率上昇/防諜力UP', icon: 'EyeOff' },
        { id: 'cleric', name: '僧侶', desc: '治安維持で活躍し、死亡率を下げる', icon: 'Shield' }
    ];

    const TRAITS = [
        { id: 'loyal', name: '忠義者', desc: '忠誠度が非常に下がりにくい。' },
        { id: 'greedy', name: '強欲', desc: '実力は高いが、法外な給与を要求する。' },
        { id: 'coward', name: '臆病', desc: '戦力は低いが、危険を察知し生き残りやすい。' },
        { id: 'heroic', name: '英雄肌', desc: 'すべての任務の成功確率を僅かに引き上げる。' },
        { id: 'normal', name: '平凡', desc: '特筆すべき特徴を持たない。' }
    ];

    const PERSONALITIES = [
        { id: 'hot', name: '熱血', desc: '直情的。冷静な者と同じ部隊だと反発し戦力が下がる。' },
        { id: 'cool', name: '冷静', desc: '合理的。熱血な者と同じ部隊だと反発し戦力が下がる。' },
        { id: 'ambitious', name: '野心家', desc: '自己主張が強い。同類が複数いると主導権争いで全体の足を引っ張る。' },
        { id: 'gentle', name: '温和', desc: '協調性が高く、誰とでも問題なく組める。' }
    ];

    const WEAPONS = {
        warrior: ['使い込まれた鉄の剣', '鋼のハルバード', '血濡れのブロードアクス', '近衛騎士の長剣', '傭兵の大剣'],
        mage: ['節だらけの樫の杖', '魔導師のロッド', '古びた魔導書', '精霊が宿る水晶のオーブ', '黒檀の杖'],
        thief: ['仕込みダガー', '暗殺者の短剣', '軽量ショートボウ', '毒塗りの投げナイフ', '影走りの双剣'],
        cleric: ['司祭のメイス', '祈りのロッド', '白銀の聖印', '退魔のメイス', '癒し手の小杖']
    };

    const BACKGROUNDS = [
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

    const RIVAL_ADJS = ["赤き", "白銀の", "黄金の", "漆黒の", "蒼き", "暁の", "幻影の", "不屈の", "血塗られた", "静寂の", "鋼の", "無名の"];
    const RIVAL_NOUNS = ["獅子団", "盾", "天秤商会", "狼", "鷹の爪", "竜騎士団", "剣", "梟", "鉄床", "黒百合", "牙", "鴉"];

    const RUMORS = [
        "「マスター、あの新人の装備、ちょっと頼りないんじゃないですか？」",
        "「隣街のギルド、またでかい依頼を片付けたらしいぜ。」",
        "「美味いエールと温かいベッド。任務の後はこれが一番だ。」",
        "「最近、北の森で怪しい影を見たって奴がいてな…迷宮があるかもしれない。」",
        "「ギルドの金庫、最近潤ってるらしいじゃないか。おこぼれに預かりたいね。」",
        "「誰が作戦部隊に選ばれるのか、いつも発表前は胃が痛くなるよ。」",
        "「あいつとあいつ、この前酒場で大喧嘩してたぜ。同じ部隊になったら最悪だな。」",
        "「次の季節はどこに遠征するんだろうな。命あっての物種だぜ。」"
    ];

    const ACHIEVEMENTS = [
        { id: 'rich', name: '黄金の亡者', desc: '金庫の資金が 10,000 G を突破した。', icon: 'Coins' },
        { id: 'famous', name: '生ける伝説', desc: 'ギルドの名声が 100 を超えた。', icon: 'Crown' },
        { id: 'notorious', name: '暗黒街の支配者', desc: 'ギルドの悪名が 100 を超えた。', icon: 'Skull' },
        { id: 'army', name: '無敵の軍団', desc: '主力部隊の戦力が 1,000 を超えた。', icon: 'Shield' },
        { id: 'boss_1', name: '岩竜殺し', desc: '第一の厄災「目覚めし岩竜」を討伐した。', icon: 'Target' },
        { id: 'boss_2', name: '魔将討ち', desc: '第二の厄災「深淵の魔将」を討伐した。', icon: 'Target' },
        { id: 'boss_3', name: '神話の終焉', desc: '最終の厄災「終焉を呼ぶ巨神」を討伐した。', icon: 'Crown' },
        { id: 'coop', name: '呉越同舟', desc: 'ライバルギルドと手を取り合い、共に厄災に立ち向かった。', icon: 'HeartHandshake' }
    ];

    const BOSS_DATA = {
        39: { id: 'boss_1', name: '目覚めし岩竜', power: 1500, reward: 8000, desc: '近隣の山脈で冬眠していた岩竜が目覚め、街へ向かってきている！このままでは街が壊滅する。' },
        79: { id: 'boss_2', name: '深淵の魔将', power: 3500, reward: 20000, desc: '次元の裂け目から、いにしえの魔将が軍勢を引き連れて侵攻してきた！全軍を挙げて迎撃せよ。' },
        115: { id: 'boss_3', name: '終焉を呼ぶ巨神', power: 8000, reward: 50000, desc: '世界を滅ぼすと言われる伝説の巨神が顕現した。世界の危機だ！持てるすべての力を結集せよ。' }
    };

    const DUNGEON_POOL = [
        { id: 'd1', name: '薄暗い小鬼の洞穴', powerReq: 150, reward: 1500, desc: '近隣の森にある小さな洞穴。小鬼の住処になっている。' },
        { id: 'd2', name: '盗賊団の隠れ家', powerReq: 350, reward: 4000, desc: '街道を荒らす盗賊たちの拠点。奪われた品々が眠る。' },
        { id: 'd3', name: '狂信者の地下墓地', powerReq: 700, reward: 8000, desc: '邪教徒がアンデッドを生み出している不気味な墓所。' },
        { id: 'd4', name: '水竜の棲む地底湖', powerReq: 1200, reward: 15000, desc: '美しいが極めて危険な地底湖。水竜の宝が眠る。' },
        { id: 'd5', name: '忘却の魔導塔', powerReq: 2000, reward: 25000, desc: '古代の魔術師が残した危険な罠が張り巡らされた塔。' },
        { id: 'd6', name: '幻影の蜃気楼', powerReq: 3500, reward: 40000, desc: '砂漠に現れる幻の塔。最強クラスの魔物が巣食う。' },
    ];

    const ARTIFACT_POOL = [
        { id: 'art1', name: '覇王の剛剣', powerBonus: 300, desc: 'かつて大陸を統一した覇王が振るった大剣。' },
        { id: 'art2', name: '星詠みの杖', powerBonus: 300, desc: '星々の輝きを魔力に変換する神秘の杖。' },
        { id: 'art3', name: '幻影の外套', powerBonus: 250, desc: '着用者の姿を風景に溶け込ませる魔法の外套。' },
        { id: 'art4', name: '聖女の涙', powerBonus: 250, desc: '奇跡的な治癒力を秘めた結晶。' },
        { id: 'art5', name: '竜騎士の槍', powerBonus: 400, desc: '天を貫く一撃を放つと言われる名槍。' },
        { id: 'art6', name: '冥王の指輪', powerBonus: 500, desc: '莫大な力と引き換えに魂を削る禁断の指輪。' },
    ];

    const SPECIAL_REQUESTS = [
        { id: 'req1', name: '王族のお忍び護衛', powerReq: 800, reward: 8000, fameBonus: 20, notorietyBonus: 0, desc: '王族が街を視察するための護衛任務。能力不足の部隊を送れば不敬罪になりかねない。' },
        { id: 'req2', name: '古代竜の撃退', powerReq: 2500, reward: 20000, fameBonus: 50, notorietyBonus: 0, desc: '街に接近する古代竜を追い払う。極めて危険な任務であり、精鋭を集める必要がある。' },
        { id: 'req3', name: '裏社会の粛清', powerReq: 1200, reward: 12000, fameBonus: 0, notorietyBonus: 30, desc: '対立するマフィア組織の拠点を壊滅させる闇の依頼。部隊の相性が悪いと全滅の危機。' },
        { id: 'req4', name: '貴族からの特命', powerReq: 500, reward: 5000, fameBonus: 10, notorietyBonus: 0, desc: 'ある貴族の個人的な探し物を極秘裏に行う。適当な人選では失敗する。' }
    ];

    const MASTER_SKILLS = {
        charisma: { name: 'カリスマ', desc: '冒険者の忠誠度が自然回復しやすくなる。' },
        underworld: { name: '裏社会の顔', desc: '諜報や裏工作の成功率、および防諜能力が上昇する。' },
        business: { name: '商才', desc: '酒場などの商業収入と内政収入が増加する。' },
        leadership: { name: '統率力', desc: '部隊の総合戦力に強力なリーダーシップボーナスを与える。' },
        recruitment: { name: 'スカウト術', desc: '能動的な「人材捜索」の成功率と、発見する冒険者の質が向上します。' }
    };

    const QUEST_TYPES = [
        { id: 'subjugation', name: '魔物討伐', icon: 'Swords', baseReward: 300, risk: 'low', favorReq: 0 },
        { id: 'escort', name: '商隊護衛', icon: 'Shield', baseReward: 500, risk: 'medium', favorReq: 10 },
        { id: 'investigation', name: '遺跡調査', icon: 'Search', baseReward: 800, risk: 'medium', favorReq: 30 },
        { id: 'harvest', name: '素材採取', icon: 'ShoppingBag', baseReward: 200, risk: 'low', favorReq: 0 },
        { id: 'emergency', name: '緊急要請', icon: 'AlertTriangle', baseReward: 1200, risk: 'high', favorReq: 50 }
    ];

    const SAVE_KEY = 'guildMasterSaveData_final';

    const INITIAL_GAME_STATE = {
        turn: 0,
        budget: 2000,
        fame: 10,
        notoriety: 0,
        townFavor: 20,
        alignment: { safety: 25, adventure: 25, military: 25, commerce: 25 },
        facilities: { residence: 1, tavern: 1, training: 1 },
        shops: { blacksmith: 0, magicShop: 0, itemShop: 0 },
        masterSkills: { charisma: 0, underworld: 0, business: 0, leadership: 0, recruitment: 0 },
        receptionist: { id: 'rookie', name: '新米のマリー', type: 'normal', desc: '一生懸命だが不器用。維持費が安く済む。', hireCost: 0, salary: 100 },
        availableReceptionists: [],
        usedRepNames: [],
        adventurers: [],
        mainParty: [],
        activeQuests: [],
        availableQuests: [],
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

    // --- Audio Logic (from src/utils/audio.js) ---
    const GeminiAudio = {
        ctx: null,
        masterGain: null,
        currentBgm: null,
        bgmLoop: null,
        isInitialized: false,
        notes: {
            'C2': 65.41, 'G2': 98.00, 'A2': 110.00, 'F2': 87.31, 'E2': 82.41, 'D2': 73.42,
            'A3': 220.00, 'C4': 261.63, 'E4': 329.63, 'G4': 392.00, 'B4': 493.88,
            'D4': 293.66, 'F4': 349.23, 'Ab4': 415.30, 'Bb4': 466.16
        },
        init() {
            if (this.isInitialized) return;
            try {
                this.ctx = new (window.AudioContext || window.webkitAudioContext)();
                this.masterGain = this.ctx.createGain();
                this.masterGain.connect(this.ctx.destination);
                this.masterGain.gain.value = 0.3;
                this.isInitialized = true;
            } catch (e) { console.error("Audio init failed", e); }
        },
        createOsc(freq, type = 'triangle', duration = 0.5, volume = 0.2) {
            if (!this.isInitialized) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            gain.gain.setValueAtTime(volume, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        },
        playSE(type) {
            if (!this.isInitialized || this.masterGain.gain.value === 0) return;
            switch(type) {
                case 'click': this.createOsc(440, 'sine', 0.1, 0.1); break;
                case 'success': 
                    this.createOsc(523.25, 'triangle', 0.3, 0.2);
                    setTimeout(() => this.createOsc(659.25, 'triangle', 0.3, 0.2), 100);
                    break;
                case 'gacha_s':
                    [523, 659, 783, 1046].forEach((f, i) => {
                        setTimeout(() => this.createOsc(f, 'sine', 0.8, 0.1), i * 100);
                    });
                    break;
                case 'danger': this.createOsc(110, 'sawtooth', 0.5, 0.2); break;
            }
        },
        playBGM(type) {
            if (!this.isInitialized) this.init();
            if (this.currentBgm === type) return;
            this.stopBGM();
            this.currentBgm = type;
            let step = 0;
            const sequence = this.getSequence(type);
            this.bgmLoop = setInterval(() => {
                if (!this.isInitialized || this.masterGain.gain.value === 0) return;
                const note = sequence[step % sequence.length];
                if (note) {
                    const freq = this.notes[note.key];
                    this.createOsc(freq, note.type || 'triangle', note.dur || 0.8, note.vol || 0.1);
                }
                step++;
            }, 400);
        },
        stopBGM() {
            if (this.bgmLoop) clearInterval(this.bgmLoop);
            this.currentBgm = null;
        },
        getSequence(type) {
            switch(type) {
                case 'boss':
                    return [
                        {key:'D2', vol:0.2, type:'sawtooth'}, null, {key:'D2', vol:0.15}, {key:'Ab4', dur:0.2},
                        {key:'E2', vol:0.2, type:'sawtooth'}, null, {key:'E2', vol:0.15}, {key:'Bb4', dur:0.2}
                    ];
                case 'ending':
                    return [
                        {key:'C4'}, {key:'E4'}, {key:'G4'}, {key:'C4'},
                        {key:'F4'}, {key:'A3'}, {key:'C4'}, {key:'F4'}
                    ];
                default:
                    return [
                        {key:'A2', vol:0.2}, null, {key:'E4', dur:1.2}, null,
                        {key:'F2', vol:0.2}, null, {key:'C4', dur:1.2}, null,
                        {key:'G2', vol:0.2}, null, {key:'B4', dur:1.2}, null,
                        {key:'E2', vol:0.2}, null, {key:'G4', dur:1.2}, null
                    ];
            }
        },
        setMute(isMuted) {
            if (!this.isInitialized) this.init();
            this.masterGain.gain.setTargetAtTime(isMuted ? 0 : 0.3, this.ctx.currentTime, 0.1);
        }
    };

    // --- Game Logic (from src/utils/gameLogic.js) ---
    const generateAdventurer = (fame, notoriety, usedNames, forcedRank = null, isRivalMember = false) => {
        let availableNames = NAME_POOL.filter(n => !usedNames.includes(n));
        if (availableNames.length === 0) availableNames = NAME_POOL;
        let name = availableNames[Math.floor(Math.random() * availableNames.length)];
        let rankIdx = 0;
        let roll = Math.random() * 100;
        let qualityBonus = (fame + notoriety) / 10;
        if (roll + qualityBonus > 95) rankIdx = 4;
        else if (roll + qualityBonus > 80) rankIdx = 3;
        else if (roll + qualityBonus > 60) rankIdx = 2;
        else if (roll + qualityBonus > 30) rankIdx = 1;
        if (fame > 200 && Math.random() < 0.05) rankIdx = 5;
        if (forcedRank) rankIdx = RANKS.indexOf(forcedRank);
        const rank = RANKS[rankIdx];
        const RANK_STATS = [
            { powerBase: 15, powerVar: 10, salary: 50 },
            { powerBase: 40, powerVar: 20, salary: 120 },
            { powerBase: 100, powerVar: 50, salary: 300 },
            { powerBase: 300, powerVar: 150, salary: 800 },
            { powerBase: 800, powerVar: 400, salary: 2000 },
            { powerBase: 1500, powerVar: 1000, salary: 6000 }
        ];
        let basePower = RANK_STATS[rankIdx].powerBase + Math.floor(Math.random() * RANK_STATS[rankIdx].powerVar);
        let salary = RANK_STATS[rankIdx].salary;
        if (isRivalMember) salary = 0;
        const advClass = CLASSES_DATA[Math.floor(Math.random() * CLASSES_DATA.length)];
        let trait = TRAITS.find(t => t.id === 'normal');
        if (Math.random() < 0.5) {
            const specialTraits = TRAITS.filter(t => t.id !== 'normal');
            trait = specialTraits[Math.floor(Math.random() * specialTraits.length)];
        }
        const personality = PERSONALITIES[Math.floor(Math.random() * PERSONALITIES.length)];
        if (trait.id === 'greedy') { basePower = Math.floor(basePower * 1.3); salary = Math.floor(salary * 1.6); }
        if (trait.id === 'coward') { basePower = Math.floor(basePower * 0.7); }
        if (trait.id === 'heroic') { basePower = Math.floor(basePower * 1.1); }
        const equipment = WEAPONS[advClass.id][Math.floor(Math.random() * WEAPONS[advClass.id].length)];
        const flavor = BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)];
        const age = Math.floor(Math.random() * 6) + 16;
        return {
            id: Math.random().toString(36).substr(2, 9),
            name, rank, advClass, trait, personality, age,
            power: basePower,
            loyalty: 80 + Math.floor(Math.random() * 20),
            salary,
            equipment,
            equippedArtifactId: null,
            flavor,
            history: ['ギルドとの契約書に署名し、所属冒険者となった。']
        };
    };

    const generateRivals = (usedNames) => {
        const rivals = [];
        const RIVAL_ARCHETYPES = [
            { id: 'giant', style: 'military', namePrefix: '黄金の', nameSuffix: '獅子団', relation: 30, rankPool: ['A', 'B', 'B', 'C', 'C'] },
            { id: 'cunning', style: 'commerce', namePrefix: '漆黒の', nameSuffix: '梟', relation: 40, rankPool: ['C', 'C', 'D', 'D', 'E'] },
            { id: 'local', style: 'safety', namePrefix: '暁の', nameSuffix: '盾', relation: 60, rankPool: ['D', 'E', 'E'] }
        ];
        RIVAL_ARCHETYPES.forEach(archetype => {
            const members = [];
            archetype.rankPool.forEach(forcedRank => {
                const adv = generateAdventurer(0, 0, usedNames, forcedRank, true);
                members.push(adv);
                usedNames.push(adv.name);
            });
            const basePower = members.reduce((sum, m) => sum + m.power, 0) + (archetype.id === 'giant' ? 1000 : 0);
            rivals.push({
                id: `rival_${Math.random().toString(36).substr(2, 9)}`,
                name: `${archetype.namePrefix}${archetype.nameSuffix}`,
                type: archetype.id,
                style: archetype.style,
                power: basePower,
                members,
                relation: archetype.relation,
                isRevealed: false
            });
        });
        return rivals;
    };

    const generateQuest = (turn, favor) => {
        const type = QUEST_TYPES[Math.floor(Math.random() * QUEST_TYPES.length)];
        const level = Math.max(1, Math.floor(turn / 10) + 1);
        const favorBonus = 1 + (favor / 200);
        const reward = Math.floor(type.baseReward * level * favorBonus);
        const deposit = Math.random() < 0.4 ? Math.floor(reward * 0.2) : 0;
        const powerReq = Math.floor(type.baseReward * level / 5) + (Math.floor(Math.random() * 50));
        return {
            id: `quest_${Math.random().toString(36).substr(2, 9)}`,
            name: `${type.name} (Lv.${level})`,
            type: type.id,
            reward,
            deposit,
            powerReq: Math.floor(powerReq),
            desc: `${type.name}の依頼です。成功すれば街からの信頼も厚くなるでしょう。`,
            turnLimit: 4
        };
    };

    const generateReceptionist = (fame, notoriety, usedRepNames) => {
        let availableNames = REP_NAME_POOL.filter(n => !usedRepNames.includes(n));
        if (availableNames.length === 0) availableNames = REP_NAME_POOL;
        const baseName = availableNames[Math.floor(Math.random() * availableNames.length)];
        const REP_TYPES = [
            { type: 'normal', desc: '平凡な事務員。維持費が安く、堅実に仕事をこなす。', salaryBase: 100, hireBase: 100 },
            { type: 'recruiter', desc: '顔が広い元冒険者。有能な人材がギルドに加入しやすくなる。', salaryBase: 350, hireBase: 800 },
            { type: 'intelligence', desc: '裏社会の顔役。他ギルドへの工作成功率と防諜能力が劇的に上がる。', salaryBase: 500, hireBase: 1200 },
            { type: 'diplomat', desc: '交渉上手な看板娘。毎季節、他ギルドとの関係性が少しずつ改善される。', salaryBase: 400, hireBase: 1000 },
            { type: 'merchant', desc: 'やり手の商人。ギルド施設の毎季節の維持費を10%削減する。', salaryBase: 300, hireBase: 1000 }
        ];
        let roll = Math.random() * 100;
        const isMiracle = roll < 5;
        let pool = REP_TYPES.filter(t => {
            if (t.type === 'intelligence' && notoriety < 20) return false;
            if (t.type === 'diplomat' && fame < 30) return false;
            if (t.type === 'recruiter' && fame < 20) return false;
            if (t.type === 'merchant' && fame < 10) return false;
            return true;
        });
        if (pool.length === 0) pool = [REP_TYPES[0]];
        const typeObj = pool[Math.floor(Math.random() * pool.length)];
        let salary = Math.floor(typeObj.salaryBase * (0.8 + Math.random() * 0.4));
        let hireCost = Math.floor(typeObj.hireBase * (0.8 + Math.random() * 0.4));
        if (isMiracle) {
            salary = Math.floor(salary * 0.3);
            hireCost = Math.floor(hireCost * 0.5);
        }
        const prefix = isMiracle ? "訳ありの" : typeObj.type === 'normal' ? "新米の" : typeObj.type === 'intelligence' ? "影のある" : typeObj.type === 'merchant' ? "強欲な" : "熟練の";
        return {
            id: `rep_${Math.random().toString(36).substr(2, 9)}`,
            baseName: baseName,
            name: `${prefix}${baseName}`,
            type: typeObj.type,
            desc: typeObj.desc + (isMiracle ? " (訳あって格安で雇えるようだ)" : ""),
            salary,
            hireCost
        };
    };

    const calculatePartyPower = (partyIds, state) => {
        if (!partyIds || partyIds.length === 0) return { total: 0, warnings: [] };
        const partyAdvs = state.adventurers.filter(a => partyIds.includes(a.id));
        let pCount = { hot: 0, cool: 0, ambitious: 0, gentle: 0 };
        partyAdvs.forEach(a => { if (pCount[a.personality.id] !== undefined) pCount[a.personality.id]++; });
        let conflictHotCool = (pCount.hot > 0 && pCount.cool > 0);
        let conflictAmbitious = (pCount.ambitious > 1);
        let warnings = [];
        if (conflictHotCool) warnings.push("熱血と冷静の対立 (戦力低下)");
        if (conflictAmbitious) warnings.push("野心家の主導権争い (全体戦力低下)");
        let total = partyAdvs.reduce((sum, a) => {
            let p = a.power;
            if (state.alignment.military > 40 && a.advClass.id === 'warrior') p *= 1.2;
            if (a.equippedArtifactId) {
                const art = ARTIFACT_POOL.find(art => art.id === a.equippedArtifactId);
                if (art) p += art.powerBonus;
            }
            if (conflictHotCool && (a.personality.id === 'hot' || a.personality.id === 'cool')) {
                p *= 0.8;
            }
            return sum + p;
        }, 0);
        if (conflictAmbitious) { total *= 0.9; }
        if (state.masterSkills.leadership > 0) {
            const bonusRates = [0, 0.1, 0.25, 0.5];
            total = Math.floor(total * (1 + bonusRates[state.masterSkills.leadership]));
        }
        return { total: Math.floor(total), warnings };
    };

    // --- Components ---

    const TypewriterText = ({ text, speed = 50, onComplete, className }) => {
        const [displayedText, setDisplayedText] = React.useState("");
        const [index, setIndex] = React.useState(0);
        const [done, setDone] = React.useState(false);
        React.useEffect(() => { setDisplayedText(""); setIndex(0); setDone(false); }, [text]);
        React.useEffect(() => {
            if (index < text.length) {
                const timeout = setTimeout(() => {
                    setDisplayedText(prev => prev + text[index]);
                    setIndex(prev => prev + 1);
                }, speed);
                return () => clearTimeout(timeout);
            } else {
                setDone(true);
                if (onComplete) onComplete();
            }
        }, [index, text, speed, onComplete]);
        return html`<span className=${className}>${displayedText}${!done && html`<span className="typewriter-cursor"></span>`}</span>`;
    };

    const ConfettiEffect = ({ rank }) => {
        React.useEffect(() => {
            const colors = rank === 'S' ? ['#fbbf24', '#f59e0b', '#d97706', '#fff'] : ['#a855f7', '#7e22ce', '#9333ea', '#fff'];
            const container = document.createElement('div');
            container.style.position = 'absolute'; container.style.inset = '0'; container.style.pointerEvents = 'none'; container.style.zIndex = '100';
            document.querySelector('.gacha-glow-' + rank.toLowerCase())?.appendChild(container);
            for (let i = 0; i < 50; i++) {
                const c = document.createElement('div');
                c.className = 'confetti'; c.style.left = Math.random() * 100 + '%'; c.style.top = Math.random() * 100 + '%';
                c.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                c.style.transform = `rotate(${Math.random() * 360}deg)`;
                container.appendChild(c);
                const animation = c.animate([
                    { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                    { transform: `translate(${(Math.random() - 0.5) * 200}px, ${Math.random() * 200 + 100}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
                ], { duration: Math.random() * 1000 + 1000, easing: 'cubic-bezier(0, .9, .57, 1)' });
                animation.onfinish = () => c.remove();
            }
            return () => container.remove();
        }, [rank]);
        return null;
    };

    function HomeView({ gameState, currentGuildPower, currentYear, currentSeason, getReputationText, getFinancialReport, hireReceptionist, setSelectedCandidate, selectedCandidate, openSpecialRequestModal, declineSpecialRequest }) {
        const { Target, MessageSquare, AlertTriangle, ScrollText, Coins, HeartHandshake } = LucideReact;
        if (!Target) return null;
        const report = getFinancialReport(gameState);
        return html`
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                ${gameState.specialRequest && html`
                    <div className="bg-indigo-900 border border-indigo-700 p-5 rounded-sm shadow-md text-indigo-50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4"><${Target} className="w-48 h-48 text-indigo-400" /></div>
                        <h4 className="font-bold text-xl mb-2 flex items-center gap-2 text-indigo-200 relative z-10"><${Target} className="w-6 h-6" /> 指名依頼：${gameState.specialRequest.name}</h4>
                        <p className="text-sm text-indigo-100 mb-4 relative z-10 leading-relaxed">${gameState.specialRequest.desc}</p>
                        <div className="flex gap-4 text-sm font-bold mb-4 bg-indigo-950/50 p-3 rounded relative z-10">
                            <span>推奨戦力: <span className="text-rose-400">${gameState.specialRequest.powerReq}</span></span>
                            <span>報酬: <span className="text-amber-400">${gameState.specialRequest.reward}G</span></span>
                        </div>
                        <div className="flex gap-3 relative z-10">
                            <button onClick=${openSpecialRequestModal} className="bg-rose-700 hover:bg-rose-600 text-white px-4 py-2 rounded-sm font-bold shadow-sm active:scale-95 transition-all">特別部隊を編成する</button>
                            <button onClick=${declineSpecialRequest} className="bg-indigo-800 hover:bg-indigo-700 text-indigo-200 px-4 py-2 rounded-sm font-bold shadow-sm active:scale-95 transition-all">丁重に断る</button>
                        </div>
                    </div>
                `}
                <div className="bg-[#F2E8C6] border border-[#D4C3A3] p-4 rounded-sm shadow-sm relative">
                    <${MessageSquare} className="absolute top-4 left-4 w-6 h-6 text-amber-700/30" />
                    <p className="text-stone-700 italic pl-8 font-medium leading-relaxed">${gameState.currentRumor}</p>
                </div>
                ${gameState.currentEvent && html`
                    <div className="bg-amber-100 border-l-4 border-amber-500 p-4 rounded-sm shadow-sm flex items-start gap-3">
                        <${AlertTriangle} className="w-6 h-6 text-amber-600 shrink-0" />
                        <div>
                            <h4 className="font-bold text-amber-800">【世界情勢】${gameState.currentEvent.name}</h4>
                            <p className="text-sm text-amber-700">${gameState.currentEvent.desc}</p>
                        </div>
                    </div>
                `}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    <div className="bg-white p-5 border border-[#E8E0D5] rounded-sm shadow-sm flex flex-col">
                        <h3 className="text-lg font-bold text-stone-800 mb-3 flex items-center gap-2 border-b border-[#E8E0D5] pb-2"><${ScrollText} className="w-5 h-5 text-indigo-700" /> 街での評判と現状</h3>
                        <p className="text-stone-700 leading-relaxed font-medium mb-4 flex-1">
                            マスター、第 ${currentYear} 暦 【${currentSeason}】 の報告です。<br /><br />
                            現在の金庫には <span className="font-bold text-amber-600">${gameState.budget.toLocaleString()} G</span> の資金があります。
                            人員は ${gameState.adventurers.length} 名が所属しており、今季の主力部隊の戦力は ${currentGuildPower} と評価されています。<br /><br />
                            世間の評価についてですが、我がギルドは現在、<strong>${getReputationText()}</strong>
                        </p>
                    </div>
                    <div className="bg-stone-50 p-5 border border-[#D4C3A3] rounded-sm shadow-sm flex flex-col">
                        <h3 className="text-lg font-bold text-stone-800 mb-3 flex items-center gap-2 border-b border-[#D4C3A3] pb-2"><${Coins} className="w-5 h-5 text-amber-600" /> 次季の収支見込み</h3>
                        <div className="space-y-3 flex-1">
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs font-bold text-emerald-700"><span>商業・雑用収入 (見込)</span><span>+${report.totalIncome} G</span></div>
                                <div className="flex justify-between text-[10px] text-stone-500 pl-2"><span>- 酒場/宿屋収益</span><span>+${report.commerceIncome} G</span></div>
                                <div className="flex justify-between text-[10px] text-stone-500 pl-2"><span>- 待機メンバー雑用</span><span>+${report.choresIncome} G</span></div>
                            </div>
                            <div className="space-y-1 pt-1 border-t border-stone-200">
                                <div className="flex justify-between text-xs font-bold text-rose-700"><span>維持費・給与 (確定)</span><span>-${report.totalExpense} G</span></div>
                                <div className="flex justify-between text-[10px] text-stone-500 pl-2"><span>- 冒険者/受付給与</span><span>-${report.salaries} G</span></div>
                                <div className="flex justify-between text-[10px] text-stone-500 pl-2"><span>- 施設維持費</span><span>-${report.maintenance} G</span></div>
                            </div>
                            <div className="pt-2 border-t-2 border-stone-300 flex justify-between items-center">
                                <span className="text-sm font-bold text-stone-700">次季の純収支</span>
                                <span className=${`text-lg font-bold ${report.balance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>${report.balance >= 0 ? '+' : ''}${report.balance} G</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-stone-50 p-5 border border-[#D4C3A3] rounded-sm shadow-sm flex flex-col">
                        <h3 className="text-lg font-bold text-stone-800 mb-3 flex items-center gap-2 border-b border-[#D4C3A3] pb-2"><${HeartHandshake} className="w-5 h-5 text-rose-700" /> ギルド受付窓口</h3>
                        <div className="flex-1">
                            <div className="mb-4">
                                <div className="text-sm font-bold text-stone-600 mb-1">現在の受付担当</div>
                                <div className="text-lg font-bold text-indigo-800 mb-1">${gameState.receptionist.name}</div>
                                <p className="text-xs text-stone-600 leading-relaxed bg-white p-2 rounded border border-stone-200">${gameState.receptionist.desc} <span className="font-bold">(維持費: ${gameState.receptionist.salary}G)</span></p>
                            </div>
                            <div>
                                <div className="text-xs font-bold text-stone-500 mb-2">求人応募者</div>
                                <div className="grid grid-cols-1 gap-2 mb-3">
                                    ${gameState.availableReceptionists.map(rep => html`
                                        <button key=${rep.id} onClick=${() => setSelectedCandidate(rep.id === selectedCandidate?.id ? null : rep)} className=${`text-left p-2 border rounded text-xs transition-colors flex justify-between items-center ${selectedCandidate?.id === rep.id ? 'bg-indigo-50 border-indigo-300 font-bold text-indigo-800 shadow-sm' : 'bg-white hover:bg-stone-100 text-stone-700'}`}><span>${rep.name}</span></button>
                                    `)}
                                </div>
                                ${selectedCandidate && html`
                                    <div className="bg-white p-3 rounded border border-indigo-200 shadow-sm animate-in fade-in zoom-in-95 duration-200">
                                        <div className="font-bold text-indigo-800 text-sm mb-1">${selectedCandidate.name}</div>
                                        <p className="text-xs text-stone-600 mb-2">${selectedCandidate.desc}</p>
                                        <div className="flex justify-between items-center text-xs mb-3"><span>採用金: <span className="font-bold text-amber-600">${selectedCandidate.hireCost}G</span></span><span>維持費: <span className="font-bold text-stone-800">${selectedCandidate.salary}G/季</span></span></div>
                                        <button onClick=${() => { hireReceptionist(selectedCandidate); setSelectedCandidate(null); }} className="w-full bg-indigo-700 hover:bg-indigo-600 text-white py-2 rounded-sm font-bold transition-colors shadow-sm active:scale-95">採用する</button>
                                    </div>
                                `}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function QuestBoard({ gameState, acceptQuest }) {
        const { ScrollText, CheckCircle2 } = LucideReact;
        return html`
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div>
                    <h3 className="font-bold text-stone-800 mb-3 flex items-center gap-2"><${ScrollText} className="w-5 h-5 text-amber-600" /> 受注可能な依頼</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${gameState.availableQuests.map(q => {
                            const type = QUEST_TYPES.find(t => t.id === q.type);
                            const Icon = LucideReact[type.icon];
                            return html`
                                <div key=${q.id} className="bg-white border border-[#E8E0D5] p-4 rounded-sm shadow-sm flex flex-col hover:border-amber-400 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-stone-800 flex items-center gap-2"><${Icon} className="w-5 h-5 text-indigo-600" /> ${q.name}</h4>
                                        <span className="text-[10px] font-bold bg-stone-100 text-stone-500 px-2 py-1 rounded">期限: ${q.turnLimit}季</span>
                                    </div>
                                    <p className="text-xs text-stone-600 mb-4 flex-1">${q.desc}</p>
                                    <div className="grid grid-cols-2 gap-2 text-[11px] font-bold mb-4 bg-stone-50 p-2 rounded">
                                        <div className="text-rose-700">必要戦力: ${q.powerReq}</div>
                                        <div className="text-amber-600">報酬: ${q.reward}G</div>
                                        ${q.deposit > 0 && html`<div className="text-emerald-600 col-span-2">前金受領可: ${q.deposit}G</div>`}
                                    </div>
                                    <button onClick=${() => acceptQuest(q)} className="w-full bg-stone-800 hover:bg-stone-700 text-[#F2E8C6] py-2 rounded-sm font-bold text-xs shadow-sm transition-colors active:scale-95">この依頼を引き受ける</button>
                                </div>
                            `;
                        })}
                    </div>
                </div>
                ${gameState.activeQuests.length > 0 && html`
                    <div className="mt-8">
                        <h3 className="font-bold text-stone-800 mb-3 flex items-center gap-2"><${CheckCircle2} className="w-5 h-5 text-emerald-600" /> 遂行中の依頼</h3>
                        <div className="space-y-2">
                            ${gameState.activeQuests.map(q => html`<div key=${q.id} className="flex justify-between items-center p-3 bg-emerald-50 border border-emerald-200 rounded-sm"><div className="text-sm font-bold text-emerald-900">${q.name}</div><div className="text-[10px] font-bold text-emerald-700">残り期限: ${q.turnLimit}季</div></div>`)}
                        </div>
                    </div>
                `}
            </div>
        `;
    }

    function RosterView({ gameState, autoAssembleParty, searchAdventurer, setSelectedAdv }) {
        const { Swords, Shuffle, Search } = LucideReact;
        return html`
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="mb-6 shrink-0">
                    <div className="flex items-center justify-between mb-3 border-b border-[#D4C3A3] pb-2">
                        <h3 className="font-bold flex items-center gap-2 text-stone-700"><${Swords} className="w-5 h-5 text-indigo-600" /> 今季の主力部隊 (自動編成)</h3>
                        <div className="flex gap-2">
                            <button onClick=${autoAssembleParty} className="text-xs font-bold bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 px-3 py-1.5 rounded-sm flex items-center gap-1 transition-colors shadow-sm active:scale-95"><${Shuffle} className="w-3 h-3" /> おまかせ編成</button>
                            <span className="text-xs font-bold bg-indigo-100 text-indigo-800 px-3 py-1.5 rounded-sm flex items-center">編成: ${gameState.mainParty.length} / 5</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        ${Array.from({ length: 5 }).map((_, i) => {
                            const advId = gameState.mainParty[i];
                            const adv = gameState.adventurers.find(a => a.id === advId);
                            if (!adv) return html`<button key=${i} className="p-3 rounded-sm border bg-stone-100/50 border-stone-200 border-dashed cursor-default flex flex-col items-center justify-center h-[110px]"><span className="text-xs text-stone-400 font-bold">空き枠</span></button>`;
                            const AdvIcon = LucideReact[adv.advClass.icon];
                            return html`<button key=${i} onClick=${() => setSelectedAdv(adv)} className="p-3 rounded-sm border bg-indigo-50 border-indigo-300 shadow-sm hover:border-indigo-500 hover:-translate-y-0.5 flex flex-col items-center justify-center h-[110px] transition-all"><${AdvIcon} className="w-6 h-6 text-indigo-500 mb-1" /><span className="font-bold text-sm text-stone-800 text-center line-clamp-1 w-full">${adv.name}</span><span className="text-xs text-indigo-700 font-bold mt-1 bg-white px-2 py-0.5 rounded border border-indigo-100">戦力 ${adv.power}</span></button>`;
                        })}
                    </div>
                </div>
                <div className="flex-1 flex flex-col min-h-[300px]">
                    <div className="flex justify-between items-center mb-3 shrink-0"><p className="text-sm font-bold text-stone-600">所属冒険者一覧</p><div className="flex gap-2"><button onClick=${searchAdventurer} className="text-xs font-bold bg-amber-700 hover:bg-amber-600 text-white px-3 py-1.5 rounded-sm flex items-center gap-1.5 transition-all shadow-sm active:scale-95"><${Search} className="w-3.5 h-3.5" /> 人材を捜索 (500G)</button><span className="text-xs font-bold text-stone-600 bg-[#E8E0D5] px-2 py-1 rounded-sm border border-[#D4C3A3] flex items-center">所属: ${gameState.adventurers.length} / ${gameState.facilities.residence * 5} 名</span></div></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto pb-4 pr-1">
                        ${gameState.adventurers.map(adv => {
                            const isMain = gameState.mainParty.includes(adv.id);
                            const AdvIcon = LucideReact[adv.advClass.icon];
                            return html`<button key=${adv.id} onClick=${() => setSelectedAdv(adv)} className=${`p-3 bg-white border ${isMain ? 'border-indigo-300 ring-1 ring-indigo-100' : 'border-[#E8E0D5]'} rounded-sm shadow-sm flex justify-between items-center hover:border-amber-500 transition-all group text-left relative`}>${isMain && html`<div className="absolute -top-2 -right-2 bg-indigo-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">主力</div>`}<div><div className="text-sm font-bold text-stone-800 flex items-center gap-2 mb-1 group-hover:text-amber-700 transition-colors"><span className="truncate max-w-[90px]">${adv.name}</span><span className=${`text-[10px] px-1.5 py-0.5 rounded-sm font-bold border shrink-0 ${adv.rank === 'S' ? 'bg-amber-100 text-amber-800 border-amber-300' : adv.rank === 'A' ? 'bg-purple-100 text-purple-800 border-purple-300' : 'bg-stone-100 text-stone-600 border-stone-300'}`}>${adv.rank} 級</span></div><div className="text-[11px] font-medium flex items-center gap-1 text-indigo-700"><${AdvIcon} className="w-3 h-3" /> ${adv.advClass.name} <span className="text-stone-400">|</span> <span className="text-amber-700">${adv.personality.name}</span></div></div><div className="text-right shrink-0"><div className="text-sm font-bold text-stone-800">戦力 ${adv.power}</div><div className=${`text-[10px] font-bold mt-1 ${adv.loyalty < 30 ? 'text-rose-600' : 'text-emerald-700'}`}>忠誠 ${adv.loyalty}%</div></div></button>`;
                        })}
                    </div>
                </div>
            </div>
        `;
    }

    function AlignmentView({ gameState, updateAlignment }) {
        const { Shield, Map: MapIcon, Swords, Beer } = LucideReact;
        return html`
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <p className="text-stone-600 mb-4">ギルドの方向性を決定します。この比率に応じて、自動編成される部隊が向かう任務の確率が変化します。</p>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div className="bg-white p-5 border border-[#E8E0D5] rounded-sm shadow-sm space-y-6">
                        ${[
                            { id: 'safety', label: '街の治安維持', icon: Shield, color: 'text-emerald-700' },
                            { id: 'adventure', label: '未開の地の探索', icon: MapIcon, color: 'text-indigo-700' },
                            { id: 'military', label: '他領への軍事侵攻', icon: Swords, color: 'text-rose-800' },
                            { id: 'commerce', label: '商業と内政', icon: Beer, color: 'text-amber-600' }
                        ].map(item => html`
                            <div key=${item.id}>
                                <div className="flex justify-between text-sm mb-2 font-bold"><span className=${`flex items-center gap-2 ${item.color}`}><${item.icon} className="w-5 h-5" /> ${item.label}</span><span className="text-stone-700 text-lg">${gameState.alignment[item.id]}%</span></div>
                                <input type="range" min="0" max="100" value=${gameState.alignment[item.id]} onChange=${(e) => updateAlignment(item.id, e.target.value)} className="w-full h-2 bg-[#E8E0D5] rounded-full appearance-none cursor-pointer accent-stone-700" />
                            </div>
                        `)}
                    </div>
                </div>
            </div>
        `;
    }

    function DungeonView({ gameState, setGameState }) {
        const { Compass, Coins } = LucideReact;
        return html`
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                <p className="text-stone-600 mb-4">探索で発見した未踏の迷宮です。</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${gameState.discoveredDungeons.map(d => html`
                        <div key=${d.id} className=${`p-4 border rounded-sm shadow-sm transition-all flex flex-col ${gameState.targetDungeon === d.id ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-200' : 'bg-white border-[#E8E0D5]'}`}>
                            <div className="flex justify-between items-center mb-3"><h4 className="font-bold text-lg text-stone-800 flex items-center gap-1.5"><${Compass} className="w-5 h-5 text-indigo-600" /> ${d.name}</h4><button onClick=${() => setGameState(prev => ({ ...prev, targetDungeon: d.id }))} className=${`text-xs font-bold px-3 py-1.5 rounded-sm border transition-colors ${gameState.targetDungeon === d.id ? 'bg-indigo-200 text-indigo-700' : 'bg-stone-100 text-stone-600 border-stone-300'}`}>${gameState.targetDungeon === d.id ? '目標に設定中' : '目標に設定'}</button></div>
                            <p className="text-sm text-stone-600 mb-4 flex-1">${d.desc}</p>
                            <div className="flex justify-between text-sm font-bold bg-white p-2 rounded-sm border border-stone-100 mt-auto"><span className="text-rose-700">推奨戦力: ${d.powerReq}</span><span className="text-amber-600 flex items-center gap-1"><${Coins} className="w-4 h-4" /> 報酬: ${d.reward}G</span></div>
                        </div>
                    `)}
                </div>
            </div>
        `;
    }

    function FacilityView({ gameState, investFacility }) {
        const { Users, Coins, Dumbbell } = LucideReact;
        const facilities = [
            { id: 'residence', label: '居住区', icon: Users, details: '最大収容人数が増加します。' },
            { id: 'tavern', label: '酒場と宿屋', icon: Coins, details: '毎季節の固定収入が増加します。' },
            { id: 'training', label: '訓練場', icon: Dumbbell, details: '経験値の底上げ。' }
        ];
        return html`<div className="grid grid-cols-1 md:grid-cols-3 gap-4">${facilities.map(fac => html`<div key=${fac.id} className="bg-white border border-[#E8E0D5] p-4 rounded-sm shadow-sm flex flex-col"><div className="flex items-center gap-3 mb-3 border-b border-stone-100 pb-3"><div className="bg-stone-100 p-2 rounded-sm"><${fac.icon} className="w-6 h-6" /></div><div><div className="font-bold text-stone-800 text-lg">${fac.label}</div><div className="text-sm font-bold text-indigo-700">Lv. ${gameState.facilities[fac.id]}</div></div></div><p className="text-xs text-stone-600 mb-4 flex-1">${fac.details}</p><button onClick=${() => investFacility(fac.id)} className="w-full bg-stone-800 hover:bg-stone-700 text-white py-2 rounded-sm font-bold text-sm shadow-sm active:scale-95">投資して拡張</button></div>`)}</div>`;
    }

    function ShopView({ gameState, investShop }) {
        const { Hammer, Wand2, ShoppingBag } = LucideReact;
        const shops = [
            { id: 'blacksmith', label: '鍛冶屋', icon: Hammer, details: '成功率向上。' },
            { id: 'magicShop', label: '魔法屋', icon: Wand2, details: '死亡リスク低下。' },
            { id: 'itemShop', label: '道具屋', icon: ShoppingBag, details: '維持費割引。' }
        ];
        return html`<div className="grid grid-cols-1 md:grid-cols-3 gap-4">${shops.map(shop => html`<div key=${shop.id} className="bg-white border border-[#E8E0D5] p-4 rounded-sm shadow-sm flex flex-col"><div className="flex items-center gap-3 mb-3 border-b border-stone-100 pb-3"><div className="bg-stone-100 p-2 rounded-sm"><${shop.icon} className="w-6 h-6" /></div><div><div className="font-bold text-stone-800 text-lg">${shop.label}</div><div className="text-sm font-bold text-amber-700">契約Lv. ${gameState.shops[shop.id]}</div></div></div><p className="text-xs text-stone-600 mb-4 flex-1">${shop.details}</p><button onClick=${() => investShop(shop.id)} className="w-full bg-amber-700 hover:bg-amber-600 text-white py-2 rounded-sm font-bold text-sm active:scale-95">提携を強化 (1000G)</button></div>`)}</div>`;
    }

    function IntrigueView({ gameState, sabotageRival, headhuntRival, gatherIntelligence, getIntrigueChance, setSelectedAdv }) {
        const { Search, EyeOff } = LucideReact;
        return html`<div className="space-y-4">${gameState.rivals.map(rival => html`<div key=${rival.id} className="bg-white border border-[#E8E0D5] p-4 rounded-sm shadow-sm flex flex-col relative overflow-hidden"><div className="absolute top-0 left-0 w-full h-1 bg-stone-200"><div className=${`h-full transition-all ${rival.relation >= 80 ? 'bg-emerald-500' : rival.relation >= 40 ? 'bg-amber-500' : 'bg-rose-600'}`} style=${{ width: `${rival.relation}%` }}></div></div><div className="flex justify-between items-center mt-2"><span className="font-bold text-lg text-stone-800">${rival.name}</span><div className="flex gap-2"><button onClick=${() => sabotageRival(rival.id)} className="bg-stone-800 text-white px-3 py-1 rounded-sm text-xs font-bold active:scale-95">工作</button><button onClick=${() => gatherIntelligence(rival.id)} className="bg-indigo-700 text-white px-3 py-1 rounded-sm text-xs font-bold active:scale-95">諜報</button></div></div><div className="text-xs text-stone-500 mt-2">友好度: ${rival.relation} | 推定戦力: ${rival.power}</div></div>`)}</div>`;
    }

    function SkillView({ gameState, upgradeSkill }) {
        const { Crown } = LucideReact;
        return html`<div className="grid grid-cols-1 md:grid-cols-2 gap-4">${Object.entries(MASTER_SKILLS).map(([key, skill]) => html`<div key=${key} className="bg-white p-5 border border-[#E8E0D5] rounded-sm shadow-sm flex flex-col"><div className="flex justify-between items-start mb-2"><h4 className="font-bold text-lg text-stone-800 flex items-center gap-2"><${Crown} className="w-5 h-5 text-amber-500" /> ${skill.name}</h4><span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded">Lv. ${gameState.masterSkills[key]}</span></div><p className="text-sm text-stone-600 mb-4 flex-1">${skill.desc}</p><button onClick=${() => upgradeSkill(key, 3000)} className="w-full bg-stone-800 text-white py-2 rounded-sm font-bold text-sm active:scale-95">才能を開花させる</button></div>`)}</div>`;
    }

    function AchievementView({ gameState }) {
        const { Trophy } = LucideReact;
        return html`<div className="grid grid-cols-1 md:grid-cols-2 gap-4">${ACHIEVEMENTS.map(ach => { const isUnlocked = gameState.unlockedAchievements.includes(ach.id); const AchIcon = LucideReact[ach.icon]; return html`<div key=${ach.id} className=${`p-4 rounded-sm border flex items-center gap-4 ${isUnlocked ? 'bg-white border-[#D4C3A3]' : 'bg-stone-100 border-stone-200 opacity-60 grayscale'}`}><div className=${`p-3 rounded-full ${isUnlocked ? 'bg-amber-100 text-amber-600' : 'bg-stone-200'}`}><${AchIcon} className="w-6 h-6" /></div><div><div className="font-bold text-stone-800">${isUnlocked ? ach.name : '？？？'}</div><div className="text-xs text-stone-500">${isUnlocked ? ach.desc : '未達成'}</div></div></div>`; })}</div>`;
    }

    function LogView({ logs, logsEndRef }) {
        const { Activity } = LucideReact;
        return html`<div className="flex flex-col h-[500px] bg-white p-4 border border-[#E8E0D5] rounded-sm shadow-inner overflow-y-auto space-y-2">${logs.map(log => html`<div key=${log.id} className="p-3 rounded-sm border text-sm flex gap-3 shadow-sm border-stone-200 bg-white"><span>${log.msg}</span></div>`)}<div ref=${logsEndRef} /></div>`;
    }

    function DecisionView({ canUsurp, sellGuild, usurpThrone, resetGame, currentGuildPower }) {
        const { Landmark, Crown, AlertTriangle } = LucideReact;
        return html`<div className="space-y-6 max-w-xl"><div className="bg-white p-5 border border-[#E8E0D5] rounded-sm shadow-sm flex items-start gap-4"><div className="bg-amber-100 p-3 rounded-sm text-amber-700"><${Landmark} className="w-8 h-8" /></div><div className="flex-1"><h4 className="font-bold text-stone-800 text-lg mb-1">ギルドを売却して引退</h4><button onClick=${sellGuild} className="bg-stone-800 text-white px-4 py-2 rounded-sm font-bold text-sm active:scale-95">売却を実行</button></div></div><div className=${`p-5 border rounded-sm shadow-sm flex items-start gap-4 ${canUsurp ? 'bg-rose-50 border-rose-200' : 'bg-stone-50 opacity-60'}`}><div className=${`p-3 rounded-sm ${canUsurp ? 'bg-rose-200 text-rose-800' : 'bg-stone-200'}`}><${Crown} className="w-8 h-8" /></div><div className="flex-1"><h4 className="font-bold text-lg text-stone-800 mb-1">国家転覆（王都進軍）</h4><button onClick=${usurpThrone} disabled=${!canUsurp} className=${`px-4 py-2 rounded-sm font-bold text-sm ${canUsurp ? 'bg-rose-700 text-white' : 'bg-stone-300 text-stone-500'}`}>進軍を開始</button></div></div><button onClick=${resetGame} className="text-rose-600 text-sm font-bold underline">セーブデータを消去して初めから</button></div>`;
    }

    function BossView({ gameState, currentGuildPower, requestAlliance, fightBoss }) {
        const { Skull } = LucideReact;
        if (!gameState.activeBoss) return null;
        return html`<div className="space-y-6"><div className="bg-rose-950 p-6 rounded-sm text-rose-50 text-center"><h3 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2"><${Skull} className="w-8 h-8 text-rose-400" /> 厄災襲来: ${gameState.activeBoss.name}</h3><p className="mb-6"><${TypewriterText} text=${gameState.activeBoss.desc} /></p><button onClick=${fightBoss} className="w-full bg-rose-700 hover:bg-rose-600 text-white py-4 rounded-sm font-bold text-xl active:scale-95">決戦開始</button></div></div>`;
    }

    function AdventurerModal({ selectedAdv, setSelectedAdv, gameState, fireAdventurer, toggleMainParty, handleEquipArtifact }) {
        const { X: XIcon } = LucideReact;
        if (!selectedAdv) return null;
        const isMain = gameState.mainParty.includes(selectedAdv.id);
        const AdvIcon = LucideReact[selectedAdv.advClass.icon];
        return html`<div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[70] p-4 backdrop-blur-sm"><div className="bg-[#FAF8F5] border-2 border-[#D4C3A3] rounded-sm max-w-md w-full shadow-2xl p-6 relative flex flex-col"><button onClick=${() => setSelectedAdv(null)} className="absolute top-4 right-4"><${XIcon} className="w-6 h-6 text-stone-400" /></button><div className="flex items-center gap-3 mb-4"><div className="bg-indigo-100 p-2 rounded-sm"><${AdvIcon} className="w-8 h-8 text-indigo-700" /></div><h2 className="text-2xl font-bold text-stone-800">${selectedAdv.name}</h2></div><div className="space-y-4"><p className="text-stone-700 italic border-l-4 border-stone-200 pl-4">${selectedAdv.flavor}</p><div className="grid grid-cols-2 gap-2 text-sm"><div className="bg-white p-2 border">戦力: ${selectedAdv.power}</div><div className="bg-white p-2 border">忠誠: ${selectedAdv.loyalty}%</div></div></div><div className="mt-8 flex gap-2"><button onClick=${toggleMainParty} className=${`flex-1 py-2 rounded-sm font-bold ${isMain ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-indigo-700 text-white'}`}>${isMain ? '主力から外す' : '主力に編成'}</button><button onClick=${fireAdventurer} className="px-4 py-2 border border-rose-300 text-rose-600 rounded-sm font-bold">解雇</button></div></div></div>`;
    }

    function ActionModal({ actionModal }) {
        if (!actionModal) return null;
        return html`<div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[80] p-4 backdrop-blur-md"><div className="bg-stone-900 border-2 border-amber-500 rounded-sm shadow-2xl p-8 max-w-md w-full text-center">${actionModal.foundRank && (actionModal.foundRank === 'S' || actionModal.foundRank === 'A') && html`<${ConfettiEffect} rank=${actionModal.foundRank} />`}<p className="text-xl font-bold text-amber-50 leading-relaxed">${actionModal.message}</p></div></div>`;
    }

    function QuarterResultModal({ quarterResult, getSummaryIcon, setQuarterResult, setCurrentView, activeBoss }) {
        if (!quarterResult) return null;
        const { ScrollText } = LucideReact;
        return html`<div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4 backdrop-blur-sm"><div className="bg-[#FAF8F5] border-2 border-[#D4C3A3] rounded-sm max-w-lg w-full shadow-2xl flex flex-col"><div className="p-4 bg-[#E8E0D5] font-bold text-center border-b border-[#D4C3A3]"><${ScrollText} className="w-5 h-5 inline mr-2 text-indigo-700" /> 第 ${quarterResult.year} 暦 【${quarterResult.season}】 報告</div><div className="p-6 overflow-y-auto max-h-[60vh] space-y-3">${quarterResult.items.map((item, i) => html`<div key=${i} className="flex gap-3 text-sm text-stone-700 bg-white p-2 border rounded-sm"><div className="mt-0.5">${getSummaryIcon(item.type)}</div><div className="whitespace-pre-wrap">${item.text}</div></div>`)}</div><div className="p-4 bg-stone-100 flex justify-between font-bold text-xs"><span>金庫: ${quarterResult.budget}G</span><span>名声: ${quarterResult.fame}</span></div><button onClick=${() => { setQuarterResult(null); if (activeBoss) setCurrentView('boss'); }} className="p-4 bg-stone-800 text-white font-bold active:scale-95">確認</button></div></div>`;
    }

    function SpecialRequestModal({ reqModalOpen, setReqModalOpen, gameState, reqParty, handleToggleReqParty, executeSpecialRequest, calculatePartyPower }) {
        if (!reqModalOpen) return null;
        const { Target } = LucideReact;
        const { total: reqPower } = calculatePartyPower(reqParty, gameState);
        return html`<div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm"><div className="bg-[#FAF8F5] border-2 border-[#D4C3A3] rounded-sm max-w-2xl w-full p-6 flex flex-col"><h2 className="text-xl font-bold text-indigo-800 mb-4 flex items-center gap-2"><${Target} className="w-6 h-6" /> 特別指名依頼 部隊編成</h2><div className="bg-white p-4 border rounded-sm mb-4"><div className="font-bold text-rose-600">目標: ${gameState.specialRequest.name} | 推奨戦力: ${gameState.specialRequest.powerReq}</div><div className="text-2xl font-bold mt-2">編成戦力: ${reqPower}</div></div><div className="flex-1 overflow-y-auto space-y-2 mb-4">${gameState.adventurers.map(adv => { const isSelected = reqParty.includes(adv.id); return html`<div key=${adv.id} onClick=${() => handleToggleReqParty(adv)} className=${`p-3 border rounded flex justify-between cursor-pointer ${isSelected ? 'bg-indigo-50 border-indigo-400' : 'bg-white'}`}><span className="font-bold">${adv.name}</span><span>戦力 ${adv.power}</span></div>`; })}</div><div className="flex gap-2"><button onClick=${() => setReqModalOpen(false)} className="px-4 py-2 border font-bold">戻る</button><button onClick=${executeSpecialRequest} disabled=${reqParty.length === 0} className="flex-1 py-2 bg-rose-700 text-white font-bold rounded-sm">出撃</button></div></div></div>`;
    }

    function HowToPlayModal({ showHowToPlay, setShowHowToPlay }) {
        const { BookOpen, X: XIcon } = LucideReact;
        if (!showHowToPlay) return null;
        return html`<div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 backdrop-blur-sm"><div className="bg-white border-2 border-stone-800 rounded-sm max-w-2xl w-full p-8 relative overflow-y-auto max-h-[80vh]"><button onClick=${() => setShowHowToPlay(false)} className="absolute top-4 right-4"><${XIcon} className="w-6 h-6" /></button><h3 className="text-2xl font-bold mb-6 flex items-center gap-2"><${BookOpen} className="w-6 h-6 text-amber-500" /> 指南書</h3><div className="space-y-6 text-stone-700"><section><h4 className="font-bold border-b mb-2">基本</h4><p>季節を進め、ギルドを運営します。資金が底をつくと破産です。</p></section></div><button onClick=${() => setShowHowToPlay(false)} className="mt-8 w-full py-2 bg-stone-800 text-white font-bold">閉じる</button></div></div>`;
    }

    function EndingView({ gameState, quarterResult, resetGame }) {
        const { Crown } = LucideReact;
        if (!gameState.gameOver || quarterResult) return null;
        return html`<div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[100] p-4 text-center"><div className="max-w-xl"><${Crown} className="w-24 h-24 text-amber-500 mx-auto mb-8" /><h1 className="text-5xl font-bold text-white mb-8">${gameState.endType === 'SELL' ? '伝説の商人' : '栄光の終焉'}</h1><p className="text-stone-300 text-lg mb-12">${gameState.endType === 'SELL' ? 'ギルドを売却し、悠々自適の余生へ。' : '物語は幕を閉じました。'}</p><button onClick=${resetGame} className="px-10 py-4 bg-amber-500 text-stone-900 font-bold text-xl rounded-sm">初めから</button></div></div>`;
    }

    // --- Main App Component ---

    function App() {
        const { useState, useEffect, useRef } = React;
        const [gameState, setGameState] = useState(INITIAL_GAME_STATE);
        const [logs, setLogs] = useState([]);
        const [isLoaded, setIsLoaded] = useState(false);
        const [currentView, setCurrentView] = useState('title');
        const [selectedAdv, setSelectedAdv] = useState(null);
        const [selectedCandidate, setSelectedCandidate] = useState(null);
        const [quarterResult, setQuarterResult] = useState(null);
        const [reqModalOpen, setReqModalOpen] = useState(false);
        const [reqParty, setReqParty] = useState([]);
        const [showHowToPlay, setShowHowToPlay] = useState(false);
        const [actionModal, setActionModal] = useState(null);
        const [isMuted, setIsMuted] = useState(true);
        const logsEndRef = useRef(null);

        const hasSaveData = !!localStorage.getItem(SAVE_KEY);

        useEffect(() => {
            const savedData = localStorage.getItem(SAVE_KEY);
            if (savedData) {
                try {
                    const parsed = JSON.parse(savedData);
                    if (parsed.gameState) {
                        setGameState({ ...INITIAL_GAME_STATE, ...parsed.gameState });
                        setLogs(parsed.logs || []);
                    }
                } catch (e) { console.error("Load failed", e); }
            }
            setIsLoaded(true);
        }, []);

        useEffect(() => {
            if (isLoaded && currentView !== 'title') {
                localStorage.setItem(SAVE_KEY, JSON.stringify({ gameState, logs }));
            }
        }, [gameState, logs, isLoaded, currentView]);

        const addLog = (msg, type = "normal") => {
            setLogs(prev => [...prev, { id: Date.now() + Math.random(), msg, type }].slice(-100));
        };

        const startNewGame = () => {
            let freshState = { ...INITIAL_GAME_STATE };
            const initialAdv = generateAdventurer(0, 0, [], 'D');
            freshState.adventurers = [initialAdv];
            freshState.mainParty = [initialAdv.id];
            freshState.usedNames = [initialAdv.name];
            freshState.rivals = generateRivals([]);
            const rep1 = generateReceptionist(0, 0, []);
            freshState.availableReceptionists = [rep1];
            setGameState(freshState);
            setLogs([{ id: Date.now(), msg: "新たなギルドの歴史が始まりました。", type: "info" }]);
            setCurrentView('home');
            GeminiAudio.init();
            GeminiAudio.playBGM('home');
        };

        const resetGame = () => {
            if (window.confirm("初期化しますか？")) {
                localStorage.removeItem(SAVE_KEY);
                window.location.reload();
            }
        };

        const processTurn = () => {
            if (gameState.gameOver) return;
            GeminiAudio.playSE('click');
            setGameState(prev => {
                let next = { ...prev, turn: prev.turn + 1 };
                let year = Math.floor(prev.turn / 4) + 1;
                let season = SEASONS[prev.turn % 4];
                let items = [{ type: 'info', text: `第 ${year} 暦 【${season}】 が始まりました。` }];
                const report = getFinancialReport(prev);
                next.budget -= report.totalExpense;
                next.budget += report.totalIncome;
                items.push({ type: 'finance', text: `今季収支: ${report.totalIncome - report.totalExpense}G` });
                setQuarterResult({ year, season, items, budget: next.budget, fame: next.fame, notoriety: next.notoriety, isGameOver: false });
                return next;
            });
        };

        const getFinancialReport = (state) => {
            const salaries = (state.adventurers || []).reduce((sum, a) => sum + (a.salary || 0), 0) + (state.receptionist?.salary || 0);
            const maintenance = (state.facilities?.residence || 1) * 100;
            const commerceIncome = (state.facilities?.tavern || 1) * 200;
            const totalIncome = commerceIncome;
            const totalExpense = salaries + maintenance;
            return { salaries, maintenance, totalIncome, totalExpense, balance: totalIncome - totalExpense, choresIncome: 0, commerceIncome };
        };

        const getReputationText = () => "街に馴染み始めた新進気鋭のギルドです。";

        const updateAlignment = (id, val) => {
            setGameState(prev => ({ ...prev, alignment: { ...prev.alignment, [id]: parseInt(val) } }));
        };

        const searchAdventurer = () => {
            if (gameState.budget < 500) return addLog("資金不足", "warning");
            setActionModal({ message: "人材を探しています..." });
            setTimeout(() => {
                const newAdv = generateAdventurer(gameState.fame, gameState.notoriety, gameState.usedNames);
                setGameState(prev => ({ ...prev, budget: prev.budget - 500, adventurers: [...prev.adventurers, newAdv], usedNames: [...prev.usedNames, newAdv.name] }));
                setActionModal({ message: `${newAdv.name} が加入しました！`, foundRank: newAdv.rank });
                setTimeout(() => setActionModal(null), 3000);
            }, 1500);
        };

        const fireAdventurer = () => {
            if (!selectedAdv) return;
            setGameState(prev => ({ ...prev, adventurers: prev.adventurers.filter(a => a.id !== selectedAdv.id), mainParty: prev.mainParty.filter(id => id !== selectedAdv.id) }));
            setSelectedAdv(null);
        };

        const toggleMainParty = () => {
            if (!selectedAdv) return;
            setGameState(prev => {
                const isMain = prev.mainParty.includes(selectedAdv.id);
                if (isMain) return { ...prev, mainParty: prev.mainParty.filter(id => id !== selectedAdv.id) };
                if (prev.mainParty.length >= 5) return prev;
                return { ...prev, mainParty: [...prev.mainParty, selectedAdv.id] };
            });
        };

        const investFacility = (id) => {
            if (gameState.budget < 1000) return addLog("資金不足", "warning");
            setGameState(prev => ({ ...prev, budget: prev.budget - 1000, facilities: { ...prev.facilities, [id]: prev.facilities[id] + 1 } }));
        };

        const investShop = (id) => {
            if (gameState.budget < 1000) return addLog("資金不足", "warning");
            setGameState(prev => ({ ...prev, budget: prev.budget - 1000, shops: { ...prev.shops, [id]: prev.shops[id] + 1 } }));
        };

        const upgradeSkill = (id, cost) => {
            if (gameState.budget < cost) return addLog("資金不足", "warning");
            setGameState(prev => ({ ...prev, budget: prev.budget - cost, masterSkills: { ...prev.masterSkills, [id]: prev.masterSkills[id] + 1 } }));
        };

        const acceptQuest = (q) => {
            setGameState(prev => ({ ...prev, activeQuests: [...prev.activeQuests, q], availableQuests: prev.availableQuests.filter(x => x.id !== q.id) }));
        };

        const handleToggleReqParty = (adv) => {
            setReqParty(prev => prev.includes(adv.id) ? prev.filter(id => id !== adv.id) : prev.length < 5 ? [...prev, adv.id] : prev);
        };

        const executeSpecialRequest = () => {
            setGameState(prev => ({ ...prev, specialRequest: null }));
            setReqModalOpen(false);
            addLog("特別任務に出撃しました。");
        };

        const hireReceptionist = (rep) => {
            if (gameState.budget < rep.hireCost) return addLog("資金不足", "warning");
            setGameState(prev => ({
                ...prev,
                budget: prev.budget - rep.hireCost,
                receptionist: rep,
                availableReceptionists: prev.availableReceptionists.filter(r => r.id !== rep.id)
            }));
            addLog(`${rep.name}を雇用しました。`, "success");
        };

        const autoAssembleParty = () => {
            setGameState(prev => {
                const sorted = [...prev.adventurers].sort((a, b) => b.power - a.power);
                return { ...prev, mainParty: sorted.slice(0, 5).map(a => a.id) };
            });
            addLog("部隊を自動編成しました。");
        };

        const sabotageRival = (id) => {
            if (gameState.budget < 500) return addLog("資金不足", "warning");
            setGameState(prev => ({
                ...prev,
                budget: prev.budget - 500,
                notoriety: prev.notoriety + 5,
                rivals: prev.rivals.map(r => r.id === id ? { ...r, relation: Math.max(0, r.relation - 10), power: Math.max(0, r.power - 100) } : r)
            }));
            addLog("ライバルギルドに工作を行いました。");
        };

        const gatherIntelligence = (id) => {
            if (gameState.budget < 300) return addLog("資金不足", "warning");
            setGameState(prev => ({
                ...prev,
                budget: prev.budget - 300,
                rivals: prev.rivals.map(r => r.id === id ? { ...r, isRevealed: true } : r)
            }));
            addLog("ライバルギルドの情報を収集しました。");
        };

        const getSummaryIcon = (type) => {
            const { Activity, Coins, Skull } = LucideReact;
            if (type === 'finance') return html`<${Coins} className="w-4 h-4 text-amber-500" />`;
            if (type === 'danger') return html`<${Skull} className="w-4 h-4 text-rose-500" />`;
            return html`<${Activity} className="w-4 h-4 text-indigo-500" />`;
        };

        if (!isLoaded) return html`<div className="min-h-screen bg-stone-900 flex items-center justify-center text-white">Loading...</div>`;

        const currentYear = Math.floor(gameState.turn / 4) + 1;
        const currentSeason = SEASONS[gameState.turn % 4];
        const { total: currentGuildPower } = calculatePartyPower(gameState.mainParty, gameState);
        const canUsurp = currentGuildPower >= 1000 && gameState.notoriety >= 50;

        const { Home, ScrollText, Users, Activity: ActivityIcon, Compass, Dumbbell, ShoppingBag, EyeOff, Crown: CrownIcon, Trophy, BookOpen, Volume2, VolumeX, Target: TargetIcon, Coins: CoinsIcon, Skull: SkullIcon, Swords } = LucideReact;

        const renderView = () => {
            const props = { 
                gameState, setGameState, currentGuildPower, currentYear, currentSeason, 
                getReputationText, getFinancialReport, hireReceptionist, setSelectedCandidate, 
                selectedCandidate, openSpecialRequestModal: ()=>setReqModalOpen(true), 
                declineSpecialRequest: ()=>setGameState(p=>({...p,specialRequest:null})), 
                acceptQuest, autoAssembleParty, searchAdventurer, setSelectedAdv, 
                updateAlignment, investFacility, investShop, upgradeSkill, canUsurp, 
                sellGuild: ()=>setGameState(p=>({...p,gameOver:true,endType:'SELL',endData:10000})), 
                usurpThrone: ()=>setGameState(p=>({...p,gameOver:true,endType:'USURP_WIN'})), 
                resetGame, logs, logsEndRef, calculatePartyPower, sabotageRival, 
                gatherIntelligence, requestAlliance: ()=>addLog("同盟要請"), 
                fightBoss: ()=>addLog("ボス戦開始"), getIntrigueChance: (b)=>b, 
                headhuntRival: (id)=>addLog("引き抜き") 
            };
            switch (currentView) {
                case 'home': return html`<${HomeView} ...${props} />`;
                case 'quests': return html`<${QuestBoard} ...${props} />`;
                case 'roster': return html`<${RosterView} ...${props} />`;
                case 'alignment': return html`<${AlignmentView} ...${props} />`;
                case 'dungeons': return html`<${DungeonView} ...${props} />`;
                case 'facilities': return html`<${FacilityView} ...${props} />`;
                case 'shops': return html`<${ShopView} ...${props} />`;
                case 'intrigue': return html`<${IntrigueView} ...${props} />`;
                case 'skills': return html`<${SkillView} ...${props} />`;
                case 'achievements': return html`<${AchievementView} ...${props} />`;
                case 'boss': return html`<${BossView} ...${props} />`;
                case 'logs': return html`<${LogView} ...${props} />`;
                case 'decision': return html`<${DecisionView} ...${props} />`;
                default: return null;
            }
        };

        return html`
            <div className="min-h-screen text-stone-800 font-serif flex flex-col bg-[#FAF8F5]">
                ${currentView === 'title' ? html`
                    <div className="min-h-screen flex items-center justify-center bg-stone-900 text-[#F2E8C6]">
                        <div className="text-center p-10 border-2 border-[#D4C3A3]">
                            <${CrownIcon} className="w-16 h-16 mx-auto mb-4 text-amber-400" />
                            <h1 className="text-5xl font-bold tracking-widest mb-10">GUILD MASTER</h1>
                            <button onClick=${startNewGame} className="w-full bg-amber-700 text-white py-4 font-bold rounded-sm mb-4">新たな歴史を紡ぐ</button>
                            ${hasSaveData && html`<button onClick=${() => setCurrentView('home')} className="w-full bg-indigo-700 text-white py-4 font-bold rounded-sm">続きから始める</button>`}
                        </div>
                    </div>
                ` : html`
                    <div className="flex flex-col h-screen">
                        <header className="bg-stone-900 text-white p-4 flex justify-between items-center shrink-0">
                            <div className="font-bold text-xl tracking-widest">GUILD MASTER</div>
                            <div className="text-xs text-stone-400">YEAR ${currentYear} ${currentSeason}</div>
                        </header>
                        <main className="flex-1 flex overflow-hidden">
                            <nav className="w-64 bg-stone-100 border-r overflow-y-auto p-2 space-y-1">
                                <button onClick=${() => setCurrentView('home')} className="w-full p-2 text-left hover:bg-stone-200 rounded">本部</button>
                                <button onClick=${() => setCurrentView('quests')} className="w-full p-2 text-left hover:bg-stone-200 rounded">依頼</button>
                                <button onClick=${() => setCurrentView('roster')} className="w-full p-2 text-left hover:bg-stone-200 rounded">名簿</button>
                                <button onClick=${() => setCurrentView('alignment')} className="w-full p-2 text-left hover:bg-stone-200 rounded">方針</button>
                                <button onClick=${() => setCurrentView('dungeons')} className="w-full p-2 text-left hover:bg-stone-200 rounded">迷宮</button>
                                <button onClick=${() => setCurrentView('facilities')} className="w-full p-2 text-left hover:bg-stone-200 rounded">施設</button>
                                <button onClick=${() => setCurrentView('shops')} className="w-full p-2 text-left hover:bg-stone-200 rounded">提携</button>
                                <button onClick=${() => setCurrentView('intrigue')} className="w-full p-2 text-left hover:bg-stone-200 rounded">諜報</button>
                                <button onClick=${() => setCurrentView('skills')} className="w-full p-2 text-left hover:bg-stone-200 rounded">能力</button>
                                <button onClick=${() => setCurrentView('achievements')} className="w-full p-2 text-left hover:bg-stone-200 rounded">実績</button>
                                <button onClick=${() => setCurrentView('logs')} className="w-full p-2 text-left hover:bg-stone-200 rounded">記録</button>
                                <button onClick=${() => setCurrentView('decision')} className="w-full p-2 text-left hover:bg-stone-200 rounded">決断</button>
                                <div className="pt-4 mt-4 border-t">
                                    <button onClick=${processTurn} className="w-full bg-indigo-900 text-white py-3 font-bold rounded-sm">季節を進める</button>
                                </div>
                            </nav>
                            <div className="flex-1 overflow-y-auto p-6">
                                ${renderView()}
                            </div>
                        </main>
                    </div>
                `}
                <${ActionModal} actionModal=${actionModal} />
                <${QuarterResultModal} quarterResult=${quarterResult} getSummaryIcon=${getSummaryIcon} setQuarterResult=${setQuarterResult} setCurrentView=${setCurrentView} activeBoss=${gameState.activeBoss} />
                <${AdventurerModal} selectedAdv=${selectedAdv} setSelectedAdv=${setSelectedAdv} gameState=${gameState} fireAdventurer=${fireAdventurer} toggleMainParty=${toggleMainParty} handleEquipArtifact=${()=>addLog("遺物装備")} />
                <${SpecialRequestModal} reqModalOpen=${reqModalOpen} setReqModalOpen=${setReqModalOpen} gameState=${gameState} reqParty=${reqParty} handleToggleReqParty=${handleToggleReqParty} executeSpecialRequest=${executeSpecialRequest} calculatePartyPower=${calculatePartyPower} />
                <${HowToPlayModal} showHowToPlay=${showHowToPlay} setShowHowToPlay=${setShowHowToPlay} />
                <${EndingView} gameState=${gameState} quarterResult=${quarterResult} resetGame=${resetGame} />
            </div>
        `;
    }

    // --- Bootstrap ---
    const init = () => {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(React.createElement(App));
    };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
