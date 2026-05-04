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

const missingImages = [
  { name: 'art_b4.webp', prompt: 'A close-up shot of an ancient gold coin from a lost empire, intricate carvings of a dragon, resting on dark velvet, high fantasy style, cinematic lighting, 8k', w: 512, h: 512 },
  { name: 'dungeon_d6.webp', prompt: 'Inside a mysterious crystal corridor, glowing crystals on walls, magical reflections, high fantasy style, cinematic lighting, 8k', w: 1024, h: 512 },
  { name: 'dungeon_d7.webp', prompt: 'A sky corridor floating above clouds, celestial architecture, marble and gold, sunset lighting, high fantasy style, 8k', w: 1024, h: 512 },
  { name: 'dungeon_d8.webp', prompt: 'An abyssal rift, deep dark canyon with purple magical energy, floating rocks, dark fantasy style, cinematic lighting, 8k', w: 1024, h: 512 },
  { name: 'dungeon_d9.webp', prompt: 'A dragon nest in a volcanic cave, treasure piles, dragon silhouettes, glowing lava, dark fantasy style, 8k', w: 1024, h: 512 },
  { name: 'dungeon_d10.webp', prompt: 'The twilight of the gods, a battlefield in the sky, crumbling celestial structures, epic scale, high fantasy style, cinematic lighting, 8k', w: 1024, h: 512 }
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
  console.log('Generating missing images...');
  const imagesDir = path.join(process.cwd(), 'public', 'images');

  for (const img of missingImages) {
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
    let waitTime = 10000;

    while (!success && attempts < 3) {
      console.log(`Generating ${img.name} (Attempt ${attempts + 1})...`);
      try {
        await download(url, dest);
        
        // Final check of downloaded file
        const finalStats = fs.statSync(dest);
        if (finalStats.size < 2000) {
          throw new Error('Downloaded file too small');
        }
        
        console.log(`Successfully generated ${img.name} (${finalStats.size} bytes)`);
        success = true;
        await new Promise(r => setTimeout(r, 5000));
      } catch (err) {
        attempts++;
        console.error(`Attempt ${attempts} failed for ${img.name}: Status ${err}`);
        if (attempts < 3) {
          await new Promise(r => setTimeout(r, waitTime));
          waitTime *= 2;
        }
      }
    }
  }
  console.log('Process completed.');
};

run().catch(console.error);
