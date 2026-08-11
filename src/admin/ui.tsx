import type { ReactNode, InputHTMLAttributes, SelectHTMLAttributes } from 'react'
import { PRIMARY } from '../store'

export const money = (n: number) => 'US$ ' + (n || 0).toLocaleString('en-US')

export function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/10 p-5 ${className}`} style={{ backgroundColor: '#1c1c1c' }}>
      {children}
    </div>
  )
}

export function SectionTitle({ title, sub, right }: { title: string; sub?: string; right?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-black text-white sm:text-3xl" style={{ fontFamily: "'Roboto Slab', serif" }}>{title}</h1>
        {sub && <p className="mt-1 text-sm text-white/50">{sub}</p>}
      </div>
      {right}
    </div>
  )
}

export function Btn({ children, onClick, variant = 'primary', type = 'button', className = '', title }: {
  children: ReactNode; onClick?: () => void; variant?: 'primary' | 'ghost' | 'danger'; type?: 'button' | 'submit'; className?: string; title?: string
}) {
  const styles: Record<string, React.CSSProperties> = {
    primary: { backgroundColor: PRIMARY, color: '#fff' },
    danger: { backgroundColor: 'transparent', color: '#f87171', border: '1px solid rgba(248,113,113,0.5)' },
    ghost: { backgroundColor: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' },
  }
  return (
    <button type={type} onClick={onClick} title={title}
      className={`rounded-full px-4 py-2 text-sm font-bold transition-all hover:scale-[1.02] ${className}`}
      style={styles[variant]}>
      {children}
    </button>
  )
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/50">{label}</span>
      {children}
    </label>
  )
}

const inputBase = 'w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#DC2626]'
export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputBase} ${props.className || ''}`} />
}
export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${inputBase} cursor-pointer ${props.className || ''}`} style={{ colorScheme: 'dark' }} />
}
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputBase} ${props.className || ''}`} />
}

export function ImagePicker({ value, onChange, label = 'Imagen (URL o subir archivo)' }: { value: string; onChange: (v: string) => void; label?: string }) {
  const onFile = (file?: File) => {
    if (!file) return
    const r = new FileReader()
    r.onload = () => onChange(r.result as string)
    r.readAsDataURL(file)
  }
  return (
    <div className="flex items-center gap-4">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white">
        {value
          ? <img src={value} alt="" className="h-full w-full object-cover" />
          : <div className="flex h-full w-full items-center justify-center text-2xl">🖼️</div>}
      </div>
      <div className="flex-1">
        <Field label={label}>
          <Input value={value} onChange={e => onChange(e.target.value)} placeholder="https://… o sube un archivo" />
        </Field>
        <label className="mt-2 inline-block cursor-pointer text-xs font-bold" style={{ color: PRIMARY }}>
          Subir imagen ↑
          <input type="file" accept="image/*" className="hidden" onChange={e => onFile(e.target.files?.[0])} />
        </label>
      </div>
    </div>
  )
}

export function AdminModal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }} onClick={onClose}>
      <div className={`relative w-full ${wide ? 'max-w-2xl' : 'max-w-md'} max-h-[92vh] overflow-y-auto rounded-2xl border border-white/10 shadow-2xl`} style={{ backgroundColor: '#1c1c1c' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h3 className="text-lg font-black text-white" style={{ fontFamily: "'Roboto Slab', serif" }}>{title}</h3>
          <button onClick={onClose} className="text-2xl leading-none text-white/60 hover:text-white" aria-label="Cerrar">×</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

export function EmptyState({ icon = '📦', text }: { icon?: string; text: string }) {
  return (
    <div className="py-16 text-center">
      <div className="mb-3 text-5xl">{icon}</div>
      <p className="text-sm text-white/50">{text}</p>
    </div>
  )
}
