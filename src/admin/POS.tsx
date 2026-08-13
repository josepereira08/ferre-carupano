import { useState, useMemo } from 'react'
import { useData, METODOS_PAGO, estadoStock, PRIMARY } from '../store'
import type { Product, Venta } from '../store'
import { Btn, Input, Select, money, AdminModal, INNER } from './ui'

const FONT = "'Roboto Slab', serif"
interface Linea { producto: Product; cantidad: number }

function Comprobante({ venta, onClose }: { venta: Venta; onClose: () => void }) {
  const { site } = useData()
  const imprimir = () => {
    const w = window.open('', '_blank', 'width=380,height=640')
    if (!w) return
    const filas = venta.items.map(i => `<tr><td>${i.cantidad} × ${i.nombre}</td><td style="text-align:right">$${i.subtotal.toFixed(2)}</td></tr>`).join('')
    w.document.write(`<html><head><title>${venta.numero}</title><style>body{font-family:monospace;padding:16px;color:#000}h2{text-align:center;margin:4px 0}table{width:100%;border-collapse:collapse;font-size:13px}td{padding:2px 0}hr{border:none;border-top:1px dashed #000;margin:8px 0}.tot{font-weight:bold;font-size:15px}</style></head><body>
      <h2>${site.name.toUpperCase()} · ${site.tagline}</h2><p style="text-align:center;margin:0;font-size:12px">${site.waDisplay}</p><hr/>
      <p style="font-size:12px;margin:2px 0">Factura: ${venta.numero}<br/>Fecha: ${venta.fecha} ${venta.hora}<br/>Atendió: ${venta.cajero}${venta.cliente ? '<br/>Cliente: ' + venta.cliente : ''}</p><hr/>
      <table>${filas}</table><hr/>
      <table><tr><td>Subtotal</td><td style="text-align:right">$${venta.subtotal.toFixed(2)}</td></tr>
      ${venta.descuento ? `<tr><td>Descuento</td><td style="text-align:right">-$${venta.descuento.toFixed(2)}</td></tr>` : ''}
      ${venta.impuesto ? `<tr><td>Impuesto</td><td style="text-align:right">$${venta.impuesto.toFixed(2)}</td></tr>` : ''}
      <tr class="tot"><td>TOTAL</td><td style="text-align:right">$${venta.total.toFixed(2)}</td></tr></table><hr/>
      <p style="font-size:12px;margin:2px 0">Pago: ${venta.metodoPago}${venta.recibido ? '<br/>Recibido: $' + venta.recibido.toFixed(2) + '<br/>Cambio: $' + (venta.cambio || 0).toFixed(2) : ''}</p>
      <p style="text-align:center;font-size:12px;margin-top:12px">¡Gracias por su compra!</p>
      </body></html>`)
    w.document.close(); w.focus(); setTimeout(() => w.print(), 300)
  }
  return (
    <AdminModal title="Venta registrada" onClose={onClose}>
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: 'rgba(34,197,94,0.15)' }}>
          <svg className="h-8 w-8 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <p className="text-white/60 text-sm">Factura <b className="text-white">{venta.numero}</b></p>
        <p className="text-3xl font-black my-1" style={{ color: PRIMARY, fontFamily: FONT }}>{money(venta.total)}</p>
        <p className="text-white/50 text-xs">{venta.metodoPago}{venta.cambio ? ` · Cambio ${money(venta.cambio)}` : ''}</p>
      </div>
      <div className="mt-3 rounded-xl p-3 max-h-40 overflow-y-auto" style={{ backgroundColor: INNER }}>
        {venta.items.map(i => (
          <div key={i.productoId} className="flex justify-between text-sm text-white/80 py-0.5"><span>{i.cantidad} × {i.nombre}</span><span>{money(i.subtotal)}</span></div>
        ))}
      </div>
      <div className="mt-4 flex gap-3">
        <Btn variant="ghost" onClick={imprimir} className="flex-1">🖨️ Imprimir</Btn>
        <Btn onClick={onClose} className="flex-1">Nueva venta</Btn>
      </div>
    </AdminModal>
  )
}

