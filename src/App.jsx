import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Flower2,
  Gift,
  Heart,
  Cake,
  GraduationCap,
  MapPin,
  Clock,
  Phone,
  ArrowUpRight,
  ArrowRight,
  Menu,
  X,
  Sparkles,
} from 'lucide-react'
import Petals from './components/Petals'

gsap.registerPlugin(ScrollTrigger)

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ----------------------------------------------------------------
   Constants
---------------------------------------------------------------- */
const LINKS = {
  saipos: 'https://angelscoffeebr.saipos.com',
  whatsapp: 'https://wa.me/5562986205474',
  instagram: 'https://instagram.com/angelscoffeebr',
  maps: 'https://www.google.com/maps/search/?api=1&query=Av.+Transbrasiliana+170-B+Centro+Uruaçu+GO',
  mapsEmbed:
    'https://maps.google.com/maps?q=Av.+Transbrasiliana+170-B+Centro+Uruaçu+GO&output=embed',
}

const NAV_LINKS = [
  { label: 'Início', href: '#inicio' },
  { label: 'História', href: '#historia' },
  { label: 'Café', href: '#cafe' },
  { label: 'Flores', href: '#flores' },
  { label: 'Ocasiões', href: '#ocasioes' },
  { label: 'Contato', href: '#contato' },
]

/* ----------------------------------------------------------------
   Inline Instagram icon (not in this lucide build)
---------------------------------------------------------------- */
function InstagramIcon({ className = 'h-5 w-5' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}

/* ----------------------------------------------------------------
   Shared helpers
---------------------------------------------------------------- */
function Eyebrow({ children, className = '' }) {
  return (
    <span
      className={`inline-block font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-sage ${className}`}
    >
      {children}
    </span>
  )
}

function CTAButton({
  href,
  children,
  variant = 'primary',
  icon: Icon = ArrowUpRight,
  className = '',
}) {
  const base =
    'magnetic-btn inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full font-semibold'
  const styles =
    variant === 'primary'
      ? 'bg-accent text-deep shadow-xl shadow-accent/30'
      : variant === 'dark'
      ? 'bg-primary text-background shadow-lg shadow-primary/30'
      : 'glass-dark text-white border border-white/20'
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${styles} ${className}`}
    >
      {children}
      {Icon && <Icon className="h-4 w-4" strokeWidth={2.4} />}
    </a>
  )
}

/* CountUp — IntersectionObserver + requestAnimationFrame */
function CountUp({ target, duration = 1800, suffix = '' }) {
  const [count, setCount] = useState(() => (prefersReducedMotion ? target : 0))
  const elemRef = useRef(null)
  const startedRef = useRef(false)

  useEffect(() => {
    const el = elemRef.current
    if (!el || prefersReducedMotion) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !startedRef.current) {
            startedRef.current = true
            const startTime = performance.now()
            const animate = (now) => {
              const progress = Math.min((now - startTime) / duration, 1)
              const eased = 1 - Math.pow(1 - progress, 3)
              setCount(Math.floor(target * eased))
              if (progress < 1) requestAnimationFrame(animate)
              else setCount(target)
            }
            requestAnimationFrame(animate)
          }
        })
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return (
    <span ref={elemRef} className="tabular-nums">
      {count}
      {suffix}
    </span>
  )
}

/* useInView — bulletproof reveal trigger (IntersectionObserver).
   Mirrors the proven CountUp approach. Guarantees visibility:
   - reduced motion -> visible immediately
   - no IntersectionObserver support -> visible immediately
   - safety timeout -> visible even if the observer somehow never fires
   Content is NEVER left permanently invisible. */
function useInView({ once = true, rootMargin = '0px 0px -8% 0px', threshold = 0.12 } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(prefersReducedMotion)

  useEffect(() => {
    if (prefersReducedMotion) {
      setInView(true)
      return
    }
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true)
            if (once) observer.disconnect()
          } else if (!once) {
            setInView(false)
          }
        })
      },
      { rootMargin, threshold }
    )
    observer.observe(el)
    // Safety net: if the observer never fires, reveal anyway.
    const fallback = window.setTimeout(() => setInView(true), 2500)
    return () => {
      observer.disconnect()
      window.clearTimeout(fallback)
    }
  }, [once, rootMargin, threshold])

  return [ref, inView]
}

/* Reveal — wrapper that fades + lifts its children into view.
   Starts at opacity-0/translate-y-6 and transitions to fully visible.
   Falls back to fully visible (see useInView) so nothing stays hidden. */
function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const [ref, inView] = useInView()
  return (
    <Tag
      ref={ref}
      className={`transition-all duration-700 ease-out will-change-transform ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      } ${className}`}
      style={{ transitionDelay: inView ? `${delay}ms` : '0ms' }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/* ----------------------------------------------------------------
   Navbar
---------------------------------------------------------------- */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
          scrolled ? 'glass shadow-lg shadow-primary/10' : 'bg-transparent'
        } rounded-full px-4 sm:px-6 py-2.5 w-[calc(100%-2rem)] max-w-5xl`}
      >
        <div className="flex items-center justify-between gap-6">
          <a href="#inicio" className="flex items-center gap-2.5 group">
            <img
              src="/img/logo/logo.png"
              alt="Angels Coffee Br"
              className="h-9 w-9 rounded-full object-cover ring-1 ring-accent/40 group-hover:ring-accent transition"
            />
            <span
              className={`font-display font-bold tracking-tight text-base sm:text-lg ${
                scrolled ? 'text-ink' : 'text-white'
              } transition-colors`}
            >
              Angels Coffee Br
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium tracking-tight lift-on-hover ${
                  scrolled
                    ? 'text-ink/70 hover:text-accent-dark'
                    : 'text-white/90 hover:text-accent'
                } transition-colors`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <a
            href={LINKS.saipos}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline-flex magnetic-btn items-center gap-1.5 bg-primary text-background px-4 py-2 rounded-full text-sm font-semibold shadow-lg shadow-primary/30"
          >
            Pedir Delivery
            <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
          </a>

          <button
            onClick={() => setOpen(true)}
            className={`lg:hidden p-2 rounded-full ${
              scrolled ? 'text-ink' : 'text-white'
            }`}
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-[60] transition-all duration-500 lg:hidden ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-deep/90 backdrop-blur-2xl"
          onClick={() => setOpen(false)}
        />
        <div
          className={`absolute top-0 left-0 right-0 bg-background rounded-b-5xl px-6 pt-8 pb-12 transition-transform duration-500 ${
            open ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <div className="flex items-center justify-between mb-10">
            <span className="flex items-center gap-2.5">
              <img
                src="/img/logo/logo.png"
                alt="Angels Coffee Br"
                className="h-9 w-9 rounded-full object-cover"
              />
              <span className="font-display font-bold text-xl text-ink">
                Angels Coffee Br
              </span>
            </span>
            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded-full bg-divider/40"
              aria-label="Fechar menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-display text-3xl font-semibold text-ink py-3 border-b border-divider"
              >
                {link.label}
              </a>
            ))}
          </div>
          <a
            href={LINKS.saipos}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="mt-8 magnetic-btn flex items-center justify-center gap-2 bg-primary text-background px-6 py-4 rounded-full font-semibold w-full"
          >
            Pedir Delivery
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </>
  )
}

