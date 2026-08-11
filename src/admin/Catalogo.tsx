import { useState, useMemo } from 'react'
import { useData, PRIMARY, CATEGORY_NAMES, BADGE_COLORS } from '../store'
import type { Product } from '../store'
import { Panel, SectionTitle, Btn, Field, Input, Select, Textarea, AdminModal, EmptyState, ImagePicker, money } from './ui'

const vacio = (): Omit<Product, 'id'> => ({
  name: '', brand: '', category: 'Herramientas Eléctricas', price: 0, originalPrice: null, image: '',
  badge: null, badgeColor: null, description: '', features: [], active: true,
})

function ProductForm({ inicial, onSave, onClose }: { inicial: Omit<Product, 'id'>; onSave: (p: Omit<Product, 'id'>) => void; onClose: () => void }) {
  const { brands, categories } = useData()
  const [f, setF] = useState(inicial)
  const set = (k: keyof Product, v: unknown) => setF(prev => ({ ...prev, [k]: v }))
  const num = (v: string) => (v === '' ? 0 : parseFloat(v))
  const catNames = categories.length ? categories.map(c => c.name) : CATEGORY_NAMES

  const setBadge = (label: string) => {
    if (!label) { setF(prev => ({ ...prev, badge: null, badgeColor: null })); return }
    const c = BADGE_COLORS.find(b => b.label === label)
    setF(prev => ({ ...prev, badge: label, badgeColor: c?.color ?? PRIMARY }))
  }

  const guardar = () => {
    if (!f.name.trim()) { alert('El producto necesita un nombre.'); return }
    onSave({ ...f, features: f.features.filter(x => x.trim()) })
    onClose()
  }

  return (
    <AdminModal title={inicial.name ? 'Editar producto' : 'Nuevo producto'} onClose={onClose} wide>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <ImagePicker value={f.image} onChange={v => set('image', v)} label="Imagen del producto (URL o subir archivo)" />
        </div>

        <div className="sm:col-span-2"><Field label="Nombre"><Input value={f.name} onChange={e => set('name', e.target.value)} placeholder="Taladro Inalámbrico 20V" /></Field></div>
        <Field label="Marca">
          <Input list="marcas-list" value={f.brand} onChange={e => set('brand', e.target.value)} placeholder="DeWalt" />
          <datalist id="marcas-list">{brands.map(b => <option key={b} value={b} />)}</datalist>
        </Field>
        <Field label="Categoría"><Select value={f.category} onChange={e => set('category', e.target.value)}>{catNames.map(c => <option key={c}>{c}</option>)}</Select></Field>

        <Field label="Precio (US$)"><Input type="number" step="0.01" value={f.price || ''} onChange={e => set('price', num(e.target.value))} /></Field>
        <Field label="Precio anterior (US$, opcional)"><Input type="number" step="0.01" value={f.originalPrice ?? ''} onChange={e => set('originalPrice', e.target.value === '' ? null : num(e.target.value))} /></Field>

        <Field label="Etiqueta">
          <Select value={f.badge ?? ''} onChange={e => setBadge(e.target.value)}>
            <option value="">Sin etiqueta</option>
            {BADGE_COLORS.map(b => <option key={b.label} value={b.label}>{b.label}</option>)}
          </Select>
        </Field>
        <label className="flex items-center gap-2 self-end pb-2 text-sm text-white">
          <input type="checkbox" checked={f.active} onChange={e => set('active', e.target.checked)} className="h-4 w-4 accent-[#DC2626]" />
          Visible en la web
        </label>

        <div className="sm:col-span-2"><Field label="Descripción"><Textarea rows={3} value={f.description} onChange={e => set('description', e.target.value)} placeholder="Breve descripción del producto…" /></Field></div>
        <div className="sm:col-span-2"><Field label="Características (una por línea)"><Textarea rows={4} value={f.features.join('\n')} onChange={e => set('features', e.target.value.split('\n'))} placeholder={'Motor de alta eficiencia\nBatería 20V MAX litio-ion'} /></Field></div>
      </div>

      <div className="mt-6 flex gap-3">
        <Btn variant="ghost" onClick={onClose} className="flex-1">Cancelar</Btn>
        <Btn onClick={guardar} className="flex-1">Guardar producto</Btn>
      </div>
    </AdminModal>
  )
}

export function Catalogo() {
  const { products, addProduct, updateProduct, deleteProduct } = useData()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('Todas')
  const [editing, setEditing] = useState<Product | 'new' | null>(null)

  const cats = useMemo(() => ['Todas', ...Array.from(new Set(products.map(p => p.category)))], [products])
  const list = useMemo(() => products.filter(p => {
    if (cat !== 'Todas' && p.category !== cat) return false
    if (q && !`${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(q.toLowerCase())) return false
    return true
  }), [products, q, cat])

  return (
    <div>
      <SectionTitle title="Catálogo de productos" sub={`${products.length} productos · gestiona lo que se muestra en la tienda`}
        right={<Btn onClick={() => setEditing('new')}>+ Nuevo producto</Btn>} />

      <Panel className="mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-48 flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-white/40">🔍</span>
            <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar por nombre o marca…" className="pl-9" />
          </div>
          <Select value={cat} onChange={e => setCat(e.target.value)} className="max-w-56">{cats.map(c => <option key={c}>{c}</option>)}</Select>
        </div>
      </Panel>

      <Panel>
        {list.length === 0 ? <EmptyState text="No hay productos con ese filtro." /> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs text-white/40">
                  <th className="py-2 pr-3">Producto</th>
                  <th className="py-2 pr-3">Categoría</th>
                  <th className="py-2 pr-3 text-right">Precio</th>
                  <th className="py-2 pr-3">Web</th>
                  <th className="py-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {list.map(p => (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                    <td className="py-2 pr-3">
                      <div className="flex items-center gap-2">
                        <img src={p.image} alt="" className="h-10 w-10 rounded-lg bg-white object-cover" />
                        <div>
                          <div className="font-semibold text-white">{p.name}</div>
                          <div className="text-xs text-white/40">{p.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 pr-3 text-white/60">{p.category}</td>
                    <td className="py-2 pr-3 text-right font-bold" style={{ color: PRIMARY }}>{money(p.price)}</td>
                    <td className="py-2 pr-3">
                      <button onClick={() => updateProduct(p.id, { active: !p.active })}
                        className="rounded-full px-2 py-0.5 text-xs font-bold"
                        style={{ backgroundColor: p.active ? 'rgba(5,150,105,0.18)' : 'rgba(255,255,255,0.08)', color: p.active ? '#4ade80' : 'rgba(255,255,255,0.4)' }}>
                        {p.active ? 'Visible' : 'Oculto'}
                      </button>
                    </td>
                    <td className="whitespace-nowrap py-2 text-right">
                      <button onClick={() => setEditing(p)} className="mr-3 text-xs font-bold" style={{ color: PRIMARY }}>Editar</button>
                      <button onClick={() => { if (confirm(`¿Eliminar "${p.name}"?`)) deleteProduct(p.id) }} className="text-xs font-bold text-red-400">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {editing === 'new' && <ProductForm inicial={vacio()} onSave={p => addProduct(p)} onClose={() => setEditing(null)} />}
      {editing && editing !== 'new' && <ProductForm inicial={editing} onSave={p => updateProduct((editing as Product).id, p)} onClose={() => setEditing(null)} />}
    </div>
  )
}
