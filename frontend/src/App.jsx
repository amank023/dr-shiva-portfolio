import { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './context/ThemeContext'
import { ContentProvider } from './context/ContentContext'
import Navbar           from './components/Navbar'
import Hero             from './components/Hero'
import About            from './components/About'
import Experience       from './components/Experience'
import Skills           from './components/Skills'
import Achievements     from './components/Achievements'
import Reviews          from './components/Reviews'
import Education        from './components/Education'
import Footer           from './components/Footer'
import AppointmentModal from './components/AppointmentModal'
import WhatsAppBot      from './components/WhatsAppBot'
import Cursor           from './components/Cursor'
import AdminDashboard   from './admin/AdminDashboard'
import AdminLogin       from './admin/AdminLogin'

export default function App() {
  const [modalOpen, setModalOpen] = useState(false)
  const [isAdminView, setIsAdminView] = useState(() => {
    return window.location.pathname.startsWith('/admin') || window.location.hash === '#admin'
  })
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('dr_shiva_admin_token') || '')

  useEffect(() => {
    document.body.style.overflow = modalOpen ? 'hidden' : ''
    if (modalOpen) {
      document.body.classList.remove('custom-cursor')
    } else if (!isAdminView && window.innerWidth > 768) {
      document.body.classList.add('custom-cursor')
    }
  }, [modalOpen, isAdminView])

  useEffect(() => {
    const handleUrlChange = () => {
      const isAdm = window.location.pathname.startsWith('/admin') || window.location.hash === '#admin'
      setIsAdminView(isAdm)
    }
    window.addEventListener('popstate', handleUrlChange)
    window.addEventListener('hashchange', handleUrlChange)
    return () => {
      window.removeEventListener('popstate', handleUrlChange)
      window.removeEventListener('hashchange', handleUrlChange)
    }
  }, [])

  useEffect(() => {
    if (isAdminView) {
      document.body.classList.remove('custom-cursor')
    }
  }, [isAdminView])

  const navigateToAdmin = () => {
    window.history.pushState({}, '', '/admin')
    setIsAdminView(true)
  }

  const navigateToSite = () => {
    window.history.pushState({}, '', '/')
    setIsAdminView(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('dr_shiva_admin_token')
    setAdminToken('')
  }

  return (
    <ThemeProvider>
      <ContentProvider>
        <Toaster position="top-right" toastOptions={{ className: 'font-body text-sm' }} />

        {isAdminView ? (
          <div className="admin-scope">
            {adminToken ? (
              <AdminDashboard
                onLogout={handleLogout}
                onBackToSite={navigateToSite}
              />
            ) : (
              <AdminLogin
                onLoginSuccess={(token) => setAdminToken(token)}
                onBackToSite={navigateToSite}
              />
            )}
          </div>
        ) : (
          <div className="min-h-screen bg-sky-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-body transition-colors duration-300">
            <Cursor />
            <Navbar onBook={() => setModalOpen(true)} onOpenAdmin={navigateToAdmin} />
            <Hero onBook={() => setModalOpen(true)} />
            <About onBook={() => setModalOpen(true)} />
            <Experience onBook={() => setModalOpen(true)} />
            <Skills />
            <Achievements />
            <Reviews />
            <Education />
            <Footer onOpenAdmin={navigateToAdmin} />
            <AppointmentModal open={modalOpen} onClose={() => setModalOpen(false)} />
            <WhatsAppBot />
          </div>
        )}
      </ContentProvider>
    </ThemeProvider>
  )
}
