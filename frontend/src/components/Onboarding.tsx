import { useState, type FormEvent } from 'react'
import { ArrowRight, GraduationCap } from 'lucide-react'
import type { StudyState } from '../lib/model'
import ImportDialog from './ImportDialog'

export default function Onboarding({ state, error, onName, onComplete }: {
  state: StudyState
  error: string
  onName: (name: string) => boolean
  onComplete: (state: StudyState) => void
}) {
  const [step, setStep] = useState<1 | 2>(1)
  const [name, setName] = useState(state.settings.name === 'Moje studium' ? '' : state.settings.name)
  const [restore, setRestore] = useState(false)
  function next(event: FormEvent) {
    event.preventDefault()
    if (name.trim() && onName(name.trim())) setStep(2)
  }
  function complete(imported: StudyState) {
    if (!imported.enrollments.length) throw new Error('Nejprve nahraj výpis studijních výsledků nebo zálohu, která výsledky obsahuje.')
    onComplete({ ...imported, settings: { ...imported.settings, name: name.trim() } })
  }
  return <main className="onboarding">
    <div className="onboarding-brand"><span className="brand-icon"><GraduationCap size={25} /></span><strong>Semester</strong></div>
    <div className="onboarding-heading"><p className="small">Krok {step} ze 2 · {step === 1 ? 'Tvoje jméno' : 'Studijní výsledky'}</p><h1>{step === 1 ? 'Jak ti máme říkat?' : `${name.trim()}, načteme tvoje studium.`}</h1><p>{step === 1 ? 'Nejdřív se představ, pak přidej výpis z KOSu.' : 'Po importu se otevře tvůj přehled a plán semestrů.'}</p></div>
    {error && <p className="error-message" role="alert">{error}</p>}
    {step === 1 ? <form className="surface onboarding-name" onSubmit={next}>
      <div className="field"><label htmlFor="onboarding-name">Tvoje jméno</label><input id="onboarding-name" name="given-name" autoComplete="given-name" autoFocus required maxLength={60} placeholder="Např. Lukáš" value={name} onChange={e => setName(e.target.value)} /></div>
      <button className="button primary" disabled={!name.trim()}>Pokračovat <ArrowRight size={16} /></button>
    </form> : <><ImportDialog key={restore ? 'backup' : 'pdf'} state={state} embedded pdfOnly={!restore} onClose={() => setStep(1)} onApply={complete} />
      <button className="button ghost onboarding-restore" onClick={() => setRestore(!restore)}>{restore ? 'Zpět k PDF výpisu' : 'Už mám zálohu ze Semesteru'}</button></>}
  </main>
}
