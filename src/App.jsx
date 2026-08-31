import { useEffect, useRef, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, ChevronDown, Menu, MoveRight, X } from 'lucide-react'
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'
import Lenis from 'lenis'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const heroImage = 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=2200&q=90'
const images = [
  ['Plates', 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=85'],
  ['The room', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85'],
  ['The craft', 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1000&q=85'],
  ['Wine', 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1000&q=85'],
  ['Afterglow', 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1000&q=85'],
  ['Details', 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=1200&q=85'],
]

function Reveal({ children, className = '', delay = 0 }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: .8, delay, ease: [.22, 1, .36, 1] }}>{children}</motion.div>
}

function Counter({ value, suffix = '' }) {
  const inView = useInView({ once: true, margin: '-80px' })
  const [count, setCount] = useState(0)
  useEffect(() => { if (inView) { let frame; const start = performance.now(); const tick = now => { const progress = Math.min((now - start) / 1300, 1); setCount(Math.round(progress * value)); if (progress < 1) frame = requestAnimationFrame(tick) }; frame = requestAnimationFrame(tick); return () => cancelAnimationFrame(frame) } }, [inView, value])
  return <span className="stat-number">{count}{suffix}</span>
}

function MagneticButton({ children, className, href, onClick }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const smoothX = useSpring(x, { stiffness: 150, damping: 15 })
  const smoothY = useSpring(y, { stiffness: 150, damping: 15 })

  const handleMouseMove = e => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const distX = e.clientX - centerX
    const distY = e.clientY - centerY
    const dist = Math.sqrt(distX * distX + distY * distY)
    if (dist < 100) {
      x.set(distX * 0.25)
      y.set(distY * 0.25)
    }
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      onClick={onClick}
      className={className}
      style={{ x: smoothX, y: smoothY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.a>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [progress, setProgress] = useState(0)
  const [cursorState, setCursorState] = useState({ x: 0, y: 0, active: false, text: '' })
  
  const x = useMotionValue(0); const y = useMotionValue(0)
  const smoothX = useSpring(x, { stiffness: 80, damping: 20 }); const smoothY = useSpring(y, { stiffness: 80, damping: 20 })
  const mainRef = useRef(null)
  const lenisRef = useRef(null)
  const heroCanvasRef = useRef(null)

  // Initialize Lenis for smooth scrolling
  useEffect(() => {
    if (!isLoading) {
      const lenis = new Lenis({
        duration: 1.2,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 2,
      })

      lenisRef.current = lenis

      function raf(time) {
        lenis.raf(time)
        requestAnimationFrame(raf)
      }

      const rafId = requestAnimationFrame(raf)
      
      return () => {
        cancelAnimationFrame(rafId)
        lenis.destroy()
      }
    }
  }, [isLoading])

  // Loading animation
  useEffect(() => {
    if (!isLoading) return

    let animationFrame
    let timeoutId
    const startTime = performance.now()

    const tick = now => {
      const nextProgress = Math.min(100, ((now - startTime) / 2100) * 100)
      setProgress(nextProgress)

      if (nextProgress < 100) {
        animationFrame = requestAnimationFrame(tick)
      } else {
        timeoutId = window.setTimeout(() => {
          setIsFadingOut(true)
          window.setTimeout(() => setIsLoading(false), 900)
        }, 500)
      }
    }

    animationFrame = requestAnimationFrame(tick)

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame)
      if (timeoutId) window.clearTimeout(timeoutId)
    }
  }, [isLoading])

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Cinematic ambient canvas for hero atmosphere
  useEffect(() => {
    const canvas = heroCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const particles = Array.from({ length: 38 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 2.2 + 1,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.25,
      hue: 24 + Math.random() * 18,
    }))

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.max(1, Math.floor(rect.width * dpr))
      canvas.height = Math.max(1, Math.floor(rect.height * dpr))
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
    }

    const draw = t => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      ctx.clearRect(0, 0, width, height)

      const glow = ctx.createRadialGradient(width * 0.36, height * 0.32, 0, width * 0.36, height * 0.32, width * 0.8)
      glow.addColorStop(0, 'rgba(199, 116, 67, 0.16)')
      glow.addColorStop(0.45, 'rgba(199, 116, 67, 0.08)')
      glow.addColorStop(1, 'rgba(10, 10, 10, 0)')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, width, height)

      ctx.beginPath()
      ctx.moveTo(width * 0.02, height * 0.7)
      ctx.bezierCurveTo(width * 0.18, height * 0.5, width * 0.42, height * 0.8, width * 0.58, height * 0.68)
      ctx.bezierCurveTo(width * 0.74, height * 0.56, width * 0.9, height * 0.74, width * 0.98, height * 0.65)
      ctx.strokeStyle = 'rgba(226, 181, 138, 0.18)'
      ctx.lineWidth = 1.2
      ctx.stroke()

      particles.forEach((particle, index) => {
        particle.x += particle.vx + Math.sin((t * 0.0008) + index) * 0.003
        particle.y += particle.vy + Math.cos((t * 0.0009) + index) * 0.004

        if (particle.x < 0 || particle.x > 1) particle.vx *= -1
        if (particle.y < 0 || particle.y > 1) particle.vy *= -1

        const px = particle.x * width
        const py = particle.y * height

        ctx.beginPath()
        ctx.fillStyle = `hsla(${particle.hue}, 76%, 72%, 0.9)`
        ctx.arc(px, py, particle.r, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.beginPath()
      for (let x = 0; x <= width; x += 18) {
        const y = height * 0.82 + Math.sin((x * 0.03) + t * 0.0015) * 12
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.strokeStyle = 'rgba(199, 116, 67, 0.12)'
      ctx.lineWidth = 1
      ctx.stroke()

      animationFrame = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    let animationFrame = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', resize)
    }
  }, [])

  // Mouse tracking for sculpture
  const moveSculpture = e => {
    if (window.innerWidth < 768) return // Disable on mobile
    x.set((e.clientX / window.innerWidth - .5) * 24)
    y.set((e.clientY / window.innerHeight - .5) * 18)
  }

  // Custom cursor tracking
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleMouseMove = e => {
      setCursorState(prev => ({ ...prev, x: e.clientX, y: e.clientY }))
    }

    const handleMouseEnter = e => {
      const target = e.target
      if (!target.closest) return
      if (target.closest('.gallery-item') || target.closest('img')) {
        setCursorState(prev => ({ ...prev, active: true, text: 'VIEW' }))
      } else if (target.closest('.button') || target.closest('.reserve-link') || target.closest('.text-link')) {
        setCursorState(prev => ({ ...prev, active: true, text: 'CLICK' }))
      } else if (target.closest('.course')) {
        setCursorState(prev => ({ ...prev, active: true, text: 'EXPLORE' }))
      }
    }

    const handleMouseLeave = () => {
      setCursorState(prev => ({ ...prev, active: false, text: '' }))
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseenter', handleMouseEnter, true)
    document.addEventListener('mouseleave', handleMouseLeave, true)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter, true)
      document.removeEventListener('mouseleave', handleMouseLeave, true)
    }
  }, [])

  if (isLoading) {
    return (
      <div className={`loading-screen ${isFadingOut ? 'is-fading-out' : ''}`} aria-live="polite" aria-label="Loading website">
        <div className="loading-brand">
          <span>ÉLAN</span>
          <small>EST. 2012</small>
        </div>
        <div className="loading-indicator">
          <div className="loading-bar">
            <span className="loading-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="loading-meta">
            <span>Preparing your evening</span>
            <strong>{Math.round(progress)}%</strong>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        @keyframes cursorPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }
      `}</style>
      <main ref={mainRef} onMouseMove={moveSculpture}>
        {/* Custom Cursor */}
        {typeof window !== 'undefined' && window.innerWidth > 1024 && (
          <>
            <div className="cursor-dot" style={{ left: `${cursorState.x}px`, top: `${cursorState.y}px` }} />
            <div className="cursor-ring" style={{ left: `${cursorState.x}px`, top: `${cursorState.y}px`, opacity: cursorState.active ? 1 : 0 }}>
              <span className="cursor-text">{cursorState.text}</span>
            </div>
          </>
        )}

        <header className={scrolled ? 'nav scrolled' : 'nav'}>
          <a className="brand" href="#home"><span>ÉLAN</span><small>EST. 2012</small></a>
          <nav>{['Menu', 'Experience', 'Gallery', 'Contact'].map(item => <a key={item} href={`#${item.toLowerCase()}`}>{item}</a>)}</nav>
          <MagneticButton className="reserve-link" href="#reservation">
            Reserve <ArrowUpRight size={15} />
          </MagneticButton>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button>
        </header>

        {menuOpen && <motion.div className="mobile-menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <a href="#menu" onClick={() => setMenuOpen(false)}>Menu</a>
          <a href="#experience" onClick={() => setMenuOpen(false)}>Experience</a>
          <a href="#gallery" onClick={() => setMenuOpen(false)}>Gallery</a>
          <a href="#cellar" onClick={() => setMenuOpen(false)}>The Cellar</a>
          <a href="#reservation" onClick={() => setMenuOpen(false)}>Reservation</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
        </motion.div>}

        <section className="hero" id="home" style={{ backgroundImage: `linear-gradient(90deg, rgba(13,13,12,.88) 0%, rgba(13,13,12,.56) 48%, rgba(13,13,12,.2) 100%), url(${heroImage})` }}>
          <canvas ref={heroCanvasRef} className="hero-canvas" />
          <div className="hero-copy">
            <motion.p className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .3 }}>FINE DINING, REIMAGINED</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: .45 }}>A taste that<br /><em>lingers like</em><br />candlelight.</motion.h1>
            <motion.p className="hero-desc" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .9 }}>An intimate, two-Michelin-star journey through seasonal cuisine - plated as theatre, served as memory.</motion.p>
            <motion.div className="hero-actions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
              <MagneticButton className="button copper" href="#reservation">
                Reserve a table <ArrowUpRight size={16} />
              </MagneticButton>
              <MagneticButton className="text-link" href="#menu">
                Explore the menu <MoveRight size={17} />
              </MagneticButton>
            </motion.div>
          </div>
          <motion.div className="sculpture" style={{ x: smoothX, y: smoothY }}>
            <div className="wine-glass glass-one">
              <div className="bowl"><div className="liquid" /></div>
              <div className="stem" />
              <div className="base" />
            </div>
            <div className="wine-glass glass-two">
              <div className="bowl"><div className="liquid" /></div>
              <div className="stem" />
              <div className="base" />
            </div>
            <div className="wine-glass glass-three">
              <div className="bowl"><div className="liquid" /></div>
              <div className="stem" />
              <div className="base" />
            </div>
          </motion.div>
          <div className="hero-meta">
            <span>PARIS · FRANCE</span>
            <span className="scroll">Scroll to discover <ChevronDown size={16} /></span>
            <span>48° 51' N · 2° 21' E</span>
          </div>
        </section>

        <section className="manifesto" id="experience">
          <Reveal><p className="eyebrow copper-text">THE EXPERIENCE</p><h2>Fire, patience,<br /><em>precision.</em></h2></Reveal>
          <Reveal delay={.15} className="manifesto-right">
            <p>Our kitchen is driven by seasonality, restraint, and respect for exceptional ingredients. Every plate is designed to create a moment worth remembering.</p>
            <a className="text-link" href="#contact">Discover our story <ArrowDownRight size={17} /></a>
          </Reveal>
        </section>

        <section className="feature-image">
          <img src="https://images.unsplash.com/photo-1515669097368-22e68427d265?auto=format&fit=crop&w=1800&q=85" alt="Chef plating a dish in the ÉLAN kitchen" />
          <div className="image-caption">01 / THE KITCHEN</div>
        </section>

        <section className="stats">
          {[[5, 'yrs', 'of culinary artistry'], [2, '★', 'Michelin stars'], [21, '', 'seasonal signature plates'], [13, 'K+', 'guests served with care']].map(([num, suffix, label], i) => 
            <Reveal key={label} delay={i * .08}>
              <div className="stat">
                <Counter value={num} suffix={suffix} />
                <span>{label}</span>
              </div>
            </Reveal>
          )}
        </section>

        <section className="menu-section" id="menu">
          <Reveal><p className="eyebrow copper-text">THE MENU / 01</p><h2>An evening<br /><em>in courses.</em></h2><p className="section-intro">Tables are invited into a carefully composed progression of flavors.</p></Reveal>
          <div className="course-list">
            {[['01', 'AMUSE-BOUCHE', 'Caviar · Chive · Potato'], ['02', 'FIRST COURSE', 'Scallop · Citrus · Fennel'], ['03', 'SECOND COURSE', 'Wild Mushroom · Truffle · Hazelnut'], ['04', 'MAIN', 'Duck · Cherry · Juniper'], ['05', 'DESSERT', 'Chocolate · Salt · Caramel']].map(([n, title, dish]) => 
              <Reveal key={n}>
                <div className="course"><span>{n}</span><strong>{title}</strong><i>{dish}</i><ArrowUpRight size={18} /></div>
              </Reveal>
            )}
          </div>
          <MagneticButton className="button outline" href="#reservation">
            View full menu <MoveRight size={16} />
          </MagneticButton>
        </section>

        <section className="cellar" id="cellar">
          <Reveal><p className="eyebrow copper-text">A CURATED POUR</p><h2>The cellar.<br /><em>Liquid heritage.</em></h2></Reveal>
          <Reveal delay={.15} className="cellar-content">
            <p>A carefully curated selection of wines from small-batch producers across France and beyond. Each pairing is designed to elevate your experience.</p>
            <div className="cellar-grid">
              {[['Burgundy', '2019 Pinot Noir'], ['Bordeaux', '2017 Pauillac'], ['Champagne', 'Blanc de Blancs'], ['Loire', '2020 Sauvignon Blanc']].map(([region, wine]) => 
                <Reveal key={region} delay={.1}>
                  <div className="cellar-item">
                    <small>{region}</small>
                    <p>{wine}</p>
                  </div>
                </Reveal>
              )}
            </div>
          </Reveal>
        </section>

        <section className="gallery" id="gallery">
          <div className="gallery-heading">
            <Reveal><p className="eyebrow copper-text">A SENSE OF PLACE</p><h2>Inside<br /><em>ÉLAN.</em></h2></Reveal>
            <p>Atmosphere, texture, and the quiet rituals behind every evening.</p>
          </div>
          <div className="gallery-grid">
            {images.map(([label, src], i) => 
              <Reveal key={label} delay={i * .05} className={`gallery-item item-${i + 1}`}>
                <img src={src} alt={label} />
                <span>{label}</span>
              </Reveal>
            )}
          </div>
        </section>

        <section className="reservation" id="reservation">
          <div className="reservation-image"><img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=85" alt="Candlelit dining room at ÉLAN" /></div>
          <div className="reservation-content">
            <p className="eyebrow copper-text">THE EVENING AWAITS</p>
            <h2>Your table<br /><em>awaits.</em></h2>
            <p>Reserve your evening and let us take care of the rest.</p>
            {submitted ? 
              <div className="success">
                <span>✓</span>
                <h3>We have your table.</h3>
                <p>Your request has been received. We look forward to welcoming you.</p>
              </div> 
              : 
              <form onSubmit={e => { e.preventDefault(); setSubmitted(true) }}>
                <div className="form-row">
                  <label>Name<input required placeholder="Your name" /></label>
                  <label>Email<input required type="email" placeholder="you@email.com" /></label>
                </div>
                <div className="form-row">
                  <label>Preferred date<input required type="date" /></label>
                  <label>Time<select defaultValue=""><option value="" disabled>Select a time</option><option>18:30</option><option>19:30</option><option>20:30</option><option>21:00</option></select></label>
                </div>
                <label>Number of guests<select defaultValue="2"><option>2 guests</option><option>3 guests</option><option>4 guests</option><option>5+ guests</option></select></label>
                <MagneticButton className="button copper" href="#" onClick={e => { e.preventDefault(); document.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true })) }}>
                  Confirm reservation <ArrowUpRight size={16} />
                </MagneticButton>
              </form>
            }
          </div>
        </section>

        <section className="contact" id="contact">
          <div><p className="eyebrow copper-text">FIND US</p><h2>Come as you are.<br /><em>Leave changed.</em></h2></div>
          <div className="contact-details">
            <div><small>ADDRESS</small><p>12 Rue de Lumière<br />75008 Paris, France</p></div>
            <div><small>OPENING HOURS</small><p>Tuesday - Saturday<br />18:00 - 23:30</p></div>
            <div><small>CONTACT</small><p>+33 1 42 00 00 00<br /><a href="mailto:hello@elanrestaurant.com">hello@elanrestaurant.com</a></p></div>
          </div>
        </section>

        <section className="newsletter">
          <div><p className="eyebrow copper-text">A NOTE FROM US</p><h2>Join the table.</h2><p>Seasonal menus, private invitations, and restaurant news.</p></div>
          <form onSubmit={e => e.preventDefault()}><input type="email" required placeholder="your@email.com" aria-label="Email address" /><button aria-label="Subscribe"><ArrowUpRight size={19} /></button></form>
        </section>

        <footer>
          <a className="brand" href="#home"><span>ÉLAN</span><small>FINE DINING, REIMAGINED</small></a>
          <div><small>EXPLORE</small><a href="#menu">Menu</a><a href="#experience">Experience</a><a href="#gallery">Gallery</a><a href="#reservation">Reservation</a></div>
          <div><small>CONTACT</small><a href="#contact">12 Rue de Lumière</a><a href="tel:+33142000000">+33 1 42 00 00 00</a><a href="mailto:hello@elanrestaurant.com">hello@elanrestaurant.com</a></div>
          <div className="footer-bottom"><span>© 2026 ÉLAN. All rights reserved.</span><span>Privacy&nbsp;&nbsp;&nbsp; Terms</span><span className="social">◎ &nbsp; f&nbsp;&nbsp;𝕏</span></div>
        </footer>
      </main>
    </>
  )
}

export default App
