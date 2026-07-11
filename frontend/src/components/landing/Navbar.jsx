import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Zap, ArrowRight } from 'lucide-react'
import logoImage from '../../assets/logo.png'
import Button from '../common/Button'
import { useAuth } from '../../context/AuthContext'
import styles from './Navbar.module.css'

const NAV_LINKS = [
  { label: 'Features',    href: '#features' },
  { label: 'How it Works', href: '#how-it-works' },
  { label: 'Knowledge',   href: '#tech-stack' },
  { label: 'About',       href: '#cta' },
]

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleScroll = (e, href) => {
    e.preventDefault()
    setMobileOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <motion.header
      className={`${styles.nav} ${scrolled ? styles['nav--scrolled'] : ''}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={styles.nav__inner}>
        {/* Logo */}
        <Link to="/" className={styles.nav__logo}>
          <img src={logoImage} alt="AgentFlow AI Logo" style={{ height: '70px', width: 'auto', borderRadius: '50%' }} />
        </Link>

        {/* Desktop links */}
        <nav className={styles.nav__links} aria-label="Main navigation">
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              className={styles.nav__link}
              onClick={e => handleScroll(e, link.href)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className={styles.nav__cta}>
          {user ? (
            <>
              <button 
                className={styles.nav__user_avatar}
                onClick={() => navigate('/workspace')}
                title={user.name || user.email}
              >
                {user.name?.[0]?.toUpperCase() ?? user.email[0].toUpperCase()}
              </button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/workspace')}
              >
                Workspace <ArrowRight size={14} style={{ marginLeft: 4 }} />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/workspace')}
              >
                Get Started
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className={styles.nav__burger}
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className={styles.nav__mobile}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                className={styles.nav__mobile_link}
                onClick={e => handleScroll(e, link.href)}
              >
                {link.label}
              </a>
            ))}
            <div className={styles.nav__mobile_cta}>
              {user ? (
                <Button variant="primary" size="md" onClick={() => navigate('/workspace')}>
                  Go to Workspace
                </Button>
              ) : (
                <>
                  <Button variant="outline" size="md" onClick={() => navigate('/login')}>
                    Login
                  </Button>
                  <Button variant="primary" size="md" onClick={() => navigate('/workspace')}>
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
