import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'

/* ===================== Tema ===================== */
export const PRIMARY = '#DC2626'
export const PRIMARY_DARK = '#b91c1c'

/* ===================== Tipos ===================== */
export interface Slide {
  id: string
  title: string
  subtitle: string
  cta: string
  accent: string
  image: string
}
export interface Category {
  id: string
  name: string
  icon: string
  count: number
  color: string
}
export interface Product {
  id: string
  name: string
  brand: string
  category: string
  price: number
  originalPrice: number | null
  image: string
  badge: string | null
  badgeColor: string | null
  description: string
  features: string[]
  active: boolean
  /* Campos del modo avanzado (inventario) */
  stock?: number
  stockMin?: number
  cost?: number
}
export interface Location {
  id: string
  name: string
  address: string
  phone: string
  hours: string
  mapSrc: string
}
export interface SiteInfo {
  name: string
  tagline: string
  waNumber: string
  waDisplay: string
  email: string
  topBarText: string
  bsRate: number
  aboutText: string
}
export interface User {
  id: string
  name: string
  username: string
  password: string
  role: 'admin'
}

export const CATEGORY_NAMES = [
  'Herramientas Eléctricas', 'Plomería', 'Electricidad',
  'Pintura & Acabados', 'Seguridad Industrial', 'Fijaciones & Tornillería', 'Materiales de Construcción',
]
export const BADGE_COLORS: { label: string; color: string }[] = [
  { label: 'Oferta', color: '#DC2626' },
  { label: 'Nuevo', color: '#1d4ed8' },
  { label: 'Popular', color: '#059669' },
  { label: 'Recomendado', color: '#7c3aed' },
]

/* Modo avanzado: ventas e inventario */
export interface VentaItem { productoId: string; nombre: string; cantidad: number; precio: number; subtotal: number }
export interface Venta {
  id: string; numero: string; ts: number; fecha: string; hora: string; cajero: string; cliente?: string
  items: VentaItem[]; subtotal: number; descuento: number; impuesto: number; total: number
  metodoPago: string; recibido?: number; cambio?: number; estado: string
}
export interface Movimiento {
  id: string; fecha: string; productoId: string; producto: string
  tipo: 'entrada' | 'salida' | 'venta' | 'ajuste'
  cantidad: number; motivo: string; proveedor?: string; usuario: string
  stockAnterior: number; stockNuevo: number; costo?: number
}

export const METODOS_PAGO = ['Efectivo', 'Pago Móvil', 'Punto de venta', 'Transferencia', 'Divisas ($)', 'Zelle']

export const estadoStock = (p: Product): 'agotado' | 'bajo' | 'disponible' => {
  const s = p.stock ?? 0
  const min = p.stockMin ?? 5
  return s <= 0 ? 'agotado' : s <= min ? 'bajo' : 'disponible'
}

/* ===================== Semilla ===================== */
const SEED_SITE: SiteInfo = {
  name: 'Ferre',
  tagline: 'Ferretería',
  waNumber: '584149969965',
  waDisplay: '+58 414-9969965',
  email: 'info@ferrecarupano.com',
  topBarText: '📞 Llámanos: +58 414-9969965  ·  🚚 Entregas a todo el país  ·  ⏰ Lun–Sáb 8am–6pm',
  bsRate: 800,
  aboutText: 'Tu ferretería de confianza desde 2005. Las mejores herramientas y materiales al mejor precio.',
}

const SEED_SLIDES: Slide[] = [
  {
    id: 's1',
    title: 'Ofertas Explosivas',
    subtitle: 'Hasta 40% OFF en herramientas eléctricas seleccionadas.',
    cta: 'Ver Ofertas',
    accent: '#DC2626',
    image: 'https://images.unsplash.com/photo-1759200165738-6366977a73c6?w=1400&h=600&fit=crop&auto=format',
  },
  {
    id: 's2',
    title: 'Temporada de Construcción',
    subtitle: 'Todo lo que necesitas para tu proyecto, en un solo lugar.',
    cta: 'Ver Catálogo',
    accent: '#1a1a1a',
    image: 'https://images.unsplash.com/photo-1519520104014-df63821cb6f9?w=1400&h=600&fit=crop&auto=format',
  },
  {
    id: 's3',
    title: 'Herramientas de Calidad',
    subtitle: 'Las mejores marcas internacionales al mejor precio del mercado.',
    cta: 'Comprar Ahora',
    accent: '#7f1d1d',
    image: 'https://images.unsplash.com/photo-1773325035245-66f793d71d5c?w=1400&h=600&fit=crop&auto=format',
  },
]

