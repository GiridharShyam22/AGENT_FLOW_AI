import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  ShieldOff, Database, Search, Zap, Lock, Server
} from 'lucide-react'
import SectionTitle from '../common/SectionTitle'
import GlassCard from '../common/GlassCard'
import styles from './Features.module.css'

const FEATURES = [
  {
    icon: <ShieldOff size={24} />,
    title: 'Autonomous Reasoning',
    description:
      'Agents do not just chat; they think. They plan out multi-step processes and execute them autonomously.',
    color: '#FFFFFF',
    gradient: 'linear-gradient(135deg, rgba(255, 255, 255,0.15), rgba(255, 255, 255,0.03))',
  },
  {
    icon: <Database size={24} />,
    title: 'Long-term Memory',
    description:
      'Give your agents the ability to remember past interactions using vector databases and context sliding windows.',
    color: '#A0A0A0',
    gradient: 'linear-gradient(135deg, rgba(255, 255, 255,0.15), rgba(255, 255, 255,0.03))',
  },
  {
    icon: <Search size={24} />,
    title: 'Tool Calling (Actions)',
    description:
      'Equip your agents with custom tools. Let them browse the web, execute code, or query your APIs natively.',
    color: '#888888',
    gradient: 'linear-gradient(135deg, rgba(255, 255, 255,0.15), rgba(255, 255, 255,0.03))',
  },
  {
    icon: <Zap size={24} />,
    title: 'RAG Integration',
    description:
      'Ground your agent in reality. Use Retrieval-Augmented Generation to eliminate hallucinations and provide cited facts.',
    color: '#FFFFFF',
    gradient: 'linear-gradient(135deg, rgba(255, 255, 255,0.12), rgba(255, 255, 255,0.02))',
  },
  {
    icon: <Lock size={24} />,
    title: 'Multi-Agent Orchestration',
    description:
      'Coordinate swarms of specialized agents. Have a coder agent, a reviewer agent, and a manager agent work together.',
    color: '#FFFFFF',
    gradient: 'linear-gradient(135deg, rgba(255, 255, 255,0.12), rgba(255, 255, 255,0.02))',
  },
  {
    icon: <Server size={24} />,
    title: 'Local & Private',
    description:
      'Build agents entirely offline using Ollama and local embedding models. Ensure complete data privacy and security.',
    color: '#FFFFFF',
    gradient: 'linear-gradient(135deg, rgba(255, 255, 255,0.12), rgba(255, 255, 255,0.02))',
  },
]

const CONTAINER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const ITEM = {
  hidden:  { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function Features() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className={`${styles.section} section`} id="features">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <SectionTitle
            badge="Features"
            title="Everything you need to build Agents"
            subtitle="AgentFlow AI is your ultimate playground for designing, building, and deploying autonomous AI agents."
          />
        </motion.div>

        <motion.div
          ref={ref}
          className={styles.grid}
          variants={CONTAINER}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {FEATURES.map((feat) => (
            <motion.div key={feat.title} variants={ITEM}>
              <div
                className={styles.feature_card}
                style={{ '--feat-color': feat.color, '--feat-gradient': feat.gradient }}
              >
                {/* Background gradient */}
                <div className={styles.feature_card__bg} aria-hidden="true" />

                {/* Icon */}
                <div className={styles.feature_card__icon}>
                  {feat.icon}
                </div>

                {/* Content */}
                <h3 className={styles.feature_card__title}>{feat.title}</h3>
                <p className={styles.feature_card__desc}>{feat.description}</p>

                {/* Bottom accent line */}
                <div className={styles.feature_card__line} aria-hidden="true" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
