import { useState, useEffect } from 'react'
import { createAppointment, getAppointments } from '../hooks/api'
import toast from 'react-hot-toast'

const SLOTS = ['09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','02:00 PM','02:30 PM','03:00 PM','04:00 PM','04:30 PM','05:00 PM']

export default function AppointmentModal({ open, onClose }) {
  const [step, setStep]         = useState(1)
  const [aptId, setAptId]       = useState('')
  const [meetLink, setMeetLink] = useState('')
  const [copiedMeet, setCopiedMeet] = useState(false)
  const [busy, setBusy]         = useState(false)
  const [errors, setErrors]     = useState({})
  const [appointments, setAppointments] = useState([])
  const [data, setData]         = useState({ name:'', phone:'', age:'', gender:'', reason:'', type:'In-Person', date:'', alt_date:'', time_slot:'' })

  const set = k => e => {
    setData(d => ({ ...d, [k]: e.target.value }))
    if (errors[k]) setErrors(prev => ({ ...prev, [k]: '' }))
  }

  useEffect(() => {
    if (open) {
      getAppointments()
        .then(({ data: list }) => setAppointments(Array.isArray(list) ? list : []))
        .catch(() => {})
    } else {
      setTimeout(() => {
        setStep(1); setAptId(''); setMeetLink(''); setCopiedMeet(false); setErrors({})
        setData({ name:'', phone:'', age:'', gender:'', reason:'', type:'In-Person', date:'', alt_date:'', time_slot:'' })
      }, 350)
    }
  }, [open])

  const next2 = () => {
    const errs = {}
    if (!data.name.trim())  errs.name  = 'Please enter patient full name'
    if (!data.phone.trim()) errs.phone = 'Please enter contact phone number'
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      toast.error('Please enter patient name and contact phone')
      return
    }
    setErrors({})
    setStep(2)
  }
  const next3 = () => {
    if (!data.date)      return toast.error('Please select an appointment date')
    if (!data.time_slot) return toast.error('Please select an available time slot')
    setStep(3)
  }
  const confirm = async () => {
    setBusy(true)
    try {
      const { data: res } = await createAppointment(data)
      setAptId(res.apt_id)
      if (res.meet_link) {
        setMeetLink(res.meet_link)
      } else if (data.type === 'Video Call') {
        setMeetLink('https://meet.google.com/shv-care-meet')
      }
      setStep(4)
      toast.success('Appointment confirmed! 🎉')
      getAppointments().then(({ data: list }) => setAppointments(Array.isArray(list) ? list : [])).catch(() => {})
    } catch { toast.error('Booking failed. Please try again.') }
    finally { setBusy(false) }
  }

  const today  = new Date().toISOString().split('T')[0]
  const dateStr = data.date ? new Date(data.date).toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' }) : ''
  const takenSlots = appointments.filter(a => a.date === data.date).map(a => a.time_slot)
  const ic = 'w-full bg-sky-50/50 dark:bg-white/5 border-[1.5px] border-sky-100 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-gray-800 dark:text-gray-200 text-[0.82rem] outline-none focus:border-sky-400 transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600'

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md modal-scope" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white dark:bg-gray-900 border border-sky-200 dark:border-sky-800 rounded-2xl p-5 sm:p-7 w-full max-w-md max-h-[92vh] overflow-y-auto shadow-2xl modal-scope relative z-[101]" onClick={e => e.stopPropagation()} style={{ animation:'fadeUp 0.35s ease both' }}>

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="font-display font-bold text-gray-900 dark:text-white text-2xl leading-tight">Book an <em className="text-sky-500 font-light italic">Appointment</em></h2>
            <p className="text-gray-400 text-[0.75rem] mt-1">👨‍⚕️ Dr. Shiva Singh · Critical Care</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-white/10 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors text-base cursor-pointer">✕</button>
        </div>

        {/* Progress Navigation */}
        {step < 4 && (
          <div className="mb-5">
            <div className="flex gap-1.5 mb-1.5">
              {[1, 2, 3].map(s => (
                <div
                  key={s}
                  onClick={() => {
                    if (s === 1) setStep(1)
                    if (s === 2 && data.name.trim() && data.phone.trim()) setStep(2)
                    if (s === 3 && data.name.trim() && data.phone.trim() && data.date && data.time_slot) setStep(3)
                  }}
                  className={`flex-1 h-[4px] rounded-full transition-all duration-300 cursor-pointer ${
                    s < step ? 'bg-sky-500' : s === step ? 'bg-sky-400 ring-2 ring-sky-300/40' : 'bg-sky-100 dark:bg-sky-900/40'
                  }`}
                />
              ))}
            </div>
            <div className="flex justify-between text-[9px] uppercase tracking-[0.1em] font-semibold">
              <button
                type="button"
                onClick={() => setStep(1)}
                className={`transition-colors ${step === 1 ? 'text-sky-500' : 'text-gray-400 hover:text-sky-400'}`}
              >
                1. Details
              </button>
              <button
                type="button"
                onClick={next2}
                className={`transition-colors ${step === 2 ? 'text-sky-500' : 'text-gray-400 hover:text-sky-400'}`}
              >
                2. Schedule
              </button>
              <button
                type="button"
                onClick={() => {
                  if (data.name.trim() && data.phone.trim() && data.date && data.time_slot) setStep(3)
                  else next3()
                }}
                className={`transition-colors ${step === 3 ? 'text-sky-500' : 'text-gray-400 hover:text-sky-400'}`}
              >
                3. Confirm
              </button>
            </div>
          </div>
        )}

        {/* ── Step 1: Patient Details ── */}
        {step === 1 && (
          <>
            <div className="space-y-3 mb-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] text-gray-400 uppercase tracking-[0.15em] mb-1.5 font-medium">
                    Full Name *
                  </label>
                  <input
                    value={data.name}
                    onChange={set('name')}
                    placeholder="Patient name"
                    className={`${ic} ${errors.name ? 'border-rose-500 bg-rose-50/20 dark:bg-rose-950/20' : ''}`}
                  />
                  {errors.name && <p className="text-[10px] text-rose-500 mt-1 font-medium">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-[9px] text-gray-400 uppercase tracking-[0.15em] mb-1.5 font-medium">
                    Phone *
                  </label>
                  <input
                    value={data.phone}
                    onChange={set('phone')}
                    placeholder="+91-XXXXXXXXXX"
                    type="tel"
                    className={`${ic} ${errors.phone ? 'border-rose-500 bg-rose-50/20 dark:bg-rose-950/20' : ''}`}
                  />
                  {errors.phone && <p className="text-[10px] text-rose-500 mt-1 font-medium">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] text-gray-400 uppercase tracking-[0.15em] mb-1.5 font-medium">Age</label>
                  <input value={data.age} onChange={set('age')} placeholder="Age" type="number" className={ic}/>
                </div>

                <div>
                  <label className="block text-[9px] text-gray-400 uppercase tracking-[0.15em] mb-1.5 font-medium">Gender</label>
                  <select value={data.gender} onChange={set('gender')} className={ic}>
                    <option value="">Select</option><option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-[9px] text-gray-400 uppercase tracking-[0.15em] mb-1.5 font-medium">Reason for Visit</label>
              <textarea value={data.reason} onChange={set('reason')} rows={2} placeholder="Describe symptoms or medical concern…" className={`${ic} resize-none`}/>
            </div>
            
            <label className="block text-[9px] text-gray-400 uppercase tracking-[0.15em] mb-2 font-semibold">
              Consultation Type *
            </label>
            <div className="grid grid-cols-2 gap-2.5 mb-3">
              {/* In-Person Option */}
              <button
                type="button"
                role="button"
                onClick={() => {
                  setData(d => ({ ...d, type: 'In-Person' }))
                  toast.success('In-Person clinic visit selected 🏥')
                }}
                className={`p-3.5 rounded-xl border-2 text-center transition-all cursor-pointer select-none focus:outline-none ${
                  data.type === 'In-Person'
                    ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/30 text-sky-900 dark:text-sky-100 shadow-sm ring-2 ring-sky-400/20'
                    : 'border-sky-100 dark:border-white/10 hover:border-sky-300 dark:hover:border-sky-700 bg-white dark:bg-gray-800/40'
                }`}
              >
                <div className="text-2xl mb-1">🏥</div>
                <div className="text-gray-900 dark:text-gray-100 font-bold text-xs flex items-center justify-center gap-1">
                  In-Person
                  {data.type === 'In-Person' && <span className="text-sky-500 text-xs font-bold">✓</span>}
                </div>
                <div className="text-gray-400 text-[10px] mt-0.5">Hospital Clinic Visit</div>
              </button>

              {/* Video Call Option */}
              <button
                type="button"
                role="button"
                onClick={() => {
                  setData(d => ({ ...d, type: 'Video Call' }))
                  toast.success('Google Meet Video Consultation selected 📹')
                }}
                className={`p-3.5 rounded-xl border-2 text-center transition-all cursor-pointer select-none focus:outline-none ${
                  data.type === 'Video Call'
                    ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 shadow-sm ring-2 ring-emerald-400/20'
                    : 'border-sky-100 dark:border-white/10 hover:border-emerald-300 dark:hover:border-emerald-700 bg-white dark:bg-gray-800/40'
                }`}
              >
                <div className="text-2xl mb-1">💻</div>
                <div className="text-gray-900 dark:text-gray-100 font-bold text-xs flex items-center justify-center gap-1.5">
                  Video Call
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Google Meet Ready" />
                </div>
                <div className="text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold mt-0.5">Google Meet</div>
              </button>
            </div>

            {/* Google Meet Info Banner if Video Call */}
            {data.type === 'Video Call' && (
              <div className="mb-4 p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/70 to-sky-50/60 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-sky-950/20 border-2 border-emerald-300 dark:border-emerald-700 shadow-sm space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white dark:bg-gray-800 border border-emerald-300 dark:border-emerald-700 shadow-sm flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4z" fill="#00AC47"/>
                      <rect x="3" y="6" width="12" height="12" rx="2" fill="#00832d"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-1.5">
                        Google Meet Video Consultation
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[8.5px] font-bold tracking-wider uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200">
                        Selected
                      </span>
                    </div>
                    <p className="text-[10.5px] text-gray-500 dark:text-gray-400 leading-tight">Private 1-on-1 virtual consult with Dr. Shiva Singh</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-[10px] text-gray-600 dark:text-gray-300 pt-2 border-t border-emerald-200/60 dark:border-emerald-800/40">
                  <div className="flex items-center gap-1">
                    <span className="text-emerald-500 font-bold">✓</span> Instant Meet room
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-emerald-500 font-bold">✓</span> No app download needed
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-emerald-500 font-bold">✓</span> End-to-end encrypted
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-emerald-500 font-bold">✓</span> Mobile & PC browser
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={next2}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white text-[0.82rem] font-semibold uppercase tracking-wide hover:opacity-90 shadow-md shadow-sky-400/20 active:scale-[0.99] transition-all cursor-pointer"
            >
              {data.type === 'Video Call' ? 'Continue to Schedule Video Slot →' : 'Next Step: Select Schedule →'}
            </button>
          </>
        )}

        {/* ── Step 2: Date & Time ── */}
        {step === 2 && (
          <>
            {data.type === 'Video Call' && (
              <div className="mb-3 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-2 text-[11px] text-emerald-800 dark:text-emerald-300">
                <span className="text-sm">📹</span>
                <span><strong>Google Meet Slot:</strong> Your video link will be active 5 minutes prior to the chosen time.</span>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div><label className="block text-[9px] text-gray-400 uppercase tracking-[0.15em] mb-1.5">Preferred Date *</label><input type="date" value={data.date} onChange={set('date')} min={today} className={ic}/></div>
              <div><label className="block text-[9px] text-gray-400 uppercase tracking-[0.15em] mb-1.5">Alternate Date</label><input type="date" value={data.alt_date} onChange={set('alt_date')} min={today} className={ic}/></div>
            </div>
            <label className="block text-[9px] text-gray-400 uppercase tracking-[0.15em] mb-2">⏰ Available Slots</label>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {SLOTS.map(s => {
                const taken = takenSlots.includes(s)
                return (
                  <div key={s} onClick={() => !taken && setData(d=>({...d,time_slot:s}))}
                    className={`py-2 rounded-xl border-[1.5px] text-center text-[0.74rem] font-medium transition-all
                      ${taken ? 'opacity-35 line-through cursor-not-allowed border-sky-100 dark:border-white/10 text-gray-400'
                               : data.time_slot===s ? 'bg-sky-500 border-sky-500 text-white'
                               : 'border-sky-100 dark:border-white/10 text-gray-500 dark:text-gray-400 cursor-pointer hover:border-sky-400 hover:text-sky-500'}`}
                  >{s}</div>
                )
              })}
            </div>
            <p className="text-[0.71rem] text-gray-400 mb-4"><span className="text-red-400">■</span> Booked &nbsp;<span className="text-sky-500">■</span> Available</p>
            <div className="flex gap-2">
              <button onClick={() => setStep(1)} className="px-4 py-3 rounded-xl border-[1.5px] border-sky-200 dark:border-sky-800 text-sky-500 text-[0.82rem] font-medium hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-all">← Back</button>
              <button onClick={next3} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white text-[0.82rem] font-semibold uppercase tracking-wide hover:opacity-90 transition-all">Review →</button>
            </div>
          </>
        )}

        {/* ── Step 3: Confirm ── */}
        {step === 3 && (
          <>
            <div className="bg-sky-50 dark:bg-white/5 border-[1.5px] border-sky-200 dark:border-sky-800 rounded-xl p-4 mb-4">
              {[
                ['Patient', data.name],
                ['Phone', data.phone],
                data.age ? ['Age', data.age + (data.gender ? ' · ' + data.gender : '')] : null,
                ['Consultation', data.type === 'Video Call' ? '💻 Video Call (Google Meet)' : '🏥 In-Person Consultation'],
                data.type === 'Video Call' ? ['Platform', 'Google Meet (Link created on booking)'] : null,
                ['Date', dateStr],
                ['Time Slot', data.time_slot],
                data.reason ? ['Reason', data.reason.slice(0, 55) + (data.reason.length > 55 ? '…' : '')] : null
              ]
                .filter(Boolean).map(([l,v]) => (
                  <div key={l} className="flex justify-between py-1.5 border-b border-sky-100 dark:border-white/10 last:border-0 text-[0.77rem]">
                    <span className="text-gray-400 font-medium">{l}</span>
                    <span className="text-gray-800 dark:text-gray-200 font-semibold text-right max-w-[60%]">{v}</span>
                  </div>
              ))}
            </div>

            {data.type === 'Video Call' && (
              <div className="flex gap-2.5 items-start bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800 rounded-xl p-3 mb-4">
                <span className="text-base">📹</span>
                <div>
                  <div className="text-[0.78rem] font-semibold text-gray-800 dark:text-gray-200 mb-0.5">Google Meet Room Generated</div>
                  <div className="text-[0.72rem] text-gray-500 dark:text-gray-400 font-light">
                    Your private meeting link will be presented on the next screen and forwarded to WhatsApp for 1-tap joining.
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2 items-start bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-xl p-3 mb-4">
              <span>💬</span>
              <div>
                <div className="text-[0.78rem] font-semibold text-gray-800 dark:text-gray-200 mb-0.5">WhatsApp Confirmation</div>
                <div className="text-[0.72rem] text-gray-400 font-light">A confirmation message will be sent upon booking.</div>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setStep(2)} className="px-4 py-3 rounded-xl border-[1.5px] border-sky-200 dark:border-sky-800 text-sky-500 text-[0.82rem] font-medium hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-all">← Back</button>
              <button onClick={confirm} disabled={busy} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white text-[0.82rem] font-semibold uppercase tracking-wide hover:opacity-90 transition-all disabled:opacity-60">
                {busy ? <span className="spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"/> : '✅'} Confirm Appointment
              </button>
            </div>
          </>
        )}

        {/* ── Step 4: Success ── */}
        {step === 4 && (
          <div className="text-center py-4">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="font-display font-bold text-gray-900 dark:text-white text-2xl mb-2">Appointment Confirmed!</h3>
            <p className="text-gray-400 text-[0.82rem] font-light leading-relaxed mb-4">
              Your appointment has been booked. {data.type === 'Video Call' ? 'Your Google Meet room is ready below.' : 'A WhatsApp confirmation will be sent shortly.'}
            </p>
            <div className="inline-block px-4 py-1.5 rounded-full bg-sky-100 dark:bg-sky-900/30 border border-sky-200 dark:border-sky-800 text-sky-500 text-[0.75rem] font-bold tracking-widest mb-4">{aptId}</div>

            {/* Google Meet Box if Video Call */}
            {data.type === 'Video Call' && meetLink && (
              <div className="mb-5 p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-sky-50 to-teal-50 dark:from-emerald-950/40 dark:via-sky-950/30 dark:to-teal-950/30 border-2 border-emerald-300 dark:border-emerald-700 text-left shadow-sm">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-emerald-200 dark:border-emerald-700 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4z" fill="#00AC47"/>
                      <rect x="3" y="6" width="12" height="12" rx="2" fill="#00832d"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-gray-900 dark:text-white">Your Google Meet Consultation Room</h4>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">Scheduled for {data.date} at {data.time_slot}</p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-xs text-emerald-700 dark:text-emerald-300 truncate select-all">{meetLink}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(meetLink)
                      setCopiedMeet(true)
                      toast.success('Google Meet link copied!')
                      setTimeout(() => setCopiedMeet(false), 2000)
                    }}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-100 text-[11px] font-semibold flex-shrink-0 transition-colors"
                  >
                    {copiedMeet ? '✓ Copied' : 'Copy'}
                  </button>
                </div>

                <a
                  href={meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(meetLink, '_blank', 'noopener,noreferrer')
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-semibold shadow-md shadow-emerald-400/25 hover:opacity-95 transition-all cursor-pointer"
                >
                  📹 Join Google Meet Consultation Now ↗
                </a>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <a
                href={`https://wa.me/919889527343?text=${encodeURIComponent(
                  `Hello Dr. Shiva Singh,\n\nConfirming my appointment.\nID: ${aptId}\nName: ${data.name}\nDate: ${data.date}\nTime: ${data.time_slot}\nType: ${data.type}${data.type === 'Video Call' && meetLink ? `\nGoogle Meet: ${meetLink}` : ''}\n\nKindly confirm.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-[1.5px] border-green-400/50 text-green-500 text-[0.82rem] font-medium bg-green-50/50 dark:bg-green-900/10 hover:bg-green-50 transition-all"
              >
                💬 Open WhatsApp Confirmation
              </a>
              <button onClick={onClose} className="w-full py-3 rounded-xl border-[1.5px] border-sky-200 dark:border-sky-800 text-sky-500 text-[0.82rem] font-medium hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-all">Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
