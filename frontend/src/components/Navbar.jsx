import { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'
import { usePortfolioContent } from '../context/ContentContext'
import { Moon, Sun, Menu, X, Shield, Calendar, Stethoscope } from 'lucide-react'

const links = ['about', 'experience', 'competencies', 'reviews', 'education']

export default function Navbar({ onBook, onOpenAdmin }) {
  const { dark, toggleTheme } = useTheme()
  const { content } = usePortfolioContent()
  const photo = content?.profile?.photo || '/doctor.jpg'
  const [scrolled, setScrolled] = useState(false)
  const [mobOpen, setMobOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      (e) => e.forEach((en) => { if (en.isIntersecting) setActive(en.target.id) }),
      { rootMargin: '-35% 0px -55% 0px' }
    )
    links.forEach((id) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[5%] h-[72px] transition-all duration-300 border-b ${
          scrolled
            ? 'bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border-sky-200/60 dark:border-sky-900/40 shadow-lg shadow-sky-500/5'
            : 'bg-transparent border-transparent'
        }`}
      >
        {/* Brand / Doctor Identity */}
        <a href="#hero" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-sky-500 ring-2 ring-sky-400/30 dark:ring-sky-500/20 shadow-md shadow-sky-400/20 group-hover:scale-105 transition-transform duration-300">
              <img src={photo} alt="Dr. Shiva Singh" className="w-full h-full object-cover object-top" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-900" title="Active on Duty" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-gray-900 dark:text-white text-[1rem] leading-none tracking-tight">
                Dr. <span className="text-sky-500">Shiva</span> Singh
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300/60 dark:border-emerald-700/60 text-emerald-600 dark:text-emerald-400 text-[8px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                On Duty
              </span>
            </div>
            <span className="block text-[9px] text-gray-400 uppercase tracking-[0.16em] font-medium mt-0.5">
              Critical Care Physician
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex items-center gap-7 list-none">
          {links.map((l) => (
            <li key={l}>
              <a
                href={`#${l}`}
                className={`text-[10.5px] uppercase tracking-[0.15em] font-semibold transition-all relative py-1 ${
                  active === l
                    ? 'text-sky-500 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gradient-to-r after:from-sky-400 after:to-teal-400 after:rounded-full'
                    : 'text-gray-500 dark:text-gray-400 hover:text-sky-500 dark:hover:text-sky-400'
                }`}
              >
                {l === 'competencies' ? 'Skills' : l}
              </a>
            </li>
          ))}
        </ul>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl bg-sky-50/70 dark:bg-white/5 border border-sky-100 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:border-sky-300 dark:hover:border-sky-700 hover:scale-105 transition-all"
            title="Toggle Theme"
          >
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <button
            onClick={onOpenAdmin}
            className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-sky-200 dark:border-white/10 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-white/5 text-[10.5px] font-semibold tracking-wider transition-all"
            title="Admin Control Center"
          >
            <Shield size={13} />
            <span>Admin</span>
          </button>

          <button
            onClick={onBook}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 via-sky-600 to-teal-600 text-white text-[11px] font-semibold uppercase tracking-wider hover:opacity-95 hover:shadow-lg hover:shadow-sky-500/25 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Calendar size={13} />
            <span>Book Appointment</span>
          </button>

          <button
            onClick={() => setMobOpen((o) => !o)}
            className="lg:hidden w-9 h-9 rounded-xl bg-sky-50/70 dark:bg-white/5 border border-sky-100 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-300"
          >
            {mobOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed top-[72px] left-0 right-0 z-40 bg-white/98 dark:bg-gray-950/98 backdrop-blur-2xl border-b border-sky-100 dark:border-white/10 px-[6%] py-6 flex flex-col gap-4 transition-all duration-300 shadow-2xl ${
          mobOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between pb-2 border-b border-sky-100 dark:border-white/5">
          <span className="text-[10px] uppercase tracking-widest text-sky-500 font-bold">Clinical Sections</span>
          <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Accepting Consultations
          </span>
        </div>

        {links.map((l) => (
          <a
            key={l}
            href={`#${l}`}
            onClick={() => setMobOpen(false)}
            className={`text-sm font-semibold uppercase tracking-wider transition-colors py-1 ${
              active === l ? 'text-sky-500 font-bold' : 'text-gray-600 dark:text-gray-300 hover:text-sky-500'
            }`}
          >
            {l === 'competencies' ? 'Skills & Competencies' : l.charAt(0).toUpperCase() + l.slice(1)}
          </a>
        ))}

        <div className="flex gap-2 pt-3 border-t border-sky-100 dark:border-white/5">
          <button
            onClick={() => {
              onBook()
              setMobOpen(false)
            }}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-sky-500 via-sky-600 to-teal-600 text-white text-xs font-semibold uppercase tracking-widest shadow-md shadow-sky-500/20"
          >
            📅 Book Appointment
          </button>
          <button
            onClick={() => {
              onOpenAdmin()
              setMobOpen(false)
            }}
            className="px-4 py-3 rounded-xl border border-sky-300 dark:border-white/10 text-sky-600 dark:text-sky-400 text-xs font-semibold"
          >
            🔐 Admin
          </button>
        </div>
      </div>
    </>
  )
}
