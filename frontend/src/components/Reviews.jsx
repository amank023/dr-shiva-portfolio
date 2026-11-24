import { useState, useEffect } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { getReviews, createReview } from '../hooks/api'
import toast from 'react-hot-toast'

const DEFAULT_REVIEWS = [
  { id: 1, name: 'Ramesh Kumar', relation: 'Patient', rating: 5, text: "Dr. Singh saved my father's life when he was on ventilator support in ICCU. His expertise in critical care is exceptional and he explained every intervention clearly.", color: '#0284c7', verified: 1, created_at: '2026-03-10T10:00:00.000Z' },
  { id: 2, name: 'Priya Sharma', relation: "Patient's Family", rating: 5, text: "My mother was in the ICU for 2 weeks. Dr. Shiva Singh was extremely professional and caring. The daily clinical updates made a terrifying time manageable.", color: '#0d9488', verified: 1, created_at: '2026-03-08T14:30:00.000Z' },
  { id: 3, name: 'Anil Mishra', relation: 'Patient', rating: 5, text: "Outstanding physician with deep knowledge of critical care protocols. Meticulous in haemodynamic management. Highly recommended for complex cases.", color: '#2563eb', verified: 1, created_at: '2026-02-25T09:15:00.000Z' },
  { id: 4, name: 'Dr. Sunita Verma', relation: 'Colleague', rating: 5, text: "I have had the privilege of working alongside Dr. Singh in critical care rounds. His acute clinical judgment and adherence to infection control are world-class.", color: '#059669', verified: 1, created_at: '2026-02-18T16:45:00.000Z' },
  { id: 5, name: 'Kavita Singh', relation: "Patient's Family", rating: 5, text: "Very knowledgeable and experienced ICU doctor. His calm demeanor and prompt critical decisions gave us full confidence during emergency hospitalization.", color: '#d97706', verified: 1, created_at: '2026-02-05T11:20:00.000Z' }
]

function Stars({ n, size = 14 }) {
  const ratingNum = Math.round(Number(n) || 0)
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ fontSize: size }} className={i <= ratingNum ? 'text-amber-400' : 'text-gray-200 dark:text-gray-700'}>
          {i <= ratingNum ? '★' : '☆'}
        </span>
      ))}
    </div>
  )
}

const LABELS = ['', 'Needs Improvement', 'Fair Care', 'Good Experience', 'Very Good Treatment', 'Exceptional Clinical Care']

