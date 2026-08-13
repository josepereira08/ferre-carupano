import { useState } from 'react'
import { useData, PRIMARY } from '../store'
import { Field, Input } from './ui'

export function Login({ onExit }: { onExit: () => void }) {
  const { login, site } = useData()
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('ferre123')
  const [err, setErr] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!login(username, password)) setErr(true)
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4" style={{ background: 'radial-gradient(circle at 30% 20%, #2a2a2a, #111 70%)' }}>
      <div className="w-full max-w-sm rounded-2xl border border-white/10 shadow-2xl" style={{ backgroundColor: '#1c1c1c' }}>
        <div className="p-7">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: PRIMARY }}>
              <span className="text-2xl font-black text-white">F</span>
            </div>
            <h3 className="text-xl font-black text-white" style={{ fontFamily: "'Roboto Slab', serif" }}>{site.name} · Panel</h3>
            <p className="mt-1 text-xs text-white/50">Inicia sesión para gestionar la página</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <Field label="Usuario">
              <Input value={username} onChange={e => { setUsername(e.target.value); setErr(false) }} placeholder="admin" autoFocus autoComplete="off" />
            </Field>
            <Field label="Contraseña">
              <Input type="password" value={password} onChange={e => { setPassword(e.target.value); setErr(false) }} placeholder="••••••••" autoComplete="off" />
            </Field>
            {err && <p className="text-sm text-red-400">Usuario o contraseña incorrectos.</p>}
            <button type="submit" className="w-full rounded-full py-3 font-bold text-white transition-all hover:scale-[1.02]" style={{ backgroundColor: PRIMARY }}>
              Ingresar
            </button>
          </form>

          <div className="mt-5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-center text-xs text-white/50">
            Muestra visual · presiona <b className="text-white/80">Ingresar</b> (los campos son opcionales)
          </div>
          <button onClick={onExit} className="mt-4 w-full text-center text-xs text-white/40 hover:text-white/70">← Volver al sitio</button>
        </div>
      </div>
    </div>
  )
}
