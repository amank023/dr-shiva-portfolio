import { usePortfolioContent } from '../context/ContentContext'

const links = [
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#competencies', label: 'Skills' },
  { href: '#achievements', label: 'Accreditations' },
  { href: '#reviews', label: 'Reviews' },
  { href: '#education', label: 'Education' }
]

export default function Footer({ onOpenAdmin }) {
  const { content } = usePortfolioContent()
  const p = content?.profile || {}

  return (
    <footer className="bg-sky-50 dark:bg-gray-950 border-t border-sky-200/70 dark:border-white/10 transition-colors duration-300">
      {/* Emergency Disclaimer Banner */}
      <div className="bg-amber-500/10 dark:bg-amber-500/5 border-b border-amber-500/20 py-2.5 px-[5%] text-center text-xs text-amber-800 dark:text-amber-300">
        <span className="font-semibold">⚠️ Emergency Notice:</span> If you or a family member are experiencing a life-threatening acute emergency, please call your local emergency ambulance service (<strong>108 / 112</strong>) or proceed to the nearest emergency hospital department immediately.
      </div>

      <div className="max-w-6xl mx-auto px-[5%] py-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        {/* Doctor Identity */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-sky-500/60 shadow-sm flex-shrink-0">
            <img src={p.photo || '/doctor.jpg'} alt="Dr. Shiva Singh" className="w-full h-full object-cover object-top" />
          </div>
          <div>
            <div className="text-gray-900 dark:text-gray-100 font-bold text-[0.88rem] flex items-center gap-1.5 justify-center md:justify-start">
              <span>{p.name || 'Dr. Shiva Singh'}</span>
              <span className="text-teal-600 dark:text-teal-400 text-xs" title="Verified Practitioner">✓</span>
            </div>
            <div className="text-gray-400 text-[0.72rem] font-light">
              {p.degrees || 'MBBS · B.Sc. Critical Care Medicine'} · Reg. 79855
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-5 gap-y-2">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-gray-500 dark:text-gray-400 text-[0.72rem] uppercase tracking-wider hover:text-sky-600 dark:hover:text-sky-400 transition-colors font-medium"
            >
              {l.label}
            </a>
          ))}
          <button
            onClick={onOpenAdmin}
            className="text-sky-600 dark:text-sky-400 text-[0.72rem] font-semibold uppercase tracking-wider hover:underline flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-100/60 dark:bg-white/5 border border-sky-200/60 dark:border-white/10"
          >
            🔐 Admin Portal
          </button>
        </div>

        {/* Copyright */}
        <div className="text-gray-400 text-[0.72rem] font-light">
          © {new Date().getFullYear()} {p.name || 'Dr. Shiva Singh'}. All medical rights reserved.
        </div>
      </div>
    </footer>
  )
}
