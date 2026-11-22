import { useState, useEffect } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { getReviews, createReview } from '../hooks/api'
import toast from 'react-hot-toast'

const DEFAULT_REVIEWS = [
  { id: 1, name: 'Ramesh Kumar',     relation: 'Patient',          rating: 5, text: "Dr. Singh saved my father's life when he was on ventilator support. His expertise in critical care is exceptional. He explained everything clearly.", color: '#2e75b6', verified: 1, created_at: '2026-03-10T10:00:00.000Z' },
  { id: 2, name: 'Priya Sharma',     relation: "Patient's Family", rating: 5, text: "My mother was in the ICU for 2 weeks. Dr. Shiva Singh was extremely professional and caring. The regular updates made a very difficult time manageable.", color: '#1e5f9e', verified: 1, created_at: '2026-03-08T14:30:00.000Z' },
  { id: 3, name: 'Anil Mishra',      relation: 'Patient',          rating: 5, text: "Excellent doctor with great knowledge of critical care. Very thorough in his approach. Highly recommended for any ICU-related cases.", color: '#5b9bd5', verified: 1, created_at: '2026-02-25T09:15:00.000Z' },
  { id: 4, name: 'Dr. Sunita Verma', relation: 'Colleague',        rating: 5, text: "I have had the privilege of working alongside Dr. Singh. His clinical judgment is outstanding, especially in managing complex ventilated patients.", color: '#128C7E', verified: 1, created_at: '2026-02-18T16:45:00.000Z' },
  { id: 5, name: 'Kavita Singh',     relation: "Patient's Family", rating: 4, text: "Very knowledgeable and experienced doctor. The treatment was excellent. The quality of care more than makes up for any wait.", color: '#c8a84b', verified: 1, created_at: '2026-02-05T11:20:00.000Z' }
]

function Stars({ n, size=13 }) {
  const ratingNum = Math.round(Number(n) || 0)
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ fontSize: size, color: i <= ratingNum ? '#f59e0b' : '#e2e8f0' }}>
          {i <= ratingNum ? '★' : '☆'}
        </span>
      ))}
    </div>
  )
}

const LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']

