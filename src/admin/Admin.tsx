import { useState } from 'react'
import { useData, PRIMARY } from '../store'
import { Btn, AdminModal } from './ui'
import { Catalogo } from './Catalogo'
import { Pagina } from './Pagina'
import { Dashboard } from './Dashboard'
import { POS } from './POS'
import { Inventario } from './Inventario'
import { Kardex } from './Kardex'
import { Ventas } from './Ventas'

type View = 'catalogo' | 'pagina' | 'dashboard' | 'pos' | 'inventario' | 'kardex' | 'ventas'

const NAV: { id: View; label: string; icon: string; basic?: boolean }[] = [
  { id: 'catalogo', label: 'Catálogo', icon: '🧰', basic: true },
  { id: 'pagina', label: 'Configuración Web', icon: '🖥️', basic: true },
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'pos', label: 'Punto de Venta', icon: '🛒' },
  { id: 'inventario', label: 'Inventario', icon: '📥' },
  { id: 'kardex', label: 'Kardex', icon: '🧾' },
  { id: 'ventas', label: 'Ventas', icon: '💵' },
]
const BASIC_IDS: View[] = ['catalogo', 'pagina']
const FONT = "'Roboto Slab', serif"

export function Admin({ onExit }: { onExit: () => void }) {
  const { session, logout, site, resetAll } = useData()
  const [avanzado, setAvanzado] = useState(() => localStorage.getItem('fh_avanzado') === '1')
  const [view, setView] = useState<View>('catalogo')
  const [modoModal, setModoModal] = useState(false)

  const items = NAV.filter(n => avanzado || n.basic)
  const salir = () => { logout(); onExit() }
  const setModo = (adv: boolean) => {
    setAvanzado(adv)
    localStorage.setItem('fh_avanzado', adv ? '1' : '0')
    if (!adv && !BASIC_IDS.includes(view)) setView('catalogo')
    setModoModal(false)
  }

  const NavBtn = ({ n, mobile }: { n: typeof NAV[number]; mobile?: boolean }) => (
    <button onClick={() => setView(n.id)}
      className={`flex items-center gap-3 rounded-xl font-semibold transition-all ${mobile ? 'flex-shrink-0 flex-col px-3 py-2 text-xs' : 'w-full px-3 py-2.5 text-sm'}`}
      style={{ backgroundColor: view === n.id ? PRIMARY : 'transparent', color: view === n.id ? '#fff' : 'rgba(255,255,255,0.7)' }}>
      <span className={mobile ? 'text-lg' : 'text-base'}>{n.icon}</span><span>{n.label}</span>
    </button>
  )

  const UserBtn = () => (
    <button onClick={() => setModoModal(true)} title="Configurar modo de administración"
      className="flex w-full items-center gap-2 rounded-lg px-1.5 py-1.5 text-left transition-colors hover:bg-white/5">
      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: PRIMARY }}>{session?.name?.[0] ?? 'A'}</span>
      <div className="min-w-0 flex-1 leading-tight">
        <p className="truncate text-xs font-bold text-white">{session?.name}</p>
        <p className="text-[10px] font-semibold" style={{ color: avanzado ? PRIMARY : 'rgba(255,255,255,0.4)' }}>{avanzado ? 'Modo avanzado ⚙' : 'Modo básico ⚙'}</p>
      </div>
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
            <p className="text-sm font-black" style={{ fontFamily: FONT }}>{site.name}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: PRIMARY }}>Administración</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1">{items.map(n => <NavBtn key={n.id} n={n} />)}</nav>
        <div className="mt-4 border-t border-white/10 pt-3">
          <div className="mb-2"><UserBtn /></div>
          <button onClick={onExit} className="mb-1 w-full rounded-lg px-3 py-2 text-left text-xs text-white/60 hover:bg-white/5">🌐 Ver sitio</button>
          <button onClick={() => { if (confirm('¿Restablecer todo el contenido a los valores originales? Se perderán los cambios.')) resetAll() }} className="mb-1 w-full rounded-lg px-3 py-2 text-left text-xs text-white/60 hover:bg-white/5">↺ Restablecer contenido</button>
          <button onClick={salir} className="w-full rounded-lg px-3 py-2 text-left text-xs text-red-400 hover:bg-white/5">⎋ Cerrar sesión</button>
        </div>
      </aside>

      <div className="sticky top-0 z-30 border-b border-white/10 lg:hidden" style={{ backgroundColor: '#1c1c1c' }}>
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => setModoModal(true)} className="flex items-center gap-2" title="Modo de administración">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: PRIMARY }}><span className="text-base font-black text-white">F</span></div>
            <span className="text-sm font-black" style={{ fontFamily: FONT }}>{site.name}</span>
            <span className="text-[10px] font-bold" style={{ color: avanzado ? PRIMARY : 'rgba(255,255,255,0.4)' }}>{avanzado ? '· Avanzado' : '· Básico'}</span>
          </button>
          <div className="flex items-center gap-3">
            <button onClick={onExit} className="text-xs text-white/60" title="Ver sitio">🌐</button>
            <button onClick={salir} className="text-xs text-red-400" title="Cerrar sesión">⎋</button>
          </div>
        </div>
        <div className="flex gap-1 overflow-x-auto px-2 pb-2">{items.map(n => <NavBtn key={n.id} n={n} mobile />)}</div>
      </div>

      <main className="p-4 sm:p-6 lg:ml-60 lg:p-8">
        {view === 'catalogo' && <Catalogo />}
        {view === 'pagina' && <Pagina />}
        {view === 'dashboard' && <Dashboard go={v => setView(v as View)} />}
        {view === 'pos' && <POS />}
        {view === 'inventario' && <Inventario />}
        {view === 'kardex' && <Kardex />}
        {view === 'ventas' && <Ventas />}
      </main>

      {modoModal && (
        <AdminModal title="Modo de administración" onClose={() => setModoModal(false)}>
          {avanzado ? (
            <>
              <p className="mb-2 text-sm text-white/70">Actualmente el <b style={{ color: PRIMARY }}>modo avanzado</b> está activo (Dashboard, Punto de Venta, Inventario, Kardex y Ventas).</p>
              <p className="mb-5 text-sm text-white/70">¿Deseas volver al <b className="text-white">modo básico</b> (solo el contenido de la web)?</p>
              <div className="flex gap-3">
                <Btn variant="ghost" onClick={() => setModoModal(false)} className="flex-1">Cancelar</Btn>
                <Btn onClick={() => setModo(false)} className="flex-1">Volver a básico</Btn>
              </div>
            </>
          ) : (
            <>
              <p className="mb-2 text-sm text-white/70">Estás en <b className="text-white">modo básico</b>, para administrar el contenido de la web.</p>
              <p className="mb-5 text-sm text-white/70">¿Activar el <b style={{ color: PRIMARY }}>modo avanzado</b>? Se mostrará el sistema completo: Dashboard, Punto de Venta, Inventario, Kardex y Ventas.</p>
              <div className="flex gap-3">
                <Btn variant="ghost" onClick={() => setModoModal(false)} className="flex-1">Cancelar</Btn>
                <Btn onClick={() => setModo(true)} className="flex-1">Activar avanzado</Btn>
              </div>
            </>
          )}
        </AdminModal>
      )}
    </div>
  )
}
