import { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'
import { usePortfolioContent } from '../context/ContentContext'
import { Moon, Sun, Menu, X, Shield } from 'lucide-react'

const links = ['about','experience','competencies','reviews','education','contact']

export default function Navbar({ onBook, onOpenAdmin }) {
  const { dark, toggleTheme } = useTheme()
  const { content } = usePortfolioContent()
  const photo = content?.profile?.photo || '/doctor.jpg'
  const [scrolled,setScrolled]=useState(false), [mobOpen,setMobOpen]=useState(false), [active,setActive]=useState('')

  useEffect(()=>{ const fn=()=>setScrolled(window.scrollY>40); window.addEventListener('scroll',fn); return()=>window.removeEventListener('scroll',fn) },[])

  useEffect(()=>{
    const obs=new IntersectionObserver(e=>e.forEach(en=>{if(en.isIntersecting)setActive(en.target.id)}),{rootMargin:'-40% 0px -55% 0px'})
    links.forEach(id=>{const el=document.getElementById(id);if(el)obs.observe(el)})
    return()=>obs.disconnect()
  },[])

  return (<>
    <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[5%] h-[68px] transition-all duration-300 border-b ${scrolled?'bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-sky-100 dark:border-white/10 shadow-sm':'border-transparent'}`}>
      <a href="#hero" className="flex items-center gap-2.5">
        <img src={photo} alt="Dr. Singh" className="w-9 h-9 rounded-full object-cover object-top border-2 border-sky-500 shadow-md"/>
        <div>
          <span className="font-display font-semibold text-gray-900 dark:text-white text-[0.95rem]">Dr. <span className="text-sky-500">Shiva</span> Singh</span>
          <span className="block text-[9px] text-gray-400 uppercase tracking-[0.14em]">Critical Care Physician</span>
        </div>
      </a>
      <ul className="hidden lg:flex items-center gap-6 list-none">
        {links.map(l=>(
          <li key={l}>
            <a href={`#${l}`} className={`text-[10.5px] uppercase tracking-[0.13em] font-medium transition-colors relative pb-0.5 ${active===l?'text-sky-500 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-sky-500':'text-gray-500 dark:text-gray-400 hover:text-sky-500'}`}>
              {l==='competencies'?'skills':l}
            </a>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-2">
        <button onClick={toggleTheme} className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:scale-105 transition-transform" title="Toggle theme">
          {dark?<Sun size={15}/>:<Moon size={15}/>}
        </button>
        <button onClick={onOpenAdmin} className="hidden xl:flex items-center gap-1 px-3 py-2 rounded-lg border border-sky-200 dark:border-white/10 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-white/5 text-[10.5px] font-semibold tracking-wider transition-colors" title="Admin Dashboard">
          <Shield size={13} /> Admin
        </button>
        <button onClick={onBook} className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-sky-600 text-white text-[10.5px] font-semibold uppercase tracking-widest hover:opacity-90 hover:-translate-y-px transition-all shadow-md">
          📅 Book Appointment
        </button>
        <button onClick={()=>setMobOpen(o=>!o)} className="lg:hidden w-9 h-9 flex items-center justify-center text-gray-600 dark:text-gray-300">
          {mobOpen?<X size={20}/>:<Menu size={20}/>}
        </button>
      </div>
    </nav>
    <div className={`fixed top-[68px] left-0 right-0 z-40 bg-white/97 dark:bg-gray-950/97 backdrop-blur-xl border-b border-sky-100 dark:border-white/10 px-[5%] py-5 flex flex-col gap-4 transition-all duration-300 ${mobOpen?'translate-y-0 opacity-100':'-translate-y-4 opacity-0 pointer-events-none'}`}>
      {links.map(l=>(<a key={l} href={`#${l}`} onClick={()=>setMobOpen(false)} className="text-gray-600 dark:text-gray-300 text-sm font-medium uppercase tracking-widest hover:text-sky-500 transition-colors">{l==='competencies'?'Skills':l.charAt(0).toUpperCase()+l.slice(1)}</a>))}
      <div className="flex gap-2 pt-2">
        <button onClick={()=>{onBook();setMobOpen(false)}} className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-sky-500 to-sky-600 text-white text-xs font-semibold uppercase tracking-widest">📅 Book Appointment</button>
        <button onClick={()=>{onOpenAdmin();setMobOpen(false)}} className="px-4 py-2.5 rounded-lg border border-sky-300 dark:border-white/10 text-sky-600 dark:text-sky-400 text-xs font-semibold">🔐 Admin</button>
      </div>
    </div>
  </>)
}
