import { useState, useEffect } from 'react'

// ─── Data ────────────────────────────────────────────────────────────────────

const bannerSlides = [
  {
    id: 1,
    title: 'Ofertas Explosivas',
    subtitle: 'Hasta 40% OFF en herramientas eléctricas seleccionadas',
    cta: 'Ver Ofertas',
    accent: '#DC2626',
    image: 'https://images.unsplash.com/photo-1759200165738-6366977a73c6?w=1400&h=600&fit=crop&auto=format',
  },
  {
    id: 2,
    title: 'Temporada de Construcción',
    subtitle: 'Todo lo que necesitas para tu proyecto, un solo lugar',
    cta: 'Ver Catálogo',
    accent: '#1a1a1a',
    image: 'https://images.unsplash.com/photo-1519520104014-df63821cb6f9?w=1400&h=600&fit=crop&auto=format',
  },
  {
    id: 3,
    title: 'Herramientas de Calidad',
    subtitle: 'Las mejores marcas internacionales al mejor precio del mercado',
    cta: 'Comprar Ahora',
    accent: '#7f1d1d',
    image: 'https://images.unsplash.com/photo-1773325035245-66f793d71d5c?w=1400&h=600&fit=crop&auto=format',
  },
]

const categories = [
  { name: 'Herramientas Eléctricas', icon: '⚡', count: 142, color: '#DC2626' },
  { name: 'Herramientas de Mano', icon: '🔧', count: 89, color: '#1a1a1a' },
  { name: 'Plomería', icon: '🚿', count: 67, color: '#1d4ed8' },
  { name: 'Electricidad', icon: '💡', count: 95, color: '#d97706' },
  { name: 'Pintura & Acabados', icon: '🎨', count: 53, color: '#7c3aed' },
  { name: 'Seguridad Industrial', icon: '🦺', count: 41, color: '#059669' },
  { name: 'Fijaciones & Tornillería', icon: '🔩', count: 120, color: '#475569' },
  { name: 'Materiales de Construcción', icon: '🏗️', count: 78, color: '#92400e' },
]

