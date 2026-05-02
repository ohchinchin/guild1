const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. <script src="js/gameData.js"></script> の追加
if (!html.includes('<script src="js/gameData.js"></script>')) {
    html = html.replace('<!-- Lucide Icons -->\n    <script src="https://unpkg.com/lucide-react@0.292.0/dist/umd/lucide-react.min.js"></script>\n\n    <style>', 
        '<!-- Lucide Icons -->\n    <script src="https://unpkg.com/lucide-react@0.292.0/dist/umd/lucide-react.min.js"></script>\n\n    <!-- Game Data -->\n    <script src="js/gameData.js"></script>\n\n    <style>'
    );
}

// 2. データの削除とマッピング追加
const dataStartStr = '        const MAX_TURNS = 120; // 30年 × 4四半期';
const dataEndStr = "            { id: 'emergency', name: '緊急要請', icon: AlertTriangle, baseReward: 1200, risk: 'high', favorReq: 50 }\n        ];";

const startIndex = html.indexOf(dataStartStr);
const endIndex = html.indexOf(dataEndStr);

if (startIndex !== -1 && endIndex !== -1) {
    const afterData = endIndex + dataEndStr.length;
    const replacement = `        // gameData.js で読み込んだ配列に対して、LucideReact コンポーネントを紐付ける
        CLASSES.forEach(c => { if (c.iconName) c.icon = window.LucideReact[c.iconName]; });
        QUEST_TYPES.forEach(q => { if (q.iconName) q.icon = window.LucideReact[q.iconName]; });`;
    html = html.substring(0, startIndex) + replacement + html.substring(afterData);
}

// 3. generateAdventurer の書き換え
const genAdvStart = `        const generateAdventurer = (fame, notoriety, usedNames, forcedRank = null, isRecruiter = false, guildPower = 0) => {
            let availableNames = NAME_POOL.filter(n => !usedNames.includes(n));`;

const genAdvReplace = `        const generateAdventurer = (fame, notoriety, usedNames, forcedRank = null, isRecruiter = false, guildPower = 0) => {
            // ユニークキャラクターの抽選
            if (!forcedRank) {
                const uniqueChance = isRecruiter ? 0.02 : 0.005; // 0.5% または 2%
                if (Math.random() < uniqueChance) {
                    const availableUniques = UNIQUE_ADVENTURERS.filter(u => !usedNames.includes(u.name));
                    if (availableUniques.length > 0) {
                        const u = availableUniques[Math.floor(Math.random() * availableUniques.length)];
                        return {
                            id: \`adv_\${Math.random().toString(36).substr(2, 9)}\`,
                            name: u.name,
                            rank: u.rank,
                            class: u.className,
                            trait: TRAITS.find(t => t.id === u.traitId) || TRAITS[0],
                            personality: PERSONALITIES.find(p => p.id === u.personality) || PERSONALITIES[0],
                            weapon: "伝説の専用武器",
                            power: u.powerValue,
                            loyalty: 100,
                            salary: u.salary,
                            hireCost: u.hireCost,
                            flavor: u.flavor,
                            isUnique: true,
                            equippedArtifactId: null
                        };
                    }
                }
            }

            let availableNames = NAME_POOL.filter(n => !usedNames.includes(n));`;

html = html.replace(genAdvStart, genAdvReplace);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Update complete.');
