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

  // 1. Definiujemy dozwolone formaty (zawsze małymi literami)
  const ALLOWED_FORMATS = ['png', 'jpg', 'jpeg', 'webp'];

  // 2. FILTROWANIE (Opcja A): Izolujemy tylko poprawne pliki graficzne
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).substring(1).toLowerCase();
    return ALLOWED_FORMATS.includes(ext);
  });

  // 3. Przetwarzamy wyłącznie przefiltrowaną listę plików
  imageFiles.forEach(file => {
    const sourcePath = path.join(SOURCE_DIR, file);
    const targetPath = path.join(TARGET_DIR, file);

    // Bezpiecznie wyciągamy format i wymuszamy małe litery (wymóg biblioteki Sharp)
    const format = path.extname(file).substring(1).toLowerCase();

    // Generuj miniaturkę TYLKO jeśli jeszcze nie istnieje
    if (!fs.existsSync(targetPath)) {
      sharp(sourcePath)
        .resize({ width: 500 }) // Automatycznie zmniejsza szerokość do 500px
        .toFormat(format, { quality: 75 }) // Bezpieczny, oczyszczony format
        .toFile(targetPath)
        .then(() => console.log(`✅ Wygenerowano miniaturkę dla: ${file}`))
        .catch(err => console.error(`❌ Błąd podczas obróbki ${file}:`, err));
    }
  });
} catch (error) {
  console.error('❌ Błąd skryptu generowania miniaturek:', error);
}