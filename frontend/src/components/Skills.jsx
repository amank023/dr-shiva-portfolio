import { useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
const SKILLS=[{icon:'🫁',cat:'Procedures',title:'Mechanical Ventilation',desc:'Intubation and management of mechanically ventilated patients, including weaning protocols.',prof:95},{icon:'❤️',cat:'Emergency',title:'Advanced Cardiac Life Support',desc:'ACLS and emergency haemodynamic management in critical care units.',prof:92},{icon:'💉',cat:'Procedures',title:'Central Line Insertion',desc:'Ultrasound-guided and freehand central venous access in critically ill patients.',prof:90},{icon:'📊',cat:'Diagnostics',title:'Echocardiography & IVC',desc:'2D Echo and IVC assessment for haemodynamic monitoring and fluid management.',prof:85},{icon:'🩺',cat:'Procedures',title:'Paracentesis & Thoracocentesis',desc:'Ultrasound-guided bedside procedures with precision and safety.',prof:88},{icon:'🚨',cat:'Emergency',title:'Trauma & Triage',desc:'Emergency triage, primary stabilization, and coordinated escalation of care.',prof:87},{icon:'📋',cat:'Administration',title:'Clinical Documentation',desc:'Accurate preparation of case records, discharge summaries, and medico-legal documents.',prof:96},{icon:'🖥️',cat:'Diagnostics',title:'Haemodynamic Monitoring',desc:'Continuous monitoring of invasive and non-invasive haemodynamic parameters.',prof:91}]
const TABS=['All','Procedures','Emergency','Diagnostics','Administration']
export default function Skills() {
  const [active,setActive]=useState('All'), ref=useScrollReveal()
  const filtered=active==='All'?SKILLS:SKILLS.filter(s=>s.cat===active)
  return (
    <section id="competencies" className="py-20 px-[5%] bg-sky-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto reveal" ref={ref}>
        <div className="flex flex-wrap items-end justify-between gap-4 mb-2">
          <div>
            <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-sky-500 font-semibold mb-2 before:content-[''] before:w-5 before:h-[1.5px] before:bg-sky-500">💊 Clinical Skills</p>
            <h2 className="font-display font-bold text-gray-900 dark:text-white" style={{fontSize:'clamp(1.9rem,3.5vw,2.75rem)'}}>Key <em className="text-sky-500 font-light italic">Competencies</em></h2>
            <div className="w-10 h-0.5 bg-sky-500 rounded mt-3"/>
          </div>
          <div className="flex flex-wrap gap-2">
            {TABS.map(t=><button key={t} onClick={()=>setActive(t)} className={`px-3 py-1.5 rounded-full text-[10.5px] font-medium tracking-wide border-[1.5px] transition-all duration-200 ${active===t?'bg-sky-500 text-white border-sky-500 shadow-md':'border-sky-200 dark:border-sky-800 text-gray-500 dark:text-gray-400 hover:border-sky-400 hover:text-sky-500'}`}>{t}</button>)}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-8">
          {filtered.map((s,i)=>(
            <div key={s.title} className="bg-white dark:bg-white/5 border-l-[3px] border-sky-500 border-y border-r border-sky-100 dark:border-y-white/10 dark:border-r-white/10 rounded-2xl p-5 hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-100 dark:hover:shadow-sky-950 transition-all duration-300" style={{transitionDelay:`${i*45}ms`}}>
              <div className="text-xl mb-2">{s.icon}</div>
              <div className="text-[8.5px] text-gray-400 uppercase tracking-[0.14em] mb-1">{s.cat}</div>
              <div className="text-gray-800 dark:text-gray-200 font-semibold text-[0.84rem] mb-2">{s.title}</div>
              <div className="text-gray-400 text-[0.75rem] leading-relaxed mb-3 font-light">{s.desc}</div>
              <div className="flex justify-between items-center mb-1.5"><span className="text-[8.5px] text-gray-400">Proficiency</span><span className="text-[10.5px] text-sky-500 font-bold">{s.prof}%</span></div>
              <div className="h-[3px] bg-sky-100 dark:bg-sky-900/30 rounded-full overflow-hidden"><div className="skill-bar h-full" data-w={s.prof}/></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
