import { Sparkles } from 'lucide-react'
import styles from './TypingIndicator.module.css'

export default function TypingIndicator() {
  return (
    <div className={styles.row}>
      <div className={styles.avatar}>
        <Sparkles size={13} strokeWidth={2.5} />
      </div>
      <div className={styles.bubble}>
        <div className={styles.dots}>
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </div>
        <span className={styles.label}>AgentFlow AI is thinking...</span>
      </div>
    </div>
  )
}