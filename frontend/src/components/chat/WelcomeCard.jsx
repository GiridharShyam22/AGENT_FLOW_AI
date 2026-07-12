import { motion } from 'framer-motion'
import { Sparkles, ShieldCheck, Database, Cpu, ArrowRight, Search, Zap, Shield, BarChart2 } from 'lucide-react'
import styles from './WelcomeCard.module.css'
import FloatingParticles from '../three/FloatingParticles'

const PROMPTS = [
  { icon: Search, text: 'What documents are in the knowledge base?', animation: { scale: [0.9, 1.1, 0.9] }, transition: { repeat: Infinity, duration: 2, ease: "easeInOut" } },
  { icon: Zap, text: 'Explain how the RAG pipeline works', animation: { scale: [1, 1.2, 1] }, transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" } },
  { icon: Shield, text: 'How is my data kept private?', animation: { y: [-2, 2, -2] }, transition: { repeat: Infinity, duration: 2.5, ease: "easeInOut" } },
  { icon: BarChart2, text: 'Show retrieval confidence metrics', animation: { opacity: [0.6, 1, 0.6] }, transition: { repeat: Infinity, duration: 2, ease: "easeInOut" } },
]

const FEATS = [
  { icon: <motion.div animate={{ y: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}><ShieldCheck size={18} /></motion.div>, title: 'Fully Offline', desc: 'Zero data leaves your network', color: '#FFFFFF' },
  { icon: <motion.div animate={{ scale: [0.95, 1.05, 0.95] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}><Database size={18} /></motion.div>,    title: 'Private KB',    desc: '247 documents indexed',           color: '#FFFFFF' },
  { icon: <motion.div animate={{ y: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}><Cpu size={18} /></motion.div>,         title: 'RAG Engine',    desc: 'Sub-100ms retrieval',              color: '#A0A0A0' },
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
            <motion.div
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <Sparkles size={26} />
            </motion.div>
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
                <span className={styles.welcome__prompt_icon}>
                  <motion.div animate={p.animation} transition={p.transition} style={{ display: 'flex', alignItems: 'center' }}>
                    <p.icon size={16} />
                  </motion.div>
                </span>
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