const SEED_CATEGORIES: Category[] = [
  { id: 'c1', name: 'Herramientas Eléctricas', icon: '⚡', count: 142, color: '#DC2626' },
  { id: 'c3', name: 'Plomería', icon: '🚿', count: 34, color: '#1d4ed8' },
  { id: 'c4', name: 'Electricidad', icon: '💡', count: 95, color: '#d97706' },
  { id: 'c5', name: 'Pintura & Acabados', icon: '🎨', count: 53, color: '#7c3aed' },
  { id: 'c6', name: 'Seguridad Industrial', icon: '🦺', count: 41, color: '#059669' },
  { id: 'c7', name: 'Fijaciones & Tornillería', icon: '🔩', count: 120, color: '#475569' },
  { id: 'c8', name: 'Materiales de Construcción', icon: '🏗️', count: 78, color: '#92400e' },
]

const SEED_BRANDS: string[] = [
  'DeWalt', 'Stanley', 'Bosch', 'Makita', 'Black+Decker',
  'Milwaukee', 'Truper', '3M', 'Irwin', 'Craftsman', 'Ryobi', 'Hilti',
]

const SEED_PRODUCTS: Product[] = [
  {
    id: 'p1', name: 'Taladro Inalámbrico 20V MAX', brand: 'DeWalt', category: 'Herramientas Eléctricas',
    price: 145, originalPrice: 175, image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=500&h=500&fit=crop&auto=format',
    badge: 'Oferta', badgeColor: '#DC2626',
    description: 'Taladro inalámbrico profesional de 20V con batería de litio de alto rendimiento. Ideal para perforación en madera, metal y mampostería, y para atornillado en cualquier proyecto.',
    features: ['Motor de alta eficiencia', 'Batería 20V MAX litio-ion', 'Portabrocas 1/2" sin llave', '2 velocidades (0–450 / 0–1500 RPM)', 'Incluye maletín y cargador'],
    active: true,
  },
  {
    id: 'p2', name: 'Taladro Percutor 750W GSB', brand: 'Bosch', category: 'Herramientas Eléctricas',
    price: 105, originalPrice: null, image: 'https://images.unsplash.com/photo-1622044939413-0b829c342434?w=500&h=500&fit=crop&auto=format',
    badge: 'Nuevo', badgeColor: '#1d4ed8',
    description: 'Taladro percutor de 750W con función de impacto para concreto y mampostería. Robusto y confiable para los trabajos más exigentes del día a día.',
    features: ['Potencia de 750W', 'Función percutor para concreto', 'Empuñadura auxiliar', 'Tope de profundidad ajustable', 'Velocidad variable y reversible'],
    active: true,
  },
  {
    id: 'p3', name: 'Llave de Tubo Stillson 14"', brand: 'Truper', category: 'Plomería',
    price: 22, originalPrice: 28, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Straight_Pipe_Wrench_3C.jpg/960px-Straight_Pipe_Wrench_3C.jpg',
    badge: 'Oferta', badgeColor: '#DC2626',
    description: 'Llave de tubo (Stillson) de 14" para apretar y aflojar tuberías y conexiones roscadas. Mordazas dentadas con gran agarre para trabajos de plomería.',
    features: ['Longitud de 14"', 'Mordazas dentadas autoajustables', 'Cuerpo de acero forjado', 'Ideal para tubería galvanizada y de hierro', 'Alta resistencia y durabilidad'],
    active: true,
  },
  {
    id: 'p4', name: 'Llave de Paso 1/2" (Válvula de Bola)', brand: 'Genebre', category: 'Plomería',
    price: 5.50, originalPrice: null, image: 'https://upload.wikimedia.org/wikipedia/commons/d/da/Brass-Ball-Valve_MF_Butterfly_12592-360x480_%284999932531%29.jpg',
    badge: 'Nuevo', badgeColor: '#1d4ed8',
    description: 'Válvula de bola (llave de paso) de bronce de 1/2" con manija de cierre rápido. Corta o habilita el flujo de agua de forma segura y confiable.',
    features: ['Cuerpo de bronce', 'Rosca 1/2" macho-hembra', 'Cierre de 1/4 de vuelta', 'Manija tipo mariposa', 'Para agua fría y caliente'],
    active: true,
  },
  {
    id: 'p5', name: 'Sierra Circular 7-1/4" 1800W', brand: 'Makita', category: 'Herramientas Eléctricas',
    price: 215, originalPrice: 240, image: 'https://images.unsplash.com/photo-1689935421853-cb23a0bc92e4?w=500&h=500&fit=crop&auto=format',
    badge: 'Popular', badgeColor: '#059669',
    description: 'Sierra circular de 1800W con disco de 7-1/4", potente y precisa para cortes rápidos y limpios en madera y tableros.',
    features: ['Potencia de 1800W', 'Disco de 7-1/4" (185mm)', 'Profundidad de corte de 66mm', 'Base de aluminio resistente', 'Freno eléctrico de seguridad'],
    active: true,
  },
  {
    id: 'p6', name: 'Llave Ajustable 6" (Inglesa)', brand: 'Irwin', category: 'Plomería',
    price: 9, originalPrice: 12, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Adjustable_spanner.jpg/960px-Adjustable_spanner.jpg',
    badge: 'Oferta', badgeColor: '#DC2626',
    description: 'Llave ajustable (inglesa) de 6" con mordaza de apertura amplia. Herramienta esencial para conexiones de plomería, griferías y tuercas de distintos tamaños.',
    features: ['Longitud de 6" (150mm)', 'Mordaza ajustable de apertura amplia', 'Acero al cromo-vanadio', 'Escala graduada', 'Acabado anticorrosivo'],
    active: true,
  },
  {
    id: 'p7', name: 'Pintura Látex Interior 4L', brand: '3M', category: 'Pintura & Acabados',
    price: 31, originalPrice: 36, image: 'https://images.unsplash.com/photo-1510016290251-68aaad49723e?w=500&h=500&fit=crop&auto=format',
    badge: 'Oferta', badgeColor: '#DC2626',
    description: 'Pintura látex lavable para interiores con acabado mate, excelente cobertura y secado rápido. Bajo olor y fácil de aplicar.',
    features: ['Rendimiento de 4 litros', 'Acabado mate lavable', 'Secado rápido (1 hora)', 'Base agua, bajo olor', 'Cobertura de hasta 40 m²'],
    active: true,
  },
  {
    id: 'p8', name: 'Taladro Atornillador 12V', brand: 'Black+Decker', category: 'Herramientas Eléctricas',
    price: 55, originalPrice: null, image: 'https://images.unsplash.com/photo-1715322554946-1b22a9800aec?w=500&h=500&fit=crop&auto=format',
    badge: null, badgeColor: null,
    description: 'Taladro atornillador inalámbrico de 12V, compacto y ligero. Ideal para tareas del hogar, montaje de muebles y reparaciones rápidas.',
    features: ['Batería de 12V litio-ion', 'Compacto y liviano', 'Control de torque ajustable', 'Portabrocas sin llave', 'Incluye cargador'],
    active: true,
  },
]

