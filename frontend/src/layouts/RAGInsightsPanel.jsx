import { motion } from 'framer-motion'
import { Zap, Database, Cpu, Activity } from 'lucide-react'
import useChat from '../hooks/useChat'
import styles from './RAGInsightsPanel.module.css'

const STATUS_ITEMS = [
  { label: 'FastAPI',     status: 'Online',  color: '#FFFFFF' },
  { label: 'Ollama',      status: 'Running', color: '#FFFFFF' },
  { label: 'RAG Engine',  status: 'Ready',   color: '#888888' },
]

function ConfidenceRing({ value }) {
  const pct = Math.round((value ?? 0) * 100)
  const radius = 42
  const circ = 2 * Math.PI * radius
  const dash = (pct / 100) * circ

  const color = pct > 75 ? '#FFFFFF' : pct > 45 ? '#FACC15' : '#EF4444'

  return (
    <div className={styles.ring_wrap}>
      <svg width="110" height="110" viewBox="0 0 110 110" aria-hidden="true">
        <circle cx="55" cy="55" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
        <motion.circle
          cx="55" cy="55" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          transform="rotate(-90 55 55)"
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      <div className={styles.ring_center}>
        <span className={styles.ring_pct} style={{ color }}>{pct}%</span>
        <span className={styles.ring_label}>Confidence</span>
      </div>
    </div>
  )
}

export default function RAGInsightsPanel() {
  const { confidence, sources, isOnTopic } = useChat()

  return (
    <motion.aside
      className={styles.panel}
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Header */}
      <div className={styles.panel__header}>
        <div className={styles.panel__header_icon}>
          <Activity size={15} />
        </div>
        <div>
          <h2 className={styles.panel__header_title}>RAG Insights</h2>
          <p className={styles.panel__header_sub}>Live pipeline telemetry</p>
        </div>
      </div>

      <div className={styles.panel__body}>

        {/* Confidence ring */}
        <div className={styles.panel__card}>
          <div className={styles.panel__card_title}>
            <Zap size={14} /> Retrieval Confidence
          </div>
          <ConfidenceRing value={confidence} />
        </div>

        {/* Sources */}
        <div className={styles.panel__card}>
          <div className={styles.panel__card_title}>
            <Database size={14} /> Retrieved Sources
          </div>
          {sources && sources.length > 0 ? (
            <ul className={styles.sources}>
              {sources.map((s, i) => (
                <motion.li
                  key={i}
                  className={styles.source_item}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <span className={styles.source_dot} />
                  {s}
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className={styles.panel__empty}>Ask a question to retrieve sources</p>
          )}
        </div>

        {/* System status */}
        <div className={styles.panel__card}>
          <div className={styles.panel__card_title}>
            <Cpu size={14} /> System Status
          </div>
          <div className={styles.status_list}>
            {STATUS_ITEMS.map(item => (
              <div key={item.label} className={styles.status_row}>
                <span className={styles.status_label}>{item.label}</span>
                <span className={styles.status_badge} style={{ '--status-color': item.color }}>
                  <span className={styles.status_badge_dot} />
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Topic relevance */}
        <div className={styles.panel__card}>
          <div className={styles.panel__card_title}>
            <Activity size={14} /> Topic Relevance
          </div>
          <div className={`${styles.topic_badge} ${isOnTopic ? styles['topic_badge--on'] : styles['topic_badge--off']}`}>
            <span className={styles.topic_dot} />
            {isOnTopic ? 'On Topic — RAG pipeline active' : 'Off Topic — General response'}
          </div>
        </div>

      </div>
    </motion.aside>
  )
}
