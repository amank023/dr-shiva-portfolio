import { useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { usePortfolioContent } from '../context/ContentContext'

const DEFAULT_SKILLS = [
  { icon:'🫁', cat:'Procedures', title:'Mechanical Ventilation', desc:'Invasive & non-invasive ventilator support, weaning protocols, and lung-protective strategies.', prof:95 },
  { icon:'❤️', cat:'Emergency', title:'Advanced Cardiac Life Support (ACLS)', desc:'Emergency ACLS resuscitation, post-cardiac arrest care, and acute haemodynamic stabilization.', prof:92 },
  { icon:'💉', cat:'Procedures', title:'Central Venous & Arterial Lines', desc:'Ultrasound-guided central venous access, internal jugular, femoral, and arterial cannulation.', prof:90 },
  { icon:'📊', cat:'Diagnostics', title:'Bedside Echo & POCUS', desc:'Point-of-care cardiac assessment, IVC collapsibility, and targeted thoracic ultrasonography.', prof:88 },
  { icon:'🩺', cat:'Procedures', title:'Paracentesis & Thoracocentesis', desc:'Precision bedside diagnostic and therapeutic pleural & peritoneal aspiration under ultrasound guidance.', prof:89 },
  { icon:'🚨', cat:'Emergency', title:'Trauma Triage & Resuscitation', desc:'Rapid trauma triage protocols, massive transfusion activation, and coordinated multi-organ resuscitation.', prof:91 },
  { icon:'📋', cat:'Administration', title:'NABH Clinical Documentation', desc:'Exemplary preparation of critical care records, ICU transfer protocols, and medico-legal compliance.', prof:96 },
  { icon:'🖥️', cat:'Diagnostics', title:'Invasive Haemodynamic Monitoring', desc:'Continuous arterial waveform monitoring, CVP trend evaluation, and vasoactive titration.', prof:93 }
]

const TABS = [
  { id: 'All', label: 'All Competencies', icon: '🩺' },
  { id: 'Procedures', label: 'Procedures', icon: '💉' },
  { id: 'Emergency', label: 'Emergency & ACLS', icon: '🚨' },
  { id: 'Diagnostics', label: 'Diagnostics & Echo', icon: '📊' },
  { id: 'Administration', label: 'ICU Protocols', icon: '📋' }
]

export default function Skills() {
  const [active, setActive] = useState('All')
  const ref = useScrollReveal()
  const { content } = usePortfolioContent()

  const skillsList = content?.skills || DEFAULT_SKILLS
  const filtered = active === 'All' ? skillsList : skillsList.filter(s => s.cat === active)

  return (
    <section id="competencies" className="py-20 px-[5%] bg-sky-50/70 dark:bg-gray-950/80 transition-colors duration-300 relative overflow-hidden">
      {/* Background medical glow effects */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-teal-400/5 dark:bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-40 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto reveal" ref={ref}>
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100/80 dark:bg-sky-950/70 border border-sky-200/80 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-[10px] uppercase tracking-[0.2em] font-semibold mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
              🩺 Specialized Clinical Procedures
            </div>
            <h2 className="font-display font-bold text-gray-900 dark:text-white" style={{fontSize:'clamp(1.9rem,3.5vw,2.75rem)'}}>
              Clinical <em className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-teal-500 to-sky-700 dark:from-sky-400 dark:via-teal-300 dark:to-cyan-400 font-light italic">Competencies</em>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-1 max-w-xl font-light">
              Demonstrated mastery across advanced life support, bedside interventional procedures, and haemodynamic monitoring.
            </p>
            <div className="w-12 h-1 bg-gradient-to-r from-sky-500 to-teal-400 rounded-full mt-3" />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 p-1.5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl border border-sky-100 dark:border-white/10 shadow-sm">
            {TABS.map(t => {
              const isSelected = active === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => setActive(t.id)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold tracking-wide transition-all duration-200 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-sky-500 to-teal-500 text-white shadow-md shadow-sky-500/20'
                      : 'text-gray-600 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-300 hover:bg-sky-50/60 dark:hover:bg-white/5'
                  }`}
                >
                  <span className="text-xs">{t.icon}</span>
                  {t.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {filtered.map((s, i) => (
            <div
              key={s.id || s.title}
              className="medical-card group p-5 hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-500/10 dark:hover:shadow-teal-900/20 transition-all duration-300 flex flex-col justify-between"
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              <div>
                {/* Header: Icon & Category Badge */}
                <div className="flex items-center justify-between mb-3.5">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-50 to-teal-50 dark:from-sky-950/50 dark:to-teal-950/50 border border-sky-200/60 dark:border-sky-800/60 flex items-center justify-center text-xl shadow-xs group-hover:scale-110 transition-transform duration-300">
                    {s.icon}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-100/70 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 text-[9px] font-semibold uppercase tracking-wider border border-sky-200/50 dark:border-sky-700/50">
                    {s.cat}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-gray-800 dark:text-gray-100 font-semibold text-[0.88rem] leading-snug mb-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  {s.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-[0.74rem] leading-relaxed font-light mb-4">
                  {s.desc}
                </p>
              </div>

              {/* Proficiency Gauge */}
              <div className="pt-3 border-t border-sky-100/80 dark:border-white/10">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 font-medium">Clinical Mastery</span>
                  <span className="text-[11px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-teal-600 dark:from-sky-400 dark:to-teal-300">
                    {s.prof}%
                  </span>
                </div>
                <div className="h-1.5 bg-sky-100/80 dark:bg-sky-950/60 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 via-teal-400 to-emerald-400 rounded-full transition-all duration-1000 shadow-xs"
                    style={{ width: `${s.prof}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Clinical Assurance Strip */}
        <div className="mt-10 p-4 rounded-2xl bg-gradient-to-r from-sky-500/10 via-teal-500/5 to-sky-500/10 border border-sky-200/50 dark:border-sky-800/50 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <p className="text-gray-800 dark:text-gray-200 font-semibold">Strict Infection Control &amp; Aseptic Protocol Compliance</p>
              <p className="text-gray-500 dark:text-gray-400 text-[11px] font-light">All invasive procedures are conducted strictly following NABH &amp; CDC central line bundle checklists.</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-white dark:bg-white/10 border border-sky-200 dark:border-white/10 text-sky-600 dark:text-sky-300 text-[10px] font-semibold tracking-wider uppercase">
            🛡️ Zero-Compromise Protocol
          </span>
        </div>
      </div>
    </section>
  )
}
