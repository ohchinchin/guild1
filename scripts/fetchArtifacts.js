import fs from 'fs';
import path from 'path';
import https from 'https';

const ARTIFACTS = [
  { id: 'e1', name: '古びた銀貨', prompt: 'An ancient tarnished silver coin from a medieval fantasy world, intricate engravings, cinematic lighting, realistic dark fantasy style, 1:1' },
  { id: 'e2', name: '薬草の束', prompt: 'A bundle of dried magical herbs tied with a twine, soft morning light, realistic dark fantasy style, 1:1' },
  { id: 'd1', name: '鈍色の小瓶', prompt: 'A small dusty grey glass vial, mysterious residue inside, dark atmosphere, realistic dark fantasy style, 1:1' },
  { id: 'd2', name: '錆びた宝剣', prompt: 'A rusted medieval ornate sword, handle made of dark wood, laying on stone, realistic dark fantasy style, 1:1' },
  { id: 'c1', name: '輝く魔石', prompt: 'A glowing magical crystal shard, pulsating with blue energy, dark background, realistic dark fantasy style, 1:1' },
  { id: 'c2', name: '守護の指輪', prompt: 'A silver ring with a blue protective gemstone, glowing faintly, realistic dark fantasy style, 1:1' },
  { id: 'b1', name: '古代の魔導書', prompt: 'An ancient leather-bound grimoire, glowing runes on the cover, dusty library background, realistic dark fantasy style, 1:1' },
  { id: 'b2', name: '龍の鱗', prompt: 'A single massive dark dragon scale, shimmering with iridescent light, metallic texture, realistic dark fantasy style, 1:1' },
  { id: 'a1', name: '伝説の聖杯', prompt: 'A legendary golden chalice adorned with rubies, divine light shining from above, realistic dark fantasy style, 1:1' },
  { id: 'a2', name: '神殺しの矢', prompt: 'A black arrow with a tip made of obsidian, glowing with a malevolent red light, realistic dark fantasy style, 1:1' },
  { id: 's1', name: '世界樹の種', prompt: 'A glowing seed of the world tree, floating in the air, surrounded by life energy, realistic dark fantasy style, 1:1' },
  { id: 's2', name: '時の歯車', prompt: 'A complex golden mechanical gear, floating and shifting, glowing with temporal energy, realistic dark fantasy style, 1:1' }
];

async function download(id, prompt) {
  const outPath = path.join(process.cwd(), 'public', 'images', `art_${id}.webp`);
  const encodedPrompt = encodeURIComponent(prompt + ' --model flux');
  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;

  console.log(`生成中: ${id} (${prompt})...`);

  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 302) {
        https.get(res.headers.location, (imgRes) => {
          const fileStream = fs.createWriteStream(outPath);
          imgRes.pipe(fileStream);
          fileStream.on('finish', () => {
            fileStream.close();
            console.log(`保存完了: ${outPath}`);
            resolve();
          });
        }).on('error', reject);
      } else if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(outPath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`保存完了: ${outPath}`);
          resolve();
        });
      } else {
        reject(new Error(`ステータスコード: ${res.statusCode}`));
      }
    }).on('error', reject);
  });
}

async function main() {
  for (const art of ARTIFACTS) {
    try {
      await download(art.id, art.prompt);
      // レート制限を考慮して少し待機
      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      console.error(`エラー (${art.id}):`, err.message);
    }
  }
}

main();
