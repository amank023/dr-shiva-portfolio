import { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './context/ThemeContext'
import Navbar           from './components/Navbar'
import Hero             from './components/Hero'
import About            from './components/About'
import Experience       from './components/Experience'
import Skills           from './components/Skills'
import Achievements     from './components/Achievements'
import Reviews          from './components/Reviews'
import Education        from './components/Education'
import Contact          from './components/Contact'
import Footer           from './components/Footer'
import AppointmentModal from './components/AppointmentModal'
import WhatsAppBot      from './components/WhatsAppBot'
import Cursor           from './components/Cursor'

export default function App() {
  const [modalOpen, setModalOpen] = useState(false)
  useEffect(() => { document.body.style.overflow = modalOpen ? 'hidden' : '' }, [modalOpen])
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-sky-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-body transition-colors duration-300">
        <Toaster position="top-right" toastOptions={{ className:'font-body text-sm' }}/>
        <Cursor />
        <Navbar  onBook={() => setModalOpen(true)} />
        <Hero    onBook={() => setModalOpen(true)} />
        <About   onBook={() => setModalOpen(true)} />
        <Experience onBook={() => setModalOpen(true)} />
        <Skills />
        <Achievements />
        <Reviews />
        <Education />
        <Contact onBook={() => setModalOpen(true)} />
        <Footer />
        <AppointmentModal open={modalOpen} onClose={() => setModalOpen(false)} />
        <WhatsAppBot />
        <button onClick={() => setModalOpen(true)} className="hidden sm:flex fixed bottom-24 right-6 z-40 items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-sky-500 to-sky-600 text-white text-xs font-semibold uppercase tracking-widest shadow-lg hover:-translate-y-0.5 transition-all duration-300">
          📅 Book Appointment
        </button>
      </div>
    </ThemeProvider>
  )
}
