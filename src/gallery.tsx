import { useEffect, useState } from 'react';
import './gallery.css';

interface ZdjecieZOpisem {
  fullUrl: string;  // Ciężkie zdjęcie do powiększenia (Lightbox)
  thumbUrl: string; // Lekka miniaturka do siatki głównej
  title: string;
}

export function PelnaGaleria() {
  const [images, setImages] = useState<ZdjecieZOpisem[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    // 1. Ładujemy oba foldery z assets (Vite przygotuje dla nich ścieżki produkcyjne)
    const fullModules = import.meta.glob('./assets/pelna_galeria/*.{png,jpg,jpeg,webp}', { eager: true });
    const thumbModules = import.meta.glob('./assets/miniaturki/*.{png,jpg,jpeg,webp}', { eager: true });
    
    // 2. Mapujemy miniaturki po nazwach plików, aby łatwo je dopasować
    const thumbsMap: Record<string, string> = {};
    Object.entries(thumbModules).forEach(([path, mod]) => {
      const filename = path.split('/').pop() || '';
      thumbsMap[filename] = (mod as any).default;
    });

    // 3. Łączymy pełne zdjęcie z odpowiadającą mu miniaturką
    const loadedImages = Object.entries(fullModules).map(([path, mod]) => {
      const filename = path.split('/').pop() || '';
      const match = path.match(/\[([^\]]+)\]/);
      const title = match ? match[1] : "";

      return {
        fullUrl: (mod as any).default,
        // Jeśli skrypt jeszcze nie stworzył miniaturki dla nowego zdjęcia, awaryjnie ładujemy pełne
        thumbUrl: thumbsMap[filename] || (mod as any).default, 
        title: title
      };
    });

    setImages(loadedImages);
  }, []);

  // 📱 Obsługa przycisku Wstecz TYLKO dla zamknięcia zdjęcia
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (!event.state?.lightboxOpen) {
        setSelectedImage(null);
        document.body.style.overflow = 'auto';
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const openLightbox = (url: string) => {
    window.history.pushState({ lightboxOpen: true }, '');
    setSelectedImage(url);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (window.history.state?.lightboxOpen) {
      window.history.back();
    } else {
      setSelectedImage(null);
      document.body.style.overflow = 'auto';
    }
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
          <span className="md:hidden">Dotknij, aby powiększyć. Przytrzymaj, aby wyświetlić opis.</span>
          <span className="hidden md:inline">Kliknij na zdjęcie, aby je powiększyć.</span>
        </p>
      </header>

      <div className="gallery-grid">
        {images.map(({ fullUrl, thumbUrl, title }, index) => (
          <div 
            key={index} 
            className="gallery-grid-item" 
            onClick={() => openLightbox(fullUrl)} // Kliknięcie otwiera DUŻE zdjęcie
            style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
          >
            {/* W siatce renderujemy MAŁĄ, szybką miniaturkę */}
            <img src={thumbUrl} alt={title || `Realizacja ${index + 1}`} loading="lazy" style={{ pointerEvents: 'none' }} />
            <div className="gallery-item-overlay" style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '15px', textAlign: 'center' }}>
              {title && <span className="gallery-item-title" style={{ fontWeight: 600, fontSize: '13px', color: '#fff' }}>{title}</span>}
              <span style={{ fontSize: '12px', opacity: title ? 0.8 : 1 }}>Powiększ 🔍</span>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}>&times;</button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Powiększona realizacja" style={{ pointerEvents: 'none', WebkitTouchCallout: 'none' }} />
          </div>
        </div>
      )}
    </div>
  );
}