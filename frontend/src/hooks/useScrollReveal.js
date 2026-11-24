import { useEffect, useRef } from 'react'

export function useScrollReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.classList.add('visible')
        el.querySelectorAll('.skill-bar[data-w]').forEach(b => b.style.width = b.dataset.w + '%')
        el.querySelectorAll('.rb-fill[data-p]').forEach(b => setTimeout(() => b.style.width = b.dataset.p + '%', 200))
        obs.unobserve(el)
      }
    }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}
