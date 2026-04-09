import { useScrollReveal } from '../hooks/useScrollReveal'
const pillars=[{icon:'🛡️',title:'Patient Safety First',desc:'Every clinical decision guided by rigorous evidence-based protocols and patient safety standards.'},{icon:'⏱️',title:'7+ Years in Critical Care',desc:'Extensive ICU exposure across multiple tertiary hospitals, building deep clinical expertise.'},{icon:'🏅',title:'Quality & NABH Contributor',desc:'Active participant in three successful NABH accreditation processes, institutionalizing quality care.'},{icon:'📚',title:'Continuous Learning',desc:'Completed specialized emergency medicine training in Kanpur with latest protocols.'}]
const tags=['🫁 ICU Management','❤️ ACLS','💨 Ventilator Care','📊 Echocardiography','🏅 NABH','🖥️ Haemodynamics']
export default function About({ onBook }) {
  const ref=useScrollReveal()
  return (
    <section id="about" className="py-20 px-[5%] bg-sky-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto reveal" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-sky-500 font-semibold mb-2 before:content-[''] before:w-5 before:h-[1.5px] before:bg-sky-500">👨‍⚕️ About</p>
            <h2 className="font-display font-bold text-gray-900 dark:text-white mb-4" style={{fontSize:'clamp(1.9rem,3.5vw,2.75rem)'}}>Committed to <em className="text-sky-500 font-light italic">clinical excellence</em></h2>
            <div className="w-10 h-0.5 bg-sky-500 rounded mb-10"/>
            <p className="text-gray-500 dark:text-gray-400 leading-[1.85] text-[0.92rem] font-light mb-6">Physician with over 7 years of experience in critical care and internal medicine, trained across tertiary care institutions in Lucknow. Proficient in management of mechanically ventilated patients, haemodynamic monitoring, and advanced bedside procedures. Disciplined approach to clinical decision-making, patient safety, and documentation. Contributed actively to NABH accreditation processes.</p>
            <div className="flex flex-wrap gap-1.5">{tags.map(t=><span key={t} className="px-3 py-1 rounded-full border-[1.5px] border-sky-300 dark:border-sky-800 text-sky-600 dark:text-sky-400 text-[11px] bg-sky-50 dark:bg-sky-900/20 font-medium">{t}</span>)}</div>
          </div>
          <div>
            {pillars.map(p=>(
              <div key={p.title} className="flex gap-3.5 items-start bg-white dark:bg-white/5 border border-sky-100 dark:border-white/10 rounded-2xl p-4 mb-3 hover:border-sky-300 dark:hover:border-sky-700 hover:translate-x-1 transition-all duration-300 cursor-default">
                <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-900/30 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-lg flex-shrink-0">{p.icon}</div>
                <div><div className="text-gray-800 dark:text-gray-200 font-semibold text-[0.85rem] mb-1">{p.title}</div><div className="text-gray-400 dark:text-gray-500 text-[0.77rem] leading-relaxed font-light">{p.desc}</div></div>
              </div>
            ))}
            <button onClick={onBook} className="w-full flex items-center justify-center gap-2 mt-4 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white text-[0.82rem] font-semibold uppercase tracking-wide hover:opacity-90 transition-all shadow-lg shadow-sky-300/20">📅 Schedule a Consultation</button>
          </div>
        </div>
      </div>
    </section>
  )
}
