import { usePortfolioContent } from '../context/ContentContext'

const links = [
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#competencies', label: 'Skills' },
  { href: '#reviews', label: 'Reviews' },
  { href: '#education', label: 'Education' }
]

export default function Footer({ onOpenAdmin }) {
  const { content } = usePortfolioContent()
  const p = content?.profile || {}

  return (
    <footer className="bg-sky-100 dark:bg-gray-900 border-t border-sky-200 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-[5%] py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-sky-500">
            <img src={p.photo || '/doctor.jpg'} alt="Dr. Singh" className="w-full h-full object-cover object-top" />
          </div>
          <div>
            <div className="text-gray-800 dark:text-gray-200 font-semibold text-[0.82rem]">
              {p.name || 'Dr. Shiva Singh'}
            </div>
            <div className="text-gray-400 text-[0.68rem] font-light">
              {p.degrees || 'MBBS · B.Sc. Critical Care Medicine · Reg. 79855'}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-5 gap-y-2">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-gray-400 text-[0.7rem] uppercase tracking-widest hover:text-sky-500 transition-colors"
            >
              {l.label}
            </a>
          ))}
          <button
            onClick={onOpenAdmin}
            className="text-sky-600 dark:text-sky-400 text-[0.7rem] font-semibold uppercase tracking-widest hover:underline flex items-center gap-1"
          >
            🔐 Admin Portal
          </button>
        </div>

        <div className="text-gray-400 text-[0.7rem]">
          © {new Date().getFullYear()} {p.name || 'Dr. Shiva Singh'}
        </div>
      </div>
    </footer>
  )
}
