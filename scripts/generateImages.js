import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const outDir = path.join(process.cwd(), 'public', 'images');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const imagesToGenerate = [
  { name: 'bg_title', text: 'Guild Master', color: '#1c1917', blur: true },
  { name: 'bg_dashboard', text: 'Guild Dashboard', color: '#3f3f46', blur: false },
  { name: 'bg_board', text: 'Quest Board', color: '#451a03', blur: false },
  { name: 'bg_dungeons', text: 'Dungeons', color: '#064e3b', blur: false },
  { name: 'bg_adventurers', text: 'Adventurers', color: '#1e3a8a', blur: false },
  { name: 'bg_policy', text: 'Guild Master Study', color: '#44403c', blur: false },
  { name: 'bg_facilities', text: 'Facilities', color: '#78350f', blur: false },
  { name: 'bg_shops', text: 'The Market', color: '#4c1d95', blur: false },
  { name: 'bg_intrigue', text: 'Shadowy Alleys', color: '#450a0a', blur: false },
  { name: 'adv_warrior_1', text: 'Warrior', color: '#7f1d1d', blur: false },
  { name: 'adv_warrior_2', text: 'Warrior', color: '#991b1b', blur: false },
  { name: 'adv_mage_1', text: 'Wizard', color: '#312e81', blur: false },
  { name: 'adv_mage_2', text: 'Sorceress', color: '#3730a3', blur: false },
  { name: 'adv_thief_1', text: 'Rogue', color: '#064e3b', blur: false },
  { name: 'adv_cleric_1', text: 'Priest', color: '#78350f', blur: false },
  { name: 'japanese_woman', text: 'Japanese Woman', color: '#fbcfe8', blur: false },
];

async function generate() {
  for (const img of imagesToGenerate) {
    const isAdv = img.name.startsWith('adv_') || img.name === 'japanese_woman';
    const width = isAdv ? 300 : 1280;
    const height = isAdv ? 300 : 720;

    const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stop-color="${img.color}" stop-opacity="1" />
          <stop offset="100%" stop-color="#000000" stop-opacity="1" />
        </radialGradient>
        <filter id="blur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="${img.blur ? 12 : 0}" />
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)" filter="url(#blur)" />
      <rect width="100%" height="100%" fill="rgba(0,0,0,0.3)" />
      <text x="50%" y="50%" font-family="serif" font-size="${isAdv ? 30 : 100}" font-weight="bold" fill="#fcd34d" text-anchor="middle" alignment-baseline="middle" opacity="0.6">
        ${img.text.replace(/&/g, '&amp;')}
      </text>
    </svg>`;

    const buffer = Buffer.from(svg);

    await sharp(buffer)
      .png()
      .toFile(path.join(outDir, `${img.name}.png`));
    
    console.log(`Generated ${img.name}.png`);
  }
}

generate().catch(console.error);
