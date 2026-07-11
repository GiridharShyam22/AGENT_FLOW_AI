import { motion } from 'framer-motion'
import { Sparkles, ShieldCheck, Database, Cpu, ArrowRight } from 'lucide-react'
import styles from './WelcomeCard.module.css'
import FloatingParticles from '../three/FloatingParticles'

const PROMPTS = [
  { icon: '🔍', text: 'What documents are in the knowledge base?' },
  { icon: '⚡', text: 'Explain how the RAG pipeline works' },
  { icon: '🛡️', text: 'How is my data kept private?' },
  { icon: '📊', text: 'Show retrieval confidence metrics' },
]

const FEATS = [
  { icon: <ShieldCheck size={18} />, title: 'Fully Offline', desc: 'Zero data leaves your network', color: '#FFFFFF' },
  { icon: <Database size={18} />,    title: 'Private KB',    desc: '247 documents indexed',           color: '#FFFFFF' },
  { icon: <Cpu size={18} />,         title: 'RAG Engine',    desc: 'Sub-100ms retrieval',              color: '#A0A0A0' },
]

const STAGGER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const ITEM = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

export default function WelcomeCard({ onSend }) {
  return (
    <div className={styles.welcome}>
      {/* Subtle background particles */}
      <div className={styles.welcome__particles} aria-hidden="true">
        <FloatingParticles count={30} />
      </div>

      {/* Glow */}
      <div className={styles.welcome__glow} aria-hidden="true" />

      <motion.div
        className={styles.welcome__body}
        variants={STAGGER}
        initial="hidden"
        animate="visible"
      >
        {/* Icon + heading */}
        <motion.div className={styles.welcome__top} variants={ITEM}>
          <div className={styles.welcome__icon}>
            <Sparkles size={26} />
          </div>
          <div>
            <h1 className={styles.welcome__title}>
              Welcome to <span className={styles.welcome__title_grad}>AgentFlow AI</span>
            </h1>
            <p className={styles.welcome__subtitle}>
              Your private Enterprise RAG Knowledge Assistant
            </p>
          </div>
        </motion.div>

        {/* Description */}
        <motion.p className={styles.welcome__desc} variants={ITEM}>
          Ask questions in natural language and get precise, citation-backed answers
          from your private knowledge base — powered by <strong>Ollama</strong>,{' '}
          <strong>FastAPI</strong>, and a local <strong>RAG pipeline</strong>.
          Nothing leaves your network.
        </motion.p>

        {/* Feature chips */}
        <motion.div className={styles.welcome__feats} variants={STAGGER}>
          {FEATS.map(f => (
            <motion.div
              key={f.title}
              className={styles.welcome__feat}
              style={{ '--feat-color': f.color }}
              variants={ITEM}
            >
              <span className={styles.welcome__feat_icon}>{f.icon}</span>
              <div>
                <div className={styles.welcome__feat_title}>{f.title}</div>
                <div className={styles.welcome__feat_desc}>{f.desc}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Suggested prompts */}
        <motion.div variants={ITEM}>
          <p className={styles.welcome__prompts_label}>Try asking:</p>
          <div className={styles.welcome__prompts}>
            {PROMPTS.map(p => (
              <button
                key={p.text}
                className={styles.welcome__prompt_btn}
                onClick={() => onSend && onSend(p.text)}
              >
                <span className={styles.welcome__prompt_icon}>{p.icon}</span>
                <span>{p.text}</span>
                <ArrowRight size={13} className={styles.welcome__prompt_arrow} />
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}