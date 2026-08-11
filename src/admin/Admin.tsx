import { useState } from 'react'
import { useData, PRIMARY } from '../store'
import { Catalogo } from './Catalogo'
import { Pagina } from './Pagina'

type View = 'catalogo' | 'pagina'
const NAV: { id: View; label: string; icon: string }[] = [
  { id: 'catalogo', label: 'Catálogo', icon: '🧰' },
  { id: 'pagina', label: 'Configuración Web', icon: '🖥️' },
]

export function Admin({ onExit }: { onExit: () => void }) {
  const { session, logout, site, resetAll } = useData()
  const [view, setView] = useState<View>('catalogo')

  const salir = () => { logout(); onExit() }

  const NavBtn = ({ n, mobile }: { n: typeof NAV[number]; mobile?: boolean }) => (
    <button onClick={() => setView(n.id)}
      className={`flex items-center gap-3 rounded-xl font-semibold transition-all ${mobile ? 'flex-shrink-0 flex-col px-4 py-2 text-xs' : 'w-full px-3 py-2.5 text-sm'}`}
      style={{ backgroundColor: view === n.id ? PRIMARY : 'transparent', color: view === n.id ? '#fff' : 'rgba(255,255,255,0.7)' }}>
      <span className={mobile ? 'text-lg' : 'text-base'}>{n.icon}</span><span>{n.label}</span>
    </button>
  )

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#141414' }}>
      <aside className="fixed left-0 top-0 hidden h-full w-60 flex-col border-r border-white/10 p-4 lg:flex" style={{ backgroundColor: '#1c1c1c' }}>
        <div className="mb-6 flex items-center gap-2 px-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: PRIMARY }}>
            <span className="text-xl font-black text-white">F</span>
          </div>
          <div className="leading-none">
            <p className="text-sm font-black" style={{ fontFamily: "'Roboto Slab', serif" }}>{site.name}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: PRIMARY }}>Administración</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1">{NAV.map(n => <NavBtn key={n.id} n={n} />)}</nav>
        <div className="mt-4 border-t border-white/10 pt-3">
          <div className="mb-2 flex items-center gap-2 px-1.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold" style={{ backgroundColor: PRIMARY }}>{session?.name?.[0] ?? 'A'}</span>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-xs font-bold text-white">{session?.name}</p>
              <p className="text-[10px] font-semibold text-white/40">Sesión activa</p>
            </div>
          </div>
          <button onClick={onExit} className="mb-1 w-full rounded-lg px-3 py-2 text-left text-xs text-white/60 hover:bg-white/5">🌐 Ver sitio</button>
          <button onClick={() => { if (confirm('¿Restablecer todo el contenido a los valores originales? Se perderán los cambios.')) resetAll() }} className="mb-1 w-full rounded-lg px-3 py-2 text-left text-xs text-white/60 hover:bg-white/5">↺ Restablecer contenido</button>
          <button onClick={salir} className="w-full rounded-lg px-3 py-2 text-left text-xs text-red-400 hover:bg-white/5">⎋ Cerrar sesión</button>
        </div>
      </aside>

      <div className="sticky top-0 z-30 border-b border-white/10 lg:hidden" style={{ backgroundColor: '#1c1c1c' }}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: PRIMARY }}><span className="text-base font-black text-white">F</span></div>
            <span className="text-sm font-black" style={{ fontFamily: "'Roboto Slab', serif" }}>{site.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onExit} className="text-xs text-white/60" title="Ver sitio">🌐</button>
            <button onClick={salir} className="text-xs text-red-400" title="Cerrar sesión">⎋</button>
          </div>
        </div>
        <div className="flex gap-1 overflow-x-auto px-2 pb-2">{NAV.map(n => <NavBtn key={n.id} n={n} mobile />)}</div>
      </div>

      <main className="p-4 sm:p-6 lg:ml-60 lg:p-8">
        {view === 'catalogo' && <Catalogo />}
        {view === 'pagina' && <Pagina />}
      </main>
    </div>
  )
}
