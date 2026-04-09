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
      }
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}
