import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Ścieżki do Twoich folderów ze zdjęciami
const SOURCE_DIR = './src/assets/pelna_galeria';
const TARGET_DIR = './src/assets/miniaturki';

// Jeśli folder na miniaturki nie istnieje, stwórz go automatycznie
if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

console.log('🔄 Sprawdzanie i generowanie brakujących miniaturek...');

try {
  const files = fs.readdirSync(SOURCE_DIR);

  files.forEach(file => {
    // Sprawdzamy tylko pliki graficzne
    if (/\.(png|jpg|jpeg|webp)$/i.test(file)) {
      const sourcePath = path.join(SOURCE_DIR, file);
      const targetPath = path.join(TARGET_DIR, file);

      // Generuj miniaturkę TYLKO jeśli jeszcze nie istnieje
      if (!fs.existsSync(targetPath)) {
        sharp(sourcePath)
          .resize({ width: 500 }) // Automatycznie zmniejsza szerokość do 500px (wysokość dopasuje się sama)
          .toFormat(path.extname(file).substring(1), { quality: 75 }) // Kompresja jakości do 75% dla lekkości pliku
          .toFile(targetPath)
          .then(() => console.log(`✅ Wygenerowano miniaturkę dla: ${file}`))
          .catch(err => console.error(`❌ Błąd podczas obróbki ${file}:`, err));
      }
    }
  });
} catch (error) {
  console.error('❌ Błąd skryptu generowania miniaturek:', error);
}