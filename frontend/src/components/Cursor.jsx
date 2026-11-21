import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dot=useRef(null), ring=useRef(null), rx=useRef(0), ry=useRef(0), mx=useRef(0), my=useRef(0)

  useEffect(() => {
    if (window.innerWidth <= 768) return

    document.body.classList.add('custom-cursor')
    let animId
    const move = (e) => {
      mx.current = e.clientX
      my.current = e.clientY
      if (dot.current) {
        dot.current.style.left = e.clientX + 'px'
        dot.current.style.top = e.clientY + 'px'
      }
    }

    const loop = () => {
      rx.current += (mx.current - rx.current) * 0.1
      ry.current += (my.current - ry.current) * 0.1
      if (ring.current) {
        ring.current.style.left = rx.current + 'px'
        ring.current.style.top = ry.current + 'px'
      }
      animId = requestAnimationFrame(loop)
    }

    const hover = () => {
      dot.current?.classList.add('!bg-amber-400', 'scale-150')
      ring.current?.classList.add('scale-150', '!border-amber-400/40')
    }
    const unhov = () => {
      dot.current?.classList.remove('!bg-amber-400', 'scale-150')
      ring.current?.classList.remove('scale-150', '!border-amber-400/40')
    }

    const handleMouseOver = (e) => {
      if (e.target.closest('a, button, [role="button"], .star-pick, select')) hover()
    }
    const handleMouseOut = (e) => {
      if (e.target.closest('a, button, [role="button"], .star-pick, select')) unhov()
    }

    document.addEventListener('mousemove', move)
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)
    animId = requestAnimationFrame(loop)

    return () => {
      document.body.classList.remove('custom-cursor')
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <>
      <div ref={dot} className="hidden md:block fixed w-2 h-2 bg-sky-400 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-150 ease-out"/>
      <div ref={ring} className="hidden md:block fixed w-8 h-8 border border-sky-400/50 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-transform duration-150 ease-out"/>
    </>
  )
}
