import { useData, uid, PRIMARY } from '../store'
import type { Slide, Category, Location } from '../store'
import { Panel, SectionTitle, Btn, Field, Input, Textarea, ImagePicker } from './ui'

export function Pagina() {
  const { site, setSite, slides, setSlides, categories, setCategories, brands, setBrands, locations, setLocations } = useData()

  const updateSlide = (id: string, patch: Partial<Slide>) => setSlides(slides.map(s => (s.id === id ? { ...s, ...patch } : s)))
  const addSlide = () => setSlides([...slides, { id: uid(), title: 'Nuevo banner', subtitle: '', cta: 'Ver más', accent: PRIMARY, image: '' }])
  const removeSlide = (id: string) => setSlides(slides.filter(s => s.id !== id))

  const updateCat = (id: string, patch: Partial<Category>) => setCategories(categories.map(c => (c.id === id ? { ...c, ...patch } : c)))
  const addCat = () => setCategories([...categories, { id: uid(), name: 'Nueva categoría', icon: '🔧', count: 0, color: PRIMARY }])
  const removeCat = (id: string) => setCategories(categories.filter(c => c.id !== id))

  const updateLoc = (id: string, patch: Partial<Location>) => setLocations(locations.map(l => (l.id === id ? { ...l, ...patch } : l)))
  const addLoc = () => setLocations([...locations, { id: uid(), name: 'Nueva sucursal', address: '', phone: '', hours: '', mapSrc: '' }])
  const removeLoc = (id: string) => setLocations(locations.filter(l => l.id !== id))

  return (
    <div>
      <SectionTitle title="Configuración de la página" sub="Edita la información, el banner, las categorías, las marcas y las sucursales. Los cambios se guardan automáticamente." />

      <Panel className="mb-5">
        <h2 className="mb-4 text-lg font-black text-white" style={{ fontFamily: "'Roboto Slab', serif" }}>Información general</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Nombre de la ferretería"><Input value={site.name} onChange={e => setSite({ name: e.target.value })} /></Field>
          <Field label="Lema / etiqueta"><Input value={site.tagline} onChange={e => setSite({ tagline: e.target.value })} /></Field>
          <Field label="WhatsApp (solo números, con código país)"><Input value={site.waNumber} onChange={e => setSite({ waNumber: e.target.value })} placeholder="584149969965" /></Field>
          <Field label="Teléfono visible"><Input value={site.waDisplay} onChange={e => setSite({ waDisplay: e.target.value })} placeholder="+58 414-9969965" /></Field>
          <Field label="Correo electrónico"><Input value={site.email} onChange={e => setSite({ email: e.target.value })} /></Field>
          <Field label="Tasa Bs por US$ (referencia)"><Input type="number" value={site.bsRate || ''} onChange={e => setSite({ bsRate: e.target.value === '' ? 0 : parseFloat(e.target.value) })} /></Field>
          <div className="sm:col-span-2"><Field label="Texto de la barra superior"><Input value={site.topBarText} onChange={e => setSite({ topBarText: e.target.value })} /></Field></div>
          <div className="sm:col-span-2"><Field label="Descripción (pie de página)"><Textarea rows={2} value={site.aboutText} onChange={e => setSite({ aboutText: e.target.value })} /></Field></div>
        </div>
      </Panel>

      <Panel className="mb-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-black text-white" style={{ fontFamily: "'Roboto Slab', serif" }}>Banner principal ({slides.length})</h2>
          <Btn onClick={addSlide}>+ Agregar banner</Btn>
        </div>
        <div className="space-y-4">
          {slides.map((s, i) => (
            <div key={s.id} className="rounded-xl border border-white/10 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-bold text-white/40">Banner {i + 1}</span>
                <button onClick={() => removeSlide(s.id)} className="text-xs font-bold text-red-400">Eliminar</button>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2"><ImagePicker value={s.image} onChange={v => updateSlide(s.id, { image: v })} label="Imagen de fondo (URL o subir)" /></div>
                <Field label="Título"><Input value={s.title} onChange={e => updateSlide(s.id, { title: e.target.value })} /></Field>
                <Field label="Texto del botón"><Input value={s.cta} onChange={e => updateSlide(s.id, { cta: e.target.value })} /></Field>
                <div className="sm:col-span-2"><Field label="Subtítulo"><Textarea rows={2} value={s.subtitle} onChange={e => updateSlide(s.id, { subtitle: e.target.value })} /></Field></div>
                <Field label="Color de acento">
                  <div className="flex items-center gap-2">
                    <input type="color" value={s.accent} onChange={e => updateSlide(s.id, { accent: e.target.value })} className="h-9 w-12 cursor-pointer rounded border border-white/15 bg-transparent" />
                    <Input value={s.accent} onChange={e => updateSlide(s.id, { accent: e.target.value })} />
                  </div>
                </Field>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="mb-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-black text-white" style={{ fontFamily: "'Roboto Slab', serif" }}>Categorías ({categories.length})</h2>
          <Btn onClick={addCat}>+ Agregar</Btn>
        </div>
        <div className="space-y-2">
          {categories.map(c => (
            <div key={c.id} className="flex flex-wrap items-end gap-2 rounded-lg border border-white/10 p-2">
              <div className="w-16"><Field label="Icono"><Input value={c.icon} onChange={e => updateCat(c.id, { icon: e.target.value })} className="text-center" /></Field></div>
              <div className="min-w-40 flex-1"><Field label="Nombre"><Input value={c.name} onChange={e => updateCat(c.id, { name: e.target.value })} /></Field></div>
              <div className="w-24"><Field label="N.° prod."><Input type="number" value={c.count || ''} onChange={e => updateCat(c.id, { count: e.target.value === '' ? 0 : parseInt(e.target.value) })} /></Field></div>
              <div className="w-16"><Field label="Color"><input type="color" value={c.color} onChange={e => updateCat(c.id, { color: e.target.value })} className="h-9 w-full cursor-pointer rounded border border-white/15 bg-transparent" /></Field></div>
              <button onClick={() => removeCat(c.id)} className="pb-2 text-xs font-bold text-red-400">Eliminar</button>
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="mb-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-black text-white" style={{ fontFamily: "'Roboto Slab', serif" }}>Marcas ({brands.length})</h2>
          <Btn onClick={() => setBrands([...brands, 'Nueva marca'])}>+ Agregar</Btn>
        </div>
        <div className="flex flex-wrap gap-2">
          {brands.map((b, i) => (
            <div key={i} className="flex items-center gap-1 rounded-full border border-white/15 bg-white/5 py-1 pl-3 pr-1">
              <input value={b} onChange={e => setBrands(brands.map((x, j) => (j === i ? e.target.value : x)))}
                className="w-28 bg-transparent text-sm text-white focus:outline-none" />
              <button onClick={() => setBrands(brands.filter((_, j) => j !== i))} className="flex h-5 w-5 items-center justify-center rounded-full text-white/50 hover:bg-red-500/20 hover:text-red-400">×</button>
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-black text-white" style={{ fontFamily: "'Roboto Slab', serif" }}>Sucursales ({locations.length})</h2>
          <Btn onClick={addLoc}>+ Agregar</Btn>
        </div>
        <div className="space-y-4">
          {locations.map((l, i) => (
            <div key={l.id} className="rounded-xl border border-white/10 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-bold text-white/40">Sucursal {i + 1}</span>
                <button onClick={() => removeLoc(l.id)} className="text-xs font-bold text-red-400">Eliminar</button>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Nombre"><Input value={l.name} onChange={e => updateLoc(l.id, { name: e.target.value })} /></Field>
                <Field label="Teléfono"><Input value={l.phone} onChange={e => updateLoc(l.id, { phone: e.target.value })} /></Field>
                <div className="sm:col-span-2"><Field label="Dirección"><Input value={l.address} onChange={e => updateLoc(l.id, { address: e.target.value })} /></Field></div>
                <div className="sm:col-span-2"><Field label="Horario"><Input value={l.hours} onChange={e => updateLoc(l.id, { hours: e.target.value })} /></Field></div>
                <div className="sm:col-span-2"><Field label="Mapa (URL embed de Google Maps)"><Textarea rows={2} value={l.mapSrc} onChange={e => updateLoc(l.id, { mapSrc: e.target.value })} /></Field></div>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}
