const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// <head> タグ内にスクリプトを追加
if (!html.includes('<script src="js/gameData.js"></script>')) {
    html = html.replace('<!-- Lucide Icons -->', '<!-- Game Data -->\n    <script src="js/gameData.js"></script>\n\n    <!-- Lucide Icons -->');
}

// 古いデータ部分を削除 (MAX_TURNS から QUEST_TYPESの配列定義の終わりまで)
const startStr = "const MAX_TURNS = 120; // 30年 × 4四半期";
const endStr = "    { id: 'emergency', name: '緊急要請', icon: AlertTriangle, baseReward: 1200, risk: 'high', favorReq: 50 }\n        ];";

const startIndex = html.indexOf(startStr);
const endIndex = html.indexOf(endStr) + endStr.length;

if (startIndex !== -1 && endIndex > startIndex) {
    const replacement = `// gameData.js で読み込んだ配列に対して、LucideReact コンポーネントを紐付ける
        CLASSES.forEach(c => { if (c.iconName) c.icon = window.LucideReact[c.iconName]; });
        QUEST_TYPES.forEach(q => { if (q.iconName) q.icon = window.LucideReact[q.iconName]; });`;
    html = html.substring(0, startIndex) + replacement + html.substring(endIndex);
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Update complete.');
