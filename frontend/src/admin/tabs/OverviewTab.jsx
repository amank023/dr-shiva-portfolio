import { Calendar, Star, Mail, MessageSquare, Clock, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react'

export default function OverviewTab({ stats, onNavigateTab }) {
  const counts = stats?.counts || {
    totalAppointments: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0,
    completedAppointments: 0,
    totalReviews: 0,
    avgRating: '5.0',
    totalMessages: 0,
    unreadMessages: 0,
    totalChatLogs: 0
  }

  const recent = stats?.recent || { appointments: [], messages: [], reviews: [] }

  const statusBadge = (s) => {
    switch(s) {
      case 'confirmed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
      case 'completed': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
      case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
      default:          return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
    }
  }

  return (
    <div className="space-y-7">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Appointments Card */}
        <div
          onClick={() => onNavigateTab('appointments')}
          className="bg-white dark:bg-gray-900 border border-sky-100 dark:border-white/10 rounded-2xl p-5 hover:border-sky-300 dark:hover:border-sky-700 hover:shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase tracking-[0.14em] text-gray-400 font-semibold">Appointments</span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-900/30 text-sky-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold text-3xl text-gray-900 dark:text-white">
              {counts.totalAppointments}
            </span>
            {counts.pendingAppointments > 0 && (
              <span className="text-[11px] font-semibold text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Clock size={11} /> {counts.pendingAppointments} pending
              </span>
            )}
          </div>
          <div className="text-[11px] text-gray-400 mt-2 flex justify-between items-center">
            <span>{counts.confirmedAppointments} confirmed</span>
            <span className="text-sky-500 font-medium group-hover:translate-x-0.5 transition-transform flex items-center text-[10px]">Manage →</span>
          </div>
        </div>

        {/* Patient Reviews Card */}
        <div
          onClick={() => onNavigateTab('reviews')}
          className="bg-white dark:bg-gray-900 border border-sky-100 dark:border-white/10 rounded-2xl p-5 hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase tracking-[0.14em] text-gray-400 font-semibold">Patient Reviews</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Star size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold text-3xl text-gray-900 dark:text-white">
              {counts.avgRating}★
            </span>
            <span className="text-[11px] text-gray-400 font-medium">
              ({counts.totalReviews} total)
            </span>
          </div>
          <div className="text-[11px] text-gray-400 mt-2 flex justify-between items-center">
            <span>100% verified feedback</span>
            <span className="text-amber-500 font-medium group-hover:translate-x-0.5 transition-transform flex items-center text-[10px]">View all →</span>
          </div>
        </div>

        {/* Inquiries / Messages Card */}
        <div
          onClick={() => onNavigateTab('messages')}
          className="bg-white dark:bg-gray-900 border border-sky-100 dark:border-white/10 rounded-2xl p-5 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase tracking-[0.14em] text-gray-400 font-semibold">Contact Messages</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Mail size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold text-3xl text-gray-900 dark:text-white">
              {counts.totalMessages}
            </span>
            {counts.unreadMessages > 0 ? (
              <span className="text-[11px] font-semibold text-rose-500 bg-rose-50 dark:bg-rose-900/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                <AlertCircle size={11} /> {counts.unreadMessages} unread
              </span>
            ) : (
              <span className="text-[11px] text-emerald-500 flex items-center gap-1 font-medium">
                <CheckCircle2 size={12} /> Up to date
              </span>
            )}
          </div>
          <div className="text-[11px] text-gray-400 mt-2 flex justify-between items-center">
            <span>From website form</span>
            <span className="text-indigo-500 font-medium group-hover:translate-x-0.5 transition-transform flex items-center text-[10px]">Inbox →</span>
          </div>
        </div>

        {/* WhatsApp Bot Logs Card */}
        <div
          onClick={() => onNavigateTab('chatlogs')}
          className="bg-white dark:bg-gray-900 border border-sky-100 dark:border-white/10 rounded-2xl p-5 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase tracking-[0.14em] text-gray-400 font-semibold">Assistant Interactions</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageSquare size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold text-3xl text-gray-900 dark:text-white">
              {counts.totalChatLogs}
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">interactions</span>
          </div>
          <div className="text-[11px] text-gray-400 mt-2 flex justify-between items-center">
            <span>24/7 Virtual bot</span>
            <span className="text-emerald-500 font-medium group-hover:translate-x-0.5 transition-transform flex items-center text-[10px]">Inspect →</span>
          </div>
        </div>
      </div>

      {/* Recent Appointments Section */}
      <div className="bg-white dark:bg-gray-900 border border-sky-100 dark:border-white/10 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white">Recent Appointments</h2>
            <p className="text-gray-400 text-xs">Latest patient consultation requests</p>
          </div>
          <button
            onClick={() => onNavigateTab('appointments')}
            className="text-xs font-semibold text-sky-500 hover:text-sky-600 flex items-center gap-1 transition-colors"
          >
            View All ({counts.totalAppointments}) <ChevronRight size={14} />
          </button>
        </div>

        {recent.appointments && recent.appointments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-sky-100 dark:border-white/10 text-[10px] uppercase tracking-wider text-gray-400">
                  <th className="pb-3 font-semibold">ID</th>
                  <th className="pb-3 font-semibold">Patient</th>
                  <th className="pb-3 font-semibold">Date & Slot</th>
                  <th className="pb-3 font-semibold">Type</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-50 dark:divide-white/5">
                {recent.appointments.map((a) => (
                  <tr key={a.id} className="hover:bg-sky-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-3 font-mono font-medium text-sky-600 dark:text-sky-400">{a.apt_id}</td>
                    <td className="py-3">
                      <div className="font-semibold text-gray-800 dark:text-gray-200">{a.name}</div>
                      <div className="text-[11px] text-gray-400">{a.phone}</div>
                    </td>
                    <td className="py-3">
                      <div>{a.date || 'Flexible'}</div>
                      <div className="text-[11px] text-gray-400">{a.time_slot || 'N/A'}</div>
                    </td>
                    <td className="py-3">
                      <span className="text-[11px] font-medium text-gray-600 dark:text-gray-300">
                        {a.type === 'Video Call' ? '💻 Video' : '🏥 In-Person'}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${statusBadge(a.status)}`}>
                        {a.status || 'pending'}
                      </span>
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => onNavigateTab('appointments')}
                        className="text-sky-500 hover:text-sky-600 font-semibold"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400 text-xs">No appointments booked yet.</div>
        )}
      </div>

      {/* Grid: Recent Inquiries + Recent Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inquiries */}
        <div className="bg-white dark:bg-gray-900 border border-sky-100 dark:border-white/10 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-bold text-base text-gray-900 dark:text-white">Recent Messages</h2>
              <p className="text-gray-400 text-[11px]">Direct contact inquiries</p>
            </div>
            <button
              onClick={() => onNavigateTab('messages')}
              className="text-xs font-semibold text-sky-500 hover:text-sky-600 flex items-center gap-1"
            >
              Inbox <ChevronRight size={13} />
            </button>
          </div>
          {recent.messages && recent.messages.length > 0 ? (
            <div className="space-y-3">
              {recent.messages.map((m) => (
                <div key={m.id} className="p-3.5 rounded-xl bg-sky-50/50 dark:bg-white/5 border border-sky-100 dark:border-white/5 text-xs">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{m.name}</span>
                    <span className="text-[10px] text-gray-400">{new Date(m.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="font-medium text-sky-600 dark:text-sky-400 text-[11px] mb-1">{m.subject}</div>
                  <p className="text-gray-500 dark:text-gray-400 line-clamp-2 text-[11px]">{m.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 text-xs">No messages yet.</div>
          )}
        </div>

        {/* Recent Reviews */}
        <div className="bg-white dark:bg-gray-900 border border-sky-100 dark:border-white/10 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-bold text-base text-gray-900 dark:text-white">Recent Patient Reviews</h2>
              <p className="text-gray-400 text-[11px]">Latest testimonials</p>
            </div>
            <button
              onClick={() => onNavigateTab('reviews')}
              className="text-xs font-semibold text-sky-500 hover:text-sky-600 flex items-center gap-1"
            >
              All Reviews <ChevronRight size={13} />
            </button>
          </div>
          {recent.reviews && recent.reviews.length > 0 ? (
            <div className="space-y-3">
              {recent.reviews.map((r) => (
                <div key={r.id} className="p-3.5 rounded-xl bg-sky-50/50 dark:bg-white/5 border border-sky-100 dark:border-white/5 text-xs">
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-semibold text-gray-800 dark:text-gray-200">
                      {r.name} <span className="text-[10px] text-gray-400 font-normal">({r.relation})</span>
                    </div>
                    <div className="text-amber-400 font-bold tracking-tighter">
                      {'★'.repeat(Math.max(1, Math.min(5, Math.round(Number(r.rating) || 5))))}
                    </div>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 italic text-[11px] line-clamp-2">"{r.text}"</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 text-xs">No reviews submitted yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}
