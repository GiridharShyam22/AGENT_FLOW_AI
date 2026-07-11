import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Terminal, Sparkles, FileText } from 'lucide-react'
import SectionTitle from '../common/SectionTitle'
import styles from './LivePreview.module.css'

// Simulated RAG conversation
const DEMO_MESSAGES = [
  {
    role: 'user',
    text: 'What is our Q3 cloud infrastructure budget and which vendor was selected?',
  },
  {
    role: 'system',
    text: 'Searching knowledge base...',
    isSystem: true,
  },
  {
    role: 'assistant',
    text: 'Based on the **Q3 Infrastructure Review** (doc: infra-review-q3.pdf, p. 12):\n\nThe approved cloud infrastructure budget for Q3 is **$420,000**, allocated across three pillars:\n\n• Compute (EC2/VMs): $180,000\n• Storage & backup: $95,000\n• Data egress & networking: $145,000\n\nFollowing the RFP process, **AWS** was selected as the primary vendor, with **Cloudflare** for edge networking. The decision was finalized on July 2nd, 2025.',
    sources: ['infra-review-q3.pdf', 'vendor-rfp-2025.pdf'],
  },
]

function TypingText({ text, onDone }) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    setDisplayed('')
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(id)
        if (onDone) onDone()
      }
    }, 12)
    return () => clearInterval(id)
  }, [text, onDone])

  return <>{displayed}</>
}

export default function LivePreview() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [phase, setPhase] = useState(0) // 0=hidden, 1=user, 2=system, 3=ai

  useEffect(() => {
    if (!inView) return
    const t1 = setTimeout(() => setPhase(1), 400)
    const t2 = setTimeout(() => setPhase(2), 1400)
    const t3 = setTimeout(() => setPhase(3), 2600)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [inView])

  return (
    <section className={`${styles.section} section`} id="live-preview">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <SectionTitle
            badge="Live Preview"
            title="See RAG intelligence in action"
            subtitle="Watch AgentFlow AI retrieve precise, cited answers from your private knowledge base — no internet, no hallucinations."
          />
        </motion.div>

        {/* Terminal window */}
        <motion.div
          ref={ref}
          className={styles.terminal}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Title bar */}
          <div className={styles.terminal__bar}>
            <div className={styles.terminal__dots}>
              <span style={{ background: '#FF5F57' }} />
              <span style={{ background: '#FEBC2E' }} />
              <span style={{ background: '#28C840' }} />
            </div>
            <div className={styles.terminal__title}>
              <Terminal size={13} />
              AgentFlow AI — RAG Query Interface
            </div>
            <div className={styles.terminal__badge}>
              <span className={styles.terminal__badge_dot} />
              Live
            </div>
          </div>

          {/* Chat body */}
          <div className={styles.terminal__body}>
            {/* User message */}
            {phase >= 1 && (
              <motion.div
                className={`${styles.msg} ${styles['msg--user']}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className={styles.msg__avatar} style={{ background: '#FFFFFF' }}>U</div>
                <div className={styles.msg__bubble}>
                  {DEMO_MESSAGES[0].text}
                </div>
              </motion.div>
            )}

            {/* System searching */}
            {phase >= 2 && (
              <motion.div
                className={`${styles.msg} ${styles['msg--system']}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Sparkles size={14} className={styles.msg__system_icon} />
                <span className={styles.msg__system_text}>
                  Searching knowledge base · Found 3 relevant chunks in 47ms
                </span>
                <div className={styles.msg__docs}>
                  {['infra-review-q3.pdf', 'vendor-rfp-2025.pdf', 'q3-budget-approval.pdf'].map(doc => (
                    <span key={doc} className={styles.msg__doc}>
                      <FileText size={11} /> {doc}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* AI Response */}
            {phase >= 3 && (
              <motion.div
                className={`${styles.msg} ${styles['msg--ai']}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className={styles.msg__avatar} style={{ background: 'var(--gradient-primary)' }}>
                  <Sparkles size={13} />
                </div>
                <div className={styles.msg__bubble}>
                  <div className={styles.msg__ai_text}>
                    Based on the <strong>Q3 Infrastructure Review</strong> (infra-review-q3.pdf, p.12):
                    <br /><br />
                    The approved cloud infrastructure budget for Q3 is <strong className={styles.highlight}>$420,000</strong>, allocated across:
                    <ul className={styles.msg__list}>
                      <li>Compute (EC2/VMs): <strong>$180,000</strong></li>
                      <li>Storage & backup: <strong>$95,000</strong></li>
                      <li>Networking & egress: <strong>$145,000</strong></li>
                    </ul>
                    Following the RFP process, <strong className={styles.highlight}>AWS</strong> was selected as primary vendor, with <strong>Cloudflare</strong> for edge networking. Finalized July 2nd, 2025.
                  </div>
                  <div className={styles.msg__sources}>
                    <span className={styles.msg__sources_label}>Sources:</span>
                    {['infra-review-q3.pdf', 'vendor-rfp-2025.pdf'].map(s => (
                      <span key={s} className={styles.msg__source}>{s}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Cursor blink if typing */}
            {phase < 3 && (
              <div className={styles.cursor} />
            )}
          </div>

          {/* Input bar */}
          <div className={styles.terminal__input}>
            <div className={styles.terminal__input_field}>
              Ask anything about your knowledge base...
            </div>
            <div className={styles.terminal__input_send}>
              ↵
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
