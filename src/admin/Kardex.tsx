import { useState, useMemo } from 'react'
import { useData } from '../store'
import { Panel, SectionTitle, Select, Input, EmptyState } from './ui'

const TIPO_STYLE: Record<string, { t: string; c: string; bg: string }> = {
  entrada: { t: 'Entrada', c: '#4ade80', bg: 'rgba(34,197,94,0.15)' },
  salida: { t: 'Salida', c: '#f87171', bg: 'rgba(248,113,113,0.15)' },
  venta: { t: 'Venta', c: '#f87171', bg: 'rgba(220,38,38,0.16)' },
  ajuste: { t: 'Ajuste', c: '#a3a3a3', bg: 'rgba(255,255,255,0.08)' },
}

export function Kardex() {
  const { movimientos } = useData()
  const [tipo, setTipo] = useState('Todos')
  const [q, setQ] = useState('')

  const list = useMemo(() => movimientos.filter(mv => {
    if (tipo !== 'Todos' && mv.tipo !== tipo) return false
    if (q && !mv.producto.toLowerCase().includes(q.toLowerCase())) return false
    return true
  }), [movimientos, tipo, q])

  return (
    <div>
      <SectionTitle title="Kardex" sub="Historial completo de movimientos de inventario" />
      <Panel className="mb-4">
        <div className="flex flex-wrap gap-3 items-center">
          <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar producto…" className="flex-1 min-w-48" />
          <Select value={tipo} onChange={e => setTipo(e.target.value)} className="max-w-44">
            <option value="Todos">Todos los tipos</option>
            <option value="entrada">Entradas</option>
            <option value="salida">Salidas</option>
            <option value="venta">Ventas</option>
            <option value="ajuste">Ajustes</option>
          </Select>
        </div>
      </Panel>
      <Panel>
        {list.length === 0 ? <EmptyState icon="🧾" text="Aún no hay movimientos registrados." /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead><tr className="text-left text-white/40 text-xs border-b border-white/10">
                <th className="py-2 pr-3">Fecha</th><th className="py-2 pr-3">Tipo</th><th className="py-2 pr-3">Producto</th>
                <th className="py-2 pr-3">Motivo</th><th className="py-2 pr-3">Usuario</th>
                <th className="py-2 pr-3 text-right">Cant.</th><th className="py-2 pr-3 text-right">Ant.</th><th className="py-2 text-right">Nuevo</th>
              </tr></thead>
              <tbody>
                {list.map(mv => {
                  const st = TIPO_STYLE[mv.tipo]
                  const f = new Date(mv.fecha)
                  return (
                    <tr key={mv.id} className="border-b border-white/5">
                      <td className="py-2 pr-3 text-white/60 whitespace-nowrap">{f.toLocaleDateString('es-VE')} {f.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })}</td>
                      <td className="py-2 pr-3"><span className="rounded-full px-2 py-0.5 text-xs font-bold" style={{ backgroundColor: st.bg, color: st.c }}>{st.t}</span></td>
                      <td className="py-2 pr-3 font-semibold text-white">{mv.producto}</td>
                      <td className="py-2 pr-3 text-white/60">{mv.motivo}{mv.proveedor ? ` · ${mv.proveedor}` : ''}</td>
                      <td className="py-2 pr-3 text-white/50">{mv.usuario}</td>
                      <td className="py-2 pr-3 text-right font-bold" style={{ color: mv.tipo === 'entrada' ? '#4ade80' : '#f87171' }}>{mv.tipo === 'entrada' ? '+' : '−'}{mv.cantidad}</td>
                      <td className="py-2 pr-3 text-right text-white/40">{mv.stockAnterior}</td>
                      <td className="py-2 text-right text-white">{mv.stockNuevo}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  )
}
