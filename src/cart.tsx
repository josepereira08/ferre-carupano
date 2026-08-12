import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useData } from './store'

// ── WhatsApp icon ────────────────────────────────────────────
function WA({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413A11.815 11.815 0 0012.05 0" />
    </svg>
  )
}

const fmtUsd = (n: number) => 'US$ ' + n.toLocaleString('en-US')
const fmtBs = (n: number, rate: number) => 'BS ' + Math.round(n * rate).toLocaleString('es-VE')

// ── Types & context ──────────────────────────────────────────
export interface CartInput {
  id: string
  nombre: string
  precio: number
  img: string
  categoria?: string
}
export interface CartItem extends CartInput {
  cantidad: string
}

interface CartCtx {
  items: CartItem[]
  add: (p: CartInput) => void
  remove: (id: string) => void
  setCantidad: (id: string, c: string) => void
  clear: () => void
  open: boolean
  setOpen: (o: boolean) => void
  count: number
  has: (id: string) => boolean
}

const Ctx = createContext<CartCtx | null>(null)

export function useCart() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useCart must be used within CartProvider')
  return c
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('fh_cart') || '[]')
    } catch {
      return []
    }
  })
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem('fh_cart', JSON.stringify(items))
    } catch {
      // ignore
    }
  }, [items])

  const add = (p: CartInput) =>
    setItems(prev => (prev.some(i => i.id === p.id) ? prev : [...prev, { ...p, cantidad: '1' }]))
  const remove = (id: string) => setItems(prev => prev.filter(i => i.id !== id))
  const setCantidad = (id: string, c: string) => setItems(prev => prev.map(i => (i.id === id ? { ...i, cantidad: c } : i)))
  const clear = () => setItems([])
  const has = (id: string) => items.some(i => i.id === id)

  return (
    <Ctx.Provider value={{ items, add, remove, setCantidad, clear, open, setOpen, count: items.length, has }}>
      {children}
    </Ctx.Provider>
  )
}

// ── Cart row ─────────────────────────────────────────────────
const PRESETS = ['1', '2', '3', '4', '5']

function CartRow({ item }: { item: CartItem }) {
  const { setCantidad, remove } = useCart()
  const { site } = useData()
  const isCustom = !PRESETS.includes(item.cantidad)
  const [custom, setCustom] = useState(isCustom)

  return (
    <div className="flex gap-3 border-b border-slate-100 py-4">
      <img src={item.img} alt={item.nombre} className="h-16 w-16 flex-shrink-0 rounded-xl object-cover bg-slate-50 border border-slate-100" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 leading-tight">{item.nombre}</p>
            <p className="text-xs font-semibold mt-0.5" style={{ color: '#DC2626' }}>{fmtUsd(item.precio)} · {fmtBs(item.precio, site.bsRate)}</p>
          </div>
          <button onClick={() => remove(item.id)} className="text-slate-300 hover:text-red-500 transition-colors shrink-0" aria-label="Quitar">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4h8v2m-9 0v14a1 1 0 001 1h8a1 1 0 001-1V6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-slate-400 mr-0.5">Cant.:</span>
          {PRESETS.map(pz => {
            const activo = !custom && item.cantidad === pz
            return (
              <button
                key={pz}
                onClick={() => { setCustom(false); setCantidad(item.id, pz) }}
                className="h-7 w-7 rounded-full border text-xs font-semibold transition-all"
                style={activo
                  ? { background: '#DC2626', color: '#fff', borderColor: '#DC2626' }
                  : { background: '#fff', color: '#64748b', borderColor: '#e2e8f0' }}
              >
                {pz}
              </button>
            )
          })}
          <button
            onClick={() => setCustom(true)}
            className="h-7 rounded-full border px-2.5 text-xs font-semibold transition-all"
            style={custom
              ? { background: '#DC2626', color: '#fff', borderColor: '#DC2626' }
              : { background: '#fff', color: '#64748b', borderColor: '#e2e8f0' }}
          >
            Otro
          </button>
        </div>
        {custom && (
          <input
            autoFocus
            value={isCustom ? item.cantidad : ''}
            onChange={e => setCantidad(item.id, e.target.value)}
            placeholder="Ej: 3 unidades, 2 cajas, 5 metros…"
            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
            style={{ outlineColor: '#DC2626' }}
          />
        )}
      </div>
    </div>
  )
}

// ── Cart drawer ──────────────────────────────────────────────
export function CartDrawer() {
  const { items, open, setOpen, clear } = useCart()
  const { site } = useData()

  const enviar = () => {
    const lines = items.map(i => `• ${i.nombre} — Cantidad: ${i.cantidad || '1'}`).join('\n')
    const msg =
      `¡Hola ${site.name}! 🛠️ Quiero consultar la disponibilidad de estos productos:\n\n` +
      `${lines}\n\n` +
      `¿Me confirman disponibilidad y el precio total (en $ o Bs)? ¡Gracias!`
    window.open(`https://wa.me/${site.waNumber}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-[80] bg-slate-900/50 transition-opacity duration-300 ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={() => setOpen(false)}
      />
      <aside
        className={`fixed right-0 top-0 z-[90] flex h-full w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
        aria-hidden={!open}
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: "'Roboto Slab', serif" }}>Mi pedido</h3>
            <p className="text-xs text-slate-400">Consulta la disponibilidad de varios productos a la vez</p>
          </div>
          <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-700 text-2xl leading-none" aria-label="Cerrar">×</button>
        </div>

        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-16 text-center">
              <div className="text-5xl mb-4">🛒</div>
              <p className="text-slate-500 text-sm">Aún no has agregado productos.</p>
              <p className="text-slate-400 text-xs mt-1">
                Usa el botón <span className="font-bold" style={{ color: '#DC2626' }}>Agregar</span> en el catálogo.
              </p>
            </div>
          ) : (
            items.map(i => <CartRow key={i.id} item={i} />)
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-slate-100 p-5 space-y-3">
            <p className="text-xs text-slate-400 text-center">
              Indica la cantidad de cada producto. La disponibilidad y el total se confirman por WhatsApp.
            </p>
            <button
              onClick={enviar}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-500 py-3.5 font-bold text-white transition-all hover:bg-green-600 shadow-lg shadow-green-200"
            >
              <WA className="h-5 w-5" />
              Consultar disponibilidad
            </button>
            <button onClick={clear} className="w-full text-center text-xs text-slate-400 hover:text-slate-600 transition-colors">Vaciar lista</button>
          </div>
        )}
      </aside>
    </>
  )
}

// ── Floating cart button ─────────────────────────────────────
export function CartFab() {
  const { count, setOpen } = useCart()
  if (count === 0) return null
  return (
    <button
      onClick={() => setOpen(true)}
      className="fixed bottom-6 left-5 z-40 flex items-center gap-2 rounded-full px-4 py-3 text-white shadow-xl transition-all hover:scale-105"
      style={{ background: '#DC2626' }}
      aria-label="Ver mi pedido"
    >
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      <span className="text-sm font-bold">Mi pedido</span>
      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1.5 text-xs font-black" style={{ color: '#DC2626' }}>{count}</span>
    </button>
  )
}
