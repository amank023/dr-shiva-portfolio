import { useState } from 'react'
import { adminChangePassword } from '../../hooks/api'
import { Lock, Shield, Server, Database, Check, AlertCircle, Download } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SettingsTab({ stats }) {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirm] = useState('')
  const [changing, setChanging]       = useState(false)

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (!oldPassword || !newPassword) return toast.error('Please enter old and new passwords')
    if (newPassword !== confirmPassword) return toast.error('New passwords do not match')
    if (newPassword.length < 4) return toast.error('Password must be at least 4 characters')

    try {
      setChanging(true)
      await adminChangePassword({ oldPassword, newPassword })
      toast.success('Admin password updated successfully! 🔒')
      setOldPassword('')
      setNewPassword('')
      setConfirm('')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to change password')
    } finally {
      setChanging(false)
    }
  }

  const handleExportData = () => {
    window.open('/api/content', '_blank')
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Admin & System Settings</h1>
        <p className="text-gray-400 text-xs mt-0.5">Control administrative access, security keys, and system diagnostics</p>
      </div>

      {/* Password Change Card */}
      <div className="bg-white dark:bg-gray-900 border border-sky-100 dark:border-white/10 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-900/30 text-sky-500 flex items-center justify-center">
            <Lock size={18} />
          </div>
          <div>
            <h2 className="font-display font-bold text-base text-gray-900 dark:text-white">Change Security Password</h2>
            <p className="text-gray-400 text-[11px]">Update the master credentials used to access this dashboard</p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-3 max-w-md text-xs">
          <div>
            <label className="block text-gray-400 mb-1 font-medium">Current Password</label>
            <input
              type="password"
              required
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              placeholder="Enter current password…"
              className="w-full bg-sky-50/50 dark:bg-white/5 border border-sky-100 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-sky-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-gray-400 mb-1 font-medium">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="New password…"
                className="w-full bg-sky-50/50 dark:bg-white/5 border border-sky-100 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1 font-medium">Confirm New</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Confirm new…"
                className="w-full bg-sky-50/50 dark:bg-white/5 border border-sky-100 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-sky-500"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={changing}
            className="mt-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-xs transition-all shadow-md shadow-sky-400/20 disabled:opacity-60"
          >
            {changing ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* System Diagnostics */}
      <div className="bg-white dark:bg-gray-900 border border-sky-100 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 flex items-center justify-center">
            <Server size={18} />
          </div>
          <div>
            <h2 className="font-display font-bold text-base text-gray-900 dark:text-white">Environment & System Status</h2>
            <p className="text-gray-400 text-[11px]">System runtime and connectivity</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-sky-50/50 dark:bg-white/5 border border-sky-100 dark:border-white/10 flex justify-between items-center">
            <span className="text-gray-400">API Health</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Check size={14} /> Active (Port 5000)
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-sky-50/50 dark:bg-white/5 border border-sky-100 dark:border-white/10 flex justify-between items-center">
            <span className="text-gray-400">Database Adapter</span>
            <span className="font-semibold text-gray-700 dark:text-gray-300">lowdb (portfolio.json)</span>
          </div>
          <div className="p-3.5 rounded-xl bg-sky-50/50 dark:bg-white/5 border border-sky-100 dark:border-white/10 flex justify-between items-center">
            <span className="text-gray-400">Frontend UI</span>
            <span className="font-semibold text-sky-600 dark:text-sky-400">Vite + React 18 (Port 5173)</span>
          </div>
          <div className="p-3.5 rounded-xl bg-sky-50/50 dark:bg-white/5 border border-sky-100 dark:border-white/10 flex justify-between items-center">
            <span className="text-gray-400">Database Records</span>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              {(stats?.counts?.totalAppointments || 0) + (stats?.counts?.totalReviews || 0) + (stats?.counts?.totalMessages || 0)} items
            </span>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={handleExportData}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-sky-200 dark:border-white/10 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-white/10 text-xs font-semibold transition-colors"
          >
            <Download size={14} /> Export Content JSON
          </button>
        </div>
      </div>
    </div>
  )
}
