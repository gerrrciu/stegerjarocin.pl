import image_steger_logo_bia_e_bez_podpisu from '@/imports/steger_logo_bia_e_bez_podpisu.png'
import { useState, useEffect } from "react";
import { Menu, X, ArrowRight, MapPin, Phone, Mail, Clock3 } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import logoBaner from "@/imports/logo_baner.jpg";
import { Galeria } from "@/Galeria";
import { PelnaGaleria } from "@/gallery";

const NAV_LINKS = [
  { label: "O nas", id: "o-nas" },
  { label: "Usługi", id: "uslugi" },
  { label: "Realizacje", id: "realizacje" },
  { label: "Kontakt", id: "kontakt" },
];

const SERVICES = [
  {
    title: "Przyciemnianie szyb",
    desc: "Profesjonalne przyciemnianie szyb samochodowych folią o najwyższej jakości. Ochrona przed UV, prywatność i estetyczny wygląd pojazdu.",
    details: ["Folia przeciwsłoneczna", "Ochrona UV do 99%", "Różne stopnie zaciemnienia", "Szyby boczne i tylna"],
  },
  {
    title: "Oklejanie auta — zmiana koloru",
    desc: "Kompleksowa zmiana koloru pojazdu przy użyciu folii winylowej. Matowe, satynowe, połyskujące i specjalne wykończenia.",
    details: ["Folia matowa i błyszcząca", "Satyna i chrom", "Pełna zmiana koloru", "Oklejanie częściowe"],
  },
  {
    title: "Folia PPF — ochrona lakieru",
    desc: "Zabezpieczenie lakieru przezroczystą folią PPF (Paint Protection Film). Niewidoczna ochrona przed kamieniami, zarysowaniami i insektami.",
    details: ["Folia samoregenerująca", "Ochrona przed odpryskami", "Połysk lub mat", "Przód lub całe auto"],
  },
  {
    title: "Dechroming",
    desc: "Zmiana wyglądu samochodu poprzez oklejenie chromowanych elementów wysokiej jakości folią. To szybki sposób na uzyskanie nowoczesnego i bardziej sportowego charakteru pojazdu bez trwałych modyfikacji.",
    details: ["Listwy okienne", "Grill i emblematy", "Lusterka i detale", "Folia odporna na warunki atmosferyczne"],
  },
];

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentYear, setCurrentYear] = useState<string>("2026");
  const [showCookies, setShowCookies] = useState(false);
  const [view, setView] = useState<'home' | 'gallery'>('home');
  const [savedScrollY, setSavedScrollY] = useState(0);
  // === FORMULARZ ===
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    car: "",
    service: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    const isAccepted = localStorage.getItem("cookiesAccepted");
    if (!isAccepted) {
      setShowCookies(true);
    }
    setCurrentYear(new Date().getFullYear().toString());
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setView('home');
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    setMenuOpen(false);
  };

  const acceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setShowCookies(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    const data = {
      access_key: "4833192e-6a67-496d-82a2-85b4b9f170f8",
      name: formData.name,
      phone: formData.phone,
      car: formData.car,
      service: formData.service,
      message: formData.message,
      from: "Strona Steger - Formularz kontaktowy",
      subject: `Nowe zapytanie od ${formData.name}`,
    };

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus("success");
        setFormData({ name: "", phone: "", car: "", service: "", message: "" });
        const checkbox = document.getElementById("rodo-checkbox") as HTMLInputElement;
        if (checkbox) checkbox.checked = false;
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* NAV */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#000000]/95 backdrop-blur border-b border-border"
            : "bg-[#000000]"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between bg-[#000000]">
          <button onClick={() => { setView('home'); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="h-8 flex items-center">
            <ImageWithFallback
              src={image_steger_logo_bia_e_bez_podpisu}
              alt="Steger — oklejanie i przyciemnianie szyb"
              className="h-8 w-auto object-contain rounded-[2px] mx-[0px] mt-[7px] mb-[1px]"
            />
          </button>

          <ul className="hidden md:flex items-center gap-8">
  {NAV_LINKS.map(({ label, id }) => (
    <li key={id}>
      <button
        onClick={() => {
          setView('home');
          scrollTo(id);
        }}
        className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200 tracking-wide"
      >
        {label}
      </button>
    </li>
  ))}

  {/* Jedyny przycisk galerii na komputerach */}
  <li>
    <button
      onClick={() => {
        setSavedScrollY(window.scrollY); // Zapamiętujemy pozycję scrolla
        setView('gallery');
        window.scrollTo({ top: 0 });
      }}
      className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200 tracking-wide"
    >
      Galeria
    </button>
  </li>

  <li>
    <button
      onClick={() => {
        setView('home');
        scrollTo("kontakt");
      }}
      className="bg-accent text-accent-foreground px-5 py-2 text-sm tracking-wide hover:opacity-90 transition-opacity"
      style={{ borderRadius: "2px" }}
    >
      Wycena
    </button>
  </li>
</ul>

          <button className="md:hidden text-foreground p-1" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <div className={`md:hidden overflow-hidden transition-all duration-300 bg-background border-b border-border ${menuOpen ? "max-h-72" : "max-h-0"}`}>
  <ul className="px-6 py-4 flex flex-col gap-4">
    {/* Pętla generująca standardowe linki: O nas, Usługi, Realizacje, Kontakt */}
    {NAV_LINKS.map(({ label, id }) => (
      <li key={id}>
        <button 
          onClick={() => {
            setView('home'); // Wracamy na stronę główną
            scrollTo(id);    // Przewijamy do sekcji (funkcja scrollTo sama zamyka menu)
          }} 
          className="text-foreground text-base w-full text-left py-1"
        >
          {label}
        </button>
      </li>
    ))}

    {/* OSOBNY, POJEDYNCZY odnośnik do galerii zapisujący pozycję scrolla */}
    <li>
      <button 
        onClick={() => {
          setSavedScrollY(window.scrollY); // Zapamiętujemy, gdzie użytkownik był na stronie głównej
          setView('gallery');              // Przełączamy na galerię
          setMenuOpen(false);              // Zamykamy menu mobilne
          window.scrollTo({ top: 0 });     // Przewijamy widok galerii na samą górę
        }} 
        className="text-foreground text-base w-full text-left py-1 font-medium text-accent"
      >
        Galeria
      </button>
    </li>
  </ul>
</div>
      </nav>

      {/* RENDEROWANIE ZALEŻNE OD WIDOKU */}
      {view === 'home' ? (
        <>
          {/* HERO */}
          <section className="relative h-screen flex items-center overflow-hidden pt-28">
            <img
              src="https://images.unsplash.com/photo-1589362086311-47e158ed1a85?w=1900&h=1200&fit=crop&auto=format"
              alt="Czerwone Ferrari — oklejanie i ochrona lakieru"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-transparent" />

            <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-20 md:pt-28 md:pb-28 w-full">
              <h1
                className="text-foreground leading-[1.05] mb-6"
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: "clamp(2.6rem, 7vw, 5.8rem)",
                  fontWeight: 700,
                }}
              >
                Twój samochód.<br />
                <span style={{ color: "#d10000", fontWeight: 800 }}>
                  Twój pomysł.
                </span>
                <br />
                Nasze wykonanie.
              </h1>
              <p className="text-muted-foreground max-w-lg text-base md:text-lg leading-relaxed mb-10" style={{ fontWeight: 300 }}>
                Tworzymy wyjątkowy wygląd Twojego samochodu.
                Przyciemnianie szyb, zmiana koloru, dechroming i ochrona lakieru folią PPF.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => scrollTo("uslugi")}
                  className="inline-flex items-center gap-3 bg-accent text-accent-foreground px-7 py-3.5 text-sm tracking-wide hover:opacity-90 transition-opacity group"
                  style={{ borderRadius: "2px" }}
                >
                  Nasze usługi
                  <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
                </button>
                <button
                  onClick={() => scrollTo("kontakt")}
                  className="inline-flex items-center gap-3 text-foreground border border-foreground/25 hover:border-foreground/60 px-7 py-3.5 text-sm tracking-wide transition-all duration-200 hover:bg-foreground/5"
                  style={{ borderRadius: "2px" }}
                >
                  Bezpłatna wycena
                </button>
              </div>
            </div>
          </section>

          {/* O NAS */}
          <section id="o-nas" className="py-24 md:py-36">
            <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 md:gap-24 items-center">
              <div>
                <h2
                  className="text-foreground mb-6 leading-[1.15]"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(1.9rem, 3.8vw, 3rem)", fontWeight: 700 }}
                >
                  Pasja do motoryzacji od lat
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-5" style={{ fontWeight: 300 }}>
                  W firmie STEGER zajmujemy się profesjonalnym oklejaniem pojazdów
                  i przyciemnianiem szyb w autach. Każde zlecenie traktujemy indywidualnie —
                  dbamy o każdy detal, od przygotowania powierzchni po finalne wykończenie.
                </p>
                <p className="text-muted-foreground leading-relaxed" style={{ fontWeight: 300 }}>
                  Używamy wyłącznie sprawdzonych, wysokiej jakości folii renomowanych producentów.
                  Naszym celem jest Twoja satysfakcja i efekt, który przekracza oczekiwania.
                </p>
              </div>

              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1508974576580-36a2f92ad3bc?w=900&h=1100&fit=crop&auto=format"
                  alt="Czerwone auto — przykład realizacji Steger"
                  className="w-full object-cover bg-secondary"
                  style={{ aspectRatio: "4/5", borderRadius: "3px" }}
                />
                <div
                  className="absolute top-0 left-0 w-1 h-full bg-accent"
                  style={{ transform: "translateX(-1.5rem)", borderRadius: "1px" }}
                />
              </div>
            </div>
          </section>

          {/* USŁUGI */}
          <section id="uslugi" className="py-24 md:py-36 bg-secondary">
            <div className="max-w-6xl mx-auto px-6">
              <div className="mb-16">
                <h2
                  className="text-foreground text-center leading-[1.15]"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)", fontWeight: 700, letterSpacing: "0.02em", textTransform: "uppercase" }}
                >
                  CO ROBIMY
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {SERVICES.map((service, index) => (
                  <div
                    key={index}
                    className="bg-card border border-border p-8 group hover:border-accent/50 transition-all duration-300"
                    style={{ borderRadius: "3px" }}
                  >
                    <h3
                      className="text-foreground text-xl mb-3 group-hover:text-accent transition-colors duration-200"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}
                    >
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6" style={{ fontWeight: 300 }}>
                      {service.desc}
                    </p>
                    <ul className="flex flex-col gap-2">
                      {service.details.map((d) => (
                        <li key={d} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="w-1.5 h-1.5 bg-accent flex-shrink-0" style={{ borderRadius: "50%" }} />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* REALIZACJE */}
          <section id="realizacje" className="py-24 md:py-36">
            <div className="max-w-6xl mx-auto px-6">
              <h2
                className="text-foreground text-center mb-14 leading-[1.15]"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)", fontWeight: 700 }}
              >
                PRZYKŁADOWE REALIZACJE
              </h2>

              <Galeria />

              <div className="text-center mt-12">
  <button
  onClick={() => { 
    setSavedScrollY(window.scrollY); // Zapamiętujemy aktualną pozycję (będzie to wysokość sekcji realizacje)
    setView('gallery'); 
    window.scrollTo({ top: 0 }); 
  }}
  className="inline-flex items-center gap-3 bg-accent text-accent-foreground px-7 py-3.5 text-sm tracking-wide hover:opacity-90 transition-opacity group"
  style={{ borderRadius: "2px" }}
>
  ZOBACZ PEŁNĄ GALERIĘ
  <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
</button>
</div>
            </div>
          </section>

          {/* KONTAKT */}
          <section id="kontakt" className="py-24 md:py-36 bg-secondary">
            <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 md:gap-24">
              <div>
                <h2
                  className="text-foreground mb-6 leading-[1.15]"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(1.9rem, 3.8vw, 3rem)", fontWeight: 700 }}
                >
                  Zapytaj o bezpłatną wycenę
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-12" style={{ fontWeight: 300 }}>
                  Chętnie odpowiemy na wszystkie pytania i przygotujemy wycenę dopasowaną
                  do Twojego pojazdu i oczekiwań. Zadzwoń lub napisz.
                </p>

                <ul className="flex flex-col gap-6">
                  {[
                    { icon: MapPin, label: "ul. Wrocławska 79b, 63-200 Jarocin" },
                    { icon: Phone, label: "+48 665 183 331" },
                    { icon: Mail, label: "steger.jarocin@gmail.com" },
                    { icon: Clock3, label: "Godziny otwarcia: Poniedziałek – Piątek 8:00–16:00" },
                  ].map(({ icon: Icon, label }) => (
                    <li key={label} className="flex items-center gap-4">
                      <span className="w-10 h-10 flex items-center justify-center border border-border flex-shrink-0" style={{ borderRadius: "2px" }}>
                        <Icon size={16} className="text-accent" />
                      </span>
                      <span className="text-muted-foreground text-sm">{label}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-10 flex flex-col gap-4">
                  <a
                    href="tel:+48665183331"
                    className="inline-flex items-center justify-center gap-3 bg-accent text-accent-foreground px-7 py-3.5 text-sm tracking-wide hover:opacity-90 transition-opacity"
                    style={{ borderRadius: "2px" }}
                  >
                    <Phone size={15} />
                    Zadzwoń teraz
                  </a>

                  <a
                    href="https://wa.me/48665183331?text=Dzień%20dobry.%20Chciałbym%20otrzymać%20wycenę."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 bg-green-600 text-white px-7 py-3.5 text-sm tracking-wide hover:bg-green-700 transition-colors"
                    style={{ borderRadius: "2px" }}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.704 1.456h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Napisz na WhatsApp
                  </a>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {[
                  { id: "name" as const, label: "Imię / Nick", type: "text", placeholder: "Jan Kowalski" },
                  { id: "phone" as const, label: "Telefon lub email", type: "text", placeholder: "+48 600 000 000 / example@email.com" },
                  { id: "car" as const, label: "Pojazd", type: "text", placeholder: "np. BMW E90, Opel Astra Kombi" },
                ].map(({ id, label, type, placeholder }) => (
                  <div key={id} className="flex flex-col gap-2">
                    <label htmlFor={id} className="text-xs tracking-[0.15em] uppercase text-muted-foreground">
                      {label}
                    </label>
                    <input
                      id={id}
                      type={type}
                      placeholder={placeholder}
                      value={formData[id]}
                      onChange={(e) => setFormData(prev => ({ ...prev, [id]: e.target.value }))}
                      className="bg-background border border-border text-foreground placeholder:text-muted-foreground px-4 py-3 text-sm focus:outline-none focus:border-accent/60 transition-colors"
                      style={{ borderRadius: "2px" }}
                      required
                    />
                  </div>
                ))}

                <div className="flex flex-col gap-2">
                  <label htmlFor="service" className="text-xs tracking-[0.15em] uppercase text-muted-foreground">
                    Usługa
                  </label>
                  <select
                    id="service"
                    value={formData.service}
                    onChange={(e) => setFormData(prev => ({ ...prev, service: e.target.value }))}
                    className="bg-background border border-border text-foreground px-4 py-3 text-sm focus:outline-none focus:border-accent/60 transition-colors appearance-none cursor-pointer"
                    style={{ borderRadius: "2px" }}
                    required
                  >
                    <option value="">Wybierz usługę...</option>
                    <option value="Przyciemnianie szyb">Przyciemnianie szyb</option>
                    <option value="Oklejanie — zmiana koloru">Oklejanie — zmiana koloru</option>
                    <option value="Folia PPF — ochrona lakieru">Folia PPF — ochrona lakieru</option>
                    <option value="Dechroming">Dechroming</option>
                    <option value="Kilka usług">Kilka usług</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-xs tracking-[0.15em] uppercase text-muted-foreground">
                    Dodatkowe informacje
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="Opisz czego potrzebujesz..."
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="bg-background border border-border text-foreground placeholder:text-muted-foreground px-4 py-3 text-sm focus:outline-none focus:border-accent/60 transition-colors resize-none"
                    style={{ borderRadius: "2px" }}
                  />
                </div>

                <div className="flex items-start gap-3 mt-4 mb-2">
                  <input
                    id="rodo-checkbox"
                    type="checkbox"
                    className="mt-1 cursor-pointer accent-accent"
                    required
                  />
                  <label htmlFor="rodo-checkbox" className="text-[11px] text-muted-foreground leading-tight cursor-pointer select-none">
                    Wyrażam zgodę na przetwarzanie moich danych osobowych przez firmę Steger w celu obsługi przesłanego zapytania. Wiem, że mogę wycofać tę zgodę w dowolnym momencie. Szczegóły znajdziesz w dokumencie:{" "}
                    <a 
                      href="/polityka-prywatnosci.html" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-accent underline underline-offset-2 hover:opacity-80 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Polityka Privatności
                    </a>.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 bg-accent text-accent-foreground py-3.5 text-sm tracking-wide hover:opacity-90 transition-opacity flex items-center justify-center gap-2 group disabled:opacity-70 w-full"
                  style={{ borderRadius: "2px" }}
                >
                  {isSubmitting ? "Wysyłam..." : "Wyślij zapytanie"}
                  {!isSubmitting && <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />}
                </button>

                {submitStatus === "success" && (
                  <p className="text-green-500 text-sm mt-2">✅ Wiadomość wysłana! Odezwiemy się szybko.</p>
                )}
                {submitStatus === "error" && (
                  <p className="text-red-500 text-sm mt-2">Coś poszło nie tak. Spróbuj ponownie lub zadzwoń.</p>
                )}
              </form>
            </div>
          </section>
        </>
      ) : (
        /* PODSTRONA PEŁNEJ GALERII */
        <div className="pt-24 max-w-6xl mx-auto px-6 pb-12 relative">
          {/* 1. Najpierw cała galeria ze zdjęciami */}
          <PelnaGaleria />
          
          {/* 2. Przycisk umieszczony na samym dole — teraz idealnie pływa i zatrzymuje się przed kreską stopki */}
          <div className="sticky bottom-6 z-40 mt-12 pointer-events-none">
  <div className="sticky bottom-6 z-40 mt-12 pointer-events-none">
  <button 
    onClick={() => {
      setView('home'); // Najpierw przełączamy widok na stronę główną
      
      // Dajemy przeglądarce 50 milisekund na załadowanie elementów strony głównej,
      // a następnie płynnie wracamy dokładnie do zapisanego miejsca
      setTimeout(() => {
        window.scrollTo({ top: savedScrollY, behavior: 'smooth' });
      }, 50);
    }} 
    className="pointer-events-auto bg-[#d10000]/80 backdrop-blur border border-[#d10000]/30 text-white hover:bg-[#d10000]/95 px-4 py-2.5 text-xs tracking-wider uppercase inline-flex items-center gap-2 transition-all duration-200 shadow-xl"
    style={{ borderRadius: "2px" }}
  >
    ← Wróć do strony głównej
  </button>
</div>
</div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-border py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <ImageWithFallback
            src={logoBaner}
            alt="Steger"
            className="h-7 w-auto object-contain opacity-80"
          />
          <p className="text-muted-foreground text-xs text-center">
            © {currentYear} Steger. Wszelkie prawa zastrzeżone.
          </p>

          <div className="flex flex-col items-center md:items-end gap-2">
            <p className="text-muted-foreground text-xs">ul. Wrocławska 79b, Jarocin</p>

            <img 
              src="https://www.hitwebcounter.com/counter/counter.php?page=21506939&style=0038&nbdigits=5&type=ip" 
              alt="Licznik odwiedzin" 
              className="opacity-70 h-5"
              style={{ border: 0 }}
            />

            <a 
              href="/polityka-prywatnosci.html" 
              className="text-[10px] text-muted-foreground/60 hover:text-accent transition-colors underline underline-offset-2"
            >
              Polityka Prywatności
            </a>
          </div>
        </div>
      </footer>

      {/* BANER COOKIES */}
      {showCookies && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border z-50 py-4 px-6 transition-all duration-300">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-xs sm:text-sm text-center sm:text-left max-w-3xl leading-relaxed">
              Nasza strona korzysta z plików cookies (ciasteczek) w celach statystycznych (Google Analytics) oraz aby zapewnić Ci maksymalną wygodę podczas przeglądania witryny. Możesz samodzielnie zarządzać cookies w ustawieniach swojej przeglądarki.
            </p>
            <button
              onClick={acceptCookies}
              className="bg-accent text-accent-foreground px-5 py-2 text-xs tracking-wide hover:opacity-90 transition-opacity flex-shrink-0"
              style={{ borderRadius: "2px" }}
            >
              Akceptuję
            </button>
          </div>
        </div>
      )}

    </div>
  );
}