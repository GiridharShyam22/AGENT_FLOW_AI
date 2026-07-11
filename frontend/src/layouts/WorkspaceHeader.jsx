import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import styles from './WorkspaceHeader.module.css'

export default function WorkspaceHeader() {
  return (
    <motion.header
      className={styles.header}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Left: model status pill — informational only, no fake dropdown */}
      <div className={styles.header__model}>
        <div className={styles.header__model_dot} />
        <span className={styles.header__model_name}>AgentFlow RAG Engine</span>
        <span className={styles.header__model_tag}>llama3.2</span>
      </div>

      {/* Spacer */}
      <div className={styles.header__spacer} />

      {/* Right: avatar only */}
      <div className={styles.header__avatar} aria-label="AgentFlow AI" title="AgentFlow AI">
        <Zap size={14} strokeWidth={2.5} />
      </div>
    </motion.header>
  )
}
