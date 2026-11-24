import { useState, useEffect } from 'react'
import { getReviews, createReview, updateReview, deleteReview } from '../../hooks/api'
import { Star, Plus, Trash2, Edit2, ShieldCheck, ShieldAlert, Check, X, Search, RefreshCw, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ReviewsTab() {
  const [reviews, setReviews]       = useState([])
  const [loading, setLoading]       = useState(true)
  const [loadError, setLoadError]   = useState(null)
  const [search, setSearch]         = useState('')
  const [editingReview, setEditing] = useState(null)
  const [modalAddOpen, setModalAdd] = useState(false)
  const [form, setForm]             = useState({ name: '', relation: 'Patient', rating: 5, text: '' })

  const loadData = async () => {
    try {
      setLoading(true)
      setLoadError(null)
      const { data } = await getReviews()
      setReviews(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('[ReviewsTab] Error loading reviews:', err)
      const msg = err.response?.data?.error || err.message || 'Failed to load reviews'
      setLoadError(msg)
      toast.error(`Reviews: ${msg}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleToggleVerified = async (id, currentStatus) => {
    try {
      await updateReview(id, { verified: currentStatus ? 0 : 1 })
      toast.success(currentStatus ? 'Marked as unverified' : 'Marked as verified review')
      loadData()
    } catch {
      toast.error('Failed to update verification status')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return
    try {
      await deleteReview(id)
      toast.success('Review deleted')
      loadData()
    } catch {
      toast.error('Failed to delete review')
    }
  }

  const handleSaveEdit = async (e) => {
    e.preventDefault()
    try {
      await updateReview(editingReview.id, editingReview)
      toast.success('Review updated successfully')
      setEditing(null)
      loadData()
    } catch {
      toast.error('Failed to update review')
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.name || !form.text) return toast.error('Name and text are required')
    try {
      await createReview(form)
      toast.success('Review added successfully')
      setModalAdd(false)
      setForm({ name: '', relation: 'Patient', rating: 5, text: '' })
      loadData()
    } catch {
      toast.error('Failed to add review')
    }
  }

  const filtered = reviews.filter(r => {
    const q = search.toLowerCase()
    return (
      (r.name || '').toLowerCase().includes(q) ||
      (r.relation || '').toLowerCase().includes(q) ||
      (r.text || '').toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Patient Reviews & Testimonials</h1>
          <p className="text-gray-400 text-xs mt-0.5">Manage, verify, edit, and moderate feedback displayed on the website</p>
        </div>
        <button
          onClick={() => setModalAdd(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white text-xs font-semibold uppercase tracking-wider hover:opacity-90 shadow-md shadow-sky-400/20 transition-all self-start sm:self-auto"
        >
          <Plus size={16} /> Add Review
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-900 border border-sky-100 dark:border-white/10 rounded-2xl p-4 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reviews by patient, relation, text…"
            className="w-full bg-sky-50/60 dark:bg-white/5 border border-sky-100 dark:border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-sky-500"
          />
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <div className="text-xs text-gray-400 font-medium">
          Total: <span className="text-sky-500 font-bold">{reviews.length}</span> reviews
        </div>
      </div>

      {/* Reviews Cards Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-16 text-sky-500">
          <span className="w-8 h-8 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin" />
        </div>
      ) : loadError && reviews.length === 0 ? (
        <div className="text-center py-12 px-4 bg-white dark:bg-gray-900 border border-sky-100 dark:border-white/10 rounded-2xl">
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
        <div className="text-center py-16 text-gray-400 text-xs bg-white dark:bg-gray-900 border border-sky-100 dark:border-white/10 rounded-2xl">
          No reviews found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r) => {
            const safeName = r.name || 'Patient'
            const ini = safeName.trim().split(/\s+/).map(w => w[0]).filter(Boolean).join('').slice(0, 2).toUpperCase() || 'P'
            return (
              <div
                key={r.id}
                className="bg-white dark:bg-gray-900 border border-sky-100 dark:border-white/10 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-sky-300 dark:hover:border-sky-700 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white/20 flex-shrink-0"
                        style={{ background: r.color || '#2e75b6' }}
                      >
                        {ini}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-tight">{r.name}</div>
                        <div className="text-[11px] text-gray-400">{r.relation} · {new Date(r.created_at || Date.now()).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleVerified(r.id, r.verified)}
                      title={r.verified ? 'Verified (Click to unverify)' : 'Unverified (Click to verify)'}
                      className={`p-1 rounded-lg transition-colors ${
                        r.verified ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40' : 'text-gray-300 dark:text-gray-600 hover:text-emerald-500'
                      }`}
                    >
                      <ShieldCheck size={18} />
                    </button>
                  </div>

                  <div className="flex items-center gap-1 mb-2">
                    {[1,2,3,4,5].map(n => (
                      <span key={n} className={`text-sm ${n <= (r.rating || 5) ? 'text-amber-400' : 'text-gray-200 dark:text-gray-700'}`}>★</span>
                    ))}
                    <span className="text-[11px] font-semibold text-gray-500 ml-1.5">{r.rating}.0</span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 text-xs italic leading-relaxed bg-sky-50/40 dark:bg-white/5 p-3 rounded-xl border border-sky-100 dark:border-white/5 mb-3">
                    "{r.text}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-sky-50 dark:border-white/5 text-xs">
                  <span className={`text-[10px] font-semibold uppercase tracking-wider ${r.verified ? 'text-emerald-500' : 'text-gray-400'}`}>
                    {r.verified ? '✓ Verified' : '○ Pending Verification'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditing(r)}
                      className="p-1.5 rounded-lg text-sky-600 hover:bg-sky-50 dark:hover:bg-white/10 transition-colors"
                      title="Edit Review"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Delete Review"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Edit Review Modal */}
      {editingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setEditing(null)}>
          <div className="bg-white dark:bg-gray-900 border border-sky-100 dark:border-white/10 rounded-3xl p-7 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-5">
              <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white">Edit Review</h3>
              <button onClick={() => setEditing(null)} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500">✕</button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Author Name</label>
                <input
                  required
                  value={editingReview.name}
                  onChange={e => setEditing(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-sky-50/50 dark:bg-white/5 border border-sky-100 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-sky-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-400 mb-1">Relation</label>
                  <select
                    value={editingReview.relation}
                    onChange={e => setEditing(p => ({ ...p, relation: e.target.value }))}
                    className="w-full bg-sky-50/50 dark:bg-white/5 border border-sky-100 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-sky-500"
                  >
                    <option value="Patient">Patient</option>
                    <option value="Patient's Family">Patient's Family</option>
                    <option value="Colleague">Colleague</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Star Rating</label>
                  <select
                    value={editingReview.rating}
                    onChange={e => setEditing(p => ({ ...p, rating: parseInt(e.target.value) }))}
                    className="w-full bg-sky-50/50 dark:bg-white/5 border border-sky-100 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-sky-500"
                  >
                    {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Review Content</label>
                <textarea
                  rows={4}
                  required
                  value={editingReview.text}
                  onChange={e => setEditing(p => ({ ...p, text: e.target.value }))}
                  className="w-full bg-sky-50/50 dark:bg-white/5 border border-sky-100 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-sky-500 resize-none"
                />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="editVerified"
                  checked={Boolean(editingReview.verified)}
                  onChange={e => setEditing(p => ({ ...p, verified: e.target.checked ? 1 : 0 }))}
                  className="rounded text-sky-500 focus:ring-sky-400"
                />
                <label htmlFor="editVerified" className="text-xs text-gray-700 dark:text-gray-300 font-medium cursor-pointer">
                  Display as Verified Review
                </label>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="flex-1 py-2.5 rounded-xl border border-sky-200 dark:border-white/10 text-gray-600 dark:text-gray-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow-md shadow-sky-400/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Review Modal */}
      {modalAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setModalAdd(false)}>
          <div className="bg-white dark:bg-gray-900 border border-sky-100 dark:border-white/10 rounded-3xl p-7 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-5">
              <div>
                <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white">Add Patient Review</h3>
                <p className="text-gray-400 text-xs">Direct review entry</p>
              </div>
              <button onClick={() => setModalAdd(false)} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500">✕</button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Author Name *</label>
                <input
                  required
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full bg-sky-50/50 dark:bg-white/5 border border-sky-100 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-sky-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-400 mb-1">Relation</label>
                  <select
                    value={form.relation}
                    onChange={e => setForm(p => ({ ...p, relation: e.target.value }))}
                    className="w-full bg-sky-50/50 dark:bg-white/5 border border-sky-100 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-sky-500"
                  >
                    <option value="Patient">Patient</option>
                    <option value="Patient's Family">Patient's Family</option>
                    <option value="Colleague">Colleague</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Rating</label>
                  <select
                    value={form.rating}
                    onChange={e => setForm(p => ({ ...p, rating: parseInt(e.target.value) }))}
                    className="w-full bg-sky-50/50 dark:bg-white/5 border border-sky-100 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-sky-500"
                  >
                    {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Review Text *</label>
                <textarea
                  rows={4}
                  required
                  value={form.text}
                  onChange={e => setForm(p => ({ ...p, text: e.target.value }))}
                  placeholder="Share feedback or clinical experience…"
                  className="w-full bg-sky-50/50 dark:bg-white/5 border border-sky-100 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-sky-500 resize-none"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setModalAdd(false)}
                  className="flex-1 py-2.5 rounded-xl border border-sky-200 dark:border-white/10 text-gray-600 dark:text-gray-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow-md shadow-sky-400/20"
                >
                  Add Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
