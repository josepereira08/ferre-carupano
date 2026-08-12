import { useState, useEffect } from 'react'
import { DataProvider, useData, PRIMARY, PRIMARY_DARK } from './store'
import { CartProvider, useCart, CartDrawer, CartFab } from './cart'
import type { Product } from './store'
import { Login } from './admin/Login'
import { Admin } from './admin/Admin'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = (n: number) => 'US$ ' + n.toLocaleString('en-US')
const fmtBs = (n: number, rate: number) => 'BS ' + Math.round(n * rate).toLocaleString('es-VE')
const waLink = (num: string, text?: string) =>
  `https://wa.me/${num}` + (text ? `?text=${encodeURIComponent(text)}` : '')

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
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.69a8.19 8.19 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.02-.07z" />
    </svg>
  )
}
function IconWhatsApp() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
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

// ─── Public components ───────────────────────────────────────────────────────

const navLinks = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Categorías', href: '#categorias' },
  { label: 'Catálogo', href: '#catalogo' },
  { label: 'Marcas', href: '#marcas' },
  { label: 'Ubicaciones', href: '#ubicaciones' },
  { label: 'Contacto', href: '#contacto' },
]

function Navbar({ onLogin }: { onLogin: () => void }) {
  const { site } = useData()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header style={{ background: '#fff', borderBottom: `2px solid ${PRIMARY}`, position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ background: PRIMARY, color: '#fff', fontSize: '13px', padding: '6px 12px', textAlign: 'center' }}>
        {site.topBarText}
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
        <a href="#inicio" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '44px', height: '44px', background: PRIMARY, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '22px', letterSpacing: '-1px' }}>F</span>
          </div>
          <div style={{ lineHeight: 1 }}>
            <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '24px', color: PRIMARY, letterSpacing: '-0.5px', display: 'block' }}>{site.name}</span>
            <span style={{ fontSize: '11px', color: '#888', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase' }}>{site.tagline}</span>
          </div>
        </a>

        <nav style={{ display: 'flex', gap: '30px', alignItems: 'center' }} className="hidden-mobile">
          {navLinks.map(link => (
            <a key={link.label} href={link.href} className="nav-link" style={{ color: '#1a1a1a', fontSize: '15px', fontWeight: 500, textDecoration: 'none' }}>
              {link.label}
            </a>
          ))}
        </nav>

        <button onClick={onLogin} className="hidden-mobile"
          style={{ background: PRIMARY, color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          onMouseEnter={e => (e.currentTarget.style.background = PRIMARY_DARK)}
          onMouseLeave={e => (e.currentTarget.style.background = PRIMARY)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
          Iniciar sesión
        </button>

        <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'none' }} className="show-mobile">
          <div style={{ width: '24px', height: '2px', background: '#1a1a1a', marginBottom: '5px' }} />
          <div style={{ width: '24px', height: '2px', background: '#1a1a1a', marginBottom: '5px' }} />
          <div style={{ width: '24px', height: '2px', background: '#1a1a1a' }} />
        </button>
      </div>

      {menuOpen && (
        <nav className="show-mobile" style={{ flexDirection: 'column', background: '#fff', borderTop: '1px solid #eee', padding: '8px 0 12px' }}>
          {navLinks.map(link => (
            <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)}
              style={{ display: 'block', color: '#1a1a1a', fontSize: '16px', fontWeight: 600, textDecoration: 'none', padding: '13px 24px', borderBottom: '1px solid #f2f2f2' }}>
              {link.label}
            </a>
          ))}
          <button onClick={() => { setMenuOpen(false); onLogin() }}
            style={{ margin: '12px 24px 0', background: PRIMARY, color: '#fff', padding: '13px', border: 'none', borderRadius: '6px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
            Iniciar sesión
          </button>
        </nav>
      )}
    </header>
  )
}

function BannerSlider() {
  const { slides, site } = useData()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) return
    const t = setInterval(() => setCurrent(p => (p + 1) % slides.length), 4500)
    return () => clearInterval(t)
  }, [slides.length])

  useEffect(() => { if (current >= slides.length) setCurrent(0) }, [slides.length, current])

  if (slides.length === 0) return <section id="inicio" />
  const slide = slides[Math.min(current, slides.length - 1)]

  return (
    <section id="inicio" style={{ position: 'relative', height: '520px', overflow: 'hidden', background: '#1a1a1a' }}>
      {slide.image && (
        <img key={slide.id} src={slide.image} alt={slide.title} className="slide-in"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }} />
      )}
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to right, ${slide.accent}ee 0%, ${slide.accent}88 50%, transparent 100%)` }} />

      <div className="banner-content" style={{ position: 'relative', zIndex: 2, maxWidth: '1200px', margin: '0 auto', padding: '0 48px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div key={current} className="slide-in">
          <div style={{ display: 'inline-block', background: '#fff', color: PRIMARY, fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', padding: '4px 12px', borderRadius: '2px', marginBottom: '16px' }}>
            {site.name} · {site.tagline}
          </div>
          <h1 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: 'clamp(36px, 5vw, 64px)', color: '#fff', margin: '0 0 16px', lineHeight: 1.1, maxWidth: '600px' }}>
            {slide.title}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: '18px', margin: '0 0 32px', maxWidth: '480px' }}>{slide.subtitle}</p>
          <a href="#catalogo" style={{ display: 'inline-block', background: '#fff', color: PRIMARY, padding: '14px 32px', borderRadius: '4px', fontWeight: 700, fontSize: '16px', textDecoration: 'none', letterSpacing: '0.3px' }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')} onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
            {slide.cta} →
          </a>
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px', zIndex: 3 }}>
            {slides.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} style={{ width: i === current ? '28px' : '8px', height: '8px', borderRadius: '4px', border: 'none', cursor: 'pointer', background: i === current ? '#fff' : 'rgba(255,255,255,0.45)', transition: 'all 0.3s ease', padding: 0 }} />
            ))}
          </div>
          <button onClick={() => setCurrent(p => (p - 1 + slides.length) % slides.length)} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '50%', width: '44px', height: '44px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', zIndex: 3 }}>
            <IconChevronLeft />
          </button>
          <button onClick={() => setCurrent(p => (p + 1) % slides.length)} style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '50%', width: '44px', height: '44px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', zIndex: 3 }}>
            <IconChevronRight />
          </button>
        </>
      )}
    </section>
  )
}

function Categories() {
  const { categories } = useData()
  return (
    <section id="categorias" style={{ background: '#f5f5f5', padding: '72px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '48px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ color: PRIMARY, fontSize: '13px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>Nuestras Categorías</div>
            <h2 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '38px', margin: 0, color: '#1a1a1a' }}>Encuentra lo que<br />necesitas</h2>
          </div>
          <a href="#catalogo" style={{ color: PRIMARY, fontWeight: 600, textDecoration: 'none', fontSize: '15px' }}>Ver todo el catálogo →</a>
        </div>

        <div className="categories-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
          {categories.map(cat => (
            <a key={cat.id} href="#catalogo" style={{ background: '#fff', borderRadius: '8px', padding: '24px 20px', cursor: 'pointer', border: '1px solid #e5e5e5', textDecoration: 'none', display: 'block' }} className="product-card category-card">
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>{cat.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '15px', color: '#1a1a1a', marginBottom: '4px' }}>{cat.name}</div>
              <div style={{ fontSize: '13px', color: '#888' }}>{cat.count} productos</div>
              <div style={{ width: '32px', height: '3px', background: cat.color, borderRadius: '2px', marginTop: '16px' }} />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const { site } = useData()
  const cart = useCart()
  const inCart = cart.has(product.id)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div onClick={e => e.stopPropagation()} className="modal-card fade-up" style={{ background: '#fff', borderRadius: '14px', overflow: 'hidden', maxWidth: '860px', width: '100%', maxHeight: '90vh', overflowY: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.35)' }}>
        <button onClick={onClose} aria-label="Cerrar" style={{ position: 'absolute', top: '14px', right: '14px', zIndex: 3, width: '36px', height: '36px', borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>×</button>

        <div className="modal-img" style={{ position: 'relative', background: '#f5f5f5', minHeight: '280px' }}>
          <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'multiply' }} />
          {product.badge && (
            <span style={{ position: 'absolute', top: '16px', left: '16px', background: product.badgeColor ?? PRIMARY, color: '#fff', fontSize: '12px', fontWeight: 700, padding: '4px 12px', borderRadius: '3px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{product.badge}</span>
          )}
        </div>

        <div style={{ padding: '28px 28px 32px' }}>
          <div style={{ fontSize: '12px', color: PRIMARY, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>{product.brand}</div>
          <h3 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '24px', color: '#1a1a1a', margin: '0 0 6px', lineHeight: 1.2 }}>{product.name}</h3>
          <div style={{ fontSize: '13px', color: '#888', marginBottom: '14px' }}>{product.category}</div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '30px', color: PRIMARY }}>{fmt(product.price)}</span>
            {product.originalPrice && <span style={{ fontSize: '16px', color: '#aaa', textDecoration: 'line-through' }}>{fmt(product.originalPrice)}</span>}
          </div>
          <div style={{ fontSize: '15px', color: '#555', fontWeight: 600, marginTop: '2px' }}>{fmtBs(product.price, site.bsRate)}</div>
          {product.originalPrice && <div style={{ fontSize: '13px', color: '#059669', fontWeight: 600, marginTop: '4px' }}>Ahorras {fmt(product.originalPrice - product.price)}</div>}

          <p style={{ fontSize: '14px', color: '#444', lineHeight: 1.65, margin: '20px 0 16px' }}>{product.description}</p>

          {product.features.length > 0 && (
            <>
              <div style={{ fontSize: '12px', color: '#888', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>Características</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {product.features.map(f => (
                  <li key={f} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '14px', color: '#333' }}>
                    <span style={{ color: PRIMARY, fontWeight: 800, flexShrink: 0 }}>✓</span>{f}
                  </li>
                ))}
              </ul>
            </>
          )}

          <button
            onClick={() => {
              cart.add({ id: product.id, nombre: product.name, precio: product.price, img: product.image, categoria: product.category })
              onClose()
              cart.setOpen(true)
            }}
            style={inCart
              ? { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', padding: '14px', borderRadius: '8px', fontWeight: 700, fontSize: '15px', cursor: 'pointer', marginBottom: '10px' }
              : { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: PRIMARY, color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 700, fontSize: '15px', cursor: 'pointer', marginBottom: '10px' }}>
            {inCart ? '✓ En tu pedido — ver lista' : '＋ Agregar a mi pedido'}
          </button>
          <a href={waLink(site.waNumber, `Hola, quiero consultar sobre este producto:\n\n• ${product.name} (${product.brand})\n• Precio: ${fmt(product.price)} / ${fmtBs(product.price, site.bsRate)}\n\n¿Está disponible?`)} target="_blank" rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: '#25D366', color: '#fff', padding: '14px', borderRadius: '8px', fontWeight: 700, fontSize: '15px', textDecoration: 'none' }}>
            <IconWhatsApp />
            Consultar solo este por WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}

function Catalog() {
  const { products, site } = useData()
  const cart = useCart()
  const [filter, setFilter] = useState('Todos')
  const [selected, setSelected] = useState<Product | null>(null)

  const visible = products.filter(p => p.active)
  const cats = ['Todos', ...Array.from(new Set(visible.map(p => p.category)))]
  const filtered = filter === 'Todos' ? visible : visible.filter(p => p.category === filter)

  return (
    <section id="catalogo" style={{ background: '#fff', padding: '72px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
          <div>
            <div style={{ color: PRIMARY, fontSize: '13px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>Catálogo de Productos</div>
            <h2 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '38px', margin: 0, color: '#1a1a1a' }}>Precios que no<br />encontrarás en otro lugar</h2>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {cats.map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: '8px 18px', borderRadius: '24px', border: '2px solid', borderColor: filter === f ? PRIMARY : '#e5e5e5', background: filter === f ? PRIMARY : '#fff', color: filter === f ? '#fff' : '#555', fontWeight: 600, fontSize: '14px', cursor: 'pointer', transition: 'all 0.15s' }}>{f}</button>
            ))}
          </div>
        </div>

        <div className="catalog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
          {filtered.map(product => (
            <div key={product.id} className="product-card" onClick={() => setSelected(product)} style={{ background: '#fff', borderRadius: '10px', border: '1px solid #ebebeb', overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
              <div className="product-img" style={{ position: 'relative', background: '#f9f9f9', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'multiply' }} />
                {product.badge && (
                  <span style={{ position: 'absolute', top: '12px', left: '12px', background: product.badgeColor ?? PRIMARY, color: '#fff', fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '3px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{product.badge}</span>
                )}
              </div>
              <div className="product-info" style={{ padding: '16px 18px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ fontSize: '11px', color: PRIMARY, fontWeight: 700, letterSpacing: '0.5px', marginBottom: '4px' }}>{product.brand}</div>
                <div className="product-name" style={{ fontWeight: 600, fontSize: '15px', color: '#1a1a1a', marginBottom: '12px', lineHeight: 1.35 }}>{product.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
                  <span className="product-price" style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '22px', color: PRIMARY }}>{fmt(product.price)}</span>
                  {product.originalPrice && <span style={{ fontSize: '14px', color: '#aaa', textDecoration: 'line-through' }}>{fmt(product.originalPrice)}</span>}
                </div>
                <div style={{ fontSize: '13px', color: '#555', fontWeight: 600, marginTop: '2px' }}>{fmtBs(product.price, site.bsRate)}</div>
                {product.originalPrice && <div style={{ fontSize: '12px', color: '#059669', fontWeight: 600, marginTop: '4px' }}>Ahorras {fmt(product.originalPrice - product.price)}</div>}
                <button onClick={(e) => { e.stopPropagation(); setSelected(product) }}
                  style={{ background: 'none', border: 'none', padding: '2px 0', marginTop: '4px', color: '#888', fontSize: '12px', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}>
                  Ver detalles ›
                </button>
                <div style={{ flex: 1, minHeight: '8px' }} />
                {cart.has(product.id) ? (
                  <button className="product-btn" onClick={(e) => { e.stopPropagation(); cart.setOpen(true) }}
                    style={{ width: '100%', padding: '11px', background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', borderRadius: '6px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
                    ✓ Agregado
                  </button>
                ) : (
                  <button className="product-btn" onClick={(e) => { e.stopPropagation(); cart.add({ id: product.id, nombre: product.name, precio: product.price, img: product.image, categoria: product.category }) }}
                    style={{ width: '100%', padding: '11px', background: PRIMARY, color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', transition: 'background 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    onMouseEnter={e => (e.currentTarget.style.background = PRIMARY_DARK)} onMouseLeave={e => (e.currentTarget.style.background = PRIMARY)}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                    Agregar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
      </div>
    </section>
  )
}

function BrandsCarousel() {
  const { brands } = useData()
  const doubled = [...brands, ...brands]
  return (
    <section id="marcas" style={{ background: '#1a1a1a', padding: '56px 0', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', marginBottom: '32px', textAlign: 'center' }}>
        <div style={{ color: PRIMARY, fontSize: '13px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>Nuestras Marcas</div>
        <h2 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '32px', color: '#fff', margin: 0 }}>Trabajamos con los mejores</h2>
      </div>
      <div style={{ overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '120px', zIndex: 2, background: 'linear-gradient(to right, #1a1a1a, transparent)' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '120px', zIndex: 2, background: 'linear-gradient(to left, #1a1a1a, transparent)' }} />
        <div className="animate-marquee" style={{ gap: '0' }}>
          {doubled.map((brand, i) => (
            <div key={i} style={{ flexShrink: 0, padding: '0 40px', borderRight: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '72px' }}>
              <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 700, fontSize: '20px', color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap', letterSpacing: '-0.3px' }}>{brand}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Locations() {
  const { locations, site } = useData()
  const [active, setActive] = useState(0)
  if (locations.length === 0) return null
  const loc = locations[Math.min(active, locations.length - 1)]

  return (
    <section id="ubicaciones" style={{ background: '#f5f5f5', padding: '72px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '48px' }}>
          <div style={{ color: PRIMARY, fontSize: '13px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>Dónde Encontrarnos</div>
          <h2 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '38px', margin: '0 0 8px', color: '#1a1a1a' }}>Nuestras Sucursales</h2>
        </div>

        {locations.length > 1 && (
          <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
            {locations.map((l, i) => (
              <button key={l.id} onClick={() => setActive(i)} style={{ padding: '10px 24px', borderRadius: '4px', border: '2px solid', borderColor: active === i ? PRIMARY : '#ddd', background: active === i ? PRIMARY : '#fff', color: active === i ? '#fff' : '#555', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}>{l.name}</button>
            ))}
          </div>
        )}

        <div className="locations-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', alignItems: 'start' }}>
          <div style={{ borderRadius: '10px', overflow: 'hidden', height: '380px', border: '2px solid #e5e5e5', background: '#e5e5e5' }}>
            {loc.mapSrc && <iframe src={loc.mapSrc} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title={`Mapa ${loc.name}`} />}
          </div>

          <div style={{ background: '#fff', borderRadius: '10px', padding: '32px', border: '1px solid #e5e5e5' }}>
            <div style={{ width: '48px', height: '4px', background: PRIMARY, borderRadius: '2px', marginBottom: '20px' }} />
            <h3 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '24px', color: '#1a1a1a', margin: '0 0 24px' }}>{loc.name}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ color: PRIMARY, marginTop: '2px', flexShrink: 0 }}><IconMapPin /></div>
                <div>
                  <div style={{ fontSize: '12px', color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>Dirección</div>
                  <div style={{ fontSize: '15px', color: '#1a1a1a', fontWeight: 500 }}>{loc.address}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ color: PRIMARY, marginTop: '2px', flexShrink: 0 }}><IconPhone /></div>
                <div>
                  <div style={{ fontSize: '12px', color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>Teléfono</div>
                  <a href={`tel:${loc.phone}`} style={{ fontSize: '15px', color: PRIMARY, fontWeight: 600, textDecoration: 'none' }}>{loc.phone}</a>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ color: PRIMARY, marginTop: '2px', flexShrink: 0 }}><IconClock /></div>
                <div>
                  <div style={{ fontSize: '12px', color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>Horario</div>
                  <div style={{ fontSize: '14px', color: '#555', lineHeight: 1.5 }}>{loc.hours}</div>
                </div>
              </div>
            </div>
            <a href={waLink(site.waNumber, `Hola, me gustaría saber más sobre ${loc.name}`)} target="_blank" rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', marginTop: '28px', background: '#25D366', color: '#fff', padding: '13px', borderRadius: '6px', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}>
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
  const { site } = useData()
  return (
    <section id="contacto" style={{ background: PRIMARY, padding: '72px 24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '42px', color: '#fff', margin: '0 0 16px' }}>¿Necesitas ayuda?</h2>
        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '18px', margin: '0 0 40px', lineHeight: 1.6 }}>
          Nuestro equipo está listo para asesorarte. Escríbenos por WhatsApp o síguenos en redes sociales para las últimas ofertas.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '48px' }}>
          <a href={waLink(site.waNumber)} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#fff', color: '#1a1a1a', padding: '16px 32px', borderRadius: '6px', fontWeight: 700, fontSize: '16px', textDecoration: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
            <span style={{ color: '#25D366' }}><IconWhatsApp /></span>{site.waDisplay}
          </a>
        </div>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          {[{ icon: <IconInstagram />, label: `@${site.name.toLowerCase()}` }, { icon: <IconFacebook />, label: site.name }, { icon: <IconTikTok />, label: `@${site.name.toLowerCase()}` }].map((s, i) => (
            <a key={i} href="#" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', color: '#fff', textDecoration: 'none', padding: '16px 24px', background: 'rgba(255,255,255,0.14)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.25)', minWidth: '100px' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.24)')} onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.14)')}>
              {s.icon}<span style={{ fontSize: '13px', fontWeight: 600 }}>{s.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer({ onLogin }: { onLogin: () => void }) {
  const { site, categories } = useData()
  return (
    <footer style={{ background: '#111', color: '#888', padding: '48px 24px 32px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', marginBottom: '48px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', background: PRIMARY, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '20px' }}>F</span>
              </div>
              <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '24px', color: PRIMARY }}>{site.name}</span>
            </div>
            <p style={{ fontSize: '14px', lineHeight: 1.7, margin: 0 }}>{site.aboutText}</p>
          </div>

          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '14px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Categorías</div>
            {categories.slice(0, 5).map(c => (
              <a key={c.id} href="#categorias" style={{ display: 'block', color: '#888', textDecoration: 'none', fontSize: '14px', marginBottom: '8px' }}>{c.name}</a>
            ))}
          </div>

          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '14px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Información</div>
            {[{ label: 'Catálogo', href: '#catalogo' }, { label: 'Marcas', href: '#marcas' }, { label: 'Ubicaciones', href: '#ubicaciones' }, { label: 'Contacto', href: '#contacto' }].map(l => (
              <a key={l.label} href={l.href} style={{ display: 'block', color: '#888', textDecoration: 'none', fontSize: '14px', marginBottom: '8px' }}>{l.label}</a>
            ))}
            <button onClick={onLogin} style={{ background: 'none', border: 'none', color: '#888', fontSize: '14px', padding: 0, marginTop: '2px', cursor: 'pointer', textAlign: 'left' }}>Panel administrativo</button>
          </div>

          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '14px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Contacto</div>
            <div style={{ fontSize: '14px', lineHeight: 2 }}>
              <div>📞 {site.waDisplay}</div>
              <div>📧 {site.email}</div>
              <div style={{ marginTop: '12px', display: 'flex', gap: '12px' }}>
                {[<IconInstagram key="ig" />, <IconFacebook key="fb" />, <IconTikTok key="tt" />].map((icon, i) => (
                  <a key={i} href="#" style={{ color: '#888' }} onMouseEnter={e => (e.currentTarget.style.color = PRIMARY)} onMouseLeave={e => (e.currentTarget.style.color = '#888')}>{icon}</a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #222', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <span style={{ fontSize: '13px' }}>© 2025 {site.name}. Todos los derechos reservados.</span>
          <span style={{ fontSize: '13px' }}>Carúpano, Venezuela 🇻🇪</span>
        </div>
      </div>
    </footer>
  )
}

function PublicSite({ onLogin }: { onLogin: () => void }) {
  const { site } = useData()
  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar onLogin={onLogin} />
      <BannerSlider />
      <Categories />
      <Catalog />
      <BrandsCarousel />
      <Locations />
      <ContactSection />
      <Footer onLogin={onLogin} />
      <CartDrawer />
      <CartFab />
      <a href={waLink(site.waNumber)} target="_blank" rel="noreferrer" className="whatsapp-float" title="Escríbenos por WhatsApp">
        <span style={{ display: 'flex', color: '#fff', transform: 'scale(1.4)' }}><IconWhatsApp /></span>
      </a>
    </div>
  )
}

// ─── Router / Root ───────────────────────────────────────────────────────────

function Root() {
  const { session } = useData()
  const [hash, setHash] = useState(() => window.location.hash)

  useEffect(() => {
    const on = () => setHash(window.location.hash)
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])

  const isAdmin = hash.replace(/^#\/?/, '').toLowerCase().startsWith('admin')
  const goAdmin = () => { window.location.hash = 'admin'; window.scrollTo(0, 0) }
  const goSite = () => { window.location.hash = ''; window.scrollTo(0, 0) }

  if (isAdmin) {
    return session ? <Admin onExit={goSite} /> : <Login onExit={goSite} />
  }
  return <PublicSite onLogin={goAdmin} />
}

export default function App() {
  return (
    <DataProvider>
      <CartProvider>
        <Root />
      </CartProvider>
    </DataProvider>
  )
}
