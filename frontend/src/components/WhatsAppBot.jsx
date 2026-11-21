import { useState, useRef, useEffect } from 'react'
import { logChat, createAppointment } from '../hooks/api'
import { usePortfolioContent } from '../context/ContentContext'

const FLOW = {
  init:     { msg:`👋 Hello! I'm the assistant for *Dr. Shiva Singh*.\n\nHow can I help you today?`, quick:['📅 Book Appointment','ℹ️ About Dr. Singh','🏥 Services','📞 Contact Info','🕐 Consultation Hours','⭐ Leave a Review'] },
  about:    { msg:`👨‍⚕️ *Dr. Shiva Singh*\nMBBS, B.Sc. Critical Care Medicine\nReg. 79855 · 7+ years experience\n\nSpecializes in ICU, ventilator management, and advanced critical care.`, quick:['📅 Book Appointment','🔙 Main Menu'] },
  services: { msg:`🏥 *Services:*\n• ICU/Critical Care Consultation\n• Ventilator Management\n• ACLS & Emergency Care\n• Echocardiography\n• Haemodynamic Monitoring`, quick:['📅 Book Appointment','🔙 Main Menu'] },
  contact:  { msg:`📞 +91-9889527343\n✉️ askdrshivasingh@gmail.com\n📍 Sahara City Homes, IIM Road, Lucknow`, quick:['💬 Open WhatsApp','🔙 Main Menu'] },
  hours:    { msg:`🕐 *Consultation Hours:*\nMon–Sat · 9:00 AM – 12:00 PM\nMon–Sat · 4:00 PM – 7:00 PM\nSunday: By appointment only`, quick:['📅 Book Appointment','🔙 Main Menu'] },
}

