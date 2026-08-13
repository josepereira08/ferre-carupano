import { useState } from 'react'
import { useData, estadoStock } from '../store'
import { Panel, SectionTitle, Btn, Field, Input, Select, Textarea, EstadoBadge } from './ui'

const FONT = "'Roboto Slab', serif"
const MOTIVOS_SALIDA = ['Producto dañado', 'Consumo interno', 'Ajuste', 'Devolución', 'Garantía', 'Error de inventario']

export function Inventario() {
  const { products, registrarEntrada, registrarSalida } = useData()

  const [eProd, setEProd] = useState(''); const [eCant, setECant] = useState(''); const [eCosto, setECosto] = useState('')
  const [eProv, setEProv] = useState(''); const [eObs, setEObs] = useState(''); const [eOk, setEOk] = useState(false)
  const [sProd, setSProd] = useState(''); const [sCant, setSCant] = useState(''); const [sMotivo, setSMotivo] = useState(MOTIVOS_SALIDA[0]); const [sOk, setSOk] = useState(false)

  const guardarEntrada = () => {
    const cant = parseFloat(eCant); if (!eProd || !cant || cant <= 0) return
    registrarEntrada({ productoId: eProd, cantidad: cant, costo: eCosto ? parseFloat(eCosto) : undefined, proveedor: eProv || undefined, obs: eObs || undefined })
    setECant(''); setECosto(''); setEProv(''); setEObs(''); setEOk(true); setTimeout(() => setEOk(false), 2500)
  }
  const guardarSalida = () => {
    const cant = parseFloat(sCant); if (!sProd || !cant || cant <= 0) return
    registrarSalida({ productoId: sProd, cantidad: cant, motivo: sMotivo })
    setSCant(''); setSOk(true); setTimeout(() => setSOk(false), 2500)
  }

  const opciones = products.map(p => <option key={p.id} value={p.id}>{p.name} — {p.stock ?? 0} u.</option>)

  return (
    <div>
      <SectionTitle title="Inventario" sub="Registra entradas y salidas de mercancía" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Panel>
          <h3 className="mb-4 flex items-center gap-2 font-black text-white" style={{ fontFamily: FONT }}><span className="text-green-400">↓</span> Registrar entrada</h3>
          <div className="space-y-4">
            <Field label="Producto"><Select value={eProd} onChange={e => setEProd(e.target.value)}><option value="">Selecciona…</option>{opciones}</Select></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Cantidad"><Input type="number" step="1" value={eCant} onChange={e => setECant(e.target.value)} /></Field>
              <Field label="Costo unitario ($, opcional)"><Input type="number" step="0.01" value={eCosto} onChange={e => setECosto(e.target.value)} /></Field>
            </div>
            <Field label="Proveedor (opcional)"><Input value={eProv} onChange={e => setEProv(e.target.value)} /></Field>
            <Field label="Observaciones (opcional)"><Textarea rows={2} value={eObs} onChange={e => setEObs(e.target.value)} /></Field>
            <Btn variant="green" onClick={guardarEntrada} className="w-full">Guardar entrada</Btn>
            {eOk && <p className="text-center text-sm text-green-400">✓ Entrada registrada y stock actualizado.</p>}
          </div>
        </Panel>

        <Panel>
          <h3 className="mb-4 flex items-center gap-2 font-black text-white" style={{ fontFamily: FONT }}><span className="text-red-400">↑</span> Registrar salida</h3>
          <div className="space-y-4">
            <Field label="Producto"><Select value={sProd} onChange={e => setSProd(e.target.value)}><option value="">Selecciona…</option>{opciones}</Select></Field>
            <Field label="Cantidad"><Input type="number" step="1" value={sCant} onChange={e => setSCant(e.target.value)} /></Field>
            <Field label="Motivo"><Select value={sMotivo} onChange={e => setSMotivo(e.target.value)}>{MOTIVOS_SALIDA.map(m => <option key={m}>{m}</option>)}</Select></Field>
            <Btn variant="danger" onClick={guardarSalida} className="w-full">Guardar salida</Btn>
            {sOk && <p className="text-center text-sm text-red-400">✓ Salida registrada y stock descontado.</p>}
          </div>
        </Panel>
      </div>

      <Panel>
        <h3 className="mb-4 font-black text-white" style={{ fontFamily: FONT }}>Stock actual</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead><tr className="text-left text-white/40 text-xs border-b border-white/10">
              <th className="py-2 pr-3">Producto</th><th className="py-2 pr-3">Categoría</th><th className="py-2 pr-3 text-right">Stock</th><th className="py-2 pr-3 text-right">Mínimo</th><th className="py-2">Estado</th>
            </tr></thead>
            <tbody>
              {[...products].sort((a, b) => (estadoStock(a) === 'disponible' ? 1 : 0) - (estadoStock(b) === 'disponible' ? 1 : 0)).map(p => (
                <tr key={p.id} className="border-b border-white/5">
                  <td className="py-2 pr-3 font-semibold text-white">{p.name}</td>
                  <td className="py-2 pr-3 text-white/50">{p.category}</td>
                  <td className="py-2 pr-3 text-right text-white">{p.stock ?? 0} <span className="text-white/30 text-xs">u.</span></td>
                  <td className="py-2 pr-3 text-right text-white/40">{p.stockMin ?? 6}</td>
                  <td className="py-2"><EstadoBadge estado={estadoStock(p)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}