/* ----------------------------------------------------------------
   Hero
---------------------------------------------------------------- */
function Hero() {
  const heroRef = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion) return
    const ctx = gsap.context(() => {
      gsap.from('.hero-line-1', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.3,
      })
      gsap.from('.hero-line-2', {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.5,
      })
      gsap.from('.hero-cta, .hero-meta', {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.8,
        stagger: 0.12,
      })
    }, heroRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="inicio"
      ref={heroRef}
      className="relative min-h-[100dvh] w-full overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/img/ambiente/hero.jpg"
          alt="Ambiente da Angels Coffee Br"
          className="w-full h-full object-cover brightness-[.55]"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-dark/80 via-primary-dark/40 to-primary-dark/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-primary-dark/20 to-transparent" />
      </div>

      {/* Signature petals — full width across the top, falling left to right */}
      <Petals className="absolute top-0 left-0 w-full h-[40rem] z-[5]" count={12} />

      {/* Top frame */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center text-center">
        <div className="px-6 sm:px-10 lg:px-16 max-w-4xl">
          <p className="hero-meta mb-6">
            <Eyebrow className="text-accent/90">
              Cafeteria · Floraria · Presentes — Uruaçu-GO
            </Eyebrow>
          </p>

          <h1 className="font-display font-extrabold text-white leading-[0.98] tracking-tight">
            <span className="hero-line-1 block text-4xl sm:text-6xl md:text-7xl">
              Mais que uma cafeteria.
            </span>
            <span
              className="hero-line-2 block font-serif italic font-medium text-accent text-5xl sm:text-7xl md:text-8xl lg:text-9xl mt-2"
              style={{ lineHeight: '0.92' }}
            >
              Uma experiência.
            </span>
          </h1>

          <p className="hero-meta mx-auto max-w-xl text-white/75 text-base sm:text-lg mt-8 leading-relaxed">
            Cafés especiais, croissants, toasts, sanduíches artesanais, tortas
            salgadas, flores e presentes para diferentes momentos e ocasiões.
          </p>

          <div className="hero-cta mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton href={LINKS.saipos} icon={ArrowRight}>
              Pedir Delivery
            </CTAButton>
            <CTAButton href={LINKS.whatsapp} variant="glass" icon={Flower2}>
              Flores no WhatsApp
            </CTAButton>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-6 sm:right-12 hidden md:flex flex-col items-center gap-2 text-white/50">
          <span className="font-mono uppercase text-[10px] tracking-[0.3em]">
            Role
          </span>
          <div className="h-8 w-px bg-gradient-to-b from-white/50 to-transparent" />
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------
   História
---------------------------------------------------------------- */
function Historia() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const stats = [
    { node: <CountUp target={2024} duration={2200} />, label: 'desde dezembro' },
    { node: <CountUp target={100} suffix="%" duration={2000} />, label: 'feito à mão' },
  ]

  return (
    <section
      id="historia"
      ref={ref}
      className="relative bg-background py-24 sm:py-32 px-6 sm:px-10 lg:px-16 overflow-hidden"
    >
      <Petals className="absolute -top-4 left-0 w-full h-96 opacity-70" count={8} />
      <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-sage/15 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <div
          className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center transition-all duration-1000 ease-out ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Left: copy */}
          <div>
            <Eyebrow>Nossa História</Eyebrow>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl md:text-6xl text-ink mt-5 leading-[1.05] tracking-tight">
              Afeto em detalhes,
              <span className="block font-serif italic font-medium text-accent-dark">
                desde dezembro de 2024.
              </span>
            </h2>
            <div className="mt-7 space-y-5 text-muted text-base sm:text-lg leading-relaxed max-w-xl">
              <p>
                A Angels Coffee Br nasceu em dezembro de 2024 para reunir café,
                comida bem preparada, flores e presentes em um só lugar. Nosso
                espaço foi pensado para receber bem, seja para tomar um café,
                comer algo especial, pedir delivery ou escolher um presente.
              </p>
            </div>
          </div>

          {/* Right: stats trio */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-divider rounded-4xl overflow-hidden border border-divider shadow-xl shadow-primary/5">
            {stats.map((s, i) => (
              <div
                key={i}
                className="bg-surface p-7 sm:p-8 flex flex-col items-center text-center"
              >
                <span className="font-display font-extrabold text-4xl sm:text-5xl text-ink leading-none">
                  {s.node}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent-dark mt-4">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------
   Café
---------------------------------------------------------------- */
const CAFE_ITEMS = [
  {
    name: 'Cappuccino',
    img: '/img/produtos/cafe-capuccino.jpg',
    desc: 'Cremoso e aromático, do nosso jeito.',
  },
  {
    name: 'Velvet Matcha',
    img: '/img/produtos/cafe-velvet-matcha.jpg',
    desc: 'Matcha gelado, com geleia de morango artesanal.',
  },
  {
    name: 'Café da Manhã de Hotel',
    img: '/img/produtos/cafe-da-manha-hotel.jpg',
    desc: 'Ovos cremosos, bacon, cream cheese e frutas. O dia começa bem.',
  },
  {
    name: 'Toast Caprese',
    img: '/img/produtos/toast-caprese.jpg',
    desc: 'Mussarela de búfala, tomate confit e pesto.',
  },
  {
    name: 'Croissant de Presunto e Queijo',
    img: '/img/produtos/croissant-presunto-queijo.jpg',
    desc: 'Croissant folhado com presunto e queijo derretido.',
  },
  {
    name: 'Torta de Frango',
    img: '/img/produtos/torta-frango.jpg',
    desc: 'Massa amanteigada e recheio cremoso. Uma das nossas tortas salgadas.',
  },
]

function Cafe() {
  return (
    <section
      id="cafe"
      className="relative bg-background py-24 sm:py-32 px-6 sm:px-10 lg:px-16"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <Eyebrow>O Café</Eyebrow>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl md:text-6xl text-ink mt-5 leading-[1.05] tracking-tight">
              Da pausa para o café
              <span className="block font-serif italic font-medium text-accent-dark">
                a uma refeição leve e saborosa.
              </span>
            </h2>
          </div>
          <p className="text-muted text-base sm:text-lg leading-relaxed max-w-md">
            A Angels Coffee oferece uma culinária feita com cuidado, bons
            ingredientes e combinações que fogem do comum. Todo nosso cardápio
            possui preparo artesanal, sabores marcantes e uma apresentação
            delicada, criando uma experiência pensada para ser apreciada em cada
            detalhe.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CAFE_ITEMS.map((item, i) => (
            <Reveal
              as="article"
              key={i}
              delay={i * 80}
              className="cafe-card group relative rounded-3xl overflow-hidden bg-deep border border-white/10 hover:border-accent/60 hover:shadow-2xl hover:shadow-primary/20 transition-[border-color,box-shadow] duration-500 shadow-xl shadow-primary/10"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {/* Soft radial lift so dark-on-dark product photos read clearly */}
                <div
                  className="absolute inset-0 z-[1] pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(circle at 50% 42%, rgba(255,255,255,0.10), rgba(255,255,255,0) 62%)',
                  }}
                />
                <img
                  src={item.img}
                  alt={item.name}
                  loading="lazy"
                  className="relative z-[2] w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Subtle bottom vignette only — does not bury the product */}
                <div className="absolute inset-x-0 bottom-0 z-[3] h-1/3 bg-gradient-to-t from-deep/55 to-transparent pointer-events-none" />
              </div>
              <div className="p-6">
                <h3 className="font-display font-bold text-xl text-white">
                  {item.name}
                </h3>
                <p className="text-white/60 text-sm mt-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <CTAButton href={LINKS.saipos} icon={ArrowRight}>
            Ver cardápio completo e pedir delivery
          </CTAButton>
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------
   Flores & Presentes
---------------------------------------------------------------- */
const FLORES_ITEMS = [
  { img: '/img/flores/flores-1.jpg', title: 'Box de Rosas & Ferrero', desc: 'Rosas e chocolates para uma surpresa irresistível.' },
  { img: '/img/flores/flores-2.jpg', title: 'Box de Rosas', desc: 'Rosas selecionadas em box, prontas para encantar.' },
  { img: '/img/flores/flores-3.jpg', title: 'Box Flores & Café', desc: 'Mini roseira com nossos cafés especiais.' },
  { img: '/img/flores/flores-4.jpg', title: 'Box Presente', desc: 'Flores e mimos montados com carinho.' },
  { img: '/img/flores/flores-5.jpg', title: 'Box Café da Manhã', desc: 'Flores, café e quitutes para começar bem o dia.' },
]

function Flores() {
  return (
    <section
      id="flores"
      className="relative bg-surface py-24 sm:py-32 px-6 sm:px-10 lg:px-16 overflow-hidden"
    >
      {/* Subtle full-width petals across the top of this section */}
      <Petals className="absolute top-0 left-0 w-full h-[34rem] z-[2] opacity-60" count={9} />
      <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="max-w-2xl mb-14">
          <Eyebrow>Flores &amp; Presentes</Eyebrow>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl md:text-6xl text-ink mt-5 leading-[1.05] tracking-tight">
            Flores que falam
            <span className="block font-serif italic font-medium text-accent-dark">
              por você.
            </span>
          </h2>
          <p className="text-muted text-base sm:text-lg mt-6 leading-relaxed max-w-xl">
            Buquês, arranjos, rosas e box para aniversários, datas
            comemorativas, agradecimentos e surpresas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FLORES_ITEMS.map((item, i) => (
            <Reveal
              as="article"
              key={i}
              delay={i * 80}
              className="flor-card group relative rounded-3xl overflow-hidden bg-background border border-divider hover:border-accent/50 transition-all duration-500 shadow-lg shadow-primary/5"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={item.img}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display font-bold text-xl text-ink">
                  {item.title}
                </h3>
                <p className="text-muted text-sm mt-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </Reveal>
          ))}

          {/* Highlight block */}
          <Reveal
            as="article"
            delay={FLORES_ITEMS.length * 80}
            className="flor-card relative rounded-3xl overflow-hidden bg-primary text-background p-8 flex flex-col justify-between shadow-xl shadow-primary/30"
          >
            <div>
              <span className="h-12 w-12 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center">
                <Gift className="h-6 w-6 text-accent" strokeWidth={2.2} />
              </span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl mt-6 leading-tight">
                Montamos seu presente com você.
              </h3>
              <p className="text-background/70 text-sm mt-3 leading-relaxed">
                Você nos conta a ocasião e nós ajudamos a escolher uma opção
                bonita, bem apresentada e de acordo com a disponibilidade dos
                itens.
              </p>
            </div>
            <CTAButton
              href={`${LINKS.whatsapp}?text=Olá!%20Quero%20um%20orçamento%20de%20flores%2Fpresentes`}
              icon={ArrowUpRight}
              className="mt-8 w-full"
            >
              Falar no WhatsApp
            </CTAButton>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------
   Ocasiões — sticky stacking cards
---------------------------------------------------------------- */
const OCASIOES = [
  {
    num: '01',
    icon: Heart,
    title: 'Dia das Mães',
    line: 'Surpreenda com um box exclusivo de flores e café.',
    img: '/img/flores/flores-1.jpg',
    text: 'Quero%20encomendar%20para%20o%20Dia%20das%20Mães',
  },
  {
    num: '02',
    icon: Heart,
    title: 'Dia dos Namorados',
    line: 'Rosas, doces e um presente que fala por você.',
    img: '/img/flores/flores-4.jpg',
    text: 'Quero%20encomendar%20para%20o%20Dia%20dos%20Namorados',
  },
  {
    num: '03',
    icon: Cake,
    title: 'Aniversários',
    line: 'Box, buquê e brownie para adoçar a data.',
    img: '/img/flores/flores-2.jpg',
    text: 'Quero%20encomendar%20para%20um%20Aniversário',
  },
  {
    num: '04',
    icon: GraduationCap,
    title: 'Formaturas & Datas Especiais',
    line: 'Celebre conquistas com um presente à altura.',
    img: '/img/flores/flores-3.jpg',
    text: 'Quero%20encomendar%20para%20Formatura%20ou%20Data%20Especial',
  },
]

function Ocasioes() {
  const containerRef = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion) return
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.ocasiao-card')
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return
        gsap.to(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top top+=110',
            endTrigger: cards[cards.length - 1],
            end: 'top top+=130',
            scrub: 0.5,
          },
          // GPU-cheap props only (no animated filter blur) -> buttery 60fps
          scale: 0.92,
          opacity: 0.6,
          force3D: true,
          ease: 'none',
        })
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="ocasioes"
      ref={containerRef}
      className="relative px-4 sm:px-6 py-20 bg-background"
    >
      <div className="max-w-7xl mx-auto mb-16 px-2 sm:px-10">
        <Eyebrow>Ocasiões</Eyebrow>
        <h2 className="font-display font-extrabold text-3xl sm:text-5xl md:text-6xl text-ink mt-5 leading-[1.05] tracking-tight max-w-3xl">
          Nenhuma data especial
          <span className="block font-serif italic font-medium text-accent-dark">
            passa em branco.
          </span>
        </h2>
        <p className="text-muted text-base sm:text-lg mt-6 leading-relaxed max-w-xl">
          Encomende com antecedência e garanta o presente perfeito para cada
          momento. A gente monta, embala e entrega com afeto.
        </p>
      </div>

      <div className="space-y-8">
        {OCASIOES.map((oc, idx) => {
          const Icon = oc.icon
          return (
            <article
              key={idx}
              className="ocasiao-card sticky top-24 sm:top-28 mx-auto max-w-6xl bg-gradient-to-br from-surface to-background border border-divider rounded-6xl overflow-hidden shadow-2xl shadow-primary/10"
            >
              <div className="grid lg:grid-cols-5 gap-0 min-h-[56vh] lg:min-h-[64vh]">
                {/* Content */}
                <div className="lg:col-span-3 p-8 sm:p-12 lg:p-16 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="h-12 w-12 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-accent-dark" strokeWidth={2.2} />
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-accent-dark bg-accent/10 px-2.5 py-1 rounded-full">
                      Ocasião {oc.num}
                    </span>
                  </div>

                  <div className="my-10">
                    <span className="font-display font-extrabold text-[6rem] sm:text-[9rem] leading-none text-accent/15 -mb-4 block">
                      {oc.num}
                    </span>
                    <h3 className="font-display font-bold text-3xl sm:text-5xl text-ink leading-[1.04] tracking-tight">
                      {oc.title}
                    </h3>
                    <p className="font-serif italic text-accent-dark text-xl sm:text-2xl mt-3">
                      {oc.line}
                    </p>
                  </div>

                  <CTAButton
                    href={`${LINKS.whatsapp}?text=${oc.text}`}
                    icon={ArrowUpRight}
                    className="self-start"
                  >
                    Encomendar para esta data
                  </CTAButton>
                </div>

                {/* Image */}
                <div className="lg:col-span-2 relative overflow-hidden min-h-[260px] lg:min-h-full bg-deep">
                  <img
                    src={oc.img}
                    alt={oc.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep/50 via-transparent to-deep/10" />
                  <div className="absolute bottom-4 right-4 font-mono text-[10px] uppercase tracking-widest text-white/70">
                    {oc.num} / Angels Coffee Br
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------
   Ambiente — gallery
---------------------------------------------------------------- */
const GALLERY = [
  { img: '/img/ambiente/hero.jpg', span: 'sm:row-span-2' },
  { img: '/img/ambiente/ambiente-1.jpg', span: '' },
  { img: '/img/ambiente/ambiente-2.jpg', span: '' },
  { img: '/img/ambiente/ambiente-3.jpg', span: 'sm:row-span-2' },
  { img: '/img/ambiente/ambiente-4.jpg', span: '' },
  { img: '/img/ambiente/ambiente-5.jpg', span: '' },
  { img: '/img/ambiente/ambiente-6.jpg', span: '' },
]

function Ambiente() {
  return (
    <section
      id="ambiente"
      className="relative bg-background py-24 sm:py-32 px-6 sm:px-10 lg:px-16"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <Eyebrow>O Ambiente</Eyebrow>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl md:text-6xl text-ink mt-5 leading-[1.05] tracking-tight">
              Um cantinho instagramável
              <span className="block font-serif italic font-medium text-accent-dark">
                em Uruaçu.
              </span>
            </h2>
            <p className="text-muted text-base sm:text-lg mt-6 leading-relaxed max-w-xl">
              Um espaço bonito e acolhedor no centro de Uruaçu para tomar café,
              comer bem, conversar e aproveitar com calma.
            </p>
          </div>
          <a
            href={LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="magnetic-btn inline-flex items-center gap-2 glass text-ink border border-accent/30 px-6 py-3.5 rounded-full font-semibold"
          >
            <InstagramIcon className="h-5 w-5 text-accent-dark" />
            Ver no Instagram @angelscoffeebr
          </a>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 auto-rows-[180px] sm:auto-rows-[220px] gap-4">
          {GALLERY.map((g, i) => (
            <Reveal
              key={i}
              delay={i * 70}
              className={`gallery-item group relative overflow-hidden rounded-3xl ${g.span}`}
            >
              <img
                src={g.img}
                alt="Ambiente da Angels Coffee Br"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-primary-dark/0 group-hover:bg-primary-dark/15 transition-colors duration-500" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------
   Contato
---------------------------------------------------------------- */
function Contato() {
  const contacts = [
    {
      icon: MapPin,
      label: 'Endereço',
      value: 'Av. Transbrasiliana, 170-B, Centro — Uruaçu-GO',
      href: LINKS.maps,
    },
    {
      icon: Clock,
      label: 'Horário',
      value: 'Seg–Sex 08:00–11:00 e 15:00–19:00 · Sáb 08:00–12:00 · Dom fechado',
      href: null,
    },
    {
      icon: Phone,
      label: 'WhatsApp',
      value: '(62) 98620-5474',
      href: LINKS.whatsapp,
    },
  ]

  return (
    <section
      id="contato"
      className="relative bg-surface py-24 sm:py-32 px-6 sm:px-10 lg:px-16"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left: info */}
          <div className="lg:col-span-5">
            <Eyebrow>Contato</Eyebrow>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl md:text-6xl text-ink mt-5 leading-[1.05] tracking-tight">
              Venha tomar
              <span className="block font-serif italic font-medium text-accent-dark">
                um café com a gente.
              </span>
            </h2>
            <p className="text-muted text-base sm:text-lg mt-6 leading-relaxed max-w-md">
              Passe na loja, peça pelo delivery ou fale conosco pelo WhatsApp.
              Estamos na Av. Transbrasiliana, 170-B, Centro — Uruaçu-GO.
            </p>

            <div className="mt-10 space-y-4">
              {contacts.map((c, i) => {
                const Icon = c.icon
                const inner = (
                  <>
                    <span className="h-12 w-12 shrink-0 rounded-2xl bg-accent/10 border border-accent/25 flex items-center justify-center group-hover:bg-accent transition">
                      <Icon className="h-5 w-5 text-accent-dark group-hover:text-deep transition" />
                    </span>
                    <span>
                      <span className="block font-mono text-[10px] uppercase tracking-widest text-muted">
                        {c.label}
                      </span>
                      <span className="font-display font-semibold text-ink text-base sm:text-lg leading-snug">
                        {c.value}
                      </span>
                    </span>
                  </>
                )
                return c.href ? (
                  <a
                    key={i}
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lift-on-hover flex items-start gap-4 group"
                  >
                    {inner}
                  </a>
                ) : (
                  <div key={i} className="flex items-start gap-4 group">
                    {inner}
                  </div>
                )
              })}
            </div>

            <div className="mt-10">
              <CTAButton href={LINKS.whatsapp} icon={ArrowUpRight}>
                Chamar no WhatsApp
              </CTAButton>
            </div>
          </div>

          {/* Right: map */}
          <div className="lg:col-span-7">
            <div className="rounded-5xl overflow-hidden border border-divider shadow-xl shadow-primary/5">
              <iframe
                title="Mapa Angels Coffee Br"
                src={LINKS.mapsEmbed}
                width="100%"
                height="440"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <a
              href={LINKS.maps}
              target="_blank"
              rel="noopener noreferrer"
              className="lift-on-hover inline-flex items-center gap-1.5 mt-5 font-semibold text-accent-dark"
            >
              Abrir no Maps
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------
   Footer
---------------------------------------------------------------- */
function Footer() {
  return (
    <footer className="relative bg-deep text-white rounded-t-6xl overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-15" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-64 w-[40rem] rounded-full bg-accent/15 blur-3xl pointer-events-none" />

      <div className="relative px-6 sm:px-10 lg:px-16 pt-20 pb-10 max-w-7xl mx-auto">
        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <img
                src="/img/logo/logo.png"
                alt="Angels Coffee Br"
                className="h-10 w-10 rounded-full object-cover"
              />
              <span className="font-display font-bold text-lg">
                Angels Coffee Br
              </span>
            </div>
            <p className="font-serif italic text-accent text-2xl">
              Afeto em detalhes.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3.5 py-1.5">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/70">
                Atendimento humanizado
              </span>
            </span>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-4">
              Navegação
            </p>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-white/65 hover:text-accent transition text-sm"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-4">
              Contato
            </p>
            <ul className="space-y-2.5 text-sm">
              <li className="text-white/65">
                Av. Transbrasiliana, 170-B, Centro — Uruaçu-GO
              </li>
              <li className="text-white/65">
                Seg–Sex 08:00–11:00 e 15:00–19:00
              </li>
              <li className="text-white/65">Sáb 08:00–12:00 · Dom fechado</li>
              <li>
                <a
                  href={LINKS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/65 hover:text-accent transition"
                >
                  (62) 98620-5474
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-4">
              Social
            </p>
            <ul className="space-y-2.5">
              <li>
                <a
                  href={LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white/65 hover:text-accent transition text-sm"
                >
                  <InstagramIcon className="h-4 w-4" />
                  @angelscoffeebr
                </a>
              </li>
              <li>
                <a
                  href={LINKS.saipos}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/65 hover:text-accent transition text-sm"
                >
                  Pedir Delivery
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 pt-8 border-t border-white/10">
          <p className="font-mono text-[11px] text-white/50 tracking-wide">
            © 2026 Angels Coffee Br · CNPJ 56.384.567/0001-63 · Uruaçu-GO
          </p>
        </div>
      </div>
    </footer>
  )
}

/* ----------------------------------------------------------------
   App
---------------------------------------------------------------- */
export default function App() {
  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 200)
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh())
    }
    return () => clearTimeout(id)
  }, [])

  return (
    <div className="relative">
      <div className="noise-overlay" />
      <Navbar />
      <Hero />
      <Historia />
      <Cafe />
      <Flores />
      <Ocasioes />
      <Ambiente />
      <Contato />
      <Footer />
    </div>
  )
}
