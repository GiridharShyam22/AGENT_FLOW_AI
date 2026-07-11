import { motion } from 'framer-motion'
import { Zap, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './WorkspaceHeader.module.css'

export default function WorkspaceHeader() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <motion.header
      className={styles.header}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Left: model status pill */}
      <div className={styles.header__model}>
        <div className={styles.header__model_dot} />
        <span className={styles.header__model_name}>AgentFlow RAG Engine</span>
        <span className={styles.header__model_tag}>llama3.2</span>
      </div>

      {/* Spacer */}
      <div className={styles.header__spacer} />

      {/* Right: user info + logout */}
      <div className={styles.header__right}>
        {user && (
          <span className={styles.header__username}>
            {user.name || user.email}
          </span>
        )}

        <div className={styles.header__avatar} aria-label="AgentFlow AI" title="AgentFlow AI">
          <Zap size={14} strokeWidth={2.5} />
        </div>

        <button
          className={styles.header__logout_btn}
          onClick={handleLogout}
          title="Sign out"
          aria-label="Sign out"
        >
          <LogOut size={15} />
          <span>Logout</span>
        </button>
      </div>
    </motion.header>
  )
}