export default function WhatsAppBot() {
  const { content }        = usePortfolioContent()
  const photo              = content?.profile?.photo || '/doctor.jpg'
  const [open,setOpen]     = useState(false)
  const [badge,setBadge]   = useState(false)
  const [msgs,setMsgs]     = useState([])
  const [quick,setQuick]   = useState([])
  const [input,setInput]   = useState('')
  const [state,setState]   = useState('init')
  const [typing,setTyping] = useState(false)
  const [ud,setUd]         = useState({})
  const msgsRef = useRef(null)

  useEffect(()=>{ setTimeout(()=>setBadge(true), 3200) },[])
  useEffect(()=>{ if(msgsRef.current) msgsRef.current.scrollTop=msgsRef.current.scrollHeight },[msgs,typing])

  const openBot  = () => { setOpen(true); setBadge(false); if(msgs.length===0) initBot() }
  const initBot  = () => addTyping(FLOW.init.msg, FLOW.init.quick, 700)
  const nowTime  = () => new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})
  const addBot   = (text,q=[]) => { setMsgs(m=>[...m,{from:'bot',text,time:nowTime()}]); setQuick(q); setTyping(false) }
  const addUser  = (text) => { setMsgs(m=>[...m,{from:'user',text,time:nowTime()}]); setQuick([]); logChat({message:text,state}).catch(()=>{}) }
  const addTyping= (text,q=[],delay=900) => { setTyping(true); setTimeout(()=>addBot(text,q),delay) }

  const handleQuick = (q) => {
    addUser(q)
    if(q==='🔙 Main Menu')           { setState('init');    addTyping(FLOW.init.msg,    FLOW.init.quick,    600); return }
    if(q==='📅 Book Appointment')    { setState('book_name'); addTyping(`I'll help you schedule an appointment with Dr. Shiva Singh 🗓️\n\nPlease share your *full name*:`); return }
    if(q==='ℹ️ About Dr. Singh')     { setState('about');   addTyping(FLOW.about.msg,   FLOW.about.quick);  return }
    if(q==='🏥 Services')            { setState('services');addTyping(FLOW.services.msg,FLOW.services.quick);return }
    if(q==='📞 Contact Info')        { setState('contact'); addTyping(FLOW.contact.msg, FLOW.contact.quick);return }
    if(q==='🕐 Consultation Hours')  { setState('hours');   addTyping(FLOW.hours.msg,   FLOW.hours.quick);  return }
    if(q==='💬 Open WhatsApp')       { window.open('https://wa.me/919889527343','_blank'); return }
    if(q==='⭐ Leave a Review')       { setOpen(false); setTimeout(()=>document.getElementById('reviews')?.scrollIntoView({behavior:'smooth'}),200); return }
    if(q==='📞 Call Now')            { window.location.href='tel:+919889527343'; return }
    if(q==='🏥 In-Person'||q==='💻 Video Call') {
      const type=q.includes('Person')?'In-Person':'Video Call'
      setUd(u=>({...u,type})); setState('book_date')
      addTyping(`*${type}* selected ✅\n\nPlease share your *preferred date* (e.g., 25 March 2026).`); return
    }
    setState('init')
    addTyping(FLOW.init.msg, FLOW.init.quick, 600)
  }

  const handleInput = (text) => {
    switch(state) {
      case 'init': {
        const lower = text.toLowerCase()
        if (lower.includes('book') || lower.includes('appointment')) {
          setState('book_name')
          addTyping(`I'd be glad to help you book an appointment with Dr. Shiva Singh 🗓️\n\nPlease share your *full name*:`)
        } else if (lower.includes('contact') || lower.includes('phone') || lower.includes('number')) {
          setState('contact')
          addTyping(FLOW.contact.msg, FLOW.contact.quick)
        } else if (lower.includes('service') || lower.includes('icu') || lower.includes('ventilator')) {
          setState('services')
          addTyping(FLOW.services.msg, FLOW.services.quick)
        } else {
          addTyping(`Thank you for reaching out! Please choose an option below or let me know how I can assist:`, FLOW.init.quick)
        }
        break
      }
      case 'book_name':   setUd(u=>({...u,name:text}));   setState('book_phone');  addTyping(`Nice to meet you, *${text}*! 😊\n\nPlease share your *phone number*.`); break
      case 'book_phone':  setUd(u=>({...u,phone:text}));  setState('book_reason'); addTyping(`Got it! 📱\n\nWhat is the *reason for your visit*?`); break
      case 'book_reason': setUd(u=>({...u,reason:text})); setState('book_type');   addTyping(`Thank you!\n\nWould you prefer 🏥 *In-Person* or 💻 *Video Call*?`,['🏥 In-Person','💻 Video Call']); break
      case 'book_type': {
        const type = text.toLowerCase().includes('video') ? 'Video Call' : 'In-Person'
        setUd(u=>({...u,type})); setState('book_date')
        addTyping(`*${type}* selected ✅\n\nPlease share your *preferred date* (e.g., 25 March 2026).`)
        break
      }
      case 'book_date': {
        const aptRecord = {
          name: ud.name || 'Patient',
          phone: ud.phone || '',
          reason: ud.reason || '',
          type: ud.type || 'In-Person',
          date: text,
          time_slot: '10:00 AM',
          source: 'whatsapp_bot'
        }
        setState('done')
        createAppointment(aptRecord)
          .then(({ data: res }) => {
            const idBadge = res.apt_id ? `\nBooking ID: *${res.apt_id}*` : ''
            addTyping(`✅ *Appointment Request Confirmed!*${idBadge}\n\n👤 ${aptRecord.name}\n📅 ${text}\n🏥 ${aptRecord.type}\n\nDr. Singh's team will confirm details on *${aptRecord.phone}* within 2 hours. 🙏`, ['📞 Call Now', '🔙 Main Menu'], 1000)
          })
          .catch(() => {
            addTyping(`✅ *Appointment Request Received!*\n\n👤 ${aptRecord.name}\n📅 ${text}\n🏥 ${aptRecord.type}\n\nDr. Singh's team will confirm on *${aptRecord.phone}* within 2 hours. 🙏`, ['📞 Call Now', '🔙 Main Menu'], 1000)
          })
        break
      }
      case 'done': setState('init'); addTyping(FLOW.init.msg,FLOW.init.quick,600); break
      default:     setState('init'); addTyping(FLOW.init.msg,FLOW.init.quick,600)
    }
  }

  const send = () => { const t=input.trim(); if(!t) return; setInput(''); addUser(t); handleInput(t) }
  const fmt  = (t) => t.replace(/\*(.*?)\*/g,'<strong>$1</strong>').replace(/\n/g,'<br/>')

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat window */}
      <div className={`w-[310px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[490px] transition-all duration-300 origin-bottom-right ${open?'opacity-100 scale-100 pointer-events-auto':'opacity-0 scale-95 pointer-events-none'}`}>
        {/* Header */}
        <div className="flex items-center gap-2.5 p-3.5 bg-gradient-to-r from-green-500 to-green-600 flex-shrink-0">
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/30 flex-shrink-0">
            <img src={photo} alt="Dr. Singh" className="w-full h-full object-cover object-top"/>
          </div>
          <div className="flex-1">
            <div className="text-white font-semibold text-[0.86rem]">Dr. Shiva Singh</div>
            <div className="text-green-100 text-[0.67rem] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-200" style={{animation:'pulse 2s infinite'}}/>
              Online · Replies quickly
            </div>
          </div>
          <button onClick={()=>setOpen(false)} className="w-7 h-7 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center text-white text-sm transition-colors">✕</button>
        </div>

        {/* Messages */}
        <div ref={msgsRef} className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 bg-gray-50 dark:bg-gray-950 min-h-[160px] max-h-[260px]">
          {msgs.map((m,i)=>(
            <div key={i} className={`max-w-[88%] ${m.from==='user'?'self-end':' self-start'}`}>
              <div className={`px-3 py-2 rounded-xl text-[0.79rem] leading-snug ${m.from==='bot'?'bg-white dark:bg-white/10 border border-gray-100 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-tl-sm':'bg-gradient-to-br from-green-500 to-green-600 text-white rounded-tr-sm'}`}
                dangerouslySetInnerHTML={{__html:fmt(m.text)}}/>
              <div className={`text-[8.5px] opacity-50 mt-0.5 ${m.from==='user'?'text-right':''}`}>{m.time}</div>
            </div>
          ))}
          {typing&&(
            <div className="self-start flex gap-1 items-center bg-white dark:bg-white/10 border border-gray-100 dark:border-white/10 rounded-xl rounded-tl-sm px-3 py-2.5">
              <span className="wa-dot bg-gray-400 dark:bg-gray-500"/><span className="wa-dot bg-gray-400 dark:bg-gray-500"/><span className="wa-dot bg-gray-400 dark:bg-gray-500"/>
            </div>
          )}
        </div>

        {/* Quick replies */}
        {quick.length>0&&(
          <div className="flex flex-wrap gap-1.5 px-3 py-2 border-t border-gray-100 dark:border-white/10 bg-white dark:bg-gray-900 flex-shrink-0">
            {quick.map(q=>(
              <button key={q} onClick={()=>handleQuick(q)} className="px-2.5 py-1 rounded-full border border-green-400/40 bg-green-50/50 dark:bg-green-900/10 text-green-600 dark:text-green-400 text-[0.71rem] font-medium hover:bg-green-100 dark:hover:bg-green-900/20 transition-colors">{q}</button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2 px-3 py-2.5 border-t border-gray-100 dark:border-white/10 bg-white dark:bg-gray-900 flex-shrink-0">
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Type a message…"
            className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full px-3 py-1.5 text-[0.79rem] text-gray-800 dark:text-gray-200 outline-none focus:border-green-400 transition-colors placeholder:text-gray-300"/>
          <button onClick={send} className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-sm hover:scale-105 transition-transform flex-shrink-0">➤</button>
        </div>
      </div>

      {/* FAB button */}
      <button onClick={openBot} className="relative w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-2xl shadow-xl shadow-green-400/40 hover:scale-105 transition-all">
        💬
        {badge&&<span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 border-2 border-white dark:border-gray-900 flex items-center justify-center text-white text-[9px] font-bold" style={{animation:'pop 1s ease infinite'}}>1</span>}
      </button>
    </div>
  )
}
