import { useScrollReveal } from '../hooks/useScrollReveal'
import { usePortfolioContent } from '../context/ContentContext'

const DEFAULT_EDU = [
  {
    year: '2018',
    icon: '🎓',
    deg: 'Bachelor of Medicine & Bachelor of Surgery',
    sf: 'MBBS',
    inst: 'Career Institute of Medical Sciences & Hospital (CIMS)',
    uni: 'Lucknow, Uttar Pradesh',
    reg: 'MCI / NMC Recognized',
    badges: ['Internal Medicine', 'General Surgery', 'Obstetrics & Gynaecology', 'Paediatrics', 'Emergency Medicine']
  },
  {
    year: '2010',
    icon: '🫁',
    deg: 'Bachelor of Science — Critical Care Medicine',
    sf: 'B.Sc. CCM',
    inst: 'Chhatrapati Shahu Ji Maharaj (CSJM) University',
    uni: 'Prayagraj / Kanpur',
    reg: 'Critical Care Specialization',
    badges: ['Haemodynamic Monitoring', 'Invasive Ventilation', 'Infection Control', 'Advanced Resuscitation']
  },
  {
    year: '2007',
    icon: '🔬',
    deg: 'Senior Secondary Education (Class XII)',
    sf: 'Pre-Med',
    inst: 'YMCA Centenary School & College',
    uni: 'C.B.S.E., Prayagraj',
    reg: 'Medical Science Track',
    badges: ['Biology', 'Chemistry', 'Physics', 'English Core']
  }
]

export default function Education() {
  const ref = useScrollReveal()
  const { content } = usePortfolioContent()
  const eduList = content?.education || DEFAULT_EDU

  return (
    <section id="education" className="py-20 px-[5%] bg-white dark:bg-gray-900 transition-colors duration-300 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 -right-32 w-80 h-80 bg-teal-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto reveal" ref={ref}>
        {/* Section Header */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100/80 dark:bg-sky-950/70 border border-sky-200/80 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-[10px] uppercase tracking-[0.2em] font-semibold mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
          🎓 Verified Medical Degrees &amp; Credentials
        </div>
        <h2 className="font-display font-bold text-gray-900 dark:text-white mb-3" style={{ fontSize: 'clamp(1.9rem,3.5vw,2.75rem)' }}>
          Education &amp; <em className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-teal-500 to-sky-700 dark:from-sky-400 dark:via-teal-300 dark:to-cyan-400 font-light italic">Qualifications</em>
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm max-w-xl font-light mb-4">
          Rigorous clinical foundation combining full medical degree certification with specialized intensive critical care credentials.
        </p>
        <div className="w-12 h-1 bg-gradient-to-r from-sky-500 to-teal-400 rounded-full mb-10" />

        {/* Education Timeline Grid */}
        <div className="flex flex-col gap-4 max-w-4xl">
          {eduList.map((e, idx) => (
            <div
              key={e.id || e.year || idx}
              className="medical-card p-5 sm:p-6 group hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-500/10 transition-all duration-300 flex flex-col sm:flex-row items-start gap-4 sm:gap-5"
            >
              {/* Year & Icon Badge */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-sky-100 to-teal-50 dark:from-sky-950/50 dark:to-teal-950/50 border border-sky-200/70 dark:border-sky-800/70 flex flex-col items-center justify-center flex-shrink-0 shadow-xs">
                <span className="text-lg">{e.icon || '🎓'}</span>
                <span className="text-[11px] font-bold text-sky-700 dark:text-sky-300">{e.year}</span>
              </div>

              {/* Details */}
              <div className="flex-1 w-full">
                <div className="flex flex-wrap justify-between items-start gap-2 mb-1.5">
                  <div>
                    <h3 className="text-gray-800 dark:text-gray-100 font-bold text-[0.98rem] group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {e.deg}
                    </h3>
                    <div className="flex flex-wrap items-center gap-1.5 text-xs mt-0.5">
                      <span className="text-sky-600 dark:text-sky-400 font-medium">{e.inst}</span>
                      <span className="text-gray-400">· {e.uni}</span>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-sky-500/10 to-teal-500/10 border border-sky-300/40 dark:border-sky-700/50 text-sky-700 dark:text-sky-300 text-[11px] font-bold tracking-wide">
                    {e.sf}
                  </span>
                </div>

                {/* Rotations / Modules */}
                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-sky-100/80 dark:border-white/10">
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 font-medium self-center mr-1">
                    Core Focus:
                  </span>
                  {(e.badges || []).map(b => (
                    <span
                      key={b}
                      className="px-2.5 py-0.5 rounded-lg bg-sky-50/80 dark:bg-white/5 border border-sky-200/40 dark:border-white/10 text-gray-600 dark:text-gray-300 text-[10px] tracking-wide"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Board Certification Callout */}
        <div className="mt-8 max-w-4xl p-4 rounded-2xl bg-gradient-to-r from-sky-500/5 via-teal-500/5 to-transparent border border-sky-200/60 dark:border-sky-800/60 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏛️</span>
            <div>
              <p className="text-gray-800 dark:text-gray-200 font-semibold text-xs sm:text-sm">
                Uttar Pradesh Medical Council Verified
              </p>
              <p className="text-gray-400 text-[11px] font-light">
                Registration No. 79855 · Registered Medical Practitioner (RMP) under National Medical Commission guidelines.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 px-3 py-1 rounded-full uppercase tracking-wider">
            ✓ Active License
          </span>
        </div>
      </div>
    </section>
  )
}
