import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Eye, EyeOff, ArrowRight, AlertCircle, ChevronLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import logoImage from '../assets/logo.png'
import styles from './AuthPage.module.css'

export default function RegisterPage() {
  const navigate      = useNavigate()
  const { register }  = useAuth()
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [showPwd, setShowPwd]   = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (password.length < 6)  { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    try {
      await register(name.trim(), email.trim(), password)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <Link to="/" className={styles.back_btn}>
        <ChevronLeft size={16} /> Back to home
      </Link>
      
      <div className={styles.page__grid} aria-hidden="true" />

      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={styles.logo}>
          <img src={logoImage} alt="AgentFlow AI Logo" style={{ height: '80px', width: 'auto', borderRadius: '50%' }} />
        </div>

        <h1 className={styles.title}>Create account</h1>
        <p className={styles.subtitle}>Join AgentFlow AI — it's free to start</p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="reg-name">Full name</label>
            <input
              id="reg-name"
              type="text"
              className={styles.input}
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
              type="email"
              className={styles.input}
              placeholder="you@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="reg-password">Password</label>
            <div className={styles.input_wrap}>
              <input
                id="reg-password"
                type={showPwd ? 'text' : 'password'}
                className={styles.input}
                placeholder="At least 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button type="button" className={styles.eye_btn} onClick={() => setShowPwd(v => !v)}>
                {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="reg-confirm">Confirm password</label>
            <input
              id="reg-confirm"
              type="password"
              className={styles.input}
              placeholder="Repeat password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <motion.button
            type="submit"
            className={styles.submit_btn}
            disabled={loading}
            whileTap={{ scale: 0.98 }}
            id="register-submit"
          >
            {loading ? 'Creating account…' : (
              <><span>Create account</span><ArrowRight size={16} /></>
            )}
          </motion.button>
        </form>

        <p className={styles.switch_text}>
          Already have an account?{' '}
          <Link to="/login" className={styles.switch_link}>Sign in</Link>
        </p>
      </motion.div>
    </div>
  )
}
