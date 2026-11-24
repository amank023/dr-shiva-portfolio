import { useState, useEffect } from 'react'
import { getAdminStats } from '../hooks/api'
import { useTheme } from '../context/ThemeContext'
import { usePortfolioContent } from '../context/ContentContext'
import OverviewTab from './tabs/OverviewTab'
import AppointmentsTab from './tabs/AppointmentsTab'
import ReviewsTab from './tabs/ReviewsTab'
import MessagesTab from './tabs/MessagesTab'
import ChatLogsTab from './tabs/ChatLogsTab'
import ContentTab from './tabs/ContentTab'
import SettingsTab from './tabs/SettingsTab'
import {
  LayoutDashboard,
  Calendar,
  Star,
  Mail,
  MessageSquare,
  FileText,
  Settings,
  LogOut,
  ExternalLink,
  Moon,
  Sun,
  Menu,
  X,
  Stethoscope,
  RefreshCw
} from 'lucide-react'

export default function AdminDashboard({ onLogout, onBackToSite }) {
  const { dark, toggleTheme } = useTheme()
  const { content, refreshContent } = usePortfolioContent()
  const [tab, setTab]         = useState('overview')
  const [stats, setStats]     = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const fetchStats = async () => {
    try {
      const { data } = await getAdminStats()
      if (data && typeof data === 'object') {
        setStats(data)
      }
    } catch (err) {
      console.warn('[AdminDashboard] Stats fetch issue:', err.message)
    }
  }

  useEffect(() => {
    fetchStats()
    const timer = setInterval(fetchStats, 30000)
    return () => clearInterval(timer)
  }, [])

  const handleTabChange = (t) => {
    setTab(t)
    setSidebarOpen(false)
    fetchStats()
  }

  const navItems = [
    { id: 'overview',     label: 'Overview',     icon: LayoutDashboard },
    { id: 'appointments', label: 'Appointments', icon: Calendar,     badge: stats?.counts?.pendingAppointments },
    { id: 'reviews',      label: 'Reviews',      icon: Star },
    { id: 'messages',     label: 'Messages',     icon: Mail,         badge: stats?.counts?.unreadMessages, badgeColor: 'bg-rose-500' },
    { id: 'chatlogs',     label: 'Bot Logs',     icon: MessageSquare },
    { id: 'content',      label: 'Site Content', icon: FileText },
    { id: 'settings',     label: 'Settings',     icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-sky-50/60 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-body flex transition-colors">
      {/* Sidebar Overlay on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white dark:bg-gray-900 border-r border-sky-100 dark:border-white/10 z-50 flex flex-col justify-between p-4 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo / Brand */}
          <div className="flex items-center justify-between px-2 py-3 mb-6 border-b border-sky-50 dark:border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-sky-300 dark:border-sky-700 shadow-md shadow-sky-400/20 flex-shrink-0">
                <img
                  src={content?.profile?.photo || '/doctor.jpg'}
                  alt="Dr. Shiva"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <div className="font-display font-bold text-base text-gray-900 dark:text-white leading-tight">
                  Dr. <span className="text-sky-500">Shiva</span>
                </div>
                <div className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Control Center</div>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = tab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-sky-500 text-white shadow-sm shadow-sky-400/25'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-sky-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge > 0 && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white ${
                        item.badgeColor || 'bg-amber-500'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="space-y-2 pt-4 border-t border-sky-50 dark:border-white/5">
          <button
            onClick={onBackToSite}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-white/5 transition-all"
          >
            <ExternalLink size={15} />
            <span>View Public Portfolio</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-sky-100 dark:border-white/10 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-sky-50 dark:bg-white/5 text-gray-600 dark:text-gray-300"
            >
              <Menu size={18} />
            </button>
            <div className="text-xs text-gray-400 font-medium hidden sm:flex items-center gap-2">
              <span>Portal</span>
              <span>/</span>
              <span className="text-gray-800 dark:text-gray-200 capitalize font-semibold">{tab}</span>
              <span className={`ml-2 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                stats?.engine === 'firebase-firestore'
                  ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700/60'
                  : 'bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800/60'
              }`}>
                {stats?.engine === 'firebase-firestore' ? '🔥 Cloud Firestore' : '📁 Local LowDB'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchStats}
              title="Refresh Data"
              className="p-2 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:scale-105 transition-transform"
            >
              <RefreshCw size={15} />
            </button>
            <button
              onClick={toggleTheme}
              title="Toggle Dark Mode"
              className="p-2 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:scale-105 transition-transform"
            >
              {dark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button
              onClick={onBackToSite}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800 text-xs font-semibold hover:bg-sky-100 transition-colors"
            >
              <ExternalLink size={13} /> View Website
            </button>
          </div>
        </header>

        {/* Tab Body */}
        <main className="p-6 md:p-8 flex-1 overflow-y-auto max-w-7xl w-full mx-auto">
          {tab === 'overview' && (
            <OverviewTab stats={stats} onNavigateTab={handleTabChange} />
          )}
          {tab === 'appointments' && (
            <AppointmentsTab />
          )}
          {tab === 'reviews' && (
            <ReviewsTab />
          )}
          {tab === 'messages' && (
            <MessagesTab />
          )}
          {tab === 'chatlogs' && (
            <ChatLogsTab />
          )}
          {tab === 'content' && (
            <ContentTab onContentUpdated={() => { refreshContent(); fetchStats() }} />
          )}
          {tab === 'settings' && (
            <SettingsTab stats={stats} />
          )}
        </main>
      </div>
    </div>
  )
}
