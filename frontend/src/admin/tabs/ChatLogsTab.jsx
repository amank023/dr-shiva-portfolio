import { useState, useEffect } from 'react'
import { getChatLogs, deleteChatLog, clearChatLogs } from '../../hooks/api'
import { MessageSquare, Trash2, Search, RefreshCw, AlertTriangle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ChatLogsTab() {
  const [logs, setLogs]           = useState([])
  const [loading, setLoading]     = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [search, setSearch]       = useState('')

  const loadData = async () => {
    try {
      setLoading(true)
      setLoadError(null)
      const { data } = await getChatLogs()
      setLogs(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('[ChatLogsTab] Error loading chat logs:', err)
      const msg = err.response?.data?.error || err.message || 'Failed to load chat logs'
      setLoadError(msg)
      toast.error(`Bot Logs: ${msg}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDeleteOne = async (id) => {
    try {
      await deleteChatLog(id)
      setLogs(prev => prev.filter(l => l.id !== id))
      toast.success('Log entry deleted')
    } catch {
      toast.error('Failed to delete log')
    }
  }

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear all bot chat logs?')) return
    try {
      await clearChatLogs()
      setLogs([])
      toast.success('All chat logs cleared')
    } catch {
      toast.error('Failed to clear logs')
    }
  }

  const filtered = logs.filter(l => {
    const q = search.toLowerCase()
    return (
      (l.message || '').toLowerCase().includes(q) ||
      (l.state || '').toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Virtual Assistant Logs</h1>
          <p className="text-gray-400 text-xs mt-0.5">Live transcripts of visitor queries handled by the interactive WhatsApp chatbot</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl border border-sky-100 dark:border-white/10 hover:bg-sky-50 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw size={14} /> Refresh
          </button>
          {logs.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-3.5 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 size={14} /> Clear All Logs
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-900 border border-sky-100 dark:border-white/10 rounded-2xl p-4 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search log messages or state…"
            className="w-full bg-sky-50/60 dark:bg-white/5 border border-sky-100 dark:border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-sky-500"
          />
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <div className="text-xs text-gray-400 font-medium">
          Logged interactions: <span className="text-emerald-500 font-bold">{logs.length}</span>
        </div>
      </div>

      {/* Logs Table / List */}
      <div className="bg-white dark:bg-gray-900 border border-sky-100 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex justify-center items-center py-16 text-sky-500">
            <span className="w-8 h-8 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin" />
          </div>
        ) : loadError && logs.length === 0 ? (
          <div className="text-center py-12 px-4">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
            <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mb-3">{loadError}</p>
            <button
              onClick={loadData}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <RefreshCw size={13} /> Retry Loading
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-xs">
            No chatbot logs recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sky-50/60 dark:bg-white/5 border-b border-sky-100 dark:border-white/10 text-[10px] uppercase tracking-wider text-gray-400">
                <tr>
                  <th className="py-3 px-4 font-semibold">Time</th>
                  <th className="py-3 px-4 font-semibold">State</th>
                  <th className="py-3 px-4 font-semibold">User Message</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-50 dark:divide-white/5">
                {filtered.map((l) => (
                  <tr key={l.id} className="hover:bg-sky-50/40 dark:hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-gray-400 whitespace-nowrap">
                      {new Date(l.created_at || Date.now()).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-mono text-[10px]">
                        {l.state || 'init'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-800 dark:text-gray-200 font-medium">
                      {l.message}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteOne(l.id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete Entry"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
