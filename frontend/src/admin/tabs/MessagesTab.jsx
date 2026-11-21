import { useState, useEffect } from 'react'
import { getMessages, updateMessage, deleteMessage } from '../../hooks/api'
import { Mail, MailOpen, Trash2, Search, ExternalLink, CornerUpLeft } from 'lucide-react'
import toast from 'react-hot-toast'

export default function MessagesTab() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState('all') // all, unread, read

  const loadData = async () => {
    try {
      setLoading(true)
      const { data } = await getMessages()
      setMessages(Array.isArray(data) ? data : [])
    } catch {
      toast.error('Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleToggleRead = async (id, currentRead) => {
    try {
      await updateMessage(id, { read: !currentRead })
      setMessages(prev => prev.map(m => m.id === id ? { ...m, read: currentRead ? 0 : 1 } : m))
      toast.success(currentRead ? 'Marked as unread' : 'Marked as read')
    } catch {
      toast.error('Failed to update message')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return
    try {
      await deleteMessage(id)
      setMessages(prev => prev.filter(m => m.id !== id))
      toast.success('Message deleted')
    } catch {
      toast.error('Failed to delete message')
    }
  }

  const filtered = messages.filter(m => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'unread' && !m.read) ||
      (filter === 'read' && m.read)
    const q = search.toLowerCase()
    const matchesSearch =
      (m.name || '').toLowerCase().includes(q) ||
      (m.email || '').toLowerCase().includes(q) ||
      (m.subject || '').toLowerCase().includes(q) ||
      (m.message || '').toLowerCase().includes(q)
    return matchesFilter && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Contact Inquiries & Messages</h1>
        <p className="text-gray-400 text-xs mt-0.5">Direct inquiries submitted by patients, colleagues, and collaborators</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-900 border border-sky-100 dark:border-white/10 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, subject…"
            className="w-full bg-sky-50/60 dark:bg-white/5 border border-sky-100 dark:border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-sky-500"
          />
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {['all', 'unread', 'read'].map(st => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                filter === st
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'bg-sky-50/50 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-sky-100 dark:hover:bg-white/10'
              }`}
            >
              {st} ({messages.filter(m => st === 'all' ? true : st === 'unread' ? !m.read : m.read).length})
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      {loading ? (
        <div className="flex justify-center items-center py-16 text-sky-500">
          <span className="w-8 h-8 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-xs bg-white dark:bg-gray-900 border border-sky-100 dark:border-white/10 rounded-2xl">
          No inquiries found.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((m) => (
            <div
              key={m.id}
              className={`bg-white dark:bg-gray-900 border rounded-2xl p-5 shadow-sm transition-all ${
                !m.read
                  ? 'border-sky-300 dark:border-sky-700 bg-sky-50/20'
                  : 'border-sky-100 dark:border-white/10 opacity-90'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  {!m.read && (
                    <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                  )}
                  <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{m.name}</span>
                  <a
                    href={`mailto:${m.email}`}
                    className="text-xs text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                  >
                    ({m.email}) <ExternalLink size={11} />
                  </a>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>{new Date(m.created_at || Date.now()).toLocaleString()}</span>
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      onClick={() => handleToggleRead(m.id, m.read)}
                      title={m.read ? 'Mark as Unread' : 'Mark as Read'}
                      className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    >
                      {m.read ? <MailOpen size={15} /> : <Mail size={15} className="text-sky-500" />}
                    </button>
                    <a
                      href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject || 'Inquiry'}`)}`}
                      title="Reply via Email"
                      className="p-1.5 rounded-lg text-sky-600 hover:bg-sky-50 dark:hover:bg-white/10 transition-colors"
                    >
                      <CornerUpLeft size={15} />
                    </a>
                    <button
                      onClick={() => handleDelete(m.id)}
                      title="Delete Message"
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="font-medium text-xs text-sky-600 dark:text-sky-400 mb-2">
                Subject: {m.subject}
              </div>

              <p className="text-xs text-gray-700 dark:text-gray-300 bg-sky-50/50 dark:bg-white/5 p-4 rounded-xl border border-sky-100 dark:border-white/5 leading-relaxed whitespace-pre-wrap">
                {m.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
