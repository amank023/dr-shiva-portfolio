import { usePortfolioContent } from '../context/ContentContext'

export default function Hero({ onBook }) {
  const { content } = usePortfolioContent()
  const p = content?.profile || {}

  const stats = p.stats || [
    { num: '7+', label: 'Years Experience' },
    { num: '3', label: 'Hospitals Served' },
    { num: '3×', label: 'NABH Accreditations' },
    { num: '500+', label: 'Patients Treated' },
    { num: '4.9★', label: 'Patient Rating' }
  ]

  const phone = p.phone || '+91-9889527343'
  const email = p.email || 'askdrshivasingh@gmail.com'
  const location = p.location || 'Lucknow, UP'
  const rawPhone = phone.replace(/[^0-9]/g, '')

  return (
    <section id="hero" className="min-h-screen flex flex-col bg-gradient-to-br from-sky-100 via-sky-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative overflow-hidden">
      <div className="hero-grid absolute inset-0 pointer-events-none"/>
      <div className="absolute -top-1/5 -right-1/4 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(46,117,182,0.14)_0%,transparent_70%)] pointer-events-none"/>
      <div className="absolute -bottom-1/4 -left-1/4 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(46,117,182,0.08)_0%,transparent_70%)] pointer-events-none"/>
      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-[1fr_auto] items-center gap-10 px-[5%] pt-28 pb-10 max-w-6xl mx-auto w-full">
        {/* LEFT TEXT */}
        <div style={{animation:'fadeUp 0.7s 0.1s ease both'}}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sky-300/50 dark:border-sky-700/50 bg-sky-100/60 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 text-[10px] uppercase tracking-[0.18em] font-semibold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" style={{animation:'pulse 2s infinite'}}/>
            {p.tagline || 'Critical Care & Internal Medicine · Lucknow'}
          </div>
          <h1 className="font-display font-bold leading-[1.03] text-gray-900 dark:text-white mb-3" style={{fontSize:'clamp(2.6rem,5vw,5.2rem)'}}>
            {p.name || 'Dr. Shiva Singh'}
          </h1>
          <p className="text-gray-400 dark:text-gray-500 text-sm tracking-wide mb-4">
            {p.degrees || 'MBBS · B.Sc. Critical Care Medicine · Reg. No. 79855'}
          </p>
          <div className="w-12 h-0.5 bg-gradient-to-r from-sky-500 to-transparent mb-5"/>
          <p className="text-gray-600 dark:text-gray-400 text-[0.95rem] leading-[1.8] max-w-xl mb-7 font-light">
            {p.heroBio || 'Physician with over 7 years of experience in critical care and internal medicine. Proficient in management of mechanically ventilated patients, haemodynamic monitoring, and advanced bedside procedures across tertiary care institutions in Lucknow.'}
          </p>
          <div className="flex flex-wrap gap-3 mb-7">
            {[
              { icon:'📞', label: phone, href: `tel:${phone}` },
              { icon:'✉', label: email, href: `mailto:${email}` },
              { icon:'📍', label: location, href: null }
            ].map(c => (
              <div key={c.label} className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-sky-100 dark:bg-sky-900/30 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-xs">{c.icon}</div>
                {c.href ? (
                  <a href={c.href} className="text-gray-500 dark:text-gray-400 text-[0.82rem] font-light hover:text-sky-500 transition-colors">{c.label}</a>
                ) : (
                  <span className="text-gray-500 dark:text-gray-400 text-[0.82rem] font-light">{c.label}</span>
                )}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={onBook} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white text-[0.82rem] font-semibold uppercase tracking-wide hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-lg shadow-sky-300/30">📅 Book Appointment</button>
            <a href="#contact" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border-[1.5px] border-sky-400/50 text-sky-500 text-[0.82rem] font-medium uppercase tracking-wide hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-all">✉ Get in Touch</a>
            <a href={`https://wa.me/${rawPhone}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border-[1.5px] border-green-400/40 text-green-500 text-[0.82rem] font-medium bg-green-50/50 dark:bg-green-900/10 hover:bg-green-50 transition-all">💬 WhatsApp</a>
          </div>
        </div>
        {/* RIGHT PHOTO */}
        <div className="relative flex-shrink-0 order-first lg:order-last flex justify-center" style={{animation:'fadeUp 0.9s 0.2s ease both'}}>
          <div className="absolute -top-3 -right-3 z-10 w-16 h-16 rounded-full bg-sky-100/80 dark:bg-sky-900/30 border-2 border-sky-200 dark:border-sky-800 flex items-center justify-center text-2xl shadow-lg">🩺</div>
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-900 border-[1.5px] border-sky-200 dark:border-sky-800 rounded-2xl px-4 py-3 text-center shadow-lg hidden lg:block">
            <div className="font-display font-bold text-sky-500 text-3xl leading-none">
              {stats[0]?.num || '7+'}
            </div>
            <div className="text-[9px] text-gray-400 uppercase tracking-wider mt-1 leading-tight">Years<br/>Exp.</div>
          </div>
          <div className="w-[260px] h-[330px] lg:w-[300px] lg:h-[370px] rounded-2xl overflow-hidden shadow-2xl shadow-sky-300/30 dark:shadow-sky-950/60 relative">
            <img src={p.photo || '/doctor.jpg'} alt={p.name || 'Dr. Shiva Singh'} className="w-full h-full object-cover object-top"/>
          </div>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-sky-500 text-white px-5 py-2 rounded-full text-[0.72rem] font-semibold uppercase tracking-widest whitespace-nowrap shadow-lg z-10">
            🏥 {p.specialty || 'Critical Care Specialist'}
          </div>
        </div>
      </div>
      {/* STATS BAR */}
      <div className="relative z-10 bg-white/80 dark:bg-black/30 backdrop-blur-sm border-t border-sky-100 dark:border-white/10 flex flex-wrap">
        {stats.map((s,i)=>(
          <div key={i} className="flex-1 min-w-[80px] py-4 text-center border-r border-sky-100 dark:border-white/10 last:border-r-0">
            <div className="shimmer-text font-display font-bold text-[1.9rem] leading-none mb-1">{s.num}</div>
            <div className="text-[8.5px] text-gray-400 uppercase tracking-[0.13em] font-medium">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
