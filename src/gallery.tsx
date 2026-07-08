import { useEffect, useState } from 'react';
import './gallery.css';

// Definiujemy strukturę obiektu dla każdego zdjęcia (url + opcjonalny opis)
interface ZdjecieZOpisem {
  url: string;
  title: string;
}

export function PelnaGaleria() {
  const [images, setImages] = useState<ZdjecieZOpisem[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    // Automatyczne pobieranie wszystkich zdjęć z folderu: assets/pelna_galeria
    const imageModules = import.meta.glob('./assets/pelna_galeria/*.{png,jpg,jpeg,webp}', { eager: true });
    
    const loadedImages = Object.entries(imageModules).map(([path, mod]) => {
      const match = path.match(/\[([^\]]+)\]/);
      const title = match ? match[1] : "";

      return {
        url: (mod as any).default,
        title: title
      };
    });

    setImages(loadedImages);
  }, []);

  const openLightbox = (url: string) => {
    setSelectedImage(url);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
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
        
        {/* Responsywny podział na tekst mobilny i desktopowy */}
        <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto leading-relaxed" style={{ fontWeight: 300 }}>
          <span className="md:hidden">Dotknij zdjęcia, aby je powiększyć. Przytrzymaj aby przeczytać opis.</span>
          <span className="hidden md:inline">Kliknij na zdjęcie, aby je powiększyć.</span>
        </p>
      </header>

      {/* Nowoczesna, responsywna siatka ze zdjęciami */}
      <div className="gallery-grid">
        {images.map(({ url, title }, index) => (
          <div 
            key={index} 
            className="gallery-grid-item" 
            onClick={() => openLightbox(url)}
            style={{
              WebkitTouchCallout: 'none', /* Blokuje menu kontekstowe/zapis na iOS */
              WebkitUserSelect: 'none',   /* Blokuje zaznaczanie tekstu w Safari */
              MozUserSelect: 'none',      /* Blokuje zaznaczanie w Firefox */
              msUserSelect: 'none',       /* Blokuje zaznaczanie w IE/Edge */
              userSelect: 'none'          /* Standardowa blokada zaznaczania tekstu */
            }}
          >
            {/* pointerEvents: 'none' sprawia, że telefon "nie widzi" fizycznego pliku graficznego przy przytrzymaniu */}
            <img 
              src={url} 
              alt={title || `Realizacja ${index + 1}`} 
              loading="lazy" 
              style={{ pointerEvents: 'none' }} 
            />
            
            <div className="gallery-item-overlay" style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '15px', textAlign: 'center' }}>
              {title && (
                <span className="gallery-item-title" style={{ fontWeight: 600, fontSize: '13px', color: '#fff', display: 'block', lineHeight: '1.3' }}>
                  {title}
                </span>
              )}
              
              {/* FIX: Usunięto zagnieżdżenie span-w-span. Likwiduje to podwójną ramkę widoczną na screenie */}
              <span style={{ fontSize: '12px', opacity: title ? 0.8 : 1 }}>
                Powiększ 🔍
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* LIGHTBOX: Podgląd zdjęcia na pełnym ekranie */}
      {selectedImage && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}>&times;</button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            {/* Zabezpieczenie zdjęcia również wewnątrz lighboxa */}
            <img 
              src={selectedImage} 
              alt="Powiększona realizacja" 
              style={{ pointerEvents: 'none', WebkitTouchCallout: 'none' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}