const SEED_LOCATIONS: Location[] = [
  {
    id: 'l1',
    name: 'Ferre Carúpano',
    address: 'Carúpano, Estado Sucre, Venezuela',
    phone: '+58 414-9969965',
    hours: 'Lun–Sáb: 8:00am – 6:00pm · Dom: Cerrado',
    mapSrc: 'https://maps.google.com/maps?q=Car%C3%BApano%2C%20Estado%20Sucre%2C%20Venezuela&t=&z=13&ie=UTF8&iwloc=&output=embed',
  },
]

const SEED_USERS: User[] = [
  { id: 'u1', name: 'Administrador', username: 'admin', password: 'ferre123', role: 'admin' },
]

/* Stock inicial para el modo avanzado (inventario) */
const STOCK_BY_ID: Record<string, number> = { p1: 12, p2: 8, p3: 40, p4: 60, p5: 5, p6: 33, p7: 18, p8: 0 }
const SEED_PRODUCTS_FULL: Product[] = SEED_PRODUCTS.map(p => ({
  ...p,
  stock: STOCK_BY_ID[p.id] ?? 20,
  stockMin: 6,
  cost: +(p.price * 0.65).toFixed(2),
}))

/* ===================== Store ===================== */
interface DataCtx {
  site: SiteInfo
  setSite: (patch: Partial<SiteInfo>) => void
  slides: Slide[]
  setSlides: (s: Slide[]) => void
  categories: Category[]
  setCategories: (c: Category[]) => void
  products: Product[]
  addProduct: (p: Omit<Product, 'id'>) => void
  updateProduct: (id: string, patch: Partial<Product>) => void
  deleteProduct: (id: string) => void
  brands: string[]
  setBrands: (b: string[]) => void
  locations: Location[]
  setLocations: (l: Location[]) => void
  /* Avanzado */
  ventas: Venta[]
  movimientos: Movimiento[]
  registrarEntrada: (d: { productoId: string; cantidad: number; costo?: number; proveedor?: string; obs?: string }) => void
  registrarSalida: (d: { productoId: string; cantidad: number; motivo: string }) => void
  registrarVenta: (d: Omit<Venta, 'id' | 'numero' | 'ts' | 'fecha' | 'hora' | 'cajero' | 'estado'>) => Venta
  session: User | null
  login: (username: string, password: string) => boolean
  logout: () => void
  resetAll: () => void
}
const Ctx = createContext<DataCtx | null>(null)
export function useData() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useData debe usarse dentro de DataProvider')
  return c
}

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
const load = <T,>(key: string, fallback: T): T => {
  try {
    const v = localStorage.getItem(key)
    return v ? (JSON.parse(v) as T) : fallback
  } catch {
    return fallback
  }
}

