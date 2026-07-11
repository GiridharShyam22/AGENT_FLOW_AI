import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, ChevronLeft, LogOut, MessageSquare } from 'lucide-react'
import logoImage from '../assets/logo.png'
import { useAuth } from '../context/AuthContext'
import styles from './WorkspaceSidebar.module.css'

export default function WorkspaceSidebar({ onNewChat, sessions = [], activeSessionId, onSelectSession }) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <motion.aside
      className={styles.sidebar}
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Logo */}
      <div className={styles.sidebar__logo}>
        <img src={logoImage} alt="AgentFlow AI Logo" style={{ height: '60px', width: 'auto', marginLeft: '4px', borderRadius: '50%' }} />
      </div>

      {/* New Chat */}
      <button
        className={styles.sidebar__new_btn}
        onClick={onNewChat}
        id="sidebar-new-chat"
      >
        <Plus size={15} strokeWidth={2.5} />
        New Chat
      </button>

      {/* Recent Chats List */}
      <div className={styles.sidebar__recent_chats}>
        <div className={styles.recent_chats__header}>Recent Chats</div>
        <div className={styles.recent_chats__list}>
          {sessions.length === 0 ? (
            <div className={styles.recent_chats__empty}>No recent chats</div>
          ) : (
            sessions.map(session => (
              <button
                key={session.id}
                className={`${styles.recent_chat_btn} ${activeSessionId === session.id ? styles['recent_chat_btn--active'] : ''}`}
                onClick={() => onSelectSession(session.id)}
              >
                <MessageSquare size={14} />
                <span className={styles.recent_chat_title}>{session.title}</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Spacer */}
      <div className={styles.sidebar__spacer} />

      {/* User info + logout */}
      {user && (
        <div className={styles.sidebar__user}>
          <div className={styles.sidebar__user_avatar}>
            {user.name?.[0]?.toUpperCase() ?? user.email[0].toUpperCase()}
          </div>
          <div className={styles.sidebar__user_info}>
            <span className={styles.sidebar__user_name}>{user.name || 'User'}</span>
            <span className={styles.sidebar__user_email}>{user.email}</span>
          </div>
          <button
            className={styles.sidebar__logout_btn}
            onClick={handleLogout}
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut size={15} />
          </button>
        </div>
      )}

      {/* Footer */}
      <div className={styles.sidebar__footer}>
        <div className={styles.sidebar__footer_status}>
          <span className={styles.sidebar__footer_dot} />
          <span>RAG Engine Online</span>
        </div>
        <p className={styles.sidebar__footer_text}>
          Ollama · FastAPI · Vector DB
        </p>
        <Link to="/" className={styles.sidebar__footer_back}>
          <ChevronLeft size={13} />
          Back to home
        </Link>
      </div>
    </motion.aside>
  )
}