const products = [
  {
    id: 1,
    name: 'Taladro Inalámbrico 20V MAX',
    price: 145,
    originalPrice: 175,
    image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=500&h=500&fit=crop&auto=format',
    brand: 'DeWalt',
    badge: 'Oferta',
    badgeColor: '#DC2626',
    description: 'Taladro inalámbrico profesional de 20V con batería de litio de alto rendimiento. Ideal para perforación en madera, metal y mampostería, y para atornillado en cualquier proyecto.',
    features: ['Motor de alta eficiencia', 'Batería 20V MAX litio-ion', 'Portabrocas 1/2" sin llave', '2 velocidades (0–450 / 0–1500 RPM)', 'Incluye maletín y cargador'],
  },
  {
    id: 2,
    name: 'Taladro Percutor 750W GSB',
    price: 105,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1622044939413-0b829c342434?w=500&h=500&fit=crop&auto=format',
    brand: 'Bosch',
    badge: 'Nuevo',
    badgeColor: '#1d4ed8',
    description: 'Taladro percutor de 750W con función de impacto para concreto y mampostería. Robusto y confiable para los trabajos más exigentes del día a día.',
    features: ['Potencia de 750W', 'Función percutor para concreto', 'Empuñadura auxiliar', 'Tope de profundidad ajustable', 'Velocidad variable y reversible'],
  },
  {
    id: 3,
    name: 'Set Herramientas 40 Piezas',
    price: 82,
    originalPrice: 96,
    image: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=500&h=500&fit=crop&auto=format',
    brand: 'Stanley',
    badge: 'Oferta',
    badgeColor: '#DC2626',
    description: 'Juego completo de 40 herramientas esenciales para el hogar y el taller, organizadas en un estuche resistente para tenerlas siempre a mano.',
    features: ['40 piezas de acero cromado', 'Estuche organizador rígido', 'Llaves, destornilladores y dados', 'Incluye alicate y cinta métrica', 'Garantía de por vida'],
  },
  {
    id: 4,
    name: 'Martillo de Carpintero 20oz',
    price: 16,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1586864387789-628af9feed72?w=500&h=500&fit=crop&auto=format',
    brand: 'Truper',
    badge: null,
    badgeColor: null,
    description: 'Martillo de carpintero de 20 onzas con cabeza de acero forjado y mango antideslizante. Balanceado para un trabajo cómodo y preciso.',
    features: ['Cabeza de acero forjado de 20oz', 'Mango de fibra de vidrio', 'Agarre ergonómico antideslizante', 'Uña curva para extraer clavos'],
  },
  {
    id: 5,
    name: 'Sierra Circular 7-1/4" 1800W',
    price: 215,
    originalPrice: 240,
    image: 'https://images.unsplash.com/photo-1689935421853-cb23a0bc92e4?w=500&h=500&fit=crop&auto=format',
    brand: 'Makita',
    badge: 'Popular',
    badgeColor: '#059669',
    description: 'Sierra circular de 1800W con disco de 7-1/4", potente y precisa para cortes rápidos y limpios en madera y tableros.',
    features: ['Potencia de 1800W', 'Disco de 7-1/4" (185mm)', 'Profundidad de corte de 66mm', 'Base de aluminio resistente', 'Freno eléctrico de seguridad'],
  },
  {
    id: 6,
    name: 'Llave Inglesa Ajustable 12"',
    price: 13,
    originalPrice: 19,
    image: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=500&h=500&fit=crop&auto=format',
    brand: 'Irwin',
    badge: 'Oferta',
    badgeColor: '#DC2626',
    description: 'Llave inglesa ajustable de 12 pulgadas con acabado cromado y mordazas de apertura amplia. Herramienta versátil para plomería y mecánica.',
    features: ['Longitud de 12"', 'Mordaza ajustable de apertura amplia', 'Acero al cromo-vanadio', 'Escala graduada', 'Acabado anticorrosivo'],
  },
  {
    id: 7,
    name: 'Pintura Látex Interior 4L',
    price: 31,
    originalPrice: 36,
    image: 'https://images.unsplash.com/photo-1510016290251-68aaad49723e?w=500&h=500&fit=crop&auto=format',
    brand: '3M',
    badge: 'Oferta',
    badgeColor: '#DC2626',
    description: 'Pintura látex lavable para interiores con acabado mate, excelente cobertura y secado rápido. Bajo olor y fácil de aplicar.',
    features: ['Rendimiento de 4 litros', 'Acabado mate lavable', 'Secado rápido (1 hora)', 'Base agua, bajo olor', 'Cobertura de hasta 40 m²'],
  },
  {
    id: 8,
    name: 'Taladro Atornillador 12V',
    price: 55,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1715322554946-1b22a9800aec?w=500&h=500&fit=crop&auto=format',
    brand: 'Black+Decker',
    badge: null,
    badgeColor: null,
    description: 'Taladro atornillador inalámbrico de 12V, compacto y ligero. Ideal para tareas del hogar, montaje de muebles y reparaciones rápidas.',
    features: ['Batería de 12V litio-ion', 'Compacto y liviano', 'Control de torque ajustable', 'Portabrocas sin llave', 'Incluye cargador'],
  },
]

const brands = [
  'DeWalt', 'Stanley', 'Bosch', 'Makita', 'Black+Decker',
  'Milwaukee', 'Truper', '3M', 'Irwin', 'Craftsman', 'Ryobi', 'Hilti',
]

const locations = [
  {
    id: 1,
    name: 'Ferre Carúpano',
    address: 'Carúpano, Estado Sucre, Venezuela',
    phone: '+58 414-9969965',
    hours: 'Lun–Sáb: 8:00am – 6:00pm · Dom: Cerrado',
    mapSrc:
      'https://maps.google.com/maps?q=Car%C3%BApano%2C%20Estado%20Sucre%2C%20Venezuela&t=&z=13&ie=UTF8&iwloc=&output=embed',
  },
]