export default function Reviews() {
  const [reviews, setReviews] = useState(DEFAULT_REVIEWS)
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(0)
  const [name, setName] = useState('')
  const [relation, setRelation] = useState('Patient')
  const [text, setText] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const ref = useScrollReveal()

  const fetchReviews = async () => {
    try {
      const { data } = await getReviews()
      if (Array.isArray(data) && data.length > 0) {
        setReviews(data)
      } else {
        setReviews(DEFAULT_REVIEWS)
      }
    } catch (err) {
      console.warn('Could not fetch reviews from server, using default reviews:', err)
      setReviews(DEFAULT_REVIEWS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  const avg = reviews.length
    ? reviews.reduce((s, r) => s + (Number(r.rating) || 5), 0) / reviews.length
    : 5.0

  const dist = [1, 2, 3, 4, 5].map(n =>
    reviews.filter(r => Math.round(Number(r.rating) || 0) === n).length
  )
  const maxD = Math.max(...dist, 1)

  const handleSubmit = async () => {
    if (!name.trim()) return toast.error('Please enter your name')
    if (!rating) return toast.error('Please select a rating')
    if (text.trim().length < 12) return toast.error('Please write at least 12 characters')

    setSubmitting(true)
    try {
      await createReview({ name: name.trim(), relation, rating: Number(rating), text: text.trim() })
      toast.success('Review submitted! Thank you 🙏')
      setSubmitted(true)
      await fetchReviews()
    } catch {
      toast.error('Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setRating(0)
    setName('')
    setText('')
    setRelation('Patient')
    setSubmitted(false)
  }

  const ic = 'w-full bg-sky-50/50 dark:bg-white/5 border-[1.5px] border-sky-100 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-gray-800 dark:text-gray-200 text-[0.82rem] outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900 transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600'

  return (
    <section id="reviews" className="py-20 px-[5%] bg-sky-50/70 dark:bg-gray-950/80 transition-colors duration-300 relative overflow-hidden">
      {/* Background medical glow */}
      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-sky-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto reveal" ref={ref}>
        {/* Section Header & Rating Overview */}
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100/80 dark:bg-sky-950/70 border border-sky-200/80 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-[10px] uppercase tracking-[0.2em] font-semibold mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              ⭐ Clinical Outcomes &amp; Patient Trust
            </div>
            <h2 className="font-display font-bold text-gray-900 dark:text-white" style={{ fontSize: 'clamp(1.9rem,3.5vw,2.75rem)' }}>
              Patient <em className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-teal-500 to-sky-700 dark:from-sky-400 dark:via-teal-300 dark:to-cyan-400 font-light italic">Testimonials</em>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-1 max-w-xl font-light">
              Real recovery experiences from patients, families, and critical care medical colleagues.
            </p>
            <div className="w-12 h-1 bg-gradient-to-r from-sky-500 to-teal-400 rounded-full mt-3" />
          </div>

          {/* Rating Summary Capsule */}
          <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center justify-center gap-5 medical-card p-5 shadow-sm">
            <div className="text-center sm:text-left">
              <div className="flex items-baseline gap-2">
                <span className="font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-teal-600 dark:from-sky-400 dark:to-teal-300 text-5xl leading-none">
                  {avg.toFixed(1)}
                </span>
                <span className="text-gray-400 text-sm font-semibold">/ 5.0</span>
              </div>
              <div className="mt-1.5">
                <Stars n={Math.round(avg)} size={16} />
              </div>
              <div className="text-[11px] text-gray-400 mt-1 font-light">
                {reviews.length} Verified Review{reviews.length !== 1 ? 's' : ''}
              </div>
            </div>

            <div className="hidden sm:block w-px h-16 bg-sky-100 dark:bg-white/10 flex-shrink-0" />
            <div className="w-full h-px bg-sky-100 dark:bg-white/10 sm:hidden" />

            <div className="flex flex-col gap-1.5 w-full sm:w-auto min-w-[140px]">
              {[5, 4, 3, 2, 1].map(n => (
                <div key={n} className="flex items-center gap-2 text-[0.74rem] text-gray-400">
                  <span className="text-amber-400 text-xs">★</span>
                  <span className="w-2">{n}</span>
                  <div className="flex-1 h-1.5 bg-sky-100 dark:bg-sky-950/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-teal-400 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.round((dist[n - 1] / maxD) * 100)}%` }}
                    />
                  </div>
                  <span className="min-w-[16px] text-right font-medium text-[10px] text-gray-500 dark:text-gray-400">{dist[n - 1]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="spin w-8 h-8 border-4 border-sky-100 border-t-sky-500 rounded-full" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-16 medical-card mb-10 p-6">
            <div className="text-4xl mb-2">⭐</div>
            <p className="text-gray-700 dark:text-gray-200 font-semibold text-sm">No reviews yet</p>
            <p className="text-gray-400 text-xs mt-1">Be the first to share your experience with Dr. Shiva Singh!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-12">
            {reviews.map(r => {
              const safeName = r.name || 'Anonymous Patient'
              const ini = safeName
                .trim()
                .split(/\s+/)
                .map(w => w[0])
                .filter(Boolean)
                .join('')
                .slice(0, 2)
                .toUpperCase() || 'P'

              const dateDisplay = r.created_at
                ? new Date(r.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
                : 'Recent'

              return (
                <div
                  key={r.id}
                  className="medical-card p-5 group hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Reviewer Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-xs border border-white/40"
                          style={{ background: r.color || '#0284c7' }}
                        >
                          {ini}
                        </div>
                        <div>
                          <div className="text-gray-800 dark:text-gray-100 font-semibold text-[0.88rem] group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                            {safeName}
                          </div>
                          <div className="text-gray-400 text-[0.72rem] font-light flex items-center gap-1.5">
                            <span className="text-sky-600 dark:text-sky-400 font-medium">{r.relation || 'Patient'}</span>
                            <span>•</span>
                            <span>{dateDisplay}</span>
                          </div>
                        </div>
                      </div>

                      <Stars n={r.rating} />
                    </div>

                    {/* Review Text */}
                    <div className="relative pl-3 border-l-2 border-teal-500/50 dark:border-teal-400/40 my-3">
                      <p className="text-gray-600 dark:text-gray-300 text-[0.8rem] leading-relaxed font-light italic">
                        "{r.text}"
                      </p>
                    </div>
                  </div>

                  {/* Verification Footer Badge */}
                  <div className="pt-3 border-t border-sky-100/80 dark:border-white/10 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-teal-600 dark:text-teal-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                      {r.verified ? 'Verified Clinical Case' : 'Patient Feedback'}
                    </span>
                    <span className="text-[10px] text-gray-400">🏥 Critical Care</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Share Feedback Form */}
        <div className="medical-card p-6 sm:p-8 max-w-2xl mx-auto shadow-md relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-teal-400 to-sky-600" />

          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">✍️</span>
            <h3 className="font-display font-bold text-gray-900 dark:text-white text-xl sm:text-2xl">
              Share Your <em className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-teal-600 dark:from-sky-400 dark:to-teal-300 font-light italic">Experience</em>
            </h3>
          </div>
          <p className="text-gray-400 text-xs font-light mb-6">
            Your clinical recovery experience helps future critical care patients and families make confident medical decisions.
          </p>

          {submitted ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <div className="w-14 h-14 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 flex items-center justify-center text-3xl">
                ✓
              </div>
              <div className="text-gray-800 dark:text-gray-200 font-bold text-base">Thank you for your valuable feedback!</div>
              <p className="text-gray-400 text-xs max-w-sm">Your feedback has been recorded and will assist prospective patients.</p>
              <button
                onClick={resetForm}
                className="mt-3 px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 text-white text-xs font-semibold hover:opacity-90 transition-all shadow-md shadow-sky-500/20"
              >
                ✍️ Submit Another Review
              </button>
            </div>
          ) : (
            <>
              {/* Star Rating Picker */}
              <div className="mb-5 p-3 rounded-xl bg-sky-50/60 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-800">
                <label className="block text-[9.5px] text-gray-500 dark:text-gray-400 uppercase tracking-[0.16em] mb-2 font-semibold">
                  Overall Care Rating *
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button
                        type="button"
                        key={n}
                        className={`text-2xl transition-transform hover:scale-125 focus:outline-none ${
                          rating >= n ? 'opacity-100 scale-110' : 'opacity-40 hover:opacity-80'
                        }`}
                        onClick={() => setRating(n)}
                      >
                        ⭐
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <span className="text-xs font-semibold text-sky-600 dark:text-sky-400 ml-2">
                      — {LABELS[rating]}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-[9px] text-gray-400 uppercase tracking-[0.15em] mb-1.5 font-medium">Full Name *</label>
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Patient or family name"
                    className={ic}
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-gray-400 uppercase tracking-[0.15em] mb-1.5 font-medium">Relationship to Care</label>
                  <select
                    value={relation}
                    onChange={e => setRelation(e.target.value)}
                    className={ic}
                  >
                    <option>Patient</option>
                    <option>Patient's Family</option>
                    <option>Medical Colleague</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-[9px] text-gray-400 uppercase tracking-[0.15em] mb-1.5 font-medium">Your Review / Recovery Details *</label>
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  rows={4}
                  placeholder="Share details regarding consultation, bedside manner, or ICU treatment outcome…"
                  className={`${ic} resize-none`}
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 via-teal-500 to-sky-600 text-white text-[0.82rem] font-semibold uppercase tracking-wider hover:opacity-95 transition-all shadow-lg shadow-sky-500/25 disabled:opacity-60 cursor-pointer"
              >
                {submitting ? <span className="spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> : '⭐'} Submit Patient Review
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
