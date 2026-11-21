import { useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { sendMessage } from '../hooks/api'
import { usePortfolioContent } from '../context/ContentContext'
import toast from 'react-hot-toast'

export default function Contact({ onBook }) {
  const [form, setForm]     = useState({ name:'', email:'', subject:'', message:'' })
  const [sent, setSent]     = useState(false)
  const [loading, setLoading] = useState(false)
  const ref = useScrollReveal()
  const { content } = usePortfolioContent()

  const p = content?.profile || {}
  const phone = p.phone || '+91-9889527343'
  const email = p.email || 'askdrshivasingh@gmail.com'
  const location = p.location || 'Lucknow, Uttar Pradesh'
  const address = p.address || 'Sahara City Homes, IIM Road'
  const rawPhone = phone.replace(/[^0-9]/g, '')

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.subject || !form.message) {
      return toast.error('Please fill in all fields')
    }
    setLoading(true)
    try {
      await sendMessage(form)
      setSent(true)
      toast.success('Message sent! We will respond shortly 🙏')
      setTimeout(() => {
        setSent(false)
        setForm({ name:'', email:'', subject:'', message:'' })
      }, 4000)
    } catch {
      toast.error('Failed to send. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const ic = 'w-full bg-sky-50/50 dark:bg-white/5 border-[1.5px] border-sky-100 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-gray-800 dark:text-gray-200 text-[0.82rem] outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900 transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600'

  return (
    <section id="contact" className="py-20 px-[5%] bg-sky-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto reveal text-center" ref={ref}>
        <p className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.22em] text-sky-500 font-semibold mb-2 before:content-[''] before:w-5 before:h-[1.5px] before:bg-sky-500">📞 Get in Touch</p>
        <h2 className="font-display font-bold text-gray-900 dark:text-white mb-4" style={{fontSize:'clamp(1.9rem,3.5vw,2.75rem)'}}>Contact <em className="text-sky-500 font-light italic">{p.name ? p.name.split(' ').slice(0, 2).join(' ') : 'Dr. Singh'}</em></h2>
        <div className="w-10 h-0.5 bg-sky-500 rounded mx-auto mb-12"/>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-[0.84rem] font-light leading-relaxed mb-6">For professional inquiries, collaboration, or to discuss clinical opportunities.</p>
            {[
              { icon:'📞', lbl:'Phone', val: phone, sub:'Available for consultations', href:`tel:${phone}` },
              { icon:'✉️', lbl:'Email', val: email, sub:'Professional inquiries', href:`mailto:${email}` },
              { icon:'📍', lbl:'Location', val: location, sub: address, href: null }
            ].map(c=>(
              <div key={c.lbl} className="flex gap-3 items-start bg-white dark:bg-white/5 border border-sky-100 dark:border-white/10 rounded-2xl p-4 mb-3 hover:border-sky-200 dark:hover:border-sky-800 hover:shadow-sm transition-all duration-300">
                <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-900/30 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sm flex-shrink-0">{c.icon}</div>
                <div>
                  <div className="text-[8.5px] text-gray-400 uppercase tracking-[0.15em] mb-0.5">{c.lbl}</div>
                  {c.href ? (
                    <a href={c.href} className="text-gray-800 dark:text-gray-200 text-[0.82rem] font-semibold hover:text-sky-500 transition-colors block">{c.val}</a>
                  ) : (
                    <div className="text-gray-800 dark:text-gray-200 text-[0.82rem] font-semibold">{c.val}</div>
                  )}
                  <div className="text-gray-400 text-[0.71rem] font-light mt-0.5">{c.sub}</div>
                </div>
              </div>
            ))}
            <div className="flex gap-2 mt-4">
              <button onClick={onBook} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white text-[0.82rem] font-semibold uppercase tracking-wide hover:opacity-90 transition-all shadow-md shadow-sky-300/20">📅 Book Appointment</button>
              <a href={`https://wa.me/${rawPhone}`} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-[1.5px] border-green-400/40 text-green-500 text-[0.82rem] font-medium bg-green-50/50 dark:bg-green-900/10 hover:bg-green-50 transition-all">💬 WhatsApp</a>
            </div>
          </div>
          <div className="bg-white dark:bg-white/5 border border-sky-100 dark:border-white/10 rounded-2xl p-7 shadow-sm">
            <h3 className="text-gray-800 dark:text-gray-200 font-semibold text-[0.92rem] mb-5">✉️ Send a Message</h3>
            {sent?(
              <div className="flex flex-col items-center justify-center h-48 gap-3 text-center">
                <div className="text-5xl">✅</div>
                <div className="text-gray-800 dark:text-gray-200 font-semibold">Message Received!</div>
                <div className="text-gray-400 text-sm font-light">Thank you. A response will follow shortly.</div>
              </div>
            ):(
              <>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div><label className="block text-[9px] text-gray-400 uppercase tracking-[0.15em] mb-1.5">Full Name</label><input value={form.name} onChange={set('name')} placeholder="Your name" className={ic}/></div>
                  <div><label className="block text-[9px] text-gray-400 uppercase tracking-[0.15em] mb-1.5">Email</label><input value={form.email} onChange={set('email')} type="email" placeholder="your@email.com" className={ic}/></div>
                </div>
                <div className="mb-3"><label className="block text-[9px] text-gray-400 uppercase tracking-[0.15em] mb-1.5">Subject</label><input value={form.subject} onChange={set('subject')} placeholder="Professional inquiry" className={ic}/></div>
                <div className="mb-5"><label className="block text-[9px] text-gray-400 uppercase tracking-[0.15em] mb-1.5">Message</label><textarea value={form.message} onChange={set('message')} rows={5} placeholder="Your message..." className={`${ic} resize-none`}/></div>
                <button onClick={handleSubmit} disabled={loading} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white text-[0.82rem] font-semibold uppercase tracking-wide hover:opacity-90 transition-all shadow-md shadow-sky-300/20 disabled:opacity-60">
                  {loading?<span className="spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"/>:'✉'} Send Message
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
