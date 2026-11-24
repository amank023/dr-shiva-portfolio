import { usePortfolioContent } from '../context/ContentContext'
import { Stethoscope, Activity, Heart, ShieldCheck, Calendar, MessageCircle, Phone, Mail, MapPin } from 'lucide-react'

export default function Hero({ onBook }) {
  const { content } = usePortfolioContent()
  const p = content?.profile || {}

  const stats = p.stats || [
    { num: '7+', label: 'Years Experience', icon: '⏱️' },
    { num: '3', label: 'Hospitals Served', icon: '🏥' },
    { num: '3×', label: 'NABH Accreditations', icon: '🏅' },
    { num: '500+', label: 'Cases Managed', icon: '❤️' },
    { num: '4.9★', label: 'Patient Rating', icon: '⭐' }
  ]

  const phone = p.phone || '+91-9889527343'
  const email = p.email || 'askdrshivasingh@gmail.com'
  const location = p.location || 'Lucknow, UP'
  const rawPhone = phone.replace(/[^0-9]/g, '')

  return (
    <section id="hero" className="min-h-screen flex flex-col bg-gradient-to-br from-sky-100/80 via-sky-50/50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative overflow-hidden">
      {/* Clinical Grid Background Overlay */}
      <div className="hero-grid absolute inset-0 pointer-events-none" />

      {/* Ambient Medical Glow Orbs */}
      <div className="absolute -top-24 -right-24 w-[550px] h-[550px] rounded-full bg-[radial-gradient(circle,rgba(14,165,233,0.18)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/2 -left-36 w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle,rgba(13,148,136,0.12)_0%,transparent_70%)] pointer-events-none" />

      {/* Main Hero Container */}
      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-[1.1fr_auto] items-center gap-12 px-[5%] pt-32 pb-12 max-w-6xl mx-auto w-full">
        {/* Left Column: Clinical Doctor Profile & Call to Actions */}
        <div style={{ animation: 'fadeUp 0.75s 0.1s ease both' }}>
          {/* Clinical Status Pill with Live Radar Pulse */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-sky-300/60 dark:border-sky-700/60 bg-white/80 dark:bg-sky-950/40 backdrop-blur-md shadow-sm mb-6">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-radar absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-sky-700 dark:text-sky-300">
              {p.tagline || 'Critical Care & Internal Medicine · Lucknow'}
            </span>
          </div>

          {/* Doctor Name & Credentials */}
          <h1
            className="font-display font-bold leading-[1.03] text-gray-900 dark:text-white mb-3"
            style={{ fontSize: 'clamp(2.15rem, 5.2vw, 5.4rem)' }}
          >
            {p.name || 'Dr. Shiva Singh'}
          </h1>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-sky-600 dark:text-sky-400 font-semibold text-sm tracking-wide">
              {p.degrees || 'MBBS · B.Sc. Critical Care Medicine'}
            </span>
            <span className="text-gray-300 dark:text-gray-700">•</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-sky-50 dark:bg-white/5 border border-sky-200 dark:border-white/10 text-[11px] font-mono text-gray-500 dark:text-gray-400">
              <ShieldCheck size={12} className="text-emerald-500" /> Reg. #{p.regNo || '79855'}
            </span>
          </div>

          {/* Animated Medical Heartbeat ECG Monitor Waveform */}
          <div className="flex items-center gap-2.5 sm:gap-3 py-2 mb-4 flex-wrap">
            <svg className="w-40 sm:w-52 h-7 text-sky-500 dark:text-sky-400 flex-shrink-0" viewBox="0 0 240 28" fill="none">
              <path
                d="M0 14 H80 L86 4 L94 24 L102 6 L108 19 L114 14 H240"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ecg-svg"
              />
            </svg>
            <span className="text-[9.5px] uppercase tracking-widest text-sky-600/80 dark:text-sky-400/80 font-mono font-semibold flex items-center gap-1">
              <Activity size={12} className="animate-pulse" /> ICU Vitals Active
            </span>
          </div>

          {/* Doctor Bio */}
          <p className="text-gray-600 dark:text-gray-300 text-[0.93rem] leading-[1.8] max-w-xl mb-7 font-light">
            {p.heroBio ||
              'Physician with over 7 years of specialized experience in critical care and internal medicine. Proficient in mechanical ventilation management, invasive haemodynamic monitoring, and emergency ICU triage across tertiary care institutions in Lucknow.'}
          </p>

          {/* Quick Contact Micro-Badges */}
          <div className="flex flex-wrap gap-2.5 mb-8">
            <a
              href={`tel:${phone}`}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/70 dark:bg-white/5 border border-sky-100 dark:border-white/10 text-[12px] text-gray-600 dark:text-gray-300 hover:border-sky-300 dark:hover:border-sky-700 transition-colors"
            >
              <Phone size={13} className="text-sky-500" />
              <span>{phone}</span>
            </a>
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/70 dark:bg-white/5 border border-sky-100 dark:border-white/10 text-[12px] text-gray-600 dark:text-gray-300 hover:border-sky-300 dark:hover:border-sky-700 transition-colors truncate max-w-[240px] sm:max-w-none"
            >
              <Mail size={13} className="text-sky-500" />
              <span className="truncate">{email}</span>
            </a>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/70 dark:bg-white/5 border border-sky-100 dark:border-white/10 text-[12px] text-gray-600 dark:text-gray-300">
              <MapPin size={13} className="text-sky-500" />
              <span>{location}</span>
            </div>
          </div>

          {/* Interactive CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3.5">
            <button
              onClick={onBook}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 via-sky-600 to-teal-600 text-white text-[0.84rem] font-semibold uppercase tracking-wider hover:opacity-95 hover:shadow-xl hover:shadow-sky-500/30 hover:-translate-y-0.5 active:scale-[0.99] transition-all cursor-pointer shadow-lg shadow-sky-500/20"
            >
              <Calendar size={16} />
              <span>Book Appointment</span>
            </button>
            <a
              href={`https://wa.me/${rawPhone}`}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border-2 border-emerald-400/60 text-emerald-600 dark:text-emerald-400 text-[0.84rem] font-semibold bg-emerald-50/70 dark:bg-emerald-950/30 hover:bg-emerald-100/70 dark:hover:bg-emerald-950/50 hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <MessageCircle size={16} />
              <span>WhatsApp Consultation</span>
            </a>
          </div>
        </div>

        {/* Right Column: Doctor Portrait Showcase with Animated Clinical Rings */}
        <div
          className="relative flex-shrink-0 order-first lg:order-last flex justify-center py-6"
          style={{ animation: 'fadeUp 0.9s 0.2s ease both' }}
        >
          {/* Animated Clinical Aura Rings */}
          <div className="absolute inset-0 m-auto w-[290px] h-[360px] lg:w-[330px] lg:h-[400px] rounded-3xl bg-gradient-to-tr from-sky-400/30 via-teal-400/20 to-sky-500/30 blur-2xl -z-10 animate-pulse" />

          {/* Floating Clinical Badge 1: Top Right */}
          <div className="absolute -top-1 -right-2 sm:-right-4 z-20 medical-card px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl flex items-center gap-2 sm:gap-2.5 animate-float shadow-md">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-300 flex items-center justify-center text-xs sm:text-sm shadow-inner">
              🩺
            </div>
            <div>
              <div className="text-[10px] sm:text-[11px] font-bold text-gray-900 dark:text-white leading-tight">Critical Care</div>
              <div className="text-[8px] sm:text-[9px] text-gray-400 uppercase tracking-wider font-semibold">ICU / MICU Lead</div>
            </div>
          </div>

          {/* Floating Clinical Badge 2: Bottom Left */}
          <div className="absolute -left-2 sm:-left-6 bottom-10 z-20 medical-card px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl hidden sm:flex items-center gap-2 sm:gap-2.5 animate-float-delayed shadow-md">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300 flex items-center justify-center text-xs sm:text-sm shadow-inner">
              🫁
            </div>
            <div>
              <div className="text-[10px] sm:text-[11px] font-bold text-gray-900 dark:text-white leading-tight">Advanced Care</div>
              <div className="text-[8px] sm:text-[9px] text-gray-400 uppercase tracking-wider font-semibold">Ventilator Protocol</div>
            </div>
          </div>

          {/* Main Photo Frame */}
          <div className="relative p-2 rounded-3xl bg-white/70 dark:bg-gray-800/60 border border-sky-200/80 dark:border-sky-500/20 shadow-2xl shadow-sky-500/15">
            <div className="w-[260px] h-[330px] lg:w-[290px] lg:h-[370px] rounded-2xl overflow-hidden relative">
              <img
                src={p.photo || '/doctor.jpg'}
                alt={p.name || 'Dr. Shiva Singh'}
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
              />
              {/* Subtle inner gradient shadow */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Specialty Pill Overlaid on Photo Base */}
            <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-sky-600 to-teal-600 text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap shadow-xl flex items-center gap-1.5 border border-white/20">
              <Stethoscope size={12} />
              <span>{p.specialty || 'Critical Care Specialist'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Medical Stats Strip */}
      <div className="relative z-10 bg-white/85 dark:bg-gray-900/85 backdrop-blur-md border-t border-sky-100 dark:border-white/10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 divide-sky-100 dark:divide-white/10">
        {stats.map((s, i) => (
          <div
            key={i}
            className={`py-5 px-4 text-center border-b sm:border-b-0 border-r border-sky-100/70 dark:border-white/10 last:border-r-0 hover:bg-sky-50/50 dark:hover:bg-white/5 transition-colors group cursor-default ${
              i === stats.length - 1 && stats.length % 2 !== 0 ? 'col-span-2 sm:col-span-1' : ''
            }`}
          >
            <div className="shimmer-text font-display font-bold text-[2rem] leading-none mb-1 group-hover:scale-105 transition-transform">
              {s.num}
            </div>
            <div className="text-[9px] text-gray-500 dark:text-gray-400 uppercase tracking-[0.14em] font-semibold leading-tight">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
