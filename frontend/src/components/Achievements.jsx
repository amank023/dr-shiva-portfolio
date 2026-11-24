import { useScrollReveal } from '../hooks/useScrollReveal'
import { usePortfolioContent } from '../context/ContentContext'

const DEFAULT_ACH = [
  {
    icon: '🏅',
    cat: 'Accreditation & Quality',
    year: '2020–25',
    title: 'NABH Accreditation — 3× Contributor',
    desc: 'Core team member across three comprehensive NABH audit cycles, championing ICU infection control protocols, critical care documentation accuracy, and emergency clinical pathways.',
    impact: 'Institutional Quality & Compliance',
    badge: 'Audit Verified'
  },
  {
    icon: '📚',
    cat: 'Clinical Governance',
    year: '2023',
    title: 'Emergency Medicine & NABH Protocol Training',
    desc: 'Specialized intensive clinical governance training at Regency Hospital Kanpur under Dr. Pawan Kapoor & Dr. Atul Mohan Kochhar, aligning clinical procedures with national patient safety standards.',
    impact: 'Advanced Practice Protocols',
    badge: 'Certified Training'
  }
]

export default function Achievements() {
  const ref = useScrollReveal()
  const { content } = usePortfolioContent()
  const achList = content?.achievements || DEFAULT_ACH

  return (
    <section id="achievements" className="py-20 px-[5%] bg-white dark:bg-gray-900 transition-colors duration-300 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-sky-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto reveal text-center" ref={ref}>
        {/* Section Header */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100/80 dark:bg-sky-950/70 border border-sky-200/80 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-[10px] uppercase tracking-[0.2em] font-semibold mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
          🏆 Institutional Honors &amp; Quality Audits
        </div>
        <h2 className="font-display font-bold text-gray-900 dark:text-white mb-3" style={{ fontSize: 'clamp(1.9rem,3.5vw,2.75rem)' }}>
          Accreditations &amp; <em className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-teal-500 to-sky-700 dark:from-sky-400 dark:via-teal-300 dark:to-cyan-400 font-light italic">Clinical Impact</em>
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm max-w-xl mx-auto font-light mb-4">
          Recognized for institutional excellence, multi-cycle hospital quality compliance, and ongoing medical leadership.
        </p>
        <div className="w-12 h-1 bg-gradient-to-r from-sky-500 to-teal-400 rounded-full mx-auto mb-12" />

        {/* Achievement Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
          {achList.map((a, idx) => (
            <div
              key={a.id || a.title || idx}
              className="medical-card p-7 group hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
            >
              {/* Top Accent Ribbon */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-teal-400 to-sky-600" />

              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-400 text-white shadow-lg shadow-sky-500/20 flex items-center justify-center text-2xl p-3">
                    {a.icon || '🏅'}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="px-2.5 py-0.5 rounded-full bg-teal-100/80 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-[9px] font-bold uppercase tracking-wider mb-1">
                      {a.badge || 'Verified'}
                    </span>
                    <span className="font-display font-bold text-sky-600 dark:text-sky-400 text-lg">
                      {a.year}
                    </span>
                  </div>
                </div>

                <div className="text-[9.5px] text-sky-600 dark:text-sky-400 uppercase tracking-[0.18em] font-semibold mb-1">
                  {a.cat}
                </div>
                <h3 className="text-gray-800 dark:text-gray-100 font-display font-bold text-lg leading-snug mb-3 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  {a.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-[0.8rem] leading-relaxed font-light mb-6">
                  {a.desc}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-sky-100/80 dark:border-white/10 text-xs">
                <span className="text-[9px] text-gray-400 uppercase tracking-[0.14em]">Impact Level</span>
                <span className="text-teal-600 dark:text-teal-400 font-semibold text-[11px] flex items-center gap-1">
                  <span>✓</span> {a.impact}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