const K = {
  site: 'fh_site', slides: 'fh_slides', cats: 'fh_categories', prods: 'fh_products',
  brands: 'fh_brands', locs: 'fh_locations', users: 'fh_users', session: 'fh_session',
  ventas: 'fh_ventas', movs: 'fh_movimientos',
}

// Al subir esta versión, se recargan los datos por defecto (para reflejar cambios
// del catálogo aunque el navegador ya tuviera datos guardados).
const STORAGE_VERSION = '3'
try {
  if (typeof localStorage !== 'undefined' && localStorage.getItem('fh_ver') !== STORAGE_VERSION) {
    [K.site, K.slides, K.cats, K.prods, K.brands, K.locs, K.ventas, K.movs].forEach(k => localStorage.removeItem(k))
    localStorage.setItem('fh_ver', STORAGE_VERSION)
  }
} catch {
  // ignore
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [site, setSiteState] = useState<SiteInfo>(() => load(K.site, SEED_SITE))
  const [slides, setSlidesState] = useState<Slide[]>(() => load(K.slides, SEED_SLIDES))
  const [categories, setCategoriesState] = useState<Category[]>(() => load(K.cats, SEED_CATEGORIES))
  const [products, setProducts] = useState<Product[]>(() => load(K.prods, SEED_PRODUCTS_FULL))
  const [brands, setBrandsState] = useState<string[]>(() => load(K.brands, SEED_BRANDS))
  const [locations, setLocationsState] = useState<Location[]>(() => load(K.locs, SEED_LOCATIONS))
  const [ventas, setVentas] = useState<Venta[]>(() => load(K.ventas, []))
  const [movimientos, setMovimientos] = useState<Movimiento[]>(() => load(K.movs, []))
  const [users] = useState<User[]>(() => load(K.users, SEED_USERS))
  const [session, setSession] = useState<User | null>(() => load(K.session, null))

  useEffect(() => { localStorage.setItem(K.site, JSON.stringify(site)) }, [site])
  useEffect(() => { localStorage.setItem(K.slides, JSON.stringify(slides)) }, [slides])
  useEffect(() => { localStorage.setItem(K.cats, JSON.stringify(categories)) }, [categories])
  useEffect(() => { localStorage.setItem(K.prods, JSON.stringify(products)) }, [products])
  useEffect(() => { localStorage.setItem(K.brands, JSON.stringify(brands)) }, [brands])
  useEffect(() => { localStorage.setItem(K.locs, JSON.stringify(locations)) }, [locations])
  useEffect(() => { localStorage.setItem(K.ventas, JSON.stringify(ventas)) }, [ventas])
  useEffect(() => { localStorage.setItem(K.movs, JSON.stringify(movimientos)) }, [movimientos])
  useEffect(() => { localStorage.setItem(K.session, JSON.stringify(session)) }, [session])

  const setSite = (patch: Partial<SiteInfo>) => setSiteState(prev => ({ ...prev, ...patch }))
  const addProduct = (p: Omit<Product, 'id'>) => setProducts(prev => [{ ...p, id: uid() }, ...prev])
  const updateProduct = (id: string, patch: Partial<Product>) =>
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...patch } : p)))
  const deleteProduct = (id: string) => setProducts(prev => prev.filter(p => p.id !== id))

  const kardex = (m: Omit<Movimiento, 'id' | 'fecha'>) =>
    setMovimientos(prev => [{ ...m, id: uid(), fecha: new Date().toISOString() }, ...prev])

  const registrarEntrada: DataCtx['registrarEntrada'] = ({ productoId, cantidad, costo, proveedor, obs }) => {
    const p = products.find(x => x.id === productoId); if (!p) return
    const anterior = p.stock ?? 0
    const nuevo = anterior + cantidad
    updateProduct(productoId, { stock: nuevo, ...(costo ? { cost: costo } : {}) })
    kardex({ productoId, producto: p.name, tipo: 'entrada', cantidad, motivo: obs || 'Entrada de mercancía', proveedor, usuario: session?.name || 'admin', stockAnterior: anterior, stockNuevo: nuevo, costo })
  }
  const registrarSalida: DataCtx['registrarSalida'] = ({ productoId, cantidad, motivo }) => {
    const p = products.find(x => x.id === productoId); if (!p) return
    const anterior = p.stock ?? 0
    const nuevo = Math.max(0, anterior - cantidad)
    updateProduct(productoId, { stock: nuevo })
    kardex({ productoId, producto: p.name, tipo: 'salida', cantidad, motivo, usuario: session?.name || 'admin', stockAnterior: anterior, stockNuevo: nuevo })
  }
  const registrarVenta: DataCtx['registrarVenta'] = (d) => {
    const numero = `F-${String(ventas.length + 1).padStart(5, '0')}`
    const now = new Date()
    const venta: Venta = {
      ...d, id: uid(), numero, ts: now.getTime(),
      fecha: now.toLocaleDateString('es-VE'), hora: now.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' }),
      cajero: session?.name || 'admin', estado: 'Completada',
    }
    setVentas(prev => [venta, ...prev])
    d.items.forEach(it => {
      const p = products.find(x => x.id === it.productoId); if (!p) return
      const anterior = p.stock ?? 0
      const nuevo = Math.max(0, anterior - it.cantidad)
      updateProduct(it.productoId, { stock: nuevo })
      kardex({ productoId: it.productoId, producto: it.nombre, tipo: 'venta', cantidad: it.cantidad, motivo: `Venta ${numero}`, usuario: session?.name || 'admin', stockAnterior: anterior, stockNuevo: nuevo })
    })
    return venta
  }

  const login = useCallback((username: string, password: string) => {
    // Demo visual: el acceso es solo una muestra, no requiere credenciales válidas.
    // Entra siempre; si coincide con un usuario usa ese, si no, entra como admin.
    const u = users.find(
      x => x.username.toLowerCase() === username.trim().toLowerCase() && x.password === password,
    )
    setSession(u ?? users[0])
    return true
  }, [users])
  const logout = useCallback(() => setSession(null), [])

  const resetAll = () => {
    [K.site, K.slides, K.cats, K.prods, K.brands, K.locs, K.ventas, K.movs].forEach(k => localStorage.removeItem(k))
    setSiteState(SEED_SITE); setSlidesState(SEED_SLIDES); setCategoriesState(SEED_CATEGORIES)
    setProducts(SEED_PRODUCTS_FULL); setBrandsState(SEED_BRANDS); setLocationsState(SEED_LOCATIONS)
    setVentas([]); setMovimientos([])
  }

  return (
    <Ctx.Provider
      value={{
        site, setSite,
        slides, setSlides: setSlidesState,
        categories, setCategories: setCategoriesState,
        products, addProduct, updateProduct, deleteProduct,
        brands, setBrands: setBrandsState,
        locations, setLocations: setLocationsState,
        ventas, movimientos, registrarEntrada, registrarSalida, registrarVenta,
        session, login, logout, resetAll,
      }}
    >
      {children}
    </Ctx.Provider>
  )
}
