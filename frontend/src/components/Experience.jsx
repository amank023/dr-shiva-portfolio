import { useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { usePortfolioContent } from '../context/ContentContext'
import { Building2, MapPin, CheckCircle, ChevronDown, Award, ShieldCheck } from 'lucide-react'

export default function Experience({ onBook }) {
  const [active, setActive] = useState(0)
  const ref = useScrollReveal()
  const { content } = usePortfolioContent()

  const EXP = content?.experience || [
    {
      date: 'August 2025 — February 2026',
      role: 'Jr. Resident — ICCU',
      org: 'Max Hospital',
      loc: 'Lucknow',
      badge: 'Intensive Critical Care Unit',
      points: [
        'Advanced ICCU management in a multi-specialty tertiary care setup',
        'Collaborated with senior consultants on complex critical care cases',
        'Led bed-side hemodynamic monitoring and arterial catheterizations'
      ]
    },
    {
      date: 'October 2020 — July 2025',
      role: 'Jr. Resident — Critical Care Unit (MICU)',
      org: 'Regency Superspeciality Hospital',
      loc: 'Lucknow',
      badge: 'Medical Intensive Care Unit',
      points: [
        'Managed ventilated patients in a 20-bed MICU independently',
        'Key participant in three NABH accreditation audit processes',
        'Trained junior staff on USG-guided bedside procedures'
      ]
    },
    {
      date: 'April 2018 — October 2020',
      role: 'Jr. Resident — Critical Care Unit (MICU)',
      org: 'Sahara Hospital',
      loc: 'Lucknow',
      badge: 'Medical Intensive Care Unit',
      points: [
        'Foundation training in ICU protocols and emergency procedures',
        'Routine management of multi-organ failure patients',
        'Formulated enteral & parenteral nutrition regimens'
      ]
    }
  ]

  const p = content?.profile || {}

  return (
    <section id="experience" className="py-24 px-[5%] bg-white dark:bg-gray-900 transition-colors duration-300 relative">
      <div className="max-w-6xl mx-auto reveal" ref={ref}>
        {/* Section Header */}
        <div className="text-left mb-12">
          <p className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-sky-500 font-bold mb-2 before:content-[''] before:w-5 before:h-[1.5px] before:bg-sky-500">
            🏥 Career Timeline
          </p>
          <h2 className="font-display font-bold text-gray-900 dark:text-white" style={{ fontSize: 'clamp(2rem, 3.6vw, 2.85rem)' }}>
            Clinical <em className="text-sky-500 font-light italic">Residency & Experience</em>
          </h2>
          <div className="w-12 h-0.5 bg-gradient-to-r from-sky-500 to-teal-400 rounded-full mt-3" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-10">
          {/* Timeline Cards Column */}
          <div className="space-y-6">
            {EXP.map((e, i) => {
              const isSelected = active === i
              return (
                <div
                  key={e.id || i}
                  onClick={() => setActive(i)}
                  className={`relative pl-7 pb-6 border-l-2 cursor-pointer last:border-l-transparent transition-all duration-300 ${
                    isSelected ? 'border-sky-500' : 'border-sky-200 dark:border-sky-900'
                  }`}
                >
                  {/* Timeline Glowing Node */}
                  <div
                    className={`absolute -left-[8px] top-1 w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                      isSelected
                        ? 'bg-sky-500 border-white dark:border-gray-900 shadow-md shadow-sky-400/60 scale-125'
                        : 'bg-white dark:bg-gray-900 border-sky-300 dark:border-sky-700'
                    }`}
                  >
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] text-sky-600 dark:text-sky-400 uppercase tracking-widest font-bold">
                      📅 {e.date}
                    </span>
                    {i === 0 && (
                      <span className="px-2 py-0.2 rounded-full text-[8.5px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/40">
                        Most Recent
                      </span>
                    )}
                  </div>

                  {/* Card Content */}
                  <div
                    className={`medical-card rounded-2xl p-5.5 transition-all duration-300 ${
                      isSelected ? 'border-sky-400 dark:border-sky-600 shadow-xl shadow-sky-500/10' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <div className="text-gray-900 dark:text-gray-100 font-semibold text-[0.96rem]">
                        {e.role}
                      </div>
                      <ChevronDown
                        size={17}
                        className={`text-gray-400 transition-transform duration-300 ${isSelected ? 'rotate-180 text-sky-500' : ''}`}
                      />
                    </div>

                    <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 text-[0.83rem] font-medium mb-3 flex-wrap">
                      <Building2 size={13} />
                      <span className="font-semibold">{e.org}</span>
                      <span className="text-gray-400 text-[0.76rem] flex items-center gap-0.5">
                        <MapPin size={11} /> {e.loc}
                      </span>
                    </div>

                    <span className="inline-block px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/50 border border-sky-100 dark:border-sky-900/60 text-sky-700 dark:text-sky-300 text-[9.5px] font-semibold uppercase tracking-wider mb-2">
                      {e.badge}
                    </span>

                    {/* Expandable Case Points */}
                    <div
                      className={`overflow-hidden transition-all duration-400 ${
                        isSelected ? 'max-h-96 opacity-100 mt-3 pt-3 border-t border-sky-100 dark:border-white/10' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <ul className="space-y-2">
                        {(e.points || []).map((pt, j) => (
                          <li key={j} className="flex items-start gap-2 text-gray-600 dark:text-gray-300 text-[0.81rem] font-light">
                            <span className="text-sky-500 font-bold mt-0.5">▸</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right Column: Physician Credentials Dossier */}
          <div className="mt-8 lg:mt-0">
            <div className="sticky top-28 medical-card rounded-2xl p-6 shadow-md border-t-4 border-t-sky-500">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-sky-100 dark:border-white/10">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-sky-500 font-bold">Physician Dossier</p>
                  <h3 className="font-display font-bold text-gray-900 dark:text-white text-base">Professional Focus</h3>
                </div>
                <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-900/40 text-sky-500 flex items-center justify-center">
                  🩺
                </div>
              </div>

              {[
                ['Specialization', p.specialty || 'Critical Care Medicine'],
                ['Clinical Setting', 'Tertiary Care Hospitals'],
                ['Units Managed', 'MICU / ICCU (20+ Beds)'],
                ['Practice Location', p.location || 'Lucknow, Uttar Pradesh'],
                ['Medical Registration', p.regNo ? `U.P. Council #${p.regNo}` : 'U.P. Council #79855'],
                ['Accreditations', 'NABH Quality Processes (3×)']
              ].map(([l, v]) => (
                <div key={l} className="border-b border-sky-50 dark:border-white/5 pb-2.5 mb-2.5 last:border-b-0 last:mb-0 last:pb-0">
                  <div className="text-[9px] text-gray-400 uppercase tracking-[0.16em] font-semibold">{l}</div>
                  <div className="text-gray-800 dark:text-gray-200 text-[0.84rem] font-semibold mt-0.5">{v}</div>
                </div>
              ))}

              <div className="mt-5 pt-4 border-t border-sky-100 dark:border-white/10 flex items-center justify-between">
                <div>
                  <div className="font-display font-bold text-sky-500 text-3xl leading-none">
                    {p.stats?.[0]?.num || '7+'}
                  </div>
                  <div className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold mt-0.5">Years Experience</div>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-300/40">
                  <ShieldCheck size={13} /> Verified Doctor
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
