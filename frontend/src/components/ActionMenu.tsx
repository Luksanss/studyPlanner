import { useRef, type ReactNode } from 'react'
import { MoreHorizontal } from 'lucide-react'
export default function ActionMenu({ label, children }: { label: string; children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null)
  return <details ref={ref} className="action-menu" onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) e.currentTarget.open = false }} onKeyDown={e => { if (e.key === 'Escape') { e.currentTarget.open = false; e.currentTarget.querySelector('summary')?.focus() } }}>
    <summary className="icon-button" aria-label={label} title={label}><MoreHorizontal size={21} /></summary>
    <div className="action-menu-items" onClick={e => { if ((e.target as HTMLElement).closest('button') && ref.current) ref.current.open = false }}>{children}</div>
  </details>
}
