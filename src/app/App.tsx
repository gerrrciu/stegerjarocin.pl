import image_steger_logo_bia_e_bez_podpisu from '@/imports/steger_logo_bia_e_bez_podpisu.png'
import { useState, useEffect } from "react";
import { Menu, X, ArrowRight, MapPin, Phone, Mail } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import logoBaner from "@/imports/logo_baner.jpg";

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
];

const GALLERY = [
  {
    src: "https://images.unsplash.com/photo-1526459915562-c5ca724b1d02?w=900&h=1100&fit=crop&auto=format",
    alt: "Ciemna szyba samochodowa z folią przyciemniającą",
  },
  {
    src: "https://images.unsplash.com/photo-1532578498858-e21a39e0a449?w=900&h=600&fit=crop&auto=format",
    alt: "Mercedes z oklejeniem winylowym",
  },
  {
    src: "https://images.unsplash.com/photo-1632479802844-487afb74f525?w=900&h=600&fit=crop&auto=format",
    alt: "Czarny sportowy samochód z matową folią",
  },
  {
    src: "https://images.unsplash.com/photo-1528964132366-4409d2d4a862?w=900&h=600&fit=crop&auto=format",
    alt: "Detal reflektora — ochrona folią PPF",
  },
];

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
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
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${scrolled ? "bg-background/96 backdrop-blur border-b border-border" : "bg-transparent"} bg-[#000000]`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between bg-[#000000]">
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="h-8 flex items-center">
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
                  onClick={() => scrollTo(id)}
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200 tracking-wide"
                >
                  {label}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => scrollTo("kontakt")}
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
            {NAV_LINKS.map(({ label, id }) => (
              <li key={id}>
                <button onClick={() => scrollTo(id)} className="text-foreground text-base w-full text-left py-1">
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative h-screen flex items-end overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1589362086311-47e158ed1a85?w=1900&h=1200&fit=crop&auto=format"
          alt="Czerwone Ferrari — oklejanie i ochrona lakieru"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 pb-20 md:pb-28 w-full">
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
              Nowa odsłona.
            </span>
          </h1>
          <p className="text-muted-foreground max-w-lg text-base md:text-lg leading-relaxed mb-10" style={{ fontWeight: 300 }}>
            Przyciemniamy szyby, zmieniamy kolor auta i chronimy lakier folią PPF.
            Precyzja i jakość na każdym etapie.
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
              Firma Steger to specjalistyczny zakład zajmujący się profesjonalnym oklejaniem pojazdów
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
              className="text-foreground leading-[1.15] max-w-xl"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)", fontWeight: 700, letterSpacing: "0.02em", textTransform: "uppercase" }}
            >
              Co robimy
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
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
            className="text-foreground mb-14 leading-[1.15]"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(1.9rem, 3.8vw, 3rem)", fontWeight: 700 }}
          >
            Nasza praca mówi sama
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ gridAutoRows: "280px" }}>
            <div className="md:row-span-2 overflow-hidden bg-secondary" style={{ borderRadius: "3px" }}>
              <img src={GALLERY[0].src} alt={GALLERY[0].alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            {GALLERY.slice(1).map((img, i) => (
              <div key={i} className="overflow-hidden bg-secondary" style={{ borderRadius: "3px" }}>
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            ))}
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
              ].map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-4">
                  <span className="w-10 h-10 flex items-center justify-center border border-border flex-shrink-0" style={{ borderRadius: "2px" }}>
                    <Icon size={16} className="text-accent" />
                  </span>
                  <span className="text-muted-foreground text-sm">{label}</span>
                </li>
              ))}
            </ul>

            <a
              href="tel:+48665183331"
              className="mt-10 inline-flex items-center gap-3 bg-accent text-accent-foreground px-7 py-3.5 text-sm tracking-wide hover:opacity-90 transition-opacity group"
              style={{ borderRadius: "2px" }}
            >
              <Phone size={15} />
              Zadzwoń teraz
            </a>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {[
              { id: "name", label: "Imię / Nick", type: "text", placeholder: "Jan Kowalski" },
              { id: "phone", label: "Telefon lub email", type: "tel", placeholder: "+48 600 000 000 / example@email.com" },
              { id: "car", label: "Pojazd", type: "text", placeholder: "np. BMW E90, Opel Astra Kombi" },
            ].map(({ id, label, type, placeholder }) => (
              <div key={id} className="flex flex-col gap-2">
                <label htmlFor={id} className="text-xs tracking-[0.15em] uppercase text-muted-foreground">
                  {label}
                </label>
                <input
                  id={id}
                  type={type}
                  placeholder={placeholder}
                  value={formData[id as keyof typeof formData]}
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 bg-accent text-accent-foreground py-3.5 text-sm tracking-wide hover:opacity-90 transition-opacity flex items-center justify-center gap-2 group disabled:opacity-70"
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

      {/* FOOTER */}
      <footer className="border-t border-border py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <ImageWithFallback
            src={logoBaner}
            alt="Steger"
            className="h-7 w-auto object-contain opacity-80"
          />
          <p className="text-muted-foreground text-xs text-center">
            © {new Date().getFullYear()} Steger. Wszelkie prawa zastrzeżone.
          </p>
          <p className="text-muted-foreground text-xs">ul. Wrocławska 79b, Jarocin</p>
        </div>
      </footer>
    </div>
  );
}