export function POS() {
  const { products, registrarVenta } = useData()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('Todas')
  const [lineas, setLineas] = useState<Linea[]>([])
  const [descuento, setDescuento] = useState('')
  const [impuesto, setImpuesto] = useState('')
  const [metodo, setMetodo] = useState(METODOS_PAGO[0])
  const [recibido, setRecibido] = useState('')
  const [cliente, setCliente] = useState('')
  const [comprobante, setComprobante] = useState<Venta | null>(null)

  const activos = useMemo(() => products.filter(p => p.active), [products])
  const cats = useMemo(() => ['Todas', ...Array.from(new Set(activos.map(p => p.category)))], [activos])
  const catalogo = useMemo(() => activos.filter(p => {
    if (cat !== 'Todas' && p.category !== cat) return false
    if (q && !p.name.toLowerCase().includes(q.toLowerCase())) return false
    return true
  }), [activos, q, cat])

  const add = (p: Product) => setLineas(prev => {
    const f = prev.find(l => l.producto.id === p.id)
    if (f) return prev.map(l => l.producto.id === p.id ? { ...l, cantidad: l.cantidad + 1 } : l)
    return [...prev, { producto: p, cantidad: 1 }]
  })
  const setCant = (id: string, n: number) => setLineas(prev => prev.map(l => l.producto.id === id ? { ...l, cantidad: Math.max(0, n) } : l).filter(l => l.cantidad > 0))
  const quitar = (id: string) => setLineas(prev => prev.filter(l => l.producto.id !== id))

  const subtotal = lineas.reduce((s, l) => s + l.producto.price * l.cantidad, 0)
  const desc = Math.min(subtotal, parseFloat(descuento) || 0)
  const imp = +(((subtotal - desc) * (parseFloat(impuesto) || 0)) / 100).toFixed(2)
  const total = +(subtotal - desc + imp).toFixed(2)
  const cambio = metodo === 'Efectivo' && recibido ? +((parseFloat(recibido) || 0) - total).toFixed(2) : 0

  const finalizar = () => {
    if (lineas.length === 0) return
    if (metodo === 'Efectivo' && (parseFloat(recibido) || 0) < total) { alert('El monto recibido es menor al total.'); return }
    const venta = registrarVenta({
      items: lineas.map(l => ({ productoId: l.producto.id, nombre: l.producto.name, cantidad: l.cantidad, precio: l.producto.price, subtotal: +(l.producto.price * l.cantidad).toFixed(2) })),
      subtotal: +subtotal.toFixed(2), descuento: desc, impuesto: imp, total, metodoPago: metodo,
      recibido: metodo === 'Efectivo' ? parseFloat(recibido) || 0 : undefined, cambio: cambio > 0 ? cambio : undefined,
      cliente: cliente || undefined,
    })
    setComprobante(venta)
    setLineas([]); setDescuento(''); setImpuesto(''); setRecibido(''); setCliente('')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3">
        <div className="mb-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm">🔍</span>
            <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar producto…" className="pl-9" />
          </div>
        </div>
        <div className="mb-4 flex gap-2 flex-wrap">
          {cats.map(c => (
            <button key={c} onClick={() => setCat(c)} className="rounded-full px-3 py-1.5 text-xs font-semibold transition-all border"
              style={{ backgroundColor: cat === c ? PRIMARY : 'transparent', color: cat === c ? '#fff' : 'rgba(255,255,255,0.7)', borderColor: cat === c ? PRIMARY : 'rgba(255,255,255,0.15)' }}>{c}</button>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
          {catalogo.map(p => (
            <button key={p.id} onClick={() => add(p)} className="group rounded-xl border border-white/10 overflow-hidden text-left transition-all hover:-translate-y-0.5" style={{ backgroundColor: '#1c1c1c' }}>
              <div className="relative h-24 overflow-hidden bg-white">
                <img src={p.image} alt={p.name} className="h-full w-full object-contain p-1" />
                {estadoStock(p) === 'agotado' && <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-xs font-bold text-red-300">Agotado</span>}
              </div>
              <div className="p-2">
                <p className="truncate text-xs font-bold text-white" style={{ fontFamily: FONT }}>{p.name}</p>
                <p className="text-sm font-black" style={{ color: PRIMARY }}>{money(p.price)} <span className="text-white/30 text-[10px] font-normal">· {p.stock ?? 0} u.</span></p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="rounded-2xl border border-white/10 flex flex-col" style={{ backgroundColor: '#1c1c1c', maxHeight: 'calc(100vh - 140px)' }}>
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <h3 className="font-black text-white" style={{ fontFamily: FONT }}>Venta actual</h3>
            {lineas.length > 0 && <button onClick={() => setLineas([])} className="text-xs text-white/40 hover:text-red-400">Vaciar</button>}
          </div>

          <div className="flex-1 overflow-y-auto px-4 min-h-24">
            {lineas.length === 0 ? (
              <p className="py-10 text-center text-sm text-white/40">Toca un producto para agregarlo.</p>
            ) : lineas.map(l => (
              <div key={l.producto.id} className="flex items-center gap-2 border-b border-white/5 py-2">
                <img src={l.producto.image} alt="" className="h-10 w-10 rounded-lg object-contain bg-white" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">{l.producto.name}</p>
                  <p className="text-xs" style={{ color: PRIMARY }}>{money(l.producto.price)} × {l.cantidad} = {money(l.producto.price * l.cantidad)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setCant(l.producto.id, l.cantidad - 1)} className="h-6 w-6 rounded-full bg-white/10 text-white">−</button>
                  <input value={l.cantidad} onChange={e => setCant(l.producto.id, parseInt(e.target.value) || 0)} className="w-12 rounded bg-white/5 border border-white/10 text-center text-xs text-white py-1" />
                  <button onClick={() => setCant(l.producto.id, l.cantidad + 1)} className="h-6 w-6 rounded-full text-white" style={{ backgroundColor: PRIMARY }}>+</button>
                  <button onClick={() => quitar(l.producto.id)} className="ml-1 text-white/30 hover:text-red-400" aria-label="Quitar">✕</button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 p-4 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div><span className="text-[10px] text-white/40">Descuento $</span><Input type="number" step="0.01" value={descuento} onChange={e => setDescuento(e.target.value)} className="py-1.5" /></div>
              <div><span className="text-[10px] text-white/40">Impuesto %</span><Input type="number" step="1" value={impuesto} onChange={e => setImpuesto(e.target.value)} className="py-1.5" /></div>
            </div>
            <div className="text-sm space-y-1 pt-1">
              <div className="flex justify-between text-white/60"><span>Subtotal</span><span>{money(subtotal)}</span></div>
              {desc > 0 && <div className="flex justify-between text-white/60"><span>Descuento</span><span>-{money(desc)}</span></div>}
              {imp > 0 && <div className="flex justify-between text-white/60"><span>Impuesto</span><span>{money(imp)}</span></div>}
              <div className="flex justify-between text-lg font-black text-white pt-1"><span>Total</span><span style={{ color: PRIMARY }}>{money(total)}</span></div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Select value={metodo} onChange={e => setMetodo(e.target.value)} className="py-1.5 text-xs">{METODOS_PAGO.map(mp => <option key={mp}>{mp}</option>)}</Select>
              <Input value={cliente} onChange={e => setCliente(e.target.value)} placeholder="Cliente (opcional)" className="py-1.5 text-xs" />
            </div>
            {metodo === 'Efectivo' && (
              <div className="grid grid-cols-2 gap-2 items-center">
                <Input type="number" step="0.01" value={recibido} onChange={e => setRecibido(e.target.value)} placeholder="Recibido $" className="py-1.5" />
                <div className="text-right text-sm">Cambio: <b style={{ color: cambio >= 0 ? '#4ade80' : '#f87171' }}>{money(Math.max(0, cambio))}</b></div>
              </div>
            )}
            <Btn variant="green" onClick={finalizar} className="w-full !py-3 mt-1">Finalizar venta · {money(total)}</Btn>
          </div>
        </div>
      </div>

      {comprobante && <Comprobante venta={comprobante} onClose={() => setComprobante(null)} />}
    </div>
  )
}
