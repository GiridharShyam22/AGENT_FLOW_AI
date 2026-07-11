import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import logoImage from '../assets/logo.png'
import styles from './AuthPage.module.css'

export default function LoginPage() {
  const navigate   = useNavigate()
  const { login }  = useAuth()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd]   = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [showSplash, setShowSplash] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email.trim(), password)
      setShowSplash(true)
      setTimeout(() => {
        navigate('/')
      }, 2000)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: '#000000',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <motion.img
              src={logoImage}
              alt="AgentFlow AI Logo"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.8, 
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ height: '120px', width: 'auto' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid background */}
      <div className={styles.page__grid} aria-hidden="true" />

      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Logo */}
        <div className={styles.logo}>
          <img src={logoImage} alt="AgentFlow AI Logo" style={{ height: '80px', width: 'auto', borderRadius: '50%' }} />
        </div>

        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.subtitle}>Sign in to your workspace</p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              className={styles.input}
              placeholder="you@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="login-password">Password</label>
            <div className={styles.input_wrap}>
              <input
                id="login-password"
                type={showPwd ? 'text' : 'password'}
                className={styles.input}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button type="button" className={styles.eye_btn} onClick={() => setShowPwd(v => !v)}>
                {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <motion.button
            type="submit"
            className={styles.submit_btn}
            disabled={loading}
            whileTap={{ scale: 0.98 }}
            id="login-submit"
          >
            {loading ? 'Signing in…' : (
              <><span>Sign in</span><ArrowRight size={16} /></>
            )}
          </motion.button>
        </form>

        <p className={styles.switch_text}>
          Don't have an account?{' '}
          <Link to="/register" className={styles.switch_link}>Create one</Link>
        </p>
      </motion.div>
    </div>
  )
}
