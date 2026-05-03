import fs from 'fs';
import path from 'path';
import https from 'https';

const outPath = path.join(process.cwd(), 'public', 'images', 'japanese_woman.png');
const prompt = encodeURIComponent('A beautiful Japanese woman, high quality, photorealistic, 4K');
const url = `https://image.pollinations.ai/prompt/${prompt}?width=1024&height=1024&nologo=true`;

console.log('AIで画像を生成・ダウンロード中...');

https.get(url, (res) => {
  if (res.statusCode !== 200 && res.statusCode !== 302) {
    console.error(`ダウンロード失敗: ステータスコード ${res.statusCode}`);
    return;
  }
  
  // pollinations.ai はリダイレクトを返すことがあるため、URLの解決を行う
  const downloadUrl = res.statusCode === 302 ? res.headers.location : url;
  
  https.get(downloadUrl, (imgRes) => {
    const fileStream = fs.createWriteStream(outPath);
    imgRes.pipe(fileStream);
    
    fileStream.on('finish', () => {
      fileStream.close();
      console.log(`画像を保存しました: public/images/japanese_woman.png`);
    });
  }).on('error', (err) => {
    console.error('画像データの取得エラー:', err);
  });
  
}).on('error', (err) => {
  console.error('リクエストエラー:', err);
});