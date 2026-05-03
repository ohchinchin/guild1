import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { finished } from 'stream/promises';

const outDir = path.join(process.cwd(), 'public', 'images');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const allImages = [
  { name: 'bg_title', prompt: 'A grand medieval guild entrance hall, cinematic lighting, realistic dark fantasy style, 16:9' },
  { name: 'bg_dashboard', prompt: 'Inside a medieval fantasy guild hall, maps on walls, master desk, cinematic lighting, realistic dark fantasy, 16:9' },
  { name: 'bg_board', prompt: 'A crowded medieval tavern quest board, many papers, atmospheric lighting, realistic dark fantasy, 16:9' },
  { name: 'bg_dungeons', prompt: 'Entrance to a dark ancient dungeon in a forest, glowing runes, mysterious, realistic dark fantasy, 16:9' },
  { name: 'bg_adventurers', prompt: 'A medieval training field at dusk, silhouette of warriors practicing, cinematic atmospheric lighting, realistic fantasy, 16:9' },
  { name: 'bg_policy', prompt: 'A medieval council room with a large stone table, strategic maps, scrolls, flickering candles, realistic dark fantasy, 16:9' },
  { name: 'bg_facilities', prompt: 'Inside a bustling medieval guild facility, various rooms for research and living, detailed gothic architecture, realistic dark fantasy, 16:9' },
  { name: 'bg_shops', prompt: 'A high-end magical item shop in a medieval city, glowing artifacts on shelves, mysterious shopkeeper, realistic dark fantasy, 16:9' },
  { name: 'bg_intrigue', prompt: 'A dark foggy medieval back alley, mysterious hooded figures in shadows, moonlight, realistic dark fantasy, 16:9' },
  { name: 'bg_darkmarket', prompt: 'A secret underground dark market, glowing purple lanterns, shady merchants, illegal goods, realistic dark fantasy, 16:9' },
  { name: 'bg_records', prompt: 'An ancient library archive, dusty scrolls, dim candlelight, mysterious atmosphere, realistic dark fantasy, 16:9' },
  { name: 'bg_skills', prompt: 'A mystical training chamber, glowing runes on floor, magical energy swirling, realistic dark fantasy, 16:9' },
  // Specific Facility Backgrounds
  { name: 'bg_fac_barracks', prompt: 'Medieval fantasy barracks, bunk beds, weapon racks, simple living quarters, realistic dark fantasy, 16:9' },
  { name: 'bg_fac_tavern', prompt: 'A cozy medieval tavern interior, warm fireplace, wooden tables, mugs of ale, realistic dark fantasy, 16:9' },
  { name: 'bg_fac_training', prompt: 'Medieval fantasy indoor training hall, straw targets, wooden practice swords, realistic dark fantasy, 16:9' },
  // Adventurers (Male)
  { name: 'adv_warrior_m_1', prompt: 'Close-up portrait of a grizzled male fantasy warrior in plate armor, beard, realistic dark fantasy' },
  { name: 'adv_warrior_m_2', prompt: 'Close-up portrait of a young male knight in shining armor, determined, realistic dark fantasy' },
  { name: 'adv_mage_m_1', prompt: 'Close-up portrait of an old male wizard with white beard, blue magic aura, realistic dark fantasy' },
  { name: 'adv_mage_m_2', prompt: 'Close-up portrait of a scholarly male mage, spectacles, glowing book, realistic dark fantasy' },
  { name: 'adv_thief_m_1', prompt: 'Close-up portrait of a hooded male rogue, shadows, holding a dagger, realistic dark fantasy' },
  { name: 'adv_thief_m_2', prompt: 'Close-up portrait of a charismatic male swashbuckler, rapier, smirk, realistic dark fantasy' },
  { name: 'adv_cleric_m_1', prompt: 'Close-up portrait of a blind male monk, serene expression, spiritual energy, realistic dark fantasy' },
  { name: 'adv_cleric_m_2', prompt: 'Close-up portrait of a sturdy male battle priest, heavy armor, mace, realistic dark fantasy' },
  // Adventurers (Female)
  { name: 'adv_warrior_f_1', prompt: 'Close-up portrait of a brave female knight, silver armor, heroic, realistic dark fantasy' },
  { name: 'adv_warrior_f_2', prompt: 'Close-up portrait of a fierce female barbarian, war paint, axe, realistic dark fantasy' },
  { name: 'adv_mage_f_1', prompt: 'Close-up portrait of a beautiful female sorceress, purple magical energy, realistic dark fantasy' },
  { name: 'adv_mage_f_2', prompt: 'Close-up portrait of a mysterious female witch, green fire, dark robes, realistic dark fantasy' },
  { name: 'adv_thief_f_1', prompt: 'Close-up portrait of a hooded female assassin, mask, sharp eyes, realistic dark fantasy' },
  { name: 'adv_thief_f_2', prompt: 'Close-up portrait of a nimble female rogue, leather armor, rooftops, realistic dark fantasy' },
  { name: 'adv_cleric_f_1', prompt: 'Close-up portrait of a holy female priestess, white and gold robes, divine light, realistic dark fantasy' },
  { name: 'adv_cleric_f_2', prompt: 'Close-up portrait of a gentle female healer, glowing hands, realistic dark fantasy' },
  { name: 'bg_main_guild', prompt: 'A cinematic wide shot of a grand medieval fantasy guild hall, gothic architecture, dark stone, banners hanging, atmospheric lighting, epic realistic dark fantasy style, 16:9' },
  { name: 'bg_guild_door', prompt: 'A cinematic close-up of a massive, ornate medieval guild door made of dark oak and heavy iron, intricate engravings, atmospheric lighting, mysterious and grand, realistic dark fantasy, 16:9' },
  ];async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function download(name, prompt, width = 1280, height = 720) {
  const encodedPrompt = encodeURIComponent(prompt);
  // Using 'flux' model as it's the most efficient for high quality.
  // nologo=true for clean images.
  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true&model=flux&seed=${Math.floor(Math.random()*100000)}`;
  
  console.log(`Fetching ${name} (${width}x${height}) using FLUX model...`);
  
  let attempts = 0;
  while (attempts < 3) {
    try {
      const res = await fetch(url);
      if (res.status === 429) {
        console.warn(`Rate limit hit for ${name}. Retrying in 10s...`);
        await sleep(10000);
        attempts++;
        continue;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      
      const destination = path.join(outDir, `${name}.webp`);
      const fileStream = fs.createWriteStream(destination);
      await finished(Readable.fromWeb(res.body).pipe(fileStream));
      console.log(`Successfully saved ${name}.webp`);
      return;
    } catch (e) {
      console.error(`Error fetching ${name}: ${e.message}`);
      attempts++;
      if (attempts < 3) await sleep(5000);
    }
  }
  throw new Error(`Failed to download ${name} after 3 attempts.`);
}

async function runBatch(startIndex, count) {
  const batch = allImages.slice(startIndex, startIndex + count);
  console.log(`Starting Batch: ${startIndex} to ${Math.min(startIndex + count - 1, allImages.length - 1)}`);
  
  for (const img of batch) {
    const isAdv = img.name.startsWith('adv_');
    const width = isAdv ? 1024 : 1280;
    const height = isAdv ? 1024 : 720;
    await download(img.name, img.prompt, width, height);
    // Mandatory delay between individual images to avoid 429
    await sleep(2000);
  }
}

const startIndex = parseInt(process.argv[2]) || 0;
const count = parseInt(process.argv[3]) || 1;

runBatch(startIndex, count).then(() => {
  console.log("Batch completed successfully.");
}).catch(err => {
  console.error("Critical batch failure:", err.message);
  process.exit(1);
});
