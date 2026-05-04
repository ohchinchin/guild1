import fs from 'fs';
import path from 'path';
import https from 'https';

const TREASURES = [
  // New Artifacts
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
];

async function download(id, prompt) {
  const outPath = path.join(process.cwd(), 'public', 'images', `${id}.webp`);
  const encodedPrompt = encodeURIComponent(prompt + ' --model flux');
  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;

  console.log(`Generating: ${id}...`);

  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        https.get(res.headers.location, (imgRes) => {
          const fileStream = fs.createWriteStream(outPath);
          imgRes.pipe(fileStream);
          fileStream.on('finish', () => {
            fileStream.close();
            console.log(`Saved: ${outPath}`);
            resolve();
          });
        }).on('error', reject);
      } else if (res.statusCode === 200) {
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
  for (const item of TREASURES) {
    try {
      await download(item.id, item.prompt);
      await new Promise(r => setTimeout(r, 10000)); // 10s delay to be safe
    } catch (err) {
      console.error(`Error (${item.id}):`, err.message);
    }
  }
}

main();
