import { useState } from 'react'
import { adminLogin } from '../hooks/api'
import { Lock, ArrowRight, ShieldCheck, Stethoscope } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminLogin({ onLoginSuccess, onBackToSite }) {
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!password.trim()) return toast.error('Please enter the admin password')
    setLoading(true)
    try {
      const { data } = await adminLogin(password)
      if (data.token) {
        localStorage.setItem('dr_shiva_admin_token', data.token)
        toast.success('Welcome back, Dr. Shiva Singh! 👋')
        onLoginSuccess(data.token)
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Incorrect password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-sky-100 via-sky-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-100 font-body transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-sky-100 dark:border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Top glow decoration */}
        <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-sky-500/10 dark:bg-sky-500/20 blur-2xl pointer-events-none"/>
        <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-sky-500/10 dark:bg-sky-500/20 blur-2xl pointer-events-none"/>

        {/* Doctor Avatar / Icon Header */}
        <div className="text-center mb-7 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-sky-600 mx-auto flex items-center justify-center text-white shadow-lg shadow-sky-400/30 mb-4">
            <Stethoscope size={30} />
          </div>
          <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">
            Admin <span className="text-sky-500 italic font-light">Portal</span>
          </h1>
          <p className="text-gray-400 text-xs mt-1">Dr. Shiva Singh Portfolio & Practice Dashboard</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.16em] text-gray-400 font-semibold mb-2">
              Security Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password…"
                autoFocus
                className="w-full bg-sky-50/60 dark:bg-white/5 border-[1.5px] border-sky-100 dark:border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-950 transition-all"
              />
              <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <p className="text-[11px] text-gray-400 mt-2 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-sky-500" />
              Default password: <code className="bg-sky-50 dark:bg-white/10 px-1.5 py-0.5 rounded text-sky-600 dark:text-sky-400 font-mono text-[10px]">admin123</code>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-sky-600 text-white text-xs font-semibold uppercase tracking-widest hover:opacity-90 hover:shadow-lg hover:shadow-sky-400/25 active:scale-[0.99] transition-all disabled:opacity-60"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Unlock Dashboard <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-sky-50 dark:border-white/10 text-center relative z-10">
          <button
            type="button"
            onClick={onBackToSite}
            className="text-xs text-gray-400 hover:text-sky-500 font-medium transition-colors"
          >
            ← Return to Public Portfolio
          </button>
        </div>
      </div>
    </div>
  )
}
