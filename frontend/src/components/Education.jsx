import { useScrollReveal } from '../hooks/useScrollReveal'
import { usePortfolioContent } from '../context/ContentContext'

const DEFAULT_EDU = [
  { year:'2018', icon:'🎓', deg:'Bachelor of Medicine & Bachelor of Surgery', sf:'MBBS', inst:'Career Institute of Medical Sciences & Hospital (CIMS)', uni:'Lucknow', badges:['Internal Medicine','Surgery','Obstetrics','Paediatrics'] },
  { year:'2010', icon:'🎓', deg:'Bachelor of Science — Critical Care Medicine', sf:'B.Sc. CCM', inst:'CSJM University', uni:'Prayagraj', badges:['Critical Care Fundamentals','ICU Protocols','Respiratory Therapy'] },
  { year:'2007', icon:'📚', deg:'Senior Secondary Education (Class XII)', sf:'XII', inst:'YMCA Centenary School', uni:'C.B.S.E, Prayagraj', badges:['Science Stream','Biology','Chemistry','Physics'] }
]

export default function Education() {
  const ref = useScrollReveal()
  const { content } = usePortfolioContent()
  const eduList = content?.education || DEFAULT_EDU

  return (
    <section id="education" className="py-20 px-[5%] bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto reveal" ref={ref}>
        <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-sky-500 font-semibold mb-2 before:content-[''] before:w-5 before:h-[1.5px] before:bg-sky-500">🎓 Academic Background</p>
        <h2 className="font-display font-bold text-gray-900 dark:text-white mb-4" style={{fontSize:'clamp(1.9rem,3.5vw,2.75rem)'}}>Education &amp; <em className="text-sky-500 font-light italic">Qualifications</em></h2>
        <div className="w-10 h-0.5 bg-sky-500 rounded mb-12"/>
        <div className="flex flex-col gap-3 max-w-4xl">
          {eduList.map((e, idx)=>(
            <div key={e.id || e.year || idx} className="flex gap-4 items-start bg-sky-50 dark:bg-white/5 border border-sky-100 dark:border-white/10 border-l-[3px] border-l-sky-600 rounded-2xl p-5 hover:border-l-sky-400 hover:shadow-md hover:bg-white dark:hover:bg-white/8 transition-all duration-300 cursor-default">
              <div className="w-14 h-14 rounded-xl bg-sky-100 dark:bg-sky-900/30 border border-sky-200 dark:border-sky-800 flex flex-col items-center justify-center flex-shrink-0">
                <div className="text-sm">{e.icon || '🎓'}</div>
                <div className="text-[11px] font-bold text-gray-700 dark:text-gray-300">{e.year}</div>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap justify-between items-start gap-2 mb-1">
                  <div className="text-gray-800 dark:text-gray-200 font-semibold text-[0.91rem]">{e.deg}</div>
                  <span className="px-3 py-1 rounded-lg bg-sky-100 dark:bg-sky-900/40 border border-sky-200 dark:border-sky-800 text-sky-600 dark:text-sky-400 text-[10.5px] font-bold whitespace-nowrap">{e.sf}</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  <span className="text-sky-500 text-[0.79rem] font-medium">{e.inst}</span>
                  <span className="text-gray-400 text-[0.75rem]">· {e.uni}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">{(e.badges || []).map(b=><span key={b} className="px-2.5 py-0.5 rounded-lg bg-white dark:bg-white/5 border border-sky-100 dark:border-white/10 text-gray-400 text-[9px] tracking-wide">{b}</span>)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
