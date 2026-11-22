import { useState, useEffect } from 'react'
import { getAppointments, updateAppointment, deleteAppointment, createAppointment } from '../../hooks/api'
import { Search, Plus, Trash2, CheckCircle, XCircle, Clock, Check, MessageSquare, ExternalLink, Filter, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'

const SLOTS = ['09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','02:00 PM','02:30 PM','03:00 PM','04:00 PM','04:30 PM','05:00 PM']

export default function AppointmentsTab() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading]           = useState(true)
  const [search, setSearch]             = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedApt, setSelectedApt]   = useState(null)
  const [modalAddOpen, setModalAddOpen] = useState(false)
  const [newApt, setNewApt]             = useState({
    name: '', phone: '', age: '', gender: 'Male', type: 'In-Person',
    date: new Date().toISOString().split('T')[0], time_slot: '10:00 AM', reason: ''
  })

  const loadData = async () => {
    try {
      setLoading(true)
      const { data } = await getAppointments()
      setAppointments(Array.isArray(data) ? data : [])
    } catch {
      toast.error('Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateAppointment(id, { status: newStatus })
      toast.success(`Appointment marked as ${newStatus}`)
      loadData()
      if (selectedApt && selectedApt.id === id) {
        setSelectedApt(prev => ({ ...prev, status: newStatus }))
      }
    } catch {
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return
    try {
      await deleteAppointment(id)
      toast.success('Appointment deleted')
      loadData()
      if (selectedApt?.id === id) setSelectedApt(null)
    } catch {
      toast.error('Failed to delete appointment')
    }
  }

  const handleCreateNew = async (e) => {
    e.preventDefault()
    if (!newApt.name || !newApt.phone || !newApt.date || !newApt.time_slot) {
      return toast.error('Please fill in required fields')
    }
    try {
      await createAppointment({ ...newApt, source: 'admin_dashboard' })
      toast.success('Appointment added successfully')
      setModalAddOpen(false)
      setNewApt({
        name: '', phone: '', age: '', gender: 'Male', type: 'In-Person',
        date: new Date().toISOString().split('T')[0], time_slot: '10:00 AM', reason: ''
      })
      loadData()
    } catch {
      toast.error('Failed to create appointment')
    }
  }

  const filtered = appointments.filter(a => {
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus
    const query = search.toLowerCase()
    const matchesSearch =
      (a.name || '').toLowerCase().includes(query) ||
      (a.phone || '').includes(query) ||
      (a.apt_id || '').toLowerCase().includes(query) ||
      (a.reason || '').toLowerCase().includes(query)
    return matchesStatus && matchesSearch
  })

  const statusBadge = (s) => {
    switch(s) {
      case 'confirmed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800'
      case 'completed': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800'
      default:          return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Appointments Management</h1>
          <p className="text-gray-400 text-xs mt-0.5">Track, schedule, confirm, and manage clinical visits</p>
        </div>
        <button
          onClick={() => setModalAddOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white text-xs font-semibold uppercase tracking-wider hover:opacity-90 shadow-md shadow-sky-400/20 transition-all self-start sm:self-auto"
        >
          <Plus size={16} /> New Appointment
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-gray-900 border border-sky-100 dark:border-white/10 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by patient, phone, ID…"
            className="w-full bg-sky-50/60 dark:bg-white/5 border border-sky-100 dark:border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-sky-500"
          />
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all whitespace-nowrap ${
                filterStatus === st
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'bg-sky-50/50 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-sky-100 dark:hover:bg-white/10'
              }`}
            >
              {st} ({appointments.filter(a => st === 'all' || a.status === st).length})
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 border border-sky-100 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex justify-center items-center py-16 text-sky-500">
            <span className="w-8 h-8 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-xs">
            No appointments found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sky-50/60 dark:bg-white/5 border-b border-sky-100 dark:border-white/10 text-[10px] uppercase tracking-wider text-gray-400">
                <tr>
                  <th className="py-3 px-4 font-semibold">Appointment ID</th>
                  <th className="py-3 px-4 font-semibold">Patient</th>
                  <th className="py-3 px-4 font-semibold">Date & Time</th>
                  <th className="py-3 px-4 font-semibold">Type</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-50 dark:divide-white/5">
                {filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-sky-50/40 dark:hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-sky-600 dark:text-sky-400">
                      {a.apt_id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-gray-900 dark:text-gray-100">{a.name}</div>
                      <div className="text-[11px] text-gray-400 flex items-center gap-1.5 mt-0.5">
                        <span>{a.phone}</span>
                        {a.age && <span>• {a.age} yrs</span>}
                        {a.gender && <span>• {a.gender}</span>}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-gray-800 dark:text-gray-200">{a.date}</div>
                      <div className="text-[11px] text-gray-400">{a.time_slot}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      {a.type === 'Video Call' ? (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-medium flex items-center gap-1">
                            💻 Video
                          </span>
                          {a.meet_link && (
                            <a
                              href={a.meet_link}
                              target="_blank"
                              rel="noreferrer"
                              title="Join Google Meet"
                              className="px-2 py-0.5 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-semibold flex items-center gap-1 transition-colors shadow-sm"
                            >
                              📹 Meet ↗
                            </a>
                          )}
                        </div>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 text-[11px] font-medium">
                          🏥 In-Person
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${statusBadge(a.status)}`}>
                        {a.status || 'pending'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Quick confirm / complete / cancel */}
                        {a.status !== 'confirmed' && (
                          <button
                            title="Confirm Appointment"
                            onClick={() => handleStatusChange(a.id, 'confirmed')}
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                          >
                            <Check size={15} />
                          </button>
                        )}
                        {a.status !== 'completed' && (
                          <button
                            title="Mark Completed"
                            onClick={() => handleStatusChange(a.id, 'completed')}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                          >
                            <CheckCircle size={15} />
                          </button>
                        )}
                        {a.status !== 'cancelled' && (
                          <button
                            title="Cancel Appointment"
                            onClick={() => handleStatusChange(a.id, 'cancelled')}
                            className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
                          >
                            <XCircle size={15} />
                          </button>
                        )}
                        {/* WhatsApp contact */}
                        {a.phone && (
                          <a
                            title="Message on WhatsApp"
                            href={`https://wa.me/${a.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${a.name}, Dr. Shiva Singh's clinic regarding appointment ${a.apt_id}.`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 dark:hover:bg-green-950/40 transition-colors"
                          >
                            <MessageSquare size={15} />
                          </a>
                        )}
                        {/* View full details */}
                        <button
                          title="View Details"
                          onClick={() => setSelectedApt(a)}
                          className="px-2.5 py-1 rounded-lg text-sky-600 bg-sky-50 dark:bg-sky-900/30 hover:bg-sky-100 font-medium text-[11px]"
                        >
                          Details
                        </button>
                        {/* Delete */}
                        <button
                          title="Delete Record"
                          onClick={() => handleDelete(a.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedApt(null)}>
          <div className="bg-white dark:bg-gray-900 border border-sky-100 dark:border-white/10 rounded-3xl p-7 max-w-lg w-full shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-5">
              <div>
                <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400">{selectedApt.apt_id}</span>
                <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white mt-1">{selectedApt.name}</h3>
              </div>
              <button onClick={() => setSelectedApt(null)} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs bg-sky-50/50 dark:bg-white/5 p-4 rounded-2xl border border-sky-100 dark:border-white/10">
              <div className="flex justify-between py-1 border-b border-sky-100 dark:border-white/5">
                <span className="text-gray-400">Phone Number</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedApt.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-sky-100 dark:border-white/5">
                <span className="text-gray-400">Date & Slot</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedApt.date} · {selectedApt.time_slot}</span>
              </div>
              {selectedApt.alt_date && (
                <div className="flex justify-between py-1 border-b border-sky-100 dark:border-white/5">
                  <span className="text-gray-400">Alternate Date</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedApt.alt_date}</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-sky-100 dark:border-white/5">
                <span className="text-gray-400">Consultation Type</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {selectedApt.type === 'Video Call' ? '💻 Video Call (Google Meet)' : '🏥 In-Person'}
                </span>
              </div>
              {selectedApt.type === 'Video Call' && (
                <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-1.5 text-xs">
                      📹 Google Meet Room Link
                    </span>
                    {selectedApt.meet_link && (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(selectedApt.meet_link)
                          toast.success('Google Meet link copied!')
                        }}
                        className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                      >
                        Copy Link
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={selectedApt.meet_link || ''}
                      onChange={(e) => {
                        const val = e.target.value
                        setSelectedApt(prev => ({ ...prev, meet_link: val }))
                      }}
                      placeholder="https://meet.google.com/xxx-yyyy-zzz"
                      className="flex-1 bg-white dark:bg-gray-800 border border-emerald-300 dark:border-emerald-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-800 dark:text-gray-200 font-mono outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await updateAppointment(selectedApt.id, { meet_link: selectedApt.meet_link })
                          toast.success('Google Meet link saved!')
                          loadData()
                        } catch {
                          toast.error('Failed to update meeting link')
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs shadow-sm transition-colors"
                    >
                      Save
                    </button>
                  </div>
                  {selectedApt.meet_link && (
                    <div className="flex items-center justify-between pt-1">
                      <a
                        href={selectedApt.meet_link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                      >
                        Join Google Meet Room ↗
                      </a>
                      <a
                        href={`https://wa.me/${(selectedApt.phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Hello ${selectedApt.name}, your Google Meet link for Dr. Shiva Singh's consultation is: ${selectedApt.meet_link}`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-green-600 dark:text-green-400 hover:underline"
                      >
                        Send Link on WhatsApp 💬
                      </a>
                    </div>
                  )}
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-sky-100 dark:border-white/5">
                <span className="text-gray-400">Current Status</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${statusBadge(selectedApt.status)}`}>
                  {selectedApt.status}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-sky-100 dark:border-white/5">
                <span className="text-gray-400">Source</span>
                <span className="text-gray-600 dark:text-gray-300 font-mono text-[10px] uppercase">{selectedApt.source || 'website'}</span>
              </div>
              <div className="pt-1">
                <span className="text-gray-400 block mb-1">Reason / Symptoms:</span>
                <p className="text-gray-700 dark:text-gray-300 bg-white dark:bg-white/5 p-3 rounded-xl border border-sky-100 dark:border-white/10 leading-relaxed">
                  {selectedApt.reason || 'No specific symptoms noted.'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
              <button
                onClick={() => handleStatusChange(selectedApt.id, 'confirmed')}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs transition-colors"
              >
                Confirm
              </button>
              <button
                onClick={() => handleStatusChange(selectedApt.id, 'completed')}
                className="flex-1 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-xs transition-colors"
              >
                Complete
              </button>
              <button
                onClick={() => handleStatusChange(selectedApt.id, 'cancelled')}
                className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Appointment Modal */}
      {modalAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setModalAddOpen(false)}>
          <div className="bg-white dark:bg-gray-900 border border-sky-100 dark:border-white/10 rounded-3xl p-7 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-5">
              <div>
                <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white">New Appointment</h3>
                <p className="text-gray-400 text-xs">Direct clinic entry</p>
              </div>
              <button onClick={() => setModalAddOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500">✕</button>
            </div>

            <form onSubmit={handleCreateNew} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Full Name *</label>
                <input
                  required
                  value={newApt.name}
                  onChange={e => setNewApt(p => ({ ...p, name: e.target.value }))}
                  placeholder="Patient Name"
                  className="w-full bg-sky-50/50 dark:bg-white/5 border border-sky-100 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-sky-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-400 mb-1">Phone *</label>
                  <input
                    required
                    value={newApt.phone}
                    onChange={e => setNewApt(p => ({ ...p, phone: e.target.value }))}
                    placeholder="+91-XXXXXXXXXX"
                    className="w-full bg-sky-50/50 dark:bg-white/5 border border-sky-100 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Age</label>
                  <input
                    type="number"
                    value={newApt.age}
                    onChange={e => setNewApt(p => ({ ...p, age: e.target.value }))}
                    placeholder="e.g. 45"
                    className="w-full bg-sky-50/50 dark:bg-white/5 border border-sky-100 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-sky-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-400 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={newApt.date}
                    onChange={e => setNewApt(p => ({ ...p, date: e.target.value }))}
                    className="w-full bg-sky-50/50 dark:bg-white/5 border border-sky-100 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Time Slot *</label>
                  <select
                    value={newApt.time_slot}
                    onChange={e => setNewApt(p => ({ ...p, time_slot: e.target.value }))}
                    className="w-full bg-sky-50/50 dark:bg-white/5 border border-sky-100 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-sky-500"
                  >
                    {SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-400 mb-1">Type</label>
                  <select
                    value={newApt.type}
                    onChange={e => setNewApt(p => ({ ...p, type: e.target.value }))}
                    className="w-full bg-sky-50/50 dark:bg-white/5 border border-sky-100 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-sky-500"
                  >
                    <option value="In-Person">🏥 In-Person</option>
                    <option value="Video Call">💻 Video Call (Google Meet)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Gender</label>
                  <select
                    value={newApt.gender}
                    onChange={e => setNewApt(p => ({ ...p, gender: e.target.value }))}
                    className="w-full bg-sky-50/50 dark:bg-white/5 border border-sky-100 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-sky-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {newApt.type === 'Video Call' && (
                <div>
                  <label className="block text-gray-400 mb-1">Google Meet Link (Optional — auto-generated if blank)</label>
                  <input
                    type="text"
                    value={newApt.meet_link || ''}
                    onChange={e => setNewApt(p => ({ ...p, meet_link: e.target.value }))}
                    placeholder="https://meet.google.com/xxx-yyyy-zzz"
                    className="w-full bg-sky-50/50 dark:bg-white/5 border border-emerald-300 dark:border-emerald-800 rounded-xl px-3 py-2 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              )}
              <div>
                <label className="block text-gray-400 mb-1">Reason for Visit</label>
                <textarea
                  rows={2}
                  value={newApt.reason}
                  onChange={e => setNewApt(p => ({ ...p, reason: e.target.value }))}
                  placeholder="Clinical notes or symptoms..."
                  className="w-full bg-sky-50/50 dark:bg-white/5 border border-sky-100 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-sky-500 resize-none"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setModalAddOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-sky-200 dark:border-white/10 text-gray-600 dark:text-gray-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow-md shadow-sky-400/20"
                >
                  Create Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
