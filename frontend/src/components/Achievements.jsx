import { useScrollReveal } from '../hooks/useScrollReveal'
import { usePortfolioContent } from '../context/ContentContext'

const DEFAULT_ACH = [
  { icon:'🏅', cat:'Quality', year:'2020–25', title:'NABH Accreditation — 3× Contributor', desc:'Active involvement in three successful NABH accreditation processes, ensuring rigorous clinical excellence, patient safety standards, and full operational compliance.', impact:'Institutional Quality' },
  { icon:'📚', cat:'Development', year:'2023', title:'Emergency Medicine & NABH Protocol Training', desc:'Completed specialized training in emergency medicine and NABH protocols at Regency Hospital Kanpur, under Dr. Pawan Kapoor and Dr. Atul Mohan Kochhar, maintaining updated clinical practice standards.', impact:'Clinical Proficiency' }
]

export default function Achievements() {
  const ref = useScrollReveal()
  const { content } = usePortfolioContent()
  const achList = content?.achievements || DEFAULT_ACH

  return (
    <section id="achievements" className="py-20 px-[5%] bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto reveal text-center" ref={ref}>
        <p className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.22em] text-sky-500 font-semibold mb-2 before:content-[''] before:w-5 before:h-[1.5px] before:bg-sky-500">🏆 Recognition</p>
        <h2 className="font-display font-bold text-gray-900 dark:text-white mb-4" style={{fontSize:'clamp(1.9rem,3.5vw,2.75rem)'}}>Achievements &amp; <em className="text-sky-500 font-light italic">Development</em></h2>
        <div className="w-10 h-0.5 bg-sky-500 rounded mx-auto mb-12"/>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto text-left">
          {achList.map((a, idx)=>(
            <div key={a.id || a.title || idx} className="bg-sky-50 dark:bg-white/5 border-[1.5px] border-sky-100 dark:border-white/10 rounded-2xl p-7 hover:border-sky-300 dark:hover:border-sky-700 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-default">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-900/30 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-xl mb-4">{a.icon || '🏅'}</div>
              <div className="flex justify-between items-start mb-3"><span className="text-[9px] text-sky-500 uppercase tracking-[0.17em] font-semibold">{a.cat}</span><span className="font-display font-bold text-sky-500 text-xl">{a.year}</span></div>
              <div className="text-gray-800 dark:text-gray-200 font-display font-bold text-[1.1rem] leading-snug mb-3">{a.title}</div>
              <div className="text-gray-500 dark:text-gray-400 text-[0.79rem] leading-relaxed font-light mb-4">{a.desc}</div>
              <div className="flex items-center gap-2 pt-3 border-t border-sky-100 dark:border-white/10"><span className="text-[8.5px] text-gray-400 uppercase tracking-[0.13em]">Impact</span><span className="text-sky-500 font-semibold text-[11px]">{a.impact}</span></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
