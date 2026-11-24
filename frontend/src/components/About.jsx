import { useScrollReveal } from '../hooks/useScrollReveal'
import { usePortfolioContent } from '../context/ContentContext'
import { Shield, Clock, Award, BookOpen, Stethoscope, CheckCircle2, Calendar } from 'lucide-react'

const pillars = [
  {
    icon: <Shield className="w-5 h-5 text-sky-500" />,
    title: 'Patient Safety & Evidence-Based Protocols',
    desc: 'Every clinical decision is guided by rigorous international critical care guidelines and patient safety standards.'
  },
  {
    icon: <Clock className="w-5 h-5 text-teal-500" />,
    title: '7+ Years in Tertiary Intensive Care',
    desc: 'Extensive hands-on exposure across premier hospitals in Lucknow, managing complex ventilated and multi-organ failure cases.'
  },
  {
    icon: <Award className="w-5 h-5 text-amber-500" />,
    title: 'Quality & 3× NABH Contributor',
    desc: 'Active key contributor in three successful NABH accreditation audit processes, institutionalizing high clinical standards.'
  },
  {
    icon: <BookOpen className="w-5 h-5 text-blue-500" />,
    title: 'Continuous Emergency Protocol Training',
    desc: 'Completed specialized emergency medicine & resuscitation training in Kanpur under leading national critical care mentors.'
  }
]

const tags = [
  '🫁 Mechanical Ventilation',
  '❤️ ACLS Resuscitation',
  '💨 ARDS Protocols',
  '📊 Bedside 2D Echo',
  '💉 USG Central Lines',
  '🏅 NABH Quality Auditor',
  '🖥️ Hemodynamic Monitoring',
  '🩸 Arterial Line Insertion'
]

export default function About({ onBook }) {
  const ref = useScrollReveal()
  const { content } = usePortfolioContent()
  const bio =
    content?.profile?.aboutBio ||
    'Physician with over 7 years of experience in critical care and internal medicine, trained across tertiary care institutions in Lucknow. Proficient in management of mechanically ventilated patients, haemodynamic monitoring, and advanced bedside procedures. Disciplined approach to clinical decision-making, patient safety, and documentation. Contributed actively to NABH accreditation processes.'

  return (
    <section id="about" className="py-24 px-[5%] bg-sky-50/60 dark:bg-gray-950 transition-colors duration-300 relative overflow-hidden">
      {/* Background medical grid */}
      <div className="hero-grid absolute inset-0 pointer-events-none opacity-50" />

      <div className="max-w-6xl mx-auto reveal relative z-10" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Left Column: Bio & Core Expertise */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100/70 dark:bg-sky-900/30 border border-sky-300/60 dark:border-sky-800 text-sky-600 dark:text-sky-400 text-[10px] uppercase tracking-[0.2em] font-bold mb-3">
              <Stethoscope size={13} />
              <span>Physician Profile</span>
            </div>

            <h2 className="font-display font-bold text-gray-900 dark:text-white mb-4" style={{ fontSize: 'clamp(2rem, 3.6vw, 2.85rem)' }}>
              Committed to <em className="text-sky-500 font-light italic">Clinical Excellence</em>
            </h2>

            <div className="w-12 h-0.5 bg-gradient-to-r from-sky-500 to-teal-400 rounded-full mb-8" />

            <p className="text-gray-600 dark:text-gray-300 leading-[1.85] text-[0.93rem] font-light mb-7">
              {bio}
            </p>

            <div className="mb-4">
              <div className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 mb-3">
                Core Clinical Competencies
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1.5 rounded-xl border border-sky-200 dark:border-sky-800/80 text-sky-700 dark:text-sky-300 text-[11px] bg-white/80 dark:bg-sky-950/30 font-medium shadow-sm hover:border-sky-400 hover:scale-105 transition-all cursor-default"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Pillars of Practice */}
          <div className="space-y-3.5">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="medical-card rounded-2xl p-4.5 flex gap-4 items-start hover:border-sky-400 dark:hover:border-sky-600 transition-all cursor-default group"
              >
                <div className="w-11 h-11 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200/80 dark:border-sky-800 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  {p.icon}
                </div>
                <div>
                  <div className="text-gray-900 dark:text-gray-100 font-semibold text-[0.88rem] mb-1">
                    {p.title}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-[0.79rem] leading-relaxed font-light">
                    {p.desc}
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={onBook}
              className="w-full flex items-center justify-center gap-2 mt-4 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 via-sky-600 to-teal-600 text-white text-[0.84rem] font-semibold uppercase tracking-wider hover:opacity-95 hover:shadow-xl hover:shadow-sky-500/25 active:scale-[0.99] transition-all cursor-pointer shadow-md shadow-sky-400/20"
            >
              <Calendar size={15} />
              <span>Schedule Clinical Consultation</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
