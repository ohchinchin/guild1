import fs from 'fs';
import path from 'path';
import https from 'https';

// Manual .env parsing
const envPath = path.join(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const POLLINATIONS_API_KEY = envContent
  .split('\n')
  .find(line => line.startsWith('POLLINATIONS_API_KEY='))
  ?.split('=')[1]
  ?.trim();

if (!POLLINATIONS_API_KEY) {
  console.error('Error: POLLINATIONS_API_KEY not found in .env');
  process.exit(1);
}

const imagesToFix = [
  { name: 'bg_dungeons.webp', prompt: 'dark mysterious dungeon entrance background, stone archway, glowing moss, cinematic lighting, dark fantasy style, 8k', w: 1280, h: 720 },
  { name: 'bg_shops.webp', prompt: 'medieval fantasy blacksmith shop interior background, weapons and armor on shelves, forge glow, cinematic lighting, 8k', w: 1280, h: 720 },
  { name: 'bg_board.webp', prompt: 'medieval town square mission board background, dark fantasy style, parchment, scrolls, cinematic lighting, 8k', w: 1280, h: 720 },
  { name: 'adv_warrior_m_3.webp', prompt: 'Anime style character portrait of a heroic male fantasy warrior, heavy armor, sword, intense look, high quality', w: 512, h: 512 },
  { name: 'adv_warrior_f_3.webp', prompt: 'Anime style character portrait of a heroic female fantasy warrior, silver armor, sword, courageous stance, high quality', w: 512, h: 512 },
  { name: 'adv_mage_m_3.webp', prompt: 'Anime style character portrait of a fantasy male wizard, mystical robes, staff, magical energy, high quality', w: 512, h: 512 },
  { name: 'adv_mage_f_3.webp', prompt: 'Anime style character portrait of a fantasy female sorceress, elegant robes, aura, magical particles, high quality', w: 512, h: 512 },
  { name: 'adv_thief_m_3.webp', prompt: 'Anime style character portrait of a fantasy male thief, dark cloak, daggers, stealthy pose, high quality', w: 512, h: 512 },
  { name: 'adv_thief_f_3.webp', prompt: 'Anime style character portrait of a fantasy female assassin, masked, shadowy, lethal look, high quality', w: 512, h: 512 },
  { name: 'adv_cleric_m_3.webp', prompt: 'Anime style character portrait of a fantasy male cleric, holy robes, divine light, mace, high quality', w: 512, h: 512 },
  { name: 'adv_cleric_f_3.webp', prompt: 'Anime style character portrait of a fantasy female priestess, white robes, praying, divine aura, high quality', w: 512, h: 512 }
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
      
      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
      
      fileStream.on('error', (err) => {
        fs.unlink(dest, () => {}); // Delete partial file
        reject(err);
      });
    }).on('error', reject);
  });
};

const run = async () => {
  console.log('Starting image repair with Flux model...');
  const imagesDir = path.join(process.cwd(), 'public', 'images');

  for (const img of imagesToFix) {
    const dest = path.join(imagesDir, img.name);
    
    // Check if file exists and its size
    if (fs.existsSync(dest)) {
      const stats = fs.statSync(dest);
      if (stats.size > 2000) {
        console.log(`Skipping ${img.name} (already exists and looks valid: ${stats.size} bytes)`);
        continue;
      }
    }

    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(img.prompt)}?width=${img.w}&height=${img.h}&model=flux&seed=${Math.floor(Math.random()*100000)}&nologo=true&nofeed=true`;
    
    let success = false;
    let attempts = 0;
    let waitTime = 60000; // Start with 60s for stability

    while (!success && attempts < 3) {
      console.log(`Generating ${img.name} (Attempt ${attempts + 1})...`);
      try {
        await download(url, dest);
        
        // Final check of downloaded file
        const finalStats = fs.statSync(dest);
        if (finalStats.size < 2000) {
          throw new Error('Downloaded file too small (likely error JSON)');
        }
        
        console.log(`Successfully repaired ${img.name} (${finalStats.size} bytes)`);
        success = true;
        // Wait between successful generations to respect API
        await new Promise(r => setTimeout(r, 15000));
      } catch (err) {
        attempts++;
        console.error(`Attempt ${attempts} failed for ${img.name}: Status ${err}`);
        if (attempts < 3) {
          console.log(`Waiting ${waitTime/1000}s before retry...`);
          await new Promise(r => setTimeout(r, waitTime));
          waitTime *= 2;
        }
      }
    }
  }
  console.log('Image repair process completed.');
};

run().catch(console.error);
