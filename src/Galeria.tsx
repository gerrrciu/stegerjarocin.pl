import { useEffect, useState, useRef } from 'react';
import './Galeria.css';

export function Galeria() {
  const [images, setImages] = useState<string[]>([]);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isInitialPassed = useRef(false);
  
  // Stan dla przeciągania MYSZKĄ na komputerze
  const [isDown, setIsDown] = useState(false);
  const lastX = useRef(0);
  
  // Referencja do płynnej animacji strzałek
  const scrollAnimationRef = useRef<number | null>(null);

  // Flagi blokujące autoplay i przeskoki pętli
  const isHovered = useRef(false);       // Dla myszki (PC)
  const isTouching = useRef(false);      // NOWOŚĆ: Dla palca (Telefon)
  const autoplayBlockedUntil = useRef(0); // NOWOŚĆ: Blokada czasowa po puszczeniu ekranu

  useEffect(() => {
    // Automatyczne pobieranie zdjęć z folderu assets
    const imageModules = import.meta.glob('./assets/galeria/*.{png,jpg,jpeg,webp}', { eager: true });
    const imageUrls = Object.values(imageModules).map((mod: any) => mod.default);
    setImages(imageUrls);

    return () => {
      if (scrollAnimationRef.current) cancelAnimationFrame(scrollAnimationRef.current);
    };
  }, []);

  // Centrowanie suwaka na początku środkowej paczki zdjęć przy starcie strony
  useEffect(() => {
    if (images.length > 0 && sliderRef.current && !isInitialPassed.current) {
      const timer = setTimeout(() => {
        const container = sliderRef.current;
        if (container) {
          const singleSetWidth = container.scrollWidth / 3;
          container.scrollLeft = singleSetWidth;
          isInitialPassed.current = true;
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [images]);

  // Uniwersalna funkcja zapętlająca strukturę (przerzuca z krawędzi do środka)
  const handleInfiniteLoop = (container: HTMLDivElement) => {
    const singleSetWidth = container.scrollWidth / 3;
    if (singleSetWidth <= 0) return;

    if (container.scrollLeft >= singleSetWidth * 2) {
      container.scrollLeft -= singleSetWidth;
    } 
    else if (container.scrollLeft <= singleSetWidth * 0.5) {
      container.scrollLeft += singleSetWidth;
    }
  };

  // Pętla automatycznego przewijania (autoplay)
  useEffect(() => {
    let autoplayId: number;
    const speed = 0.7; // Prędkość automatycznego przewijania

    const autoScroll = () => {
      const now = performance.now();
      
      if (
        sliderRef.current && 
        isInitialPassed.current && 
        !isDown && 
        !isTouching.current && // Żelazna blokada: palec nie dotyka ekranu
        !isHovered.current &&  // Myszka nie jest nad galerią
        !scrollAnimationRef.current &&
        now > autoplayBlockedUntil.current // Minął czas bezpiecznego wyhamowania
      ) {
        sliderRef.current.scrollLeft += speed;
        handleInfiniteLoop(sliderRef.current);
      }
      autoplayId = requestAnimationFrame(autoScroll);
    };

    autoplayId = requestAnimationFrame(autoScroll);
    return () => cancelAnimationFrame(autoplayId);
  }, [isDown]);

  // Obsługa natywnego przewijania (koło myszy PC, gładzik, dotyk telefonu)
  const handleScrollEvent = () => {
    // KLUCZOWA POPRAWKA: Jeśli użytkownik aktywnie trzyma myszkę LUB dotyka ekranu palcem,
    // NIE pozwalamy skryptowi wykonywać przeskoku pętli. Dzięki temu ruch pod palcem jest w 100% natywny i gładki.
    if (isDown || isTouching.current || !sliderRef.current) return;
    
    handleInfiniteLoop(sliderRef.current);
  };

  // PŁYNNA ANIMACJA DLA STRZAŁEK
  const handleArrowClick = (direction: 'left' | 'right') => {
    const container = sliderRef.current;
    if (!container) return;

    const singleSetWidth = container.scrollWidth / 3;
    const scrollAmount = 350; 
    const delta = direction === 'left' ? -scrollAmount : scrollAmount;

    if (container.scrollLeft >= singleSetWidth * 2) {
      container.scrollLeft -= singleSetWidth;
    } else if (container.scrollLeft <= singleSetWidth * 0.5) {
      container.scrollLeft += singleSetWidth;
    }

    const startScrollLeft = container.scrollLeft;
    const startTime = performance.now();
    const duration = 300; 

    const animate = (currentTime: number) => {
      if (!sliderRef.current) return;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const ease = 1 - Math.pow(1 - progress, 3);
      sliderRef.current.scrollLeft = startScrollLeft + delta * ease;

      handleInfiniteLoop(sliderRef.current);

      if (progress < 1) {
        scrollAnimationRef.current = requestAnimationFrame(animate);
      } else {
        scrollAnimationRef.current = null;
      }
    };

    if (scrollAnimationRef.current) cancelAnimationFrame(scrollAnimationRef.current);
    scrollAnimationRef.current = requestAnimationFrame(animate);
  };

  // ==========================================
  // OBSŁUGA PC: PRZECIĄGANIE MYSZKĄ
  // ==========================================
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    setIsDown(true);
    lastX.current = e.pageX;

    if (scrollAnimationRef.current) {
      cancelAnimationFrame(scrollAnimationRef.current);
      scrollAnimationRef.current = null;
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !sliderRef.current) return;
    e.preventDefault();

    const container = sliderRef.current;
    const deltaX = e.pageX - lastX.current;
    lastX.current = e.pageX;

    container.scrollLeft -= deltaX * 1.2;
    handleInfiniteLoop(container);
  };

  const handleMouseUpOrLeave = () => {
    setIsDown(false);
  };

  // ==========================================
  // OBSŁUGA TELEFONU: PANCERNY DOTYK
  // ==========================================
  const handleTouchStart = () => {
    isTouching.current = true; // Natychmiast i bezwzględnie flagujemy dotyk

    if (scrollAnimationRef.current) {
      cancelAnimationFrame(scrollAnimationRef.current);
      scrollAnimationRef.current = null;
    }
  };

  const handleTouchEnd = () => {
    isTouching.current = false;
    
    // Po zabraniu palca telefon jeszcze przez chwilę przewija galerię siłą rozpędu (inertia).
    // Blokujemy autoplay na kolejne 1.5 sekundy, dając telefonowi czas na naturalne wyhamowanie.
    autoplayBlockedUntil.current = performance.now() + 1500;

    // Na wypadek, gdyby użytkownik przesuwał ultra powoli i puścił palec dokładnie na granicy pętli,
    // wykonujemy bezpieczne sprawdzenie pętli w momencie, gdy palca już nie ma na ekranie.
    if (sliderRef.current) {
      handleInfiniteLoop(sliderRef.current);
    }
  };

  const handleWrapperMouseEnter = () => {
    isHovered.current = true;
  };

  const handleWrapperMouseLeave = () => {
    isHovered.current = false;
    handleMouseUpOrLeave();
  };

  const loopedImages = [...images, ...images, ...images];

  return (
    <div 
      className="galeria-wrapper"
      onMouseEnter={handleWrapperMouseEnter}
      onMouseLeave={handleWrapperMouseLeave}
    >
      <button className="galeria-arrow left" onClick={() => handleArrowClick('left')}>&#10094;</button>

      <div 
        className={`galeria-container ${isDown ? 'active' : ''}`}
        ref={sliderRef}
        onScroll={handleScrollEvent}
        
        // Eventy myszy (PC)
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUpOrLeave}
        onMouseMove={handleMouseMove}
        
        // Eventy dotykowe (Telefon)
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        
        style={{ scrollBehavior: 'auto' }}
      >
        {loopedImages.map((url, index) => (
          <div key={index} className="galeria-item">
            <img src={url} alt={`Realizacja ${index + 1}`} draggable="false" />
          </div>
        ))}
      </div>

      <button className="galeria-arrow right" onClick={() => handleArrowClick('right')}>&#10095;</button>
    </div>
  );
}