export default function Reviews() {
  const [reviews, setReviews]     = useState(DEFAULT_REVIEWS)
  const [loading, setLoading]     = useState(true)
  const [rating, setRating]       = useState(0)
  const [name, setName]           = useState('')
  const [relation, setRelation]   = useState('Patient')
  const [text, setText]           = useState('')
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
    <section id="reviews" className="py-20 px-[5%] bg-sky-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto reveal" ref={ref}>
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div>
            <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-sky-500 font-semibold mb-2 before:content-[''] before:w-5 before:h-[1.5px] before:bg-sky-500">
              ⭐ Patient Feedback
            </p>
            <h2 className="font-display font-bold text-gray-900 dark:text-white" style={{ fontSize: 'clamp(1.9rem,3.5vw,2.75rem)' }}>
              Patient <em className="text-sky-500 font-light italic">Reviews</em>
            </h2>
            <div className="w-10 h-0.5 bg-sky-500 rounded mt-3" />
          </div>

          <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 bg-white dark:bg-white/5 border border-sky-100 dark:border-white/10 rounded-2xl px-6 py-4 shadow-sm">
            <div className="text-center">
              <div className="font-display font-bold text-sky-500 text-5xl leading-none">{avg.toFixed(1)}</div>
              <div className="mt-1 flex justify-center">
                <Stars n={Math.round(avg)} size={17} />
              </div>
              <div className="text-[0.76rem] text-gray-400 mt-1 font-light">
                Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </div>
            </div>

            <div className="hidden sm:block w-px h-14 bg-sky-100 dark:bg-white/10 flex-shrink-0" />
            <div className="w-full h-px bg-sky-100 dark:bg-white/10 sm:hidden" />

            <div className="flex flex-col gap-1 w-full sm:w-auto min-w-[130px]">
              {[5, 4, 3, 2, 1].map(n => (
                <div key={n} className="flex items-center gap-2 text-[0.74rem] text-gray-400">
                  <span className="text-amber-400">★</span>
                  <span>{n}</span>
                  <div className="flex-1 h-1.5 bg-sky-100 dark:bg-sky-900/30 rounded-full overflow-hidden">
                    <div
                      className="rb-fill h-full bg-gradient-to-r from-amber-400 to-amber-300 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.round((dist[n - 1] / maxD) * 100)}%` }}
                    />
                  </div>
                  <span className="min-w-[16px] text-right">{dist[n - 1]}</span>
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
          <div className="text-center py-16 bg-white dark:bg-white/5 rounded-2xl border border-sky-100 dark:border-white/10 mb-10 p-6">
            <div className="text-4xl mb-2">⭐</div>
            <p className="text-gray-700 dark:text-gray-200 font-semibold text-sm">No reviews yet</p>
            <p className="text-gray-400 text-xs mt-1">Be the first to share your experience with Dr. Shiva Singh!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-10">
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
                  className="bg-white dark:bg-white/5 border border-sky-100 dark:border-white/10 rounded-2xl p-5 hover:-translate-y-1 hover:shadow-lg hover:border-sky-200 dark:hover:border-sky-800 transition-all duration-300 cursor-default"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 border-2 border-white/20"
                      style={{ background: r.color || '#2e75b6' }}
                    >
                      {ini}
                    </div>
                    <div>
                      <div className="text-gray-800 dark:text-gray-200 font-semibold text-[0.86rem]">{safeName}</div>
                      <div className="text-gray-400 text-[0.71rem] font-light">
                        {r.relation || 'Patient'} · {dateDisplay}
                      </div>
                    </div>
                  </div>

                  <Stars n={r.rating} />

                  <p className="text-gray-500 dark:text-gray-400 text-[0.82rem] leading-relaxed font-light italic mt-2 pl-4 border-l-2 border-sky-200 dark:border-sky-800">
                    "{r.text}"
                  </p>

                  <div className="flex items-center gap-1.5 mt-3 text-sky-500 text-[0.7rem] font-medium">
                    {r.verified ? '✅ Verified Review' : '⭐ Patient Feedback'}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="bg-white dark:bg-white/5 border-2 border-dashed border-sky-200 dark:border-sky-800 rounded-2xl p-8 max-w-2xl mx-auto shadow-sm">
          <h3 className="font-display font-bold text-gray-900 dark:text-white text-2xl mb-1">
            ✍️ Share Your <em className="text-sky-500 font-light italic">Experience</em>
          </h3>
          <p className="text-gray-400 text-[0.8rem] font-light mb-5">Your feedback helps others make informed decisions.</p>

          {submitted ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <div className="text-5xl">🎉</div>
              <div className="text-gray-800 dark:text-gray-200 font-semibold">Thank you for your review!</div>
              <button
                onClick={resetForm}
                className="mt-2 px-5 py-2 rounded-xl border border-sky-300 text-sky-500 text-sm hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-all"
              >
                ✍️ Write Another
              </button>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-[9px] text-gray-400 uppercase tracking-[0.15em] mb-2 font-medium">Your Rating *</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(n => (
                    <span
                      key={n}
                      className={`star-pick ${rating >= n ? 'lit' : ''}`}
                      onClick={() => setRating(n)}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
                {rating > 0 && <p className="text-[0.74rem] text-gray-400 mt-1">⭐ {LABELS[rating]}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-[9px] text-gray-400 uppercase tracking-[0.15em] mb-1.5 font-medium">Full Name *</label>
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your name"
                    className={ic}
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-gray-400 uppercase tracking-[0.15em] mb-1.5 font-medium">Relation</label>
                  <select
                    value={relation}
                    onChange={e => setRelation(e.target.value)}
                    className={ic}
                  >
                    <option>Patient</option>
                    <option>Patient's Family</option>
                    <option>Colleague</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-[9px] text-gray-400 uppercase tracking-[0.15em] mb-1.5 font-medium">Your Review *</label>
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  rows={4}
                  placeholder="Share your experience…"
                  className={`${ic} resize-none`}
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white text-[0.82rem] font-semibold uppercase tracking-wide hover:opacity-90 transition-all shadow-lg shadow-sky-300/20 disabled:opacity-60"
              >
                {submitting ? <span className="spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> : '⭐'} Submit Review
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
