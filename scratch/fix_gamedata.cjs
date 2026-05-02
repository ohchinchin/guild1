const fs = require('fs');

let js = fs.readFileSync('js/gameData.js', 'utf8');

// トップレベルの const を var に置換して、グローバルスコープから参照できるようにする
js = js.replace(/const MAX_TURNS/g, 'var MAX_TURNS');
js = js.replace(/const ALIGNMENTS/g, 'var ALIGNMENTS');
js = js.replace(/const SEASONS/g, 'var SEASONS');
js = js.replace(/const RANKS/g, 'var RANKS');
js = js.replace(/const NAME_POOL/g, 'var NAME_POOL');
js = js.replace(/const REP_NAME_POOL/g, 'var REP_NAME_POOL');
js = js.replace(/const CLASSES/g, 'var CLASSES');
js = js.replace(/const TRAITS/g, 'var TRAITS');
js = js.replace(/const PERSONALITIES/g, 'var PERSONALITIES');
js = js.replace(/const WEAPONS/g, 'var WEAPONS');
js = js.replace(/const BACKGROUNDS/g, 'var BACKGROUNDS');
js = js.replace(/const RIVAL_ADJS/g, 'var RIVAL_ADJS');
js = js.replace(/const RIVAL_NOUNS/g, 'var RIVAL_NOUNS');
js = js.replace(/const RUMORS/g, 'var RUMORS');
js = js.replace(/const BOSS_DATA/g, 'var BOSS_DATA');
js = js.replace(/const DUNGEON_POOL/g, 'var DUNGEON_POOL');
js = js.replace(/const ARTIFACT_POOL/g, 'var ARTIFACT_POOL');
js = js.replace(/const SPECIAL_REQUESTS/g, 'var SPECIAL_REQUESTS');
js = js.replace(/const MASTER_SKILLS/g, 'var MASTER_SKILLS');
js = js.replace(/const QUEST_TYPES/g, 'var QUEST_TYPES');
js = js.replace(/const UNIQUE_ADVENTURERS/g, 'var UNIQUE_ADVENTURERS');

fs.writeFileSync('js/gameData.js', js, 'utf8');
console.log('Fixed gameData.js to use var instead of const.');
