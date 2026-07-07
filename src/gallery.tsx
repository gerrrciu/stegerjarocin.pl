import { useEffect, useState } from 'react';
import './gallery.css';

export function PelnaGaleria() {
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    // Automatyczne pobieranie wszystkich zdjęć z OSOBNEGO folderu: assets/pelna_galeria
    const imageModules = import.meta.glob('./assets/pelna_galeria/*.{png,jpg,jpeg,webp}', { eager: true });
    const imageUrls = Object.values(imageModules).map((mod: any) => mod.default);
    setImages(imageUrls);
  }, []);

  const openLightbox = (url: string) => {
    setSelectedImage(url);
    // Blokujemy przewijanie strony w tle, gdy podgląd jest otwarty
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    // Przywracamy przewijanie strony
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="full-gallery-page">
      <header className="gallery-header mb-16 text-center">
        <h1
          className="mb-4 leading-[1.15]"
          style={{ 
            fontFamily: "'Barlow Condensed', sans-serif", 
            fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)", 
            fontWeight: 700,
            letterSpacing: "0.02em",
            textTransform: "uppercase",
            color: "#ffffff"
          }}
        >
          Nasze Realizacje
        </h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto leading-relaxed" style={{ fontWeight: 300 }}>
          Kliknij na zdjęcie, aby je powiększyć.
        </p>
      </header>

      {/* Nowoczesna, responsywna siatka ze zdjęciami */}
      <div className="gallery-grid">
        {images.map((url, index) => (
          <div key={index} className="gallery-grid-item" onClick={() => openLightbox(url)}>
            <img src={url} alt={`Realizacja ${index + 1}`} loading="lazy" />
            <div className="gallery-item-overlay">
              <span>Powiększ 🔍</span>
            </div>
          </div>
        ))}
      </div>

      {/* LIGHTBOX: Podgląd zdjęcia na pełnym ekranie */}
      {selectedImage && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}>&times;</button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Powiększona realizacja" />
          </div>
        </div>
      )}
    </div>
  );
}