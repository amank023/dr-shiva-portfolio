import { useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { usePortfolioContent } from '../context/ContentContext'

export default function Experience({ onBook }) {
  const [active, setActive] = useState(0)
  const ref = useScrollReveal()
  const { content } = usePortfolioContent()

  const EXP = content?.experience || [
    { date:'August 2025 — February 2026', role:'Jr. Resident — ICCU', org:'Max Hospital', loc:'Lucknow', badge:'Intensive Critical Care Unit', points:['Advanced ICCU management in a multi-specialty tertiary care setup','Collaborated with senior consultants on complex critical care cases'] },
    { date:'October 2020 — July 2025', role:'Jr. Resident — Critical Care Unit (MICU)', org:'Regency Superspeciality Hospital', loc:'Lucknow', badge:'Medical Intensive Care Unit', points:['Managed ventilated patients in a 20-bed MICU independently','Key participant in three NABH accreditation audit processes','Trained junior staff on USG-guided bedside procedures'] },
    { date:'April 2018 — October 2020', role:'Jr. Resident — Critical Care Unit (MICU)', org:'Sahara Hospital', loc:'Lucknow', badge:'Medical Intensive Care Unit', points:['Foundation training in ICU protocols and emergency procedures','Routine management of multi-organ failure patients'] }
  ]

  const p = content?.profile || {}

  return (
    <section id="experience" className="py-20 px-[5%] bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto reveal" ref={ref}>
        <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-sky-500 font-semibold mb-2 before:content-[''] before:w-5 before:h-[1.5px] before:bg-sky-500">🏥 Career Timeline</p>
        <h2 className="font-display font-bold text-gray-900 dark:text-white mb-4" style={{fontSize:'clamp(1.9rem,3.5vw,2.75rem)'}}>Clinical <em className="text-sky-500 font-light italic">Experience</em></h2>
        <div className="w-10 h-0.5 bg-sky-500 rounded mb-12"/>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">
          <div>
            {EXP.map((e,i)=>(
              <div key={e.id || i} onClick={()=>setActive(i)} className={`relative pl-6 pb-7 border-l-2 cursor-pointer last:border-l-transparent transition-all duration-300 ${active===i?'border-sky-500':'border-sky-200 dark:border-sky-900'}`}>
                <div className={`absolute -left-[7px] top-0 w-3 h-3 rounded-full border-2 transition-all duration-300 ${active===i?'bg-sky-500 border-sky-500 shadow-md shadow-sky-400/50 scale-125':'bg-white dark:bg-gray-900 border-sky-300 dark:border-sky-700'}`}/>
                <div className="text-[9.5px] text-sky-500 uppercase tracking-[0.13em] font-semibold mb-2">📅 {e.date}</div>
                <div className={`bg-white dark:bg-white/5 border rounded-2xl p-5 transition-all duration-300 ${active===i?'border-sky-300 dark:border-sky-700 shadow-lg':'border-sky-100 dark:border-white/10'}`}>
                  <div className="text-gray-800 dark:text-gray-200 font-semibold text-[0.93rem] mb-1">{e.role}</div>
                  <div className="text-sky-500 text-[0.82rem] font-medium mb-2 flex items-center gap-1 flex-wrap">🏥 {e.org}<span className="text-gray-400 text-[0.75rem]">· {e.loc}</span></div>
                  <span className="inline-block px-2.5 py-0.5 rounded-lg bg-sky-50 dark:bg-sky-900/30 border border-sky-100 dark:border-sky-800 text-gray-400 text-[9px] uppercase tracking-wide">{e.badge}</span>
                  <div className={`overflow-hidden transition-all duration-400 ${active===i?'max-h-96 opacity-100 mt-3':'max-h-0 opacity-0'}`}>
                    <ul className="border-t border-sky-100 dark:border-white/10 pt-3 space-y-1.5">
                      {(e.points || []).map((pt,j)=><li key={j} className="flex gap-2 text-gray-500 dark:text-gray-400 text-[0.79rem] font-light"><span className="text-sky-500 flex-shrink-0">▸</span>{pt}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 lg:mt-0">
            <div className="sticky top-24 bg-white dark:bg-white/5 border border-sky-100 dark:border-white/10 rounded-2xl p-6 shadow-sm">
              <p className="text-[9.5px] uppercase tracking-[0.17em] text-sky-500 font-semibold mb-4">🩺 Professional Focus</p>
              {[
                ['Specialization', p.specialty || 'Critical Care Medicine'],
                ['Setting', 'Tertiary Care Hospitals'],
                ['Unit', 'MICU / ICCU'],
                ['Location', p.location || 'Lucknow, UP'],
                ['Reg. Number', p.regNo || '79855']
              ].map(([l,v])=>(
                <div key={l} className="border-b border-sky-50 dark:border-white/10 pb-3 mb-3 last:border-b-0 last:mb-0 last:pb-0">
                  <div className="text-[8.5px] text-gray-400 uppercase tracking-[0.15em] mb-0.5">{l}</div>
                  <div className="text-gray-800 dark:text-gray-200 text-[0.82rem] font-semibold">{v}</div>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-sky-50 dark:border-white/10">
                <div className="flex items-end gap-1.5">
                  <span className="font-display font-bold text-sky-500 text-[2.7rem] leading-none">
                    {p.stats?.[0]?.num || '7+'}
                  </span>
                  <span className="text-gray-400 text-sm mb-1.5">years</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