// ─── Icons ───────────────────────────────────────────────────────────────────

function IconInstagram() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  )
}

function IconFacebook() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function IconTikTok() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.69a8.19 8.19 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.02-.07z"/>
    </svg>
  )
}

function IconWhatsApp() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
    </svg>
  )
}

function IconMapPin() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function IconPhone() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.58 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.1 6.1l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function IconClock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function IconChevronLeft() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function IconChevronRight() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  'US$ ' + n.toLocaleString('en-US')

// Referencia en bolívares: 1 USD ≈ 800 BS
const BS_RATE = 800
const fmtBs = (n: number) =>
  'BS ' + (n * BS_RATE).toLocaleString('es-VE')

// Contacto / WhatsApp
const WA_NUMBER = '584149969965'
const WA_DISPLAY = '+58 414-9969965'
const waLink = (text?: string) =>
  `https://wa.me/${WA_NUMBER}` + (text ? `?text=${encodeURIComponent(text)}` : '')

// ─── Components ──────────────────────────────────────────────────────────────

const navLinks = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Categorías', href: '#categorias' },
  { label: 'Catálogo', href: '#catalogo' },
  { label: 'Marcas', href: '#marcas' },
  { label: 'Ubicaciones', href: '#ubicaciones' },
  { label: 'Contacto', href: '#contacto' },
]

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header style={{ background: '#fff', borderBottom: '2px solid #DC2626', position: 'sticky', top: 0, zIndex: 50 }}>
      {/* Top bar */}
      <div style={{ background: '#DC2626', color: '#fff', fontSize: '13px', padding: '6px 0', textAlign: 'center' }}>
        📞 Llámanos: {WA_DISPLAY} &nbsp;|&nbsp; 🚚 Entregas a todo el país &nbsp;|&nbsp; ⏰ Lun–Sáb 8am–6pm
      </div>

      {/* Main nav */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
        {/* Logo */}
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '44px', height: '44px', background: '#DC2626',
            borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#fff', fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '22px', letterSpacing: '-1px' }}>F</span>
          </div>
          <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '26px', color: '#DC2626', letterSpacing: '-0.5px' }}>
            Ferre
          </span>
        </a>

        {/* Desktop links */}
        <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }} className="hidden-mobile">
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              className="nav-link"
              style={{ color: '#1a1a1a', fontSize: '15px', fontWeight: 500, textDecoration: 'none' }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a
          href={waLink()}
          target="_blank"
          rel="noreferrer"
          className="hidden-mobile"
          style={{
            background: '#25D366', color: '#fff', padding: '10px 20px',
            borderRadius: '6px', fontSize: '14px', fontWeight: 600,
            textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px',
          }}
        >
          <IconWhatsApp />
          WhatsApp
        </a>

        {/* Hamburger (mobile) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'none' }}
          className="show-mobile"
        >
          <div style={{ width: '24px', height: '2px', background: '#1a1a1a', marginBottom: '5px' }} />
          <div style={{ width: '24px', height: '2px', background: '#1a1a1a', marginBottom: '5px' }} />
          <div style={{ width: '24px', height: '2px', background: '#1a1a1a' }} />
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <nav
          className="show-mobile"
          style={{
            flexDirection: 'column', background: '#fff',
            borderTop: '1px solid #eee', padding: '8px 0 12px',
          }}
        >
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block', color: '#1a1a1a', fontSize: '16px', fontWeight: 600,
                textDecoration: 'none', padding: '13px 24px', borderBottom: '1px solid #f2f2f2',
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href={waLink()}
            target="_blank"
            rel="noreferrer"
            onClick={() => setMenuOpen(false)}
            style={{
              margin: '12px 24px 0', background: '#25D366', color: '#fff',
              padding: '13px', borderRadius: '6px', fontSize: '15px', fontWeight: 700,
              textDecoration: 'none', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '8px',
            }}
          >
            <IconWhatsApp />
            WhatsApp
          </a>
        </nav>
      )}
    </header>
  )
}

function BannerSlider() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCurrent(p => (p + 1) % bannerSlides.length), 4500)
    return () => clearInterval(t)
  }, [])

  const slide = bannerSlides[current]

  return (
    <section id="inicio" style={{ position: 'relative', height: '520px', overflow: 'hidden', background: '#1a1a1a' }}>
      {/* Background image */}
      <img
        key={slide.id}
        src={slide.image}
        alt={slide.title}
        className="slide-in"
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', opacity: 0.35,
        }}
      />

      {/* Overlay gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(to right, ${slide.accent}ee 0%, ${slide.accent}88 50%, transparent 100%)`,
      }} />

      {/* Content */}
      <div className="banner-content" style={{
        position: 'relative', zIndex: 2, maxWidth: '1200px', margin: '0 auto',
        padding: '0 48px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center',
      }}>
        <div key={current} className="slide-in">
          <div style={{
            display: 'inline-block', background: '#fff', color: '#DC2626',
            fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase',
            padding: '4px 12px', borderRadius: '2px', marginBottom: '16px',
          }}>
            Ferre · Ferretería
          </div>
          <h1 style={{
            fontFamily: "'Roboto Slab', serif", fontWeight: 800,
            fontSize: 'clamp(36px, 5vw, 64px)', color: '#fff',
            margin: '0 0 16px', lineHeight: 1.1, maxWidth: '600px',
          }}>
            {slide.title}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: '18px', margin: '0 0 32px', maxWidth: '480px' }}>
            {slide.subtitle}
          </p>
          <a
            href="#catalogo"
            style={{
              display: 'inline-block', background: '#fff', color: '#DC2626',
              padding: '14px 32px', borderRadius: '4px', fontWeight: 700,
              fontSize: '16px', textDecoration: 'none', letterSpacing: '0.3px',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {slide.cta} →
          </a>
        </div>
      </div>

      {/* Dots */}
      <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px', zIndex: 3 }}>
        {bannerSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: i === current ? '28px' : '8px', height: '8px',
              borderRadius: '4px', border: 'none', cursor: 'pointer',
              background: i === current ? '#fff' : 'rgba(255,255,255,0.45)',
              transition: 'all 0.3s ease', padding: 0,
            }}
          />
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={() => setCurrent(p => (p - 1 + bannerSlides.length) % bannerSlides.length)}
        style={{
          position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)',
          background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)',
          borderRadius: '50%', width: '44px', height: '44px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', zIndex: 3,
        }}
      >
        <IconChevronLeft />
      </button>
      <button
        onClick={() => setCurrent(p => (p + 1) % bannerSlides.length)}
        style={{
          position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)',
          background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)',
          borderRadius: '50%', width: '44px', height: '44px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', zIndex: 3,
        }}
      >
        <IconChevronRight />
      </button>
    </section>
  )
}

