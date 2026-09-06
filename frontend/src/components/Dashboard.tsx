import { ArrowRight, Check, ChevronDown, GraduationCap, RotateCcw, ArrowUpRight, Info } from 'lucide-react'
import { completedCodes, earnedCredits, plannedCredits, plannedCourses, repeatingCodes, groupProgress, SEMESTERS, PLAN_URL, type StudyState } from '../lib/model'
export const num = (n: number | null, digits = 0) => n === null ? '—' : new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: digits }).format(n)
export default function Dashboard({ state: s, onPlan, onCourse, onImport }: { state: StudyState; onPlan: () => void; onCourse: (c: string) => void; onImport: () => void }) {
  const earned = earnedCredits(s), planned = plannedCredits(s), remaining = Math.max(0, s.settings.targetCredits - earned)
  const repeats = repeatingCodes(s), done = completedCodes(s)
  const percent = Math.min(100, Math.round(earned / s.settings.targetCredits * 100))
  if (!s.enrollments.length) return <div className="empty-welcome"><div className="welcome-symbol"><GraduationCap size={36} /></div><h2>Tvoje studium začíná tady.</h2><p>Načti výpis z KOSu a pokračuj plánem dalších semestrů.</p><button className="button primary" onClick={onImport}>Importovat studijní výsledky</button><p className="small">Výpis se zpracuje pouze v tomto prohlížeči.</p></div>
  return <>
    <section className="surface study-summary">
      <div className="study-summary-top"><div><span className="muted">Cesta k bakaláři</span><h2>{earned}<small> / {s.settings.targetCredits} kreditů</small></h2></div><button className="button primary" onClick={onPlan}>Plánovat semestry <ArrowRight size={16} /></button></div>
      <div className="overall-track" role="progressbar" aria-label="Získané kredity" aria-valuemin={0} aria-valuemax={s.settings.targetCredits} aria-valuenow={Math.min(earned,s.settings.targetCredits)}><span style={{ width: `${percent}%` }} /></div>
      <div className="track-caption"><span>Zbývá {remaining} kreditů</span><span>Cíl: léto 2028</span></div>
    </section>
    <section className="surface upcoming simple-upcoming"><div className="section-title"><h2>Příští čtyři semestry</h2><span className="small muted">{s.settings.workHours} h týdně pro práci</span></div>{SEMESTERS.map(sem => {
      const cs = plannedCourses(s, sem.id)
      return <button className="semester-summary" key={sem.id} onClick={onPlan}><span className={`semester-number ${sem.id === 'B261' ? 'current' : ''}`}>{sem.index}</span><span>{sem.name}{sem.id === 'B272' && <small>Bakalářka a státnice</small>}</span><strong>{cs.reduce((n,c) => n+c.credits,0)}<small> kr.</small></strong><ArrowRight size={15} /></button>
    })}</section>
    <details className="surface disclosure"><summary><span>K opakování <span className="count">{repeats.size}</span></span><ChevronDown size={18} /></summary><div className="disclosure-body">{s.courses.filter(c => repeats.has(c.code)).map(c => <button key={c.code} className="repeat-row" onClick={() => onCourse(c.code)}><RotateCcw size={15} /><span>{c.name}<small>{c.code}</small></span><span className="small">{c.credits} kr.</span></button>)}{!repeats.size && <p className="small">Žádné nesplněné pokusy.</p>}</div></details>
    <details className="surface disclosure"><summary><span>Statistiky a podmínky studia</span><ChevronDown size={18} /></summary><div className="disclosure-body">
      <dl className="study-stats"><div><dt>Splněné předměty</dt><dd>{done.size}</dd></div><div><dt>Vážený průměr</dt><dd>{num(s.official.weightedAverage,2)}</dd></div><div><dt>Průměr</dt><dd>{num(s.official.average,2)}</dd></div><div><dt>Kredity v plánu</dt><dd>{planned}</dd></div></dl>
      <div className="section-title"><h2>Podmínky studijního plánu</h2><a href={PLAN_URL} target="_blank" rel="noreferrer" className="small">BIO 2018 <ArrowUpRight size={14} /></a></div>
      {groupProgress(s).map(g => {
        const met = g.earned >= g.credits && g.passedCount >= g.count
        const full = g.earned + g.planned >= g.credits && g.passedCount + g.plannedCount >= g.count
        return <div className="requirement" key={g.id}><div className={`requirement-icon ${met ? 'is-met' : ''}`}>{met ? <Check size={14} /> : <span />}</div><div className="requirement-body"><div className="requirement-top"><span>{g.name}</span><strong>{g.credits ? `${g.earned} / ${g.credits} kr.` : `${g.passedCount} / ${g.count} předměty`}</strong></div><div className="mini-track"><span style={{ width: `${Math.min(100,(g.credits ? g.earned/g.credits : g.passedCount/g.count)*100)}%` }} /></div><small>{met ? 'Splněno' : full ? 'Budoucí plán pokrývá minimum' : `${g.passedCount} z min. ${g.count} předmětů · ${g.planned ? `dalších ${g.planned} kr. v plánu` : 'doplnit do plánu'}`}</small></div></div>
      })}
      {!s.settings.confirmedProgramme && <p className="inline-note"><Info size={14} />Předloha BIO 2018. Přiřazení ke svému studiu ověř v KOSu a potvrď v nastavení.</p>}
      <p className="page-footer">Kontrola zahrnuje minima skupin. Započitatelnost a maxima volitelných kreditů ověř podle plánu. Poslední import: {s.official.importedAt ? new Date(s.official.importedAt).toLocaleDateString('cs-CZ') : '—'}.</p>
    </div></details>
  </>
}
