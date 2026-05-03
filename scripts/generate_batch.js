import fs from 'fs';
import path from 'path';
import https from 'https';

const POLLINATIONS_API_KEY = 'sk_0ZJCZDYifYec2oqb1stvZ7Wr8cYhejGw';

const images = [
    { name: 'bg_dashboard.webp', prompt: 'majestic medieval fantasy guild hall dashboard background, dark fantasy style, cinematic lighting', w: 1280, h: 720 },
    { name: 'bg_board.webp', prompt: 'medieval town square mission board background, dark fantasy style, parchment, scrolls', w: 1280, h: 720 },
    { name: 'bg_dungeons.webp', prompt: 'dark mysterious dungeon entrance background, stone archway, glowing moss', w: 1280, h: 720 },
    { name: 'bg_shops.webp', prompt: 'medieval fantasy blacksmith shop interior background, weapons and armor on shelves', w: 1280, h: 720 },
    { name: 'adv_warrior_m_3.webp', prompt: 'Anime style character portrait of a heroic male fantasy warrior, heavy armor, sword', w: 512, h: 512 },
    { name: 'adv_warrior_f_3.webp', prompt: 'Anime style character portrait of a heroic female fantasy warrior, silver armor, sword', w: 512, h: 512 },
    { name: 'adv_mage_m_3.webp', prompt: 'Anime style character portrait of a fantasy male wizard, mystical robes, staff', w: 512, h: 512 },
    { name: 'adv_mage_f_3.webp', prompt: 'Anime style character portrait of a fantasy female sorceress, elegant robes, aura', w: 512, h: 512 },
    { name: 'adv_thief_m_3.webp', prompt: 'Anime style character portrait of a fantasy male thief, dark cloak, daggers', w: 512, h: 512 },
    { name: 'adv_thief_f_3.webp', prompt: 'Anime style character portrait of a fantasy female assassin, masked, shadowy', w: 512, h: 512 },
    { name: 'adv_cleric_m_3.webp', prompt: 'Anime style character portrait of a fantasy male cleric, holy robes, divine light', w: 512, h: 512 },
    { name: 'adv_cleric_f_3.webp', prompt: 'Anime style character portrait of a fantasy female priestess, white robes, praying', w: 512, h: 512 }
];

const download = (url, dest) => {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                'Authorization': `Bearer ${POLLINATIONS_API_KEY}`
            }
        };

        https.get(url, options, (res) => {
            if (res.statusCode === 302 || res.statusCode === 301) {
                download(res.headers.location, dest).then(resolve).catch(reject);
                return;
            }
            if (res.statusCode !== 200) {
                reject(res.statusCode);
                return;
            }
            
            const chunks = [];
            res.on('data', chunk => chunks.push(chunk));
            res.on('end', () => {
                const buffer = Buffer.concat(chunks);
                fs.writeFileSync(dest, buffer);
                resolve();
            });
        }).on('error', reject);
    });
};

const run = async () => {
    console.log('Starting pollinations.ai image generation with retry logic...');
    for (const img of images) {
        const dest = path.join(process.cwd(), 'public', 'images', img.name);
        const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(img.prompt)}?width=${img.w}&height=${img.h}&model=flux&seed=${Math.floor(Math.random()*99999)}&nologo=true&nofeed=true`;
        
        let success = false;
        let waitTime = 40000; // Start with 40s
        
        while (!success) {
            console.log(`Generating ${img.name}...`);
            try {
                await download(url, dest);
                console.log(`Success: ${img.name}`);
                success = true;
                // Success wait
                await new Promise(r => setTimeout(r, 20000));
            } catch (err) {
                if (err === 429) {
                    console.log(`Rate limited for ${img.name}. Retrying in ${waitTime/1000}s...`);
                    await new Promise(r => setTimeout(r, waitTime));
                    waitTime = Math.min(waitTime * 1.5, 300000); // Max 5 mins
                } else {
                    console.error(`Error for ${img.name}: ${err}. Skipping.`);
                    break;
                }
            }
        }
    }
    console.log('Final completion of image tasks.');
};

run();
