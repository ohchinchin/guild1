const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// MAX_TURNS から QUEST_TYPES 終了までのブロックを正規表現で削除
const regex = /const MAX_TURNS = 120;[\s\S]*?const QUEST_TYPES = \[[\s\S]*?\];/;
const replacement = `// gameData.js で読み込んだ配列に対して、LucideReact コンポーネントを紐付ける
        CLASSES.forEach(c => { if (c.iconName) c.icon = window.LucideReact[c.iconName]; });
        QUEST_TYPES.forEach(q => { if (q.iconName) q.icon = window.LucideReact[q.iconName]; });`;

html = html.replace(regex, replacement);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Update complete.');
