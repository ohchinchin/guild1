import fs from 'fs';
import path from 'path';
import https from 'https';

const DUNGEONS = [
  { id: 'd1', prompt: 'Dark damp cave entrance, goblin tracks, bones, dark fantasy style, 16:9' },
  { id: 'd2', prompt: 'Ancient forest shrouded in thick mysterious fog, twisted trees, dark fantasy style, 16:9' },
  { id: 'd3', prompt: 'Sunken stone ruins underground, vines, ancient statues, dark fantasy style, 16:9' },
  { id: 'd4', prompt: 'Spooky medieval graveyard at night, ornate stone tombs, ghostly mist, dark fantasy style, 16:9' },
  { id: 'd5', prompt: 'Volcanic cave with flowing lava, glowing red rocks, heat haze, dark fantasy style, 16:9' },
  { id: 'd6', prompt: 'Corridor made of glowing crystals, refracting light, mystical atmosphere, dark fantasy style, 16:9' },
  { id: 'd7', prompt: 'Stone pathway above the clouds, floating islands, bright sunlight, dark fantasy style, 16:9' },
  { id: 'd8', prompt: 'Deep dark chasm, glowing purple energy from the bottom, jagged rocks, dark fantasy style, 16:9' },
  { id: 'd9', prompt: 'Massive dragon nest made of bones and gold, dark cavern, scales on floor, dark fantasy style, 16:9' },
  { id: 'd10', prompt: 'Apocalyptic battlefield of gods, burning sky, giant skeletons, epic scale, dark fantasy style, 16:9' },
];

async function download(id, prompt) {
  const outPath = path.join(process.cwd(), 'public', 'images', `dungeon_${id}.webp`);
  const encodedPrompt = encodeURIComponent(prompt + ' --model flux');
  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=450&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;

  console.log(`Generating: dungeon_${id}...`);

  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(outPath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`Saved: ${outPath}`);
          resolve();
        });
      } else {
        reject(new Error(`Status: ${res.statusCode}`));
      }
    }).on('error', reject);
  });
}

async function main() {
  for (const item of DUNGEONS) {
    if (fs.existsSync(path.join(process.cwd(), 'public', 'images', `dungeon_${item.id}.webp`))) {
      console.log(`Skipping: dungeon_${item.id} (already exists)`);
      continue;
    }
    try {
      await download(item.id, item.prompt);
      await new Promise(r => setTimeout(r, 20000)); // 20s delay
    } catch (err) {
      console.error(`Error (${item.id}):`, err.message);
      if (err.message.includes('429')) {
        console.log('Rate limit hit. Waiting 60s...');
        await new Promise(r => setTimeout(r, 60000));
      }
    }
  }
}

main();
