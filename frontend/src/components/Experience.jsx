import { useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { usePortfolioContent } from '../context/ContentContext'
import { Building2, MapPin, ChevronDown, ShieldCheck } from 'lucide-react'

export default function Experience({ onBook }) {
  const [active, setActive] = useState(0)
  const ref = useScrollReveal()
  const { content } = usePortfolioContent()

  const toggleCard = (index) => {
    setActive((prev) => (prev === index ? -1 : index))
  }

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
    <section id="experience" className="py-20 sm:py-24 px-[5%] bg-white dark:bg-gray-900 transition-colors duration-300 relative overflow-hidden">
      {/* Background medical glow */}
      <div className="absolute top-1/3 -right-32 w-80 h-80 bg-sky-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto reveal" ref={ref}>
        {/* Section Header */}
        <div className="text-left mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100/80 dark:bg-sky-950/70 border border-sky-200/80 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-[10px] uppercase tracking-[0.2em] font-semibold mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
            🏥 Career Timeline
          </div>
          <h2 className="font-display font-bold text-gray-900 dark:text-white" style={{ fontSize: 'clamp(1.85rem, 3.6vw, 2.85rem)' }}>
            Clinical <em className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-teal-500 to-sky-700 dark:from-sky-400 dark:via-teal-300 dark:to-cyan-400 font-light italic">Residency &amp; Experience</em>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-1 max-w-xl font-light">
            Progressive clinical leadership across premier tertiary critical care departments. Click any position to view case highlights.
          </p>
          <div className="w-12 h-1 bg-gradient-to-r from-sky-500 to-teal-400 rounded-full mt-3" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 sm:gap-10 items-start">
          {/* Timeline Cards Column */}
          <div className="space-y-6">
            {EXP.map((e, i) => {
              const isSelected = active === i
              return (
                <div
                  key={e.id || i}
                  className={`relative pl-6 sm:pl-7 pb-6 border-l-2 last:border-l-transparent transition-all duration-300 ${
                    isSelected ? 'border-sky-500' : 'border-sky-200 dark:border-sky-900'
                  }`}
                >
                  {/* Timeline Glowing Node */}
                  <div
                    onClick={() => toggleCard(i)}
                    className={`absolute -left-[8px] top-1.5 w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 flex items-center justify-center cursor-pointer ${
                      isSelected
                        ? 'bg-sky-500 border-white dark:border-gray-900 shadow-md shadow-sky-400/60 scale-125'
                        : 'bg-white dark:bg-gray-900 border-sky-300 dark:border-sky-700 hover:border-sky-500'
                    }`}
                    title={isSelected ? 'Click to collapse' : 'Click to expand'}
                  >
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>

                  {/* Date badge */}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-[10px] text-sky-600 dark:text-sky-400 uppercase tracking-widest font-bold">
                      📅 {e.date}
                    </span>
                    {i === 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[8.5px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/40">
                        Most Recent
                      </span>
                    )}
                  </div>

                  {/* Card Content with Toggle Header */}
                  <div
                    className={`medical-card rounded-2xl p-5 sm:p-6 transition-all duration-300 relative overflow-hidden ${
                      isSelected
                        ? 'border-sky-400 dark:border-sky-600 shadow-xl shadow-sky-500/10 ring-1 ring-sky-400/20'
                        : 'hover:border-sky-300 dark:hover:border-sky-700'
                    }`}
                  >
                    {/* Clickable Header for Collapsing/Expanding */}
                    <div
                      onClick={() => toggleCard(i)}
                      className="flex items-start justify-between gap-3 cursor-pointer select-none group/hdr"
                      title={isSelected ? 'Click to collapse case notes' : 'Click to expand case notes'}
                    >
                      <div>
                        <h3 className="text-gray-900 dark:text-gray-100 font-bold text-[0.98rem] group-hover/hdr:text-sky-600 dark:group-hover/hdr:text-sky-400 transition-colors">
                          {e.role}
                        </h3>
                        <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 text-[0.83rem] font-medium mt-1 flex-wrap">
                          <Building2 size={13} />
                          <span className="font-semibold">{e.org}</span>
                          <span className="text-gray-400 text-[0.76rem] flex items-center gap-0.5">
                            <MapPin size={11} /> {e.loc}
                          </span>
                        </div>
                      </div>

                      {/* Interactive Arrow Collapse Button */}
                      <button
                        type="button"
                        onClick={(ev) => {
                          ev.stopPropagation()
                          toggleCard(i)
                        }}
                        aria-expanded={isSelected}
                        aria-label={isSelected ? 'Collapse clinical details' : 'Expand clinical details'}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all flex-shrink-0 cursor-pointer ${
                          isSelected
                            ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                            : 'bg-sky-50 dark:bg-white/5 text-gray-400 hover:text-sky-500 hover:bg-sky-100 dark:hover:bg-white/10'
                        }`}
                      >
                        <ChevronDown
                          size={18}
                          className={`transition-transform duration-300 ${isSelected ? 'rotate-180' : 'rotate-0'}`}
                        />
                      </button>
                    </div>

                    <div className="mt-3">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/50 border border-sky-100 dark:border-sky-900/60 text-sky-700 dark:text-sky-300 text-[9.5px] font-semibold uppercase tracking-wider">
                        {e.badge}
                      </span>
                    </div>

                    {/* Expandable / Collapsible Case Points */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        isSelected
                          ? 'max-h-96 opacity-100 mt-4 pt-4 border-t border-sky-100 dark:border-white/10'
                          : 'max-h-0 opacity-0 mt-0 pt-0 pointer-events-none'
                      }`}
                    >
                      <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-2 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                        Clinical Responsibilities &amp; Case Notes
                      </div>
                      <ul className="space-y-2.5">
                        {(e.points || []).map((pt, j) => (
                          <li key={j} className="flex items-start gap-2.5 text-gray-600 dark:text-gray-300 text-[0.82rem] font-light leading-relaxed">
                            <span className="text-sky-500 font-bold mt-0.5 text-xs">▸</span>
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
          <div className="mt-6 lg:mt-0">
            <div className="sticky top-28 medical-card rounded-2xl p-6 sm:p-7 shadow-md relative overflow-hidden">
              {/* Top Accent Ribbon */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-teal-400 to-sky-600" />

              <div className="flex items-center justify-between mb-5 pb-3 border-b border-sky-100 dark:border-white/10 pt-1">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-sky-500 font-bold">Physician Dossier</p>
                  <h3 className="font-display font-bold text-gray-900 dark:text-white text-base">Professional Focus</h3>
                </div>
                <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-900/40 border border-sky-100 dark:border-sky-800 text-sky-500 flex items-center justify-center text-lg shadow-xs">
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
                  <div className="text-[9.5px] text-gray-400 uppercase tracking-[0.16em] font-semibold">{l}</div>
                  <div className="text-gray-800 dark:text-gray-200 text-[0.84rem] font-semibold mt-0.5 leading-snug">{v}</div>
                </div>
              ))}

              <div className="mt-5 pt-4 border-t border-sky-100 dark:border-white/10 flex items-center justify-between gap-2">
                <div>
                  <div className="font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-teal-600 dark:from-sky-400 dark:to-teal-300 text-3xl leading-none">
                    {p.stats?.[0]?.num || '7+'}
                  </div>
                  <div className="text-[9.5px] text-gray-400 uppercase tracking-wider font-semibold mt-1">Years Experience</div>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-300/40 shadow-xs">
                  <ShieldCheck size={14} /> Verified Doctor
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
