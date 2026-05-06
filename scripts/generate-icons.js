import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseSvg = path.join(__dirname, '../public/icons/base.svg');
const iconsDir = path.join(__dirname, '../public/icons');

const sizes = [192, 384, 512];

async function generateIcons() {
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  for (const size of sizes) {
    const filename = `icon-${size}x${size}.png`;
    const outputPath = path.join(iconsDir, filename);
    
    await sharp(baseSvg)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    
    console.log(`Gerado: ${filename}`);
  }

  // Gera ícone maskable (com padding)
  await sharp(baseSvg)
    .resize(512, 512)
    .flatten({ background: '#0EA5E9' })
    .extend({
      top: 64,
      bottom: 64,
      left: 64,
      right: 64,
      background: '#0EA5E9'
    })
    .resize(512, 512)
    .png()
    .toFile(path.join(iconsDir, 'icon-512x512-maskable.png'));
  
  console.log('Gerado: icon-512x512-maskable.png');
}

generateIcons().catch(console.error);
