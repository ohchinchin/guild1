import fs from 'fs';
import path from 'path';
import https from 'https';

const IMAGES = [
  // Artifacts (if missing)
  { id: 'art_e3', prompt: 'A rusty ancient key with complex bow design, weathered iron, dark fantasy style, 1:1, isolated on black' },
  { id: 'art_e4', prompt: 'A worn-out leather adventurer diary, yellowed pages, ink stains, dark fantasy style, 1:1, isolated on black' },
  { id: 'art_d3', prompt: 'A lucky charm stone with a natural hole, hanging from a leather cord, rustic, dark fantasy style, 1:1, isolated on black' },
  { id: 'art_d4', prompt: 'A broken brass compass, cracked glass, needle pointing nowhere, ornate, dark fantasy style, 1:1, isolated on black' },
  { id: 'art_c3', prompt: 'A silver ring with a glowing elemental gem, pulsing with faint energy, dark fantasy style, 1:1, isolated on black' },
  { id: 'art_c4', prompt: 'A medium glass vial filled with glowing blue magical liquid, ornate stopper, dark fantasy style, 1:1, isolated on black' },
  { id: 'art_b3', prompt: 'A tattered black cloak that seems to absorb light, shadowy texture, dark fantasy style, 1:1, isolated on black' },
  { id: 'art_b4', prompt: 'A stack of heavy ancient gold coins, embossed with a forgotten emperor face, dark fantasy style, 1:1, isolated on black' },
  { id: 'art_a3', prompt: 'A glowing fragment of the philosopher stone, crimson crystalline structure, high energy, dark fantasy style, 1:1, isolated on black' },
  { id: 'art_a4', prompt: 'A meteor sword glowing with starlight, forged from space iron, celestial patterns, dark fantasy style, 1:1, isolated on black' },
  { id: 'art_s3', prompt: 'A spectral orb containing a hero soul, ethereal blue light, heroic aura, dark fantasy style, 1:1, isolated on black' },
  { id: 'art_s4', prompt: 'A shimmering golden thread of fate, floating and twisting in the air, divine light, dark fantasy style, 1:1, isolated on black' },
  
  // Dark Market Items
  { id: 'dm1', prompt: 'A forbidden syringe filled with glowing purple medicine, dangerous aura, dark fantasy style, 1:1, isolated on black' },
  { id: 'dm2', prompt: 'A forged gold medal of a high ranking official, slightly imperfect, tarnished, dark fantasy style, 1:1, isolated on black' },
  { id: 'dm3', prompt: 'A sinister black book titled assassination manual, bloodstains, dagger bookmark, dark fantasy style, 1:1, isolated on black' },

  // Dungeons
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
  
  const encodedPrompt = encodeURIComponent(prompt + ' --model flux');
  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;

  console.log(`Generating: ${id}...`);

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
  for (const item of IMAGES) {
    if (fs.existsSync(path.join(process.cwd(), 'public', 'images', `${item.id}.webp`))) {
      console.log(`Skipping: ${item.id} (already exists)`);
      continue;
    }
    
    let success = false;
    let retries = 0;
    while (!success && retries < 3) {
      try {
        await download(item.id, item.prompt);
        success = true;
        await new Promise(r => setTimeout(r, 20000)); // 20s delay
      } catch (err) {
        console.error(`Error (${item.id}) attempt ${retries + 1}:`, err.message);
        retries++;
        console.log('Waiting 60s before retry...');
        await new Promise(r => setTimeout(r, 60000));
      }
    }
  }
}

main();
