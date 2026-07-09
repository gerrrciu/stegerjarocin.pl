import { useEffect, useState } from 'react';
import './gallery.css';

interface ZdjecieZOpisem {
  fullUrl: string;  // Pełne zdjęcie do Lightboxa
  thumbUrl: string; // Lekka miniaturka do siatki
  title?: string;
}

export function PelnaGaleria() {
  const [images, setImages] = useState<ZdjecieZOpisem[]>([]);
  // 🔢 Zmieniamy stan ze stringu na INDEX, aby łatwo przełączać zdjęcia (poprzednie / następne)
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null);

  // 📱 Stany do obsługi płynnego zoomowania (pinch-to-zoom) i przesuwania (pan)
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [touchStartData, setTouchStartData] = useState<{
    distance: number;
    scale: number;
    x: number;
    y: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  // 👆 Stany do obsługi gestu swipowania (prawo / lewo)
  const [swipeStartX, setSwipeStartX] = useState<number | null>(null);
  const [swipeDeltaX, setSwipeDeltaX] = useState<number>(0);

  const resetZoom = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
    setTouchStartData(null);
    setSwipeStartX(null);
    setSwipeDeltaX(0);
  };

  useEffect(() => {
    const fullModules = import.meta.glob('./assets/pelna_galeria/*.{png,jpg,jpeg,webp}', { eager: true });
    const thumbModules = import.meta.glob('./assets/miniaturki/*.{png,jpg,jpeg,webp}', { eager: true });
    
    const thumbsMap: Record<string, string> = {};
    Object.entries(thumbModules).forEach(([path, mod]) => {
      const filename = path.split('/').pop() || '';
      thumbsMap[filename] = (mod as any).default;
    });

    const loadedImages = Object.entries(fullModules).map(([path, mod]) => {
      const filename = path.split('/').pop() || '';
      const match = path.match(/\[([^\]]+)\]/);
      const title = match ? match[1] : "";

      return {
        fullUrl: (mod as any).default,
        thumbUrl: thumbsMap[filename] || (mod as any).default,
        title: title
      };
    });

    setImages(loadedImages);
  }, []);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (!event.state?.lightboxOpen) {
        setCurrentImageIndex(null);
        resetZoom();
        document.body.style.overflow = 'auto';
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const openLightbox = (index: number) => {
    window.history.pushState({ lightboxOpen: true }, '', '#galeria'); 
    setCurrentImageIndex(index);
    resetZoom();
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    resetZoom();
    if (window.history.state?.lightboxOpen) {
      window.history.back(); 
    } else {
      setCurrentImageIndex(null);
      document.body.style.overflow = 'auto';
    }
  };

  // Funkcje nawigacji między zdjęciami
  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation(); // Zapobiega zamknięciu lightboxa przy kliknięciu w strzałkę
    if (currentImageIndex !== null) {
      setCurrentImageIndex((currentImageIndex + 1) % images.length);
      resetZoom();
    }
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation(); // Zapobiega zamknięciu lightboxa przy kliknięciu w strzałkę
    if (currentImageIndex !== null) {
      setCurrentImageIndex((currentImageIndex - 1 + images.length) % images.length);
      resetZoom();
    }
  };

  // 📱 Logika dotykowa: Zoomowanie, Przesuwanie przybliżenia oraz Swipowanie stron
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Dwa palce: zoom
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setTouchStartData({
        distance: dist,
        scale: scale,
        x: 0,
        y: 0,
        offsetX: offset.x,
        offsetY: offset.y
      });
    } else if (e.touches.length === 1) {
      if (scale > 1) {
        // Jeden palec przy powiększeniu: przesuwanie kadru (pan)
        setTouchStartData({
          distance: 0,
          scale: scale,
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          offsetX: offset.x,
          offsetY: offset.y
        });
      } else {
        // Jeden palec bez powiększenia: inicjalizacja swipowania zdjęć
        setSwipeStartX(e.touches[0].clientX);
        setSwipeDeltaX(0);
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStartData && touchStartData.distance > 0) {
      // Skalowanie dwoma palcami
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = dist / touchStartData.distance;
      const newScale = Math.min(Math.max(touchStartData.scale * factor, 1), 4);
      setScale(newScale);
      if (newScale === 1) setOffset({ x: 0, y: 0 });
    } else if (e.touches.length === 1) {
      if (scale > 1 && touchStartData && touchStartData.distance === 0) {
        // Przesuwanie przybliżonego zdjęcia
        const deltaX = e.touches[0].clientX - touchStartData.x;
        const deltaY = e.touches[0].clientY - touchStartData.y;
        setOffset({
          x: touchStartData.offsetX + deltaX,
          y: touchStartData.offsetY + deltaY
        });
      } else if (scale === 1 && swipeStartX !== null) {
        // Przeciąganie zdjęcia w prawo/lewo (efekt wizualny swipowania)
        const deltaX = e.touches[0].clientX - swipeStartX;
        setSwipeDeltaX(deltaX);
      }
    }
  };

  const handleTouchEnd = () => {
    // Sprawdzenie czy intencją użytkownika była zmiana zdjęcia gestem (próg 60 pikseli)
    if (scale === 1 && swipeStartX !== null) {
      if (swipeDeltaX < -60) {
        nextImage();
      } else if (swipeDeltaX > 60) {
        prevImage();
      }
    }
    setTouchStartData(null);
    setSwipeStartX(null);
    setSwipeDeltaX(0);
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
          <span className="md:hidden">Przesuń palcem w bok, aby zmienić zdjęcie. Rozsuń dwa palce, aby przybliżyć.</span>
          <span className="hidden md:inline">Kliknij na zdjęcie, aby je powiększyć. Użyj strzałek do nawigacji.</span>
        </p>
      </header>

      <div className="gallery-grid">
        {images.map(({ thumbUrl, title }, index) => (
          <div 
            key={index} 
            className="gallery-grid-item" 
            onClick={() => openLightbox(index)}
            style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
          >
            <img src={thumbUrl} alt={title || `Realizacja ${index + 1}`} loading="lazy" style={{ pointerEvents: 'none' }} />
            <div className="gallery-item-overlay" style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '15px', textAlign: 'center' }}>
              {title && <span className="gallery-item-title" style={{ fontWeight: 600, fontSize: '13px', color: '#fff' }}>{title}</span>}
              <span style={{ fontSize: '12px', opacity: title ? 0.8 : 1 }}>Powiększ 🔍</span>
            </div>
          </div>
        ))}
      </div>

      {currentImageIndex !== null && (
        <div 
          className="lightbox" 
          onClick={closeLightbox} // 👈 Kliknięcie w dowolne tło zamknie teraz galerię
          style={{ touchAction: 'none' }}
        >
          {/* Krzyżyk zamykania */}
          <button 
            className="lightbox-close" 
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
          >
            &times;
          </button>
          
          {/* ⬅️ LEWA STRZAŁKA (Wersja Biała) */}
<button 
  className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white md:bg-white md:text-black md:hover:bg-neutral-200 w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center text-xl md:text-3xl transition-all z-50 select-none cursor-pointer shadow-md md:shadow-lg"
  onClick={prevImage}
>
  &#8249;
</button>

          <div 
            className="lightbox-content w-full h-full max-w-[92vw] max-h-[82vh] md:max-w-[60vw] md:max-h-[60vh] flex justify-center items-center overflow-hidden" 
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img 
              src={images[currentImageIndex].fullUrl} 
              alt={images[currentImageIndex].title || "Powiększona realizacja"} 
              onClick={(e) => e.stopPropagation()} // 👈 KLUCZOWE: kliknięcie W ZDJĘCIE nie zamyka galerii, ale kliknięcie obok już tak!
              style={{ 
                // Dodajemy swipeDeltaX do transformacji, dzięki czemu zdjęcie przesuwa się na żywo pod palcem podczas swipowania
                transform: `translate(${offset.x + (scale === 1 ? swipeDeltaX : 0)}px, ${offset.y}px) scale(${scale})`,
                // Wyłączamy animację w trakcie ruchu palca (dla natychmiastowej reakcji), włączamy ją przy powrocie
                transition: (touchStartData || swipeStartX !== null) ? 'none' : 'transform 0.2s ease-out',
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                WebkitTouchCallout: 'none',
                userSelect: 'none'
              }} 
            />
          </div>

          {/* ➡️ PRAWA STRZAŁKA (Wersja Biała) */}
<button 
  className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white md:bg-white md:text-black md:hover:bg-neutral-200 w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center text-xl md:text-3xl transition-all z-50 select-none cursor-pointer shadow-md md:shadow-lg"
  onClick={nextImage}
>
  &#8250;
</button>
        </div>
      )}
    </div>
  );
}