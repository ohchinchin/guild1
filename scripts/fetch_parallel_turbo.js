import fs from 'fs';
import path from 'path';
import https from 'https';

const IMAGES = [
  { id: 'art_b4', prompt: 'A stack of heavy ancient gold coins, embossed with a forgotten emperor face, dark fantasy style, 1:1, isolated on black' },
  { id: 'art_a3', prompt: 'A glowing fragment of the philosopher stone, crimson crystalline structure, high energy, dark fantasy style, 1:1, isolated on black' },
  { id: 'art_a4', prompt: 'A meteor sword glowing with starlight, forged from space iron, celestial patterns, dark fantasy style, 1:1, isolated on black' },
  { id: 'art_s3', prompt: 'A spectral orb containing a hero soul, ethereal blue light, heroic aura, dark fantasy style, 1:1, isolated on black' },
  { id: 'art_s4', prompt: 'A shimmering golden thread of fate, floating and twisting in the air, divine light, dark fantasy style, 1:1, isolated on black' },
  { id: 'dm1', prompt: 'A forbidden syringe filled with glowing purple medicine, dangerous aura, dark fantasy style, 1:1, isolated on black' },
  { id: 'dm2', prompt: 'A forged gold medal of a high ranking official, slightly imperfect, tarnished, dark fantasy style, 1:1, isolated on black' },
  { id: 'dm3', prompt: 'A sinister black book titled assassination manual, bloodstains, dagger bookmark, dark fantasy style, 1:1, isolated on black' },
  { id: 'dungeon_d1', prompt: 'Dark damp cave entrance, goblin tracks, bones, dark fantasy style, 16:9' },
  { id: 'dungeon_d2', prompt: 'Ancient forest shrouded in thick mysterious fog, twisted trees, dark fantasy style, 16:9' },
  { id: 'dungeon_d3', prompt: 'Sunken stone ruins underground, vines, ancient statues, dark fantasy style, 16:9' },
  { id: 'dungeon_d4', prompt: 'Spooky medieval graveyard at night, ornate stone tombs, ghostly mist, dark fantasy style, 16:9' },
  { id: 'dungeon_d5', prompt: 'Volcanic cave with flowing lava, glowing red rocks, heat haze, dark fantasy style, 16:9' },
  { id: 'dungeon_d6', prompt: 'Corridor made of glowing crystals, refracting light, mystical atmosphere, dark fantasy style, 16:9' },
  { id: 'dungeon_d7', prompt: 'Stone pathway above the clouds, floating islands, bright sunlight, dark fantasy style, 16:9' },
  { id: 'dungeon_d8', prompt: 'Deep dark chasm, glowing purple energy from the bottom, jagged rocks, dark fantasy style, 16:9' },
  { id: 'dungeon_d9', prompt: 'Massive dragon nest made of bones and gold, dark cavern, scales on floor, dark fantasy style, 16:9' },
  { id: 'dungeon_d10', prompt: 'Apocalyptic battlefield of gods, burning sky, giant skeletons, epic scale, dark fantasy style, 16:9' },
];

async function download(id, prompt) {
  const outPath = path.join(process.cwd(), 'public', 'images', `${id}.webp`);
  const isDungeon = id.startsWith('dungeon_');
  const width = isDungeon ? 800 : 512;
  const height = isDungeon ? 450 : 512;
  
  // Try 'turbo' model which is often faster and has higher limits
  const encodedPrompt = encodeURIComponent(prompt);
  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true&model=turbo&seed=${Math.floor(Math.random() * 1000000)}`;

  console.log(`Starting: ${id}`);

  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(outPath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`Finished: ${id}`);
          resolve();
        });
      } else {
        reject(new Error(`Status ${res.statusCode} for ${id}`));
      }
    }).on('error', reject);
  });
}

async function main() {
  const CONCURRENCY = 4; // Increase to 4
  const queue = [...IMAGES.filter(item => !fs.existsSync(path.join(process.cwd(), 'public', 'images', `${item.id}.webp`)))];
  console.log(`Remaining images to fetch: ${queue.length}`);
  
  const startTime = Date.now();
  const TIME_LIMIT = 5 * 60 * 1000; // 5 minutes

  async function processQueue() {
    while (queue.length > 0) {
      if (Date.now() - startTime > TIME_LIMIT) {
        console.log('Time limit reached. Stopping.');
        break;
      }
      const item = queue.shift();
      try {
        await download(item.id, item.prompt);
        await new Promise(r => setTimeout(r, 2000)); // Short 2s delay
      } catch (err) {
        console.error(`Error ${item.id}: ${err.message}`);
        if (err.message.includes('429')) {
          console.log('Rate limit hit. Retrying later...');
          queue.push(item);
          await new Promise(r => setTimeout(r, 10000)); // 10s wait on 429
        }
      }
    }
  }

  const workers = Array(CONCURRENCY).fill(null).map((_, i) => {
    return (async () => {
      await new Promise(r => setTimeout(r, i * 1500)); // Stagger by 1.5s
      return processQueue();
    })();
  });
  await Promise.all(workers);
  console.log('All parallel tasks finished.');
}

main();
