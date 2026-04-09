import { useState, useEffect } from 'react'
import { createAppointment } from '../hooks/api'
import toast from 'react-hot-toast'

const SLOTS = ['09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','02:00 PM','02:30 PM','03:00 PM','04:00 PM','04:30 PM','05:00 PM']
const TAKEN = ['10:00 AM','11:00 AM','03:00 PM']

export default function AppointmentModal({ open, onClose }) {
  const [step, setStep]   = useState(1)
  const [aptId, setAptId] = useState('')
  const [busy, setBusy]   = useState(false)
  const [data, setData]   = useState({ name:'', phone:'', age:'', gender:'', reason:'', type:'In-Person', date:'', alt_date:'', time_slot:'' })
  const set = k => e => setData(d => ({ ...d, [k]: e.target.value }))

  useEffect(() => {
    if (!open) setTimeout(() => {
      setStep(1); setAptId('')
      setData({ name:'', phone:'', age:'', gender:'', reason:'', type:'In-Person', date:'', alt_date:'', time_slot:'' })
    }, 350)
  }, [open])

  const next2 = () => {
    if (!data.name.trim() || !data.phone.trim()) return toast.error('Name and phone are required')
    setStep(2)
  }
  const next3 = () => {
    if (!data.date)      return toast.error('Please select a date')
    if (!data.time_slot) return toast.error('Please select a time slot')
    setStep(3)
  }
  const confirm = async () => {
    setBusy(true)
    try {
      const { data: res } = await createAppointment(data)
      setAptId(res.apt_id)
      setStep(5)
      toast.success('Appointment confirmed! 🎉')
    } catch { toast.error('Booking failed. Please try again.') }
    finally { setBusy(false) }
  }

  const today  = new Date().toISOString().split('T')[0]
  const dateStr = data.date ? new Date(data.date).toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' }) : ''
  const ic = 'w-full bg-sky-50/50 dark:bg-white/5 border-[1.5px] border-sky-100 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-gray-800 dark:text-gray-200 text-[0.82rem] outline-none focus:border-sky-400 transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600'

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-md" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white dark:bg-gray-900 border border-sky-200 dark:border-sky-800 rounded-2xl p-7 w-full max-w-md max-h-[92vh] overflow-y-auto shadow-2xl" style={{ animation:'fadeUp 0.35s ease both' }}>

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="font-display font-bold text-gray-900 dark:text-white text-2xl leading-tight">Book an <em className="text-sky-500 font-light italic">Appointment</em></h2>
            <p className="text-gray-400 text-[0.75rem] mt-1">👨‍⚕️ Dr. Shiva Singh · Critical Care</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-white/10 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors text-base">✕</button>
        </div>

        {/* Progress */}
        {step < 5 && (
          <>
            <div className="flex gap-1.5 mb-1">
              {[1,2,3].map(s => (
                <div key={s} className={`flex-1 h-[3px] rounded-full transition-all duration-400 ${s < step ? 'bg-sky-500' : s === step ? 'bg-sky-300' : 'bg-sky-100 dark:bg-sky-900/40'}`}/>
              ))}
            </div>
            <div className="flex justify-between mb-5">
              {['Details','Schedule','Confirm'].map((l,i) => (
                <span key={l} className={`text-[9px] uppercase tracking-[0.1em] font-medium ${i+1===step?'text-sky-500':'text-gray-400'}`}>{l}</span>
              ))}
            </div>
          </>
        )}

        {/* ── Step 1: Patient Details ── */}
        {step === 1 && (
          <>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div><label className="block text-[9px] text-gray-400 uppercase tracking-[0.15em] mb-1.5">Full Name *</label><input value={data.name} onChange={set('name')} placeholder="Patient name" className={ic}/></div>
              <div><label className="block text-[9px] text-gray-400 uppercase tracking-[0.15em] mb-1.5">Phone *</label><input value={data.phone} onChange={set('phone')} placeholder="+91-XXXXXXXXXX" type="tel" className={ic}/></div>
              <div><label className="block text-[9px] text-gray-400 uppercase tracking-[0.15em] mb-1.5">Age</label><input value={data.age} onChange={set('age')} placeholder="Age" type="number" className={ic}/></div>
              <div><label className="block text-[9px] text-gray-400 uppercase tracking-[0.15em] mb-1.5">Gender</label>
                <select value={data.gender} onChange={set('gender')} className={ic}>
                  <option value="">Select</option><option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
            </div>
            <div className="mb-4"><label className="block text-[9px] text-gray-400 uppercase tracking-[0.15em] mb-1.5">Reason for Visit</label><textarea value={data.reason} onChange={set('reason')} rows={3} placeholder="Describe symptoms…" className={`${ic} resize-none`}/></div>
            <label className="block text-[9px] text-gray-400 uppercase tracking-[0.15em] mb-2">Consultation Type</label>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[['🏥','In-Person','In-person visit'],['💻','Video Call','Online consult']].map(([ic2,t,sub]) => (
                <div key={t} onClick={() => setData(d=>({...d,type:t}))} className={`p-4 rounded-xl border-[1.5px] text-center cursor-pointer transition-all ${data.type===t?'border-sky-500 bg-sky-50 dark:bg-sky-900/20':'border-sky-100 dark:border-white/10 hover:border-sky-300'}`}>
                  <div className="text-xl mb-1">{ic2}</div>
                  <div className="text-gray-800 dark:text-gray-200 font-semibold text-[0.8rem]">{t}</div>
                  <div className="text-gray-400 text-[0.68rem]">{sub}</div>
                </div>
              ))}
            </div>
            <button onClick={next2} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white text-[0.82rem] font-semibold uppercase tracking-wide hover:opacity-90 transition-all">Next →</button>
          </>
        )}

        {/* ── Step 2: Date & Time ── */}
        {step === 2 && (
          <>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div><label className="block text-[9px] text-gray-400 uppercase tracking-[0.15em] mb-1.5">Preferred Date *</label><input type="date" value={data.date} onChange={set('date')} min={today} className={ic}/></div>
              <div><label className="block text-[9px] text-gray-400 uppercase tracking-[0.15em] mb-1.5">Alternate Date</label><input type="date" value={data.alt_date} onChange={set('alt_date')} min={today} className={ic}/></div>
            </div>
            <label className="block text-[9px] text-gray-400 uppercase tracking-[0.15em] mb-2">⏰ Available Slots</label>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {SLOTS.map(s => {
                const taken = TAKEN.includes(s)
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
              {[['Patient',data.name],['Phone',data.phone],data.age?['Age',data.age+(data.gender?' · '+data.gender:'')]:null,['Type',data.type],['Date',dateStr],['Time',data.time_slot],data.reason?['Reason',data.reason.slice(0,55)+(data.reason.length>55?'…':'')]:null]
                .filter(Boolean).map(([l,v]) => (
                  <div key={l} className="flex justify-between py-1.5 border-b border-sky-100 dark:border-white/10 last:border-0 text-[0.77rem]">
                    <span className="text-gray-400 font-medium">{l}</span>
                    <span className="text-gray-800 dark:text-gray-200 font-semibold text-right max-w-[60%]">{v}</span>
                  </div>
              ))}
            </div>
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

        {/* ── Step 5: Success ── */}
        {step === 5 && (
          <div className="text-center py-4">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="font-display font-bold text-gray-900 dark:text-white text-2xl mb-2">Appointment Confirmed!</h3>
            <p className="text-gray-400 text-[0.82rem] font-light leading-relaxed mb-4">Your appointment has been booked. A WhatsApp confirmation will be sent shortly.</p>
            <div className="inline-block px-4 py-1.5 rounded-full bg-sky-100 dark:bg-sky-900/30 border border-sky-200 dark:border-sky-800 text-sky-500 text-[0.75rem] font-bold tracking-widest mb-5">{aptId}</div>
            <div className="flex flex-col gap-2">
              <a href={`https://wa.me/919889527343?text=${encodeURIComponent(`Hello Dr. Shiva Singh,\n\nConfirming my appointment.\nID: ${aptId}\nName: ${data.name}\nDate: ${data.date}\nTime: ${data.time_slot}\nType: ${data.type}\n\nKindly confirm.`)}`}
                target="_blank" rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-[1.5px] border-green-400/50 text-green-500 text-[0.82rem] font-medium bg-green-50/50 dark:bg-green-900/10 hover:bg-green-50 transition-all">
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
