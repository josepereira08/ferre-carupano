import { useMemo } from 'react'
import { useData, estadoStock, PRIMARY } from '../store'
import { Panel, SectionTitle, money, EstadoBadge } from './ui'

const FONT = "'Roboto Slab', serif"

function Stat({ label, value, icon, accent }: { label: string; value: string; icon: string; accent?: boolean }) {
  return (
    <Panel className="flex items-center gap-4">
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-2xl" style={{ backgroundColor: accent ? PRIMARY : 'rgba(255,255,255,0.06)' }}>{icon}</div>
      <div className="min-w-0">
        <p className="truncate text-2xl font-black text-white" style={{ fontFamily: FONT }}>{value}</p>
        <p className="text-white/50 text-xs">{label}</p>
      </div>
    </Panel>
  )
}

export function Dashboard({ go }: { go: (v: string) => void }) {
  const { ventas, products, movimientos } = useData()

  const m = useMemo(() => {
    const now = new Date()
    const startDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    const startMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime()
    const ventasHoy = ventas.filter(v => v.ts >= startDay)
    const ventasMes = ventas.filter(v => v.ts >= startMonth)
    const bajo = products.filter(p => estadoStock(p) === 'bajo')
    const agotados = products.filter(p => estadoStock(p) === 'agotado')

    const vendidos: Record<string, number> = {}
    ventas.forEach(v => v.items.forEach(it => { vendidos[it.nombre] = (vendidos[it.nombre] || 0) + it.cantidad }))
    const masVendidos = Object.entries(vendidos).sort((a, b) => b[1] - a[1]).slice(0, 5)

    const dias = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (6 - i))
      const ini = d.getTime(), fin = ini + 86400000
      const total = ventas.filter(v => v.ts >= ini && v.ts < fin).reduce((s, v) => s + v.total, 0)
      return { label: d.toLocaleDateString('es-VE', { weekday: 'short' }), total }
    })
    const maxDia = Math.max(1, ...dias.map(d => d.total))

    return {
      totalHoy: ventasHoy.reduce((s, v) => s + v.total, 0), nHoy: ventasHoy.length,
      totalMes: ventasMes.reduce((s, v) => s + v.total, 0), nMes: ventasMes.length,
      bajo, agotados, masVendidos, dias, maxDia,
    }
  }, [ventas, products, movimientos])

  return (
    <div>
      <SectionTitle title="Dashboard" sub="Resumen de la ferretería en tiempo real" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Stat label={`Ventas de hoy (${m.nHoy})`} value={money(m.totalHoy)} icon="💵" accent />
        <Stat label={`Ventas del mes (${m.nMes})`} value={money(m.totalMes)} icon="📈" />
        <Stat label="Productos registrados" value={String(products.length)} icon="📦" />
        <Stat label="Inventario bajo / agotado" value={`${m.bajo.length} / ${m.agotados.length}`} icon="⚠️" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Panel className="lg:col-span-2">
          <h3 className="mb-4 font-black text-white" style={{ fontFamily: FONT }}>Ventas · últimos 7 días</h3>
          <div className="flex items-end justify-between gap-2 h-40">
            {m.dias.map((d, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t-lg transition-all" style={{ height: `${(d.total / m.maxDia) * 100}%`, minHeight: d.total > 0 ? 6 : 2, backgroundColor: d.total > 0 ? PRIMARY : 'rgba(255,255,255,0.08)' }} title={money(d.total)} />
                <span className="text-[10px] capitalize text-white/40">{d.label}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <h3 className="mb-4 font-black text-white" style={{ fontFamily: FONT }}>Más vendidos</h3>
          {m.masVendidos.length === 0 ? (
            <p className="text-white/40 text-sm">Aún no hay ventas registradas.</p>
          ) : (
            <ul className="space-y-3">
              {m.masVendidos.map(([nombre, cant], i) => (
                <li key={nombre} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-black text-white" style={{ backgroundColor: PRIMARY }}>{i + 1}</span>
                  <span className="flex-1 truncate text-sm text-white">{nombre}</span>
                  <span className="text-sm font-bold text-white/60">{cant}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel className="lg:col-span-1">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-black text-white" style={{ fontFamily: FONT }}>Alertas de inventario</h3>
            <button onClick={() => go('inventario')} className="text-xs font-bold" style={{ color: PRIMARY }}>Ver →</button>
          </div>
          {[...m.agotados, ...m.bajo].length === 0 ? (
            <p className="text-white/40 text-sm">Todo el inventario está en orden ✅</p>
          ) : (
            <ul className="space-y-2 max-h-52 overflow-y-auto">
              {[...m.agotados, ...m.bajo].slice(0, 8).map(p => (
                <li key={p.id} className="flex items-center justify-between gap-2 text-sm">
                  <span className="truncate text-white">{p.name}</span>
                  <span className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-white/40 text-xs">{p.stock ?? 0} u.</span>
                    <EstadoBadge estado={estadoStock(p)} />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-black text-white" style={{ fontFamily: FONT }}>Últimas ventas</h3>
            <button onClick={() => go('ventas')} className="text-xs font-bold" style={{ color: PRIMARY }}>Ver todas →</button>
          </div>
          {ventas.length === 0 ? (
            <p className="text-white/40 text-sm">Aún no se han registrado ventas. Ve al <button onClick={() => go('pos')} className="font-bold" style={{ color: PRIMARY }}>Punto de Venta</button>.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-white/40 text-xs border-b border-white/10">
                  <th className="py-2 pr-2">Factura</th><th className="py-2 pr-2">Fecha</th><th className="py-2 pr-2">Cajero</th><th className="py-2 pr-2">Método</th><th className="py-2 text-right">Total</th>
                </tr></thead>
                <tbody>
                  {ventas.slice(0, 6).map(v => (
                    <tr key={v.id} className="border-b border-white/5">
                      <td className="py-2 pr-2 font-bold text-white">{v.numero}</td>
                      <td className="py-2 pr-2 text-white/60">{v.fecha} {v.hora}</td>
                      <td className="py-2 pr-2 text-white/60">{v.cajero}</td>
                      <td className="py-2 pr-2 text-white/60">{v.metodoPago}</td>
                      <td className="py-2 text-right font-black" style={{ color: PRIMARY }}>{money(v.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </div>
    </div>
  )
}
