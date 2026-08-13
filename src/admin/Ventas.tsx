import { useState, useMemo } from 'react'
import { useData, PRIMARY } from '../store'
import type { Venta } from '../store'
import { Panel, SectionTitle, Btn, Input, Select, AdminModal, money, EmptyState, INNER } from './ui'

function Detalle({ venta, onClose }: { venta: Venta; onClose: () => void }) {
  return (
    <AdminModal title={`Factura ${venta.numero}`} onClose={onClose}>
      <div className="space-y-1 text-sm text-white/70 mb-4">
        <div className="flex justify-between"><span className="text-white/40">Fecha</span><span>{venta.fecha} · {venta.hora}</span></div>
        <div className="flex justify-between"><span className="text-white/40">Atendió</span><span>{venta.cajero}</span></div>
        {venta.cliente && <div className="flex justify-between"><span className="text-white/40">Cliente</span><span>{venta.cliente}</span></div>}
        <div className="flex justify-between"><span className="text-white/40">Método de pago</span><span>{venta.metodoPago}</span></div>
        <div className="flex justify-between"><span className="text-white/40">Estado</span><span className="text-green-400 font-bold">{venta.estado}</span></div>
      </div>
      <div className="rounded-xl p-3 mb-4" style={{ backgroundColor: INNER }}>
        {venta.items.map(i => (
          <div key={i.productoId} className="flex justify-between text-sm text-white/80 py-1 border-b border-white/5 last:border-0">
            <span>{i.cantidad} × {i.nombre}</span><span>{money(i.subtotal)}</span>
          </div>
        ))}
      </div>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between text-white/60"><span>Subtotal</span><span>{money(venta.subtotal)}</span></div>
        {venta.descuento > 0 && <div className="flex justify-between text-white/60"><span>Descuento</span><span>-{money(venta.descuento)}</span></div>}
        {venta.impuesto > 0 && <div className="flex justify-between text-white/60"><span>Impuesto</span><span>{money(venta.impuesto)}</span></div>}
        <div className="flex justify-between text-lg font-black text-white pt-1"><span>Total</span><span style={{ color: PRIMARY }}>{money(venta.total)}</span></div>
        {venta.recibido ? <div className="flex justify-between text-white/50 text-xs pt-1"><span>Recibido / Cambio</span><span>{money(venta.recibido)} / {money(venta.cambio || 0)}</span></div> : null}
      </div>
    </AdminModal>
  )
}

export function Ventas() {
  const { ventas } = useData()
  const [q, setQ] = useState('')
  const [metodo, setMetodo] = useState('Todos')
  const [ver, setVer] = useState<Venta | null>(null)

  const metodos = useMemo(() => ['Todos', ...Array.from(new Set(ventas.map(v => v.metodoPago)))], [ventas])
  const list = useMemo(() => ventas.filter(v => {
    if (metodo !== 'Todos' && v.metodoPago !== metodo) return false
    if (q && !`${v.numero} ${v.cajero} ${v.cliente || ''}`.toLowerCase().includes(q.toLowerCase())) return false
    return true
  }), [ventas, q, metodo])

  const totalMostrado = list.reduce((s, v) => s + v.total, 0)

  const exportar = () => {
    const head = ['Factura', 'Fecha', 'Hora', 'Atendio', 'Cliente', 'Metodo', 'Total']
    const rows = ventas.map(v => [v.numero, v.fecha, v.hora, v.cajero, v.cliente || '', v.metodoPago, v.total])
    const csv = [head, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    const a = document.createElement('a'); a.href = url; a.download = 'ventas-ferre-carupano.csv'; a.click(); URL.revokeObjectURL(url)
  }

  return (
    <div>
      <SectionTitle title="Historial de ventas" sub={`${list.length} ventas · ${money(totalMostrado)} en total`}
        right={<Btn variant="ghost" onClick={exportar}>Exportar CSV</Btn>} />
      <Panel className="mb-4">
        <div className="flex flex-wrap gap-3 items-center">
          <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar factura, cajero o cliente…" className="flex-1 min-w-48" />
          <Select value={metodo} onChange={e => setMetodo(e.target.value)} className="max-w-52">{metodos.map(m => <option key={m}>{m}</option>)}</Select>
        </div>
      </Panel>
      <Panel>
        {list.length === 0 ? <EmptyState icon="🧾" text="Aún no hay ventas registradas." /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[680px]">
              <thead><tr className="text-left text-white/40 text-xs border-b border-white/10">
                <th className="py-2 pr-3">Factura</th><th className="py-2 pr-3">Fecha</th><th className="py-2 pr-3">Atendió</th>
                <th className="py-2 pr-3">Cliente</th><th className="py-2 pr-3">Método</th><th className="py-2 pr-3 text-right">Total</th><th className="py-2 text-right">Detalle</th>
              </tr></thead>
              <tbody>
                {list.map(v => (
                  <tr key={v.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="py-2 pr-3 font-bold text-white">{v.numero}</td>
                    <td className="py-2 pr-3 text-white/60 whitespace-nowrap">{v.fecha} {v.hora}</td>
                    <td className="py-2 pr-3 text-white/60">{v.cajero}</td>
                    <td className="py-2 pr-3 text-white/50">{v.cliente || '—'}</td>
                    <td className="py-2 pr-3 text-white/60">{v.metodoPago}</td>
                    <td className="py-2 pr-3 text-right font-black" style={{ color: PRIMARY }}>{money(v.total)}</td>
                    <td className="py-2 text-right"><button onClick={() => setVer(v)} className="text-xs font-bold" style={{ color: PRIMARY }}>Ver</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
      {ver && <Detalle venta={ver} onClose={() => setVer(null)} />}
    </div>
  )
}