function Categories() {
  return (
    <section id="categorias" style={{ background: '#f5f5f5', padding: '72px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '48px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ color: '#DC2626', fontSize: '13px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
              Nuestras Categorías
            </div>
            <h2 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '38px', margin: 0, color: '#1a1a1a' }}>
              Encuentra lo que<br />necesitas
            </h2>
          </div>
          <a href="#catalogo" style={{ color: '#DC2626', fontWeight: 600, textDecoration: 'none', fontSize: '15px' }}>
            Ver todo el catálogo →
          </a>
        </div>

        <div className="categories-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
          {categories.map(cat => (
            <a
              key={cat.name}
              href="#catalogo"
              style={{
                background: '#fff', borderRadius: '8px', padding: '24px 20px',
                cursor: 'pointer', border: '1px solid #e5e5e5', textDecoration: 'none',
                transition: 'box-shadow 0.2s, transform 0.2s', display: 'block',
              }}
              className="product-card category-card"
            >
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>{cat.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '15px', color: '#1a1a1a', marginBottom: '4px' }}>
                {cat.name}
              </div>
              <div style={{ fontSize: '13px', color: '#888' }}>{cat.count} productos</div>
              <div style={{ width: '32px', height: '3px', background: cat.color, borderRadius: '2px', marginTop: '16px' }} />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

type Product = typeof products[number]

function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="modal-card fade-up"
        style={{
          background: '#fff', borderRadius: '14px', overflow: 'hidden',
          maxWidth: '860px', width: '100%', maxHeight: '90vh', overflowY: 'auto',
          display: 'grid', gridTemplateColumns: '1fr 1fr', position: 'relative',
          boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Cerrar"
          style={{
            position: 'absolute', top: '14px', right: '14px', zIndex: 3,
            width: '36px', height: '36px', borderRadius: '50%', border: 'none',
            background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: '20px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            lineHeight: 1,
          }}
        >
          ×
        </button>

        {/* Image */}
        <div className="modal-img" style={{ position: 'relative', background: '#f5f5f5', minHeight: '280px' }}>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'multiply' }}
          />
          {product.badge && (
            <span style={{
              position: 'absolute', top: '16px', left: '16px',
              background: product.badgeColor ?? '#DC2626', color: '#fff',
              fontSize: '12px', fontWeight: 700, padding: '4px 12px',
              borderRadius: '3px', letterSpacing: '0.5px', textTransform: 'uppercase',
            }}>
              {product.badge}
            </span>
          )}
        </div>

        {/* Details */}
        <div style={{ padding: '28px 28px 32px' }}>
          <div style={{ fontSize: '12px', color: '#DC2626', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>
            {product.brand}
          </div>
          <h3 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '24px', color: '#1a1a1a', margin: '0 0 14px', lineHeight: 1.2 }}>
            {product.name}
          </h3>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '30px', color: '#DC2626' }}>
              {fmt(product.price)}
            </span>
            {product.originalPrice && (
              <span style={{ fontSize: '16px', color: '#aaa', textDecoration: 'line-through' }}>
                {fmt(product.originalPrice)}
              </span>
            )}
          </div>
          <div style={{ fontSize: '15px', color: '#555', fontWeight: 600, marginTop: '2px' }}>
            {fmtBs(product.price)}
          </div>
          {product.originalPrice && (
            <div style={{ fontSize: '13px', color: '#059669', fontWeight: 600, marginTop: '4px' }}>
              Ahorras {fmt(product.originalPrice - product.price)}
            </div>
          )}

          {/* Description */}
          <p style={{ fontSize: '14px', color: '#444', lineHeight: 1.65, margin: '20px 0 16px' }}>
            {product.description}
          </p>

          {/* Features */}
          <div style={{ fontSize: '12px', color: '#888', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
            Características
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {product.features.map(f => (
              <li key={f} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '14px', color: '#333' }}>
                <span style={{ color: '#DC2626', fontWeight: 800, flexShrink: 0 }}>✓</span>
                {f}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <a
            href={waLink(
              `Hola, quiero consultar sobre este producto:\n\n` +
              `• ${product.name} (${product.brand})\n` +
              `• Precio: ${fmt(product.price)} / ${fmtBs(product.price)}\n\n` +
              `¿Está disponible y cuánto cuesta con el envío?`
            )}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              background: '#25D366', color: '#fff', padding: '14px', borderRadius: '8px',
              fontWeight: 700, fontSize: '15px', textDecoration: 'none',
            }}
          >
            <IconWhatsApp />
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}

function Catalog() {
  const [filter, setFilter] = useState('Todos')
  const [selected, setSelected] = useState<Product | null>(null)
  const filters = ['Todos', 'Ofertas', 'Nuevos', 'Populares']

  const filtered = filter === 'Todos'
    ? products
    : products.filter(p => p.badge === filter.replace('Nuevos', 'Nuevo').replace('Populares', 'Popular').replace('Ofertas', 'Oferta'))

  return (
    <section id="catalogo" style={{ background: '#fff', padding: '72px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
          <div>
            <div style={{ color: '#DC2626', fontSize: '13px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
              Catálogo de Productos
            </div>
            <h2 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '38px', margin: 0, color: '#1a1a1a' }}>
              Precios que no<br />encontrarás en otro lugar
            </h2>
          </div>

          {/* Filter pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '8px 20px', borderRadius: '24px', border: '2px solid',
                  borderColor: filter === f ? '#DC2626' : '#e5e5e5',
                  background: filter === f ? '#DC2626' : '#fff',
                  color: filter === f ? '#fff' : '#555',
                  fontWeight: 600, fontSize: '14px', cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="catalog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
          {filtered.map(product => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => setSelected(product)}
              style={{
                background: '#fff', borderRadius: '10px', border: '1px solid #ebebeb',
                overflow: 'hidden', cursor: 'pointer',
                display: 'flex', flexDirection: 'column',
              }}
            >
              {/* Image */}
              <div className="product-img" style={{ position: 'relative', background: '#f9f9f9', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'multiply' }}
                />
                {product.badge && (
                  <span style={{
                    position: 'absolute', top: '12px', left: '12px',
                    background: product.badgeColor ?? '#DC2626', color: '#fff',
                    fontSize: '11px', fontWeight: 700, padding: '3px 10px',
                    borderRadius: '3px', letterSpacing: '0.5px', textTransform: 'uppercase',
                  }}>
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="product-info" style={{ padding: '16px 18px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ fontSize: '11px', color: '#DC2626', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '4px' }}>
                  {product.brand}
                </div>
                <div className="product-name" style={{ fontWeight: 600, fontSize: '15px', color: '#1a1a1a', marginBottom: '12px', lineHeight: 1.35 }}>
                  {product.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
                  <span className="product-price" style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '22px', color: '#DC2626' }}>
                    {fmt(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span style={{ fontSize: '14px', color: '#aaa', textDecoration: 'line-through' }}>
                      {fmt(product.originalPrice)}
                    </span>
                  )}
                </div>
                {/* Referencia en bolívares */}
                <div style={{ fontSize: '13px', color: '#555', fontWeight: 600, marginTop: '2px' }}>
                  {fmtBs(product.price)}
                </div>
                {product.originalPrice && (
                  <div style={{ fontSize: '12px', color: '#059669', fontWeight: 600, marginTop: '4px' }}>
                    Ahorras {fmt(product.originalPrice - product.price)}
                  </div>
                )}
                {/* flexible spacer keeps the button pinned to the bottom */}
                <div style={{ flex: 1, minHeight: '14px' }} />
                <button
                  className="product-btn"
                  style={{
                    width: '100%', padding: '11px',
                    background: '#DC2626', color: '#fff', border: 'none',
                    borderRadius: '6px', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#b91c1c')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#DC2626')}
                >
                  Ver detalles
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Product detail modal */}
        {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <a
            href={waLink()}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              background: '#25D366', color: '#fff', padding: '14px 36px',
              borderRadius: '6px', fontWeight: 700, fontSize: '16px',
              textDecoration: 'none',
            }}
          >
            <IconWhatsApp />
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}

function BrandsCarousel() {
  const doubled = [...brands, ...brands]

  return (
    <section id="marcas" style={{ background: '#1a1a1a', padding: '56px 0', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', marginBottom: '32px', textAlign: 'center' }}>
        <div style={{ color: '#DC2626', fontSize: '13px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
          Nuestras Marcas
        </div>
        <h2 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '32px', color: '#fff', margin: 0 }}>
          Trabajamos con los mejores
        </h2>
      </div>

      {/* Infinite marquee */}
      <div style={{ overflow: 'hidden', position: 'relative' }}>
        {/* fade edges */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: '120px', zIndex: 2,
          background: 'linear-gradient(to right, #1a1a1a, transparent)',
        }} />
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: '120px', zIndex: 2,
          background: 'linear-gradient(to left, #1a1a1a, transparent)',
        }} />

        <div className="animate-marquee" style={{ gap: '0' }}>
          {doubled.map((brand, i) => (
            <div
              key={i}
              style={{
                flexShrink: 0, padding: '0 40px',
                borderRight: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                height: '72px',
              }}
            >
              <span style={{
                fontFamily: "'Roboto Slab', serif", fontWeight: 700,
                fontSize: '20px', color: 'rgba(255,255,255,0.5)',
                whiteSpace: 'nowrap', letterSpacing: '-0.3px',
                transition: 'color 0.2s',
              }}>
                {brand}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Locations() {
  const [active, setActive] = useState(0)
  const loc = locations[active]

  return (
    <section id="ubicaciones" style={{ background: '#f5f5f5', padding: '72px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '48px' }}>
          <div style={{ color: '#DC2626', fontSize: '13px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
            Dónde Encontrarnos
          </div>
          <h2 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '38px', margin: '0 0 8px', color: '#1a1a1a' }}>
            Nuestras Sucursales
          </h2>
        </div>

        {/* Location tabs (only when there is more than one branch) */}
        {locations.length > 1 && (
          <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
            {locations.map((l, i) => (
              <button
                key={l.id}
                onClick={() => setActive(i)}
                style={{
                  padding: '10px 24px', borderRadius: '4px', border: '2px solid',
                  borderColor: active === i ? '#DC2626' : '#ddd',
                  background: active === i ? '#DC2626' : '#fff',
                  color: active === i ? '#fff' : '#555',
                  fontWeight: 700, fontSize: '15px', cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {l.name}
              </button>
            ))}
          </div>
        )}

        {/* Map + info */}
        <div className="locations-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', alignItems: 'start' }}>
          {/* Map embed */}
          <div style={{ borderRadius: '10px', overflow: 'hidden', height: '380px', border: '2px solid #e5e5e5' }}>
            <iframe
              src={loc.mapSrc}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Mapa ${loc.name}`}
            />
          </div>

          {/* Info card */}
          <div style={{ background: '#fff', borderRadius: '10px', padding: '32px', border: '1px solid #e5e5e5' }}>
            <div style={{ width: '48px', height: '4px', background: '#DC2626', borderRadius: '2px', marginBottom: '20px' }} />
            <h3 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '24px', color: '#1a1a1a', margin: '0 0 24px' }}>
              {loc.name}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ color: '#DC2626', marginTop: '2px', flexShrink: 0 }}><IconMapPin /></div>
                <div>
                  <div style={{ fontSize: '12px', color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>Dirección</div>
                  <div style={{ fontSize: '15px', color: '#1a1a1a', fontWeight: 500 }}>{loc.address}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ color: '#DC2626', marginTop: '2px', flexShrink: 0 }}><IconPhone /></div>
                <div>
                  <div style={{ fontSize: '12px', color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>Teléfono</div>
                  <a href={`tel:${loc.phone}`} style={{ fontSize: '15px', color: '#DC2626', fontWeight: 600, textDecoration: 'none' }}>{loc.phone}</a>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ color: '#DC2626', marginTop: '2px', flexShrink: 0 }}><IconClock /></div>
                <div>
                  <div style={{ fontSize: '12px', color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>Horario</div>
                  <div style={{ fontSize: '14px', color: '#555', lineHeight: 1.5 }}>{loc.hours}</div>
                </div>
              </div>
            </div>

            <a
              href={waLink(`Hola, me gustaría saber más sobre ${loc.name}`)}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center',
                marginTop: '28px', background: '#25D366', color: '#fff',
                padding: '13px', borderRadius: '6px', fontWeight: 700,
                fontSize: '14px', textDecoration: 'none',
              }}
            >
              <IconWhatsApp />
              Escribir a esta sucursal
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function ContactSection() {
  return (
    <section id="contacto" style={{ background: '#DC2626', padding: '72px 24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '42px', color: '#fff', margin: '0 0 16px' }}>
          ¿Necesitas ayuda?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: '18px', margin: '0 0 40px', lineHeight: 1.6 }}>
          Nuestro equipo está listo para asesorarte. Escríbenos por WhatsApp o síguenos en redes sociales para las últimas ofertas.
        </p>

        {/* Channels */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '48px' }}>
          <a
            href={waLink()}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              background: '#fff', color: '#1a1a1a', padding: '16px 32px',
              borderRadius: '6px', fontWeight: 700, fontSize: '16px',
              textDecoration: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            }}
          >
            <span style={{ color: '#25D366' }}><IconWhatsApp /></span>
            {WA_DISPLAY}
          </a>
        </div>

        {/* Social */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          {[
            { icon: <IconInstagram />, label: '@ferre', href: '#' },
            { icon: <IconFacebook />, label: 'Ferre', href: '#' },
            { icon: <IconTikTok />, label: '@ferre', href: '#' },
          ].map((s, i) => (
            <a
              key={i}
              href={s.href}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                color: '#fff', textDecoration: 'none', padding: '16px 24px',
                background: 'rgba(255,255,255,0.12)', borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.2)',
                transition: 'background 0.2s',
                minWidth: '100px',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.22)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
            >
              {s.icon}
              <span style={{ fontSize: '13px', fontWeight: 600 }}>{s.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{ background: '#111', color: '#888', padding: '48px 24px 32px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', marginBottom: '48px' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', background: '#DC2626', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '20px' }}>F</span>
              </div>
              <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '24px', color: '#DC2626' }}>Ferre</span>
            </div>
            <p style={{ fontSize: '14px', lineHeight: 1.7, margin: 0 }}>
              Tu ferretería de confianza desde 2005. Las mejores herramientas y materiales al mejor precio.
            </p>
          </div>

          {/* Links */}
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '14px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Categorías</div>
            {['Herramientas Eléctricas', 'Herramientas de Mano', 'Plomería', 'Electricidad', 'Pintura'].map(c => (
              <a key={c} href="#categorias" style={{ display: 'block', color: '#888', textDecoration: 'none', fontSize: '14px', marginBottom: '8px' }}>
                {c}
              </a>
            ))}
          </div>

          {/* Info */}
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '14px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Información</div>
            {[
              { label: 'Sobre Nosotros', href: '#inicio' },
              { label: 'Catálogo', href: '#catalogo' },
              { label: 'Ofertas', href: '#catalogo' },
              { label: 'Ubicaciones', href: '#ubicaciones' },
              { label: 'Contacto', href: '#contacto' },
            ].map(l => (
              <a key={l.label} href={l.href} style={{ display: 'block', color: '#888', textDecoration: 'none', fontSize: '14px', marginBottom: '8px' }}>
                {l.label}
              </a>
            ))}
          </div>

          {/* Contact */}
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '14px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Contacto</div>
            <div style={{ fontSize: '14px', lineHeight: 2 }}>
              <div>📞 {WA_DISPLAY}</div>
              <div>📧 info@ferrecarupano.com</div>
              <div style={{ marginTop: '12px', display: 'flex', gap: '12px' }}>
                {[<IconInstagram key="ig" />, <IconFacebook key="fb" />, <IconTikTok key="tt" />].map((icon, i) => (
                  <a key={i} href="#" style={{ color: '#888', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#DC2626')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#888')}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #222', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <span style={{ fontSize: '13px' }}>© 2025 Ferre. Todos los derechos reservados.</span>
          <span style={{ fontSize: '13px' }}>Carúpano, Venezuela 🇻🇪</span>
        </div>
      </div>
    </footer>
  )
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <BannerSlider />
      <Categories />
      <Catalog />
      <BrandsCarousel />
      <Locations />
      <ContactSection />
      <Footer />

      {/* Floating WhatsApp */}
      <a
        href={waLink()}
        target="_blank"
        rel="noreferrer"
        className="whatsapp-float"
        title="Escríbenos por WhatsApp"
      >
        <IconWhatsApp />
      </a>
    </div>
  )
}
